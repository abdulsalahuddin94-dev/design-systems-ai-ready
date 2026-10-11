"""Storybook style check: compare what Figma holds with what Storybook renders, as numbers (idea from storysync's
`verify`, adopted 2026-10-11). storybook_parity.py checks names; this checks values.

Usage:  python tools/style_parity.py <DS folder> [--tolerance 0.5] [--json]
Reads   <folder>/data/figma-styles.json     (tools/figma_styles.figma.js on the DS file)
        <folder>/data/storybook-styles.json (node tools/storybook_snap.cjs <folder>)
Prints  Fidelity: 97.5% (390/400 properties), then every difference:
          ~ Button > Type=Primary, State=Hover [Dark]  fill: Figma #1E7A3AFF, Storybook #299B48FF
Rules   colors match per channel within 2/255 (alpha 0.02); lengths within --tolerance px; width and height within
        max(1px, 3%) because text metrics differ by a pixel; width only when the Figma layer has a fixed width;
        a property missing on either side is not scored. Variants Storybook could not open are listed apart and do
        not lower the score.
Exit code 1 on any difference, unmeasured variant or a measurement older than the Figma read, so it can gate a build.
"""
import json
import pathlib
import sys
from datetime import datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
COLORS = ("fill", "stroke", "textColor")
LENGTHS = ("strokeWeight", "radius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "fontSize", "lineHeight")
SIZES = ("width", "height")


def rgba(h):
    h = h.lstrip("#")
    if len(h) == 6:
        h += "FF"
    return [int(h[i:i + 2], 16) for i in (0, 2, 4, 6)]


def same(key, f, s, tol, fig):
    if key in COLORS:
        if f is None or s is None:
            return f is None and s is None
        a, b = rgba(f), rgba(s)
        return all(abs(x - y) <= 2 for x, y in zip(a[:3], b[:3])) and abs(a[3] - b[3]) <= 5
    if key in SIZES:
        return abs(f - s) <= max(1, 0.03 * max(abs(f), abs(s)))
    if key == "fontFamily":
        return str(f).strip().lower() == str(s).strip().lower()
    if key == "fontWeight":
        return abs(f - s) < 1
    if key == "opacity":
        return abs(f - s) <= 0.01
    return abs(f - s) <= tol


def compare(figma, sb, tol):
    diffs, scored, ok, unmeasured = [], 0, 0, []
    for comp, variants in figma["components"].items():
        for vname, modes in variants.items():
            for mode, f in modes.items():
                s = sb.get("components", {}).get(comp, {}).get(vname, {}).get(mode)
                if s is None:
                    unmeasured.append(f"{comp} > {vname} [{mode}]")
                    continue
                for key, fv in f.items():
                    if key in ("sizingH", "sizingV") or key not in s:
                        continue
                    sv = s[key]
                    if key == "width" and f.get("sizingH") != "FIXED":
                        continue
                    if key == "height" and f.get("sizingV") == "FILL":
                        continue
                    if key not in COLORS and (fv is None or sv is None):
                        continue
                    scored += 1
                    if same(key, fv, sv, tol, f):
                        ok += 1
                    else:
                        diffs.append({"component": comp, "variant": vname, "mode": mode, "property": key, "figma": fv, "storybook": sv})
    return scored, ok, diffs, unmeasured


def age_warning(figma, sb):
    try:
        read = datetime.fromisoformat(figma["meta"]["readAt"].replace("Z", "+00:00"))
        measured = datetime.fromisoformat(sb["meta"]["measuredAt"].replace("Z", "+00:00"))
    except (KeyError, ValueError):
        return "cannot tell when Figma was read or Storybook measured"
    if measured < read:
        return "Storybook was measured before the last Figma read: run tools/storybook_snap.cjs again"
    return None


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print(__doc__)
        return 1
    folder = ROOT / args[0]
    tol = float(args[args.index("--tolerance") + 1]) if "--tolerance" in args else 0.5
    data = folder / "data"
    missing = [p.name for p in (data / "figma-styles.json", data / "storybook-styles.json") if not p.exists()]
    if missing:
        print("Missing " + ", ".join(missing) + " (Storybook_Design_System_Skill section 5, style check).")
        return 1
    figma = json.loads((data / "figma-styles.json").read_text(encoding="utf-8"))
    sb = json.loads((data / "storybook-styles.json").read_text(encoding="utf-8"))
    scored, ok, diffs, unmeasured = compare(figma, sb, tol)
    stale = age_warning(figma, sb)
    failures = sb.get("failures", [])
    if "--json" in args:
        print(json.dumps({"scored": scored, "matched": ok, "fidelity": round(100 * ok / scored, 1) if scored else None,
                          "differences": diffs, "unmeasured": unmeasured, "failures": failures, "stale": stale}, indent=1, ensure_ascii=False))
    else:
        pct = f"{100 * ok / scored:.1f}%" if scored else "n/a"
        variants = len({(d["component"], d["variant"]) for d in diffs})
        print(f"Fidelity: {pct} ({ok}/{scored} properties); {len(diffs)} differences in {variants} variants; {len(unmeasured)} variant-modes not measured")
        for d in diffs:
            print(f"  ~ {d['component']} > {d['variant']} [{d['mode']}]  {d['property']}: Figma {d['figma']}, Storybook {d['storybook']}")
        for f in failures[:30]:
            print("  ! " + " > ".join(x for x in (f.get("component"), f.get("variant"), f.get("mode")) if x) + ": " + f.get("reason", ""))
        if stale:
            print("  ! " + stale)
    return 1 if diffs or unmeasured or not scored or stale else 0


if __name__ == "__main__":
    sys.exit(main())
