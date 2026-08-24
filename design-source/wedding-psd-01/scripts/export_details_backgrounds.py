"""Build details wall + torn-paper layers from the designer exports.

Black in the source PNGs is empty (smart-object mask), not paint.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = Path(r"d:\Projects\Invitation\marasim\public\assets\invitations\psd-wedding-01")
ASSETS = Path(
    r"C:\Users\anas-\.cursor\projects\d-Projects-Invitation\assets"
)

WALL_SRC = ASSETS / (
    "c__Users_anas-_AppData_Roaming_Cursor_User_workspaceStorage_"
    "64cf321d05f7c4987a7b236acbe205b2_images_"
    "Vector_Smart_Object-f16403d3-a944-4a40-97e2-ec318008f495.png"
)
PAPER_SRC = ASSETS / (
    "c__Users_anas-_AppData_Roaming_Cursor_User_workspaceStorage_"
    "64cf321d05f7c4987a7b236acbe205b2_images_"
    "Layer_2__merged_-35e5c12f-4ae5-44c0-8bdd-52ac22e364c7.png"
)
PLATE_SRC = PUBLIC / "sections" / "05-details.webp"

PLATE_W = 780
PLATE_H = 491


def log(msg: str) -> None:
    print(msg.encode("ascii", "replace").decode(), flush=True)


def key_black(im: Image.Image, hard: int = 22, soft: int = 18) -> Image.Image:
    im = im.convert("RGBA")
    pix = list(im.getdata())
    out = []
    for r, g, b, a in pix:
        lum = (r + g + b) / 3
        if lum <= hard:
            out.append((r, g, b, 0))
        elif lum < hard + soft:
            out.append((r, g, b, int(round((lum - hard) * 255 / soft))))
        else:
            out.append((r, g, b, 255 if a == 0 else a))
    im.putdata(out)
    return im


def content_bbox(im: Image.Image, alpha_min: int = 12) -> tuple[int, int, int, int]:
    a = im.getchannel("A")
    return a.getbbox() or (0, 0, im.width, im.height)


def save_webp(im: Image.Image, path: Path, quality: int = 90) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=4)
    log(f"saved {path} {im.size} {path.stat().st_size}")


def is_plate_background(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    if mn >= 246 and mx - mn <= 16:
        return True
    if r >= 248 and g >= 246 and b >= 236 and mx - mn <= 22:
        return True
    if r >= 244 and g >= 232 and b >= 218 and (r - b) <= 28 and abs(r - g) <= 16:
        return True
    return False


def key_plate_background(plate: Image.Image) -> Image.Image:
    plate = plate.convert("RGBA")
    pix = list(plate.getdata())
    out = []
    for r, g, b, a in pix:
        if is_plate_background(r, g, b):
            out.append((r, g, b, 0))
        else:
            out.append((r, g, b, a if a else 255))
    plate.putdata(out)
    return plate


def main() -> int:
    wall = key_black(Image.open(WALL_SRC))
    wx1, wy1, wx2, wy2 = content_bbox(wall)
    wall = wall.crop((wx1, wy1, wx2, wy2))
    save_webp(wall, PUBLIC / "decor" / "details-column-wall.webp")
    save_webp(wall, ROOT / "extracted" / "decor" / "details-column-wall.webp")

    paper = key_black(Image.open(PAPER_SRC))
    save_webp(paper, PUBLIC / "decor" / "details-torn-paper.webp")
    save_webp(paper, ROOT / "extracted" / "decor" / "details-torn-paper.webp")

    plate = Image.open(PLATE_SRC)
    fg = key_plate_background(plate)
    save_webp(fg, PUBLIC / "decor" / "details-columns-icons.webp")
    save_webp(fg, ROOT / "extracted" / "decor" / "details-columns-icons.webp")

    preview = Image.new("RGBA", (PLATE_W, PLATE_H), (0, 0, 0, 0))
    wall_fit = wall.resize((PLATE_W, 270), Image.Resampling.LANCZOS)
    preview.alpha_composite(wall_fit, (0, 0))
    paper_h = max(1, round(paper.height * (PLATE_W / paper.width)))
    paper_fit = paper.resize((PLATE_W, paper_h), Image.Resampling.LANCZOS)
    preview.alpha_composite(paper_fit, (0, 226))
    preview.alpha_composite(fg, (0, 0))
    save_webp(preview, ROOT / "extracted" / "plates" / "05-details-rebuilt.webp")
    preview.convert("RGB").save(ROOT / "extracted" / "plates" / "05-details-rebuilt-preview.jpg", quality=88)
    log("preview ready")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
