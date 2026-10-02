// Split fallback (Design_System_Intake_Skill section 7g, path 2 step 6).
// Run with figma-console `figma_execute` on the NEW Design file (timeout 60000), after the DS file is published
// and its library is enabled here. Run with DRY_RUN = true first and show the counts; run for real only after approval.
// For every screen in SCOPE it:
//   - swaps instances of LOCAL components for the library component with the same name (component set + variant name);
//     swapComponent keeps text, boolean and instance-swap overrides where layer names match;
//   - rebinds LOCAL variables (fills, strokes, padding, gap, radius, size...) to the library variable with the same name
//     and collection name;
//   - moves explicit variable modes (Light / Dark) on frames from local collections to the library collection;
//   - re-links local text, paint and effect styles to the library style with the same name.
// Nothing is guessed: anything with no library match is listed in `unmatched`.
// SCOPE: a section or frame name holding the screens, or 'page' for every top-level frame on the current page.
const SCOPE = 'page';
const DRY_RUN = true;
// Library keys by name. Fill from the project's data/component-registry.json (component or component set keys) and
// data/tokens.json (style keys). Keys of remote instances already on this page are collected automatically.
const COMPONENT_KEYS = { /* 'Button': '<component set key>', 'Divider': '<component key>' */ };
const STYLE_KEYS = { /* 'Body/Medium': '<style key>', 'Shadow/Small': '<style key>' */ };

const report = { dryRun: DRY_RUN, screens: 0, swapped: 0, rebound: 0, modes: 0, styles: 0, unmatched: [] };
const miss = (what, node, name) => report.unmatched.push(what + ': ' + name + ' (layer ' + node.name + ')');

function screens() {
  if (SCOPE === 'page') return figma.currentPage.children.filter((n) => n.type === 'FRAME' || n.type === 'SECTION');
  const root = figma.currentPage.findOne((n) => n.name === SCOPE);
  if (!root) throw new Error('SCOPE not found: ' + SCOPE);
  return [root];
}

// ---- components ----
const compCache = {};
async function libraryComponent(setName, variantName) {
  const id = setName + '|' + variantName;
  if (id in compCache) return compCache[id];
  let found = null;
  const key = COMPONENT_KEYS[setName];
  if (key) {
    try {
      const set = await figma.importComponentSetByKeyAsync(key);
      found = set.children.find((c) => c.name === variantName) || null;
    } catch (e) {
      try { found = await figma.importComponentByKeyAsync(key); } catch (e2) { found = null; }
    }
  }
  compCache[id] = found;
  return found;
}
async function collectRemoteKeys(roots) {
  for (const root of roots) for (const inst of root.findAll((n) => n.type === 'INSTANCE')) {
    const main = await inst.getMainComponentAsync();
    if (!main || !main.remote) continue;
    const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    const name = set ? set.name : main.name;
    if (!COMPONENT_KEYS[name]) COMPONENT_KEYS[name] = set ? set.key : main.key;
  }
}

// ---- variables ----
const libVars = {};      // 'Collection/Variable name' -> library variable key
const libCollections = {}; // collection name -> library collection key
async function loadLibraryVariables() {
  for (const col of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()) {
    libCollections[col.name] = col.key;
    for (const v of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(col.key)) libVars[col.name + '/' + v.name] = v.key;
  }
}
const varCache = {};
async function libraryVariableFor(localId) {
  if (localId in varCache) return varCache[localId];
  let out = null;
  const local = await figma.variables.getVariableByIdAsync(localId);
  if (local && !local.remote) {
    const col = await figma.variables.getVariableCollectionByIdAsync(local.variableCollectionId);
    const key = libVars[col.name + '/' + local.name];
    if (key) out = await figma.variables.importVariableByKeyAsync(key);
    else out = { missing: col.name + '/' + local.name };
  }
  varCache[localId] = out;
  return out;
}
async function rebindPaints(node, prop) {
  const paints = node[prop];
  if (!Array.isArray(paints)) return;
  let changed = false;
  const next = [];
  for (const p of paints) {
    const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
    const lib = id ? await libraryVariableFor(id) : null;
    if (lib && lib.missing) { miss('variable', node, lib.missing); next.push(p); continue; }
    if (lib) { next.push(figma.variables.setBoundVariableForPaint(p, 'color', lib)); changed = true; report.rebound++; } else next.push(p);
  }
  if (changed && !DRY_RUN) node[prop] = next;
}
async function rebindFields(node) {
  const bv = node.boundVariables || {};
  for (const field of Object.keys(bv)) {
    if (field === 'fills' || field === 'strokes' || field === 'effects' || field === 'textRangeFills') continue;
    const alias = Array.isArray(bv[field]) ? bv[field][0] : bv[field];
    if (!alias || !alias.id) continue;
    const lib = await libraryVariableFor(alias.id);
    if (!lib) continue;
    if (lib.missing) { miss('variable', node, lib.missing); continue; }
    report.rebound++;
    if (!DRY_RUN) node.setBoundVariable(field, lib);
  }
  if (bv.effects) miss('effect variable (rebind by hand or use an effect style)', node, 'effects');
}
async function moveModes(node) {
  const modes = node.explicitVariableModes || {};
  for (const colId of Object.keys(modes)) {
    const col = await figma.variables.getVariableCollectionByIdAsync(colId);
    if (!col || col.remote) continue;
    const libKey = libCollections[col.name];
    const mode = col.modes.find((m) => m.modeId === modes[colId]);
    if (!libKey || !mode) { miss('mode', node, col.name); continue; }
    const libVarKey = Object.keys(libVars).find((k) => k.startsWith(col.name + '/'));
    const v = libVarKey && await figma.variables.importVariableByKeyAsync(libVars[libVarKey]);
    const libCol = v && await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
    const libMode = libCol && libCol.modes.find((m) => m.name === mode.name);
    if (!libMode) { miss('mode', node, col.name + ' / ' + mode.name); continue; }
    report.modes++;
    if (!DRY_RUN) { node.setExplicitVariableModeForCollection(libCol, libMode.modeId); node.clearExplicitVariableModeForCollection(col); }
  }
}

// ---- styles ----
const styleCache = {};
async function relinkStyle(node, prop, setter) {
  const id = node[prop];
  if (!id || typeof id !== 'string') return;
  const local = await figma.getStyleByIdAsync(id);
  if (!local || local.remote) return;
  if (!(local.name in styleCache)) {
    const key = STYLE_KEYS[local.name];
    styleCache[local.name] = key ? await figma.importStyleByKeyAsync(key).catch(() => null) : null;
  }
  const lib = styleCache[local.name];
  if (!lib) { miss('style', node, local.name); return; }
  report.styles++;
  if (!DRY_RUN) await node[setter](lib.id);
}

// ---- run ----
const roots = screens();
await collectRemoteKeys(roots);
await loadLibraryVariables();
for (const root of roots) {
  report.screens++;
  // Swap local instances first (outermost first), then rebind what is left.
  const locals = [];
  for (const inst of root.findAll((n) => n.type === 'INSTANCE')) {
    const main = await inst.getMainComponentAsync();
    if (main && !main.remote) locals.push({ inst, main });
  }
  for (const { inst, main } of locals) {
    if (inst.removed) continue;
    const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    const lib = await libraryComponent(set ? set.name : main.name, main.name);
    if (!lib) { miss('component', inst, set ? set.name + ' / ' + main.name : main.name); continue; }
    report.swapped++;
    if (!DRY_RUN) inst.swapComponent(lib);
  }
  const nodes = [root, ...root.findAll(() => true)];
  for (const n of nodes) {
    if (n.removed) continue;
    await rebindPaints(n, 'fills');
    await rebindPaints(n, 'strokes');
    await rebindFields(n);
    await moveModes(n);
    if (n.type === 'TEXT') await relinkStyle(n, 'textStyleId', 'setTextStyleIdAsync');
    await relinkStyle(n, 'fillStyleId', 'setFillStyleIdAsync');
    await relinkStyle(n, 'strokeStyleId', 'setStrokeStyleIdAsync');
    await relinkStyle(n, 'effectStyleId', 'setEffectStyleIdAsync');
  }
}
report.unmatched = [...new Set(report.unmatched)];
return report;
