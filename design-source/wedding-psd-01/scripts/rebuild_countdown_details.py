"""Rebuild countdown + details from one PSD composite so the seam matches.

Hides type and the full-width flattened rasters that turn torn paper white
and dirty. Timer chrome and the right Flower stay hidden (live overlays).
"""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
PLATE_W = 780
Y0, CUT, Y1 = 6400, 8500, 9469

MERGED = {"Layer 2 (merged)", "Layer 2", "Layer 15"}
TIMER = {
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
        log(f"hid timer {name}")
    if name in MERGED and kind in {"pixel", "smartobject"} and getattr(layer, "visible", False):
        width = int(box[2] - box[0]) if box else 0
        if width >= 1500:
            layer.visible = False
            hidden += 1
            log(f"hid merged {name} {box}")
    if name == "Flower" and box is not None and int(box[0]) > 800 and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
        log(f"hid flower {box}")
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_for_export(child)
    return hidden


def save_webp(img: Image.Image, path: Path, quality: int = 90) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=4)
    log(f"saved {path} {img.size} {path.stat().st_size}")


def resize_w(img: Image.Image, width: int) -> Image.Image:
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def export_inner_so(layer, slug: str) -> None:
    so = getattr(layer, "smart_object", None)
    if so is None:
        return
    try:
        with so.open() as handle:
            inner = PSDImage.open(BytesIO(handle.read()))
        art = inner.composite(ignore_preview=True)
    except Exception as exc:
        log(f"so fail {slug}: {exc}")
        return
    if art is None:
        return
    dest = ROOT / "extracted" / "decor" / f"{slug}.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    art.save(dest)
    log(f"inner so {slug} {art.size} {art.mode} {layer.bbox}")


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
    for layer in psd:
        walk(layer, layers)

    for layer in layers:
        name = str(getattr(layer, "name", ""))
        box = getattr(layer, "bbox", None)
        if name != "Vector Smart Object" or box is None:
            continue
        x1, y1, x2, y2 = (int(v) for v in box)
        if y1 == 1218 and (y2 - y1) > 8000:
            export_inner_so(layer, "details-wall-inner")
        if 8900 <= y1 <= 9000 and (x2 - x1) > 1500:
            export_inner_so(layer, f"details-paper-{y1}-{y2 - y1}")

    hidden = 0
    for layer in psd:
        hidden += hide_for_export(layer)
    log(f"hidden {hidden}")

    log(f"composite {Y0}:{Y1}")
    tile = psd.composite(viewport=(0, Y0, int(psd.width), Y1), ignore_preview=True)
    if tile is None:
        raise SystemExit("composite failed")
    tile = tile.convert("RGB")
    countdown = tile.crop((0, 0, tile.width, CUT - Y0))
    details = tile.crop((0, CUT - Y0, tile.width, Y1 - Y0))
    seam = tile.crop((0, 8200 - Y0, tile.width, 8700 - Y0))

    for slug, img in (("04-countdown", countdown), ("05-details", details)):
        plate = resize_w(img, PLATE_W)
        save_webp(plate, PUBLIC / "sections" / f"{slug}.webp")
        save_webp(plate, ROOT / "extracted" / "plates" / f"{slug}.webp")
        plate.convert("RGB").save(ROOT / "extracted" / "plates" / f"{slug}-preview.jpg", quality=90)

    seam_p = resize_w(seam, PLATE_W)
    seam_p.convert("RGB").save(ROOT / "extracted" / "plates" / "countdown-details-seam.jpg", quality=90)
    log(f"seam preview {seam_p.size}")

    mid_y = details.height // 2
    print("details mid", details.getpixel((details.width // 2, mid_y)))
    print("details top", details.getpixel((details.width // 2, 8)))
    print("countdown bot", countdown.getpixel((countdown.width // 2, countdown.height - 8)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
