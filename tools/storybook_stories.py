"""Generate one Storybook stories file per Figma component from data/component-registry.json.

Usage:  python tools/storybook_stories.py <DS folder>
Reads   <folder>/data/component-registry.json   (names, groups, tiers, variants, properties, use, nests, issues)
        <folder>/storybook/component-map.json   (Figma name -> React export)
        <folder>/storybook/figma-links.json     (Figma file + node ids, optional)
Writes  <folder>/storybook/src/stories/<Group>/<name>.stories.tsx

Every story file uses the Figma names exactly: title "<Group>/<Component name>", argTypes keyed by
the Figma variant and property names, options equal to the Figma variant values. Docs text comes from
the registry (tier, use, nests, known Figma gaps) plus a link back to the Figma component.
The React components themselves are written by hand in src/components/ (visual replicas on tokens).
When the docs blocks exist (src/docs/DocBlocks.tsx, from tools/storybook_docs.py), each component also gets
its generated Docs page (<name>.mdx) and the stories drop autodocs; otherwise autodocs stays on.
"""
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from storybook_docs import write_component_docs  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIER_ORDER = {"Atom": 1, "Molecule": 2, "Organism": 3, "Pattern": 4}


def ident(text):
    s = re.sub(r"[^0-9A-Za-z]+", " ", text).title().replace(" ", "")
    return s if s and not s[0].isdigit() else "V" + s


def js(value):
    return json.dumps(value, ensure_ascii=False)


def read_usage(folder):
    """'- Use:' and '- Do not use:' lines per '## <Component>' in Component_Skills/*/references/components.md."""
    out = {}
    for f in (folder / "Component_Skills").glob("*/references/components.md"):
        current = None
        for line in f.read_text(encoding="utf-8").splitlines():
            if line.startswith("## "):
                current = line[3:].strip()
                out.setdefault(current, {})
            elif current and line.startswith("- Use:"):
                out[current]["use"] = line[len("- Use:"):].strip()
            elif current and line.startswith("- Do not use:"):
                out[current]["dont"] = line[len("- Do not use:"):].strip()
    return out


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    folder = ROOT / sys.argv[1]
    sb = folder / "storybook"
    registry = json.loads((folder / "data" / "component-registry.json").read_text(encoding="utf-8"))
    cmap = json.loads((sb / "component-map.json").read_text(encoding="utf-8"))
    links = {}
    if (sb / "figma-links.json").exists():
        links = json.loads((sb / "figma-links.json").read_text(encoding="utf-8"))
    # optional: live Figma read (full description + property defaults) and the Component_Skills use cases
    live = {}
    live_path = folder / "data" / "source" / "components-live.json"
    if live_path.exists():
        live = {c["name"]: c for c in json.loads(live_path.read_text(encoding="utf-8")).get("components", [])}
    usage = read_usage(folder)
    out_root = sb / "src" / "stories"
    rich_docs = (sb / "src" / "docs" / "DocBlocks.tsx").exists()
    written, missing = [], []

    for c in registry["components"]:
        name = c["name"]
        m = cmap.get(name)
        if not m:
            missing.append(name)
            continue
        group = c["group"]
        variants = c.get("variants", {})
        props = c.get("properties", {})
        exp = m["export"]
        node = links.get("components", {}).get(name)
        url = f"{links['file']}?node-id={node.replace(':', '-')}" if node and links.get("file") else registry["meta"].get("figma_url", "")

        arg_types, args = {}, {}
        for key, values in variants.items():
            arg_types[key] = {"control": "select" if len(values) > 4 else "inline-radio", "options": values,
                              "description": f"Figma variant property `{key}`", "table": {"category": "Figma variants"}}
            d = live.get(name, {}).get("properties", {}).get(key, {}).get("default")
            args[key] = d if d in values else ("Default" if "Default" in values else values[0])
        uses_icons = False
        for key, kind in props.items():
            d = live.get(name, {}).get("properties", {}).get(key, {}).get("default")
            if d is not None:
                args[key] = d
            if kind == "BOOLEAN":
                arg_types[key] = {"control": "boolean", "description": "Figma boolean property", "table": {"category": "Figma properties"}}
            elif kind == "TEXT":
                arg_types[key] = {"control": "text", "description": "Figma text property", "table": {"category": "Figma properties"}}
            elif kind == "INSTANCE_SWAP":
                uses_icons = True
                arg_types[key] = {"control": "select", "options": "__ICONS__", "description": "Figma instance swap (Icon component)", "table": {"category": "Figma properties"}}

        # show the Figma default in the Controls table
        for key, value in args.items():
            if key in arg_types:
                arg_types[key]["table"]["defaultValue"] = {"summary": json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value}

        doc = [f"**Figma:** `{name}` on page `{c.get('page', '')}` ({group}). [Open in Figma]({url})", "",
               f"**Tier:** {c.get('tier', '')}", "", f"**Use:** {c.get('use', '')}"]
        desc = live.get(name, {}).get("description", "")
        if desc:
            doc += ["", "**Figma description:**", ""] + [f"> {line}" + "  " for line in desc.splitlines() if line.strip()]
        u = usage.get(name, {})
        if u.get("use"):
            doc += ["", "**When to use:** " + u["use"]]
        if u.get("dont"):
            doc += ["", "**When not to use:** " + u["dont"]]
        if c.get("nests"):
            doc += ["", "**Built from:** " + ", ".join(f"`{n}`" for n in c["nests"])]
        if c.get("issues"):
            doc += ["", "**Known Figma gaps (see gaps.md):** " + "; ".join(c["issues"])]
        adaptive = "adaptive" in str(registry["meta"].get("platform", "")).lower()
        doc += ["", "Controls use the Figma variant and property names exactly. Switch the Figma modes from the toolbar"
                + (" (Platform = the OS mode iOS / Android, Color, Language)." if adaptive else ".")]

        imports = sorted({exp, *m.get("example_imports", [])})
        at_src = json.dumps(arg_types, ensure_ascii=False, indent=2).replace('"__ICONS__"', "iconNames")
        lines = [
            "// Generated by tools/storybook_stories.py from data/component-registry.json. Do not edit by hand;",
            "// change the registry or src/components and regenerate.",
            "import type { Meta, StoryObj } from '@storybook/react-vite';",
            "import React from 'react';",
            f"import {{ {', '.join(imports)} }} from '../../components/{m['module']}';",
        ]
        if uses_icons:
            lines.append("import { iconNames } from '../../lib/Icon';")
        tier = TIER_ORDER.get(c.get("tier", ""), 9)
        lines += [
            "",
            f"const meta = {{",
            f"  title: {js(group + '/' + name)},",
            f"  component: {exp},",
            f"  tags: ['{'!autodocs' if rich_docs else 'autodocs'}', 'tier-{c.get('tier', '').lower()}'],",
            f"  argTypes: {at_src},",
            f"  args: {json.dumps(args, ensure_ascii=False)},",
            f"  parameters: {{",
            f"    figma: {{ name: {js(name)}, page: {js(c.get('page', ''))}, tier: {js(c.get('tier', ''))}, order: {tier} }},",
            f"    design: {{ type: 'figma', url: {js(url)} }},",
            f"    docs: {{ description: {{ component: {js(chr(10).join(doc))} }} }},",
            f"  }},",
            f"}} satisfies Meta<typeof {exp}>;",
            "export default meta;",
            f"type Story = StoryObj<typeof meta>;",
            "",
            "export const Playground: Story = {};",
        ]

        # one story per value of the first variant property
        if variants:
            # the first variant property with more than one value drives the per-value stories
            first, values = next(((k, v) for k, v in variants.items() if len(v) > 1), next(iter(variants.items())))
            used = {"Playground"}
            for v in values:
                sid = ident(v)
                while sid in used:
                    sid += "_"
                used.add(sid)
                lines.append(f"export const {sid}: Story = {{ name: {js(v)}, args: {{ {js(first)}: {js(v)} }} }};")

            # one story per State value too, when State is not the first axis
            if "State" in variants and first != "State":
                for v in variants["State"]:
                    sid = "State" + ident(v)
                    while sid in used:
                        sid += "_"
                    used.add(sid)
                    lines.append(f"export const {sid}: Story = {{ name: {js('State=' + v)}, args: {{ \"State\": {js(v)} }} }};")

            # one story showing every State side by side, and one for every Size (Figma axes)
            for axis, sid in (("State", "States"), ("Size", "Sizes")):
                if axis in variants and len(variants[axis]) > 1 and sid not in used:
                    used.add(sid)
                    lines += [
                        "",
                        f"export const {sid}: Story = {{",
                        f"  name: {js(sid)},",
                        "  render: (args) => (",
                        "    <div className=\"sb-row\">",
                        f"      {{{js(variants[axis])}.map((x) => (",
                        "        <div key={x}>",
                        f"          <div className=\"sb-cell-label ts-xs-medium\">{axis}={{x}}</div>",
                        f"          <{exp} {{...args}} {{...{{ {js(axis)}: x }} as any}} />",
                        "        </div>",
                        "      ))}",
                        "    </div>",
                        "  ),",
                        "};",
                    ]

            # icon placements: each "Show <slot>" boolean on its own, then all of them
            shows = [b for b, t in props.items() if t == "BOOLEAN" and any(s.lower() in b.lower() for s, k in props.items() if k == "INSTANCE_SWAP")]
            if shows and "Icons" not in used:
                used.add("Icons")
                combos = [{b: True} for b in shows] + ([{b: True for b in shows}] if len(shows) > 1 else [])
                labels = shows + (["Both"] if len(shows) > 1 else [])
                lines += [
                    "",
                    "export const Icons: Story = {",
                    "  name: 'Icons',",
                    "  render: (args) => (",
                    "    <div className=\"sb-row\">",
                    f"      {{{js(list(zip(labels, combos)))}.map(([label, extra]: any) => (",
                    "        <div key={label}>",
                    "          <div className=\"sb-cell-label ts-xs-medium\">{label}</div>",
                    f"          <{exp} {{...args}} {{...extra}} />",
                    "        </div>",
                    "      ))}",
                    "    </div>",
                    "  ),",
                    "};",
                ]

            # matrix of every value (two axes when the map asks for it)
            axes = m.get("matrix") or [first]
            a = axes[0]
            if len(axes) > 1:
                b = axes[1]
                lines += [
                    "",
                    "export const AllVariants: Story = {",
                    "  name: 'All variants',",
                    "  render: (args) => (",
                    "    <div className=\"sb-col\">",
                    f"      {{{js(variants[a])}.map((x) => (",
                    "        <div key={x}>",
                    f"          <div className=\"sb-cell-label ts-xs-medium\">{a}={{x}}</div>",
                    f"          <div className=\"sb-row\">{{{js(variants[b])}.map((y) => <{exp} key={{y}} {{...args}} {{...{{ {js(a)}: x, {js(b)}: y }} as any}} />)}}</div>",
                    "        </div>",
                    "      ))}",
                    "    </div>",
                    "  ),",
                    "};",
                ]
            else:
                lines += [
                    "",
                    "export const AllVariants: Story = {",
                    "  name: 'All variants',",
                    "  render: (args) => (",
                    "    <div className=\"sb-row\">",
                    f"      {{{js(variants[a])}.map((x) => (",
                    "        <div key={x}>",
                    f"          <div className=\"sb-cell-label ts-xs-medium\">{a}={{x}}</div>",
                    f"          <{exp} {{...args}} {{...{{ {js(a)}: x }} as any}} />",
                    "        </div>",
                    "      ))}",
                    "    </div>",
                    "  ),",
                    "};",
                ]
        if m.get("example"):
            lines += ["", f"export const InUse: Story = {{ name: 'In use (interactive)', render: () => {m['example']} }};"]

        safe = re.sub(r"[^0-9A-Za-z]+", "-", name).strip("-")
        path = out_root / re.sub(r"[^0-9A-Za-z]+", "-", group).strip("-") / f"{safe}.stories.tsx"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        written.append(path.relative_to(ROOT).as_posix())

    print(f"{len(written)} story files written under {out_root.relative_to(ROOT).as_posix()}")
    if rich_docs:
        print(f"{len(write_component_docs(folder))} component docs pages written (<name>.mdx)")
    else:
        print("autodocs pages only: run tools/storybook_docs.py for the Welcome, Foundations and full component docs")
    for n in missing:
        print(f"no entry in component-map.json for: {n}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
