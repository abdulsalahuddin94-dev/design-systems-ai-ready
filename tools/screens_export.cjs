#!/usr/bin/env node
// Live Prototype trial (Screens_Handoff_Skill): read a Design file's screens into data/screens.json. Read only.
// Usage (from the Root):
//   node tools/screens_export.cjs --file "Brownfield Design" --page Listen --out "<folder>/prototype/data" [--only "Lyrics,Search"] [--no-images] [--png]
// Runs tools/screens_export.figma.js through FigCli Yolo (FIGMA_FILE = --file), one eval per screen, then exports every
// image layer (artwork photos) as PNG into <out>/assets/ and, with --png, each screen frame at 1x into <out>/figma/
// (the fidelity reference). FigCli folder: FIGMA_CLI_DIR, else a figma-cli* folder in a Tools folder at the drive root,
// next to the Root, or in the home folder (same search as tools/figma_tools_check.py).
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(k);

function findFigCli() {
  const cands = [];
  if (process.env.FIGMA_CLI_DIR) cands.push(process.env.FIGMA_CLI_DIR);
  const bases = [path.join(path.parse(ROOT).root, 'Tools'), path.join(ROOT, '..', 'Tools'), path.join(os.homedir(), 'Tools')];
  for (const b of bases) {
    try { for (const d of fs.readdirSync(b)) if (d.startsWith('figma-cli')) cands.push(path.join(b, d)); } catch (e) { /* no folder */ }
  }
  const dir = cands.find((d) => fs.existsSync(path.join(d, 'src', 'index.js')));
  if (!dir) throw new Error('FigCli not found (set FIGMA_CLI_DIR)');
  return dir;
}

const FILE = opt('--file');
const PAGE = opt('--page', 'Listen');
const OUT = path.resolve(opt('--out', '.'));
const ONLY = (opt('--only', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
if (!FILE) { console.error('--file "<exact Figma file name>" is required'); process.exit(2); }

const CLI = findFigCli();
const env = Object.assign({}, process.env, { FIGMA_FILE: FILE });
const fig = (cmdArgs, timeout = 120000) => execFileSync('node', [path.join(CLI, 'src', 'index.js'), ...cmdArgs], { env, encoding: 'utf8', timeout, maxBuffer: 64 << 20 });

const SCRIPT = fs.readFileSync(path.join(__dirname, 'screens_export.figma.js'), 'utf8');
function evalJson(opts) {
  const tmp = path.join(os.tmpdir(), `screens_export_${process.pid}.js`);
  fs.writeFileSync(tmp, SCRIPT.replace('__OPTS__', JSON.stringify(opts)));
  const out = fig(['eval', '--file', tmp]);
  fs.unlinkSync(tmp);
  // FigCli may wrap the result or append notes: keep the outer JSON object only.
  const a = out.indexOf('{'), b = out.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('No JSON from Figma:\n' + out.slice(0, 500));
  let txt = out.slice(a, b + 1);
  let res;
  try { res = JSON.parse(txt); } catch (e) { res = JSON.parse(JSON.parse('"' + txt.replace(/^"|"$/g, '') + '"')); }
  if (typeof res === 'string') res = JSON.parse(res);
  if (out.length >= 19900) throw new Error('FigCli output reached its 20,000-character limit; export fewer nodes per call');
  if (res.error) throw new Error(res.error);
  return res;
}

// 1. File check + list of screens.
const list = evalJson({ mode: 'list', page: PAGE });
if (list.file !== FILE) { console.error(`Open file is "${list.file}", expected "${FILE}". Nothing read.`); process.exit(3); }
let frames = list.frames;
if (ONLY.length) frames = frames.filter((f) => ONLY.some((o) => f.n.includes(o)));
console.log(`${list.file} > ${list.page}: ${frames.length} screens`);

// 2. One eval per screen.
fs.mkdirSync(OUT, { recursive: true });
const screens = [];
for (const f of frames) {
  const t0 = Date.now();
  const s = evalJson({ mode: 'screen', id: f.id });
  s.section = f.section; s.w = f.w; s.h = f.h;
  if (!Object.keys(s.modes || {}).length) s.modes = f.modes;
  screens.push(s);
  console.log(`  ${f.n} (${f.id}) ${Math.round((Date.now() - t0) / 100) / 10}s`);
}

// 3. Images (artwork photos) and, with --png, the screen frames themselves.
const images = new Map();
const collect = (n) => {
  for (const im of n.img && Array.isArray(n.img) ? n.img : []) images.set(im.id, im);
  if (n.img === true) images.set(n.id, { id: n.id, n: n.n, w: n.w, h: n.h });
  for (const c of n.ch || []) collect(c);
};
screens.forEach((s) => collect(s.tree));
const fileName = (id) => id.replace(/[:;]/g, '-') + '.png';
if (!flag('--no-images')) {
  const dir = path.join(OUT, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  for (const im of images.values()) {
    const p = path.join(dir, fileName(im.id));
    if (fs.existsSync(p)) continue;
    fig(['export', 'node', im.id, '-o', p, '-s', '2']);
  }
  console.log(`  ${images.size} image layers in assets/`);
}
if (flag('--png')) {
  const dir = path.join(OUT, 'figma');
  fs.mkdirSync(dir, { recursive: true });
  for (const s of screens) fig(['export', 'node', s.id, '-o', path.join(dir, fileName(s.id)), '-s', '1']);
  console.log(`  ${screens.length} screen PNGs in figma/`);
}

const out = { file: list.file, page: list.page, exported_at: new Date().toISOString(), screens };
fs.writeFileSync(path.join(OUT, 'screens.json'), JSON.stringify(out, null, 1));
console.log('Wrote', path.join(OUT, 'screens.json'));
