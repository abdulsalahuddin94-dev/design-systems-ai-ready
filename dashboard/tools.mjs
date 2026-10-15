// Other AI tools for the dashboard: detection, sign-in commands, handoff commands and token usage.
// Claude Code runs through the Agent SDK (server.mjs) and Gemini CLI through ACP inside the same conversation (acp.mjs).
// Codex and Antigravity open in their own window in the Root, with a handoff note, and ask their own approvals there.
// Nothing here stores passwords or tokens: each tool signs in with its own command and keeps its own login.
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const WIN = process.platform === "win32";

// What the Settings page shows. `run` marks the tools the dashboard can drive itself today.
export const TOOLS = [
  { id: "claude", name: "Claude Code", company: "Anthropic", bin: "claude", run: true, main: true,
    login: "claude", loginHint: "Type /login, finish in the browser, then close the window.",
    install: "https://claude.com/claude-code" },
  { id: "codex", name: "Codex", company: "OpenAI", bin: "codex", run: true,
    login: "codex login", loginHint: "Sign in with your ChatGPT account in the browser.",
    install: "https://developers.openai.com/codex/cli", models: [] },
  { id: "gemini", name: "Gemini CLI", company: "Google", bin: "gemini", run: true,
    login: "gemini", loginHint: "Pick \"Sign in with Google\", finish in the browser, then type /quit.",
    install: "https://github.com/google-gemini/gemini-cli", models: ["auto", "gemini-3-flash-preview", "gemini-3.1-pro-preview-customtools"],
    note: "Google's models. Antigravity is a desktop app with no command-line mode, so it opens as an app instead." },
  { id: "cursor", name: "Cursor CLI", company: "Cursor", bin: "cursor-agent", run: false,
    login: "cursor-agent login", install: "https://cursor.com/cli" },
  { id: "copilot", name: "Copilot CLI", company: "GitHub", bin: "copilot", run: false,
    login: "copilot", loginHint: "Type /login and finish in the browser.", install: "https://github.com/github/copilot-cli" },
];

export function which(bin) {
  const r = spawnSync(WIN ? "where" : "which", [bin], { encoding: "utf8", windowsHide: true });
  const found = (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (!found.length) return null;
  // npm installs a .cmd shim next to the .ps1 one; the .cmd (or .exe) is what Node can start.
  return found.find((p) => /\.(exe|cmd)$/i.test(p)) || found[0];
}

// A .cmd shim needs the shell; it gets one fixed command line (our own flags only, never user text).
const run = (exe, args, timeout = 20000) => {
  const viaShell = WIN && /\.cmd$/i.test(exe);
  const r = viaShell
    ? spawnSync(`"${exe}" ${args.join(" ")}`, { encoding: "utf8", timeout, windowsHide: true, shell: true })
    : spawnSync(exe, args, { encoding: "utf8", timeout, windowsHide: true });
  return { ok: !r.error && r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).replace(/\x1b\[[0-9;]*m/g, "").trim() };
};

// The Antigravity desktop app (no CLI): found by its install folder only.
function antigravityApp() {
  const local = process.env.LOCALAPPDATA || "";
  const candidates = WIN ? [path.join(local, "Programs", "Antigravity", "Antigravity.exe")] : ["/Applications/Antigravity.app"];
  return candidates.find((p) => { try { return fs.existsSync(p); } catch { return false; } }) || null;
}

let cache = null;
export function toolStatus(force, claudeAuth) {
  if (!force && cache && Date.now() - cache.at < 60000) return cache.value;
  const tools = TOOLS.map((t) => {
    const exe = which(t.bin);
    const row = { id: t.id, name: t.name, company: t.company, run: t.run, installed: !!exe, install: t.install,
      loginHint: t.loginHint || "", models: t.models || [], note: t.note || "", version: "", signedIn: null, account: "" };
    if (!exe) return row;
    row.version = (run(exe, ["--version"]).out.match(/\d+\.\d+(?:\.\d+)?/) || [""])[0];
    if (t.id === "claude") {
      const a = claudeAuth?.() || {};
      row.signedIn = a.known ? !!a.loggedIn : null;
      row.account = a.email || "";
    } else if (t.id === "codex") {
      const s = run(exe, ["login", "status"]).out;
      row.signedIn = /logged in/i.test(s) && !/not logged in/i.test(s);
      row.account = (s.match(/using (.+)$/im) || [])[1] || "";
    }
    // Gemini, Cursor and Copilot have no quick status command: null = "sign in once if asked".
    return row;
  });
  const app = antigravityApp();
  tools.push({ id: "antigravity", name: "Antigravity", company: "Google", run: false, app: true, installed: !!app,
    install: "https://antigravity.google", note: "Opens the workflow folder in the Antigravity app (it follows AGENTS.md).", signedIn: null });
  cache = { at: Date.now(), value: tools };
  return tools;
}

export const loginCommand = (id) => TOOLS.find((t) => t.id === id)?.login || null;
export const antigravityPath = () => antigravityApp();

// The command that opens a tool in its own window on the handoff note (relative path, no spaces).
// The tool runs interactively there, so it asks its own approvals; the dashboard only starts it.
export function handoffCommand(id, model, note) {
  const ask = note ? `Read ${note} and AGENTS.md, then continue the work described there.` : "Read AGENTS.md, then ask me what to work on.";
  const m = model && /^[\w.:-]+$/.test(model) ? model : "";
  if (id === "codex") return `codex ${m ? `-m ${m} ` : ""}"${ask}"`;
  if (id === "gemini") return `gemini ${m && m !== "auto" ? `-m ${m} ` : ""}-i "${ask}"`;
  if (id === "claude") return `claude "${ask}"`;
  return null;
}

// ---------- token usage (this computer only) ----------
export function usageStore(stateDir) {
  const file = path.join(stateDir, "dashboard-usage.json");
  const read = () => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; } };
  return {
    // One row per finished turn: which tool, which project, how many tokens.
    add(row) {
      if (!row || (!row.input && !row.output)) return;
      const all = read();
      all.push({ at: Date.now(), day: new Date().toISOString().slice(0, 10), ...row });
      try { fs.mkdirSync(stateDir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(all.slice(-5000))); } catch {}
    },
    summary() {
      const all = read();
      const today = new Date().toISOString().slice(0, 10);
      const weekAgo = Date.now() - 7 * 864e5;
      const sum = (rows) => rows.reduce((a, r) => ({ input: a.input + (r.input || 0), output: a.output + (r.output || 0), turns: a.turns + 1, cost: a.cost + (r.cost || 0) }), { input: 0, output: 0, turns: 0, cost: 0 });
      const byTool = {};
      for (const id of [...new Set(all.map((r) => r.tool))]) {
        const rows = all.filter((r) => r.tool === id);
        byTool[id] = { today: sum(rows.filter((r) => r.day === today)), week: sum(rows.filter((r) => r.at >= weekAgo)) };
      }
      const byProject = {};
      for (const r of all.filter((x) => x.at >= weekAgo)) {
        const k = r.project || "(no project)";
        byProject[k] ||= {};
        byProject[k][r.tool] = (byProject[k][r.tool] || 0) + (r.input || 0) + (r.output || 0);
      }
      const limits = all.filter((r) => r.limit).slice(-5).reverse();
      return { byTool, byProject, limits };
    },
  };
}

// A tool's message that says its plan or rate limit ran out.
export const LIMIT_RE = /usage limit|rate limit|limit reached|reached your .*limit|out of (?:extra )?usage|quota|429|too many requests|credit balance/i;
