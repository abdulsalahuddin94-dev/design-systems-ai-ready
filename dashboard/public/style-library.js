// Style library page (#/styles): browse Style_Library/styles.json, read a style's DESIGN.md and start a new
// project with it (intake 0.3e, Design_System_Intake_Skill/steps/style-library.md). Loaded before app.js;
// it only defines functions, which use app.js helpers ($, el, api, markdown, start, PROMPTS) when called.
"use strict";

let styleIndex = null;
const styleView = { cat: "", q: "" };

const stylePrompt = (s) => `${PROMPTS.new} Use the style \`${s.slug}\` (${s.title}) from the Style library (Style_Library/${s.slug}/DESIGN.md) as the visual direction: it is preselected for intake 0.3e.`;
const useStyle = (s) => start({ prompt: stylePrompt(s), title: `New project: ${s.name} style` }).catch(showError);

async function renderStyles() {
  const app = $("#app");
  app.replaceChildren($("#tpl-styles").content.cloneNode(true));
  try { styleIndex = styleIndex || await api("/api/styles"); }
  catch (e) { $("#style-list").replaceChildren(el("p", { class: "muted" }, "The Style library could not be read: " + e.message)); return; }
  try { Object.assign(styleView, JSON.parse(sessionStorage.getItem("styleView") || "{}")); } catch {}
  const q = $("#style-search");
  q.value = styleView.q;
  q.addEventListener("input", () => { styleView.q = q.value; drawStyles(); });
  $("#style-count").textContent = `${styleIndex.count} styles in ${styleIndex.categories.length} categories`;
  const cats = $("#style-cats");
  const chip = (name, label) => el("button", { type: "button", class: "sl-cat", "data-cat": name, "aria-pressed": String(styleView.cat === name), onclick: () => { styleView.cat = name; drawStyles(); } }, label);
  cats.replaceChildren(chip("", `All ${styleIndex.count}`), ...styleIndex.categories.map((c) => chip(c.name, `${c.name} ${c.count}`)));
  drawStyles();
}

function drawStyles() {
  try { sessionStorage.setItem("styleView", JSON.stringify(styleView)); } catch {}
  for (const b of document.querySelectorAll("#style-cats .sl-cat")) b.setAttribute("aria-pressed", String(b.dataset.cat === styleView.cat));
  const q = styleView.q.trim().toLowerCase();
  const list = styleIndex.styles.filter((s) => (!styleView.cat || s.category === styleView.cat)
    && (!q || `${s.name} ${s.title} ${s.category} ${s.description}`.toLowerCase().includes(q)));
  const box = $("#style-list");
  if (!list.length) { box.replaceChildren(el("p", { class: "muted" }, "No style matches. Try another word or All.")); return; }
  box.replaceChildren(...list.map((s) => el("article", { class: "sl-card sheet" },
    el("div", { class: "sl-swatches", "aria-hidden": "true" }, s.swatches.map((h) => el("i", { style: `background:${h}`, title: h }))),
    el("div", { class: "sl-head" },
      el("h3", {}, s.name),
      el("p", { class: "meta" }, s.category)),
    el("p", { class: "sl-desc" }, s.description),
    s.inspired_by_brand ? el("span", { class: "tag sl-brand", title: "Named after a company: the project gets its mood, never its logo, name or fonts" }, "Inspired by a brand") : null,
    el("div", { class: "go" },
      el("button", { class: "ghost", type: "button", onclick: () => openStyle(s) }, "Read"),
      el("button", { class: "primary", type: "button", onclick: () => useStyle(s) }, "Use for a new project")))));
}

async function openStyle(s) {
  let dlg = $("#styledlg");
  if (!dlg) { document.body.append($("#tpl-style").content.cloneNode(true)); dlg = $("#styledlg"); }
  $("#style-title").textContent = s.title;
  $("#style-meta").replaceChildren(el("span", { class: "tag" }, s.category),
    s.inspired_by_brand ? el("span", { class: "tag sl-brand" }, "Inspired by a brand") : null,
    el("span", { class: "note" }, s.file));
  $("#style-brand-note").hidden = !s.inspired_by_brand;
  const body = $("#style-body");
  body.replaceChildren(el("p", { class: "muted" }, "Loading…"));
  $("#style-use").onclick = () => { dlg.close(); useStyle(s); };
  dlg.showModal();
  try {
    const r = await api(`/api/styles/${encodeURIComponent(s.slug)}`);
    // The title, category and description are shown above; the rest of the file is plain Markdown.
    const lines = r.markdown.replace(/\r/g, "").split("\n");
    let i = lines.findIndex((l) => l.startsWith("# ")) + 1;
    while (i < lines.length && (!lines[i].trim() || lines[i].startsWith(">"))) i++;
    body.innerHTML = markdown(lines.slice(i).map((l) => l.replace(/^>\s?/, "")).join("\n"));
    body.scrollTop = 0;
  } catch (e) { body.replaceChildren(el("p", { class: "muted" }, "This style could not be read: " + e.message)); }
}
