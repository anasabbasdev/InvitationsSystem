"""Re-export closing plate without Layer 25 (black-boxed calligraphy), plus transparent thanks."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780
Y0 = 17826
Y1 = 20000


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def hide_type_and_thanks(layer) -> int:
    hidden = 0
    kind = getattr(layer, "kind", None)
    name = str(getattr(layer, "name", ""))
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name == "Layer 25" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log("hid Layer 25")
    if name in {"Layer 2 (merged)", "Layer 15"} and kind in {"pixel", "smartobject"}:
        box = layer.bbox
        if int(box[2] - box[0]) >= 1500 and getattr(layer, "visible", False):
            layer.visible = False
            hidden += 1
            log(f"hid merged {name}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_type_and_thanks(child)
    return hidden


def make_white_on_transparent(src: Path, dest_public: Path, dest_extracted: Path) -> None:
    img = Image.open(src).convert("RGBA")
    pixels = list(img.getdata())
    out = []
    for r, g, b, _a in pixels:
        lum = (r + g + b) / 3
        alpha = int(min(255, max(0, (lum - 18) * 1.15)))
        out.append((255, 255, 255, alpha))
    img.putdata(out)
    dest_public.parent.mkdir(parents=True, exist_ok=True)
    dest_extracted.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest_public, "WEBP", quality=92, method=4)
    img.save(dest_extracted, "WEBP", quality=92, method=4)
    log(f"thanks alpha {img.size}")


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_type_and_thanks(layer)
    log(f"hidden {hidden}")

    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("closing composite failed")
    tile = tile.convert("RGB")
    h = max(1, round(tile.height * (PLATE_W / tile.width)))
    plate = tile.resize((PLATE_W, h), Image.Resampling.LANCZOS)
    plate.save(PUBLIC / "sections" / "11-closing.webp", "WEBP", quality=86, method=4)
    plate.save(ROOT / "extracted" / "plates" / "11-closing-reference.webp", "WEBP", quality=86, method=4)
    log(f"closing plate {plate.size}")

    thanks_src = PUBLIC / "decor" / "closing-thanks.webp"
    if thanks_src.exists():
        make_white_on_transparent(
            thanks_src,
            PUBLIC / "decor" / "closing-thanks.webp",
            ROOT / "extracted" / "decor" / "closing-thanks.webp",
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
