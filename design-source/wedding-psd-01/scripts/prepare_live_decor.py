"""Prepare clean timer chrome and keyed decorative type assets."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
DECOR = ROOT / "extracted" / "decor"


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def save(img: Image.Image, *paths: Path) -> None:
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "WEBP", quality=94, method=4)
        log(f"saved {path.name} {img.size} {img.mode}")


def key_black(src: Path, dest_name: str, black_cut: int = 22, keep_mids: bool = True) -> None:
    img = Image.open(src).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, _a = px[x, y]
            lum = (r + g + b) / 3
            peak = max(r, g, b)
            if peak < black_cut:
                px[x, y] = (r, g, b, 0)
            elif keep_mids:
                alpha = min(255, int((peak - black_cut) * 255 / (255 - black_cut)))
                px[x, y] = (r, g, b, alpha)
            else:
                px[x, y] = (r, g, b, 255)
    dests = [PUBLIC / "decor" / dest_name, DECOR / dest_name]
    save(img, *dests)


def inpaint_digits(src: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    # Digit windows inside the four ornate plaques. Tuned for 1124x746 chrome.
    # Leave DAYS/HOURS labels below untouched.
    bands = [
        (int(w * 0.118), int(w * 0.268)),
        (int(w * 0.318), int(w * 0.468)),
        (int(w * 0.518), int(w * 0.668)),
        (int(w * 0.718), int(w * 0.868)),
    ]
    y0 = int(h * 0.395)
    y1 = int(h * 0.575)

    for x0, x1 in bands:
        golds: list[tuple[int, int, int]] = []
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b, a = px[x, y]
                lum = (r + g + b) / 3
                # plaque gold is warm and relatively bright
                if lum > 150 and r > g - 5:
                    golds.append((r, g, b))
        if not golds:
            continue
        golds.sort(key=lambda c: c[0] + c[1] + c[2])
        mid = golds[len(golds) // 2]
        # slightly darker than highlight so it sits in the plaque, not a sticker
        fill = (
            min(255, int(mid[0] * 0.98)),
            min(255, int(mid[1] * 0.97)),
            min(255, int(mid[2] * 0.96)),
            255,
        )
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b, a = px[x, y]
                lum = (r + g + b) / 3
                # baked serif digits are darker bronze than the plaque field
                if lum < 145:
                    # blend toward fill so edges are not a hard box
                    t = min(1.0, (145 - lum) / 55)
                    px[x, y] = (
                        int(r * (1 - t) + fill[0] * t),
                        int(g * (1 - t) + fill[1] * t),
                        int(b * (1 - t) + fill[2] * t),
                        a,
                    )

    # soft pass to hide remaining glyph edges
    digit_band = img.crop((0, y0, w, y1)).filter(ImageFilter.GaussianBlur(radius=0.6))
    img.paste(digit_band, (0, y0))
    return img


def main() -> int:
    timer_src = PUBLIC / "decor" / "countdown-timer.webp"
    if not timer_src.exists():
        timer_src = DECOR / "countdown-timer.webp"
    clean = inpaint_digits(timer_src)
    save(clean, PUBLIC / "decor" / "countdown-timer.webp", DECOR / "countdown-timer.webp")

    key_black(DECOR / "art-best.webp", "art-best.webp", black_cut=18)
    key_black(DECOR / "art-moment.webp", "art-moment.webp", black_cut=18)
    key_black(DECOR / "art-layer-25.webp", "closing-thanks.webp", black_cut=16, keep_mids=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
