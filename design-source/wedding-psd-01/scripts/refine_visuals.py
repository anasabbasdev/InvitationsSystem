"""Rebuild timer plaque gold, key type rasters, paint thanks stroke/shadow."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageChops

PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01\decor")
OUT = Path(r"d:\Projects\Invitation\design-source\wedding-psd-01\extracted\decor")


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def save(img: Image.Image, *paths: Path) -> None:
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "WEBP", quality=95, method=4)
        log(f"saved {path.name} {img.size}")


def key_black(img: Image.Image, cutoff: int = 28, fade: int = 20) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mx = max(r, g, b)
            if mx <= cutoff:
                px[x, y] = (r, g, b, 0)
            elif mx < cutoff + fade:
                px[x, y] = (r, g, b, int(a * (mx - cutoff) / fade))
    return img


def recolor_white(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = (255, 255, 255, a)
    return img


def try_cv_inpaint(img: Image.Image, mask: Image.Image) -> Image.Image | None:
    try:
        import cv2
        import numpy as np
    except Exception:
        return None
    bgr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    m = np.array(mask.convert("L"))
    out = cv2.inpaint(bgr, m, 7, cv2.INPAINT_NS)
    rgba = cv2.cvtColor(out, cv2.COLOR_BGR2RGBA)
    return Image.fromarray(rgba)


def rebuild_timer() -> None:
    src = Image.open(OUT / "countdown-timer-source.webp").convert("RGBA")
    w, h = src.size
    px = src.load()
    out = src.copy()
    opx = out.load()
    centers = [0.193, 0.397, 0.601, 0.805]
    cy = h * 0.490
    rx = w * 0.088
    ry = h * 0.070

    filled = 0
    for fx in centers:
        cx = w * fx
        for y in range(max(0, int(cy - ry)), min(h, int(cy + ry))):
            left: list[tuple[int, int, int]] = []
            right: list[tuple[int, int, int]] = []
            mid: list[int] = []
            for x in range(max(0, int(cx - rx)), min(w, int(cx + rx))):
                dx = (x - cx) / rx
                dy = (y - cy) / ry
                if dx * dx + dy * dy > 1.0:
                    continue
                r, g, b, a = px[x, y]
                lum = 0.3 * r + 0.59 * g + 0.11 * b
                if 0.52 <= abs(dx) <= 0.88 and 148 <= lum <= 215:
                    (left if dx < 0 else right).append((r, g, b))
                if abs(dx) <= 0.80:
                    mid.append(x)
            if not mid:
                continue
            if not left and not right:
                continue
            left_c = tuple(sum(c[i] for c in left) // len(left) for i in range(3)) if left else None
            right_c = tuple(sum(c[i] for c in right) // len(right) for i in range(3)) if right else None
            span = max(1, mid[-1] - mid[0])
            for x in mid:
                t = (x - mid[0]) / span
                if left_c and right_c:
                    tone = tuple(int(left_c[k] * (1 - t) + right_c[k] * t) for k in range(3))
                else:
                    tone = left_c or right_c
                dx = (x - cx) / rx
                dy = (y - cy) / ry
                falloff = dx * dx + dy * dy
                orig = px[x, y]
                if falloff > 0.72:
                    mix = max(0.0, 1.0 - (falloff - 0.72) / 0.28)
                    tone = tuple(int(orig[k] * (1 - mix) + tone[k] * mix) for k in range(3))
                opx[x, y] = (*tone, orig[3])
                filled += 1
    log(f"cloned gold pixels {filled}")
    save(out, PUBLIC / "countdown-timer.webp", OUT / "countdown-timer.webp")


def paint_thanks() -> None:
    raw = Image.open(PUBLIC / "art-layer-25.webp").convert("RGBA")
    # scale 2x for a clean stroke
    raw = raw.resize((raw.width * 3, raw.height * 3), Image.Resampling.LANCZOS)
    keyed = key_black(raw, cutoff=24, fade=18)
    alpha = keyed.split()[3]

    # tan stroke by dilating alpha
    stroke_mask = alpha.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(0.6))
    stroke = Image.new("RGBA", keyed.size, (0, 0, 0, 0))
    tan = Image.new("RGBA", keyed.size, (196, 158, 104, 255))
    stroke.paste(tan, mask=stroke_mask)

    # darker hairline
    hair = alpha.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.4))
    hair_img = Image.new("RGBA", keyed.size, (0, 0, 0, 0))
    hair_img.paste(Image.new("RGBA", keyed.size, (120, 88, 48, 255)), mask=hair)

    # drop shadow
    shadow_mask = alpha.filter(ImageFilter.GaussianBlur(7))
    shadow = Image.new("RGBA", keyed.size, (0, 0, 0, 0))
    shadow.paste(Image.new("RGBA", keyed.size, (62, 42, 22, 170)), mask=shadow_mask)
    shadow = ImageChops.offset(shadow, 8, 12)

    canvas = Image.new("RGBA", keyed.size, (0, 0, 0, 0))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(hair_img)
    canvas.alpha_composite(stroke)
    canvas.alpha_composite(keyed)
    # place size in PSD is 492x528 — keep 2x for sharpness
    canvas = canvas.resize((492 * 2, 528 * 2), Image.Resampling.LANCZOS)
    save(canvas, PUBLIC / "closing-thanks.webp", OUT / "closing-thanks.webp")


def process_type_arts() -> None:
    keep_ink = ["art-best.webp", "art-moment.webp", "art-together.webp", "art-moments.webp"]
    make_white = ["art-timeline.webp", "art-wedding-hall.webp"]
    for name in keep_ink:
        img = key_black(Image.open(PUBLIC / name))
        save(img, PUBLIC / name, OUT / name)
    for name in make_white:
        img = recolor_white(key_black(Image.open(PUBLIC / name)))
        save(img, PUBLIC / name, OUT / name)


def main() -> int:
    rebuild_timer()
    log("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
