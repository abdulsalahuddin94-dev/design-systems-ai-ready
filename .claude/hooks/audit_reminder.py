"""Audit QA reminder, in two parts.

  python audit_reminder.py mark   PostToolUse on Figma write tools: remember that Figma changed.
  python audit_reminder.py stop   Stop hook: if Figma changed since the last audit, ask Claude
                                  (once) to run the QA checklist before ending the turn.

The marker lives in .claude/.state/ (git-ignored). Running the ds-auditor subagent, or any
figma audit tool, clears it.
"""
import json
import pathlib
import sys

STATE = pathlib.Path(__file__).resolve().parent.parent / ".state"
MARK = STATE / "figma-changed"

CHECKLIST = (
    "Figma was changed in this session and no audit has run since. Before you finish, run the "
    "QA checklist (Design_System_Intake_Skill/SKILL.md section 11), ideally through the "
    "ds-auditor subagent: 0 remote variables/styles, 0 raw hex/px values, 0 detached components, "
    "every property wired, contrast passing in Light and Dark, screenshots of every variant. "
    "If this was only a small tweak that is not a finished build step, say so in one line and stop."
)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}

    if mode == "mark":
        tool = data.get("tool_name", "")
        agent = (data.get("tool_input") or {}).get("subagent_type", "")
        if tool in ("Agent", "Task"):
            if agent == "ds-auditor":
                MARK.unlink(missing_ok=True)
        elif "audit" in tool or "lint" in tool:
            MARK.unlink(missing_ok=True)
        else:
            STATE.mkdir(exist_ok=True)
            MARK.write_text(tool, encoding="utf-8")
        return 0

    if mode == "clear":
        MARK.unlink(missing_ok=True)
        return 0

    if mode == "stop":
        if data.get("stop_hook_active") or not MARK.exists():
            return 0
        MARK.unlink(missing_ok=True)  # remind once, never loop
        print(json.dumps({"decision": "block", "reason": CHECKLIST}))
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
