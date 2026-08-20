"""Export the first timer SO variation (banner) as chrome, before flattened copies overwrite it."""
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


def walk(layer, acc: list, depth: int = 0) -> None:
    acc.append((depth, layer))
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            walk(child, acc, depth + 1)


def save_webp(img: Image.Image, path: Path, quality: int = 92) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=4)
    log(f"saved {path.name} {img.size} {img.mode}")


def main() -> int:
    psd = PSDImage.open(str(PSD_PATH))
    layers: list = []
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
        inner_layers: list = []
        for child in inner:
            walk(child, inner_layers)
        for d, child in inner_layers:
            name = str(getattr(child, "name", ""))
            kind = getattr(child, "kind", None)
            vis = getattr(child, "visible", None)
            log(f"{'  '*d}{kind} {name} vis={vis} box={getattr(child,'bbox',None)}")
        art = inner.composite(ignore_preview=True)
        if art is not None:
            # Keep alpha if present
            save_webp(art, PUBLIC / "decor" / "countdown-timer.webp")
            save_webp(art, ROOT / "extracted" / "decor" / "countdown-timer.webp")
            art.convert("RGB").save(ROOT / "reference" / "png" / "inspect" / "countdown-timer-banner.png")
            log("wrote inspect png")
        break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
