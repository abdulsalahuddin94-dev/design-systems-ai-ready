// read-only
// Export every local variable of the open Figma file as DTCG JSON, in the same shape as
// figma-console `figma_export_tokens` (format dtcg), so tools/build_tokens.py reads it unchanged.
// Use it when figma_export_tokens returns 0 tokens (seen in a trial for a file with 200 variables).
//
// Run with figma-console `figma_execute` (paste the whole file). It returns a JSON string: save it as
// <folder>/data/source/figma-variables.dtcg.json, then run `python tools/build_tokens.py "<folder>"`.
// Collection ids in the output are the ones config.json > collections must map.

const slug = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');
const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
const colorHex = (c) => '#' + hex2(c.r) + hex2(c.g) + hex2(c.b) + (c.a !== undefined && c.a < 1 ? hex2(c.a) : '');
const TYPE = { COLOR: 'color', FLOAT: 'number', STRING: 'string', BOOLEAN: 'boolean' };

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const colById = new Map(collections.map((c) => [c.id, c]));
const varById = new Map(variables.map((v) => [v.id, v]));

async function refFor(id) {
  let v = varById.get(id);
  if (!v) v = await figma.variables.getVariableByIdAsync(id); // alias to another library
  if (!v) return '{unresolved.' + id + '}';
  const col = colById.get(v.variableCollectionId) ||
    (await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId));
  const top = col ? slug(col.name) : 'remote';
  return '{' + top + '.' + v.name.split('/').map((p) => p.trim()).join('.') + '}';
}

const out = {};
for (const v of variables) {
  const col = colById.get(v.variableCollectionId);
  if (!col) continue;
  const modeName = new Map(col.modes.map((m) => [m.modeId, m.name]));
  const synced = {};
  let primary = null;
  for (const [modeId, val] of Object.entries(v.valuesByMode)) {
    const name = modeName.get(modeId) || modeId;
    if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      synced[name] = { reference: await refFor(val.id) };
    } else if (v.resolvedType === 'COLOR') {
      synced[name] = { literal: colorHex(val) };
    } else {
      synced[name] = { literal: val };
    }
  }
  primary = modeName.get(col.defaultModeId);
  const first = synced[primary] || Object.values(synced)[0];
  const token = {
    $type: TYPE[v.resolvedType] || 'string',
    $value: first.reference !== undefined ? first.reference : first.literal,
    $description: v.description || '',
    $extensions: {
      'figma-console-mcp': {
        codeSyntax: v.codeSyntax || {},
        collectionId: col.id,
        figmaResolvedType: v.resolvedType,
        lastSyncedValue: synced,
        primaryMode: primary,
        scopes: v.scopes,
        variableId: v.id,
      },
    },
  };
  let node = (out[slug(col.name)] = out[slug(col.name)] || {});
  const parts = v.name.split('/').map((p) => p.trim());
  for (const p of parts.slice(0, -1)) node = node[p] = node[p] || {};
  node[parts[parts.length - 1]] = token;
}
out.$extensions = {
  'figma-console-mcp': {
    exportedBy: 'tools/export_variables.figma.js',
    fileName: figma.root.name,
    collections: collections.map((c) => ({ id: c.id, name: c.name, modes: c.modes.map((m) => m.name) })),
    variableCount: variables.length,
  },
};
return JSON.stringify(out, null, 1);
