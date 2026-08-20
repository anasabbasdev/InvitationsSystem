"""Quality pass: clean timer chrome, type rasters, thanks with tan stroke."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
OUT = ROOT / "extracted" / "decor"

TYPE_EXPORTS = {
    "Best": "art-best.webp",
    "Moment": "art-moment.webp",
    "Moments": "art-moments.webp",
    "Together": "art-together.webp",
    "Timeline": "art-timeline.webp",
    "Wedding Hall": "art-wedding-hall.webp",
    "EVENT": "art-event.webp",
    "OUR": "art-our.webp",
    "Our Luxury": "art-our-luxury.webp",
}


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list, depth: int = 0) -> None:
    acc.append((depth, layer))
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc, depth + 1)


def save_webp(img: Image.Image, *paths: Path, quality: int = 95) -> None:
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "WEBP", quality=quality, method=4, lossless=False)
        log(f"saved {path.name} {img.size} {img.mode}")


def key_dark_bg(img: Image.Image, cutoff: int = 22) -> Image.Image:
    """Punch out near-black only — keep white fill and tan stroke/shadow."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mx = max(r, g, b)
            if mx <= cutoff:
                px[x, y] = (r, g, b, 0)
            elif mx < cutoff + 28:
                fade = int(a * (mx - cutoff) / 28)
                px[x, y] = (r, g, b, fade)
    return img


def key_uniform_bg(img: Image.Image) -> Image.Image:
    """If the type raster sits on white or black, punch that out."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    avg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    is_white = all(v > 245 for v in avg)
    is_black = all(v < 18 for v in avg)
    if not (is_white or is_black):
        return img
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_white:
                dist = min(r, g, b)
                if dist > 248:
                    px[x, y] = (r, g, b, 0)
                elif dist > 230:
                    px[x, y] = (r, g, b, int(a * (248 - dist) / 18))
            else:
                mx = max(r, g, b)
                if mx < 18:
                    px[x, y] = (r, g, b, 0)
                elif mx < 40:
                    px[x, y] = (r, g, b, int(a * (mx - 18) / 22))
    return img


def export_type_rasters(psd: PSDImage) -> None:
    layers = []
    for layer in psd:
        walk(layer, layers)
    seen: set[str] = set()
    for _d, layer in layers:
        name = str(getattr(layer, "name", ""))
        if name not in TYPE_EXPORTS or name in seen:
            continue
        if getattr(layer, "kind", None) != "type":
            continue
        seen.add(name)
        try:
            art = layer.composite()
        except Exception as exc:
            log(f"type fail {name}: {exc}")
            continue
        if art is None:
            continue
        art = key_uniform_bg(art)
        fname = TYPE_EXPORTS[name]
        save_webp(art, PUBLIC / "decor" / fname, OUT / fname)
        log(f"type {name} box={layer.bbox}")


def export_thanks(psd: PSDImage) -> None:
    layers = []
    for layer in psd:
        walk(layer, layers)
    for _d, layer in layers:
        if str(getattr(layer, "name", "")) != "Layer 25":
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        with so.open() as handle:
            inner = PSDImage.open(BytesIO(handle.read()))
        art = inner.composite(ignore_preview=True)
        if art is None:
            continue
        raw = art.convert("RGBA")
        save_webp(raw, OUT / "art-layer-25.webp", PUBLIC / "decor" / "art-layer-25.webp")
        clean = key_dark_bg(raw)
        clean = clean.resize((492 * 2, 528 * 2), Image.Resampling.LANCZOS)
        save_webp(clean, PUBLIC / "decor" / "closing-thanks.webp", OUT / "closing-thanks.webp")
        return
    log("Layer 25 not found")


def hide_digit_layers(root) -> int:
    hidden = 0
    stack = [root] if not hasattr(root, "__iter__") or getattr(root, "kind", None) == "type" else list(root)
    # walk via children if PSDImage
    acc = []
    if hasattr(root, "__iter__") and getattr(root, "kind", None) != "type":
        for child in root:
            walk(child, acc)
    else:
        walk(root, acc)
    for _d, layer in acc:
        kind = getattr(layer, "kind", None)
        name = str(getattr(layer, "name", ""))
        txt = ""
        if kind == "type":
            try:
                txt = str(getattr(layer, "text", "") or "")
            except Exception:
                txt = name
        blob = f"{name} {txt}".lower()
        is_label = any(tok in blob for tok in ("day", "hour", "min", "sec", "celebration", "unveiling", "the "))
        is_digit = any(ch.isdigit() for ch in txt or name) and not is_label
        if kind == "type" and is_digit and getattr(layer, "visible", False):
            layer.visible = False
            hidden += 1
            log(f"  hid type {name!r} {txt[:20]!r}")
    return hidden


def restore_timer(psd: PSDImage) -> Image.Image:
    layers = []
    for layer in psd:
        walk(layer, layers)
    for _d, layer in layers:
        if str(getattr(layer, "name", "")) != "create fance countdown timer copy":
            continue
        so = getattr(layer, "smart_object", None)
        if so is None:
            continue
        with so.open() as handle:
            inner = PSDImage.open(BytesIO(handle.read()))
        acc = []
        for child in inner:
            walk(child, acc)
        log("TIMER INNER LAYERS")
        for d, child in acc:
            kind = getattr(child, "kind", None)
            name = str(getattr(child, "name", ""))
            txt = ""
            if kind == "type":
                try:
                    txt = str(getattr(child, "text", "") or "")[:60]
                except Exception:
                    txt = ""
            log(f"  {'  '*d}{kind} {name} vis={getattr(child,'visible',None)} box={getattr(child,'bbox',None)} {txt}")
        hidden = hide_digit_layers(inner)
        log(f"hid {hidden} digit type layers")
        art = inner.composite(ignore_preview=True)
        if art is None:
            raise SystemExit("timer composite failed")
        return art.convert("RGBA")
    raise SystemExit("timer copy not found")


def try_cv_inpaint(img: Image.Image, mask: Image.Image) -> Image.Image | None:
    try:
        import cv2
        import numpy as np
    except Exception:
        return None
    bgr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    m = np.array(mask.convert("L"))
    out = cv2.inpaint(bgr, m, 9, cv2.INPAINT_TELEA)
    rgba = cv2.cvtColor(out, cv2.COLOR_BGR2RGBA)
    return Image.fromarray(rgba)


def gold_fill_ovals(img: Image.Image) -> Image.Image:
    """Last-resort: fill plaque interiors with sampled inner gold, not cream rims."""
    w, h = img.size
    out = img.copy()
    centers = [0.193, 0.397, 0.601, 0.805]
    cy = h * 0.498
    rx = w * 0.082
    ry = h * 0.118
    px = img.load()
    for fx in centers:
        cx = w * fx
        acc = [0, 0, 0]
        n = 0
        for y in range(max(0, int(cy - ry)), min(h, int(cy + ry))):
            for x in range(max(0, int(cx - rx)), min(w, int(cx + rx))):
                dx = (x - cx) / rx
                dy = (y - cy) / ry
                d = dx * dx + dy * dy
                if 0.55 <= d <= 0.92:
                    r, g, b, _a = px[x, y]
                    # skip very dark / very light (pearls / digit cores)
                    lum = (r + g + b) / 3
                    if 90 < lum < 210 and r > g >= b - 8:
                        acc[0] += r
                        acc[1] += g
                        acc[2] += b
                        n += 1
        color = (int(acc[0] / n), int(acc[1] / n), int(acc[2] / n)) if n else (196, 164, 96)
        log(f"inner gold {fx:.3f} n={n} {color}")
        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        hi = tuple(min(255, int(c * 1.08)) for c in color)
        lo = tuple(max(0, int(c * 0.88)) for c in color)
        steps = 18
        for i in range(steps):
            t = i / (steps - 1)
            rr = rx * (1 - t * 0.12)
            ss = ry * (1 - t * 0.12)
            tone = tuple(int(hi[k] * (1 - t) + lo[k] * t) for k in range(3))
            draw.ellipse([cx - rr, cy - ss, cx + rr, cy + ss], fill=(*tone, 255))
        overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1.6))
        out.alpha_composite(overlay)
    return out


def clear_timer_digits(img: Image.Image) -> Image.Image:
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    centers = [0.193, 0.397, 0.601, 0.805]
    cy = h * 0.498
    rx = w * 0.082
    ry = h * 0.118
    for fx in centers:
        cx = w * fx
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))
    painted = try_cv_inpaint(img, mask)
    if painted is not None:
        log("used OpenCV inpaint")
        # keep original outside mask
        out = img.copy()
        out.paste(painted, mask=mask)
        return out
    log("OpenCV missing — gold oval fill")
    return gold_fill_ovals(img)


def main() -> int:
    log(f"Opening {PSD_PATH}")
    psd = PSDImage.open(str(PSD_PATH))
    export_type_rasters(psd)
    export_thanks(psd)
    timer = restore_timer(psd)
    save_webp(timer, OUT / "countdown-timer-source.webp")
    clean = clear_timer_digits(timer)
    save_webp(clean, PUBLIC / "decor" / "countdown-timer.webp", OUT / "countdown-timer.webp")
    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
