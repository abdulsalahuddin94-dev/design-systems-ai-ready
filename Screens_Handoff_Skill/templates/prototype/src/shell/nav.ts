// Prototype navigation from the Figma reactions: NAVIGATE -> go(screen), OVERLAY -> overlay(screen), BACK -> back().
// State lives in the URL hash (#/<slug>?mode=Dark&lang=ar&bare=1) so every view can be opened and captured directly.
// embed=1: shown inside the Atomica dashboard, which has its own screen picker (no side list, banner or picker here).
import React from 'react';

export type Route = { slug: string; mode: string; lang: string; bare: boolean; embed: boolean; overlay: string | null; comment: string | null };

export function parse(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [slug, q = ''] = h.split('?');
  const p = new URLSearchParams(q);
  return { slug, mode: p.get('mode') || 'Dark', lang: p.get('lang') || 'en', bare: p.get('bare') === '1', embed: p.get('embed') === '1', overlay: p.get('overlay'), comment: p.get('comment') };
}

export function href(r: Partial<Route>): string {
  const c = { ...parse(), ...r };
  const p = new URLSearchParams({ mode: c.mode, lang: c.lang });
  if (c.bare) p.set('bare', '1');
  if (c.embed) p.set('embed', '1');
  if (c.overlay) p.set('overlay', c.overlay);
  if (c.comment) p.set('comment', c.comment); // a link to one comment: #/<screen>?comment=<id>
  return `#/${c.slug}?${p.toString()}`;
}

export const go = (slug: string) => { if (slug) window.location.hash = href({ slug, overlay: null, comment: null }); };
export const overlay = (slug: string) => { window.location.hash = href({ overlay: slug }); };
export const back = () => {
  const r = parse();
  if (r.overlay) window.location.hash = href({ overlay: null });
  else window.history.back();
};

export function useRoute(): Route {
  const [r, setR] = React.useState(parse);
  React.useEffect(() => {
    const on = () => setR(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}
