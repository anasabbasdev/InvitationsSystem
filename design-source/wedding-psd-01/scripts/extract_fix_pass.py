"""Extract timer chrome, Best/Moment art, thanks art, and type fill colors."""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageFilter, ImageDraw
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
OUT = ROOT / "extracted" / "decor"


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list, depth: int = 0) -> None:
    acc.append((depth, layer))
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc, depth + 1)


def save_webp(img: Image.Image, *paths: Path, quality: int = 92) -> None:
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "WEBP", quality=quality, method=4)
        log(f"saved {path.name} {img.size} {img.mode}")


def layer_fill_info(layer) -> dict:
    info = {
        "name": str(getattr(layer, "name", "")),
        "kind": getattr(layer, "kind", None),
        "blend": str(getattr(layer, "blend_mode", "")),
        "opacity": getattr(layer, "opacity", None),
        "bbox": list(getattr(layer, "bbox", ())),
    }
    try:
        engine = layer.engine_dict
        if engine:
            style = engine.get("StyleRun", {})
            info["style_keys"] = list(style.keys()) if isinstance(style, dict) else type(style).__name__
            # dump a compact repr of fill-related bits
            raw = str(engine)[:4000]
            info["engine_snip"] = raw
    except Exception as exc:
        info["engine_error"] = str(exc)
    try:
        info["text"] = str(getattr(layer, "text", "") or "")[:200]
    except Exception:
        pass
    return info


def export_named_composites(psd: PSDImage, names: set[str], prefix: str) -> None:
    layers = []
    for layer in psd:
        walk(layer, layers)
    for depth, layer in layers:
        name = str(getattr(layer, "name", ""))
        if name not in names:
            continue
        log(f"composite {prefix} {name} blend={getattr(layer,'blend_mode',None)} box={layer.bbox}")
        try:
            art = layer.composite()
        except Exception as exc:
            log(f"  fail {exc}")
            continue
        if art is None:
            continue
        slug = name.strip().lower().replace(" ", "-")[:40]
        save_webp(art, OUT / f"{prefix}-{slug}.webp", PUBLIC / "decor" / f"{prefix}-{slug}.webp")


def export_timer_variations(psd: PSDImage) -> None:
    layers = []
    for layer in psd:
        walk(layer, layers)
    for depth, layer in layers:
        if str(getattr(layer, "name", "")) != "create fance countdown timer":
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        with so.open() as handle:
            inner = PSDImage.open(BytesIO(handle.read()))
        inner_layers = []
        for child in inner:
            walk(child, inner_layers)
        # isolate each variation pixel
        for d, child in inner_layers:
            name = str(getattr(child, "name", ""))
            kind = getattr(child, "kind", None)
            vis = getattr(child, "visible", None)
            log(f"  timer var {kind} {name} vis={vis} box={getattr(child,'bbox',None)}")
            if kind != "pixel":
                continue
            was = child.visible
            # hide all siblings then show this one
        # export each pixel child alone
        pixels = [c for d, c in inner_layers if getattr(c, "kind", None) == "pixel"]
        for idx, child in enumerate(pixels):
            for other in pixels:
                other.visible = other is child
            art = inner.composite(ignore_preview=True)
            if art is None:
                continue
            slug = f"timer-var-{idx}"
            save_webp(art, OUT / f"{slug}.webp")
            # restore later
        break


def inpaint_timer_digits(src: Path) -> Image.Image | None:
    """Cover baked digits using sampled plaque gold, keep ornaments/labels."""
    if not src.exists():
        return None
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    # Four plaques roughly in a row in the middle band of the fancy timer.
    # Measured from typical 1124x746 / 1164x786 layouts.
    row_top = int(h * 0.36)
    row_bot = int(h * 0.64)
    pads = [
        (0.095, 0.28),
        (0.305, 0.49),
        (0.515, 0.70),
        (0.725, 0.91),
    ]
    out = img.copy()
    draw = ImageDraw.Draw(out)
    for left_f, right_f in pads:
        x0 = int(w * left_f)
        x1 = int(w * right_f)
        # sample gold from the plaque rim (just inside the frame, above digits)
        sample_box = (x0 + 8, row_top + 6, x1 - 8, row_top + 18)
        sample = img.crop(sample_box)
        # average color
        pixels = list(sample.getdata())
        if not pixels:
            continue
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
        # tighter digit box so we do not erase pearl frames
        dx0 = x0 + int((x1 - x0) * 0.18)
        dx1 = x1 - int((x1 - x0) * 0.18)
        dy0 = row_top + int((row_bot - row_top) * 0.12)
        dy1 = row_bot - int((row_bot - row_top) * 0.28)
        # vertical gold gradient matching brushed plaque
        for y in range(dy0, dy1):
            t = (y - dy0) / max(1, dy1 - dy0)
            rr = int(r * (1.06 - t * 0.12))
            gg = int(g * (1.04 - t * 0.10))
            bb = int(b * (1.02 - t * 0.08))
            draw.line([(dx0, y), (dx1, y)], fill=(min(255, rr), min(255, gg), min(255, bb), 255))
    return out


def dump_type_colors(psd: PSDImage) -> None:
    wanted = (
        "EVENT",
        "Timeline",
        "Our Luxury",
        "Wedding Hall",
        "15:00 WELCOME",
        "15:00 ",
        "Best",
        "Moment",
        "OUR",
        "Moments",
        "Details",
        "التفاصي",
    )
    layers = []
    for layer in psd:
        walk(layer, layers)
    report = []
    for depth, layer in layers:
        if getattr(layer, "kind", None) != "type":
            continue
        name = str(getattr(layer, "name", ""))
        if not any(name.startswith(w) or w in name for w in wanted):
            continue
        info = layer_fill_info(layer)
        log(f"TYPE {name} blend={info.get('blend')} box={info.get('bbox')}")
        report.append(info)
    (ROOT / "manifest" / "type-fill-snip.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    log(f"wrote type-fill-snip.json {len(report)}")


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    dump_type_colors(psd)
    export_named_composites(psd, {"Best", "Moment", "Layer 25"}, "art")
    export_timer_variations(psd)

    # Inpaint current public timer
    current = PUBLIC / "decor" / "countdown-timer.webp"
    clean = inpaint_timer_digits(current)
    if clean is not None:
        save_webp(clean, PUBLIC / "decor" / "countdown-timer-clean.webp", OUT / "countdown-timer-clean.webp")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
