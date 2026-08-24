"""Extract the tall column-wall smart object for the details viewport."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
Y0, Y1 = 8500, 9469
PLATE_W = 780


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
    for layer in psd:
        walk(layer, layers)

    wall = None
    for layer in layers:
        name = str(getattr(layer, "name", ""))
        box = getattr(layer, "bbox", None)
        if name != "Vector Smart Object" or box is None:
            continue
        x1, y1, x2, y2 = (int(v) for v in box)
        if y1 == 1218 and (y2 - y1) > 8000:
            wall = layer
            log(f"wall {box}")
            break
    if wall is None:
        raise SystemExit("wall VSO not found")

    art = wall.composite()
    if art is None:
        raise SystemExit("wall composite empty")
    log(f"wall art {art.size} {art.mode}")
    art = art.convert("RGBA")
    x1, y1, x2, y2 = (int(v) for v in wall.bbox)
    # crop the details band in canvas space
    src_x0 = max(0, 0 - x1)
    src_y0 = max(0, Y0 - y1)
    src_x1 = min(art.width, 1540 - x1)
    src_y1 = min(art.height, Y1 - y1)
    crop = art.crop((src_x0, src_y0, src_x1, src_y1))
    log(f"crop {crop.size}")
    h = max(1, round(crop.height * (PLATE_W / crop.width)))
    plate = crop.resize((PLATE_W, h), Image.Resampling.LANCZOS)
    dests = [
        PUBLIC / "decor" / "details-column-wall-psd.webp",
        ROOT / "extracted" / "decor" / "details-column-wall-psd.webp",
    ]
    for dest in dests:
        dest.parent.mkdir(parents=True, exist_ok=True)
        plate.save(dest, "WEBP", quality=90, method=4)
        log(f"saved {dest} {plate.size}")
    plate.convert("RGB").save(ROOT / "extracted" / "plates" / "details-wall-psd-preview.jpg", quality=88)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
