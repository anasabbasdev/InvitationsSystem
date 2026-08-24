"""Re-export the countdown plate with the right-side Flower leaves hidden."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780
Y0 = 6400
Y1 = 8500
TIMER_NAMES = {
    "create fance countdown timer copy",
    "create fance countdown timer copy 2",
    "create fance countdown timer",
}


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def hide_for_countdown(layer) -> int:
    hidden = 0
    name = str(getattr(layer, "name", ""))
    kind = getattr(layer, "kind", None)
    box = getattr(layer, "bbox", None)
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name in TIMER_NAMES and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log(f"hid timer {name}")
    if name == "Flower" and box is not None and int(box[0]) > 800 and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log(f"hid right Flower {box}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_for_countdown(child)
    return hidden


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_for_countdown(layer)
    log(f"hidden {hidden}")

    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("countdown composite failed")
    tile = tile.convert("RGB")
    h = max(1, round(tile.height * (PLATE_W / tile.width)))
    plate = tile.resize((PLATE_W, h), Image.Resampling.LANCZOS)
    dests = [
        PUBLIC / "sections" / "04-countdown.webp",
        ROOT / "extracted" / "plates" / "04-countdown.webp",
        ROOT / "extracted" / "plates" / "04-countdown-reference.webp",
    ]
    for dest in dests:
        dest.parent.mkdir(parents=True, exist_ok=True)
        plate.save(dest, "WEBP", quality=86, method=4)
        log(f"saved {dest} {plate.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
