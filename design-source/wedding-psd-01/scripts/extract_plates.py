"""Re-composite decoration plates with type layers hidden. Requires psd-tools[composite]."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "reference"
PLATES = ROOT / "extracted" / "plates"
DECOR = ROOT / "extracted" / "decor"
MANIFEST = ROOT / "manifest"
STRIP_H = 2500
PREVIEW_W = 390
PLATE_W = 780

SECTIONS = json.loads((MANIFEST / "sections.json").read_text(encoding="utf-8"))["sections"]


def log(msg: str) -> None:
    print(msg, flush=True)


def save_webp(img: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "RGBA" if "A" in img.getbands() else "RGB"
    img.convert(mode).save(path, "WEBP", quality=quality, method=4)
    log(f"  saved {path.name} {img.size} {path.stat().st_size} bytes")


def resize_w(img: Image.Image, width: int) -> Image.Image:
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def hide_type_layers(layer) -> int:
    hidden = 0
    if getattr(layer, "kind", None) == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_type_layers(child)
    return hidden


def composite_strips(psd: PSDImage, width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), (245, 240, 230))
    y = 0
    while y < height:
        y2 = min(height, y + STRIP_H)
        log(f"  compositing strip {y}:{y2} ...")
        tile = psd.composite(viewport=(0, y, width, y2), ignore_preview=True)
        if tile is None:
            y = y2
            continue
        if tile.mode != "RGB":
            tile = tile.convert("RGB")
        canvas.paste(tile, (0, y))
        y = y2
    return canvas


def find_layer(layer, name: str, acc: list) -> None:
    if str(getattr(layer, "name", "")) == name:
        acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            find_layer(child, name, acc)


def export_layer(psd: PSDImage, name: str, slug: str) -> None:
    found: list = []
    for layer in psd:
        find_layer(layer, name, found)
    if not found:
        log(f"  missing {name}")
        return
    layer = found[0]
    try:
        img = layer.composite()
    except Exception as exc:
        log(f"  fail {name}: {exc}")
        return
    if img is None:
        return
    save_webp(img, DECOR / f"{slug}.webp", quality=88)


def main() -> int:
    PLATES.mkdir(parents=True, exist_ok=True)
    DECOR.mkdir(parents=True, exist_ok=True)
    log("Opening PSD ...")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_type_layers(layer)
    log(f"hid {hidden} type layers")
    width, height = int(psd.width), int(psd.height)
    full = composite_strips(psd, width, height)
    save_webp(resize_w(full, PREVIEW_W), REF / "full-preview-no-text.webp", quality=82)
    for sec in SECTIONS:
        y = max(0, int(sec["y"]))
        y2 = min(full.height, y + int(sec["height"]))
        crop = full.crop((0, y, full.width, y2))
        save_webp(resize_w(crop, PREVIEW_W), REF / f"{sec['id']}-no-text.webp", quality=84)
        save_webp(resize_w(crop, PLATE_W), PLATES / f"{sec['id']}.webp", quality=86)
    export_layer(psd, "Layer 25", "closing-bouquet")
    log("plates done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
