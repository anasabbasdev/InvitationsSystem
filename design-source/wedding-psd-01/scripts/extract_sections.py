"""
Composite the PSD in vertical strips (memory-conscious), then:
- stitch a full preview at 390px wide
- crop section references
- optionally hide type layers and export decoration plates
- export selected smart-object / group composites
"""
from __future__ import annotations

import json
import sys
import traceback
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "reference"
EXTRACTED = ROOT / "extracted"
PLATES = EXTRACTED / "plates"
DECOR = EXTRACTED / "decor"
PHOTOS = EXTRACTED / "photos"
MANIFEST = ROOT / "manifest"

STRIP_H = 2500
PREVIEW_W = 390
PLATE_W = 780

SECTIONS = json.loads((MANIFEST / "sections.json").read_text(encoding="utf-8"))["sections"]

TARGET_LAYERS = [
    ("countdown-timer", "create fance countdown timer copy"),
    ("golden-rings", "add 2 golden rings top view"),
    ("closing-bouquet", "Layer 25"),
    ("gallery-tape-1", "Tape 1"),
    ("gallery-tape-2a", "Tape 2a"),
    ("gallery-tape-2b", "Tape 2b"),
    ("gallery-tape-3", "Tape 3"),
    ("luxury-curtains", "2 sides luxury curtians left and right"),
]


def log(msg: str) -> None:
    print(msg, flush=True)


def ensure_dirs() -> None:
    for p in (REF, EXTRACTED, PLATES, DECOR, PHOTOS):
        p.mkdir(parents=True, exist_ok=True)


def save_webp(img: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rgb = img.convert("RGB") if img.mode == "RGB" else img
    if rgb.mode not in ("RGB", "RGBA"):
        rgb = rgb.convert("RGBA" if "A" in img.getbands() else "RGB")
    rgb.save(path, "WEBP", quality=quality, method=4)
    log(f"  saved {path.name} {rgb.size} {path.stat().st_size} bytes")


def resize_w(img: Image.Image, width: int) -> Image.Image:
    if img.width == width:
        return img
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def composite_strips(psd: PSDImage, width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), (251, 247, 242))
    y = 0
    while y < height:
        y2 = min(height, y + STRIP_H)
        log(f"  compositing strip {y}:{y2} ...")
        try:
            tile = psd.composite(viewport=(0, y, width, y2))
        except TypeError:
            tile = psd.composite()
            canvas.paste(tile.crop((0, 0, width, height)), (0, 0))
            return canvas
        if tile is None:
            log(f"  WARNING empty strip {y}:{y2}")
            y = y2
            continue
        if tile.mode != "RGB":
            tile = tile.convert("RGB")
        canvas.paste(tile, (0, y))
        y = y2
    return canvas


def hide_type_layers(layer) -> int:
    hidden = 0
    kind = getattr(layer, "kind", None)
    if kind == "type" and getattr(layer, "visible", False):
        layer.visible = False
        hidden += 1
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            hidden += hide_type_layers(child)
    return hidden


def find_layers(layer, name: str, acc: list) -> None:
    if str(getattr(layer, "name", "")) == name:
        acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            find_layers(child, name, acc)


def export_named_layers(psd: PSDImage) -> list[dict]:
    exported = []
    for slug, name in TARGET_LAYERS:
        found: list = []
        for layer in psd:
            find_layers(layer, name, found)
        if not found:
            log(f"  missing layer {name}")
            exported.append({"slug": slug, "name": name, "ok": False})
            continue
        layer = next((l for l in found if getattr(l, "visible", True)), found[0])
        try:
            img = layer.composite()
        except Exception as exc:
            log(f"  fail {name}: {exc}")
            exported.append({"slug": slug, "name": name, "ok": False, "error": str(exc)})
            continue
        if img is None:
            exported.append({"slug": slug, "name": name, "ok": False, "error": "empty"})
            continue
        out = DECOR / f"{slug}.webp"
        save_webp(img, out, quality=88)
        box = layer.bbox
        exported.append(
            {
                "slug": slug,
                "name": name,
                "ok": True,
                "path": str(out.relative_to(ROOT)),
                "x": int(box[0]),
                "y": int(box[1]),
                "width": int(box[2] - box[0]),
                "height": int(box[3] - box[1]),
            }
        )
    return exported


def export_gallery_photos(psd: PSDImage) -> list[dict]:
    photos = []
    found: list = []
    for layer in psd:
        find_layers(layer, "Your Image Here", found)
    for i, layer in enumerate(found, start=1):
        try:
            img = layer.composite()
        except Exception as exc:
            log(f"  photo {i} fail: {exc}")
            continue
        if img is None:
            continue
        out = PHOTOS / f"gallery-{i}.webp"
        save_webp(img, out, quality=82)
        box = layer.bbox
        photos.append(
            {
                "index": i,
                "path": str(out.relative_to(ROOT)),
                "x": int(box[0]),
                "y": int(box[1]),
                "width": int(box[2] - box[0]),
                "height": int(box[3] - box[1]),
            }
        )
    return photos


def crop_sections(full: Image.Image, dest: Path, prefix: str) -> None:
    for sec in SECTIONS:
        y = max(0, int(sec["y"]))
        h = int(sec["height"])
        y2 = min(full.height, y + h)
        crop = full.crop((0, y, full.width, y2))
        preview = resize_w(crop, PREVIEW_W)
        save_webp(preview, dest / f"{sec['id']}.webp", quality=84)
        plate = resize_w(crop, PLATE_W)
        save_webp(plate, PLATES / f"{prefix}-{sec['id']}.webp", quality=86)


def main() -> int:
    ensure_dirs()
    if not PSD_PATH.exists():
        log(f"PSD not found: {PSD_PATH}")
        return 1

    log(f"Opening {PSD_PATH} ...")
    psd = PSDImage.open(str(PSD_PATH))
    width, height = int(psd.width), int(psd.height)
    log(f"Document {width}x{height}")

    log("Compositing WITH text ...")
    full = composite_strips(psd, width, height)
    full_preview = resize_w(full, PREVIEW_W)
    save_webp(full_preview, REF / "full-preview.webp", quality=82)
    crop_sections(full, REF, "with-text")

    log("Exporting named decoration layers ...")
    decor = export_named_layers(psd)
    photos = export_gallery_photos(psd)

    log("Hiding type layers and compositing plates ...")
    hidden = 0
    for layer in psd:
        hidden += hide_type_layers(layer)
    log(f"  hid {hidden} type layers")
    plates_full = composite_strips(psd, width, height)
    plates_preview = resize_w(plates_full, PREVIEW_W)
    save_webp(plates_preview, REF / "full-preview-no-text.webp", quality=82)
    crop_sections(plates_full, REF, "no-text")
    # also store a 780-wide full plate split into 4 tiles for the player
    plate_780 = resize_w(plates_full, PLATE_W)
    tile_h = plate_780.height // 4
    tiles = []
    for i in range(4):
        y0 = i * tile_h
        y1 = plate_780.height if i == 3 else (i + 1) * tile_h
        tile = plate_780.crop((0, y0, plate_780.width, y1))
        path = PLATES / f"full-tile-{i + 1}.webp"
        save_webp(tile, path, quality=86)
        tiles.append({"path": str(path.relative_to(ROOT)), "y0": y0, "y1": y1})

    assets = {
        "decor": decor,
        "photos": photos,
        "tiles": tiles,
        "fullPreview": "reference/full-preview.webp",
        "fullPreviewNoText": "reference/full-preview-no-text.webp",
    }
    (MANIFEST / "assets.json").write_text(json.dumps(assets, indent=2, ensure_ascii=False), encoding="utf-8")
    log("Done.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception:
        traceback.print_exc()
        sys.exit(1)
