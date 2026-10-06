"""One docs source per component: the registry `docs` block feeds Figma, the Component_Skills and Storybook.

Usage:  python tools/component_docs.py <DS folder> check     list components whose docs block is missing required keys
        python tools/component_docs.py <DS folder> figma     write data/figma-descriptions.json (house format text per component)
        python tools/component_docs.py <DS folder> skills    refresh the generated usage lines in Component_Skills/*/references/components.md

The `docs` block of each entry in <folder>/data/component-registry.json is written once, while the component is built
(Storybook_Design_System_Skill/SKILL.md section 4b has the full shape). Required keys: overview, when_to_use,
when_not_to_use, accessibility, keywords; Molecules and higher also need anatomy.

- figma:  the Figma description (Purpose / Usage rules / Accessibility / Keywords) is generated from the block, then
          written to every component set by tools/apply_descriptions.figma.js. Nobody writes it by hand.
- skills: under each `## <Component>` heading of its group's components.md, the lines between
          `<!-- docs:start -->` and `<!-- docs:end -->` are regenerated (Use / Do not use / Content / Accessibility /
          Keywords). Everything else in the file (spec tables, visual notes) is left untouched.
- Storybook: tools/storybook_docs.py already reads the block first; nothing to do here.

Accessibility items are a sentence, or a row: {"part": "Label", "criterion": "1.4.3", "requirement": "4.5:1",
"states": ["Default", "Hover", "Pressed"], "detail": "Measure on the final background."}.
"""
import json
import pathlib
import re
import sys

REQUIRED = ["overview", "when_to_use", "when_not_to_use", "accessibility", "keywords"]
REQUIRED_COMPOSED = ["anatomy"]  # Molecule, Organism, Pattern
START, END = "<!-- docs:start -->", "<!-- docs:end -->"
NEGATIVE = re.compile(r"^(do not|don't|never|avoid|not for)\b", re.I)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def a11y_text(item):
    """One accessibility item as a sentence (rows become 'Label: 4.5:1 (WCAG 1.4.3) in Default, Hover. Detail')."""
    if isinstance(item, str):
        return item.rstrip(".")
    head = item.get("part", "")
    req = item.get("requirement", "")
    crit = f" (WCAG {item['criterion']})" if item.get("criterion") else ""
    states = f" in {', '.join(item['states'])}" if item.get("states") else ""
    text = f"{head}: {req}{crit}{states}".strip(": ")
    if item.get("detail"):
        text += f". {item['detail'].rstrip('.')}"
    return text


def dont_text(item):
    return item.rstrip(".") if NEGATIVE.search(item) else f"Not for {item[:1].lower()}{item[1:].rstrip('.')}"


def missing_keys(c):
    d = c.get("docs") or {}
    need = REQUIRED + (REQUIRED_COMPOSED if c.get("tier") in ("Molecule", "Organism", "Pattern") else [])
    return [k for k in need if not d.get(k)]


def figma_description(c):
    """House format read back by tools/storybook_docs.py parse_description()."""
    d = c.get("docs") or {}
    usage = [x.rstrip(".") for x in d.get("when_to_use", [])] + [dont_text(x) for x in d.get("when_not_to_use", [])]
    lines = [
        f"Purpose: {d.get('overview', '').rstrip('.')}.",
        f"Usage rules: {'. '.join(usage)}." if usage else "",
        f"Accessibility: {'. '.join(a11y_text(x) for x in d.get('accessibility', []))}." if d.get("accessibility") else "",
        f"Keywords: {', '.join(d['keywords'])}" if d.get("keywords") else "",
        f"Code: {d['code']}" if d.get("code") else "",
    ]
    return "\n".join(x for x in lines if x)


def skill_lines(c):
    d = c.get("docs") or {}
    rows = [
        ("Use", "; ".join(x.rstrip(".") for x in d.get("use_cases") or d.get("when_to_use", []))),
        ("Do not use", "; ".join(x.rstrip(".") for x in d.get("when_not_to_use", []))),
        ("Content", "; ".join(x.rstrip(".") for x in d.get("content", []))),
        ("Accessibility", "; ".join(a11y_text(x) for x in d.get("accessibility", []))),
        ("Keywords", ", ".join(d.get("keywords", []))),
    ]
    return [START] + [f"- {k}: {v}" for k, v in rows if v] + [END]


def skill_file(folder, group):
    return folder / "Component_Skills" / (re.sub(r"\s+", "_", group.strip()) + "_Skill") / "references" / "components.md"


def update_section(text, name, block):
    """Replace the generated block under '## <name>', insert it right after the heading, or append a new section."""
    lines = text.splitlines()
    try:
        h = next(i for i, l in enumerate(lines) if l.strip() == f"## {name}")
    except StopIteration:
        return text.rstrip("\n") + f"\n\n## {name}\n" + "\n".join(block) + "\n"
    end = next((i for i in range(h + 1, len(lines)) if lines[i].startswith("## ")), len(lines))
    s = next((i for i in range(h + 1, end) if lines[i].strip() == START), None)
    e = next((i for i in range(h + 1, end) if lines[i].strip() == END), None)
    if s is not None and e is not None and e > s:
        lines[s:e + 1] = block
    else:
        lines[h + 1:h + 1] = block
    return "\n".join(lines) + "\n"


def main():
    if len(sys.argv) != 3 or sys.argv[2] not in ("check", "figma", "skills"):
        print(__doc__)
        return 2
    folder = pathlib.Path(sys.argv[1])
    registry = read_json(folder / "data" / "component-registry.json")
    comps = registry.get("components", [])

    if sys.argv[2] == "check":
        gaps = {c["name"]: missing_keys(c) for c in comps}
        gaps = {k: v for k, v in gaps.items() if v}
        for name, keys in gaps.items():
            print(f"{name}: missing {', '.join(keys)}")
        print(f"{len(comps) - len(gaps)}/{len(comps)} components have complete docs.")
        return 1 if gaps else 0

    ready = [c for c in comps if c.get("docs", {}).get("overview")]
    if sys.argv[2] == "figma":
        out = {c["name"]: figma_description(c) for c in ready}
        path = folder / "data" / "figma-descriptions.json"
        path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {len(out)} descriptions to {path}. Paste it into DESCRIPTIONS in tools/apply_descriptions.figma.js.")
        return 0

    touched = set()
    for c in ready:
        path = skill_file(folder, c.get("group", ""))
        if not path.exists():
            print(f"{c['name']}: no {path}, skipped")
            continue
        path.write_text(update_section(path.read_text(encoding="utf-8"), c["name"], skill_lines(c)), encoding="utf-8")
        touched.add(path)
    print(f"Updated {len(ready)} components in {len(touched)} components.md files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
