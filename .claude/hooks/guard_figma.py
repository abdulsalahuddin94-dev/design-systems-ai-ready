"""PreToolUse hook for Figma write tools: enforces rules.json > off_limits.

- no-detach: blocks scripts that call detachInstance().
- originals-untouched: asks the user before any write script runs in an original Trianglz
  template (file keys come from every */data/rules.json > off_limits.original_template_file_keys).
Reads the rules at run time, so editing rules.json changes what is enforced.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
WRITE = re.compile(r"\.(remove|setValueForMode|setBoundVariable|setProperties|appendChild|insertChild|resize|swapComponent)\s*\(|"
                   r"\.(name|fills|strokes|characters|cornerRadius|itemSpacing|description)\s*=[^=]|"
                   r"figma\.(create\w+|variables\.create\w+)\s*\(")


def originals():
    keys = {}
    for p in ROOT.glob("*/data/rules.json"):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
            keys.update(d.get("off_limits", {}).get("original_template_file_keys", {}))
        except Exception:
            pass
    return keys


def decide(decision, reason):
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
                                             "permissionDecision": decision,
                                             "permissionDecisionReason": reason}}))
    return 0


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    ti = data.get("tool_input", {}) or {}
    code = ti.get("code") or ti.get("javascript") or ""
    if "detachInstance(" in code:
        return decide("deny", "off_limits no-detach: never detach instances. Use instance swaps, slots or exposed "
                              "properties (component-registry.json > slots); if a swap is missing, fix the component.")
    keys = originals()
    targets = [k for k in [ti.get("fileKey")] + list(ti.get("fileKeys") or []) if k]
    hit = [keys[k] for k in targets if k in keys]
    if hit and WRITE.search(code):
        return decide("ask", "off_limits originals-untouched: this script writes to the original template "
                             f"'{hit[0]}'. Work in a duplicate unless the user asked for this change in the original.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
