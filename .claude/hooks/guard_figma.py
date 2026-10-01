"""PreToolUse hook for Figma write tools: enforces rules.json > off_limits.

- no-detach: blocks scripts that call detachInstance().
- originals-untouched: asks the user before any write script runs in an original reference
  template (file keys come from every */data/rules.json > off_limits.original_template_file_keys).
- read-only: denies write APIs in scripts that start with "// read-only" or run inside a read-only
  agent (ds-auditor, token-extractor, docs-writer), so auditors can use figma_execute safely.
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


sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from audit_reminder import WRITE as ANY_WRITE  # noqa: E402  (broad write-API pattern)

READ_ONLY_AGENTS = {"ds-auditor", "token-extractor", "docs-writer"}


def originals():
    keys = {}
    try:  # every reference library entry's original file is off-limits too (references.json)
        for e in json.loads((ROOT / "references.json").read_text(encoding="utf-8")).get("entries", []):
            if e.get("figma_file_key"):
                keys[e["figma_file_key"]] = e.get("name", e["id"])
    except Exception:
        pass
    for p in list(ROOT.glob("*/data/rules.json")) + list(ROOT.glob("Reference_Library/*/*/data/rules.json")):
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
    readonly = code.lstrip().startswith("// read-only") or data.get("agent_type") in READ_ONLY_AGENTS
    if readonly and ANY_WRITE.search(code):
        return decide("deny", "read-only script: this script is marked '// read-only' (or runs in a read-only agent "
                              "such as ds-auditor) but calls a write API. Auditors never edit Figma; report the "
                              "issue to the caller instead.")
    keys = originals()
    targets = [k for k in [ti.get("fileKey")] + list(ti.get("fileKeys") or []) if k]
    hit = [keys[k] for k in targets if k in keys]
    if hit and WRITE.search(code):
        return decide("ask", "off_limits originals-untouched: this script writes to the original template "
                             f"'{hit[0]}'. Work in a duplicate unless the user asked for this change in the original.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
