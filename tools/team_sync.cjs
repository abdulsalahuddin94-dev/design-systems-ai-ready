// Team projects only (status.json > collaboration = "team", intake 0.3d, steps/team.md): keep the
// project folder's own Git repo in step with teammates. Solo projects are never touched.
//
//   node tools/team_sync.cjs                                  pull every team project (what the SessionStart hook runs)
//   node tools/team_sync.cjs --join <repo link>               clone a teammate's project into My Projects/<its folder name>
//   node tools/team_sync.cjs "My Projects/<P>" --push "<message>"
//                                                             commit the project folder and push (after each step)
//   node tools/team_sync.cjs "My Projects/<P>" --lock "<Component>"
//                                                             claim a component before editing it (exit 1 if a teammate holds it)
//   node tools/team_sync.cjs "My Projects/<P>" --unlock "<Component>"
//   node tools/team_sync.cjs "My Projects/<P>" --status       show locks and whether the folder is behind or ahead
//
// Pulls are fast-forward only (local edits are stashed and put back), so nothing is ever merged or
// overwritten silently: a diverged or conflicting folder is reported, never forced. The hook waits at
// most PULL_MS per project and stays quiet offline.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PULL_MS = 6000;
const STALE_DAYS = 2;

function git(folder, args, timeout = 20000) {
  const r = spawnSync("git", ["-C", folder, ...args], { encoding: "utf8", timeout, windowsHide: true });
  return { ok: !r.error && r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).trim(), timedOut: !!(r.error && r.error.code === "ETIMEDOUT") };
}

function readStatus(folder) {
  try { return JSON.parse(fs.readFileSync(path.join(folder, "status.json"), "utf8")); } catch (e) { return null; }
}

function writeStatus(folder, status) {
  fs.writeFileSync(path.join(folder, "status.json"), JSON.stringify(status, null, 2) + "\n", "utf8");
}

function rel(folder) {
  return path.relative(ROOT, folder).split(path.sep).join("/");
}

function teamProjects() {
  let dirs = [];
  try {
    dirs = fs.readdirSync(path.join(ROOT, "My Projects"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "_Project_Template")
      .map((d) => path.join(ROOT, "My Projects", d.name));
  } catch (e) {}
  return dirs.filter((f) => {
    const s = readStatus(f);
    return s && String(s.collaboration || "").toLowerCase() === "team" && fs.existsSync(path.join(f, ".git"));
  });
}

function me(folder) {
  return git(folder, ["config", "user.name"]).out || process.env.USERNAME || process.env.USER || "unknown";
}

function ageDays(since) {
  return (Date.now() - Date.parse(since)) / 86400000;
}

function locksOf(status) {
  return ((status.team || {}).locks || []).filter((l) => l && l.component);
}

// Fast-forward pull with local edits stashed and restored. -> {ok, pulled: [authors], note}
function pull(folder, timeout = PULL_MS) {
  if (!git(folder, ["rev-parse", "--abbrev-ref", "@{u}"]).ok) return { ok: false, note: "no upstream branch (run --push once)" };
  const before = git(folder, ["rev-parse", "HEAD"]).out;
  const r = git(folder, ["pull", "--ff-only", "--autostash", "-q"], timeout);
  if (!r.ok) {
    if (r.timedOut || /could not resolve|unable to access|timed out|network/i.test(r.out)) return { ok: false, offline: true };
    return { ok: false, note: /diverg|not possible to fast-forward/i.test(r.out)
      ? "the folder and GitHub both have new commits (diverged)" : (r.out.split("\n").pop() || "pull failed") };
  }
  const after = git(folder, ["rev-parse", "HEAD"]).out;
  const authors = before === after ? [] :
    [...new Set(git(folder, ["log", "--format=%an", `${before}..${after}`]).out.split("\n").filter(Boolean))];
  return { ok: true, pulled: authors, commits: before === after ? 0 : git(folder, ["rev-list", "--count", `${before}..${after}`]).out };
}

// SessionStart: pull every team project, then list teammates' changes and locks. Never throws.
function pullAll() {
  const lines = [];
  for (const f of teamProjects()) {
    let r;
    try { r = pull(f); } catch (e) { continue; }
    if (r.offline) { lines.push(`- \`${rel(f)}\`: offline, not pulled; teammates' latest changes may be missing.`); continue; }
    if (!r.ok) { lines.push(`- \`${rel(f)}\`: not pulled: ${r.note}. Tell the user and resolve it with them (steps/team.md) before working on this project.`); continue; }
    if (r.commits && r.commits !== "0") lines.push(`- \`${rel(f)}\`: pulled ${r.commits} commit(s) from ${r.pulled.join(", ")}.`);
    const status = readStatus(f) || {};
    const mine = me(f);
    const held = locksOf(status).filter((l) => l.by !== mine);
    if (held.length) {
      lines.push(`- \`${rel(f)}\`: locked by teammates: ` + held.map((l) =>
        `${l.component} (${l.by} since ${String(l.since).slice(0, 10)}${ageDays(l.since) > STALE_DAYS ? ", stale" : ""})`).join("; ") + ".");
    }
  }
  if (!lines.length) return "";
  return "Team projects (status.json > collaboration = team; Git sync from tools/team_sync.cjs):\n" + lines.join("\n") +
    "\nMention these in your first reply in one line each. Pulled commits came from teammates: read their CHANGELOG.md " +
    "entries before building on them. Never edit a component a teammate has locked (steps/team.md).\n";
}

function commitAll(folder, message) {
  git(folder, ["add", "-A"]);
  if (git(folder, ["diff", "--cached", "--quiet"]).ok) return false;
  const r = git(folder, ["commit", "-q", "-m", message]);
  if (!r.ok) throw new Error(r.out);
  return true;
}

function pushWithRebase(folder) {
  let r = git(folder, ["push", "-q"], 30000);
  if (r.ok) return { ok: true };
  if (!git(folder, ["rev-parse", "--abbrev-ref", "@{u}"]).ok) {
    r = git(folder, ["push", "-q", "-u", "origin", "HEAD"], 30000);
    if (r.ok) return { ok: true };
  }
  const reb = git(folder, ["pull", "--rebase", "--autostash", "-q"], 30000);
  if (!reb.ok) {
    git(folder, ["rebase", "--abort"]);
    return { ok: false, note: "a teammate changed the same lines; nothing was pushed. Resolve with the user (steps/team.md)." };
  }
  r = git(folder, ["push", "-q"], 30000);
  return r.ok ? { ok: true } : { ok: false, note: r.out.split("\n").pop() };
}

function push(folder, message) {
  const committed = commitAll(folder, message);
  const r = pushWithRebase(folder);
  if (!r.ok) return console.log(`Not pushed: ${r.note}`), 1;
  console.log(committed ? `Committed and pushed: ${message}` : "Nothing new to commit; branch pushed.");
  return 0;
}

// Claim or release a component. Retries when a teammate pushed at the same moment.
function lock(folder, component, release) {
  const who = me(folder);
  for (let attempt = 0; attempt < 3; attempt++) {
    const p = pull(folder, 15000);
    if (!p.ok && !p.offline && !/no upstream/.test(p.note || "")) return console.log(`Lock not changed: ${p.note}`), 1;
    const status = readStatus(folder);
    if (!status) return console.log("No status.json in this folder."), 1;
    status.team = status.team || {};
    const locks = locksOf(status);
    const held = locks.find((l) => l.component === component);
    if (release) {
      if (!held) return console.log(`${component} is not locked.`), 0;
      if (held.by !== who) return console.log(`${component} is locked by ${held.by}; only they release it (or the user agrees to take over).`), 1;
      status.team.locks = locks.filter((l) => l !== held);
    } else {
      if (held && held.by !== who) {
        const stale = ageDays(held.since) > STALE_DAYS ? ` (stale: over ${STALE_DAYS} days)` : "";
        return console.log(`LOCKED: ${component} is being edited by ${held.by} since ${String(held.since).slice(0, 10)}${stale}.`), 1;
      }
      if (held) return console.log(`${component} is already locked by you.`), 0;
      status.team.locks = locks.concat({ component, by: who, since: new Date().toISOString() });
    }
    writeStatus(folder, status);
    git(folder, ["add", "status.json"]);
    const c = git(folder, ["commit", "-q", "-m", `${release ? "Unlock" : "Lock"} ${component} (${who})`, "--", "status.json"]);
    if (!c.ok) return console.log(`Lock not committed: ${c.out}`), 1;
    if (p.offline) return console.log(`${release ? "Unlocked" : "Locked"} ${component} locally; offline, push later with --push.`), 0;
    const r = git(folder, ["push", "-q"], 30000);
    if (r.ok) return console.log(`${release ? "Unlocked" : "Locked"} ${component} for ${who}.`), 0;
    // A teammate pushed first: drop this lock commit and try again on top of theirs.
    git(folder, ["reset", "-q", "--soft", "HEAD~1"]);
    git(folder, ["restore", "--staged", "--worktree", "status.json"]);
  }
  return console.log("Lock not changed: GitHub kept rejecting the push; try again."), 1;
}

function report(folder) {
  const status = readStatus(folder) || {};
  git(folder, ["fetch", "-q"], PULL_MS);
  const counts = git(folder, ["rev-list", "--left-right", "--count", "HEAD...@{u}"]).out.split(/\s+/);
  console.log(`${rel(folder)}: collaboration ${status.collaboration || "not set"}; ahead ${counts[0] || "?"}, behind ${counts[1] || "?"}`);
  const locks = locksOf(status);
  console.log(locks.length ? locks.map((l) => `  locked: ${l.component} by ${l.by} since ${l.since}`).join("\n") : "  no locks");
  return 0;
}

// Clone a teammate's project repo into My Projects/, named like their folder (status.json > project).
function join(url) {
  if (!url) return console.log("--join needs the repo link."), 1;
  const base = path.join(ROOT, "My Projects");
  const tmp = path.join(base, `.join-${Date.now()}`);
  const r = spawnSync("git", ["clone", "-q", url, tmp], { encoding: "utf8", timeout: 120000, windowsHide: true });
  if (r.error || r.status !== 0) {
    fs.rmSync(tmp, { recursive: true, force: true });
    return console.log(`Clone failed: ${((r.stderr || "") + (r.error ? r.error.message : "")).trim().split("\n").pop()}`), 1;
  }
  const status = readStatus(tmp) || {};
  const repoName = url.replace(/\.git$/, "").split(/[\/:]/).pop();
  const name = String(status.project || repoName).replace(/[\\/:*?"<>|]/g, "_");
  const dest = path.join(base, name);
  if (fs.existsSync(dest)) {
    fs.rmSync(tmp, { recursive: true, force: true });
    return console.log(`EXISTS: ${rel(dest)} is already there; nothing was overwritten.`), 1;
  }
  fs.renameSync(tmp, dest);
  if (String(status.collaboration || "").toLowerCase() !== "team") {
    console.log(`Note: ${rel(dest)} status.json does not say collaboration = team yet.`);
  }
  console.log(`Joined: ${rel(dest)}`);
  return 0;
}

function main(args) {
  if (args[0] === "--join") return join(args[1]);
  if (!args.length) {
    const text = pullAll();
    console.log(text || "No team projects to pull, or nothing new.");
    return 0;
  }
  const folder = path.resolve(ROOT, args[0]);
  const status = readStatus(folder);
  if (!status || String(status.collaboration || "").toLowerCase() !== "team") {
    console.log(`${rel(folder)} is not a team project (status.json > collaboration); nothing to sync.`);
    return 0;
  }
  if (!fs.existsSync(path.join(folder, ".git"))) {
    console.log(`${rel(folder)} has no Git repo yet; set it up first (steps/team.md).`);
    return 1;
  }
  const opt = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
  if (args.includes("--push")) return push(folder, opt("--push") || "Update project files");
  if (args.includes("--lock")) return lock(folder, opt("--lock"), false);
  if (args.includes("--unlock")) return lock(folder, opt("--unlock"), true);
  return report(folder);
}

module.exports = { pullAll };

if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.log(String(e.message || e)); process.exitCode = 1; }
}
