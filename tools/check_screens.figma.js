// read-only
// Screen fidelity check for Design files (Design_System_Intake_Skill section 7f; used by ds-auditor screens mode).
// Run with figma-console `figma_execute` (paste the whole file, timeout 30000). Reads only.
// It finds structural signs that a screen does not match its source; the visual comparison with the
// source screenshot is still done by eye (section 7f step 4). Reports, per screen frame:
//   - placeholders: instance texts still at a default ("Label", "Filter", "Track title"...)
//   - repeatedTexts: sibling instances of one component that all show the same text (4 chips "Filter")
//   - overflow: layers that stick out of the screen frame
//   - squashed: instances narrower than 80% of their main component
//   - bars: app bars / mini player / navigation that are not full-bleed (narrower than the screen)
//   - unboundFrame: raw fill, padding or gap on the screen frame itself
//   - counts: instances per component (compare with the item counts in the screen spec)
// SCOPE: a section or frame name holding the screens, or 'page' for every top-level frame on the current page.
const SCOPE = 'page';

const PLACEHOLDERS = ['label', 'filter', 'title', 'track title', 'subtitle', 'text', 'button', 'placeholder',
  'artist · album', 'supporting text', 'headline', 'body', 'lorem ipsum', 'item', 'tab', 'chip', 'name'];
// Floating bars (e.g. an inset mini player) are not listed: their width comes from the screen spec.
const BAR_WORDS = ['app bar', 'top bar', 'navigation bar', 'bottom navigation', 'tab bar', 'status bar', 'toolbar', 'button docked'];
const PAD = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing'];

function box(n) { return n.absoluteBoundingBox || { x: n.x, y: n.y, width: n.width, height: n.height }; }

async function checkScreen(screen) {
  const r = { screen: screen.name, size: Math.round(screen.width) + 'x' + Math.round(screen.height),
    placeholders: [], repeatedTexts: [], overflow: [], squashed: [], bars: [], unboundFrame: [], counts: {} };
  const sb = box(screen);

  const bv = screen.boundVariables || {};
  const fills = Array.isArray(screen.fills) ? screen.fills : [];
  fills.forEach((p, i) => { if (p.visible !== false && p.type === 'SOLID' && !(p.boundVariables && p.boundVariables.color)) r.unboundFrame.push('fill #' + i + ' raw'); });
  if (screen.layoutMode && screen.layoutMode !== 'NONE') for (const k of PAD) if (screen[k] > 0 && !bv[k]) r.unboundFrame.push(k + ' ' + screen[k] + ' unbound');

  const instances = screen.findAll((n) => n.type === 'INSTANCE');
  const topInstances = instances.filter((n) => { let p = n.parent; while (p && p !== screen) { if (p.type === 'INSTANCE') return false; p = p.parent; } return true; });

  const groups = {};
  for (const inst of topInstances) {
    const main = await inst.getMainComponentAsync();
    const comp = main ? (main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent.name : main.name) : inst.name;
    r.counts[comp] = (r.counts[comp] || 0) + 1;

    const texts = inst.findAll((n) => n.type === 'TEXT').map((t) => t.characters.trim());
    for (const t of texts) if (PLACEHOLDERS.includes(t.toLowerCase())) r.placeholders.push(comp + ': "' + t + '"');
    const key = (inst.parent ? inst.parent.id : '') + '|' + comp;
    (groups[key] = groups[key] || []).push(texts.join(' / '));

    if (main && inst.width < main.width * 0.8) r.squashed.push(comp + ': ' + Math.round(inst.width) + ' wide, component ' + Math.round(main.width));

    const lower = comp.toLowerCase();
    if (BAR_WORDS.some((w) => lower.includes(w)) && inst.width < screen.width - 1) r.bars.push(comp + ': ' + Math.round(inst.width) + ' wide, screen ' + Math.round(screen.width) + ' (not full-bleed)');
  }
  for (const [key, list] of Object.entries(groups)) {
    if (list.length > 1 && new Set(list).size === 1) r.repeatedTexts.push(key.split('|')[1] + ' x' + list.length + ': all "' + list[0].slice(0, 40) + '"');
  }

  screen.findAll((n) => n.visible !== false && (n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'GROUP')).forEach((n) => {
    const b = box(n);
    if (!b) return;
    const out = b.x < sb.x - 1 || b.y < sb.y - 1 || b.x + b.width > sb.x + sb.width + 1 || b.y + b.height > sb.y + sb.height + 1;
    const parentScrolls = n.parent && n.parent.overflowDirection && n.parent.overflowDirection !== 'NONE';
    if (out && !parentScrolls) r.overflow.push(n.name + ' (' + Math.round(b.width) + 'x' + Math.round(b.height) + ')');
  });
  r.overflow = r.overflow.slice(0, 20);
  r.issues = r.placeholders.length + r.repeatedTexts.length + r.overflow.length + r.squashed.length + r.bars.length + r.unboundFrame.length;
  return r;
}

let screens = [];
if (SCOPE === 'page') {
  screens = figma.currentPage.children.filter((n) => n.type === 'FRAME');
  for (const s of figma.currentPage.children.filter((n) => n.type === 'SECTION')) screens.push(...s.children.filter((n) => n.type === 'FRAME'));
} else {
  const holder = figma.currentPage.findOne((n) => n.name === SCOPE && (n.type === 'SECTION' || n.type === 'FRAME'));
  if (!holder) return { error: 'No section or frame named ' + SCOPE + ' on the current page' };
  screens = holder.type === 'SECTION' ? holder.children.filter((n) => n.type === 'FRAME') : [holder];
}

const results = [];
for (const s of screens) results.push(await checkScreen(s));
return { screens: results.length, totalIssues: results.reduce((a, r) => a + r.issues, 0), results };
