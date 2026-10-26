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
  main.append(head(p, PROJECT_PAGES.find((x) => x[0] === page)?.[1] || page, "Coming in the next build stage."),
    el("p", { class: "p-empty" }, "This page is part of the dashboard plan (Pipeline, Plan, Design, Review, Sync, Connect services) and is built next."));
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
