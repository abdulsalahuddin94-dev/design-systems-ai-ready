// Prototype shell: flow list on the left, the screen inside a phone frame, Light/Dark and EN/AR switches, Inspect.
// The shell is chrome only (neutral colors); everything inside the phone comes from the generated screens, which use
// the project's DS components and tokens. ?bare=1 renders the screen alone at its Figma size (fidelity captures).
import React from 'react';
import { SCREENS, FLOWS, MODES, DEVICE, PROJECT } from '../generated/routes';
import { useRoute, href, go } from './nav';

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

function ScreenView({ slug, mode, lang, bare }: { slug: string; mode: string; lang: string; bare: boolean }) {
  const def = SCREENS.find((s) => s.slug === slug) || SCREENS[0];
  const Comp = def.Component;
  return (
    <div className="fp-screen" data-semantic={mode} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} data-screen={def.slug}
      style={{ width: def.w, height: bare ? def.h : Math.min(def.h, DEVICE.viewport), overflowY: bare ? 'hidden' : 'auto' }}>
      <Comp />
    </div>
  );
}

function Inspector() {
  const [hit, setHit] = React.useState<{ c: string; id: string } | null>(null);
  React.useEffect(() => {
    const on = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-figma-node]') as HTMLElement | null;
      setHit(el ? { c: el.dataset.component || el.dataset.figmaName || 'Frame', id: el.dataset.figmaNode || '' } : null);
    };
    document.addEventListener('mouseover', on);
    return () => document.removeEventListener('mouseover', on);
  }, []);
  return <div className="h-5 text-xs font-mono opacity-80">{hit ? `${hit.c} · ${hit.id}` : 'Hover an element'}</div>;
}

export function App() {
  const r = useRoute();
  const [inspect, setInspect] = React.useState(false);
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

  return (
    <div className={`flex h-full ${r.mode === 'Dark' ? 'dark' : ''}`}>
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-black/10 p-4 dark:border-white/10">
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
        <div className="flex w-full flex-wrap items-center justify-center gap-3 p-3">
          <Segmented label="Color mode" value={r.mode} options={MODES} onChange={(m) => { window.location.hash = href({ mode: m }); }} />
          <Segmented label="Language" value={r.lang === 'ar' ? 'AR' : 'EN'} options={['EN', 'AR']} onChange={(l) => { window.location.hash = href({ lang: l.toLowerCase() }); }} />
          <button type="button" aria-pressed={inspect} onClick={() => setInspect(!inspect)}
            className={`rounded-lg px-3 py-1 text-sm ${inspect ? 'bg-pink-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>Inspect</button>
        </div>
        <div data-inspect={inspect ? 'on' : 'off'} className="relative my-2 rounded-[44px] bg-neutral-900 p-3 shadow-2xl ring-1 ring-black/40" aria-label="Android phone">
          <div className="relative overflow-hidden rounded-[32px]">
            <ScreenView slug={slug} mode={r.mode} lang={r.lang} bare={false} />
            {r.overlay && (
              <div className="absolute inset-0 bg-black/40">
                <ScreenView slug={r.overlay} mode={r.mode} lang={r.lang} bare={false} />
              </div>
            )}
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
        {inspect && <Inspector />}
      </main>
    </div>
  );
}
