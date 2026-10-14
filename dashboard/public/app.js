// Dashboard front end: plain JavaScript, no build step. Talks to server.mjs on this computer.
"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (k === "html") n.innerHTML = v;
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) n.append(kid.nodeType ? kid : String(kid));
  return n;
};
const api = async (url, body) => {
  const r = await fetch(url, body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ago = (ms) => {
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
};

// ---------- theme ----------
(() => {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch {}
  if (saved) document.documentElement.dataset.theme = saved;
  $("#theme").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", document.documentElement.dataset.theme); } catch {}
  });
})();

// ---------- tiny Markdown (what Claude's replies use: headings, lists, bold, code, links, tables) ----------
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
}
function markdown(src) {
  const lines = String(src).replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || "")) {
      const row = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = row(line);
      i += 2;
      const body = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) body.push(row(lines[i++]));
      out.push(`<div class="tablewrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length > 2 ? 4 : 3}>${inline(h[2])}</h${h[1].length > 2 ? 4 : 3}>`); i++; continue; }
    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*•]|\d+[.)])\s+/, ""));
        i++;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|\s*([-*•]|\d+[.)])\s+)/.test(lines[i]) && !/^\s*\|.*\|\s*$/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${para.map(inline).join("<br>")}</p>`);
  }
  return out.join("");
}

// ---------- update banner ----------
async function checkUpdates(fetchRemote) {
  const box = $("#update");
  try {
    const info = await api(`/api/workflow?fetch=${fetchRemote ? 1 : 0}`);
    if (!info.git || !info.behind) { if (!box.classList.contains("ok")) box.hidden = true; return; }
    box.className = "update";
    box.replaceChildren(
      el("div", { class: "what" },
        el("b", {}, `A new workflow update is ready (${info.behind} change${info.behind > 1 ? "s" : ""}).`),
        info.changes.length ? el("ul", {}, info.changes.slice(0, 6).map((c) => el("li", {}, c))) : null),
      el("button", { class: "ghost", type: "button", onclick: () => { box.hidden = true; } }, "Later"),
      el("button", { class: "primary", type: "button", onclick: runUpdate }, "Update now"),
    );
    box.hidden = false;
  } catch { box.hidden = true; }
}
async function runUpdate() {
  const box = $("#update");
  box.replaceChildren(el("div", { class: "what" }, "Updating the workflow…"));
  try {
    const r = await api("/api/workflow/update", {});
    box.className = "update " + (r.ok ? "ok" : "err");
    box.replaceChildren(
      el("div", { class: "what" }, el("b", {}, r.message),
        r.ok ? el("div", { class: "note" }, r.needsInstall
          ? "The dashboard itself changed: close its window and open Start-Dashboard again."
          : "New skills and rules apply from your next request.") : null),
      el("button", { class: "ghost", type: "button", onclick: () => { box.hidden = true; box.className = "update"; } }, "Close"),
    );
  } catch (e) {
    box.className = "update err";
    box.replaceChildren(el("div", { class: "what" }, "The update failed: " + e.message));
  }
}

// ---------- router ----------
let current = null; // { id, es }
let projects = [];
window.addEventListener("hashchange", route);
function route() {
  const m = location.hash.match(/^#\/chat\/([\w-]+)/);
  for (const a of document.querySelectorAll("[data-nav]")) a.classList.toggle("on", !m && a.dataset.nav === "home");
  if (current?.es) { current.es.close(); current = null; }
  if (m) renderChat(m[1]); else renderHome();
}

// ---------- start a conversation ----------
const PROMPTS = {
  new: "Start the intake (Design_System_Intake_Skill). I want to start a new project.",
  join: "Start the intake (Design_System_Intake_Skill). I want to join a team project.",
  project: (p) => `Start the intake (Design_System_Intake_Skill). Work on the existing project "${p}" (My Projects/${p}).`,
};

async function start(body) {
  const s = await api("/api/sessions", body);
  location.hash = `#/chat/${s.id}`;
}

function askText({ title, help, okLabel = "Start", placeholder = "" }) {
  return new Promise((resolve) => {
    let dlg = $("#ask");
    if (!dlg) { document.body.append($("#tpl-dialog").content.cloneNode(true)); dlg = $("#ask"); }
    $("#ask-title").textContent = title;
    $("#ask-help").textContent = help || "";
    $("#ask-ok").textContent = okLabel;
    const input = $("#ask-input");
    input.value = "";
    input.placeholder = placeholder;
    dlg.onclose = () => resolve(dlg.returnValue === "ok" && input.value.trim() ? input.value.trim() : null);
    dlg.showModal();
    input.focus();
  });
}

async function startKind(kind) {
  if (kind === "new") return start({ prompt: PROMPTS.new, title: "New project" });
  if (kind === "join") return start({ prompt: PROMPTS.join, title: "Join a team project" });
  if (kind === "quick") {
    const t = await askText({ title: "Quick task", help: "One component, an audit or one fix on a live Figma file.", placeholder: "e.g. Audit the Buttons page of the open file" });
    if (t) start({ prompt: `/ds-quick ${t}`, title: `Quick: ${t}` });
    return;
  }
  const t = await askText({ title: "Ask Claude", help: "Anything you would type in the terminal.", placeholder: "Write your request…" });
  if (t) start({ prompt: t, title: t });
}

// ---------- Home ----------
async function renderHome() {
  const app = $("#app");
  app.replaceChildren($("#tpl-home").content.cloneNode(true));
  for (const b of app.querySelectorAll("[data-start]")) b.addEventListener("click", () => startKind(b.dataset.start).catch(showError));
  $("#refresh").addEventListener("click", () => { loadProjects(); checkUpdates(true); });
  loadProjects();
  loadRecent();
}

function linkChip(l) {
  return el("a", { class: "chip", href: l.url, target: "_blank", rel: "noopener" }, l.kind === "figma" ? `Figma · ${l.label}` : l.label);
}

async function loadProjects() {
  const list = $("#project-list");
  if (!list) return;
  try {
    ({ projects } = await api("/api/projects"));
  } catch (e) { list.replaceChildren(el("p", { class: "muted" }, e.message)); return; }
  if (!projects.length) {
    list.replaceChildren(el("p", { class: "muted" }, "No projects yet. Start a new one or join a team project."));
    return;
  }
  list.replaceChildren(...projects.map((p) => el("article", { class: "card project" },
    el("h3", {}, p.title, p.team ? el("span", { class: "chip team" }, "Team") : null),
    el("div", { class: "meta" }, [p.platform, p.phase].filter(Boolean).join(" · ") || p.name),
    p.last ? el("div", { class: "last" }, `${p.last.date} · ${p.last.title}`) : el("div", { class: "last muted" }, "Intake not finished"),
    p.next ? el("div", { class: "next" }, `Next: ${p.next}`) : null,
    el("div", { class: "chips" },
      p.unsynced ? el("span", { class: "chip warn" }, `${p.unsynced} change${p.unsynced > 1 ? "s" : ""} not in Storybook`) : null,
      p.links.map(linkChip)),
    el("div", { class: "go" },
      el("button", { class: "primary", type: "button", onclick: () => start({ prompt: PROMPTS.project(p.name), project: p.name, title: p.title }).catch(showError) }, "Open"),
    ),
  )));
}

async function loadRecent() {
  try {
    const { live, past } = await api("/api/sessions");
    const rows = [...live.map((s) => ({ ...s, live: true })), ...past].slice(0, 8);
    if (!rows.length || !$("#recent-wrap")) return;
    $("#recent-wrap").hidden = false;
    $("#recent-list").replaceChildren(...rows.map((r) => el("li", {},
      el("span", {}, r.title || "Conversation"),
      el("time", {}, ago(r.updated || r.started)),
      r.live
        ? el("button", { class: "ghost", type: "button", onclick: () => { location.hash = `#/chat/${r.id}`; } }, "Open")
        : el("button", { class: "ghost", type: "button", onclick: () => start({ resume: r.claudeSessionId, project: r.project, title: r.title }).catch(showError) }, "Continue"),
    )));
  } catch {}
}

function showError(e) {
  alert(e.message || String(e));
}

// ---------- Chat ----------
const QUICK = [
  { label: "Continue", hint: "Resume from the project's next step", prompt: (p) => PROMPTS.project(p) },
  { label: "Run an audit", hint: "ds-auditor on the DS and Design files", prompt: (p) => `Run the audit (ds-auditor) on the project "${p}" and report the numbers.` },
  { label: "Add or change a component", hint: "Describe it, Claude follows the atomic rules", ask: "Which component, and what should change?", prompt: (p, t) => `In the project "${p}": ${t}` },
  { label: "Change a token", hint: "A color, spacing, radius or type value", ask: "Which token and what value?", prompt: (p, t) => `In the project "${p}", change this token: ${t}` },
  { label: "Update Storybook", hint: "Resync from the Figma DS file", prompt: (p) => `Update the Storybook of the project "${p}" from Figma.` },
  { label: "Project status", hint: "Checkpoints, to-dos, what is next", prompt: (p) => `Show the status of the project "${p}": checkpoints, user to-dos and the next step. Do not change anything.` },
];

function renderChat(id) {
  const app = $("#app");
  app.replaceChildren($("#tpl-chat").content.cloneNode(true));
  const log = $("#log");
  const input = $("#input");
  const state = { id, busy: false, pending: new Set(), images: [], lastShots: [], shotRows: [], toolRow: null, live: null, session: null };
  current = { id, state };

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const nearBottom = () => log.scrollHeight - log.scrollTop - log.clientHeight < 160;
  const add = (node) => { const stick = nearBottom(); removeTyping(); log.append(node); if (stick) scroll(); updateTyping(); return node; };
  let typing = null;
  const removeTyping = () => { typing?.remove(); typing = null; };
  const updateTyping = () => {
    removeTyping();
    if (state.busy && !state.pending.size) { typing = el("div", { class: "typing", "aria-label": "Claude is working" }, el("i"), el("i"), el("i")); log.append(typing); }
    $("#stop").hidden = !state.busy;
    $("#status-line").textContent = state.session?.ended ? "This conversation has ended. Start a new one from Home." :
      state.pending.size ? "Claude is waiting for your answer above." : state.busy ? "Claude is working…" : "Ready.";
  };

  // Sidebar
  const fillSide = (session) => {
    const p = projects.find((x) => x.name === session.project);
    $("#side-kicker").textContent = p ? "Project" : "Conversation";
    $("#side-title").textContent = p ? p.title : session.title;
    $("#side-meta").textContent = p ? [p.platform, p.phase].filter(Boolean).join(" · ") : "";
    $("#side-links").replaceChildren(...(p ? p.links.map(linkChip) : []));
    const actions = $("#side-actions");
    actions.replaceChildren();
    if (p) {
      actions.append(el("p", { class: "sub" }, "Quick actions"));
      for (const q of QUICK) {
        actions.append(el("button", { type: "button", onclick: async () => {
          let text = "";
          if (q.ask) { text = await askText({ title: q.label, help: q.ask, okLabel: "Send" }); if (!text) return; }
          send(q.prompt(p.name, text));
        } }, q.label, el("small", {}, q.hint)));
      }
    }
  };
  if (!projects.length) api("/api/projects").then((r) => { projects = r.projects; if (state.session) fillSide(state.session); }).catch(() => {});

  // Events from Claude
  const es = new EventSource(`/api/sessions/${id}/events`);
  current.es = es;
  es.onerror = () => {
    if (es.readyState === EventSource.CLOSED) add(el("div", { class: "sys err" }, "Lost the connection to the dashboard. Is its window still open?"));
  };
  es.onmessage = (ev) => {
    const e = JSON.parse(ev.data);
    switch (e.type) {
      case "hello":
        log.replaceChildren();
        Object.assign(state, { busy: false, pending: new Set(), lastShots: [], shotRows: [], toolRow: null, live: null, firstPrompt: null, session: e.session });
        fillSide(e.session);
        break;
      case "user":
        if (!state.firstPrompt) state.firstPrompt = e.text;
        state.toolRow = null; state.live = null; state.lastShots = []; state.shotRows = [];
        add(el("div", { class: "msg user", dir: "auto" }, e.text, (e.images || []).map((src) => el("img", { src, alt: "Attached image" }))));
        break;
      case "delta":
        state.toolRow = null;
        if (!state.live) state.live = add(el("div", { class: "msg claude", dir: "auto" }));
        state.live.dataset.raw = (state.live.dataset.raw || "") + e.text;
        state.live.innerHTML = markdown(state.live.dataset.raw);
        if (nearBottom()) scroll();
        break;
      case "text":
        state.toolRow = null;
        if (state.live && e.streamed) { state.live.innerHTML = markdown(e.text); state.live = null; }
        else { state.live = null; add(el("div", { class: "msg claude", dir: "auto", html: markdown(e.text) })); }
        break;
      case "tool":
        state.live = null;
        if (!state.toolRow) state.toolRow = add(el("div", { class: "tools" }));
        state.toolRow.append(el("span", { class: "t" + (e.sub ? " sub" : ""), title: `${e.name} ${e.detail}` }, el("b", {}, e.name), e.detail ? ` ${e.detail}` : ""));
        break;
      case "image": {
        state.toolRow = null;
        const shot = shotNode(e.src);
        state.lastShots.push(e.src);
        let last = log.lastElementChild?.classList?.contains("shots") ? log.lastElementChild : null;
        if (!last) { last = add(el("div", { class: "shots" })); state.shotRows.push(last); }
        last.append(shot);
        last.classList.toggle("compare", last.children.length === 2);
        break;
      }
      case "question": {
        state.pending.add(e.requestId);
        const shots = state.lastShots.slice(-4);
        // The screenshots move into the approval card instead of showing twice.
        if (shots.length) for (const row of state.shotRows) row.remove();
        state.shotRows = [];
        add(questionCard(e, shots));
        break;
      }
      case "permission":
        state.pending.add(e.requestId);
        add(permissionCard(e));
        break;
      case "answered": {
        state.pending.delete(e.requestId);
        const card = log.querySelector(`[data-request="${e.requestId}"]`);
        if (card) closeCard(card, e);
        state.lastShots = []; state.shotRows = [];
        break;
      }
      case "busy":
        state.busy = e.busy;
        break;
      case "result":
        state.toolRow = null; state.live = null;
        if (!e.ok && e.error) add(el("div", { class: "sys err" }, e.error));
        break;
      case "error":
        add(el("div", { class: "sys err" }, e.message));
        break;
      case "auth":
        state.live = null; state.toolRow = null;
        add(authCard(e));
        break;
      case "ended":
        if (state.session) state.session.ended = true;
        break;
    }
    updateTyping();
  };

  function shotNode(src) {
    return el("figure", { class: "shot", onclick: () => lightbox(src) }, el("img", { src, alt: "Screenshot from Claude", loading: "lazy" }));
  }

  function questionCard(e, shots) {
    const card = el("div", { class: "qcard", "data-request": e.requestId });
    card.append(el("div", { class: "head" }, shots.length ? "Your approval" : "Claude asks"));
    if (shots.length) {
      const wrap = el("div", { class: "shots" + (shots.length === 2 ? " compare" : "") }, shots.map(shotNode));
      card.append(wrap);
    }
    const answers = {};
    const multi = e.questions.some((q) => q.multiSelect) || e.questions.length > 1;
    const submit = () => {
      for (const q of e.questions) if (!answers[q.question]) return;
      api(`/api/sessions/${id}/answer`, { requestId: e.requestId, answers }).catch(showError);
    };
    for (const q of e.questions) {
      const box = el("div", { class: "q" }, el("h4", { dir: "auto" }, q.question));
      const list = el("div", { class: "opts-list" });
      const picked = new Set();
      for (const o of q.options || []) {
        const isBack = /^back$/i.test(o.label);
        const btn = el("button", {
          type: "button", class: "opt-btn" + (/\(recommended\)/i.test(o.label) ? " rec" : "") + (isBack ? " back" : ""), "aria-pressed": "false",
          onclick: () => {
            if (q.multiSelect) {
              picked.has(o.label) ? picked.delete(o.label) : picked.add(o.label);
              btn.setAttribute("aria-pressed", String(picked.has(o.label)));
              answers[q.question] = [...picked].join(", ");
              if (!picked.size) delete answers[q.question];
            } else {
              for (const b of list.children) b.setAttribute("aria-pressed", "false");
              btn.setAttribute("aria-pressed", "true");
              answers[q.question] = o.label;
              if (!multi) submit();
            }
          },
        }, el("span", { class: "l" }, o.label), o.description ? el("span", { class: "d" }, o.description) : null,
          o.preview ? el("pre", {}, o.preview) : null);
        list.append(btn);
      }
      const other = el("input", { type: "text", placeholder: "Other: type your own answer", dir: "auto" });
      const otherSend = el("button", { type: "button", class: "ghost", onclick: () => {
        if (!other.value.trim()) return;
        for (const b of list.children) b.setAttribute("aria-pressed", "false");
        answers[q.question] = other.value.trim();
        if (!multi) submit();
      } }, multi ? "Use this" : "Send");
      other.addEventListener("keydown", (k) => { if (k.key === "Enter") { k.preventDefault(); otherSend.click(); } });
      box.append(list, el("div", { class: "other" }, other, otherSend));
      card.append(box);
    }
    if (multi) card.append(el("div", { class: "foot" }, el("button", { type: "button", class: "primary", onclick: submit }, "Send answers")));
    return card;
  }

  function authCard(e) {
    const note = el("p", { class: "note" }, "Your Claude Code sign-in expired. Sign in here, then press Try again.");
    refreshAccount(true);
    return el("div", { class: "qcard perm" },
      el("div", { class: "head" }, "Sign in"),
      el("h4", {}, e.message),
      note,
      el("div", { class: "foot" },
        el("button", { type: "button", class: "ghost", onclick: () => openSignIn() }, "Sign in"),
        el("button", { type: "button", class: "primary", onclick: () => {
          const sess = state.session || {};
          start({ prompt: state.firstPrompt || "", project: sess.project, title: sess.title }).catch(showError);
        } }, "Try again"),
      ),
    );
  }

  function permissionCard(e) {
    const card = el("div", { class: "qcard perm", "data-request": e.requestId },
      el("div", { class: "head" }, "Permission"),
      el("h4", {}, e.title || `Claude wants to use: ${e.tool}`),
      e.detail ? el("div", { class: "detail" }, e.detail) : null,
      e.reason ? el("p", { class: "note" }, e.reason) : null,
    );
    const reply = (body) => api(`/api/sessions/${id}/answer`, { requestId: e.requestId, ...body }).catch(showError);
    card.append(el("div", { class: "foot" },
      el("button", { type: "button", class: "ghost danger", onclick: () => reply({ allow: false }) }, "No"),
      e.canAlways ? el("button", { type: "button", class: "ghost", onclick: () => reply({ allow: true, always: true }) }, "Yes, don't ask again") : null,
      el("button", { type: "button", class: "primary", onclick: () => reply({ allow: true }) }, "Yes"),
    ));
    return card;
  }

  function closeCard(card, e) {
    card.classList.add("done");
    for (const b of card.querySelectorAll("button, input")) b.disabled = true;
    for (const n of card.querySelectorAll(".foot, .other")) n.remove();
    let text;
    if (e.answers) text = e.cancel ? "Closed without an answer" : Object.values(e.answers).join(" · ");
    else text = e.allow ? (e.always ? "Allowed (and from now on)" : "Allowed") : "Not allowed";
    card.append(el("div", { class: "picked" }, "Your answer: ", el("b", { dir: "auto" }, text)));
  }

  // Composer
  const attachments = $("#attachments");
  const renderAttachments = () => attachments.replaceChildren(...state.images.map((src, i) =>
    el("figure", {}, el("img", { src, alt: "Image to send" }), el("button", { type: "button", "aria-label": "Remove", onclick: () => { state.images.splice(i, 1); renderAttachments(); } }, "✕"))));
  const addFiles = (files) => {
    for (const f of files) {
      if (!/^image\/(png|jpeg|gif|webp)$/.test(f.type)) continue;
      const r = new FileReader();
      r.onload = () => { state.images.push(r.result); renderAttachments(); };
      r.readAsDataURL(f);
    }
  };
  $("#file").addEventListener("change", (ev) => { addFiles(ev.target.files); ev.target.value = ""; });
  input.addEventListener("paste", (ev) => { const files = [...(ev.clipboardData?.files || [])]; if (files.length) { ev.preventDefault(); addFiles(files); } });
  $("#composer").addEventListener("dragover", (ev) => ev.preventDefault());
  $("#composer").addEventListener("drop", (ev) => { ev.preventDefault(); addFiles(ev.dataTransfer.files); });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 200) + "px"; });
  input.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); $("#composer").requestSubmit(); } });

  async function send(text) {
    if (!text && !state.images.length) return;
    const images = state.images.splice(0);
    renderAttachments();
    try { await api(`/api/sessions/${id}/message`, { text, images }); }
    catch (e) { add(el("div", { class: "sys err" }, e.message)); }
  }
  $("#composer").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const text = input.value.trim();
    input.value = ""; input.style.height = "auto";
    send(text);
  });
  $("#stop").addEventListener("click", () => api(`/api/sessions/${id}/stop`, {}).catch(showError));
  $("#to-terminal").addEventListener("click", async () => {
    try { const r = await api(`/api/sessions/${id}/terminal`, {}); add(el("div", { class: "sys" }, r.message)); }
    catch (e) { showError(e); }
  });
  input.focus();
}

// ---------- account / sign-in ----------
async function refreshAccount(fresh) {
  const btn = $("#account");
  try {
    const a = await api(`/api/auth${fresh ? "?fresh=1" : ""}`);
    btn.hidden = false;
    btn.className = "account " + (a.loggedIn ? "ok" : "off");
    btn.textContent = a.loggedIn ? (a.email || "Signed in") : "Sign in";
    btn.title = a.loggedIn ? "Signed in to Claude. Click to sign in again." : (a.error || "Not signed in");
    return a;
  } catch { btn.hidden = true; return null; }
}

function openSignIn(onDone) {
  let dlg = $("#signin");
  if (!dlg) { document.body.append($("#tpl-signin").content.cloneNode(true)); dlg = $("#signin"); }
  const body = $("#signin-body");
  const startBtn = $("#signin-start");
  let timer = null;
  body.replaceChildren();
  startBtn.hidden = false;
  startBtn.disabled = false;
  const stop = () => { clearInterval(timer); timer = null; };
  $("#signin-close").onclick = () => { stop(); dlg.close(); };
  dlg.onclose = stop;

  let startedAt = Date.now();
  const terminalFallback = (lead) => el("div", { class: "linkbox" }, lead ? el("span", { class: "note" }, lead) : null,
    el("button", { type: "button", class: "ghost", onclick: async () => {
      try { const r = await api("/api/login", {}); body.append(el("p", { class: "note" }, r.message)); } catch (e) { showError(e); }
    } }, "Use a terminal instead"));
  const render = (st) => {
    const kids = [];
    if (st.running) kids.push(el("p", {}, "Waiting for you to finish signing in in your browser…"));
    if (st.running && !st.url && Date.now() - startedAt > 15000) kids.push(terminalFallback("Nothing opened?"));
    if (st.url) kids.push(el("div", { class: "linkbox" }, el("a", { class: "primary", href: st.url, target: "_blank", rel: "noopener", style: "text-decoration:none" }, "Open the sign-in page"), el("span", { class: "note" }, "if the browser did not open by itself")));
    if (st.needsCode) {
      const input = el("input", { type: "text", placeholder: "Paste the code from the sign-in page", autocomplete: "off" });
      const go = el("button", { type: "button", class: "ghost", onclick: async () => {
        if (!input.value.trim()) return;
        try { render(await api("/api/auth/login/code", { code: input.value })); } catch (e) { showError(e); }
      } }, "Send code");
      kids.push(el("div", { class: "other" }, input, go));
    }
    if (!st.running && st.exitCode != null) {
      stop();
      if (st.exitCode === 0 || st.status?.loggedIn) {
        kids.push(el("p", { class: "ok-line" }, "Signed in. You can close this window (in a conversation, press Try again)."));
        startBtn.hidden = true;
        refreshAccount(true);
        onDone?.();
      } else {
        kids.push(el("p", { class: "err-line" }, "Sign-in did not finish."));
        kids.push(terminalFallback(""));
        startBtn.disabled = false;
        startBtn.textContent = "Try again";
      }
    }
    if (st.output) kids.push(el("details", {}, el("summary", { class: "note" }, "Details"), el("pre", {}, st.output)));
    body.replaceChildren(...kids);
  };

  startBtn.textContent = "Sign in";
  startBtn.onclick = async () => {
    startBtn.disabled = true;
    startedAt = Date.now();
    try {
      render(await api("/api/auth/login", {}));
      stop();
      timer = setInterval(async () => {
        try { render(await api("/api/auth/login")); } catch { stop(); }
      }, 1500);
    } catch (e) { startBtn.disabled = false; showError(e); }
  };
  dlg.showModal();
}

function lightbox(src) {
  const box = el("div", { class: "lightbox", role: "dialog", "aria-label": "Screenshot", onclick: () => box.remove() }, el("img", { src, alt: "Screenshot, full size" }));
  const onKey = (k) => { if (k.key === "Escape") { box.remove(); removeEventListener("keydown", onKey); } };
  addEventListener("keydown", onKey);
  document.body.append(box);
}

$("#account").addEventListener("click", () => openSignIn());
route();
checkUpdates(true);
refreshAccount();
