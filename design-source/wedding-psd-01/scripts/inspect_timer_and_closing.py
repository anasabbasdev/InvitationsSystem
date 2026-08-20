"""Inspect countdown timer SO and closing calligraphy; re-export clean chrome."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")

TIMER_NAMES = {
    "create fance countdown timer copy",
    "create fance countdown timer copy 2",
    "create fance countdown timer",
}


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list, depth: int = 0) -> None:
    acc.append((depth, layer))
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc, depth + 1)


def save_webp(img: Image.Image, path: Path, quality: int = 90) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "RGBA" if "A" in img.getbands() else "RGB"
    img.convert(mode).save(path, "WEBP", quality=quality, method=4)
    log(f"  saved {path} {img.size} {img.mode}")


def hide_textish(layer) -> int:
    hidden = 0
    name = str(getattr(layer, "name", ""))
    kind = getattr(layer, "kind", None)
    lowered = name.lower()
    textish = (
        kind == "type"
        or any(
            token in lowered
            for token in (
                "28",
                "04",
                "15",
                "39",
                "digit",
                "number",
                "day",
                "hour",
                "min",
                "sec",
                "celebration",
                "unveiling",
            )
        )
    )
    # Keep labels if they are separate from digits? User asked to keep the full
    # template except numbers. Do NOT hide celebration/unveiling/day labels.
    keep = any(
        token in lowered
        for token in ("celebration", "unveiling", "day", "hour", "min", "sec", "label")
    )
    if kind == "type" and not keep and getattr(layer, "visible", False):
        # Hide type unless it looks like a unit label / header
        txt = ""
        try:
            txt = str(getattr(layer, "text", "") or "")
        except Exception:
            txt = name
        lowered_txt = txt.lower()
        is_label = any(
            token in lowered_txt
            for token in ("day", "hour", "min", "sec", "celebration", "unveiling", "the ")
        )
        is_digit = any(ch.isdigit() for ch in txt) and not is_label
        if is_digit or (not is_label and any(ch.isdigit() for ch in name)):
            layer.visible = False
            hidden += 1
            log(f"    hid type {name!r} txt={txt[:40]!r}")
        elif not is_label and kind == "type" and len(txt.strip()) <= 4 and any(ch.isdigit() for ch in txt):
            layer.visible = False
            hidden += 1
            log(f"    hid short digit type {name!r}")
    if textish and not keep and kind != "type" and kind != "group" and getattr(layer, "visible", False):
        if any(token in lowered for token in ("28", "04", "15", "39", "digit", "number")):
            layer.visible = False
            hidden += 1
            log(f"    hid raster {kind} {name}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_textish(child)
    return hidden


def inspect_and_export_timer(psd: PSDImage) -> None:
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for depth, layer in layers:
        if str(getattr(layer, "name", "")) not in TIMER_NAMES:
            continue
        log(f"TIMER {layer.name} vis={layer.visible} bbox={layer.bbox}")
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        try:
            with so.open() as handle:
                data = handle.read()
            inner = PSDImage.open(BytesIO(data))
        except Exception as exc:
            log(f"  open failed: {exc}")
            continue
        inner_layers: list = []
        for child in inner:
            walk(child, inner_layers)
        for d, child in inner_layers:
            name = str(getattr(child, "name", ""))
            kind = getattr(child, "kind", None)
            txt = ""
            if kind == "type":
                try:
                    txt = str(getattr(child, "text", "") or "")[:80]
                except Exception:
                    txt = ""
            log(f"  {'  '*d}{kind} {name} vis={getattr(child,'visible',None)} box={getattr(child,'bbox',None)} {txt}")
        hide_textish(inner)
        try:
            clean = inner.composite(ignore_preview=True)
            if clean is not None:
                save_webp(clean, PUBLIC / "decor" / "countdown-timer.webp")
                save_webp(clean, ROOT / "extracted" / "decor" / "countdown-timer.webp")
        except Exception as exc:
            log(f"  composite failed: {exc}")


def inspect_closing(psd: PSDImage) -> None:
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for depth, layer in layers:
        name = str(getattr(layer, "name", ""))
        if name not in {"Layer 25", "8"} and "thank" not in name.lower() and "shukr" not in name.lower():
            if name != "Layer 25":
                continue
        log(f"CLOSE {name} kind={getattr(layer,'kind',None)} vis={layer.visible} bbox={layer.bbox}")
        if name != "Layer 25":
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        try:
            with so.open() as handle:
                data = handle.read()
            inner = PSDImage.open(BytesIO(data))
        except Exception as exc:
            log(f"  open failed: {exc}")
            continue
        inner_layers: list = []
        for child in inner:
            walk(child, inner_layers)
        for d, child in inner_layers:
            log(
                f"  {'  '*d}{getattr(child,'kind',None)} {getattr(child,'name',None)} "
                f"vis={getattr(child,'visible',None)} box={getattr(child,'bbox',None)}"
            )
        try:
            art = inner.composite(ignore_preview=True)
            if art is not None:
                save_webp(art, PUBLIC / "decor" / "closing-thanks.webp")
                save_webp(art, ROOT / "extracted" / "decor" / "closing-thanks.webp")
        except Exception as exc:
            log(f"  composite failed: {exc}")


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    inspect_and_export_timer(psd)
    inspect_closing(psd)
    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
