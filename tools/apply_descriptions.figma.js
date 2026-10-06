// Writes component descriptions from the registry docs blocks (FigCli Yolo eval or Desktop Bridge figma_execute).
// 1. python tools/component_docs.py "<DS folder>" figma   -> data/figma-descriptions.json
// 2. Paste that JSON as DESCRIPTIONS below, check the file name (FIGMA_FILE with Yolo), run the whole file.
// Only descriptions change. Names are matched exactly against component sets and standalone components
// (variants inside a set are skipped). DRY_RUN = true reports what would change without writing.
const DESCRIPTIONS = {};
const DRY_RUN = true;

await figma.loadAllPagesAsync();
const nodes = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
  .filter((n) => n.type === 'COMPONENT_SET' || n.parent.type !== 'COMPONENT_SET');
const byName = {};
for (const n of nodes) (byName[n.name] = byName[n.name] || []).push(n);

const report = { file: figma.root.name, dryRun: DRY_RUN, updated: [], unchanged: [], notFound: [], duplicates: [] };
for (const [name, text] of Object.entries(DESCRIPTIONS)) {
  const found = byName[name] || [];
  if (!found.length) { report.notFound.push(name); continue; }
  if (found.length > 1) { report.duplicates.push(name); continue; }
  const node = found[0];
  if (node.description === text) { report.unchanged.push(name); continue; }
  if (!DRY_RUN) node.description = text;
  report.updated.push(name);
}
return report;
