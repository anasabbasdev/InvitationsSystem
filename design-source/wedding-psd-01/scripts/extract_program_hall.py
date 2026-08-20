"""Crop the missing program+hall slice and export Layer 13 without a full PSD flatten."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780

Y0 = 10913
Y1 = 13250


def log(msg: str) -> None:
    print(msg, flush=True)


def save_webp(img: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "RGBA" if "A" in img.getbands() else "RGB"
    img.convert(mode).save(path, "WEBP", quality=quality, method=4)
    log(f"  saved {path} {img.size} {path.stat().st_size}")


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


def find_layers(layer, name: str, acc: list) -> None:
    if str(getattr(layer, "name", "")) == name:
        acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            find_layers(child, name, acc)


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_type_layers(layer)
    log(f"hid {hidden} type layers")

    log(f"composite viewport 0,{Y0},{psd.width},{Y1}")
    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        log("empty composite")
        return 1
    if tile.mode != "RGB":
        tile = tile.convert("RGB")
    plate = resize_w(tile, PLATE_W)
    save_webp(plate, PUBLIC / "sections" / "07-program.webp")
    save_webp(plate, ROOT / "extracted" / "plates" / "07-program-reference.webp")
    save_webp(resize_w(tile, 390), ROOT / "reference" / "07-program-reference-no-text.webp")

    for name, slug in (("Layer 13", "program-hall"), ("Layer 13 copy", "program-hall-frame")):
        found: list = []
        for layer in psd:
            find_layers(layer, name, found)
        if not found:
            log(f"missing {name}")
            continue
        img = found[0].composite()
        if img is None:
            log(f"empty {name}")
            continue
        save_webp(img, PUBLIC / "decor" / f"{slug}.webp")
        save_webp(img, ROOT / "extracted" / "decor" / f"{slug}.webp")

    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
