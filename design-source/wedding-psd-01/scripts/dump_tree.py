import json
from pathlib import Path

tree = json.loads(Path(__file__).resolve().parents[1].joinpath("manifest/tree.json").read_text(encoding="utf-8"))
print("TOP LEVEL", len(tree))
for n in tree:
    kids = n.get("children") or []
    print(
        f"\n=== {n.get('name')} type={n.get('type')} vis={n.get('visible')} "
        f"y={n.get('y')} h={n.get('height')} w={n.get('width')} x={n.get('x')} children={len(kids)}"
    )
    for c in kids:
        print(
            f"  - {c.get('name')} [{c.get('type')}] vis={c.get('visible')} "
            f"y={c.get('y')} h={c.get('height')} w={c.get('width')} x={c.get('x')}"
        )
        for gc in (c.get("children") or [])[:12]:
            print(
                f"      · {gc.get('name')} [{gc.get('type')}] vis={gc.get('visible')} "
                f"y={gc.get('y')} h={gc.get('height')} x={gc.get('x')}"
            )
