"""Rebuild details: white torn frame around the beige photo, icons without a box."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PAPER_SRC = ROOT / "extracted" / "decor" / "source" / "details-torn-paper-src.png"
ICONS_SRC = ROOT / "extracted" / "decor" / "layer-10.png"
PLATE_W = 780
Y0, Y1 = 8500, 9469
PSD_W = 1540

MERGED = {"Layer 2 (merged)", "Layer 2", "Layer 15"}
TIMER = {
    "create fance countdown timer copy",
    "create fance countdown timer copy 2",
    "create fance countdown timer",
}


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def hide_for_export(layer) -> int:
    hidden = 0
    name = str(getattr(layer, "name", ""))
    kind = getattr(layer, "kind", None)
    box = getattr(layer, "bbox", None)
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name in TIMER and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if name in {"Layer 9", "Layer 10"} and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log(f"hid {name}")
    if name in MERGED and kind in {"pixel", "smartobject"} and getattr(layer, "visible", False):
        width = int(box[2] - box[0]) if box else 0
        if width >= 1500:
            layer.visible = False
            hidden += 1
    if name.startswith("Vector Smart Object") and box is not None:
        x1, y1, x2, y2 = (int(v) for v in box)
        if 8900 <= y1 <= 9000 and (x2 - x1) > 1400 and getattr(layer, "visible", False):
            layer.visible = False
            hidden += 1
            log(f"hid paper VSO {box}")
    if name == "Flower" and box is not None and int(box[0]) > 800 and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_for_export(child)
    return hidden


def key_paper_white(im: Image.Image) -> Image.Image:
    """Use the torn silhouette only. Fill it with paper-white — no black fringe."""
    im = im.convert("RGBA")
    pix = list(im.getdata())
    alpha = []
    white = (255, 253, 249)
    for r, g, b, _a in pix:
        lum = (r + g + b) / 3
        if lum <= 14:
            alpha.append(0)
        elif lum < 70:
            alpha.append(int(round((lum - 14) * 255 / 56)))
        else:
            alpha.append(255)
    out = Image.new("RGBA", im.size, white)
    out.putalpha(Image.frombytes("L", im.size, bytes(alpha)))
    return out


def key_icon_plate(im: Image.Image) -> Image.Image:
    """Drop white backing and dark cutout fringe; keep metal and gem pixels."""
    im = im.convert("RGBA")
    pix = list(im.getdata())
    out = []
    for r, g, b, a in pix:
        if a < 12:
            out.append((r, g, b, 0))
            continue
        lum = (r + g + b) / 3
        sat = max(r, g, b) - min(r, g, b)
        if lum >= 246 and sat <= 12:
            out.append((r, g, b, 0))
        elif lum <= 38 and sat <= 18:
            out.append((r, g, b, 0))
        else:
            out.append((r, g, b, a))
    im.putdata(out)
    return im


def save_webp(img: Image.Image, path: Path, quality: int = 90) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=4)
    log(f"saved {path} {img.size}")


def resize_w(img: Image.Image, width: int) -> Image.Image:
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    hidden = 0
    for layer in psd:
        hidden += hide_for_export(layer)
    log(f"hidden {hidden}")

    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("details composite failed")
    base = tile.convert("RGBA")

    paper = key_paper_white(Image.open(PAPER_SRC))
    # Wide white frame: full bleed, covers icon row down to the beige photo
    px, py, pw, ph = -80, 400, 1700, 460
    paper_fit = paper.resize((pw, ph), Image.Resampling.LANCZOS)
    framed = Image.new("RGBA", base.size, (0, 0, 0, 0))
    framed.paste(paper_fit, (px, py), paper_fit)
    out = base.copy()
    out.alpha_composite(framed)

    icons = key_icon_plate(Image.open(ICONS_SRC))
    ix1, iy1, ix2, iy2 = 494, 8913, 1022, 9017
    icons_fit = icons.resize((ix2 - ix1, iy2 - iy1), Image.Resampling.LANCZOS)
    out.alpha_composite(icons_fit, (ix1, iy1 - Y0))

    plate = resize_w(out, PLATE_W)
    save_webp(plate, PUBLIC / "sections" / "05-details.webp")
    save_webp(plate, ROOT / "extracted" / "plates" / "05-details.webp")
    plate.convert("RGB").save(ROOT / "extracted" / "plates" / "05-details-preview.jpg", quality=92)
    save_webp(resize_w(paper, 1024), PUBLIC / "decor" / "details-torn-paper.webp")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
