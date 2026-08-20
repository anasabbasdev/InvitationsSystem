"""Check whether the full preview is a repeating envelope or a real long invitation."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
preview = ROOT / "reference" / "png" / "full-preview.png"
if not preview.exists():
    preview = ROOT / "reference" / "full-preview.webp"

img = Image.open(preview).convert("RGB")
print("size", img.size)
w, h = img.size
# compare successive 400px bands
band = 400
prev = None
for y in range(0, h - band, band):
    crop = img.crop((0, y, w, y + band))
    mean = ImageStat.Stat(crop).mean
    extrema = crop.getextrema()
    uniqueish = "repeat?"
    if prev is not None:
        diff = ImageChops.difference(prev, crop)
        dmean = ImageStat.Stat(diff).mean
        uniqueish = f"diff_mean={tuple(round(v, 2) for v in dmean)}"
    print(f"y={y:4d} mean={[round(v,1) for v in mean]} extrema={extrema} {uniqueish}")
    prev = crop

# save 8 sample slices as png for inspection
out = ROOT / "reference" / "png" / "slices"
out.mkdir(parents=True, exist_ok=True)
for i, y in enumerate(range(0, h, max(1, h // 12))):
    y2 = min(h, y + 220)
    img.crop((0, y, w, y2)).save(out / f"slice-{i:02d}-y{y}.png")
    print("wrote", f"slice-{i:02d}-y{y}.png")
