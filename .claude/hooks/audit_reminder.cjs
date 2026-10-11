// Audit QA reminder, in two parts.
//
//   node audit_reminder.cjs mark   PostToolUse on Figma write tools (and FigCli `eval` run through Bash):
//                                  remember that Figma changed, and remind at once when a write script
//                                  did not read its result back (DS.readBack, per-write check).
//   node audit_reminder.cjs stop   Stop hook: if Figma changed since the last audit, ask Claude
//                                  (once) to run the QA checklist before ending the turn.
//
// The marker lives in .claude/.state/ (git-ignored), one per session, so parallel sessions
// do not remind each other. Running the ds-auditor subagent, or any figma audit tool, clears it.
const fs = require("fs");
const path = require("path");
const { readInput, WRITE } = require("./_common.cjs");

const STATE = path.join(__dirname, "..", ".state");
const CHECKLIST =
  "Figma was changed in this session and no audit has run since. Before you finish, run the " +
  "QA checklist (Design_System_Intake_Skill section 11, `steps/finish.md`), ideally through the " +
  "ds-auditor subagent: 0 remote variables/styles, 0 raw hex/px values, 0 detached components, " +
  "every property wired, contrast passing in Light and Dark, screenshots of every variant. " +
  "If this was only a small tweak that is not a finished build step, say so in one line and stop.";

// Per-write check (idea from chudarin figma-plugin-api-rules, MIT): bindings fail silently, so every write
// script returns `await DS.readBack([...])`. When one did not, say so right away, not only at the end.
const READBACK = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext:
      "This Figma write script did not read its result back. Before the next write, run " +
      "`return await DS.readBack([<nodes it created or changed>])` (tools/figma_helpers.figma.js) and fix " +
      "anything in `raw` (rawCount must be 0). Rules: .claude/skills/figma-plugin-api-rules (hard rule 7).",
  },
};

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
    let code = ti.code || ti.javascript || "";
    if (tool === "Bash") {
      // FigCli Yolo: `node src/index.js eval "<code>"` or `... eval --file <script>`. Anything else: not Figma.
      const cmd = String(ti.command || "");
      if (!/index\.js["']?\s+eval\b/.test(cmd)) return 0;
      const file = cmd.match(/--file\s+("([^"]+)"|'([^']+)'|(\S+))/);
      if (file) {
        try { code = fs.readFileSync(path.resolve(data.cwd || ".", file[2] || file[3] || file[4]), "utf8"); }
        catch (e) { code = cmd; }
      } else code = cmd;
      if (/^\s*\/\/ read-only/.test(code) || /check_\w+\.figma\.js|figma_styles\.figma\.js|export_variables\.figma\.js/.test(cmd)) {
        if (/check_(bindings|screens)\.figma\.js/.test(cmd)) unlink(MARK); // a binding / screen check ran
        return 0;
      }
      if (!WRITE.test(code) || /globalThis\.DS\s*=/.test(code)) return 0; // installing the helpers changes nothing
      fs.mkdirSync(STATE, { recursive: true });
      fs.writeFileSync(MARK, "figcli-eval", "utf8");
      if (!/readBack|DS\.report/.test(code)) process.stdout.write(JSON.stringify(READBACK) + "\n");
      return 0;
    }
    if (tool === "Agent" || tool === "Task") {
      if (agent === "ds-auditor") unlink(MARK);
      // other agents: their own Figma tool calls trigger this hook themselves
    } else if (tool.includes("audit") || tool.includes("lint")) {
      unlink(MARK);
    } else if ((tool.includes("execute") || tool.includes("use_figma")) && (!WRITE.test(code) || /globalThis\.DS\s*=/.test(code))) {
      // read-only script (listing fonts, reading nodes): nothing changed
    } else {
      fs.mkdirSync(STATE, { recursive: true });
      fs.writeFileSync(MARK, tool, "utf8");
      if ((tool.includes("execute") || tool.includes("use_figma")) && !/readBack|DS\.report/.test(code)) {
        process.stdout.write(JSON.stringify(READBACK) + "\n");
      }
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

try { process.exitCode = main(); } catch (e) { process.exitCode = 0; }
