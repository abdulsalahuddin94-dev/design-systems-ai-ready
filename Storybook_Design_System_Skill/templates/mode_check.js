// Mode check for a design system Storybook page (paste into the browser console, or run with Playwright evaluate on
// .../iframe.html?id=<docs or story id>&viewMode=docs&globals=<key>:<mode>;...). Used by Storybook skill section 4 step 7.
// Returns { mode, dir, unreadable: [...], ltrInRtl: [...] }:
// - unreadable: visible text whose contrast against its real background is below 3:1 (docs chrome or component text
//   that did not follow Light / Dark). Must be empty in every mode.
// - ltrInRtl: when the Language mode is right to left, docs blocks still laid out left to right. Must be empty.
(() => {
  const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if ((c[3] ?? 1) > 0.5) return c;
    }
    return [255, 255, 255, 1];
  };
  const unreadable = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; const el = t.parentElement;
    if (!el || seen.has(el) || !t.textContent.trim()) continue;
    seen.add(el);
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (s.visibility === 'hidden' || s.display === 'none' || r.width === 0 || +s.opacity === 0) continue;
    if (el.closest('[aria-disabled="true"], :disabled, [data-state="Disabled"], .dsd-sw-face, .dsd-anchor-face, .dsd-strip-color')) continue; // disabled states and color faces are allowed to be low contrast
    const k = ratio(parse(s.color), bgOf(el));
    if (k < 3) unreadable.push(`${k.toFixed(2)}:1 "${t.textContent.trim().slice(0, 40)}" <${el.tagName.toLowerCase()} class="${el.className}">`);
  }
  const html = document.documentElement;
  const rtl = html.getAttribute('data-dir') === 'rtl';
  const ltrInRtl = rtl ? [...document.querySelectorAll('.dsd, .sb-canvas')].filter((n) => getComputedStyle(n).direction !== 'rtl').map((n) => n.className) : [];
  const mode = [...html.attributes].filter((a) => a.name.startsWith('data-') && a.name !== 'data-mode-scope').map((a) => `${a.name}=${a.value}`).join(' ');
  return { mode, dir: rtl ? 'rtl' : 'ltr', unreadable: unreadable.slice(0, 25), unreadableCount: unreadable.length, ltrInRtl };
})();
