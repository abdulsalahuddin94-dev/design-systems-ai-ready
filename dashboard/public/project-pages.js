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
