import json
from pathlib import Path

out = Path(__file__).resolve().parents[1] / "manifest" / "tree-outline.txt"
tree = json.loads(Path(__file__).resolve().parents[1].joinpath("manifest/tree.json").read_text(encoding="utf-8"))
lines = []
for n in tree:
    kids = n.get("children") or []
    lines.append(
        f"\n=== {n.get('name')} [{n.get('type')}] vis={n.get('visible')} "
        f"x={n.get('x')} y={n.get('y')} w={n.get('width')} h={n.get('height')} children={len(kids)}"
    )
    for c in kids:
        lines.append(
            f"  - {c.get('name')} [{c.get('type')}] vis={c.get('visible')} "
            f"x={c.get('x')} y={c.get('y')} w={c.get('width')} h={c.get('height')}"
        )
        for gc in c.get("children") or []:
            lines.append(
                f"      · {gc.get('name')} [{gc.get('type')}] vis={gc.get('visible')} "
                f"x={gc.get('x')} y={gc.get('y')} w={gc.get('width')} h={gc.get('height')}"
            )

out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {out}")
