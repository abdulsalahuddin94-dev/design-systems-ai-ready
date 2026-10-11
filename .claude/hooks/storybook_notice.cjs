// SessionStart hook: tell the agent this repo has a live Storybook (information only).
//
// Finds every <folder>/storybook/package.json, reports whether its packages are installed and
// whether Storybook is already running on port 6006. The first reply mentions it in one line and
// asks nothing about it: the intake asks about the project first, and Storybook questions come at
// intake 0.7 or when the user picks a project with pending Storybook work (trial finding 2/3). Also
// runs the daily Storybook check (tools/project_status.py, when Python 3 is installed): projects whose
// CHANGELOG.md has entries marked "Storybook synced: no". Output is JSON additionalContext (added to
// the session, not shown as an error). Never fails: without Python it skips the check (setup_check.cjs
// offers the Python install).
// Also runs the Figma edit check (tools/figma_versions.cjs): projects whose DS file has Figma history
// versions newer than the last Storybook sync, which catches manual edits no CHANGELOG.md entry
// mentions. Needs the Figma token; without one, or offline, it is skipped (at most 3 s), and a missing
// or rejected token is mentioned once per machine (.claude/.state/figma-edit-check.json).
// Team projects only (status.json > collaboration = team): pulls their repos first (tools/team_sync.cjs).
const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const EDIT_STATE = path.join(__dirname, "..", ".state", "figma-edit-check.json");
// Windows "python" can be the Microsoft Store alias that only prints an install message, so try the
// py launcher first and check that the interpreter really runs.
const PYTHONS = [["py", ["-3"]], ["python3", []], ["python", []]];

function running(port) {
  return new Promise((resolve) => {
    const s = net.connect({ host: "127.0.0.1", port, timeout: 300 });
    const done = (ok) => { s.destroy(); resolve(ok); };
    s.on("connect", () => done(true));
    s.on("timeout", () => done(false));
    s.on("error", () => done(false));
  });
}

function python(code) {
  for (const [cmd, pre] of PYTHONS) {
    const r = spawnSync(cmd, pre.concat(["-c", code]), { cwd: ROOT, encoding: "utf8", timeout: 15000, windowsHide: true });
    if (!r.error && r.status === 0 && r.stdout) return r.stdout;
  }
  return null;
}

function unsyncedProjects() {
  // Daily Storybook check: read each project's CHANGELOG.md only (Figma may be closed).
  const hasProjects = subdirs(path.join(ROOT, "My Projects")).some(
    (d) => path.basename(d) !== "_Project_Template" && fs.existsSync(path.join(d, "CHANGELOG.md")));
  const out = python(hasProjects
    ? "import json, sys; sys.path.insert(0, 'tools'); import project_status as p; " +
      "print(json.dumps([p.pending(), p.library_pending(), p.storybook_later()], default=str))"
    : "print('[[], [], []]')");
  if (out === null) return ""; // setup_check.cjs offers the Python install
  let rows, libs, later;
  try { [rows, libs, later] = JSON.parse(out); } catch (e) { return ""; }
  const laterText = later.map(([rel, when]) => `- \`${rel}\`: Storybook plan is Later (ask again at: ${when}).\n`).join("");
  const libText = libs.map(([rel, n]) => `- \`${rel}\`: Design files still need Accept updates for the library: ${n.join(", ")}. ` +
    "Remind the user and update `status.json` when they confirm.\n").join("");
  if (!rows.length) return libText + laterText;
  const lines = rows.map(([rel, s, u]) => `- \`${rel}\`: ${u.length} change(s) since ${s.unsynced_since} not in Storybook` +
    (s.has_storybook ? "" : " (no Storybook yet)"));
  return "Projects with Figma changes not yet in Storybook (from CHANGELOG.md, Figma not read):\n" +
    lines.join("\n") +
    "\nMention these in your first reply in one line each, without a question. When the user picks " +
    "one of these projects (intake 0.0), ask with AskUserQuestion (Update now / Later) whether to open its DS " +
    "file with the Figma plugin (Desktop Bridge) and update its Storybook (Storybook_Design_System_Skill section 5). After an update run " +
    "`python tools/project_status.py \"<folder>\" --mark-synced`.\n" +
    libText + laterText;
}

// Said once per machine: no token, or Figma refused it. Recorded so later sessions stay quiet.
function onceFor(key) {
  let state = {};
  try { state = JSON.parse(fs.readFileSync(EDIT_STATE, "utf8")); } catch (e) {}
  if (state[key]) return false;
  state[key] = new Date().toISOString().slice(0, 10);
  try {
    fs.mkdirSync(path.dirname(EDIT_STATE), { recursive: true });
    fs.writeFileSync(EDIT_STATE, JSON.stringify(state, null, 2) + "\n", "utf8");
  } catch (e) {}
  return true;
}

function teamSync() {
  try { return require(path.join(ROOT, "tools", "team_sync.cjs")).pullAll(); } catch (e) { return ""; }
}

async function figmaEdits() {
  let res;
  try { res = await require(path.join(ROOT, "tools", "figma_versions.cjs")).check(); } catch (e) { return ""; }
  const { describe } = require(path.join(ROOT, "tools", "figma_versions.cjs"));
  let text = "";
  if (res.changed.length) {
    text += "Projects whose DS file changed in Figma since the last Storybook sync (Figma version history; " +
      "includes manual edits that CHANGELOG.md may not mention):\n" + res.changed.map(describe).join("\n") +
      "\nMention each in your first reply in one line, without a question (merge it with that project's " +
      "CHANGELOG line above if it has one). When the user picks one of these projects (intake 0.0), or at once " +
      "if they asked for Storybook work on it, Ask (choice) \"'<DS file>' was edited in Figma after the last " +
      "Storybook sync. Update the Storybook?\": \"Resync now (Recommended)\" (description: open the DS file " +
      "with the Desktop Bridge and run Storybook_Design_System_Skill section 5) / \"Later\" (description: ask " +
      "again next session) / \"Not needed\" (description: the edits do not affect the Storybook; record this " +
      "Figma version as synced) / \"Back\". Ask once per project, together with the CHANGELOG question when " +
      "both apply. After a resync `python tools/project_status.py \"<folder>\" --mark-synced` records the " +
      "version; for Not needed run `node tools/figma_versions.cjs \"<folder>\" --record`.\n";
  }
  if (res.eligible && !res.tok && onceFor("no_token")) {
    text += "Figma edit check skipped: no Figma token found (FIGMA_ACCESS_TOKEN in the figma-console MCP " +
      "config). Without it, manual Figma edits to a project's DS file are not detected at session start. " +
      "Offer the token setup once (Design_System_Intake_Skill 0b check 6). This notice is shown only once.\n";
  }
  if (res.errors.length && onceFor("token_refused")) {
    text += "Figma edit check: Figma refused the version history for " +
      res.errors.map((r) => `\`${r.rel}\` (${r.code || r.error})`).join(", ") +
      ". 401/403: the token is invalid or lacks the scope file_versions:read; 404: the DS file key in " +
      "status.json is wrong or the token's account cannot open it. Tell the user in one line " +
      "(Design_System_Intake_Skill 0b check 6). Shown once.\n";
  }
  return text;
}

function referenceStorybook() {
  // MCP name and port of the default Web reference's Storybook (references.json); no brand hardcoded.
  try {
    const refs = JSON.parse(fs.readFileSync(path.join(ROOT, "references.json"), "utf8"));
    const entry = refs.entries.find((e) => e.id === refs.default.web);
    return [entry.storybook.mcp_name, parseInt(entry.storybook.port, 10)];
  } catch (e) {
    return ["<project>-web-storybook", 6006];
  }
}

function subdirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(dir, d.name)).sort();
  } catch (e) {
    return [];
  }
}

function storybooks() {
  // */storybook, Reference_Library/*/*/storybook, My Projects/*/storybook
  const parents = subdirs(ROOT)
    .concat(...subdirs(path.join(ROOT, "Reference_Library")).map(subdirs))
    .concat(subdirs(path.join(ROOT, "My Projects")));
  return parents.map((p) => path.join(p, "storybook")).filter((b) => fs.existsSync(path.join(b, "package.json")));
}

function emit(text) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: text } }) + "\n");
}

async function main() {
  // Team projects pull first, so the changelog and Figma checks below see teammates' work.
  const books = storybooks();
  const pending = teamSync() + unsyncedProjects() + await figmaEdits();
  if (!books.length) {
    if (pending) emit(pending);
    return;
  }
  const lines = books.map((b) => {
    const rel = path.relative(ROOT, b).split(path.sep).join("/");
    const installed = fs.existsSync(path.join(b, "node_modules"));
    return `- \`${rel}\` (${installed ? "packages installed" : "packages NOT installed yet: needs `npm install`"})`;
  });
  const [name, port] = referenceStorybook();
  const live = await running(port);
  const url = `http://localhost:${port}`;
  emit(
    "This design-system repo has a live Storybook (documentation of the Figma design system: every " +
    "component with its variants, properties, use cases and tokens, names identical to Figma).\n" +
    lines.join("\n") + "\n" +
    (live
      ? `Storybook is running now at ${url} and its MCP server at ${url}/mcp ` +
        `(\`${name}\`, registered on this machine only). Use the MCP docs tools before building UI.\n`
      : "Storybook is not running. Start it with `npm install` (first time, needs Node.js 18+) then " +
        `\`npm run storybook\` inside the folder above; it serves ${url} and an MCP server at ` +
        `${url}/mcp (register it once per machine: ` +
        `\`claude mcp add --transport http ${name} ${url}/mcp --scope local\`).\n`) +
    "In your first reply, mention in one short line that this repo has a Storybook, as information only: " +
    "do not ask about it there. The first question is about the project (Design_System_Intake_Skill 0.0), " +
    "unless the user asked for quick mode (/ds-quick, Design_System_Intake_Skill/steps/quick-mode.md). " +
    "Run or update the Storybook only when the user asks, at intake 0.7, or for a project with pending " +
    "Storybook work. Run `npm install` only after the user says yes. Details: README.md > Storybook and " +
    "Storybook_Design_System_Skill/SKILL.md.\n" +
    pending
  );
}

main().catch(() => {}).finally(() => { process.exitCode = 0; });
