"""
Memory-conscious PSD layer-tree inspection.
Does NOT composite the 500MB document.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from psd_tools import PSDImage

PSD_PATH = Path(r"C:\Users\anas-\Downloads\1.psd")
OUT_DIR = Path(__file__).resolve().parents[1] / "manifest"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def layer_kind(layer) -> str:
    kind = getattr(layer, "kind", None)
    if kind:
        return str(kind)
    if getattr(layer, "is_group", lambda: False)():
        return "group"
    return "unknown"


def bbox_tuple(layer) -> tuple[int, int, int, int] | None:
    try:
        box = layer.bbox
        if box is None:
            return None
        x1, y1, x2, y2 = (int(box[0]), int(box[1]), int(box[2]), int(box[3]))
        return x1, y1, x2, y2
    except Exception:
        return None


def extract_text(layer) -> dict | None:
    if layer_kind(layer) != "type":
        return None
    info: dict = {}
    try:
        info["text"] = layer.text
    except Exception as exc:
        info["text_error"] = str(exc)
    fonts: list[str] = []
    try:
        resource = getattr(layer, "resource_dict", None) or {}
        fontset = resource.get("FontSet") or []
        for item in fontset:
            name = None
            if isinstance(item, dict):
                name = item.get("Name") or item.get("FontName")
            else:
                name = getattr(item, "Name", None) or str(item)
            if name:
                fonts.append(str(name))
    except Exception:
        pass
    try:
        engine = getattr(layer, "engine_dict", None) or {}
        stylesheet = engine.get("StyleSheetSet") or []
        for sheet in stylesheet:
            style = sheet.get("StyleSheetData") if isinstance(sheet, dict) else None
            if not style:
                continue
            font = style.get("Font")
            if font is not None:
                fonts.append(str(font))
    except Exception:
        pass
    if fonts:
        info["fonts"] = sorted(set(fonts))
    try:
        engine = getattr(layer, "engine_dict", None) or {}
        runs = ((engine.get("StyleRun") or {}).get("RunArray")) or []
        sizes: list[float] = []
        for run in runs:
            data = (run.get("StyleSheet") or {}).get("StyleSheetData") or {}
            size = data.get("FontSize")
            if size is not None:
                sizes.append(float(size))
        if sizes:
            info["font_sizes"] = sorted(set(round(s, 2) for s in sizes))
    except Exception:
        pass
    return info


def walk(layer, parent: str | None, depth: int) -> dict:
    box = bbox_tuple(layer)
    name = str(getattr(layer, "name", "") or "")
    visible = bool(getattr(layer, "visible", True))
    try:
        opacity = float(getattr(layer, "opacity", 255)) / 255.0
    except Exception:
        opacity = 1.0

    node: dict = {
        "name": name,
        "type": layer_kind(layer),
        "visible": visible,
        "opacity": round(opacity, 4),
        "parent": parent,
        "depth": depth,
    }
    if box:
        x1, y1, x2, y2 = box
        node.update(
            {
                "x": x1,
                "y": y1,
                "width": max(0, x2 - x1),
                "height": max(0, y2 - y1),
                "x2": x2,
                "y2": y2,
            }
        )
    text = extract_text(layer)
    if text:
        node["text"] = text

    children = []
    if getattr(layer, "is_group", lambda: False)():
        for child in layer:
            children.append(walk(child, name, depth + 1))
    if children:
        node["children"] = children
    return node


def flatten(node: dict, acc: list[dict]) -> None:
    row = {k: v for k, v in node.items() if k != "children"}
    acc.append(row)
    for child in node.get("children") or []:
        flatten(child, acc)


def main() -> int:
    if not PSD_PATH.exists():
        print(f"PSD not found: {PSD_PATH}", file=sys.stderr)
        return 1

    print(f"Opening {PSD_PATH} ({PSD_PATH.stat().st_size} bytes) ...", flush=True)
    psd = PSDImage.open(str(PSD_PATH))
    width, height = int(psd.width), int(psd.height)
    doc = {
        "path": str(PSD_PATH),
        "bytes": PSD_PATH.stat().st_size,
        "width": width,
        "height": height,
        "color_mode": str(getattr(psd, "color_mode", "")),
        "channels": getattr(psd, "channels", None),
        "depth": getattr(getattr(psd, "_record", None), "depth", None),
        "width_div_4": width / 4,
        "height_div_4": height / 4,
        "likely_4x_mobile": abs(width / 4 - 385) < 8 or abs(width / 4 - 390) < 8,
        "top_level_count": len(list(psd)),
    }
    print(json.dumps(doc, indent=2), flush=True)

    tree = []
    for layer in psd:
        tree.append(walk(layer, None, 0))

    flat: list[dict] = []
    for node in tree:
        flatten(node, flat)

    text_layers = [n for n in flat if n.get("type") == "type"]
    groups = [n for n in flat if n.get("type") == "group" and n.get("depth", 0) <= 1]
    fonts: set[str] = set()
    for n in text_layers:
        for f in (n.get("text") or {}).get("fonts") or []:
            fonts.add(f)

    summary = {
        "document": doc,
        "layer_count": len(flat),
        "text_layer_count": len(text_layers),
        "top_or_second_level_groups": [
            {
                "name": g.get("name"),
                "y": g.get("y"),
                "height": g.get("height"),
                "width": g.get("width"),
                "visible": g.get("visible"),
            }
            for g in groups
        ],
        "fonts_detected": sorted(fonts),
        "text_preview": [
            {
                "name": t.get("name"),
                "y": t.get("y"),
                "text": (t.get("text") or {}).get("text"),
                "fonts": (t.get("text") or {}).get("fonts"),
                "font_sizes": (t.get("text") or {}).get("font_sizes"),
            }
            for t in text_layers
        ],
    }

    (OUT_DIR / "document.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "layers.json").write_text(json.dumps(flat, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "tree.json").write_text(json.dumps(tree, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote {len(flat)} layers to {OUT_DIR}", flush=True)
    print("Top groups:", flush=True)
    for g in summary["top_or_second_level_groups"]:
        print(f"  y={g.get('y')} h={g.get('height')}  {g.get('name')}", flush=True)
    print("Fonts:", summary["fonts_detected"], flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
