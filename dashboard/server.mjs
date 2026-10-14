// Local dashboard for the workflow. It runs Claude Code in the Root through the Claude Agent SDK,
// so every skill, rule, hook and memory file works exactly as in the terminal. The browser only
// shows the conversation: AskUserQuestion menus become buttons, permission prompts become cards,
// screenshots Claude reads are shown inline.
//
//   node dashboard/server.mjs            (or double-click Start-Dashboard.cmd / Start-Dashboard.command)
//   http://localhost:4777                listens on this computer only
//
// Nothing here changes how the workflow behaves; it is a window onto the same Claude Code session.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { query } from "@anthropic-ai/claude-agent-sdk";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PROJECTS = path.join(ROOT, "My Projects");
const PUBLIC = path.join(HERE, "public");
const STATE = path.join(ROOT, ".claude", ".state");
const HISTORY = path.join(STATE, "dashboard-sessions.json");
const PORT = Number(process.env.DASHBOARD_PORT || 4777);
const HOST = "127.0.0.1";

// ---------- small helpers ----------
const readJson = (file, fallback = null) => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
};
const readText = (file) => {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
};
const send = (res, code, body, type = "application/json; charset=utf-8") => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const readBody = (req) => new Promise((resolve) => {
  let data = "";
  req.on("data", (c) => { data += c; if (data.length > 25e6) req.destroy(); });
  req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); } });
});
const git = (args, timeout = 20000) => {
  const r = spawnSync("git", ["-C", ROOT, ...args], { encoding: "utf8", timeout, windowsHide: true });
  return { ok: !r.error && r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).trim() };
};

// ---------- projects ----------
// Folders listed in private/dashboard-hidden.txt (one name per line, git-ignored) never appear.
function hiddenProjects() {
  return new Set(readText(path.join(ROOT, "private", "dashboard-hidden.txt"))
    .split(/\r?\n/).map((s) => s.trim().toLowerCase()).filter((s) => s && !s.startsWith("#")));
}

function briefLine(brief, label) {
  const m = brief.match(new RegExp(`^\\s*-?\\s*${label}:\\s*(.+)$`, "mi"));
  const v = m ? m[1].trim() : "";
  return v && !v.startsWith("<") ? v : "";
}

function latestChange(changelog) {
  const m = changelog.match(/^## (\d{4}-\d{2}-\d{2})\s*-?\s*(.*)$/m);
  if (!m || m[2].startsWith("<")) return null;
  return { date: m[1], title: m[2].trim() };
}

function unsynced(changelog) {
  return (changelog.match(/^\s*-\s*Storybook synced:\s*no\b/gim) || []).length;
}

function links(status, brief) {
  const out = [];
  const ds = status?.figma?.design_system;
  if (ds?.url) out.push({ kind: "figma", label: ds.name || "Design System", url: ds.url });
  for (const f of status?.figma?.design_files || []) if (f?.url) out.push({ kind: "figma", label: f.name || "Design file", url: f.url });
  const team = status?.team?.repo;
  if (team) out.push({ kind: "github", label: "Team repo", url: team });
  const pages = (JSON.stringify(status || {}) + "\n" + brief).match(/https:\/\/[\w.-]+\.github\.io\/[^\s"')>\]]*/g) || [];
  for (const url of new Set(pages)) out.push({ kind: "storybook", label: "Storybook", url });
  return out;
}

function listProjects() {
  const hidden = hiddenProjects();
  let dirs = [];
  try {
    dirs = fs.readdirSync(PROJECTS, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".") && !hidden.has(d.name.toLowerCase()));
  } catch { return []; }
  return dirs.map((d) => {
    const folder = path.join(PROJECTS, d.name);
    const status = readJson(path.join(folder, "status.json"), {});
    const brief = readText(path.join(folder, "Project_Brief.md"));
    // Fenced blocks hold the entry format example, not real entries.
    const changelog = readText(path.join(folder, "CHANGELOG.md")).replace(/```[\s\S]*?```/g, "");
    let mtime = 0;
    for (const f of ["CHANGELOG.md", "status.json", "Project_Brief.md"]) {
      try { mtime = Math.max(mtime, fs.statSync(path.join(folder, f)).mtimeMs); } catch {}
    }
    return {
      name: d.name,
      title: (status.project && !String(status.project).startsWith("<")) ? status.project : d.name.replace(/_/g, " "),
      platform: briefLine(brief, "Platform").split("->")[0].trim(),
      phase: briefLine(brief, "Phase"),
      next: briefLine(brief, "Next step \\(the next session starts here, Intake section 0c\\)") || briefLine(brief, "Next step"),
      last: latestChange(changelog),
      unsynced: unsynced(changelog),
      team: String(status.collaboration || "").toLowerCase() === "team",
      storybook: !!status.has_storybook,
      links: links(status, brief),
      updated: mtime,
    };
  }).sort((a, b) => b.updated - a.updated);
}

// ---------- workflow updates (git) ----------
function workflowInfo(fetch) {
  if (!fs.existsSync(path.join(ROOT, ".git"))) return { git: false };
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).out;
  if (fetch) git(["fetch", "--quiet", "origin", "master"], 15000);
  const behind = git(["rev-list", "--count", "HEAD..origin/master"]);
  // One line per merged pull request: "#51 · <its title>".
  const changes = git(["log", "--first-parent", "--format=%s%x1f%b%x1e", "-n", "15", "HEAD..origin/master"]).out
    .split("\x1e").map((r) => r.trim()).filter(Boolean)
    .map((r) => {
      const [subject, body = ""] = r.split("\x1f");
      const pr = subject.match(/^Merge pull request (#\d+)/);
      return pr ? `${pr[1]} · ${body.trim().split("\n")[0] || "update"}` : subject;
    });
  const dirty = git(["status", "--porcelain", "--untracked-files=no"]).out.split("\n").filter(Boolean)
    .map((l) => l.slice(3));
  return { git: true, branch, behind: behind.ok ? Number(behind.out) : 0, changes, dirty, head: git(["log", "-1", "--format=%h %cs"]).out };
}

function updateWorkflow() {
  const info = workflowInfo(true);
  if (!info.git) return { ok: false, message: "This folder is not a Git clone, so it cannot update itself." };
  if (info.branch !== "master") return { ok: false, message: `The workflow folder is on the branch "${info.branch}", not master. Switch to master first (ask Claude).` };
  const r = git(["pull", "--ff-only", "origin", "master"], 60000);
  if (!r.ok) {
    return { ok: false, message: "The update stopped without changing anything. Your local edits in these files touch the same lines: " + (info.dirty.join(", ") || "see details") + ". Ask Claude to help.", details: r.out };
  }
  return { ok: true, message: "Workflow updated.", details: r.out, needsInstall: /dashboard\/package(-lock)?\.json/.test(r.out) };
}

// ---------- Claude sessions ----------
const sessions = new Map(); // id -> session

function saveHistory(s) {
  const all = readJson(HISTORY, []);
  const row = { id: s.id, claudeSessionId: s.claudeSessionId, project: s.project, title: s.title, started: s.started, updated: Date.now() };
  const next = [row, ...all.filter((r) => r.id !== s.id)].slice(0, 40);
  try { fs.mkdirSync(STATE, { recursive: true }); fs.writeFileSync(HISTORY, JSON.stringify(next, null, 2)); } catch {}
}

function emit(s, event) {
  event.at = Date.now();
  s.log.push(event);
  if (s.log.length > 4000) s.log.splice(0, s.log.length - 4000);
  const line = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of s.clients) res.write(line);
}

// A queue the SDK reads user messages from, so one Claude session lasts the whole conversation.
function inbox() {
  const items = [];
  let wake = null;
  let closed = false;
  return {
    push(msg) { items.push(msg); wake?.(); },
    close() { closed = true; wake?.(); },
    async *[Symbol.asyncIterator]() {
      while (true) {
        while (items.length) yield items.shift();
        if (closed) return;
        await new Promise((r) => { wake = r; });
        wake = null;
      }
    },
  };
}

function userMessage(text, images = []) {
  const content = [];
  for (const img of images) {
    const m = String(img).match(/^data:(image\/(?:png|jpeg|gif|webp));base64,(.+)$/);
    if (m) content.push({ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } });
  }
  if (text) content.push({ type: "text", text });
  return { type: "user", message: { role: "user", content }, parent_tool_use_id: null, session_id: "" };
}

function toolSummary(name, input = {}) {
  const short = (v, n = 90) => { const s = String(v ?? "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
  const rel = (p) => { try { return path.relative(ROOT, String(p)).split(path.sep).join("/") || String(p); } catch { return String(p); } };
  switch (name) {
    case "Bash": return input.description || short(input.command);
    case "Read": case "Write": case "Edit": case "NotebookEdit": return rel(input.file_path || input.notebook_path || "");
    case "Glob": case "Grep": return short(input.pattern);
    case "Skill": return input.skill || "";
    case "Agent": case "Task": return input.description || short(input.prompt);
    case "WebFetch": return short(input.url);
    case "WebSearch": return short(input.query);
    case "TodoWrite": return "Updated the plan";
    default: return short(Object.values(input).find((v) => typeof v === "string") || "");
  }
}

function friendlyTool(name) {
  if (name.startsWith("mcp__")) {
    const [, server, tool] = name.split("__");
    return `${server}: ${(tool || "").replace(/_/g, " ")}`;
  }
  return { Bash: "Ran a command", Read: "Read", Write: "Wrote", Edit: "Edited", Glob: "Looked for files", Grep: "Searched",
    Skill: "Loaded skill", Agent: "Started a helper", Task: "Started a helper", WebFetch: "Opened", WebSearch: "Searched the web",
    TodoWrite: "Plan" }[name] || name;
}

// The installed Claude Code is preferred, so the dashboard uses the same version and login as the terminal.
function claudeExecutable() {
  if (process.env.CLAUDE_CODE_PATH) return process.env.CLAUDE_CODE_PATH;
  const r = spawnSync(process.platform === "win32" ? "where" : "which", ["claude"], { encoding: "utf8", windowsHide: true });
  const found = (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  // A Windows .cmd shim cannot be started directly; the SDK's own copy is used then.
  return found.find((p) => process.platform !== "win32" || /\.exe$/i.test(p));
}

function startSession({ prompt, project, title, images, resume }) {
  const id = crypto.randomUUID();
  const s = {
    id, project: project || null, title: title || (prompt || "").slice(0, 60) || "Conversation",
    started: Date.now(), log: [], clients: new Set(), pending: new Map(),
    inbox: inbox(), abort: new AbortController(), busy: true, claudeSessionId: resume || null, ended: false,
  };
  sessions.set(id, s);

  const canUseTool = (toolName, input, opts) => new Promise((resolve) => {
    const requestId = crypto.randomUUID();
    const done = (result) => { s.pending.delete(requestId); resolve(result); };
    s.pending.set(requestId, { toolName, input, resolve: done });
    opts.signal?.addEventListener("abort", () => done({ behavior: "deny", message: "Stopped by the user." }));
    if (toolName === "AskUserQuestion") {
      emit(s, { type: "question", requestId, questions: input.questions || [] });
    } else {
      emit(s, {
        type: "permission", requestId, tool: friendlyTool(toolName), detail: toolSummary(toolName, input),
        title: opts.title || "", reason: opts.decisionReason || "", canAlways: !!(opts.suggestions && opts.suggestions.length),
        suggestions: opts.suggestions || [],
      });
    }
  });

  const exe = claudeExecutable();
  const q = query({
    prompt: s.inbox,
    options: {
      cwd: ROOT,
      settingSources: ["user", "project", "local"],
      includePartialMessages: true,
      abortController: s.abort,
      canUseTool,
      ...(resume ? { resume } : {}),
      ...(exe ? { pathToClaudeCodeExecutable: exe } : {}),
    },
  });
  s.query = q;
  if (prompt || (images && images.length)) {
    s.inbox.push(userMessage(prompt, images));
    emit(s, { type: "user", text: prompt || "", images: images || [] });
  } else {
    s.busy = false;
  }
  emit(s, { type: "busy", busy: s.busy });
  pump(s).catch((err) => {
    const message = explainError(err);
    emit(s, message === AUTH_MESSAGE ? { type: "auth", message } : { type: "error", message });
  }).finally(() => {
    s.ended = true; s.busy = false;
    emit(s, { type: "busy", busy: false });
    emit(s, { type: "ended" });
  });
  saveHistory(s);
  return s;
}

// Claude Code's sign-in expired or is missing: shown as a card with a Sign in button, not as a reply.
const AUTH_RE = /failed to authenticate|oauth session|not logged in|please run \/login|invalid api key|authentication_error|credentials? (?:expired|not found)/i;
const AUTH_MESSAGE = "Claude Code needs you to sign in again on this computer.";

function explainError(err) {
  const msg = String(err?.message || err);
  if (AUTH_RE.test(msg)) return AUTH_MESSAGE;
  if (/ENOENT|spawn/i.test(msg)) return "Claude Code could not be started. Install it (https://claude.com/claude-code) or run Setup again.";
  return msg;
}

async function pump(s) {
  let liveText = false;
  for await (const m of s.query) {
    if (m.session_id && !s.claudeSessionId) { s.claudeSessionId = m.session_id; saveHistory(s); }
    if (m.type === "stream_event" && !m.parent_tool_use_id) {
      const ev = m.event;
      if (ev?.type === "content_block_delta" && ev.delta?.type === "text_delta") {
        liveText = true;
        emit(s, { type: "delta", text: ev.delta.text });
      }
      continue;
    }
    if (m.type === "assistant") {
      const sub = !!m.parent_tool_use_id;
      for (const block of m.message?.content || []) {
        if (block.type === "text" && !sub && block.text.length < 400 && AUTH_RE.test(block.text)) {
          emit(s, { type: "auth", message: AUTH_MESSAGE, detail: block.text });
          liveText = false;
        } else if (block.type === "text" && !sub && block.text.trim()) {
          emit(s, { type: "text", text: block.text, streamed: liveText });
          liveText = false;
        } else if (block.type === "tool_use" && block.name !== "AskUserQuestion") {
          emit(s, { type: "tool", id: block.id, name: friendlyTool(block.name), detail: toolSummary(block.name, block.input), sub });
        }
      }
      continue;
    }
    if (m.type === "user") {
      // Tool results: only images are shown (screenshots, exported frames), text stays out of the way.
      const content = Array.isArray(m.message?.content) ? m.message.content : [];
      for (const block of content) {
        if (block.type !== "tool_result" || !Array.isArray(block.content)) continue;
        for (const part of block.content) {
          if (part.type === "image" && part.source?.type === "base64") {
            emit(s, { type: "image", toolId: block.tool_use_id, src: `data:${part.source.media_type};base64,${part.source.data}` });
          }
        }
      }
      continue;
    }
    if (m.type === "result") {
      s.busy = false;
      const error = m.subtype !== "success" ? (m.errors || []).join(" ") || m.subtype : "";
      if (AUTH_RE.test(error)) emit(s, { type: "auth", message: AUTH_MESSAGE, detail: error });
      emit(s, { type: "result", ok: m.subtype === "success", turns: m.num_turns, ms: m.duration_ms, error: AUTH_RE.test(error) ? "" : error });
      emit(s, { type: "busy", busy: false });
      saveHistory(s);
    }
  }
}

function sendMessage(s, text, images) {
  if (s.ended) return false;
  s.busy = true;
  emit(s, { type: "user", text, images: images || [] });
  emit(s, { type: "busy", busy: true });
  s.inbox.push(userMessage(text, images));
  return true;
}

function answer(s, requestId, body) {
  const p = s.pending.get(requestId);
  if (!p) return false;
  if (p.toolName === "AskUserQuestion") {
    if (body.cancel) {
      p.resolve({ behavior: "deny", message: "The user closed the question without answering." });
    } else {
      const annotations = {};
      for (const [q, note] of Object.entries(body.notes || {})) if (note) annotations[q] = { notes: note };
      p.resolve({ behavior: "allow", updatedInput: { ...p.input, answers: body.answers || {}, ...(Object.keys(annotations).length ? { annotations } : {}) } });
    }
    emit(s, { type: "answered", requestId, answers: body.answers || {}, cancel: !!body.cancel });
  } else {
    if (body.allow) {
      p.resolve({ behavior: "allow", updatedInput: p.input, ...(body.always ? { updatedPermissions: s.log.find((e) => e.requestId === requestId)?.suggestions || [] } : {}) });
    } else {
      p.resolve({ behavior: "deny", message: body.message || "The user said no." });
    }
    emit(s, { type: "answered", requestId, allow: !!body.allow, always: !!body.always });
  }
  return true;
}

// Opens the same conversation in a terminal (claude --resume), for work that is easier there.
function openInTerminal(s) {
  if (!s.claudeSessionId) return { ok: false, message: "The conversation has not started yet." };
  const r = runInTerminal(`claude --resume ${s.claudeSessionId}`);
  return r.ok ? { ...r, message: "Opened in a terminal. Stop here first so both do not answer at once." } : r;
}

// Opens Claude Code in a terminal so the user can type /login (the sign-in needs their browser).
function openSignIn() {
  const r = runInTerminal("claude");
  return r.ok ? { ...r, message: "A terminal opened with Claude Code. Type /login there, finish in the browser, close it, then press Try again." } : r;
}

function runInTerminal(cmd) {
  try {
    if (process.platform === "win32") {
      spawn("cmd.exe", ["/c", "start", "", "cmd.exe", "/k", `cd /d "${ROOT}" && ${cmd}`], { detached: true, stdio: "ignore", windowsHide: false }).unref();
    } else if (process.platform === "darwin") {
      const script = `tell application "Terminal" to do script "cd ${JSON.stringify(ROOT).slice(1, -1).replace(/"/g, '\\"')} && ${cmd}"`;
      spawn("osascript", ["-e", script, "-e", 'tell application "Terminal" to activate'], { detached: true, stdio: "ignore" }).unref();
    } else {
      return { ok: false, message: `Run this in a terminal in the workflow folder: ${cmd}` };
    }
    return { ok: true, command: cmd };
  } catch (e) {
    return { ok: false, message: `Run this in a terminal in the workflow folder: ${cmd}` };
  }
}

function sessionSummary(s) {
  return { id: s.id, project: s.project, title: s.title, started: s.started, busy: s.busy, ended: s.ended, live: true, claudeSessionId: s.claudeSessionId };
}

// ---------- HTTP ----------
const MIME = { ".jpg": "image/jpeg", ".webp": "image/webp", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  let base = PUBLIC;
  if (rel.startsWith("/docs/")) { base = path.join(ROOT, "docs"); rel = rel.slice("/docs".length); }
  const file = path.resolve(base, "." + rel);
  if (!file.startsWith(base)) return send(res, 403, "Forbidden", "text/plain");
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, "Not found", "text/plain");
    send(res, 200, data, MIME[path.extname(file)] || "application/octet-stream");
  });
}

const server = http.createServer(async (req, res) => {
  // Local only: refuse requests that come from another site in the browser.
  const origin = req.headers.origin;
  if (origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return send(res, 403, { error: "forbidden" });
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;
  try {
    if (req.method === "GET" && p === "/api/projects") return send(res, 200, { projects: listProjects() });
    if (req.method === "GET" && p === "/api/workflow") return send(res, 200, workflowInfo(url.searchParams.get("fetch") === "1"));
    if (req.method === "POST" && p === "/api/workflow/update") return send(res, 200, updateWorkflow());
    if (req.method === "POST" && p === "/api/login") return send(res, 200, openSignIn());
    if (req.method === "GET" && p === "/api/sessions") {
      const live = [...sessions.values()].map(sessionSummary);
      const liveIds = new Set(live.map((s) => s.id));
      const past = readJson(HISTORY, []).filter((r) => !liveIds.has(r.id) && r.claudeSessionId);
      return send(res, 200, { live, past });
    }
    if (req.method === "POST" && p === "/api/sessions") {
      const body = await readBody(req);
      const s = startSession(body);
      return send(res, 200, sessionSummary(s));
    }
    const m = p.match(/^\/api\/sessions\/([\w-]+)(\/[\w-]+)?$/);
    if (m) {
      const s = sessions.get(m[1]);
      if (!s) return send(res, 404, { error: "This conversation is no longer running. Open it again from Home." });
      const action = m[2] || "";
      if (req.method === "GET" && action === "/events") {
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
        res.write(`data: ${JSON.stringify({ type: "hello", session: sessionSummary(s) })}\n\n`);
        for (const e of s.log) res.write(`data: ${JSON.stringify(e)}\n\n`);
        s.clients.add(res);
        const ping = setInterval(() => res.write(": ping\n\n"), 20000);
        req.on("close", () => { clearInterval(ping); s.clients.delete(res); });
        return;
      }
      const body = req.method === "POST" ? await readBody(req) : {};
      if (action === "/message") return send(res, sendMessage(s, body.text || "", body.images) ? 200 : 409, { ok: !s.ended });
      if (action === "/answer") return send(res, answer(s, body.requestId, body) ? 200 : 404, { ok: true });
      if (action === "/stop") { try { await s.query.interrupt(); } catch {} return send(res, 200, { ok: true }); }
      if (action === "/close") { s.inbox.close(); s.abort.abort(); sessions.delete(s.id); return send(res, 200, { ok: true }); }
      if (action === "/terminal") return send(res, 200, openInTerminal(s));
      return send(res, 404, { error: "unknown action" });
    }
    if (req.method === "GET" && !p.startsWith("/api/")) return serveStatic(req, res, p);
    send(res, 404, { error: "not found" });
  } catch (err) {
    send(res, 500, { error: String(err?.message || err) });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`The dashboard is already running: http://localhost:${PORT}`);
    process.exit(0);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Design systems Ai Ready - dashboard\n  http://localhost:${PORT}\n\n  Keep this window open while you use it. Close it to stop.\n`);
  if (process.argv.includes("--open")) {
    const url = `http://localhost:${PORT}`;
    const opener = process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
    try { spawn(opener[0], opener[1], { detached: true, stdio: "ignore" }).unref(); } catch {}
  }
});
