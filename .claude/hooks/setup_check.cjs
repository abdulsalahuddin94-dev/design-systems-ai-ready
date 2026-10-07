// SessionStart hook: machine setup check, once per machine.
//
// Checks every dependency in tools/dependencies.json (version commands, or app paths for Figma Desktop).
// All found -> records them in .claude/.state/machine-setup.json (git-ignored) and stays silent; later
// sessions only compare that record with the list and skip the checks. Something missing -> nothing is
// recorded, and Claude is told what is missing and the install command for this OS, to offer the setup
// (Design_System_Intake_Skill/steps/machine-setup.md). Editing dependencies.json, or running
// `node .claude/hooks/run.cjs setup_check --force`, checks again. Never fails the session.
//   --force   ignore the record and check again
//   --report  print a plain-text table instead of hook JSON (for a manual run)
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const LIST = path.join(ROOT, "tools", "dependencies.json");
const STATE = path.join(__dirname, "..", ".state", "machine-setup.json");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const REPORT = args.includes("--report");

function versionAtLeast(found, min) {
  const a = (found.match(/\d+(\.\d+)*/) || [""])[0].split(".").map(Number);
  const b = String(min).split(".").map(Number);
  for (let i = 0; i < b.length; i++) {
    if ((a[i] || 0) !== b[i]) return (a[i] || 0) > b[i];
  }
  return true;
}

function expand(p) {
  return p.replace(/^~(?=[\\/])/, os.homedir()).replace(/%([^%]+)%/g, (m, v) => process.env[v] || m);
}

function check(dep) {
  const c = dep.check || {};
  for (const [cmd, ...a] of c.commands || []) {
    const r = spawnSync(cmd, a, { encoding: "utf8", timeout: 10000, windowsHide: true });
    const out = ((r.stdout || "") + (r.stderr || "")).trim();
    // The Windows Store "python" alias exits non-zero and prints no version, so it never counts.
    if (!r.error && r.status === 0 && /\d+\.\d+/.test(out)) {
      if (dep.min_version && !versionAtLeast(out, dep.min_version)) {
        return { ok: false, found: out.split("\n")[0], reason: `older than ${dep.min_version}` };
      }
      return { ok: true, found: out.split("\n")[0] };
    }
  }
  const paths = (c.paths || {})[process.platform];
  if (paths) {
    const hit = paths.map(expand).find((p) => fs.existsSync(p));
    if (hit) return { ok: true, found: hit };
  } else if (c.paths && !c.commands) {
    return { ok: true, found: "not checked on " + process.platform };
  }
  return { ok: false };
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return null; }
}

function emit(text) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: text } }) + "\n");
}

function main() {
  let raw;
  try { raw = fs.readFileSync(LIST, "utf8"); } catch (e) { return; }
  const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
  const deps = JSON.parse(raw).dependencies || [];
  const saved = readJson(STATE);
  if (!FORCE && !REPORT && saved && saved.list_hash === hash && saved.platform === process.platform && saved.all_ok) return;

  const results = deps.map((d) => ({ dep: d, ...check(d) }));
  const missing = results.filter((r) => !r.ok);
  if (REPORT) {
    for (const r of results) process.stdout.write(`${r.ok ? "OK     " : "MISSING"} ${r.dep.name}${r.found ? " (" + r.found + ")" : ""}${r.reason ? " - " + r.reason : ""}\n`);
  }
  if (!missing.length) {
    fs.mkdirSync(path.dirname(STATE), { recursive: true });
    fs.writeFileSync(STATE, JSON.stringify({
      list_hash: hash, platform: process.platform, all_ok: true, checked_at: new Date().toISOString(),
      found: Object.fromEntries(results.map((r) => [r.dep.id, r.found])),
    }, null, 2) + "\n");
    return;
  }
  try { fs.unlinkSync(STATE); } catch (e) { /* no record yet */ } // a missing tool cancels an old record
  if (REPORT) return;
  const plat = process.platform;
  const lines = missing.map((r) => {
    const d = r.dep;
    const cmd = d.install[plat];
    return `- ${d.name}${r.reason ? " (" + r.reason + ": " + r.found + ")" : ""}, needed for ${d.why}. ` +
      (cmd ? `Install: \`${cmd}\`` : `Install by hand: ${d.install.manual}`) +
      (d[`note_${plat}`] ? ` ${d[`note_${plat}`]}` : "");
  });
  emit(
    "Machine setup: this computer is missing workflow dependencies (from tools/dependencies.json):\n" +
    lines.join("\n") + "\n" +
    "Before the intake's first question, follow Design_System_Intake_Skill/steps/machine-setup.md: say in one line what is " +
    "missing and offer to set it up (one menu for all of them). Run the install commands only after the user's yes. " +
    "Nothing is recorded until everything is found, so this check repeats at each session start until then; once all are " +
    "installed it is recorded in .claude/.state/machine-setup.json and never runs again on this machine.\n"
  );
}

try { main(); } catch (e) { /* never fail the session */ }
process.exitCode = 0;
