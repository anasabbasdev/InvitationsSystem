"""Export RSVP card without baked form chrome (fields + submit button)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01\sections")
PLATE_W = 780
Y0 = 16085
HEIGHT = 1741

CHROME_PREFIXES = (
    "Rectangle 3",
    "Rectangle 4",
    "Triangle 1",
)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def main() -> int:
    print(f"Opening {PSD_PATH}", flush=True)
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
    for layer in psd:
        walk(layer, layers)

    hidden = 0
    for layer in layers:
        name = str(getattr(layer, "name", ""))
        kind = getattr(layer, "kind", None)
        box = getattr(layer, "bbox", None)
        y = int(box[1]) if box else -1
        in_rsvp = 16000 <= y <= 17850
        if kind == "type" and getattr(layer, "visible", False) and in_rsvp:
            layer.visible = False
            hidden += 1
            print(f"  hid type {name.encode('ascii', 'replace').decode()}", flush=True)
        if in_rsvp and any(name.startswith(prefix) for prefix in CHROME_PREFIXES):
            if getattr(layer, "visible", False):
                layer.visible = False
                hidden += 1
                print(f"  hid chrome {kind} {name} {box}", flush=True)

    print(f"hid {hidden} layers", flush=True)
    y1 = Y0 + HEIGHT
    tile = psd.composite(viewport=(0, Y0, int(psd.width), y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("composite failed")
    tile = tile.convert("RGB")
    h = max(1, round(tile.height * (PLATE_W / tile.width)))
    plate = tile.resize((PLATE_W, h), Image.Resampling.LANCZOS)
    out = PUBLIC / "10-rsvp-success.webp"
    plate.save(out, "WEBP", quality=86, method=4)
    print(f"saved {out} {plate.size} {out.stat().st_size}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
