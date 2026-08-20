"""Restore original timer chrome; bake PSD thanks onto the closing plate."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
OUT = ROOT / "extracted" / "decor"
PLATE_W = 780
CLOSE_Y0 = 17826
CLOSE_Y1 = 20000
THANKS_BOX = (524, 17826, 1016, 18354)


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def save_webp(img: Image.Image, *paths: Path, quality: int = 94) -> None:
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "WEBP", quality=quality, method=4)
        log(f"saved {path.name} {img.size} {img.mode}")


def restore_timer(psd: PSDImage) -> None:
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for layer in layers:
        if str(getattr(layer, "name", "")) != "create fance countdown timer copy":
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        with so.open() as handle:
            inner = PSDImage.open(BytesIO(handle.read()))
        art = inner.composite(ignore_preview=True)
        if art is None:
            raise SystemExit("timer composite failed")
        art = art.convert("RGBA")
        save_webp(art, PUBLIC / "decor" / "countdown-timer.webp", OUT / "countdown-timer.webp")
        return
    raise SystemExit("timer copy not found")


def hide_type_keep_thanks(layer) -> int:
    hidden = 0
    kind = getattr(layer, "kind", None)
    name = str(getattr(layer, "name", ""))
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name in {"Layer 2 (merged)", "Layer 15"} and kind in {"pixel", "smartobject"}:
        box = layer.bbox
        if int(box[2] - box[0]) >= 1500 and getattr(layer, "visible", False):
            layer.visible = False
            hidden += 1
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_type_keep_thanks(child)
    return hidden


def bake_thanks(psd: PSDImage) -> None:
    hidden = 0
    for layer in psd:
        hidden += hide_type_keep_thanks(layer)
    log(f"hid {hidden} type/merged for closing")

    layers: list = []
    for layer in psd:
        walk(layer, layers)
    thanks_layer = next((l for l in layers if str(getattr(l, "name", "")) == "Layer 25"), None)
    if thanks_layer is None:
        raise SystemExit("Layer 25 missing")
    log(f"Layer 25 blend={getattr(thanks_layer, 'blend_mode', None)} box={thanks_layer.bbox}")

    # Marble plate without the black-boxed SO
    thanks_layer.visible = False
    marble = psd.composite(viewport=(0, CLOSE_Y0, int(psd.width), CLOSE_Y1), ignore_preview=True)
    if marble is None:
        raise SystemExit("closing marble failed")
    marble = marble.convert("RGB")

    # Isolated calligraphy from the smart object
    so = getattr(thanks_layer, "smart_object", None)
    if so is None:
        raise SystemExit("Layer 25 has no SO")
    with so.open() as handle:
        inner = PSDImage.open(BytesIO(handle.read()))
    raw = inner.composite(ignore_preview=True)
    if raw is None:
        raise SystemExit("thanks SO failed")
    raw = raw.convert("RGBA")

    x0, y0, x1, y1 = THANKS_BOX
    dest = (x0, y0 - CLOSE_Y0, x1, y1 - CLOSE_Y0)
    box_w, box_h = dest[2] - dest[0], dest[3] - dest[1]
    placed = raw.resize((box_w, box_h), Image.Resampling.LANCZOS)

    # Soft bronze drop-shadow matching the PSD look on marble
    alpha = placed.split()[3]
    shadow_mask = alpha.filter(ImageFilter.GaussianBlur(6))
    shadow = Image.new("RGBA", placed.size, (0, 0, 0, 0))
    shadow.paste(Image.new("RGBA", placed.size, (72, 48, 24, 150)), mask=shadow_mask)
    shadow = ImageChops.offset(shadow, 4, 7)

    marble_rgba = marble.convert("RGBA")
    marble_rgba.alpha_composite(shadow, (dest[0], dest[1]))
    marble_rgba.alpha_composite(placed, (dest[0], dest[1]))
    marble = marble_rgba.convert("RGB")

    h = max(1, round(marble.height * (PLATE_W / marble.width)))
    plate = marble.resize((PLATE_W, h), Image.Resampling.LANCZOS)
    save_webp(plate, PUBLIC / "sections" / "11-closing.webp", ROOT / "extracted" / "plates" / "11-closing.webp", quality=92)
    save_webp(placed, PUBLIC / "decor" / "closing-thanks.webp", OUT / "closing-thanks.webp")


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    bake_thanks(psd)
    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
