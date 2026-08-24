"""Re-export notes (+ location top) with static curtain layers hidden."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780
CURTAIN_NAMES = {
    "2 sides luxury curtians left and right",
    "Layer 19",
    "Layer 19 copy",
}
SECTIONS = (
    ("08-notes", 13250, 14601),
    ("09-location", 14601, 16085),
)


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def hide_for_notes(layer) -> int:
    hidden = 0
    name = str(getattr(layer, "name", ""))
    kind = getattr(layer, "kind", None)
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name in CURTAIN_NAMES and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log(f"hid {name} {getattr(layer, 'bbox', None)}")
    if name in {"Layer 2 (merged)", "Layer 15"} and kind in {"pixel", "smartobject"}:
        box = layer.bbox
        if int(box[2] - box[0]) >= 1500 and getattr(layer, "visible", False):
            layer.visible = False
            hidden += 1
            log(f"hid merged {name}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_for_notes(child)
    return hidden


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_for_notes(layer)
    log(f"hidden {hidden}")

    for slug, y0, y1 in SECTIONS:
        tile = psd.composite(viewport=(0, y0, int(psd.width), y1), ignore_preview=True)
        if tile is None:
            raise SystemExit(f"{slug} composite failed")
        tile = tile.convert("RGB")
        h = max(1, round(tile.height * (PLATE_W / tile.width)))
        plate = tile.resize((PLATE_W, h), Image.Resampling.LANCZOS)
        dests = [
            PUBLIC / "sections" / f"{slug}.webp",
            ROOT / "extracted" / "plates" / f"{slug}.webp",
            ROOT / "extracted" / "plates" / f"{slug}-reference.webp",
        ]
        for dest in dests:
            dest.parent.mkdir(parents=True, exist_ok=True)
            plate.save(dest, "WEBP", quality=86, method=4)
            log(f"saved {dest} {plate.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
