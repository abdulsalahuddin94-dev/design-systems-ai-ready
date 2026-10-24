// Live check of a prototype (local dev or the published URL), in the prototype folder:
//   node scripts/check_live.mjs --url <https://.../name/ or http://localhost:5190/> [--shots <folder>]
// For every screen x Light/Dark x EN/AR, on desktop (1280 x 900) and phone width (390 x 844): the page renders DS
// components, no image is broken, no console error. Then: navigation (bottom navigation, Mini Player, Lyrics, back) and
// Inspect (a tap shows the component and Figma node without navigating). Prints a summary; exit code 1 on any problem.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const URL = opt('--url', 'http://localhost:5190/').replace(/\/?$/, '/');
const SHOTS = opt('--shots', null);
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const routes = fs.readFileSync(path.join(process.cwd(), 'src', 'generated', 'routes.tsx'), 'utf8');
const slugs = [...routes.matchAll(/\{ slug: "([^"]+)"/g)].map((m) => m[1]);

async function launch() {
  for (const channel of ['msedge', 'chrome', undefined]) {
    try { return await chromium.launch(channel ? { channel } : {}); } catch (e) { /* next */ }
  }
  throw new Error('No Chromium-based browser found');
}
const browser = await launch();
const problems = [];
const sizes = { desktop: { width: 1280, height: 900 }, phone: { width: 390, height: 844 } };
let pages = 0;
for (const [device, viewport] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: device === 'phone' });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const slug of slugs) for (const mode of ['Light', 'Dark']) for (const lang of ['en', 'ar']) {
    errors.length = 0;
    await page.goto(`${URL}#/${slug}?mode=${mode}&lang=${lang}`);
    try { await page.waitForSelector('.fp-screen [data-component]', { timeout: 20000 }); } catch (e) { problems.push(`${device} ${slug} ${mode} ${lang}: no DS component rendered`); continue; }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({
      comps: document.querySelectorAll('.fp-screen [data-component]').length,
      broken: [...document.querySelectorAll('.fp-screen img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      dir: document.querySelector('.fp-screen').getAttribute('dir'),
      mode: document.querySelector('.fp-screen').getAttribute('data-semantic'),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    pages++;
    if (r.broken.length) problems.push(`${device} ${slug} ${mode} ${lang}: ${r.broken.length} broken image(s), e.g. ${r.broken[0]}`);
    if (r.dir !== (lang === 'ar' ? 'rtl' : 'ltr') || r.mode !== mode) problems.push(`${device} ${slug} ${mode} ${lang}: mode/dir not applied`);
    if (device === 'phone' && r.overflowX) problems.push(`${device} ${slug} ${mode} ${lang}: horizontal page scroll`);
    if (errors.length) problems.push(`${device} ${slug} ${mode} ${lang}: console error ${errors[0].slice(0, 120)}`);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${device}-${slug}-${mode}-${lang}.png`) });
  }

  // Navigation and Inspect (Dark, EN).
  const at = async () => (await page.evaluate(() => location.hash)).replace(/^#\/?/, '').split('?')[0];
  const step = async (label, click, want) => {
    await click();
    await page.waitForTimeout(500);
    const now = await at();
    if (now !== want) problems.push(`${device} navigation: ${label} went to "${now}", expected "${want}"`);
  };
  await page.goto(`${URL}#/explore-viewport?mode=Dark&lang=en`);
  await page.waitForSelector('.fp-screen [data-component]');
  await step('Bottom Navigation > Search', () => page.locator('.fp-screen nav[aria-label="Main"] button').nth(1).click(), 'search-discover-viewport');
  await step('Mini Player', () => page.locator('.fp-screen .nav-mini-player').first().click({ position: { x: 60, y: 20 } }), 'now-playing');
  await step('Player Utility Bar > Lyrics', () => page.locator('.fp-screen .nav-utility-bar__action').first().click(), 'lyrics');
  await step('Collapse (back)', () => page.locator('.fp-screen [data-component="Icon Button"] button').first().click(), 'now-playing');
  await page.goto(`${URL}#/library-music?mode=Dark&lang=en`);
  await page.waitForSelector('.fp-screen [data-component]');
  await step('Primary Tabs > Podcasts', () => page.locator('.fp-screen [role="tab"]').nth(1).click(), 'library-podcasts');
  // Inspect
  await page.getByRole('button', { name: 'Inspect' }).click();
  const before = await at();
  await page.locator('.fp-screen [data-component="Mini Player"]').first().click({ position: { x: 60, y: 20 } });
  await page.waitForTimeout(300);
  const label = await page.locator('text=/· \\d/').first().textContent().catch(() => '');
  if (!/Mini Player · /.test(label || '')) problems.push(`${device} Inspect: shows "${label}", expected "Mini Player · <node>"`);
  if ((await at()) !== before) problems.push(`${device} Inspect: the tap navigated`);
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${device}-inspect.png`) });
  await page.close();
}
await browser.close();
console.log(`${pages} screen views checked (${slugs.length} screens x Light/Dark x EN/AR x desktop/phone) + navigation + Inspect`);
console.log(problems.length ? `${problems.length} problem(s):\n` + problems.join('\n') : 'No problems');
process.exit(problems.length ? 1 : 0);
