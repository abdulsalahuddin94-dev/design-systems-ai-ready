"""PreToolUse hook (Write|Edit|MultiEdit): block absolute machine paths in repo files.

Skills, briefs, memory and data must use paths relative to the Root, so the folder
works on any machine. Exit code 2 blocks the write and shows the reason to Claude.
"""
import json
import re
import sys

ABSOLUTE = re.compile(
    r"(?:(?<![A-Za-z0-9])[A-Za-z]:[\\/]+[A-Za-z0-9_]"   # D:\Work, C:/Users
    r"|(?<![A-Za-z0-9.:/])/(?:Users|home|mnt/[a-z])/[A-Za-z0-9_])"  # /Users/x, /home/x, /mnt/c/x
    r"[^\s`'\"<>|]{0,40}"
)
CHECKED = (".md", ".json", ".txt", ".mdx", ".ts", ".tsx", ".js", ".jsx", ".css", ".py", ".yml", ".yaml")


def texts(tool_input):
    for key in ("content", "new_string"):
        if isinstance(tool_input.get(key), str):
            yield tool_input[key]
    for edit in tool_input.get("edits", []) or []:
        if isinstance(edit.get("new_string"), str):
            yield edit["new_string"]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    tool_input = data.get("tool_input", {}) or {}
    path = (tool_input.get("file_path") or "").replace("\\", "/")
    root = (data.get("cwd") or "").replace("\\", "/").rstrip("/")
    # Only files inside this repo, and never the hook itself or local settings.
    if not path or (root and not path.lower().startswith(root.lower())):
        return 0
    if path.endswith(("block_absolute_paths.py", "settings.local.json")) or not path.lower().endswith(CHECKED):
        return 0
    hits = sorted({m.group(0) for t in texts(tool_input) for m in ABSOLUTE.finditer(t)})
    if hits:
        print(
            "Blocked: absolute machine path(s) found: " + ", ".join(hits) +
            ". Rewrite them relative to the repo Root (the folder with CLAUDE.md), "
            "e.g. Web_Design_System_Skill/SKILL.md. See CLAUDE.md > Rules.",
            file=sys.stderr,
        )
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
