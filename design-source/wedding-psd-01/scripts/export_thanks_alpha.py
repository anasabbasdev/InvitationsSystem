"""Re-extract Layer 25 and key black to transparency without a white halo."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image
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


def key_black(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, _a = px[x, y]
            lum = (r + g + b) / 3
            if lum < 70:
                px[x, y] = (255, 255, 255, 0)
            elif lum > 210:
                px[x, y] = (255, 255, 255, 255)
            else:
                # keep anti-alias as white with tight alpha so it does not halo
                alpha = int((lum - 70) * 255 / 140)
                px[x, y] = (255, 255, 255, alpha)
    return img


def main() -> int:
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
    for layer in psd:
        walk(layer, layers)
    for layer in layers:
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
        clean = key_black(art)
        # Scale to the PSD placed size (492x528) for smoother edges
        clean = clean.resize((492, 528), Image.Resampling.LANCZOS)
        dests = [
            PUBLIC / "decor" / "closing-thanks.webp",
            ROOT / "extracted" / "decor" / "closing-thanks.webp",
        ]
        for dest in dests:
            dest.parent.mkdir(parents=True, exist_ok=True)
            clean.save(dest, "WEBP", quality=95, method=4)
            log(f"saved {dest} {clean.size}")
        break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
