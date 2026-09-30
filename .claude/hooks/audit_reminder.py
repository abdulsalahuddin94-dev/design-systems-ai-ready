"""Audit QA reminder, in two parts.

  python audit_reminder.py mark   PostToolUse on Figma write tools: remember that Figma changed.
  python audit_reminder.py stop   Stop hook: if Figma changed since the last audit, ask Claude
                                  (once) to run the QA checklist before ending the turn.

The marker lives in .claude/.state/ (git-ignored), one per session, so parallel sessions
do not remind each other. Running the ds-auditor subagent, or any
figma audit tool, clears it.
"""
import json
import pathlib
import re
import sys

STATE = pathlib.Path(__file__).resolve().parent.parent / ".state"
# Same write-API pattern as guard_figma.py: scripts without it are read-only and do not arm the reminder.
WRITE = re.compile(r"\.(remove|setValueForMode|setBoundVariable|setProperties|appendChild|insertChild|resize|resizeWithoutConstraints|"
                   r"swapComponent|setPluginData|setSharedPluginData|addComponentProperty|editComponentProperty|"
                   r"deleteComponentProperty|setExplicitVariableModeForCollection|setRangeFills|setRangeTextStyleId|"
                   r"setFillStyleIdAsync|setTextStyleIdAsync|setEffectStyleIdAsync|combineAsVariants|createInstance|"
                   r"setReactionsAsync|setVariableCodeSyntax|renameMode|addMode|removeMode)\s*\(|"
                   r"\.(name|fills|strokes|effects|characters|description|x|y|visible|opacity|locked|rotation|"
                   r"cornerRadius|topLeftRadius|topRightRadius|bottomLeftRadius|bottomRightRadius|cornerSmoothing|"
                   r"itemSpacing|counterAxisSpacing|padding\w*|layoutMode|layoutWrap|layoutAlign|layoutGrow|"
                   r"layoutPositioning|layoutSizingHorizontal|layoutSizingVertical|primaryAxisSizingMode|"
                   r"counterAxisSizingMode|primaryAxisAlignItems|counterAxisAlignItems|clipsContent|strokeWeight|"
                   r"strokeAlign|dashPattern|fontName|fontSize|lineHeight|letterSpacing|textAutoResize|"
                   r"textAlignHorizontal|textAlignVertical|fillStyleId|strokeStyleId|effectStyleId|textStyleId|"
                   r"gridStyleId|componentPropertyReferences|constraints|minWidth|maxWidth|minHeight|maxHeight|"
                   r"scopes|hiddenFromPublishing|expanded|resolvedType|currentPage)\s*=[^=]|"
                   r"figma\.(create\w+|variables\.create\w+|group|flatten|union|subtract|intersect|exclude)\s*\(")

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
    MARK = STATE / ("figma-changed-" + str(data.get("session_id") or "default"))

    if mode == "mark":
        tool = data.get("tool_name", "")
        agent = (data.get("tool_input") or {}).get("subagent_type", "")
        code = (data.get("tool_input") or {}).get("code") or (data.get("tool_input") or {}).get("javascript") or ""
        if tool in ("Agent", "Task"):
            if agent == "ds-auditor":
                MARK.unlink(missing_ok=True)
            # other agents: their own Figma tool calls trigger this hook themselves
        elif "audit" in tool or "lint" in tool:
            MARK.unlink(missing_ok=True)
        elif ("execute" in tool or "use_figma" in tool) and not WRITE.search(code):
            pass  # read-only script (listing fonts, reading nodes): nothing changed
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
