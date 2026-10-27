// Project pages: Pipeline, Plan, Design, Review, Sync, Connect services (#/project/<folder>/<page>), and the
// collapsible side menu. Uses app.js helpers ($, el, api, icon, start, showError, PROMPTS), so it loads before
// app.js and only runs once app.js has defined them.
"use strict";

const PROJECT_PAGES = [
  ["pipeline", "Pipeline", "i-pipe"],
  ["plan", "Plan", "i-docs"],
  ["design", "Design", "i-phone"],
  ["review", "Review", "i-message"],
  ["sync", "Sync", "i-refresh"],
  ["connect", "Connect services", "i-plug"],
];

// ---------- side menu: collapse to an icon rail ----------
function initRail() {
  const btn = document.getElementById("collapse");
  if (!btn) return;
  const set = (on) => {
    document.body.classList.toggle("rail", on);
    btn.setAttribute("aria-label", on ? "Expand the menu" : "Collapse the menu");
    btn.title = btn.getAttribute("aria-label");
    try { localStorage.setItem("menuRail", on ? "1" : "0"); } catch {}
  };
  let saved = null;
  try { saved = localStorage.getItem("menuRail"); } catch {}
  set(saved === "1");
  btn.addEventListener("click", () => set(!document.body.classList.contains("rail")));
  // tooltips for the rail: the label of each menu link
  for (const a of document.querySelectorAll(".side-nav a")) if (!a.dataset.tip) a.dataset.tip = a.textContent.trim();
}

// The project's pages in the side menu, under its name (only while a project page is open).
function drawProjectNav(name, title, page, counts = {}) {
  const box = document.getElementById("project-nav");
  if (!box) return;
  box.hidden = false;
  box.replaceChildren(
    el("h2", { class: "side-title" }, title),
    el("nav", { class: "side-nav project-nav", "aria-label": title },
      PROJECT_PAGES.map(([key, label, ic]) => el("a", { href: `#/project/${encodeURIComponent(name)}/${key}`, class: key === page ? "on" : null, "data-tip": label, "aria-current": key === page ? "page" : null },
        icon(ic), el("span", { class: "label" }, label),
        counts[key] ? el("span", { class: `count${key === "review" ? "" : " y"}` }, String(counts[key])) : null))));
}
function hideProjectNav() {
  const box = document.getElementById("project-nav");
  if (box) box.hidden = true;
}

const stateLabel = { done: "Done", wait: "Waiting on you", run: "Working…", prob: "Needs a look" };
const stateDot = { done: null, wait: "bad", run: "run", prob: "wait" };
const fmtDate = (s) => (s ? String(s).slice(0, 16).replace("T", " ") : "not recorded");

async function renderProjectPage(name, page) {
  const app = $("#app");
  const projectsList = await api("/api/projects").catch(() => ({ projects: [] }));
  const found = projectsList.projects.find((x) => x.name === name);
  const p = found && { ...found, title: String(found.title).replace(/_/g, " ") };
  if (!p) { app.replaceChildren(el("main", { class: "project" }, el("p", { class: "p-empty" }, "This project is not in My Projects."))); return; }
  let data = null;
  try { data = await api(`/api/project/${encodeURIComponent(name)}/overview`); } catch (e) { showError(e); }
  const o = data?.overview;
  drawProjectNav(name, p.title, page, o ? { review: o.comments.open, sync: o.pendingFigmaSync.length + (o.storybook.unsynced ? 1 : 0) } : {});
  const main = el("main", { class: "project" });
  app.replaceChildren(main);
  if (page === "pipeline") return drawPipeline(main, p, o, data?.pipeline);
  if (page === "review") return drawReview(main, p, o);
  if (page === "sync") return drawSync(main, p);
  if (page === "design") return drawDesign(main, p);
  if (page === "connect") return drawConnect(main, p);
  if (page === "plan") return drawPlan(main, p);
  main.append(el("p", { class: "p-empty" }, "Unknown page."));
}

function head(p, title, sub, right = []) {
  return el("div", {},
    el("div", { class: "crumbs" }, el("a", { href: "#/projects" }, "Projects"), ` / ${p.title}`),
    el("header", { class: "p-head" },
      el("div", {}, el("h1", {}, title), el("p", { class: "sub" }, sub)),
      el("div", { class: "right" }, right)));
}

function drawPipeline(main, p, o, pl) {
  const chat = el("button", { class: "ghost sm", type: "button", onclick: () => start({ prompt: PROMPTS.project(p.name), project: p.name, title: p.title }).catch(showError) }, icon("i-message"), "Continue in chat");
  const live = o?.publish?.url ? el("a", { class: "ghost sm", href: o.publish.url, target: "_blank", rel: "noopener" }, icon("i-external"), "Open live prototype") : null;
  main.append(head(p, "Pipeline", "Where the project is, and the one thing to do next.", [live, chat]));
  if (!o || !pl) { main.append(el("p", { class: "p-empty" }, "Could not read this project's files.")); return; }
  main.append(el("div", { class: "pipe" }, pl.steps.map((s, i) => el("div", { class: `step ${s.state}`, "data-step": s.key },
    el("span", { class: "n" }, String(i + 1).padStart(2, "0")), el("h3", {}, s.title),
    el("span", { class: "st" }, s.state === "done" ? icon("i-check", "ic") : el("span", { class: `dot ${stateDot[s.state]}` }), stateLabel[s.state]),
    el("p", {}, s.text)))));
  const ok = pl.next.go === "design" && pl.next.title.startsWith("Everything");
  main.append(el("div", { class: `next-step${ok ? " ok" : ""}` },
    el("div", { class: "t" }, el("span", { class: "kicker" }, "Next step"), el("b", {}, pl.next.title), el("span", { class: "muted small" }, pl.next.text)),
    el("button", { class: "primary", type: "button", onclick: () => { location.hash = `#/project/${encodeURIComponent(p.name)}/${pl.next.go}`; } }, pl.next.label, icon("i-right"))));
  main.append(el("dl", { class: "p-tally" },
    el("div", {}, el("dt", {}, "Fidelity"), el("dd", {}, o.fidelity != null ? `${o.fidelity}%` : "–")),
    el("div", { class: "mag" }, el("dt", {}, "Open comments"), el("dd", {}, String(o.comments.open))),
    el("div", { class: "warn" }, el("dt", {}, "Pending Figma sync"), el("dd", {}, String(o.pendingFigmaSync.length))),
    el("div", { class: "live" }, el("dt", {}, "Code check"), el("dd", {}, o.code ? `${o.code.unknown}/${o.code.raw}` : "–"))));
  const kv = [
    ["Live link", o.publish?.url ? el("a", { href: o.publish.url, target: "_blank", rel: "noopener", class: "mono" }, o.publish.url.replace(/^https?:\/\//, "")) : "not published"],
    ["Last publish", fmtDate(o.publish?.at)],
    ["Local preview", el("span", {}, el("span", { class: `dot ${o.local.running ? "good" : "wait"}` }), o.local.running ? ` running · ${o.local.url}` : " not running", o.unpublished ? el("span", { class: "unpub", style: "margin-left:6px" }, "unpublished changes") : null)],
    ["Screens", o.screens ? `${o.screens.count} from "${o.screens.file}"` : "none yet"],
    ["Code ahead of Figma", o.build.codeAhead.length ? o.build.codeAhead.join(", ") : "none"],
  ];
  main.append(el("div", { class: "grid2" },
    el("section", { class: "p-panel" }, el("h2", { class: "section-title" }, "Project status"),
      el("dl", { class: "p-kv" }, kv.flatMap(([k, v]) => [el("dt", {}, k), el("dd", {}, v)])),
      el("div", { class: "p-actions" },
        el("button", { class: "primary sm", type: "button", onclick: () => { location.hash = `#/project/${encodeURIComponent(p.name)}/design`; } }, "Open Design"),
        el("button", { class: "ghost sm", type: "button", onclick: () => { location.hash = `#/project/${encodeURIComponent(p.name)}/review`; } }, "Review"),
        el("button", { class: "ghost sm", type: "button", onclick: () => { location.hash = `#/project/${encodeURIComponent(p.name)}/sync`; } }, "Sync"))),
    el("section", { class: "p-panel" }, el("h2", { class: "section-title" }, "Activity"),
      el("div", { class: "p-feed" }, o.activity.length ? o.activity.map((a) => el("div", {}, el("time", {}, a.date), el("span", {}, a.title))) : el("p", { class: "muted" }, "No changelog entries yet.")))));
}

// ---------- Review: comments from the live prototype ----------
// Pull from Supabase, triage with Claude, decide here, reply and close. Changes are applied online in the
// prototype first (overrides); Figma sync is asked at the end, on the Sync page.
const REVIEW_PROMPTS = {
  triage: (p) => `Triage the open prototype comments of "${p}" (My Projects/${p}/prototype/comments/inbox.json). For each open comment write an entry in prototype/comments/triage.json: {"<id>": {"kind": "fix" | "decision" | "info", "proposal": "<what to change, DS components and tokens only>", "affects": ["<screen slugs>"], "status": "proposed"}}. Keep existing decisions. Do not change the prototype or Figma yet.`,
  apply: (p, c) => `Apply this approved prototype comment of "${p}" online in the prototype first (prototype/data/overrides.json, DS components and tokens only, then rebuild and check), and add it to status.json > prototype.pending_figma_sync. Do not touch Figma. Comment ${c.id} on ${c.screen}${c.component ? ` (${c.component})` : ""} by ${c.author || "Anonymous"}: "${c.body}"${c.triage?.proposal ? `. Proposal: ${c.triage.proposal}` : ""}. When done, tell me the reply to close it with.`,
  ask: (p, c) => `Help me decide on this prototype comment of "${p}" before anything changes. Comment ${c.id} on ${c.screen}${c.component ? ` (${c.component})` : ""} by ${c.author || "Anonymous"}: "${c.body}"${c.triage?.proposal ? `. Current proposal: ${c.triage.proposal}` : ""}. Give me the options with a recommendation.`,
};
const kindLabel = { fix: "Fix", decision: "Decision", info: "Info" };
const decisionLabel = { proposed: "Proposed", approved: "Approved", rejected: "Rejected", asked: "Asked in chat" };

async function drawReview(main, p, o) {
  const enc = encodeURIComponent(p.name);
  let filter = "open";
  let data = await api(`/api/project/${enc}/comments`).catch((e) => { showError(e); return { comments: [] }; });
  const notice = el("div", { class: "p-notice", role: "status", hidden: true });
  const showSchemaNotice = () => {
    notice.hidden = false;
    notice.replaceChildren(icon("i-alert"), el("span", {}, el("b", {}, "Supabase schema update needed: "), "replies and images need the current schema. "),
      el("a", { href: `#/project/${enc}/connect` }, "Open Connect services"));
  };
  const pull = el("button", { class: "ghost sm", type: "button" }, icon("i-download"), "Pull comments");
  pull.onclick = async () => {
    pull.disabled = true;
    try { data = await api(`/api/project/${enc}/comments/pull`, {}); toast(data.message || "Pulled."); draw(); }
    catch (e) { showError(e); }
    finally { pull.disabled = false; }
  };
  const triage = el("button", { class: "primary sm", type: "button", onclick: () => start({ prompt: REVIEW_PROMPTS.triage(p.name), project: p.name, title: `Triage comments: ${p.title}` }).catch(showError) }, icon("i-sparkles"), "Triage open comments");
  main.append(head(p, "Review", "Comments from the live prototype: decide, apply online, reply and close.", [pull, triage]), notice);
  const tabs = el("div", { class: "p-seg", role: "tablist", "aria-label": "Filter comments" });
  const pulled = el("span", { class: "muted small" });
  const list = el("div", { class: "rv-list" });
  main.append(el("div", { class: "rv-bar" }, tabs, pulled), list);

  // Where "Show on screen" opens: the local preview when it runs, else the live link.
  const base = o?.local?.running ? o.local.url : o?.publish?.url;
  const screenLink = (c) => base && c.screen ? `${base.replace(/\/?$/, "/")}#/${c.screen}?${new URLSearchParams({ mode: c.theme || "Dark", lang: c.lang || "en", comment: c.id })}` : null;

  async function closeWith(c, decision) {
    const reply = await askText({ title: "Reply & close", help: `The reply shows under ${c.author || "this"} comment in the prototype.`, okLabel: "Reply & close", placeholder: decision === "rejected" ? "Why it stays as it is…" : "What changed…" });
    if (!reply) return;
    try { data = await api(`/api/project/${enc}/comments/resolve`, { id: c.id, reply, decision }); notice.hidden = true; toast("Comment closed."); draw(); }
    catch (e) { if (/schema update needed/i.test(e.message)) showSchemaNotice(); else showError(e); }
  }
  async function setDecision(c, decision) {
    try { const r = await api(`/api/project/${enc}/comments/decide`, { id: c.id, decision }); c.triage = { ...(c.triage || {}), ...r.triage }; draw(); }
    catch (e) { showError(e); }
  }

  function card(c) {
    const t = c.triage;
    const open = c.status !== "resolved";
    const link = screenLink(c);
    const chat = (kind) => start({ prompt: REVIEW_PROMPTS[kind](p.name, c), project: p.name, title: `${kind === "apply" ? "Apply" : "Ask"}: ${c.screen}` }).catch(showError);
    const img = (f) => `/api/project/${enc}/comment-image?f=${encodeURIComponent(f)}`;
    return el("article", { class: `rv-card${open ? "" : " done"}`, "data-id": c.id },
      el("header", {},
        el("span", { class: "avatar", "aria-hidden": "true" }, (c.author || "?").trim().charAt(0).toUpperCase()),
        el("div", { class: "who" }, el("b", {}, c.author || "Anonymous"), el("span", { class: "muted small" }, `${fmtDate(c.created_at)} · ${c.theme || "-"} / ${(c.lang || "-").toUpperCase()} · ${c.viewport || "-"}`)),
        t?.kind ? el("span", { class: `tag k-${t.kind}` }, kindLabel[t.kind] || t.kind) : null,
        el("span", { class: `tag ${open ? "open" : "res"}` }, open ? (t?.status && t.status !== "proposed" ? decisionLabel[t.status] : "Open") : "Resolved")),
      el("div", { class: "where mono" }, c.screen || "-", c.component ? ` › ${c.component}` : "", c.figma_node ? ` · ${c.figma_node}` : ""),
      el("p", { class: "body", dir: "auto" }, c.body),
      c.localImages?.length ? el("div", { class: "thumbs" }, c.localImages.map((f, i) => el("a", { href: img(f), target: "_blank", rel: "noopener" },
        el("img", { src: img(f), alt: `Reference image ${i + 1}`, loading: "lazy" })))) : null,
      t?.proposal ? el("div", { class: "triage" }, el("span", { class: "kicker" }, "Proposal"), el("p", {}, t.proposal),
        t.affects?.length ? el("span", { class: "muted small" }, `Affects: ${t.affects.join(", ")}`) : null) : null,
      c.reply ? el("div", { class: "reply" }, el("span", { class: "kicker" }, "Reply"), el("p", { dir: "auto" }, c.reply)) : null,
      el("div", { class: "p-actions" },
        open ? [
          el("button", { class: "primary sm", type: "button", onclick: async () => { await setDecision(c, "approved"); chat("apply"); } }, icon("i-check"), "Apply online"),
          el("button", { class: "ghost sm", type: "button", onclick: () => setDecision(c, "rejected") }, icon("i-x"), "Reject"),
          el("button", { class: "ghost sm", type: "button", onclick: async () => { await setDecision(c, "asked"); chat("ask"); } }, icon("i-message"), "Ask"),
          el("button", { class: "ghost sm", type: "button", onclick: () => closeWith(c, t?.status && t.status !== "proposed" ? t.status : null) }, icon("i-send"), "Reply & close"),
        ] : null,
        link ? el("a", { class: "ghost sm", href: link, target: "_blank", rel: "noopener" }, icon("i-external"), "Show on screen") : null));
  }

  function draw() {
    const all = data.comments || [];
    const openN = all.filter((c) => c.status !== "resolved").length;
    tabs.replaceChildren(...[["open", `Open ${openN}`], ["resolved", `Resolved ${all.length - openN}`], ["all", `All ${all.length}`]].map(([k, label]) =>
      el("button", { type: "button", role: "tab", class: k === filter ? "on" : null, "aria-selected": String(k === filter), onclick: () => { filter = k; draw(); } }, label)));
    pulled.textContent = data.pulledAt ? `Pulled ${fmtDate(data.pulledAt)}` : "Not pulled yet";
    const shown = all.filter((c) => filter === "all" || (filter === "open") === (c.status !== "resolved")).reverse();
    list.replaceChildren(...(shown.length ? shown.map(card)
      : [el("p", { class: "p-empty" }, all.length ? (filter === "open" ? "No open comments. Everything is answered." : "Nothing here.") : "No comments yet. Pull comments to fetch them from the live prototype.")]));
  }
  draw();
}

// ---------- Sync: prototype <-> Figma <-> Storybook ----------
// Push / Pull only queue a request (data/sync-queue.json); "Run the queue in chat" hands the queued requests to
// Claude, who does the Figma and Storybook work with the workflow's rules and asks before each write.
const SYNC_PROMPT = (p, queue) => `Work through the queued sync requests of "${p}" (My Projects/${p}/data/sync-queue.json), one at a time, with the workflow's rules: open the right Figma file with the saved tool, ask me before each Figma write, audit after each change, then re-export so the prototype override reports "synced", update status.json > prototype.pending_figma_sync, the CHANGELOG and the Storybook as needed, and mark each request done in the queue. Requests:\n${queue.map((q, i) => `${i + 1}. [${q.kind}] ${q.title || q.ref}`).join("\n")}`;

async function drawSync(main, p) {
  const enc = encodeURIComponent(p.name);
  const pill = el("span", { class: "p-pill", role: "status" });
  const runBtn = el("button", { class: "primary sm", type: "button" }, icon("i-message"), "Run the queue in chat");
  main.append(head(p, "Sync", "What differs between the prototype, Figma and Storybook. Nothing moves without your click.", [pill, runBtn]));
  const body = el("div", {}, el("p", { class: "p-empty" }, "Reading the project and Figma's version history…"));
  main.append(body);
  let s;
  const load = async () => { s = await api(`/api/project/${enc}/sync`); draw(); };
  const act = async (url, item) => {
    try { s = await api(`/api/project/${enc}/${url}`, { ref: item.ref, title: item.title }); draw(); }
    catch (e) { showError(e); }
  };
  runBtn.onclick = () => s?.queue.length && start({ prompt: SYNC_PROMPT(p.name, s.queue), project: p.name, title: `Sync: ${p.title}` }).catch(showError);

  const row = (item, verb) => el("div", { class: `srow${item.queued ? " queued" : ""}`, "data-ref": item.ref },
    el("div", {}, el("b", {}, item.title),
      el("div", { class: "cmeta" }, (item.meta || [item.screen, item.comment ? "from a review comment" : null, item.approved ? `approved: ${item.approved}` : null, item.file ? `Figma: ${item.file}` : null]).filter(Boolean).map((t) => el("span", {}, t)))),
    item.queued
      ? el("div", { class: "p-actions" }, el("span", { class: "tag k-decision" }, "Queued"), el("button", { class: "ghost sm", type: "button", onclick: () => act("sync/unqueue", item) }, icon("i-undo"), "Undo"))
      : el("button", { class: "ghost sm", type: "button", onclick: () => act("sync/queue", item) }, verb));

  const side = (title, items, verb, allVerb, empty) => el("section", { class: "sheet sync-side" },
    el("div", { class: "shead" }, el("h3", {}, title),
      items.some((x) => !x.queued) ? el("button", { class: "ghost sm", type: "button", onclick: async () => { for (const x of items.filter((y) => !y.queued)) await act("sync/queue", x); } }, allVerb) : null),
    items.length ? items.map((x) => row(x, verb)) : el("p", { class: "muted srow-empty" }, empty));

  function draw() {
    pill.replaceChildren(el("span", { class: `dot ${s.figma.figcli ? "good" : "wait"}` }),
      s.figma.figcli ? ` FigCli connected${s.figma.designFiles[0] ? ` · ${s.figma.designFiles[0]}` : ""}` : " Figma not connected (FigCli port closed)");
    runBtn.disabled = !s.queue.length;
    runBtn.title = s.queue.length ? `${s.queue.length} queued request${s.queue.length > 1 ? "s" : ""}` : "Queue a push or pull first";
    body.replaceChildren(...[
      el("div", { class: "sync" },
        side("In the prototype, not in Figma", s.push, "Push to Figma", "Push all to Figma", "Nothing pending: every prototype change is in Figma."),
        side("In Figma, not in Storybook", s.pull, "Pull from Figma", "Pull all",
          s.figma.versionsError === "no-token" ? "No Figma token on this computer, so Figma's version history was not read. CHANGELOG shows nothing pending." : "Nothing pending: Storybook matches the DS file.")),
      s.queue.length ? el("p", { class: "note" }, `${s.queue.length} request${s.queue.length > 1 ? "s" : ""} queued. Nothing has changed in Figma or Storybook yet: run the queue in chat when you are ready.`) : null,
      s.rules.length ? el("section", { class: "p-panel", style: "margin-top:16px" }, el("h2", { class: "section-title" }, "Prototype rules (no Figma change)"),
        s.rules.map((r) => el("p", { class: "small" }, r.rule))) : null,
      el("p", { class: "note" }, "After a push: Figma audit, re-export, the override reports \"synced\" and the screen's source goes back to Figma.")].filter(Boolean));
  }
  await load().catch((e) => { body.replaceChildren(el("p", { class: "p-empty" }, "Could not read the sync state.")); showError(e); });
}

// ---------- Design: Lovable-like workspace ----------
// Left: this project's design conversation (the same chat as everywhere, mounted in a panel). Right: the prototype,
// local (Vite on this computer) or live (the published link). Publish runs tools/publish_prototype.cjs; Push to Figma
// only queues a request for the Sync page. Code first / Figma first is asked once per project.
const MODE_TEXT = {
  "code-first": ["Code first", "New screens and changes are built in the prototype first; Figma follows when you sync."],
  "figma-first": ["Figma first", "Changes are designed in the Figma Design file first, then the prototype is rebuilt from it."],
};
// Sent to Claude with the first message but not shown in the conversation (only the typed request is).
const DESIGN_CONTEXT = (p, mode, screen, where) => `Design workspace for "${p}" (My Projects/${p}), ${MODE_TEXT[mode][0].toLowerCase()}. ${mode === "code-first"
  ? "Build each change in the prototype first (prototype/data/overrides.json, or a code-first screen), rebuild and check it, and add it to status.json > prototype.pending_figma_sync. Do not touch Figma."
  : "Design each change in the Figma Design file first with the saved tool (ask me before each write), audit it, then re-export and rebuild the prototype."} Rules: only the project's design-system components and tokens (its Storybook React components and data/tokens.json), never raw values; a missing component or size is a DS gap: tell me and give me the options, never invent one. The preview shows "${screen}" (${where}). My request follows.`;
const designKey = (name) => `designChat:${name}`;
const readStore = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };
const writeStore = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

async function drawDesign(main, p) {
  const enc = encodeURIComponent(p.name);
  main.classList.add("design-ws");
  let st = await api(`/api/project/${enc}/design`).catch((e) => { showError(e); return null; });
  if (!st) { main.append(el("p", { class: "p-empty" }, "Could not read this project's prototype.")); return; }
  const view = { where: st.local.running ? "local" : "live", device: "phone", screen: st.screens[0]?.slug || "", mode: "Dark" };
  try { Object.assign(view, JSON.parse(localStorage.getItem(`designView:${p.name}`) || "{}")); } catch {}
  if (!st.screens.some((s) => s.slug === view.screen)) view.screen = st.screens[0]?.slug || "";
  const saveView = () => { try { localStorage.setItem(`designView:${p.name}`, JSON.stringify(view)); } catch {} };

  // ----- left: chat -----
  const modeSeg = el("div", { class: "p-seg", role: "radiogroup", "aria-label": "How changes start" });
  const chatBody = el("div", { class: "ws-chat" });
  const chatCol = el("section", { class: "ws-col", "aria-label": "Design conversation" },
    el("div", { class: "ws-head" },
      el("div", { class: "crumbs" }, el("a", { href: "#/projects" }, "Projects"), ` / ${p.title}`),
      el("div", { class: "row" }, el("h1", {}, "Design"), modeSeg),
      el("p", { class: "muted small" }, "Only design-system components and tokens. A missing component becomes a DS gap first.")),
    chatBody);

  const setMode = async (mode) => {
    try { st = await api(`/api/project/${enc}/design/mode`, { mode }); drawMode(); if (!sessionId()) drawStarter(); }
    catch (e) { showError(e); }
  };
  function drawMode() {
    modeSeg.replaceChildren(...Object.entries(MODE_TEXT).map(([k, [label, d]]) => el("button", { type: "button", role: "radio", class: st.designMode === k ? "on" : null, "aria-checked": String(st.designMode === k), title: d, onclick: () => setMode(k) }, label)));
  }
  const sessionId = () => readStore(designKey(p.name))?.id || null;
  const screenName = () => st.screens.find((s) => s.slug === view.screen)?.name || view.screen || "no screen";

  // No conversation yet: ask Code first / Figma first (once per project), then a composer that starts one.
  function drawStarter() {
    if (!st.designMode) {
      chatBody.replaceChildren(el("div", { class: "ws-ask sheet" },
        el("span", { class: "kicker" }, "Before the first change"),
        el("h4", {}, "How should new screens and changes start in this project?"),
        el("div", { class: "opts-list" }, Object.entries(MODE_TEXT).map(([k, [label, d]]) =>
          el("button", { type: "button", class: "opt-btn", onclick: () => setMode(k) }, el("span", { class: "l" }, label), el("span", { class: "d" }, d)))),
        el("p", { class: "muted small" }, "You can switch it any time at the top of this panel.")));
      return;
    }
    const images = [];
    const thumbs = el("div", { class: "attachments" });
    const drawThumbs = () => thumbs.replaceChildren(...images.map((src, i) => el("figure", {}, el("img", { src, alt: "Image to send" }),
      el("button", { type: "button", "aria-label": "Remove", onclick: () => { images.splice(i, 1); drawThumbs(); } }, icon("i-x")))));
    const addFiles = (files) => { for (const f of files) { if (!/^image\/(png|jpeg|gif|webp)$/.test(f.type)) continue; const r = new FileReader(); r.onload = () => { images.push(r.result); drawThumbs(); }; r.readAsDataURL(f); } };
    const ta = el("textarea", { rows: "3", dir: "auto", "aria-label": "Describe a screen, a flow or a change", placeholder: "Describe a screen, a flow or a change… (Arabic or English). Ctrl+V pastes a screenshot." });
    const file = el("input", { type: "file", accept: "image/png,image/jpeg,image/gif,image/webp", multiple: true, hidden: true, onchange: (ev) => { addFiles(ev.target.files); ev.target.value = ""; } });
    const go = el("button", { class: "primary sm", type: "submit" }, icon("i-send"), "Build");
    ta.addEventListener("paste", (ev) => { const f = [...(ev.clipboardData?.files || [])]; if (f.length) { ev.preventDefault(); addFiles(f); } });
    ta.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); form.requestSubmit(); } });
    const form = el("form", { class: "ws-start", onsubmit: async (ev) => {
      ev.preventDefault();
      const text = ta.value.trim();
      if (!text && !images.length) return;
      go.disabled = true;
      try {
        const s = await api("/api/sessions", { prompt: text || "See the attached image.", context: DESIGN_CONTEXT(p.name, st.designMode, screenName(), view.where === "local" ? "local preview" : "live link"), images, project: p.name, title: `Design: ${p.title}` });
        writeStore(designKey(p.name), { id: s.id, claudeSessionId: s.claudeSessionId || null });
        mountChat(s.id);
      } catch (e) { showError(e); go.disabled = false; }
    } },
      thumbs, ta,
      el("div", { class: "row" },
        el("label", { class: "addimg", title: "Add an image (or paste one with Ctrl+V)" }, file, icon("i-plus"), el("span", { class: "sr" }, "Add an image")),
        el("span", { class: "muted small" }, "Ctrl+V to paste a screenshot"), el("span", { style: "flex:1" }), go));
    form.addEventListener("dragover", (ev) => ev.preventDefault());
    form.addEventListener("drop", (ev) => { ev.preventDefault(); addFiles(ev.dataTransfer.files); });
    chatBody.replaceChildren(el("div", { class: "ws-empty" },
      el("p", {}, el("b", {}, MODE_TEXT[st.designMode][0]), `: ${MODE_TEXT[st.designMode][1]}`),
      el("p", { class: "muted small" }, `Claude sees which screen the preview shows ("${screenName()}").`)), form);
    ta.focus();
  }
  function mountChat(id) {
    chatBody.replaceChildren();
    renderChat(id, chatBody);
    // Lovable-like composer for the narrow panel: the text box on top, then one row with attach, tool and model, and
    // a single Send / Stop button; the status sits on its own line above the composer. Same elements, only moved.
    const form = chatBody.querySelector("#composer");
    const row = form.querySelector(".composer-row");
    row.append(el("div", { class: "ws-cbar" }, row.querySelector(".attach"), form.querySelector("#agent-wrap"), form.querySelector("#model-wrap"), el("span", { class: "sp" }), row.querySelector("#stop"), row.querySelector("#send")));
    const status = form.querySelector("#status-line");
    status.classList.add("ws-status");
    form.before(status);
    form.querySelector(".composer-foot")?.remove();
    chatBody.append(el("div", { class: "ws-chat-foot" }, el("button", { type: "button", class: "textbtn", onclick: () => {
      try { localStorage.removeItem(designKey(p.name)); } catch {}
      if (current?.es) { current.es.close(); current.cleanup?.(); current = null; }
      drawStarter();
    } }, icon("i-plus"), "New design conversation")));
  }
  // The dashboard restarted mid-conversation: the chat found (or continued) it under a new id; mount that one here.
  const onReconnect = (ev) => {
    if (!chatBody.isConnected) { window.removeEventListener("chat-reconnect", onReconnect); return; }
    if (ev.detail.from !== sessionId()) return;
    ev.preventDefault();
    writeStore(designKey(p.name), { id: ev.detail.to, claudeSessionId: ev.detail.claudeSessionId });
    mountChat(ev.detail.to);
  };
  window.addEventListener("chat-reconnect", onReconnect);
  // Reuse this project's design conversation: still running, or continued from its Claude session after a restart.
  async function openChat() {
    const saved = readStore(designKey(p.name));
    if (!saved) return drawStarter();
    try {
      const { live, past } = await api("/api/sessions");
      let s = live.find((x) => x.id === saved.id) || (saved.claudeSessionId && live.find((x) => x.claudeSessionId === saved.claudeSessionId));
      if (!s && saved.claudeSessionId && past.some((x) => x.claudeSessionId === saved.claudeSessionId))
        s = await api("/api/sessions", { resume: saved.claudeSessionId, project: p.name, title: `Design: ${p.title}` });
      if (!s) { try { localStorage.removeItem(designKey(p.name)); } catch {} return drawStarter(); }
      writeStore(designKey(p.name), { id: s.id, claudeSessionId: s.claudeSessionId || saved.claudeSessionId || null });
      mountChat(s.id);
    } catch (e) { showError(e); drawStarter(); }
  }

  // ----- right: preview -----
  const whereSeg = el("div", { class: "p-seg", role: "radiogroup", "aria-label": "Preview" });
  const screenPick = el("select", { "aria-label": "Screen", onchange: () => { view.screen = screenPick.value; saveView(); loadFrame(); } },
    st.screens.map((s) => el("option", { value: s.slug }, s.name)));
  const deviceSeg = el("div", { class: "p-seg icons", role: "radiogroup", "aria-label": "Device" });
  const frame = el("iframe", { title: "Prototype preview", class: "ws-frame" });
  const refresh = el("button", { class: "iconbtn sq", type: "button", "aria-label": "Refresh", title: "Refresh", onclick: () => loadFrame(true) }, icon("i-refresh"));
  const newTab = el("a", { class: "iconbtn sq", target: "_blank", rel: "noopener", "aria-label": "Open in a new tab", title: "Open in a new tab" }, icon("i-external"));
  const unpub = el("span", { class: "unpub", title: "The local build is newer than the last publish" }, "unpublished changes");
  const push = el("button", { class: "ghost sm", type: "button", title: "Queue this screen for the Figma sync (Sync page)" }, icon("i-upload"), "Push to Figma");
  const publish = el("button", { class: "primary sm", type: "button" }, "Publish");
  const confirmBox = el("span", { class: "ws-confirm", hidden: true });
  const badge = el("span", { class: "tag k-decision srcbadge", hidden: true });
  const canvas = el("div", { class: "ws-canvas" });
  const stage = el("section", { class: "ws-stage", "aria-label": "Prototype preview" },
    el("div", { class: "ws-bar" }, whereSeg, screenPick, deviceSeg, refresh, newTab, el("span", { class: "sp" }), unpub, push, publish, confirmBox),
    canvas);
  main.append(chatCol, stage);

  const baseUrl = () => (view.where === "local" ? st.local.url : st.publish?.url) || null;
  // embed=1: the prototype hides its own screen list, banner and picker (this page has them); a new tab shows it whole.
  const screenUrl = (embed = true) => baseUrl() && view.screen ? `${baseUrl().replace(/\/?$/, "/")}#/${view.screen}?mode=${view.mode}&lang=en${embed ? "&embed=1" : ""}` : baseUrl();
  function loadFrame(force) {
    const url = screenUrl();
    const sc = st.screens.find((s) => s.slug === view.screen);
    badge.hidden = !(sc?.source === "code");
    badge.textContent = `${sc?.name || ""} · code ahead of Figma`;
    newTab.href = screenUrl(false) || "#";
    newTab.toggleAttribute("aria-disabled", !url);
    if (view.where === "local" && !st.local.running) {
      canvas.replaceChildren(el("div", { class: "p-empty ws-off" },
        el("p", {}, el("b", {}, "The local preview is not running.")),
        st.installed ? el("button", { class: "primary sm", type: "button", onclick: startLocal }, icon("i-zap"), "Start local preview")
          : el("p", { class: "muted small" }, "Its packages are not installed: ask in the chat to install them (npm install in the prototype folder)."),
        st.publish?.url ? el("button", { class: "ghost sm", type: "button", onclick: () => { view.where = "live"; saveView(); drawBar(); loadFrame(); } }, "Show the live link") : null));
      return;
    }
    if (!url) { canvas.replaceChildren(el("p", { class: "p-empty ws-off" }, "Not published yet. Publish once from the chat to get a live link.")); return; }
    // The frame is another origin, so a refresh reloads it with a cache-busting query; a screen switch only changes the hash.
    if (force) { const u = new URL(url); u.searchParams.set("r", Date.now()); frame.src = u.href; frame.dataset.src = url; }
    else if (frame.dataset.src !== url) { frame.dataset.src = url; frame.src = url; }
    canvas.replaceChildren(...[badge, el("div", { class: `ws-device ${view.device}` }, frame),
      view.where === "live" ? el("p", { class: "ws-note" }, "Live shows the published link with real comments. If the browser shows a safety warning inside the frame, use Open in a new tab.") : null].filter(Boolean));
  }
  async function startLocal(ev) {
    const b = ev.currentTarget; b.disabled = true; b.lastChild.textContent = "Starting…";
    try { st = await api(`/api/project/${enc}/preview/start`, {}); drawBar(); loadFrame(); }
    catch (e) { showError(e); b.disabled = false; b.lastChild.textContent = "Start local preview"; }
  }
  function drawBar() {
    whereSeg.replaceChildren(...[["local", "Local"], ["live", "Live"]].map(([k, label]) => el("button", { type: "button", role: "radio", class: view.where === k ? "on" : null, "aria-checked": String(view.where === k), onclick: () => { view.where = k; saveView(); drawBar(); loadFrame(); } },
      k === "local" ? el("span", { class: `dot ${st.local.running ? "good" : "wait"}` }) : null, label)));
    deviceSeg.replaceChildren(...[["phone", "Phone", "i-phone"], ["desktop", "Desktop", "i-monitor"]].map(([k, label, ic]) => el("button", { type: "button", role: "radio", class: view.device === k ? "on" : null, "aria-checked": String(view.device === k), "aria-label": label, title: label, onclick: () => { view.device = k; saveView(); drawBar(); loadFrame(); } }, icon(ic))));
    screenPick.value = view.screen;
    unpub.hidden = !st.unpublished;
    publish.disabled = st.publishing || !st.repo;
    publish.textContent = st.publishing ? "Publishing…" : "Publish";
    publish.title = st.repo ? `Build and publish to ${st.repo} (GitHub Pages)` : "Publish once from the chat first";
  }
  push.onclick = async () => {
    const sc = st.screens.find((s) => s.slug === view.screen);
    if (!sc) return;
    try { await api(`/api/project/${enc}/sync/queue`, { ref: `push:screen:${sc.slug}`, title: `Push screen "${sc.name}" from the prototype to Figma` }); toast(`"${sc.name}" is queued for Figma. Nothing changed in Figma yet: run the queue on the Sync page.`, { label: "Open Sync", icon: "i-refresh", run: () => { location.hash = `#/project/${enc}/sync`; } }); }
    catch (e) { showError(e); }
  };
  publish.onclick = () => {
    confirmBox.hidden = false; publish.hidden = true;
    confirmBox.replaceChildren(el("span", { class: "small" }, `Publish to ${st.repo}?`),
      el("button", { class: "primary sm", type: "button", onclick: doPublish }, "Yes, publish"),
      el("button", { class: "ghost sm", type: "button", onclick: () => { confirmBox.hidden = true; publish.hidden = false; } }, "Cancel"));
  };
  // GitHub Pages serves a new build about a minute after the push (and caches the old page meanwhile): poll the live
  // index for the build that was just published, then reload the Live preview so it never shows the old one.
  async function waitForLive(build) {
    const url = st.publish?.url;
    if (!build || !url) return;
    for (let i = 0; i < 36; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      if (!canvas.isConnected) return;
      try {
        const html = await (await fetch(`${url}?r=${Date.now()}`, { cache: "no-store" })).text();
        if (html.includes(`index-${build}.js`)) {
          if (view.where === "live") loadFrame(true);
          toast("The live link now shows the new build.");
          return;
        }
      } catch {}
    }
  }
  async function doPublish() {
    confirmBox.hidden = true; publish.hidden = false;
    st.publishing = true; drawBar();
    try {
      st = await api(`/api/project/${enc}/publish`, {});
      toast("Published. The live link updates in about a minute; the Live preview reloads by itself.");
      waitForLive(st.publish?.build);
    }
    catch (e) { showError(e); st.publishing = false; }
    drawBar();
  }

  drawMode(); drawBar(); loadFrame(); openChat();
}

// ---------- Connect services: status lights and the one-time Supabase setup ----------
async function copyText(text) {
  try { await Promise.race([navigator.clipboard.writeText(text), new Promise((_, no) => setTimeout(no, 1000))]); return true; } catch {
    const t = el("textarea", { style: "position:fixed;opacity:0;pointer-events:none" });
    t.value = text; document.body.append(t); t.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch {}
    t.remove(); return ok;
  }
}

async function drawConnect(main, p) {
  const enc = encodeURIComponent(p.name);
  const recheck = el("button", { class: "ghost sm", type: "button" }, icon("i-refresh"), "Check again");
  main.append(head(p, "Connect services", "What this computer is connected to. Set up once per computer; every project uses it.", [recheck]));
  const body = el("div", {}, el("p", { class: "p-empty" }, "Checking…"));
  main.append(body);
  let c;
  const load = async () => { body.replaceChildren(el("p", { class: "p-empty" }, "Checking…")); c = await api(`/api/project/${enc}/connect`); draw(); };
  recheck.onclick = () => load().catch(showError);

  const light = (state) => el("span", { class: `dot ${state === "ok" ? "good" : state === "warn" ? "wait" : "bad"}` });
  const card = (title, state, summary, ...rest) => el("section", { class: "p-panel svc", "data-svc": title },
    el("header", {}, light(state), el("h2", {}, title), el("span", { class: `tag ${state === "ok" ? "res" : state === "warn" ? "k-decision" : "open"}` }, state === "ok" ? "Connected" : state === "warn" ? "Needs a look" : "Not connected")),
    el("p", { class: "small" }, summary), ...rest.filter(Boolean));
  const copyBtn = (label, get) => el("button", { class: "ghost sm", type: "button", onclick: async () => { toast((await copyText(await get())) ? "Copied." : "Could not copy. Select the text instead."); } }, icon("i-copy"), label);

  function supabaseCard() {
    const s = c.supabase;
    const sc = s.schema;
    const keysOk = s.url && s.anon && s.service;
    const state = keysOk && sc?.upToDate ? "ok" : keysOk ? "warn" : "bad";
    const summary = !keysOk ? "Prototype comments need a free Supabase project. Paste its three values once; they are saved on this computer only."
      : sc?.error ? `Supabase did not answer the check: ${sc.error}`
      : sc?.upToDate ? `Comments, replies and images work (${s.host}).`
      : `Connected to ${s.host}, but the database needs the current schema: ${[!sc?.table && "the comments table", !sc?.reply && "replies", !sc?.images && "images", !sc?.bucket && "the image bucket"].filter(Boolean).join(", ")} missing.`;
    const kv = el("dl", { class: "p-kv" },
      ...[["Project URL", s.url], ["Public key", s.anon], ["Secret key", s.service]].flatMap(([k, ok]) => [el("dt", {}, k), el("dd", {}, light(ok ? "ok" : "bad"), ok ? " saved" : " missing")]),
      el("dt", {}, "Schema"), el("dd", {}, sc ? [light(sc.upToDate ? "ok" : "warn"), sc.upToDate ? " up to date" : " update needed"] : "–"),
      el("dt", {}, "Saved in"), el("dd", { class: "mono" }, s.file, s.projectOverride ? " (this project's prototype/.env.local overrides it)" : ""));
    const steps = keysOk && sc && !sc.upToDate && !sc.error ? el("ol", { class: "small steps" },
      el("li", {}, "Copy the schema SQL."),
      el("li", {}, "Open the Supabase SQL Editor, paste it and press Run. It is safe to run again: it only adds what is missing."),
      el("li", {}, "Press Check again.")) : null;
    const form = el("form", { class: "svc-form", autocomplete: "off" },
      el("label", {}, "Project URL", el("input", { name: "url", type: "url", placeholder: "https://<ref>.supabase.co", spellcheck: "false" })),
      el("label", {}, "Public key (publishable or anon)", el("input", { name: "anon", type: "password", placeholder: "sb_publishable_…", spellcheck: "false", autocomplete: "off" })),
      el("label", {}, "Secret key (secret or service_role)", el("input", { name: "service", type: "password", placeholder: "sb_secret_…", spellcheck: "false", autocomplete: "new-password" })),
      el("p", { class: "muted small" }, "Supabase > Project Settings > API Keys. Leave a field empty to keep what is saved. The secret key never leaves this computer and is never shown again."),
      el("div", { class: "p-actions" }, el("button", { class: "primary sm", type: "submit" }, "Save keys")));
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const f = new FormData(form);
      try { c = await api(`/api/project/${enc}/connect/supabase`, { url: f.get("url"), anon: f.get("anon"), service: f.get("service") }); form.reset(); toast("Saved on this computer."); draw(); }
      catch (e) { showError(e); }
    };
    const details = el("details", { class: "svc-more", open: !keysOk || null }, el("summary", {}, keysOk ? "Change the keys" : "Set up Supabase"), form);
    return card("Supabase (comments)", state, summary, kv, steps,
      el("div", { class: "p-actions" },
        copyBtn("Copy schema SQL", () => fetch(`/api/project/${enc}/schema-sql`).then((r) => r.text())),
        s.sqlEditor ? el("a", { class: "ghost sm", href: s.sqlEditor, target: "_blank", rel: "noopener" }, icon("i-external"), "Open SQL Editor") : null,
        el("button", { class: "ghost sm", type: "button", onclick: () => load().catch(showError) }, icon("i-refresh"), "Schema status")),
      details);
  }

  function draw() {
    const f = c.figcli, g = c.github, sb = c.storybook, pw = c.playwright;
    body.replaceChildren(el("div", { class: "svc-grid" },
      card("Figma (FigCli Yolo)", f.port ? "ok" : "warn",
        f.port ? "Figma is open with the debugging port; Claude can read and write the open files." : "Figma is not reachable on port 9222. Open Figma Desktop; after a Figma update run FigCli's connect yourself (it patches Figma, so Claude never runs it).",
        f.lines.length ? el("dl", { class: "p-kv" }, f.lines.flatMap((l) => { const [k, ...v] = l.split(":"); return [el("dt", {}, k.trim()), el("dd", {}, v.join(":").trim() || "–")]; })) : null),
      card("GitHub", g?.signedIn ? "ok" : g?.cli ? "warn" : "bad",
        g?.signedIn ? `Signed in as ${g.account}. Publishing the prototype and team projects use it.` : g?.cli ? "GitHub CLI is installed but not signed in." : "GitHub CLI (gh) is not installed.",
        !g?.signedIn && g?.cli ? el("div", { class: "p-actions" }, el("button", { class: "ghost sm", type: "button", onclick: async () => { try { toast((await api("/api/github/login", {})).ok ? "GitHub sign-in opened in a new window." : "Could not open it."); } catch (e) { showError(e); } } }, icon("i-login"), "Sign in with GitHub")) : null),
      supabaseCard(),
      sb ? card("Storybook MCP", sb.running ? "ok" : "warn",
        sb.running ? `Storybook runs on port ${sb.port}; its MCP is at ${sb.mcp}.` : `Storybook is not running (port ${sb.port}). Start it to give Claude the components' docs and props.`,
        el("p", { class: "muted small" }, "Register it once on this computer (local scope, never committed):"),
        el("pre", { class: "mono svc-cmd" }, sb.add),
        el("div", { class: "p-actions" }, copyBtn("Copy command", () => sb.add)))
        : card("Storybook MCP", "warn", "This project has no Storybook yet."),
      card("Playwright (checks)", pw.core && pw.chrome ? "ok" : "warn",
        pw.core && pw.chrome ? "Ready: fidelity and live checks run in Chrome." : [!pw.core && "the prototype's playwright-core is not installed (npm install in the prototype folder)", !pw.chrome && "Google Chrome is not installed"].filter(Boolean).join("; ") + ".")));
  }
  await load().catch((e) => { body.replaceChildren(el("p", { class: "p-empty" }, "Could not run the checks.")); showError(e); });
}

// ---------- Plan: Planning/ steps, documents and the three light checkpoints ----------
const PLAN_PROMPTS = {
  start: (p) => `Plan the next work of "${p}" (My Projects/${p}) before anything is built: read its Inputs (PRD, research, meeting notes, screenshots) and write the Planning/ folder, one NN-<step>.md per step (00 Input digest, 01 Users and jobs, 02 Information architecture, 03 Flows, 04 Screen specs, 05 Gaps and plan, 06 Usability pre-check), each with front matter "status: draft | waiting | done". If there is no PRD, draft one from a short brief and mark every assumption. Stop at the three checkpoints (02, 03, 05) with "status: waiting" for my approval. Screen specs use only DS components; missing ones are DS gaps.`,
  next: (p, step) => `Continue the plan of "${p}" (My Projects/${p}/Planning): step ${step.no} ${step.title}. Keep the same file format and stop at the next checkpoint for my approval.`,
  change: (p, name, text) => `Change the planning document My Projects/${p}/Planning/${name} as follows, then set it back to "status: waiting" for my approval: ${text}`,
};
const planStatus = { todo: ["", "not started"], draft: ["k-decision", "draft"], waiting: ["open", "waiting on you"], done: ["res", "done"] };

async function drawPlan(main, p) {
  const enc = encodeURIComponent(p.name);
  let st = await api(`/api/project/${enc}/plan`).catch((e) => { showError(e); return null; });
  if (!st) { main.append(el("p", { class: "p-empty" }, "Could not read the Planning folder.")); return; }
  const inputs = Object.entries(st.inputs).filter(([, n]) => n).map(([k, n]) => `${n} ${k === "Other" ? "other" : k}`);
  const chatBtn = el("button", { class: "primary sm", type: "button" }, icon("i-message"), st.exists ? "Continue the plan in chat" : "Start planning in chat");
  main.append(head(p, "Plan", "From PRD and research to approved flows and screen specs, before anything is built.", [
    el("span", { class: "p-pill" }, `Inputs: ${inputs.length ? inputs.join(", ") : "none yet"}`), chatBtn]));
  const list = el("div", { class: "sheet plan-steps" });
  const doc = el("article", { class: "sheet plan-doc" });
  main.append(el("div", { class: "plan" }, list, doc));
  let open = null;
  chatBtn.onclick = () => {
    const step = st.steps.find((x) => x.no === st.next);
    start({ prompt: st.exists && step ? PLAN_PROMPTS.next(p.name, step) : PLAN_PROMPTS.start(p.name), project: p.name, title: `Plan: ${p.title}` }).catch(showError);
  };

  function drawList() {
    list.replaceChildren(...st.steps.map((x) => {
      const [cls, label] = planStatus[x.status];
      const sel = open && x.docs.some((d) => d.file === open);
      return el("button", { type: "button", class: `pstep${sel ? " on" : ""}`, disabled: !x.docs.length || null, onclick: () => x.docs[0] && showDoc(x.docs[0].file) },
        el("span", { class: "no" }, x.no),
        el("span", {}, el("b", {}, x.title), el("small", {}, x.docs.length > 1 ? `${x.docs.length} documents` : x.hint)),
        x.checkpoint ? el("span", { class: `cp${x.status === "done" ? " ok" : ""}` }, x.status === "done" ? "checkpoint ✓" : "checkpoint") : el("span", { class: `tag ${cls}` }, label));
    }));
  }
  async function showDoc(file) {
    open = file; drawList();
    let d;
    try { d = await api(`/api/project/${enc}/plan-file?f=${encodeURIComponent(file)}`); } catch (e) { showError(e); return; }
    const step = st.steps.find((x) => x.docs.some((y) => y.file === file));
    const meta = step.docs.find((y) => y.file === file);
    const waiting = !meta.approved && meta.status !== "done";
    doc.replaceChildren(...[
      el("header", {}, el("h3", {}, `${step.no} · ${meta.title}`),
        step.checkpoint ? el("span", { class: `cp${waiting ? "" : " ok"}` }, waiting ? (meta.status === "waiting" ? "checkpoint: waiting on you" : "checkpoint: draft") : `approved ${meta.approved || ""}`) : null),
      step.docs.length > 1 ? el("div", { class: "p-seg" }, step.docs.map((y) => el("button", { type: "button", class: y.file === file ? "on" : null, onclick: () => showDoc(y.file) }, y.title))) : null,
      el("div", { class: "md", dir: "auto", html: markdown(d.body) }),
      el("div", { class: "p-actions" },
        waiting ? el("button", { class: "primary sm", type: "button", onclick: async () => { try { st = await api(`/api/project/${enc}/plan/approve`, { file }); toast("Approved."); showDoc(file); } catch (e) { showError(e); } } }, icon("i-check"), step.checkpoint ? "Approve" : "Mark done") : null,
        el("button", { class: "ghost sm", type: "button", onclick: async () => {
          const t = await askText({ title: "Ask for changes", help: `What should change in ${d.name}? Claude edits it and sends it back for approval.`, okLabel: "Send to chat" });
          if (t) start({ prompt: PLAN_PROMPTS.change(p.name, d.name, t), project: p.name, title: `Plan: ${d.name}` }).catch(showError);
        } }, icon("i-message"), "Ask for changes"),
        el("button", { class: "ghost sm", type: "button", onclick: async () => { toast((await copyText(d.path)) ? `Copied: ${d.path}` : d.path); } }, icon("i-copy"), "Copy file path"))].filter(Boolean));
  }

  drawList();
  const first = st.steps.find((x) => x.no === st.next && x.docs.length) || st.steps.filter((x) => x.docs.length).pop();
  if (first) showDoc(first.docs[0].file);
  else doc.replaceChildren(el("div", { class: "p-empty plan-none" },
    el("p", {}, el("b", {}, "No plan yet.")),
    el("p", { class: "small" }, "Claude reads the Inputs (or drafts a PRD from a short brief, with every assumption marked), then writes users and jobs, the information architecture, flows with every state, screen specs from DS components and the gap list. It stops at three checkpoints for your approval."),
    el("button", { class: "primary sm", type: "button", onclick: () => chatBtn.click() }, icon("i-message"), "Start planning in chat")));
}
