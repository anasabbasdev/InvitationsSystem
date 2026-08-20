"""Clear baked gold digits by filling each plaque's inner oval with sampled metal."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def sample_ring(img: Image.Image, cx: float, cy: float, rx: float, ry: float) -> tuple[int, int, int]:
    px = img.load()
    w, h = img.size
    acc = [0, 0, 0]
    n = 0
    for y in range(max(0, int(cy - ry * 1.25)), min(h, int(cy + ry * 1.25))):
        for x in range(max(0, int(cx - rx * 1.25)), min(w, int(cx + rx * 1.25))):
            dx = (x - cx) / rx
            dy = (y - cy) / ry
            d = dx * dx + dy * dy
            if 1.05 <= d <= 1.55:
                r, g, b, _a = px[x, y]
                acc[0] += r
                acc[1] += g
                acc[2] += b
                n += 1
    if n == 0:
        return (198, 168, 98)
    return (acc[0] // n, acc[1] // n, acc[2] // n)


def fill_oval(img: Image.Image, cx: float, cy: float, rx: float, ry: float, color: tuple[int, int, int]) -> None:
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    box = [cx - rx, cy - ry, cx + rx, cy + ry]
    # slightly darker at bottom to keep brushed-metal feel
    light = tuple(min(255, int(c * 1.06)) for c in color)
    dark = tuple(max(0, int(c * 0.92)) for c in color)
    steps = 18
    for i in range(steps):
        t = i / (steps - 1)
        r = rx * (1 - t * 0.08)
        s = ry * (1 - t * 0.08)
        tone = tuple(int(light[k] * (1 - t) + dark[k] * t) for k in range(3))
        draw.ellipse([cx - r, cy - s, cx + r, cy + s], fill=(*tone, 255))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1.1))
    img.alpha_composite(overlay)


def main() -> int:
    src = PUBLIC / "decor" / "countdown-timer.webp"
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    log(f"timer {w}x{h}")
    # Four plaque centers from the cream/gold banner layout
    centers = [0.193, 0.397, 0.601, 0.805]
    cy = h * 0.485
    rx = w * 0.062
    ry = h * 0.078
    for fx in centers:
        cx = w * fx
        color = sample_ring(img, cx, cy, rx, ry)
        log(f"  plaque x={fx:.3f} gold={color}")
        fill_oval(img, cx, cy, rx, ry, color)
    dests = [
        PUBLIC / "decor" / "countdown-timer.webp",
        ROOT / "extracted" / "decor" / "countdown-timer.webp",
    ]
    for dest in dests:
        img.save(dest, "WEBP", quality=94, method=4)
        log(f"saved {dest.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
