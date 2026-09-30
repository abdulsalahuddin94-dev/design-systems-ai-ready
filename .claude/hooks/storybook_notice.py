"""SessionStart hook: tell the agent this repo has a live Storybook (information only).

Finds every <folder>/storybook/package.json, reports whether its packages are installed and
whether Storybook is already running on port 6006. The first reply mentions it in one line and
asks nothing about it: the intake asks about the project first, and Storybook questions come at
intake 0.7 or when the user picks a project with pending Storybook work (trial finding 2/3). Also runs the daily Storybook check (tools/project_status.py): projects whose
CHANGELOG.md has entries marked "Storybook synced: no". Output is JSON additionalContext (added to the session, not shown as an error).
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


def unsynced_projects():
    """Daily Storybook check: read each project's CHANGELOG.md only (Figma may be closed)."""
    try:
        sys.path.insert(0, str(ROOT / "tools"))
        import project_status
        rows = project_status.pending()
        libs = project_status.library_pending()
        later = project_status.storybook_later()
    except Exception:
        return ""
    later_text = "".join(f"- `{rel}`: Storybook plan is Later (ask again at: {when}).\n" for rel, when in later)
    lib_text = "".join(f"- `{rel}`: Design files still need Accept updates for the library: {', '.join(n)}. "
                       "Remind the user and update `status.json` when they confirm.\n" for rel, n in libs)
    if not rows:
        return lib_text + later_text
    lines = [f"- `{rel}`: {len(u)} change(s) since {s['unsynced_since']} not in Storybook"
             + ("" if s["has_storybook"] else " (no Storybook yet)") for rel, s, u in rows]
    return ("Projects with Figma changes not yet in Storybook (from CHANGELOG.md, Figma not read):\n"
            + "\n".join(lines)
            + "\nMention these in your first reply in one line each, without a question. When the user picks "
            "one of these projects (intake 0.0), ask whether to open its DS file with the Figma plugin (Desktop "
            "Bridge) and update its Storybook (Storybook_Design_System_Skill section 5). After an update run "
            "`python tools/project_status.py \"<folder>\" --mark-synced`.\n"
            + lib_text + later_text)


def main():
    books = sorted(p.parent for p in ROOT.glob("*/storybook/package.json"))
    books += sorted(p.parent for p in ROOT.glob("My Projects/*/storybook/package.json"))
    pending = unsynced_projects()
    if not books:
        if pending:
            print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": pending}}))
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
        + "In your first reply, mention in one short line that this repo has a Storybook, as information only: "
        "do not ask about it there. The first question is about the project (Design_System_Intake_Skill 0.0). "
        "Run or update the Storybook only when the user asks, at intake 0.7, or for a project with pending "
        "Storybook work. Run `npm install` only after the user says yes. Details: README.md > Storybook and "
        "Storybook_Design_System_Skill/SKILL.md.\n"
        + pending
    )
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": text}}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
