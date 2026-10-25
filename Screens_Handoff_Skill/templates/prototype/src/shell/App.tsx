// Prototype shell: flow list on the left, the screen inside a phone frame, Light/Dark and EN/AR switches, Inspect,
// and the Code panel (reference code per platform; an element picked with Inspect highlights its lines).
// The shell is chrome only (neutral colors); everything inside the phone comes from the generated screens, which use
// the project's DS components and tokens. ?bare=1 renders the screen alone at its Figma size (fidelity captures).
import React from 'react';
import { SCREENS, FLOWS, MODES, DEVICE, PROJECT } from '../generated/routes';
import { useRoute, href, go } from './nav';
import { CodePanel } from './CodePanel';

function Segmented({ value, options, onChange, label }: { value: string; options: string[]; onChange: (v: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-black/5 p-0.5 dark:bg-white/10">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}
          className={`rounded-md px-3 py-1 text-sm ${value === o ? 'bg-white shadow-sm text-black' : 'opacity-70'}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function ScreenView({ slug, mode, lang, bare, height }: { slug: string; mode: string; lang: string; bare: boolean; height?: number }) {
  const def = SCREENS.find((s) => s.slug === slug) || SCREENS[0];
  const Comp = def.Component;
  return (
    <div className="fp-screen" data-semantic={mode} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} data-screen={def.slug}
      style={{ width: def.w, height: bare ? def.h : Math.min(def.h, height ?? DEVICE.viewport), overflowY: bare ? 'hidden' : 'auto' }}>
      <Comp />
    </div>
  );
}

/** Window size, for the phone-width layout (no phone frame, screen scaled to the width). */
function useWindowSize() {
  const get = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [s, setS] = React.useState(get);
  React.useEffect(() => {
    const on = () => setS(get());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return s;
}

/** Inspect: hover (desktop) or tap (touch) an element to see its DS component and Figma node; a tap does not navigate.
 *  A tap also reports the element's Figma node and its parents' nodes, so the Code panel can highlight its lines. */
function Inspector({ onPick }: { onPick: (ids: string[]) => void }) {
  const [hit, setHit] = React.useState<{ c: string; id: string } | null>(null);
  React.useEffect(() => {
    const read = (e: Event) => {
      const el = (e.target as HTMLElement).closest('[data-component], [data-figma-node]') as HTMLElement | null;
      if (!el || !el.closest('.fp-screen')) return null;
      return { c: el.dataset.component || el.dataset.figmaName || 'Frame', id: el.dataset.figmaNode || '', el };
    };
    const chain = (el: HTMLElement) => {
      const ids: string[] = [];
      for (let n: HTMLElement | null = el; n && !n.classList.contains('fp-screen'); n = n.parentElement) {
        if (n.dataset.figmaNode) ids.push(n.dataset.figmaNode);
      }
      return ids;
    };
    const over = (e: MouseEvent) => { const h = read(e); setHit(h && { c: h.c, id: h.id }); };
    const tap = (e: MouseEvent) => {
      const h = read(e);
      if (h) { e.preventDefault(); e.stopPropagation(); setHit({ c: h.c, id: h.id }); onPick(chain(h.el)); }
    };
    document.addEventListener('mouseover', over);
    document.addEventListener('click', tap, true);
    return () => { document.removeEventListener('mouseover', over); document.removeEventListener('click', tap, true); };
  }, []);
  return <div className="h-5 px-3 text-center text-xs font-mono opacity-80">{hit ? `${hit.c} · ${hit.id}` : 'Hover or tap an element'}</div>;
}

export function App() {
  const r = useRoute();
  const win = useWindowSize();
  const [inspect, setInspect] = React.useState(false);
  const [code, setCode] = React.useState(false);
  const [picked, setPicked] = React.useState<string[]>([]);
  React.useEffect(() => { setPicked([]); }, [r.slug]);
  React.useEffect(() => { if (!r.slug && SCREENS[0]) go(SCREENS[0].slug); }, [r.slug]);
  React.useEffect(() => { document.documentElement.dataset.shell = r.mode === 'Dark' ? 'dark' : 'light'; }, [r.mode]);
  if (!SCREENS.length) return <p className="p-6">No screens generated yet. Run tools/build_prototype.py.</p>;
  const slug = r.slug || SCREENS[0].slug;
  const def = SCREENS.find((s) => s.slug === slug) || SCREENS[0];

  if (r.bare) return (
    <div data-inspect="off" style={{ width: def.w }}>
      <ScreenView slug={slug} mode={r.mode} lang={r.lang} bare />
      {r.overlay && <div style={{ position: 'absolute', inset: 0 }}><ScreenView slug={r.overlay} mode={r.mode} lang={r.lang} bare /></div>}
    </div>
  );

  // Phone width: no side list (a screen picker instead), no phone frame, the screen scaled to the window width.
  const narrow = win.w < 768;
  const toolbarH = 104;
  const zoom = narrow ? Math.min(1, win.w / def.w) : 1;
  const screenH = narrow ? Math.floor((win.h - toolbarH) / zoom) : DEVICE.viewport;
  const screen = (
    <>
      <ScreenView slug={slug} mode={r.mode} lang={r.lang} bare={false} height={screenH} />
      {r.overlay && (
        <div className="absolute inset-0 bg-black/40">
          <ScreenView slug={r.overlay} mode={r.mode} lang={r.lang} bare={false} height={screenH} />
        </div>
      )}
    </>
  );

  return (
    <div className={`flex h-full ${r.mode === 'Dark' ? 'dark' : ''}`}>
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-black/10 p-4 md:block dark:border-white/10">
        <div className="mb-1 text-xs uppercase tracking-wide opacity-60">Live prototype</div>
        <div className="mb-4 text-lg font-semibold">{PROJECT.name}</div>
        {FLOWS.map((f) => (
          <nav key={f.name} aria-label={f.name} className="mb-4">
            <div className="mb-1 text-sm font-medium opacity-70">{f.name}</div>
            <ul className="space-y-0.5">
              {f.slugs.map((s) => {
                const d = SCREENS.find((x) => x.slug === s)!;
                return (
                  <li key={s}>
                    <a href={href({ slug: s, overlay: null })} aria-current={s === slug ? 'page' : undefined}
                      className={`block rounded-md px-2 py-1 text-sm ${s === slug ? 'bg-black/10 font-medium dark:bg-white/15' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                      {d.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
        <div className="mt-6 text-xs opacity-60">Figma: {PROJECT.figmaFile}<br />Exported {PROJECT.exportedAt.slice(0, 10)}</div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col items-center overflow-auto">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 p-3 md:gap-3">
          <label className="w-full md:hidden">
            <span className="sr-only">Screen</span>
            <select value={slug} onChange={(e) => go(e.target.value)}
              className="w-full rounded-lg bg-black/5 px-3 py-1.5 text-sm dark:bg-white/10 [&>option]:bg-white [&>option]:text-black">
              {SCREENS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </label>
          <Segmented label="Color mode" value={r.mode} options={MODES} onChange={(m) => { window.location.hash = href({ mode: m }); }} />
          <Segmented label="Language" value={r.lang === 'ar' ? 'AR' : 'EN'} options={['EN', 'AR']} onChange={(l) => { window.location.hash = href({ lang: l.toLowerCase() }); }} />
          <button type="button" aria-pressed={inspect} onClick={() => setInspect(!inspect)}
            className={`rounded-lg px-3 py-1 text-sm ${inspect ? 'bg-pink-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>Inspect</button>
          <button type="button" aria-pressed={code} onClick={() => setCode(!code)}
            className={`rounded-lg px-3 py-1 text-sm ${code ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-black/5 dark:bg-white/10'}`}>Code</button>
        </div>
        {inspect && narrow && <Inspector onPick={setPicked} />}
        {narrow ? (
          <div data-inspect={inspect ? 'on' : 'off'} className="relative" style={{ zoom }} aria-label="Screen">{screen}</div>
        ) : (
          <div data-inspect={inspect ? 'on' : 'off'} className="relative my-2 rounded-[44px] bg-neutral-900 p-3 shadow-2xl ring-1 ring-black/40" aria-label="Android phone">
            <div className="relative overflow-hidden rounded-[32px]">
              {screen}
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />
            </div>
          </div>
        )}
        {inspect && !narrow && <Inspector onPick={setPicked} />}
        {code && narrow && <div aria-hidden="true" className="h-[60vh] shrink-0" />}
      </main>
      {code && <CodePanel slug={slug} picked={picked} narrow={narrow} onClose={() => setCode(false)} />}
    </div>
  );
}
