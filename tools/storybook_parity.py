"""Check that a Storybook uses exactly the Figma names from data/component-registry.json.

Usage:  python tools/storybook_parity.py Trianglz
Reads   <folder>/data/component-registry.json and <folder>/storybook/src/components/**/*.stories.tsx
Checks  - every registry component has a stories file whose title ends with the Figma name
        - every Figma variant and property name appears as an argTypes key (quoted, exact case)
        - every variant value appears in the story file
Exit code 1 when anything is missing, so it can gate a build.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    folder = ROOT / sys.argv[1]
    registry = json.loads((folder / "data" / "component-registry.json").read_text(encoding="utf-8"))
    stories = {}
    for f in (folder / "storybook" / "src").rglob("*.stories.tsx"):
        text = f.read_text(encoding="utf-8")
        m = re.search(r"title:\s*['\"]([^'\"]+)['\"]", text)
        if m:
            stories[m.group(1).split("/", 1)[-1] if "/" in m.group(1) else m.group(1)] = (f, text)

    problems, ok = [], 0
    for c in registry["components"]:
        name = c["name"]
        match = next((v for t, v in stories.items() if t == name or t.endswith("/" + name) or t.endswith(name)), None)
        if not match:
            problems.append(f"{name}: no stories file with this Figma name in its title")
            continue
        f, text = match
        rel = f.relative_to(ROOT).as_posix()
        for key in list(c.get("variants", {})) + list(c.get("properties", {})):
            if not re.search(r"['\"]" + re.escape(key) + r"['\"]\s*:|\b" + re.escape(key) + r"\s*:", text):
                problems.append(f"{name}: property/variant '{key}' missing in argTypes ({rel})")
        for key, values in c.get("variants", {}).items():
            for v in values:
                if f"'{v}'" not in text and f'"{v}"' not in text:
                    problems.append(f"{name}: value '{key}={v}' missing ({rel})")
        ok += 1

    print(f"{ok}/{len(registry['components'])} components have stories; {len(problems)} name problems")
    for p in problems:
        print(" - " + p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
