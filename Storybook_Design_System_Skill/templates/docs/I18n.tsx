/// <reference types="vite/client" />
// Docs translation for every design system Storybook with more than one Language mode (e.g. EN / AR).
// Copied into <storybook>/src/docs/ by tools/storybook_docs.py. Do not edit the copy; change the template.
//
// The docs are written in the default language. When the toolbar's Language mode is another one, every text node of the
// docs page is swapped for its translation from src/i18n/<mode>.json (lowercased Figma mode name, e.g. ar.json), and put
// back when the mode changes. The dictionary is { "<exact English text>": "<translation>" }; a value equal to its key
// keeps the text as is on purpose (brand or product names).
//
// Never translated: Figma names and code (code, pre, token names, component / property / variant / style names, mode
// names, the property name and value columns of the ArgTypes tables), and the components themselves (their texts are
// the Figma property defaults). Mark any other element with data-no-i18n.
// Missing translations: run templates/mode_check.js with the Language mode set; it lists them (untranslated) and the
// Storybook is not done until that list is empty.
import React from 'react';

type Dict = Record<string, string>;
const files = import.meta.glob('../i18n/*.json', { eager: true }) as Record<string, { default: Dict }>;
const DICTS: Record<string, Dict> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.json$/, '').toLowerCase(), (mod as any).default || (mod as any)]),
);

export const I18N_SKIP = [
  'code', 'pre', 'kbd', 'svg', 'style', 'script', 'input', 'textarea', 'select', 'option',
  '.sb-canvas', '.docs-story', '.dsd-stage', '[data-no-i18n]', '.dsd-code', '.dsd-sw-meta', '.dsd-sw-code', '.dsd-sw-sub',
  '.dsd-strip-cell', '.dsd-chip', '.dsd-type-meta', '.dsd-codecell', '.dsd-tabs',
  '[data-matrix] th', '.docblock-argstable td:first-child', '.docblock-argstable td:nth-child(3)', '.docblock-argstable td:nth-child(4)',
].join(', ');

/** Code-like text (hex, px values, token paths, code names) is never translated and never reported as missing. */
export const isCode = (s: string) => /^(#[0-9a-f]{3,8}|-?[\d.]+(px|%)?( \/ -?[\d.]+px)?|[\w.]+\(.*\)|[A-Za-z_][\w]*(\.[\w*<>()-]+)+|[\w -]+(\/[\w *<>-]+)+|➜ .+)$/i.test(s.trim());
const ORIGINAL = new WeakMap<Text, string>(); // the text React rendered
const WRITTEN = new WeakMap<Text, string>(); // the translation this file wrote
const translated = new Set<Text>();
const hasLetters = /[A-Za-z؀-ۿ]/;

function translateNode(t: Text, dict: Dict) {
  const el = t.parentElement;
  if (!el || el.closest(I18N_SKIP)) return;
  // a value that is not our own translation was written by React: it is the new original
  if (!WRITTEN.has(t) || t.nodeValue !== WRITTEN.get(t)) ORIGINAL.set(t, t.nodeValue ?? '');
  const raw = ORIGINAL.get(t) ?? '';
  const key = raw.trim();
  if (!key || !hasLetters.test(key) || isCode(key)) return;
  const tr = dict[key];
  if (tr === undefined || tr === key) return;
  const next = raw.replace(key, tr);
  WRITTEN.set(t, next);
  if (t.nodeValue !== next) t.nodeValue = next;
  translated.add(t);
}
function translateTree(root: Node, dict: Dict) {
  if (root.nodeType === Node.TEXT_NODE) { translateNode(root as Text, dict); return; }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) translateNode(w.currentNode as Text, dict);
}
function restoreAll() {
  translated.forEach((t) => { const o = ORIGINAL.get(t); if (o !== undefined && t.nodeValue === WRITTEN.get(t)) t.nodeValue = o; WRITTEN.delete(t); });
  translated.clear();
}

/** Translates everything inside while `lang` (the Language mode, lowercased) has a dictionary other than the default. */
export function I18nScope({ lang, children }: { lang?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const dict = lang ? DICTS[lang.toLowerCase()] : undefined;
  React.useEffect(() => {
    const root = ref.current;
    (window as any).__dsI18n = {
      lang: lang?.toLowerCase(), active: !!dict, skip: I18N_SKIP, isCode,
      has: (s: string) => !!dict && Object.prototype.hasOwnProperty.call(dict, s.trim()),
    };
    if (!root || !dict) { restoreAll(); return undefined; }
    // docs render in steps (stories, measured type): translate now and on every change below this element
    const page = root.closest('.sbdocs-wrapper') || root;
    translateTree(page, dict);
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'characterData') translateNode(m.target as Text, dict);
        m.addedNodes.forEach((n) => translateTree(n, dict));
      }
    });
    obs.observe(page, { subtree: true, childList: true, characterData: true });
    return () => { obs.disconnect(); restoreAll(); };
  }, [lang, dict]);
  return <div ref={ref} className="sb-i18n-scope" lang={lang}>{children}</div>;
}
