// Mode check for a design system Storybook page (paste into the browser console, or run with Playwright evaluate on
// .../iframe.html?id=<docs or story id>&viewMode=docs&globals=<key>:<mode>;...). Used by Storybook skill section 4 step 7.
// Returns { mode, dir, unreadable: [...], ltrInRtl: [...] }:
// - unreadable: visible text whose contrast against its real background is below 3:1 (docs chrome or component text
//   that did not follow Light / Dark). Must be empty in every mode.
// - ltrInRtl: when the Language mode is right to left, docs blocks still laid out left to right. Must be empty.
// - bothPlatforms (Mobile Adaptive): the page shows iOS and Android at the same time (side-by-side panels, both
//   platform files, or a code name of the other platform). Only the platform in the toolbar may show. Must be false.
// - untranslated (Language mode other than the default, e.g. AR): docs text still in the default language. Each entry is
//   a missing key for src/i18n/<mode>.json (translate it, or map it to itself when it must stay as is). Must be empty.
(() => {
  // rgb()/rgba() and color(srgb r g b / a) (what color-mix() computes to; channels 0-1)
  const parse = (c) => {
    const m = (c.match(/[\d.]+/g) || []).map(Number);
    if (/^color\(srgb/.test(c)) return [m[0] * 255, m[1] * 255, m[2] * 255, m[3] ?? 1];
    return m.length ? m : [0, 0, 0, 0];
  };
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
  const os = html.getAttribute('data-os');
  const text = document.body.innerText;
  const other = os === 'iOS' ? /Jetpack Compose|MaterialTheme\.|DesignTokens\.kt/ : os === 'Android' ? /SwiftUI|\.font\(\.|DesignTokens\.swift/ : null;
  const views = new Set([...document.querySelectorAll('[data-platform-view]')].map((n) => n.getAttribute('data-platform-view')));
  const bothPlatforms = views.size > 1 || (other ? other.test(text) : false);
  const i18n = window.__dsI18n;
  const untranslated = [];
  if (i18n && i18n.lang) {
    const w2 = document.createTreeWalker(document.querySelector('.sbdocs-wrapper') || document.body, NodeFilter.SHOW_TEXT);
    const keys = new Set();
    while (w2.nextNode()) {
      const t = w2.currentNode; const el = t.parentElement; const k = (t.nodeValue || '').trim();
      if (!el || !k || !/[A-Za-z]{2,}/.test(k) || /[؀-ۿ]/.test(k) || el.closest(i18n.skip) || i18n.has(k) || (i18n.isCode && i18n.isCode(k))) continue;
      const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') continue;
      keys.add(k);
    }
    untranslated.push(...keys);
  }
  const i18nMissing = i18n && i18n.lang && !i18n.active ? `no src/i18n/${i18n.lang}.json dictionary` : null;
  const mode = [...html.attributes].filter((a) => a.name.startsWith('data-') && a.name !== 'data-mode-scope').map((a) => `${a.name}=${a.value}`).join(' ');
  return { mode, dir: rtl ? 'rtl' : 'ltr', unreadable: unreadable.slice(0, 25), unreadableCount: unreadable.length, ltrInRtl, bothPlatforms, untranslated, i18nMissing, otherPlatformHit: other && (text.match(other) || [])[0] };
})();
