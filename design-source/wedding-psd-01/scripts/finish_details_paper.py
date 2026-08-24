"""Hide broken paper smart-objects, then lay the designer paper with a clean edge."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PAPER_SRC = ROOT / "extracted" / "decor" / "source" / "details-torn-paper-src.png"
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
    if name in MERGED and kind in {"pixel", "smartobject"} and getattr(layer, "visible", False):
        width = int(box[2] - box[0]) if box else 0
        if width >= 1500:
            layer.visible = False
            hidden += 1
    # Hide details torn-paper vector smart objects — psd-tools rasters them as white junk.
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


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def key_paper(im: Image.Image) -> Image.Image:
    """Black is empty. Recolor dark fringe to paper cream so edges stay clean."""
    im = im.convert("RGBA")
    pix = list(im.getdata())
    out = []
    paper = (242, 229, 221)
    for r, g, b, _a in pix:
        lum = (r + g + b) / 3
        if lum <= 18:
            out.append((*paper, 0))
        elif lum < 90:
            t = (lum - 18) / 72
            alpha = int(round(t * 255))
            out.append((*paper, alpha))
        else:
            out.append((r, g, b, 255))
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

    layers: list = []
    for layer in psd:
        walk(layer, layers)
    icons = []
    for layer in layers:
        name = str(getattr(layer, "name", ""))
        if name in {"Layer 9", "Layer 10"}:
            art = layer.composite()
            if art is None:
                continue
            icons.append((name, layer.bbox, art.convert("RGBA")))
            log(f"icon {name} {layer.bbox} {art.size}")

    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("details composite failed")
    base = tile.convert("RGBA")

    paper = key_paper(Image.open(PAPER_SRC))
    # PSD placed size of the main paper VSO
    px, py, pw, ph = -47, 8951 - Y0, 1635, 365
    paper_fit = paper.resize((pw, ph), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", base.size, (0, 0, 0, 0))
    canvas.paste(paper_fit, (px, py), paper_fit)
    # paper under icons: base already has icons; put paper first then base on top
    # but then paper is hidden where base is opaque cream. Use paper over cream only:
    out = base.copy()
    out.alpha_composite(canvas)

    # restore icons on top so paper never covers them
    for name, box, art in icons:
        x1, y1, x2, y2 = (int(v) for v in box)
        placed = art.resize((x2 - x1, y2 - y1), Image.Resampling.LANCZOS)
        out.alpha_composite(placed, (x1, y1 - Y0))

    plate = resize_w(out, PLATE_W)
    save_webp(plate, PUBLIC / "sections" / "05-details.webp")
    save_webp(plate, ROOT / "extracted" / "plates" / "05-details.webp")
    plate.convert("RGB").save(ROOT / "extracted" / "plates" / "05-details-preview.jpg", quality=92)
    save_webp(resize_w(paper, 1024), PUBLIC / "decor" / "details-torn-paper.webp")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
