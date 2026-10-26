// Project pages (Pipeline, Review, Sync, Design, Connect, Plan): what one project's files say, for the dashboard.
// Read-only facts from the project folder (status.json, CHANGELOG.md, the live prototype's reports, the comment inbox);
// every action that changes something runs the workflow's own tools or starts a Claude conversation.
import fs from "node:fs";
import path from "node:path";

const readJson = (file, fallback = null) => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
};
const readText = (file) => {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
};
const mtime = (file) => {
  try { return fs.statSync(file).mtimeMs; } catch { return 0; }
};

// CHANGELOG entries, newest first: "## 2026-10-25 · title" or "## 2026-10-25 - title" (the format example is skipped).
export function changelogEntries(text, limit = 6) {
  const body = text.replace(/```[\s\S]*?```/g, "");
  const out = [];
  for (const m of body.matchAll(/^## (\d{4}-\d{2}-\d{2})\s*[·-]\s*(.+)$/gm)) {
    out.push({ date: m[1], title: m[2].trim() });
    if (out.length >= limit) break;
  }
  return out;
}

// Is the prototype's local dev server answering (Vite, port 5190 by default)?
async function localPreview(port = 5190) {
  const url = `http://127.0.0.1:${port}/`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(400) });
    return { running: r.ok, url: `http://localhost:${port}/` };
  } catch { return { running: false, url: `http://localhost:${port}/` }; }
}

export async function projectOverview(folder) {
  const status = readJson(path.join(folder, "status.json"), {});
  const proto = path.join(folder, "prototype");
  const has = fs.existsSync(path.join(proto, "package.json"));
  const registry = readJson(path.join(folder, "data", "component-registry.json"), {});
  const tokens = readJson(path.join(folder, "data", "tokens.json"), {});
  const screens = readJson(path.join(proto, "data", "screens.json"), null);
  const build = readJson(path.join(proto, "data", "build-report.json"), {});
  const code = readJson(path.join(proto, "data", "code-report.json"), null);
  const overrides = readJson(path.join(proto, "data", "overrides.json"), { changes: [] });
  const publish = readJson(path.join(proto, "data", "publish.json"), null);
  const inbox = readJson(path.join(proto, "comments", "inbox.json"), null);
  const fidelity = readJson(path.join(proto, "fidelity", "report.json"), []);
  const changelog = readText(path.join(folder, "CHANGELOG.md"));
  const scored = (Array.isArray(fidelity) ? fidelity : []).filter((r) => r.score1px != null && !r.codeAhead);
  const comments = inbox?.comments || [];
  const open = comments.filter((c) => c.status !== "resolved");
  const pending = status.prototype?.pending_figma_sync || [];
  const built = mtime(path.join(proto, "src", "generated", "routes.tsx"));
  const unpublished = publish && built > Date.parse(publish.at || 0) ? 1 : 0;
  const unsyncedStorybook = Number(status.unsynced_entries || 0);
  return {
    hasPrototype: has,
    ds: { components: (registry.components || []).length, tokens: Object.keys(tokens.variables || {}).length, storybook: !!status.has_storybook },
    screens: screens ? { count: new Set(screens.screens.map((s) => s.n.replace(/\s*\/\s*(Dark|Light)$/i, ""))).size, exportedAt: screens.exported_at, file: screens.file } : null,
    build: { screens: (build.screens || []).length, codeAhead: build.code_ahead || [], raw: build.raw || 0, missing: Object.keys(build.missing || {}).length },
    code: code ? { unknown: (code.unknown || []).length, raw: (code.raw || []).length } : null,
    fidelity: scored.length ? Math.round(scored.reduce((a, r) => a + r.score1px, 0) / scored.length * 100) / 100 : null,
    fidelityRows: Array.isArray(fidelity) ? fidelity.length : 0,
    comments: { pulledAt: inbox?.pulled_at || null, open: open.length, resolved: comments.length - open.length, byAuthor: open.reduce((m, c) => ({ ...m, [c.author || "Anonymous"]: (m[c.author || "Anonymous"] || 0) + 1 }), {}) },
    overrides: (overrides.changes || []).map((c) => ({ id: c.id, screen: c.screen, description: c.description, comment: c.comment })),
    pendingFigmaSync: pending,
    rules: status.prototype?.rules || [],
    publish: publish || (status.prototype?.url ? { url: status.prototype.url, at: null } : null),
    unpublished,
    local: has ? await localPreview() : { running: false },
    storybook: { unsynced: unsyncedStorybook },
    activity: changelogEntries(changelog),
    figma: status.figma ? { designSystem: status.figma.design_system?.name, designFiles: (status.figma.design_files || []).map((f) => f.name) } : null,
  };
}

// The five pipeline steps and the one next step, from the overview.
export function pipeline(o) {
  const steps = [];
  steps.push(o.ds.components
    ? { key: "ds", title: "Design System", state: "done", text: `${o.ds.components} components, ${o.ds.tokens} tokens${o.ds.storybook ? ". Storybook built." : "."}` }
    : { key: "ds", title: "Design System", state: "wait", text: "No components recorded yet." });
  steps.push(o.screens
    ? { key: "screens", title: "Screens (Figma)", state: "done", text: `${o.screens.count} screens, exported ${String(o.screens.exportedAt || "").slice(0, 10)}.` }
    : { key: "screens", title: "Screens (Figma)", state: "wait", text: "No screens exported to the prototype yet." });
  const codeBad = o.code && (o.code.unknown || o.code.raw);
  steps.push(!o.hasPrototype
    ? { key: "proto", title: "Live Prototype", state: "wait", text: "No prototype yet." }
    : codeBad ? { key: "proto", title: "Live Prototype", state: "prob", text: `Code check: ${o.code.unknown} unknown names, ${o.code.raw} raw values.` }
    : o.unpublished ? { key: "proto", title: "Live Prototype", state: "wait", text: "Built locally, not published yet." }
    : { key: "proto", title: "Live Prototype", state: "done", text: o.publish?.at ? `Published ${String(o.publish.at).slice(0, 16).replace("T", " ")}.` : "Published." });
  steps.push(o.comments.open
    ? { key: "review", title: "Review (Comments)", state: "wait", text: `${o.comments.open} open comment${o.comments.open > 1 ? "s" : ""}.` }
    : { key: "review", title: "Review (Comments)", state: "done", text: o.comments.pulledAt ? `No open comments (pulled ${String(o.comments.pulledAt).slice(0, 10)}).` : "No comments pulled yet." });
  const syncN = o.pendingFigmaSync.length + (o.storybook.unsynced ? 1 : 0);
  steps.push(syncN
    ? { key: "sync", title: "Sync", state: "prob", text: [o.pendingFigmaSync.length ? `${o.pendingFigmaSync.length} change${o.pendingFigmaSync.length > 1 ? "s" : ""} in the prototype, not in Figma.` : "", o.storybook.unsynced ? `${o.storybook.unsynced} Figma change${o.storybook.unsynced > 1 ? "s" : ""} not in Storybook.` : ""].filter(Boolean).join(" ") }
    : { key: "sync", title: "Sync", state: "done", text: "Prototype, Figma and Storybook agree." });
  let next = { title: "Everything is up to date", text: "Write in Design to change a screen, or wait for new comments.", go: "design", label: "Open Design" };
  if (o.comments.open) next = { title: `Triage ${o.comments.open} open comment${o.comments.open > 1 ? "s" : ""}`, text: "Claude proposes a change for each one; nothing is applied without your OK.", go: "review", label: "Open Review" };
  else if (codeBad) next = { title: "Fix the code check", text: "The reference code uses a name or value outside the design system.", go: "design", label: "Open Design" };
  else if (o.unpublished) next = { title: "Publish the prototype", text: "The local build has changes the live link does not have yet.", go: "design", label: "Open Design" };
  else if (o.pendingFigmaSync.length) next = { title: "Decide the Figma sync", text: "Changes made in the prototype are not in Figma yet.", go: "sync", label: "Open Sync" };
  return { steps, next };
}

export async function handleProjectApi(req, res, url, { send, projectDir }) {
  const m = url.pathname.match(/^\/api\/project\/([^/]+)\/([\w-]+)$/);
  if (!m) return false;
  const dir = projectDir(decodeURIComponent(m[1]));
  if (!dir) { send(res, 404, { error: "unknown project" }); return true; }
  if (req.method === "GET" && m[2] === "overview") {
    const o = await projectOverview(dir);
    send(res, 200, { overview: o, pipeline: pipeline(o) });
    return true;
  }
  send(res, 404, { error: "unknown project action" });
  return true;
}
