// read-only
// Style readback for the Storybook style check (idea from storysync's `verify`, adopted 2026-10-11).
// Reads the real values of every variant of every component set, per color mode, so tools/style_parity.py can
// compare them with what Storybook renders (tools/storybook_snap.cjs). Names come from Figma, values are resolved
// through variable aliases for each mode, nothing is guessed.
//
// Run with FigCli Yolo eval or figma-console `figma_execute` (timeout 30000) on the project's DS file. It returns a
// JSON string: save it as <folder>/data/figma-styles.json. Reads only.
//
// Per variant and mode it records (null where Figma has nothing to compare):
//   root: fill, stroke, strokeWeight, radius, paddingTop/Right/Bottom/Left, gap, width, height, sizingH, sizingV, opacity
//   text (first visible text layer): textColor, fontFamily, fontSize, fontWeight, lineHeight
// Set SCOPE to a page name, a component set name, or 'all'. MODE_COLLECTION: the collection whose modes are measured
// ('auto' = the first collection with a mode named Dark; none -> one "Default" mode).
const SCOPE = 'all';
const MODE_COLLECTION = 'auto';

const r2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : null);
const hex2 = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0').toUpperCase();
const hex = (c, a) => '#' + hex2(c.r) + hex2(c.g) + hex2(c.b) + hex2(a === undefined ? 1 : a);

const collections = await figma.variables.getLocalVariableCollectionsAsync();
let modeCol = null;
if (MODE_COLLECTION === 'auto') modeCol = collections.find((c) => c.modes.some((m) => /dark/i.test(m.name))) || null;
else modeCol = collections.find((c) => c.name === MODE_COLLECTION) || null;
const MODES = modeCol ? modeCol.modes.map((m) => m.name) : ['Default'];

const varCache = new Map();
const colCache = new Map();
async function getVar(id) {
  if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id));
  return varCache.get(id);
}
async function getCol(id) {
  if (!colCache.has(id)) colCache.set(id, await figma.variables.getVariableCollectionByIdAsync(id));
  return colCache.get(id);
}
// Value of a variable in the mode named modeName (its collection's default mode when it has no such mode), following aliases.
async function resolve(id, modeName, depth = 0) {
  const v = await getVar(id);
  if (!v || depth > 8) return null;
  const col = await getCol(v.variableCollectionId);
  const mode = col && (col.modes.find((m) => m.name === modeName) || col.modes.find((m) => m.modeId === col.defaultModeId));
  const val = mode ? v.valuesByMode[mode.modeId] : Object.values(v.valuesByMode)[0];
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') return resolve(val.id, modeName, depth + 1);
  return val === undefined ? null : val;
}
const alias = (b) => (Array.isArray(b) ? b[0] : b);
async function num(node, key, mode) {
  const b = alias(node.boundVariables && node.boundVariables[key]);
  if (b && b.id) { const v = await resolve(b.id, mode); if (typeof v === 'number') return r2(v); }
  return typeof node[key] === 'number' ? r2(node[key]) : null;
}
async function paint(paints, mode) {
  if (!Array.isArray(paints)) return null;
  const p = paints.find((x) => x.visible !== false && x.type === 'SOLID');
  if (!p) return null;
  let c = p.color;
  let a = 1;
  const b = p.boundVariables && p.boundVariables.color;
  if (b && b.id) {
    const v = await resolve(b.id, mode);
    if (v && typeof v === 'object' && 'r' in v) { c = v; a = v.a === undefined ? 1 : v.a; }
  }
  return hex(c, a * (p.opacity === undefined ? 1 : p.opacity));
}
function firstText(node) {
  if (node.type === 'TEXT') return node.visible !== false && node.characters.trim() ? node : null;
  if (!('children' in node)) return null;
  for (const c of node.children) {
    if (c.visible === false) continue;
    const t = firstText(c);
    if (t) return t;
  }
  return null;
}

async function measure(node, mode) {
  const out = {};
  out.fill = await paint(node.fills, mode);
  const stroke = await paint(node.strokes, mode);
  out.stroke = stroke;
  out.strokeWeight = stroke ? await num(node, 'strokeWeight', mode) : 0;
  const rad = (await num(node, 'topLeftRadius', mode)) ?? (await num(node, 'cornerRadius', mode)) ?? 0;
  out.radius = r2(Math.min(rad, Math.min(node.width, node.height) / 2));
  const auto = node.layoutMode && node.layoutMode !== 'NONE';
  for (const k of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) out[k] = auto ? await num(node, k, mode) : null;
  out.gap = auto && node.children.filter((c) => c.visible !== false).length > 1 && node.primaryAxisAlignItems !== 'SPACE_BETWEEN'
    ? await num(node, 'itemSpacing', mode) : null;
  out.width = r2(node.width);
  out.height = r2(node.height);
  out.sizingH = node.layoutSizingHorizontal || 'FIXED';
  out.sizingV = node.layoutSizingVertical || 'FIXED';
  out.opacity = r2(node.opacity);
  const t = firstText(node);
  if (t) {
    out.textColor = await paint(t.fills, mode);
    out.fontFamily = t.fontName === figma.mixed ? null : t.fontName.family;
    out.fontSize = t.fontSize === figma.mixed ? null : await num(t, 'fontSize', mode);
    out.fontWeight = typeof t.fontWeight === 'number' ? t.fontWeight : null;
    const lh = t.lineHeight;
    out.lineHeight = lh === figma.mixed || !lh || lh.unit === 'AUTO' ? null
      : lh.unit === 'PIXELS' ? r2(lh.value) : r2((out.fontSize || 0) * lh.value / 100);
  }
  return out;
}

await figma.loadAllPagesAsync();
const targets = [];
for (const page of figma.root.children) {
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
    if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
    if (SCOPE === 'all' || page.name === SCOPE || n.name === SCOPE) targets.push(n);
  }
}

const components = {};
let variants = 0;
for (const n of targets) {
  const list = n.type === 'COMPONENT_SET' ? n.children.filter((c) => c.type === 'COMPONENT') : [n];
  const entry = components[n.name] = components[n.name] || {};
  for (const v of list) {
    const name = n.type === 'COMPONENT_SET' ? v.name : 'Default';
    entry[name] = {};
    for (const m of MODES) entry[name][m] = await measure(v, m);
    variants += 1;
  }
}
return JSON.stringify({
  meta: { tool: 'figma_styles.figma.js', file: figma.root.name, readAt: new Date().toISOString(),
          modeCollection: modeCol ? modeCol.name : null, modes: MODES, components: Object.keys(components).length, variants },
  components,
});
