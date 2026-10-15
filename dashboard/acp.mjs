// A small Agent Client Protocol (ACP) client: JSON-RPC 2.0, one JSON object per line over the agent's stdin/stdout.
// Used to run Gemini CLI (`gemini --acp`) inside a dashboard conversation. The agent asks before every step that
// needs permission (session/request_permission); the dashboard shows that as a Yes / No card and waits for the click,
// so nothing runs unattended. File reads and writes stay with the agent (no fs or terminal capability is offered).
import { spawn } from "node:child_process";

const WIN = process.platform === "win32";

export function startAcp({ exe, args, cwd, onNotify, onRequest, onExit }) {
  // An npm .cmd shim needs the shell; it gets one fixed command line (our own flags only, never user text).
  const viaShell = WIN && /\.cmd$/i.test(exe);
  const proc = viaShell
    ? spawn(`"${exe}" ${args.join(" ")}`, { cwd, shell: true, windowsHide: true, stdio: ["pipe", "pipe", "pipe"] })
    : spawn(exe, args, { cwd, windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
  let nextId = 1;
  const waiting = new Map(); // id -> { resolve, reject }
  let buf = "";
  let stderr = "";
  let closed = false;

  const write = (msg) => { if (!closed) proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", ...msg }) + "\n"); };

  proc.stdout.on("data", (d) => {
    buf += d.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("{")) continue;
      let msg;
      try { msg = JSON.parse(line); } catch { continue; }
      if (msg.method && msg.id !== undefined) {
        // A request from the agent (permission, file access): answered when the handler resolves.
        Promise.resolve(onRequest(msg.method, msg.params || {}))
          .then((result) => write({ id: msg.id, result }))
          .catch((e) => write({ id: msg.id, error: { code: -32603, message: String(e?.message || e) } }));
      } else if (msg.method) {
        onNotify(msg.method, msg.params || {});
      } else if (waiting.has(msg.id)) {
        const w = waiting.get(msg.id);
        waiting.delete(msg.id);
        if (msg.error) {
          const err = new Error(msg.error.message || "Request failed");
          err.code = msg.error.code;
          err.data = msg.error.data;
          w.reject(err);
        } else w.resolve(msg.result);
      }
    }
  });
  proc.stderr.on("data", (d) => { stderr = (stderr + d.toString()).slice(-4000); });
  const finish = (code) => {
    if (closed) return;
    closed = true;
    const err = new Error(stderr.trim().split(/\r?\n/).slice(-3).join(" ") || `The tool stopped (exit ${code}).`);
    for (const w of waiting.values()) w.reject(err);
    waiting.clear();
    onExit?.(code, stderr);
  };
  proc.on("error", (e) => { stderr += `\n${e.message}`; finish(-1); });
  proc.on("exit", (code) => finish(code ?? -1));

  return {
    request(method, params) {
      if (closed) return Promise.reject(new Error("The tool is not running."));
      const id = nextId++;
      return new Promise((resolve, reject) => { waiting.set(id, { resolve, reject }); write({ id, method, params }); });
    },
    notify(method, params) { write({ method, params }); },
    get closed() { return closed; },
    kill() { closed = true; try { proc.kill(); } catch {} },
  };
}
