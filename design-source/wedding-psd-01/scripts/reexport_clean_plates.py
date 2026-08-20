"""Re-export invitation plates with type + flattened-text rasters hidden."""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780

SECTIONS = json.loads((ROOT / "manifest" / "sections.json").read_text(encoding="utf-8"))["sections"]

MERGED_RASTER_NAMES = {
    "Layer 2 (merged)",
    "Layer 2",
    "Layer 15",
}

TIMER_NAMES = {
    "create fance countdown timer copy",
    "create fance countdown timer copy 2",
    "create fance countdown timer",
}


def log(msg: str) -> None:
    print(msg, flush=True)


def save_webp(img: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "RGBA" if "A" in img.getbands() else "RGB"
    img.convert(mode).save(path, "WEBP", quality=quality, method=4)
    log(f"  saved {path.name} {img.size} {path.stat().st_size}")


def resize_w(img: Image.Image, width: int) -> Image.Image:
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def hide_type(layer) -> int:
    hidden = 0
    if getattr(layer, "kind", None) == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_type(child)
    return hidden


def hide_merged_rasters(layer) -> int:
    hidden = 0
    name = str(getattr(layer, "name", ""))
    kind = getattr(layer, "kind", None)
    if name in MERGED_RASTER_NAMES and kind in {"pixel", "smartobject"} and getattr(layer, "visible", False):
        box = layer.bbox
        width = int(box[2] - box[0])
        if width >= 1500:
            layer.visible = False
            hidden += 1
            log(f"  hid merged raster {name} {box}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_merged_rasters(child)
    return hidden


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def hide_timer_digits(psd: PSDImage) -> int:
    """Open countdown smart objects and hide type / digit-like layers, then replace visibility."""
    hidden = 0
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for layer in layers:
        if str(getattr(layer, "name", "")) not in TIMER_NAMES:
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        try:
            with so.open() as handle:
                data = handle.read()
            inner = PSDImage.open(BytesIO(data))
        except Exception as exc:
            log(f"  timer SO open failed {layer.name}: {exc}")
            continue
        log(f"  timer SO {layer.name} layers:")
        inner_layers: list = []
        for child in inner:
            walk(child, inner_layers)
        for child in inner_layers:
            name = str(getattr(child, "name", ""))
            kind = getattr(child, "kind", None)
            log(f"    {kind} {name} vis={getattr(child, 'visible', None)}")
            if kind == "type" and getattr(child, "visible", False):
                child.visible = False
                hidden += 1
            lowered = name.lower()
            if any(token in lowered for token in ("28", "04", "15", "39", "digit", "number", "day", "hour", "min", "sec")):
                if getattr(child, "visible", False) and kind != "group":
                    child.visible = False
                    hidden += 1
                    log(f"    hid digit-like {name}")
        try:
            clean = inner.composite(ignore_preview=True)
            if clean is not None:
                out = PUBLIC / "decor" / "countdown-timer.webp"
                save_webp(clean, out, quality=90)
                save_webp(clean, ROOT / "extracted" / "decor" / "countdown-timer.webp", quality=90)
        except Exception as exc:
            log(f"  timer composite failed: {exc}")
    return hidden


def composite_range(psd: PSDImage, y0: int, y1: int) -> Image.Image:
    tile = psd.composite(viewport=(0, y0, int(psd.width), y1), ignore_preview=True)
    if tile is None:
        tile = Image.new("RGB", (int(psd.width), y1 - y0), (243, 237, 227))
    if tile.mode != "RGB":
        tile = tile.convert("RGB")
    return tile


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_type(layer)
        hidden += hide_merged_rasters(layer)
    log(f"hid {hidden} type/merged layers")
    hide_timer_digits(psd)
    # Keep countdown chrome off the section plate so live digits never collide
    # with baked numbers. The isolated timer asset is overlaid separately.
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for layer in layers:
        if str(getattr(layer, "name", "")) in TIMER_NAMES and getattr(layer, "visible", False):
            layer.visible = False
            log(f"  hid timer layer from plate: {layer.name}")

    for sec in SECTIONS:
        y0 = max(0, int(sec["y"]))
        y1 = min(int(psd.height), y0 + int(sec["height"]))
        log(f"composite {sec['id']} {y0}:{y1}")
        tile = composite_range(psd, y0, y1)
        plate = resize_w(tile, PLATE_W)
        slug = sec["id"].replace("-reference", "")
        save_webp(plate, PUBLIC / "sections" / f"{slug}.webp")
        save_webp(plate, ROOT / "extracted" / "plates" / f"{sec['id']}.webp")

    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
