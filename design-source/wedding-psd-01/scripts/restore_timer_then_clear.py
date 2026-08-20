"""Restore the canvas timer SO, then clear only the digit ovals."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def walk(layer, acc: list) -> None:
    acc.append(layer)
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc)


def restore_canvas_timer() -> Image.Image:
    psd = PSDImage.open(str(PSD_PATH))
    layers = []
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
        log(f"restored timer {art.size}")
        return art.convert("RGBA")
    raise SystemExit("timer copy not found")


def sample_ring(img: Image.Image, cx: float, cy: float, rx: float, ry: float) -> tuple[int, int, int]:
    px = img.load()
    w, h = img.size
    acc = [0, 0, 0]
    n = 0
    for y in range(max(0, int(cy - ry * 1.35)), min(h, int(cy + ry * 1.35))):
        for x in range(max(0, int(cx - rx * 1.35)), min(w, int(cx + rx * 1.35))):
            dx = (x - cx) / rx
            dy = (y - cy) / ry
            d = dx * dx + dy * dy
            if 1.08 <= d <= 1.6:
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
    light = tuple(min(255, int(c * 1.05)) for c in color)
    dark = tuple(max(0, int(c * 0.93)) for c in color)
    steps = 16
    for i in range(steps):
        t = i / (steps - 1)
        r = rx * (1 - t * 0.1)
        s = ry * (1 - t * 0.1)
        tone = tuple(int(light[k] * (1 - t) + dark[k] * t) for k in range(3))
        draw.ellipse([cx - r, cy - s, cx + r, cy + s], fill=(*tone, 255))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1.25))
    img.alpha_composite(overlay)


def main() -> int:
    img = restore_canvas_timer()
    w, h = img.size
    centers = [0.193, 0.397, 0.601, 0.805]
    cy = h * 0.485
    rx = w * 0.068
    ry = h * 0.082
    for fx in centers:
        cx = w * fx
        color = sample_ring(img, cx, cy, rx, ry)
        log(f"plaque {fx:.3f} {color}")
        fill_oval(img, cx, cy, rx, ry, color)
    for dest in (PUBLIC / "decor" / "countdown-timer.webp", ROOT / "extracted" / "decor" / "countdown-timer.webp"):
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=94, method=4)
        log(f"saved {dest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
