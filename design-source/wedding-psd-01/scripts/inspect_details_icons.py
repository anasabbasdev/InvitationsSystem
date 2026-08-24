"""Inspect Layer 9 / Layer 10 so we can keep icons and drop their backing."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
OUT = Path(__file__).resolve().parents[1] / "extracted" / "decor"


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def main() -> int:
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    OUT.mkdir(parents=True, exist_ok=True)
    for layer in layers:
        name = str(getattr(layer, "name", ""))
        if name not in {"Layer 9", "Layer 10"}:
            continue
        art = layer.composite()
        if art is None:
            continue
        art = art.convert("RGBA")
        dest = OUT / f"{name.replace(' ', '-').lower()}.png"
        art.save(dest)
        print(name, layer.bbox, art.size, art.mode, dest)
        # sample a grid
        w, h = art.size
        for y in (2, h // 2, h - 3):
            row = [art.getpixel((x, y))[:3] for x in (2, w // 4, w // 2, 3 * w // 4, w - 3)]
            print(" ", y, row)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
