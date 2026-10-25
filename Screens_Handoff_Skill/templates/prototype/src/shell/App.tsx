// Prototype shell: flow list on the left, the screen inside a phone frame, Light/Dark and EN/AR switches, Inspect,
// the Code panel (reference code per platform; an element picked with Inspect highlights its lines) and Comments
// (a tap drops a pin with the element's Figma node; comments are shared through Supabase or kept locally).
// The shell is chrome only (neutral colors); everything inside the phone comes from the generated screens, which use
// the project's DS components and tokens. ?bare=1 renders the screen alone at its Figma size (fidelity captures).
import React from 'react';
import { SCREENS, FLOWS, MODES, DEVICE, PROJECT } from '../generated/routes';
import { useRoute, href, go } from './nav';
import { CodePanel } from './CodePanel';
import { useScreenLanguage } from './i18n';
import { CommentsPanel, type Pending } from './CommentsPanel';
import { listComments, addComment, type Comment } from './comments';

// Toolbar (shell chrome, the same dark bar in Light and Dark): segmented Light/Dark and EN/AR, Inspect and Code toggles.
const ICONS: Record<string, React.ReactNode> = {
  Light: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  Dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  Inspect: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  Code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  Comment: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
};
function Icon({ name }: { name: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}
const CONTROL = 'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400';
const IDLE = 'bg-transparent text-neutral-400 hover:bg-white/10 hover:text-neutral-100';

function Segmented({ value, options, onChange, label, icons, compact }: {
  value: string; options: string[]; onChange: (v: string) => void; label: string; icons?: boolean; compact?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-0.5">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} title={`${label}: ${o}`} onClick={() => onChange(o)}
          className={`${CONTROL} ${value === o ? 'bg-neutral-100 text-neutral-900' : IDLE}`}>
          {icons && ICONS[o] ? <Icon name={o} /> : null}
          <span className={icons && compact ? 'sr-only' : ''}>{o}</span>
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, icon, pressed, onClick, hint, compact }: {
  label: string; icon: string; pressed: boolean; onClick: () => void; hint: string; compact?: boolean;
}) {
  return (
    <button type="button" aria-pressed={pressed} title={hint} onClick={onClick}
      className={`${CONTROL} ${pressed ? 'bg-indigo-400/15 text-indigo-200 ring-1 ring-inset ring-indigo-400' : IDLE}`}>
      <Icon name={icon} />
      <span className={compact ? 'sr-only' : ''}>{label}</span>
    </button>
  );
}

const Divider = () => <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-[#333]" />;

type Pin = { id: string; n: number; x: number; y: number; resolved: boolean; pending?: boolean };

function ScreenView({ slug, mode, lang, bare, height, pins, selected, onPin }: {
  slug: string; mode: string; lang: string; bare: boolean; height?: number; pins?: Pin[]; selected?: string | null; onPin?: (id: string) => void;
}) {
  const def = SCREENS.find((s) => s.slug === slug) || SCREENS[0];
  const Comp = def.Component;
  const ref = React.useRef<HTMLDivElement>(null);
  useScreenLanguage(ref, lang, def.slug);
  return (
    <div ref={ref} className="fp-screen" data-semantic={mode} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} data-screen={def.slug}
      style={{ width: def.w, height: bare ? def.h : Math.min(def.h, height ?? DEVICE.viewport), overflowY: bare ? 'hidden' : 'auto' }}>
      <Comp />
      {pins && pins.length > 0 && (
        <div className="fp-pins" aria-label="Comment pins" style={{ position: 'absolute', left: 0, top: 0, width: def.w, height: def.h, pointerEvents: 'none' }}>
          {pins.map((p) => (
            <button key={p.id} type="button" data-pin={p.id} title={p.pending ? 'New comment' : `Comment ${p.n}`} onClick={() => onPin?.(p.id)}
              style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -100%)', pointerEvents: 'auto' }}
              className={`flex h-6 min-w-6 items-center justify-center rounded-full rounded-bl-none border-2 border-white px-1 text-[11px] font-semibold text-white shadow-md ${p.pending ? 'bg-indigo-400 animate-pulse' : p.resolved ? 'bg-neutral-500' : 'bg-indigo-500'} ${selected === p.id ? 'ring-2 ring-indigo-300' : ''}`}>
              {p.pending ? '+' : p.n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Comment mode: a tap on the screen (not on a pin) gives the pin position in Figma pixels and the element it is on. */
function useCommentTap(on: boolean, width: number, onTap: (p: Pending) => void) {
  React.useEffect(() => {
    if (!on) return;
    const tap = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const screen = target.closest('.fp-screen') as HTMLElement | null;
      if (!screen || target.closest('[data-pin]')) return;
      e.preventDefault();
      e.stopPropagation();
      const r = screen.getBoundingClientRect();
      const scale = r.width / width || 1;
      const el = target.closest('[data-component], [data-figma-node]') as HTMLElement | null;
      onTap({
        x: Math.round((e.clientX - r.left) / scale + screen.scrollLeft),
        y: Math.round((e.clientY - r.top) / scale + screen.scrollTop),
        figma_node: el?.dataset.figmaNode || null,
        component: el?.dataset.component || el?.dataset.figmaName || null,
      });
    };
    document.addEventListener('click', tap, true);
    return () => document.removeEventListener('click', tap, true);
  }, [on, width, onTap]);
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
  const [commenting, setCommenting] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [pending, setPending] = React.useState<Pending | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [commentError, setCommentError] = React.useState<string | null>(null);
  React.useEffect(() => { setPicked([]); setPending(null); setSelected(null); }, [r.slug]);
  const curSlug = r.slug || SCREENS[0]?.slug || '';
  const curDef = SCREENS.find((s) => s.slug === curSlug) || SCREENS[0];
  // Comments of this screen: loaded when the panel opens or the screen changes, refreshed every 20 s while open.
  React.useEffect(() => {
    if (!commenting || !curSlug) return;
    let live = true;
    // A refresh that started before a post finished must not drop the new comment: keep this browser's recent posts.
    const load = () => listComments(curSlug).then((c) => {
      if (!live) return;
      const ids = new Set(c.map((x) => x.id));
      setComments((prev) => [...c, ...prev.filter((x) => !ids.has(x.id) && Date.now() - Date.parse(x.created_at) < 120000)]);
      setCommentError(null);
    })
      .catch((e) => { if (live) setCommentError(String(e.message || e)); });
    load();
    const t = window.setInterval(load, 20000);
    return () => { live = false; window.clearInterval(t); };
  }, [commenting, curSlug]);
  const onTap = React.useCallback((p: Pending) => { setPending(p); setSelected(null); }, []);
  useCommentTap(commenting && !inspect, curDef?.w || 375, onTap);
  // Code and Comments share the side of the screen: opening one closes the other.
  const toggleCode = () => { setCode(!code); if (!code) setCommenting(false); };
  const toggleComments = () => { setCommenting(!commenting); setPending(null); if (!commenting) { setCode(false); setInspect(false); } };
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
  // Desktop: the phone frame shrinks when the side list and the Code panel leave less room (no sideways scroll).
  const room = win.w - 256 - (code ? 440 : commenting ? 360 : 0) - 32;
  const zoom = narrow ? Math.min(1, win.w / def.w) : Math.min(1, room / (def.w + 24));
  const screenH = narrow ? Math.floor((win.h - toolbarH) / zoom) : DEVICE.viewport;
  const screen = (
    <>
      <ScreenView slug={slug} mode={r.mode} lang={r.lang} bare={false} height={screenH} selected={selected}
        pins={commenting ? [
          ...comments.filter((c) => c.status !== 'resolved' || c.id === selected).map((c) => ({ id: c.id, n: comments.indexOf(c) + 1, x: (c.lang === 'ar') !== (r.lang === 'ar') ? def.w - c.x : c.x, y: c.y, resolved: c.status === 'resolved' })), // RTL mirrors the layout, so the pin mirrors too
          ...(pending ? [{ id: 'pending', n: 0, x: pending.x, y: pending.y, resolved: false, pending: true }] : []),
        ] : undefined}
        onPin={(id) => { if (id !== 'pending') setSelected(id); }} />
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
      <main className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden">
        <div className="box-border flex w-full flex-wrap items-center justify-center gap-2 p-3">
          <label className="w-full md:hidden">
            <span className="sr-only">Screen</span>
            <select value={slug} onChange={(e) => go(e.target.value)}
              className="w-full rounded-lg bg-black/5 px-3 py-1.5 text-sm dark:bg-white/10 [&>option]:bg-white [&>option]:text-black">
              {SCREENS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </label>
          <div role="toolbar" aria-label="Prototype controls" data-toolbar=""
            className="flex items-center rounded-xl border border-[#333] bg-[#1E1E1E] p-1 text-neutral-200 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            <Segmented label="Color mode" value={r.mode} options={MODES} icons compact={narrow} onChange={(m) => { window.location.hash = href({ mode: m }); }} />
            <Divider />
            <Segmented label="Language" value={r.lang === 'ar' ? 'AR' : 'EN'} options={['EN', 'AR']} onChange={(l) => { window.location.hash = href({ lang: l.toLowerCase() }); }} />
            <Divider />
            <div className="flex items-center gap-0.5">
              <Toggle label="Inspect" icon="Inspect" pressed={inspect} onClick={() => setInspect(!inspect)} compact={narrow}
                hint="Inspect: hover or tap an element to see its DS component and Figma node" />
              <Toggle label="Code" icon="Code" pressed={code} onClick={toggleCode} compact={narrow}
                hint="Code: reference code of this screen per platform" />
              <Toggle label="Comment" icon="Comment" pressed={commenting} onClick={toggleComments} compact={narrow}
                hint="Comment: tap an element to leave a comment for the design team" />
            </div>
          </div>
        </div>
        {inspect && narrow && <Inspector onPick={setPicked} />}
        {narrow ? (
          <div data-inspect={inspect ? 'on' : 'off'} className="relative" style={{ zoom }} aria-label="Screen">{screen}</div>
        ) : (
          <div data-inspect={inspect ? 'on' : 'off'} className="relative my-2 shrink-0 rounded-[44px] bg-neutral-900 p-3 shadow-2xl ring-1 ring-black/40" style={{ zoom }} aria-label="Android phone">
            <div className="relative overflow-hidden rounded-[32px]">
              {screen}
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />
            </div>
          </div>
        )}
        {inspect && !narrow && <Inspector onPick={setPicked} />}
        {(code || commenting) && narrow && <div aria-hidden="true" className="h-[60vh] shrink-0" />}
      </main>
      {code && <CodePanel slug={slug} picked={picked} narrow={narrow} onClose={() => setCode(false)} />}
      {commenting && (
        <CommentsPanel comments={comments} pending={pending} narrow={narrow} selected={selected} error={commentError}
          onCancel={() => setPending(null)} onSelect={setSelected} onClose={toggleComments}
          onSubmit={async (body, author) => {
            if (!pending) return;
            try {
              const made = await addComment({
                screen: slug, figma_node: pending.figma_node, component: pending.component, theme: r.mode, lang: r.lang,
                viewport: `${narrow ? 'phone' : 'desktop'} ${win.w}x${win.h}`, x: pending.x, y: pending.y, author: author || null, body,
              });
              setComments((c) => [...c, made]);
              setPending(null);
              setSelected(made.id);
              setCommentError(null);
            } catch (e) { setCommentError(String((e as Error).message || e)); throw e; }
          }} />
      )}
    </div>
  );
}
