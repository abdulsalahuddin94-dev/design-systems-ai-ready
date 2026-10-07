// Audit QA reminder, in two parts.
//
//   node audit_reminder.cjs mark   PostToolUse on Figma write tools: remember that Figma changed.
//   node audit_reminder.cjs stop   Stop hook: if Figma changed since the last audit, ask Claude
//                                  (once) to run the QA checklist before ending the turn.
//
// The marker lives in .claude/.state/ (git-ignored), one per session, so parallel sessions
// do not remind each other. Running the ds-auditor subagent, or any figma audit tool, clears it.
const fs = require("fs");
const path = require("path");
const { readInput } = require("./_stdin.cjs");

const STATE = path.join(__dirname, "..", ".state");
// Same write-API pattern as guard_figma.cjs: scripts without it are read-only and do not arm the reminder.
const WRITE = new RegExp(
  String.raw`\.(remove|setValueForMode|setBoundVariable|setProperties|appendChild|insertChild|resize|resizeWithoutConstraints|` +
  String.raw`swapComponent|setPluginData|setSharedPluginData|addComponentProperty|editComponentProperty|` +
  String.raw`deleteComponentProperty|setExplicitVariableModeForCollection|setRangeFills|setRangeTextStyleId|` +
  String.raw`setFillStyleIdAsync|setTextStyleIdAsync|setEffectStyleIdAsync|combineAsVariants|createInstance|` +
  String.raw`setReactionsAsync|setVariableCodeSyntax|renameMode|addMode|removeMode)\s*\(|` +
  String.raw`\.(name|fills|strokes|effects|characters|description|x|y|visible|opacity|locked|rotation|` +
  String.raw`cornerRadius|topLeftRadius|topRightRadius|bottomLeftRadius|bottomRightRadius|cornerSmoothing|` +
  String.raw`itemSpacing|counterAxisSpacing|padding\w*|layoutMode|layoutWrap|layoutAlign|layoutGrow|` +
  String.raw`layoutPositioning|layoutSizingHorizontal|layoutSizingVertical|primaryAxisSizingMode|` +
  String.raw`counterAxisSizingMode|primaryAxisAlignItems|counterAxisAlignItems|clipsContent|strokeWeight|` +
  String.raw`strokeAlign|dashPattern|fontName|fontSize|lineHeight|letterSpacing|textAutoResize|` +
  String.raw`textAlignHorizontal|textAlignVertical|fillStyleId|strokeStyleId|effectStyleId|textStyleId|` +
  String.raw`gridStyleId|componentPropertyReferences|constraints|minWidth|maxWidth|minHeight|maxHeight|` +
  String.raw`scopes|hiddenFromPublishing|expanded|resolvedType|currentPage)\s*=[^=]|` +
  String.raw`figma\.(create\w+|variables\.create\w+|group|flatten|union|subtract|intersect|exclude)\s*\(`
);

const CHECKLIST =
  "Figma was changed in this session and no audit has run since. Before you finish, run the " +
  "QA checklist (Design_System_Intake_Skill section 11, `steps/finish.md`), ideally through the " +
  "ds-auditor subagent: 0 remote variables/styles, 0 raw hex/px values, 0 detached components, " +
  "every property wired, contrast passing in Light and Dark, screenshots of every variant. " +
  "If this was only a small tweak that is not a finished build step, say so in one line and stop.";

function unlink(p) {
  try { fs.unlinkSync(p); } catch (e) { /* missing is fine */ }
}

function main() {
  const mode = process.argv[2] || "";
  const data = readInput() || {};
  const MARK = path.join(STATE, "figma-changed-" + String(data.session_id || "default"));

  if (mode === "mark") {
    const tool = data.tool_name || "";
    const ti = data.tool_input || {};
    const agent = ti.subagent_type || "";
    const code = ti.code || ti.javascript || "";
    if (tool === "Agent" || tool === "Task") {
      if (agent === "ds-auditor") unlink(MARK);
      // other agents: their own Figma tool calls trigger this hook themselves
    } else if (tool.includes("audit") || tool.includes("lint")) {
      unlink(MARK);
    } else if ((tool.includes("execute") || tool.includes("use_figma")) && !WRITE.test(code)) {
      // read-only script (listing fonts, reading nodes): nothing changed
    } else {
      fs.mkdirSync(STATE, { recursive: true });
      fs.writeFileSync(MARK, tool, "utf8");
    }
    return 0;
  }

  if (mode === "clear") {
    unlink(MARK);
    return 0;
  }

  if (mode === "stop") {
    if (data.stop_hook_active || !fs.existsSync(MARK)) return 0;
    unlink(MARK); // remind once, never loop
    process.stdout.write(JSON.stringify({ decision: "block", reason: CHECKLIST }) + "\n");
    return 0;
  }
  return 0;
}

module.exports = { WRITE };

if (require.main === module) {
  try { process.exitCode = main(); } catch (e) { process.exitCode = 0; }
}
