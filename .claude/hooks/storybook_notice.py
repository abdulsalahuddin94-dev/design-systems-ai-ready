"""SessionStart hook: tell the agent this repo has a live Storybook and ask the user about it.

Finds every <folder>/storybook/package.json, reports whether its packages are installed and
whether Storybook is already running on port 6006, and asks Claude to raise it with the user in
its first reply. Output is JSON additionalContext (added to the session, not shown as an error).
"""
import json
import pathlib
import socket
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent


def running(port=6006):
    try:
        with socket.create_connection(("127.0.0.1", port), timeout=0.3):
            return True
    except OSError:
        return False


def main():
    books = sorted(p.parent for p in ROOT.glob("*/storybook/package.json"))
    if not books:
        return 0
    lines = []
    for b in books:
        rel = b.relative_to(ROOT).as_posix()
        installed = (b / "node_modules").exists()
        lines.append(f"- `{rel}` ({'packages installed' if installed else 'packages NOT installed yet: needs `npm install`'})")
    live = running()
    text = (
        "This design-system repo has a live Storybook (documentation of the Figma design system: every "
        "component with its variants, properties, use cases and tokens, names identical to Figma).\n"
        + "\n".join(lines)
        + "\n"
        + ("Storybook is running now at http://localhost:6006 and its MCP server at http://localhost:6006/mcp "
           "(registered in .mcp.json as `trianglz-web-storybook`). Use the MCP docs tools before building UI.\n"
           if live else
           "Storybook is not running. Start it with `npm install` (first time, needs Node.js 18+) then "
           "`npm run storybook` inside the folder above; it serves http://localhost:6006 and an MCP server at "
           "http://localhost:6006/mcp (registered in .mcp.json).\n")
        + "In your FIRST reply, tell the user in one short line that this repo has a Storybook and ask: "
        "\"Do you want me to run the Storybook, update it from Figma, or skip it for now?\" "
        "Run `npm install` only after the user says yes. Details: README.md > Storybook and "
        "Storybook_Design_System_Skill/SKILL.md."
    )
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": text}}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
