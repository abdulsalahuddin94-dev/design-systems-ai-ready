// Shared documentation blocks for every design system Storybook (Welcome, Foundations, component docs).
// Copied into <storybook>/src/docs/ by tools/storybook_docs.py. Do not edit the copy; change the template in
// Storybook_Design_System_Skill/templates/docs/ and rerun the tool.
//
// Everything is read live: token values and modes from src/tokens/tokens.ts (generated from the Figma variables),
// text sizes from the real CSS of each text style (getComputedStyle), components from their stories.
// The docs chrome takes its colors from the design system's own semantic tokens (found by name), with neutral
// fallbacks, so the same file works for any brand and platform.
import React from 'react';
import { Canvas, Controls, ArgTypes } from '@storybook/addon-docs/blocks';
import { tokens } from '../tokens/tokens';
import { Icon, iconNames } from '../lib/Icon';
import './docs.css';

type AnyTok = { figma: string; collection: string; name: string; type: string; css: string; values: Record<string, unknown>; resolved?: Record<string, string>; description?: string };
const ALL = (tokens as unknown as { tokens: AnyTok[] }).tokens;
const COLLECTIONS = (tokens as unknown as { collections: Record<string, { modes: string[]; default: string; attribute: string; role?: string }> }).collections;
const roleOf = (c: string) => (COLLECTIONS[c]?.role || c).toLowerCase();

/* ---------- platform names: what developers type (SwiftUI on iOS, Compose on Android, CSS on Web) ---------- */
type CodeName = { label: string; name: string };
const TOK = tokens as unknown as { platform?: string; platform_label?: string; platform_file?: string };
export const PLATFORM = TOK.platform || 'web';
export const PLATFORM_LABEL = TOK.platform_label || 'CSS variable';
const codesOf = (t: AnyTok): CodeName[] => ((t as unknown as { code?: CodeName[] }).code || [{ label: 'CSS variable', name: t.css }]);
const codeOf = (t: AnyTok) => codesOf(t)[0].name;
function CodeCell({ t }: { t: AnyTok }) {
  const [first, ...rest] = codesOf(t);
  return (
    <div className="dsd-codecell">
      <code className="dsd-code">{first.name}</code>
      {rest.map((c) => <div key={c.label} className="dsd-small dsd-muted">{c.label}: <code>{c.name}</code></div>)}
      {PLATFORM !== 'web' ? <div className="dsd-small dsd-muted">CSS (this Storybook): <code>{t.css}</code></div> : null}
    </div>
  );
}

/* ---------- theme: map docs chrome to the DS's own semantic tokens ---------- */
function pick(patterns: RegExp[], role = 'semantic'): string | undefined {
  for (const p of patterns) {
    const t = ALL.find((x) => x.type === 'color' && roleOf(x.collection).includes(role) && p.test(x.name));
    if (t) return `var(${t.css})`;
  }
  for (const p of patterns) {
    const t = ALL.find((x) => x.type === 'color' && p.test(x.name));
    if (t) return `var(${t.css})`;
  }
  return undefined;
}
const THEME: Record<string, string | undefined> = {
  '--dsd-text': pick([/(^|\/)text\/primary$/i, /label\/primary$/i, /(^|\/)on-surface$/i, /(^|\/)text$/i]),
  '--dsd-muted': pick([/(^|\/)text\/(secondary|muted)$/i, /label\/secondary$/i, /on-surface-variant$/i]),
  '--dsd-bg': pick([/(^|\/)bg\/primary$/i, /background\/primary$/i, /system-?background$/i, /(^|\/)surface$/i, /(^|\/)background$/i]),
  '--dsd-surface': pick([/(^|\/)bg\/secondary$/i, /background\/secondary$/i, /secondary-?system-?background$/i, /surface-container$/i, /(^|\/)bg\/subtle$/i]),
  '--dsd-border': pick([/(^|\/)border\/default$/i, /separator/i, /outline-variant$/i, /(^|\/)border\/muted$/i]),
  '--dsd-brand': pick([/(^|\/)bg\/brand$/i, /action\/primary\/bg$/i, /btn\/primary\/bg/i, /(^|\/)accent/i, /(^|\/)primary$/i, /brand\/(600|500)$/i]),
  '--dsd-success': pick([/(^|\/)text\/success$/i, /(^|\/)icon\/success$/i, /success/i]),
  '--dsd-error': pick([/(^|\/)text\/error$/i, /(^|\/)icon\/error$/i, /(^|\/)error$/i, /danger/i]),
};
const themeStyle = Object.fromEntries(Object.entries(THEME).filter(([, v]) => v)) as React.CSSProperties;

// Docs pages fill the preview: the page takes the DS background (no grey frame around a narrow column) and the
// content column grows to 1280px, so wide tables, state grids and type samples have room.
if (typeof document !== 'undefined' && !document.getElementById('dsd-page')) {
  const el = document.createElement('style');
  el.id = 'dsd-page';
  const bg = THEME['--dsd-bg'] || 'inherit';
  el.textContent = `
    .sbdocs-wrapper:has(.dsd) { background: ${bg}; padding: 40px 48px 64px; }
    .sbdocs-wrapper:has(.dsd) .sbdocs-content { max-width: 1280px; width: 100%; }
    .dsd .docs-story { background: ${bg}; }
    @media (max-width: 720px) { .sbdocs-wrapper:has(.dsd) { padding: 24px 16px 48px; } }
  `;
  document.head.appendChild(el);
}

export function DocsRoot({ children }: { children: React.ReactNode }) {
  // sb-unstyled opts out of the Storybook docs typography, so text styles render at their real size
  return <div className="dsd sb-unstyled" style={themeStyle}>{children}</div>;
}

const Code = ({ children }: { children: React.ReactNode }) => <code className="dsd-code">{children}</code>;
const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => <h2 id={id} className="dsd-h2">{children}</h2>;
const Lead = ({ children }: { children: React.ReactNode }) => <p className="dsd-lead">{children}</p>;
const docsHref = (id: string) => `?path=/docs/${id}`;
const goTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  try { (window.top as Window).location.search = docsHref(id); } catch { window.location.search = docsHref(id); }
};

/* ---------- Welcome ---------- */
export type WelcomeData = {
  name: string; summary: string; product?: string; audience?: string; version?: string; updated?: string;
  pills: string[]; figma_url?: string;
  stats: { label: string; value: number | string; detail?: string }[];
  start: { title: string; text: string; id: string }[];
  groups: { name: string; count: number; id?: string; components: string[] }[];
  principles?: string[];
};
export function Welcome({ data, samples = [] }: { data: WelcomeData; samples?: { name: string; id: string; node: React.ReactNode }[] }) {
  return (
    <DocsRoot>
      <header className="dsd-hero">
        <div className="dsd-eyebrow">Design system</div>
        <h1 className="dsd-h1">{data.name}</h1>
        <p className="dsd-summary">{data.summary}</p>
        <div className="dsd-pills">
          {data.version && <span className="dsd-pill">v{data.version}</span>}
          {data.updated && <span className="dsd-pill">Updated {data.updated}</span>}
          {data.pills.map((p) => <span key={p} className="dsd-pill">{p}</span>)}
          {data.figma_url && <a className="dsd-pill dsd-pill-link" href={data.figma_url} target="_blank" rel="noreferrer">Open in Figma ↗</a>}
        </div>
      </header>

      <section className="dsd-stats">
        {data.stats.map((s) => (
          <div key={s.label} className="dsd-stat">
            <div className="dsd-stat-value">{s.value}</div>
            <div className="dsd-stat-label">{s.label}</div>
            {s.detail && <div className="dsd-stat-detail">{s.detail}</div>}
          </div>
        ))}
      </section>

      {(data.product || data.audience) && (
        <section>
          <H2 id="product">About the product</H2>
          {data.product && <Lead>{data.product}</Lead>}
          {data.audience && <p className="dsd-p"><strong>Who uses it:</strong> {data.audience}</p>}
        </section>
      )}

      <section>
        <H2 id="start-here">Start here</H2>
        <div className="dsd-cards">
          {data.start.map((c) => (
            <a key={c.title} className="dsd-card dsd-card-link" href={docsHref(c.id)} onClick={goTo(c.id)}>
              <div className="dsd-card-title">{c.title} →</div>
              <div className="dsd-card-text">{c.text}</div>
            </a>
          ))}
        </div>
      </section>

      {samples.length > 0 && (
        <section>
          <H2 id="live-samples">Live samples</H2>
          <p className="dsd-p">Real components from this Storybook, rendered with the Figma defaults.</p>
          <div className="dsd-samples">
            {samples.map((s) => (
              <a key={s.name} className="dsd-sample" href={docsHref(s.id)} onClick={goTo(s.id)}>
                <div className="dsd-sample-stage">{s.node}</div>
                <div className="dsd-sample-name">{s.name}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <H2 id="contents">What is inside</H2>
        <div className="dsd-cards">
          {data.groups.map((g) => (
            <div key={g.name} className="dsd-card">
              <div className="dsd-card-title">{g.name} <span className="dsd-muted">· {g.count}</span></div>
              <div className="dsd-card-text">{g.components.join(', ')}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2 id="how-to-read">How to read this Storybook</H2>
        <ul className="dsd-list">
          {(data.principles || []).map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>
    </DocsRoot>
  );
}

/* ---------- Foundations: colors ---------- */
const valueOf = (t: AnyTok, mode: string) => {
  const v = t.values[mode];
  const r = t.resolved?.[mode];
  if (v && typeof v === 'object' && 'alias' in (v as object)) return { alias: String((v as { alias: string }).alias).split('::').pop(), hex: r };
  return { hex: r ?? String(v) };
};
const modeAttrs = (collection: string, mode: string) => ({ [COLLECTIONS[collection]?.attribute || `data-${collection.toLowerCase()}`]: mode });

export function ColorPrimitives() {
  const prims = ALL.filter((t) => t.type === 'color' && roleOf(t.collection).includes('primitive'));
  const ramps = new Map<string, AnyTok[]>();
  prims.forEach((t) => {
    const k = t.name.includes('/') ? t.name.split('/').slice(0, -1).join('/') : 'Single colors';
    ramps.set(k, [...(ramps.get(k) ?? []), t]);
  });
  return (
    <DocsRoot>
      <div className="dsd-ramps">
        {[...ramps].map(([ramp, list]) => (
          <div key={ramp} className="dsd-ramp">
            <div className="dsd-ramp-name">{ramp}</div>
            <div className="dsd-ramp-row">
              {list.map((t) => {
                const mode = Object.keys(t.values)[0];
                return (
                  <div key={t.css} className="dsd-chip" title={`${t.figma}\n${t.css}`}>
                    <div className="dsd-chip-color" style={{ background: `var(${t.css})` }} />
                    <div className="dsd-chip-name">{t.name.split('/').pop()}</div>
                    <div className="dsd-chip-value">{valueOf(t, mode).hex}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DocsRoot>
  );
}

export function ColorSemantics() {
  const sem = ALL.filter((t) => t.type === 'color' && roleOf(t.collection).includes('semantic'));
  const collections = [...new Set(sem.map((t) => t.collection))];
  return (
    <DocsRoot>
      {collections.map((c) => {
        const modes = COLLECTIONS[c]?.modes || [];
        const groups = new Map<string, AnyTok[]>();
        sem.filter((t) => t.collection === c).forEach((t) => {
          const parts = t.name.split('/');
          const k = parts.length > 2 ? parts.slice(0, 2).join('/') : parts[0];
          groups.set(k, [...(groups.get(k) ?? []), t]);
        });
        return (
          <div key={c}>
            {collections.length > 1 && <h3 className="dsd-h3">{c}</h3>}
            {[...groups].map(([g, list]) => (
              <div key={g} className="dsd-block">
                <div className="dsd-ramp-name">{g}</div>
                <table className="dsd-table">
                  <thead><tr><th>Figma variable</th>{modes.map((m) => <th key={m}>{m}</th>)}<th>{PLATFORM_LABEL}</th><th>Use</th></tr></thead>
                  <tbody>
                    {list.map((t) => (
                      <tr key={t.css}>
                        <td><Code>{t.name}</Code></td>
                        {modes.map((m) => {
                          const v = valueOf(t, m);
                          return (
                            <td key={m}>
                              <div className="dsd-sem" {...modeAttrs(c, m)}>
                                <span className="dsd-sem-swatch" style={{ background: `var(${t.css})` }} />
                                <span className="dsd-sem-meta">{v.alias ? <>{v.alias}<br /></> : null}<span className="dsd-muted">{v.hex}</span></span>
                              </div>
                            </td>
                          );
                        })}
                        <td><CodeCell t={t} /></td>
                        <td className="dsd-muted dsd-small">{t.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        );
      })}
    </DocsRoot>
  );
}

/* ---------- Foundations: colors as roles (visual) ---------- */
const STATE_RE = /(^|[-/ ])(hover|active|pressed|focus|focused|disabled|visited)$/i;
const ROLES: [string, RegExp][] = [
  ['Brand', /brand|(action|btn|button)\/primary/i],
  ['Accent', /accent|(action|btn|button)\/secondary/i],
  ['Success', /success|positive/i],
  ['Error', /error|danger|critical|negative|destructive/i],
  ['Warning', /warning|caution/i],
  ['Info', /(^|\/)info/i],
];
type Kind = 'fill' | 'text' | 'border' | 'icon';
const kindOf = (name: string): Kind =>
  /(^|\/)(text|label|on-[a-z]+|foreground)(\/|$|-)|\/text$/i.test(name) ? 'text'
  : /border|outline|separator|stroke|divider|ring/i.test(name) ? 'border'
  : /(^|\/)icon/i.test(name) ? 'icon' : 'fill';
const KIND_ORDER: Kind[] = ['fill', 'text', 'border', 'icon'];
const semanticTokens = () => ALL.filter((t) => t.type === 'color' && roleOf(t.collection).includes('semantic'));
const firstCollection = () => semanticTokens()[0]?.collection;
const isSubtle = (n: string) => /subtle|light|soft|muted|tint|container|weak|bg\/(success|error|warning|info|danger)$/i.test(n);

function hexOf(t: AnyTok, mode: string) {
  return valueOf(t, mode).hex;
}
// Text and icon colors meant for a filled surface (on-brand, inverse, a button's text) are shown on that surface.
const onSurface = (name: string) => /(^|\/)on-|inverse|(action|btn|button)\/[^/]+\/(text|icon)/i.test(name);
function Swatch({ t, mode, onToken, label, surface }: { t: AnyTok; mode: string; onToken?: AnyTok; label?: string; surface?: AnyTok }) {
  const kind = kindOf(t.name);
  const bgStyle = surface ? { background: `var(${surface.css})` } : {};
  const v = valueOf(t, mode);
  let face: React.ReactNode;
  if (kind === 'text') face = <div className="dsd-sw-face dsd-sw-text" style={{ ...bgStyle, color: `var(${t.css})` }}>Aa <span>{label || 'Text'}</span></div>;
  else if (kind === 'border') face = <div className="dsd-sw-face dsd-sw-border"><span style={{ borderColor: `var(${t.css})` }} /></div>;
  else if (kind === 'icon') face = <div className="dsd-sw-face dsd-sw-icon" style={{ ...bgStyle, color: `var(${t.css})` }}><Icon name={iconNames.find((n) => /check|info|star|heart/i.test(n)) || iconNames[0]} size={28} /></div>;
  else face = (
    <div className="dsd-sw-face" style={{ background: `var(${t.css})`, color: onToken ? `var(${onToken.css})` : undefined }}>
      {onToken ? <span className="dsd-sw-on">{label}</span> : null}
    </div>
  );
  return (
    <div className="dsd-sw" title={`${t.figma}\n${codesOf(t).map((c) => `${c.label}: ${c.name}`).join('\n')}${t.description ? '\n' + t.description : ''}`}>
      {face}
      <div className="dsd-sw-meta">
        <code>{t.name}</code>
        <span>{v.hex}</span>
      </div>
      <div className="dsd-sw-code">{codeOf(t)}</div>
      {onToken ? <div className="dsd-sw-sub">text: {onToken.name}</div> : surface ? <div className="dsd-sw-sub">on {surface.name}</div> : v.alias ? <div className="dsd-sw-sub">→ {v.alias}</div> : null}
    </div>
  );
}

function useMode() {
  const c = firstCollection();
  const modes = (c && COLLECTIONS[c]?.modes) || [];
  const [mode, setMode] = React.useState(modes[0] || '');
  const tabs = modes.length > 1 ? (
    <div className="dsd-tabs">{modes.map((m) => <button key={m} type="button" className={m === mode ? 'is-on' : ''} onClick={() => setMode(m)}>{m}</button>)}</div>
  ) : null;
  const wrap = (children: React.ReactNode) => (c ? <div {...modeAttrs(c, mode)} style={themeStyle} className="dsd-mode-surface">{children}</div> : <>{children}</>);
  return { mode, tabs, wrap };
}

function onTokenFor(fill: AnyTok, pool: AnyTok[]) {
  const base = fill.name.replace(/\/(bg|background|fill|solid|default)$/i, '');
  return pool.find((t) => kindOf(t.name) === 'text' && !STATE_RE.test(t.name) && (t.name === `${base}/text` || t.name === `${base}/on` || new RegExp(`on-${fill.name.split('/').filter((s) => !/^(color|bg|background)$/i.test(s))[0] || 'x'}$`, 'i').test(t.name)));
}

export function ColorRoles() {
  const { mode, tabs, wrap } = useMode();
  const sem = semanticTokens();
  const used = new Set<string>();
  const rows = ROLES.map(([role, re]) => {
    const list = sem.filter((t) => re.test(t.name) && !STATE_RE.test(t.name) && !/(^|\/)text\/(primary|secondary)$/i.test(t.name));
    list.forEach((t) => used.add(t.css));
    const fills = list.filter((t) => kindOf(t.name) === 'fill').sort((a, b) => Number(isSubtle(b.name)) - Number(isSubtle(a.name)));
    const others = list.filter((t) => kindOf(t.name) !== 'fill').sort((a, b) => KIND_ORDER.indexOf(kindOf(a.name)) - KIND_ORDER.indexOf(kindOf(b.name)));
    return { role, fills, others };
  }).filter((r) => r.fills.length || r.others.length);
  const anchors = rows.filter((r) => /Brand|Accent/.test(r.role)).map((r) => r.fills.find((t) => !isSubtle(t.name)) || r.fills[0]).filter(Boolean) as AnyTok[];
  const neutral = sem.filter((t) => !used.has(t.css) && !STATE_RE.test(t.name));
  const neutralGroups = KIND_ORDER.map((k) => ({ k, list: neutral.filter((t) => kindOf(t.name) === k) })).filter((g) => g.list.length);
  const KIND_TITLE: Record<Kind, string> = { fill: 'Surfaces and backgrounds', text: 'Text', border: 'Borders', icon: 'Icons' };
  return (
    <DocsRoot>
      {tabs}
      {wrap(
        <>
          {anchors.length ? (
            <section className="dsd-first">
              <h3 className="dsd-h3">Brand anchors</h3>
              <p className="dsd-p dsd-muted">The colors that carry the brand. Every primary action uses them.</p>
              <div className="dsd-anchors">
                {anchors.map((t) => (
                  <div key={t.css} className="dsd-anchor">
                    <div className="dsd-anchor-face" style={{ background: `var(${t.css})` }} />
                    <div className="dsd-sw-meta"><code>{t.name}</code><span>{hexOf(t, mode)}</span></div>
                    <div className="dsd-sw-code dsd-anchor-code">{codeOf(t)}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {rows.length ? (
            <section>
              <h3 className="dsd-h3">Semantic roles</h3>
              <p className="dsd-p dsd-muted">One row per role: fills (subtle first, then solid with its text on top), then text, border and icon colors. Hover and pressed variants are in the full list below.</p>
              <div className="dsd-roles">
                {rows.map((r) => (
                  <div key={r.role} className="dsd-role">
                    <div className="dsd-role-name">{r.role}</div>
                    <div className="dsd-role-cells">
                      {r.fills.map((t) => {
                        const on = isSubtle(t.name) ? undefined : onTokenFor(t, sem);
                        return <Swatch key={t.css} t={t} mode={mode} onToken={on} label={r.role} />;
                      })}
                      {r.others.map((t) => {
                        const solid = r.fills.find((f) => !isSubtle(f.name) && f.name.split('/').slice(0, -1).join('/') === t.name.split('/').slice(0, -1).join('/')) || r.fills.find((f) => !isSubtle(f.name));
                        return <Swatch key={t.css} t={t} mode={mode} label={r.role} surface={onSurface(t.name) ? solid : undefined} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {neutralGroups.map((g) => (
            <section key={g.k}>
              <h3 className="dsd-h3">{KIND_TITLE[g.k]}</h3>
              <div className="dsd-role-cells dsd-role-cells-wide">
                {g.list.map((t) => <Swatch key={t.css} t={t} mode={mode} surface={onSurface(t.name) ? neutral.find((x) => kindOf(x.name) === 'fill' && /inverse/i.test(x.name)) : undefined} />)}
              </div>
            </section>
          ))}
        </>,
      )}
    </DocsRoot>
  );
}

export function ColorTable() {
  return (
    <details className="dsd dsd-details sb-unstyled" style={themeStyle}>
      <summary>Full list of Semantic variables (name, value per mode, {PLATFORM_LABEL} name, use)</summary>
      <ColorSemantics />
    </details>
  );
}

export function ColorRamps() {
  const prims = ALL.filter((t) => t.type === 'color' && roleOf(t.collection).includes('primitive'));
  const ramps = new Map<string, AnyTok[]>();
  prims.forEach((t) => {
    const k = t.name.includes('/') ? t.name.split('/').slice(0, -1).join('/') : 'Single colors';
    ramps.set(k, [...(ramps.get(k) ?? []), t]);
  });
  return (
    <DocsRoot>
      <div className="dsd-strips">
        {[...ramps].map(([ramp, list]) => (
          <div key={ramp} className="dsd-strip-row">
            <div className="dsd-strip-name">{ramp}</div>
            <div className="dsd-strip">
              {list.map((t) => {
                const mode = Object.keys(t.values)[0];
                return (
                  <div key={t.css} className="dsd-strip-cell" title={`${t.figma}\n${t.css}`}>
                    <div className="dsd-strip-color" style={{ background: `var(${t.css})` }} />
                    <div className="dsd-strip-step">{t.name.split('/').pop()}</div>
                    <div className="dsd-strip-hex">{String(valueOf(t, mode).hex).replace('#', '')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DocsRoot>
  );
}

/* ---------- Foundations: typography at real size ---------- */
export const textClass = (style: string) => 'ts-' + style.toLowerCase().replace(/[/\s]+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

function Measured({ cls, sample, compact, code }: { cls: string; sample: string; compact?: boolean; code?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [m, setM] = React.useState<{ size: string; line: string; weight: string; family: string; tracking: string } | null>(null);
  React.useLayoutEffect(() => {
    const read = () => {
      if (!ref.current) return;
      const s = getComputedStyle(ref.current);
      const px = (v: string) => (v.endsWith('px') ? `${+parseFloat(v).toFixed(2)}px` : v);
      setM({ size: px(s.fontSize), line: px(s.lineHeight), weight: s.fontWeight, family: s.fontFamily.split(',')[0].replace(/["']/g, ''), tracking: s.letterSpacing === 'normal' ? '0' : px(s.letterSpacing) });
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);
  return (
    <>
      <div ref={ref} className={`dsd-type-sample ${cls}`}>{sample}</div>
      <div className="dsd-type-meta">
        {m && compact ? <><span className="dsd-muted">{code || '.' + cls}</span>&nbsp;&nbsp;<strong>{m.size}</strong></> : null}
        {m && !compact ? <><strong>{m.size}</strong> / {m.line}<br /><span className="dsd-muted">weight {m.weight} · tracking {m.tracking}</span></> : null}
      </div>
    </>
  );
}

export type TypeData = {
  font?: string; styles: string[]; groups?: { name: string; styles: string[] }[]; sample?: string; rules?: string[];
  scales?: { name: string; note?: string; styles: string[] }[];
  codes?: Record<string, CodeName[]>;
};
export function TypeSpecimen({ data }: { data: TypeData }) {
  const groups = data.groups?.length ? data.groups : [{ name: 'Text styles', styles: data.styles }];
  const sample = data.sample || 'The quick brown fox jumps over the lazy dog';
  return (
    <DocsRoot>
      <div className="dsd-card dsd-type-intro">
        <div className="dsd-eyebrow">Type system</div>
        <div className="dsd-type-font">{data.font || 'Font family from the Typography variables'}</div>
        <ul className="dsd-list">
          {(data.rules || []).map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>
      {(data.scales || []).map((sc) => (
        <div key={sc.name} className="dsd-scale">
          <h3 className="dsd-h3">{sc.name}</h3>
          {sc.note && <p className="dsd-p dsd-muted">{sc.note}</p>}
          <div className="dsd-type-group">
            {sc.styles.map((s) => (
              <div key={s} className="dsd-type-row dsd-type-row-compact">
                <Measured cls={textClass(s)} sample={data.sample || 'The quick brown fox jumps over the lazy dog'} compact code={PLATFORM !== 'web' ? data.codes?.[s]?.[0]?.name : undefined} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.scales?.length ? <h3 className="dsd-h3">All text styles</h3> : null}
      {groups.map((g) => (
        <div key={g.name} className="dsd-type-group">
          <div className="dsd-type-group-name">{g.name}</div>
          {g.styles.map((s) => (
            <div key={s} className="dsd-type-row">
              <div className="dsd-type-name">
                <Code>{s}</Code>
                {(data.codes?.[s] || [{ label: 'CSS class', name: '.' + textClass(s) }]).map((c) => <div key={c.label} className="dsd-muted dsd-small">{c.name}</div>)}
              </div>
              <Measured cls={textClass(s)} sample={sample} />
            </div>
          ))}
        </div>
      ))}
    </DocsRoot>
  );
}

/* ---------- Foundations: sizing (spacing, radius, other dimensions) ---------- */
export function Sizing() {
  const dims = ALL.filter((t) => (t.type === 'number' || t.type === 'dimension') && !/typography|font|opacity/i.test(t.collection + ' ' + roleOf(t.collection)) && !/font|line-height|letter|opacity|weight/i.test(t.name));
  const collections = [...new Set(dims.map((t) => t.collection))];
  return (
    <DocsRoot>
      {collections.map((c) => {
        const modes = COLLECTIONS[c]?.modes || [];
        const isRadius = /radius|corner|shape/i.test(c + roleOf(c));
        return (
          <div key={c} className="dsd-block">
            <h3 className="dsd-h3">{c}</h3>
            <table className="dsd-table">
              <thead><tr><th>Figma variable</th><th>Preview</th>{modes.map((m) => <th key={m}>{m}</th>)}<th>{PLATFORM_LABEL}</th></tr></thead>
              <tbody>
                {dims.filter((t) => t.collection === c).map((t) => (
                  <tr key={t.css}>
                    <td><Code>{t.name}</Code></td>
                    <td>
                      {isRadius
                        ? <div className="dsd-radius" style={{ borderRadius: `var(${t.css})` }} />
                        : <div className="dsd-bar" style={{ width: `min(var(${t.css}), 320px)` }} />}
                    </td>
                    {modes.map((m) => <td key={m}>{String(t.values[m] ?? '')}{typeof t.values[m] === 'number' ? 'px' : ''}</td>)}
                    <td><CodeCell t={t} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </DocsRoot>
  );
}

/* ---------- Foundations: effects (effect styles + opacity) ---------- */
const cssName = (s: string) => '--' + s.toLowerCase().replace(/[/\s]+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
export function Effects({ styles = [] }: { styles?: string[] }) {
  const opacity = ALL.filter((t) => /opacity/i.test(t.collection + ' ' + roleOf(t.collection) + ' ' + t.name) && t.type !== 'color');
  return (
    <DocsRoot>
      {styles.length > 0 && (
        <>
          <h3 className="dsd-h3">Effect styles</h3>
          <div className="dsd-effects">
            {styles.map((s) => (
              <div key={s} className="dsd-effect">
                <div className="dsd-effect-box" style={{ boxShadow: `var(${cssName(s)})` }} />
                <Code>{s}</Code>
                {PLATFORM === 'web' ? <div className="dsd-muted dsd-small">var({cssName(s)})</div> : null}
              </div>
            ))}
          </div>
        </>
      )}
      {opacity.length > 0 && (
        <>
          <h3 className="dsd-h3">Opacity</h3>
          <div className="dsd-effects">
            {opacity.map((t) => (
              <div key={t.css} className="dsd-effect">
                <div className="dsd-effect-box dsd-opacity" style={{ opacity: `var(${t.css})` as unknown as number }} />
                <Code>{t.name}</Code>
                <div className="dsd-muted dsd-small">{String(Object.values(t.values)[0])}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </DocsRoot>
  );
}

/* ---------- Foundations: icons ---------- */
export function IconGallery({ note }: { note?: string }) {
  const [q, setQ] = React.useState('');
  const list = iconNames.filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  return (
    <DocsRoot>
      {note && <p className="dsd-p">{note}</p>}
      <input className="dsd-search" placeholder={`Search ${iconNames.length} icons`} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="dsd-icons">
        {list.map((n) => (
          <div key={n} className="dsd-icon" title={n}>
            <div className="dsd-icon-stage"><Icon name={n} size={24} /></div>
            <div className="dsd-small">{n}</div>
          </div>
        ))}
      </div>
    </DocsRoot>
  );
}

/* ---------- Foundations: code (platform names + download) ---------- */
export function CodeExport({ file, source, rules = [], examples = [] }: { file: string; source: string; rules?: string[]; examples?: { figma: string; code: CodeName[] }[] }) {
  const [copied, setCopied] = React.useState(false);
  const download = () => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = file; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(source); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ } };
  return (
    <DocsRoot>
      <div className="dsd-card dsd-type-intro">
        <div className="dsd-eyebrow">{PLATFORM_LABEL}</div>
        <div className="dsd-type-font">{file}</div>
        <ul className="dsd-list">{rules.map((r) => <li key={r}>{r}</li>)}</ul>
        <div className="dsd-pills" style={{ marginTop: 12 }}>
          <button type="button" className="dsd-pill dsd-pill-link dsd-btn" onClick={download}>Download {file}</button>
          <button type="button" className="dsd-pill dsd-btn" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>
      {examples.length ? (
        <>
          <h3 className="dsd-h3">Figma name → code</h3>
          <table className="dsd-table">
            <thead><tr><th>Figma</th>{examples[0].code.map((c) => <th key={c.label}>{c.label}</th>)}</tr></thead>
            <tbody>{examples.map((e) => <tr key={e.figma}><td><code className="dsd-code">{e.figma}</code></td>{e.code.map((c) => <td key={c.label}><code className="dsd-code">{c.name}</code></td>)}</tr>)}</tbody>
          </table>
        </>
      ) : null}
      <h3 className="dsd-h3">Preview</h3>
      <pre className="dsd-pre"><code>{source.split('\n').slice(0, 80).join('\n')}{source.split('\n').length > 80 ? '\n…' : ''}</code></pre>
    </DocsRoot>
  );
}

/* ---------- Component docs (one page per Figma component) ---------- */
export type ComponentDocsData = {
  name: string; group: string; tier: string; page?: string; figma_url?: string; variant_count?: number;
  overview?: string; use_cases?: string[]; when_to_use?: string[]; when_not_to_use?: string[];
  anatomy?: { part: string; detail?: string }[];
  main_axis?: string; variants?: { value: string; meaning?: string }[];
  sizes?: { value: string; meaning?: string }[]; states?: { value: string; meaning?: string }[];
  icons?: { property: string; accepts?: string; default?: string; rule?: string; show?: string }[];
  rtl?: boolean;
  code?: { label: string; call: string; props: { figma: string; code: string; type: string; values: string[] }[] };
  guidelines?: { do?: string; dont?: string; do_args?: Record<string, unknown>; dont_args?: Record<string, unknown> }[];
  content?: string[]; accessibility?: string[]; built_from?: string[]; related?: string[]; gaps?: string[];
  figma_description?: string;
};
type StoriesModule = { default: { component?: React.ComponentType<any>; args?: Record<string, unknown> } } & Record<string, any>;

function Example({ stories, args }: { stories: StoriesModule; args?: Record<string, unknown> }) {
  const C = stories.default.component;
  if (!C) return null;
  return <C {...(stories.default.args || {})} {...(args || {})} />;
}
const SEMANTIC = Object.entries(COLLECTIONS).find(([k, c]) => (c.role || k).toLowerCase().includes('semantic'));
function ModePanels({ children }: { children: React.ReactNode }) {
  if (!SEMANTIC) return <>{children}</>;
  const [name, c] = SEMANTIC;
  return (
    <div className="dsd-modes">
      {c.modes.map((m) => (
        <div key={m} className="dsd-mode" {...modeAttrs(name, m)} style={themeStyle}>
          <div className="dsd-mode-name">{m}</div>
          {children}
        </div>
      ))}
    </div>
  );
}
function Gallery({ stories, axis, items }: { stories: StoriesModule; axis: string; items: { value: string; meaning?: string }[] }) {
  return (
    <div className="dsd-gallery">
      {items.map((it) => (
        <figure key={it.value} className="dsd-figure">
          <div className="dsd-stage"><Example stories={stories} args={{ [axis]: it.value }} /></div>
          <figcaption><Code>{axis}={it.value}</Code>{it.meaning && <div className="dsd-small">{it.meaning}</div>}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ComponentDocs({ docs, stories }: { docs: ComponentDocsData; stories: StoriesModule }) {
  const d = docs;
  const playground = stories.Playground;
  const toc: [string, string, boolean][] = [
    ['overview', 'Overview', true],
    ['when-to-use', 'When to use', !!(d.when_to_use?.length || d.when_not_to_use?.length)],
    ['anatomy', 'Anatomy', !!d.anatomy?.length],
    ['variants', 'Variants', !!d.variants?.length],
    ['sizes', 'Sizes', !!d.sizes?.length],
    ['states', 'States', !!d.states?.length],
    ['icons', 'Icons', !!d.icons?.length],
    ['rtl', 'Right to left', !!d.rtl],
    ['guidelines', 'Do and don\'t', !!d.guidelines?.length],
    ['content', 'Content', !!d.content?.length],
    ['accessibility', 'Accessibility', !!d.accessibility?.length],
    ['properties', 'Properties', true],
    ['playground', 'Playground', !!playground],
  ];
  return (
    <DocsRoot>
      <header className="dsd-comp-head">
        <div className="dsd-eyebrow">{d.group} · {d.tier}</div>
        <h1 className="dsd-h1">{d.name}</h1>
        {d.overview && <p className="dsd-summary">{d.overview}</p>}
        <div className="dsd-pills">
          {d.page && <span className="dsd-pill">Figma page {d.page}</span>}
          {d.variant_count ? <span className="dsd-pill">{d.variant_count} variants</span> : null}
          {d.figma_url && <a className="dsd-pill dsd-pill-link" href={d.figma_url} target="_blank" rel="noreferrer">Open in Figma ↗</a>}
        </div>
        <nav className="dsd-toc">{toc.filter((t) => t[2]).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      </header>

      <section>
        <H2 id="overview">Overview</H2>
        {playground && <Canvas of={playground} sourceState={PLATFORM === 'web' ? 'hidden' : 'none'} />}
        {d.use_cases?.length ? (
          <>
            <h3 className="dsd-h3">Use cases</h3>
            <ul className="dsd-list">{d.use_cases.map((u) => <li key={u}>{u}</li>)}</ul>
          </>
        ) : null}
      </section>

      {(d.when_to_use?.length || d.when_not_to_use?.length) ? (
        <section>
          <H2 id="when-to-use">When to use</H2>
          <div className="dsd-two">
            <div className="dsd-card dsd-good"><div className="dsd-card-title">Use it</div><ul className="dsd-list">{(d.when_to_use || []).map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="dsd-card dsd-bad"><div className="dsd-card-title">Do not use it</div><ul className="dsd-list">{(d.when_not_to_use || []).map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </section>
      ) : null}

      {d.anatomy?.length ? (
        <section>
          <H2 id="anatomy">Anatomy</H2>
          <div className="dsd-anatomy">
            <div className="dsd-stage dsd-stage-lg"><Example stories={stories} /></div>
            <ol className="dsd-parts">{d.anatomy.map((a) => <li key={a.part}><strong>{a.part}</strong>{a.detail && <div className="dsd-muted dsd-small">{a.detail}</div>}</li>)}</ol>
          </div>
        </section>
      ) : null}

      {d.variants?.length && d.main_axis ? (
        <section>
          <H2 id="variants">Variants</H2>
          <p className="dsd-p">Figma variant property <Code>{d.main_axis}</Code>.</p>
          <Gallery stories={stories} axis={d.main_axis} items={d.variants} />
        </section>
      ) : null}

      {d.sizes?.length ? (
        <section>
          <H2 id="sizes">Sizes</H2>
          <Gallery stories={stories} axis="Size" items={d.sizes} />
        </section>
      ) : null}

      {d.states?.length ? (
        <section>
          <H2 id="states">States</H2>
          <p className="dsd-p">Each state is a Figma variant (<Code>State</Code>) and also works for real on hover, focus and press.</p>
          <ul className="dsd-list">{d.states.filter((s) => s.meaning).map((s) => <li key={s.value}><strong>{s.value}</strong>: {s.meaning}</li>)}</ul>
          <ModePanels>
            <div className="dsd-matrix-wrap">
              <table className="dsd-matrix">
                <thead><tr>{d.main_axis ? <th /> : null}{d.states.map((s) => <th key={s.value}>{s.value}</th>)}</tr></thead>
                <tbody>
                  {(d.main_axis && d.variants?.length ? d.variants : [{ value: '' }]).map((v) => (
                    <tr key={v.value}>
                      {d.main_axis ? <th>{v.value}</th> : null}
                      {d.states!.map((s) => (
                        <td key={s.value}><Example stories={stories} args={{ ...(d.main_axis && v.value ? { [d.main_axis]: v.value } : {}), State: s.value }} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModePanels>
        </section>
      ) : null}

      {d.icons?.length ? (
        <section>
          <H2 id="icons">Icons</H2>
          {d.icons.some((i) => i.show) ? (
            <div className="dsd-matrix-wrap dsd-stage">
              <table className="dsd-matrix">
                <thead><tr>{d.sizes?.length ? <th /> : null}{d.icons.filter((i) => i.show).map((i) => <th key={i.property}>{i.property}</th>)}{d.icons.filter((i) => i.show).length > 1 ? <th>Both</th> : null}</tr></thead>
                <tbody>
                  {(d.sizes?.length ? d.sizes : [{ value: '' }]).map((sz) => {
                    const base = sz.value ? { Size: sz.value } : {};
                    const shows = d.icons!.filter((i) => i.show);
                    return (
                      <tr key={sz.value}>
                        {sz.value ? <th>{sz.value}</th> : null}
                        {shows.map((i) => <td key={i.property}><Example stories={stories} args={{ ...base, [i.show!]: true }} /></td>)}
                        {shows.length > 1 ? <td><Example stories={stories} args={{ ...base, ...Object.fromEntries(shows.map((i) => [i.show!, true])) }} /></td> : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
          <table className="dsd-table">
            <thead><tr><th>Property</th><th>Accepts</th><th>Default</th><th>Rule</th></tr></thead>
            <tbody>{d.icons.map((i) => <tr key={i.property}><td><Code>{i.property}</Code></td><td>{i.accepts}</td><td>{i.default}</td><td className="dsd-small">{i.rule}</td></tr>)}</tbody>
          </table>
        </section>
      ) : null}

      {d.rtl ? (
        <section>
          <H2 id="rtl">Right to left</H2>
          <p className="dsd-p">In right-to-left languages the layout is mirrored: leading items move to the right, and directional icons (arrows, chevrons) must be mirrored too.</p>
          <div className="dsd-gallery" dir="rtl">
            <figure className="dsd-figure"><div className="dsd-stage"><Example stories={stories} /></div></figure>
            {(d.icons || []).filter((i) => i.show).map((i) => (
              <figure key={i.property} className="dsd-figure"><div className="dsd-stage"><Example stories={stories} args={{ [i.show!]: true }} /></div><figcaption><Code>{i.property}</Code></figcaption></figure>
            ))}
          </div>
        </section>
      ) : null}

      {d.guidelines?.length ? (
        <section>
          <H2 id="guidelines">Do and don't</H2>
          {d.guidelines.map((g, i) => (
            <div key={i} className="dsd-two">
              {g.do ? (
                <div className="dsd-card dsd-good">
                  {g.do_args && <div className="dsd-stage"><Example stories={stories} args={g.do_args} /></div>}
                  <div className="dsd-verdict">✓ Do</div><div className="dsd-card-text">{g.do}</div>
                </div>
              ) : <div />}
              {g.dont ? (
                <div className="dsd-card dsd-bad">
                  {g.dont_args && <div className="dsd-stage"><Example stories={stories} args={g.dont_args} /></div>}
                  <div className="dsd-verdict">✕ Don't</div><div className="dsd-card-text">{g.dont}</div>
                </div>
              ) : <div />}
            </div>
          ))}
        </section>
      ) : null}

      {d.content?.length ? (
        <section>
          <H2 id="content">Content</H2>
          <ul className="dsd-list">{d.content.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
      ) : null}

      {d.accessibility?.length ? (
        <section>
          <H2 id="accessibility">Accessibility</H2>
          <ul className="dsd-list">{d.accessibility.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
      ) : null}

      <section>
        <H2 id="properties">Properties</H2>
        <p className="dsd-p">Names, options and defaults are the Figma component properties, character for character.</p>
        {playground ? <ArgTypes of={playground} /> : null}
        {d.code?.props.length ? (
          <>
            <h3 className="dsd-h3">In {d.code.label}</h3>
            <p className="dsd-p dsd-muted">Suggested names for the native component, derived from the Figma properties so design and code use the same words.</p>
            <pre className="dsd-pre"><code>{d.code.call}</code></pre>
            <table className="dsd-table">
              <thead><tr><th>Figma property</th><th>{d.code.label}</th><th>Type</th><th>Values</th></tr></thead>
              <tbody>{d.code.props.map((p) => <tr key={p.figma}><td><code className="dsd-code">{p.figma}</code></td><td><code className="dsd-code">{p.code}</code></td><td>{p.type}</td><td className="dsd-small">{p.values.join(', ')}</td></tr>)}</tbody>
            </table>
          </>
        ) : null}
        {(d.built_from?.length || d.related?.length) ? (
          <p className="dsd-p">
            {d.built_from?.length ? <><strong>Built from:</strong> {d.built_from.map((b) => <Code key={b}>{b}</Code>).reduce((a: React.ReactNode[], b, i) => (i ? [...a, ' ', b] : [b]), [])}. </> : null}
            {d.related?.length ? <><strong>Related:</strong> {d.related.join(', ')}.</> : null}
          </p>
        ) : null}
      </section>

      {playground ? (
        <section>
          <H2 id="playground">Playground</H2>
          {/* React source is only useful on Web; native teams read the "In SwiftUI / Compose" table instead */}
          <Canvas of={playground} sourceState={PLATFORM === 'web' ? 'hidden' : 'none'} />
          <Controls of={playground} />
        </section>
      ) : null}

      {d.figma_description || d.gaps?.length ? (
        <section>
          <H2 id="figma">From Figma</H2>
          {d.figma_description && <blockquote className="dsd-quote">{d.figma_description.split('\n').map((l) => <p key={l}>{l}</p>)}</blockquote>}
          {d.gaps?.length ? <p className="dsd-p dsd-muted"><strong>Known Figma gaps:</strong> {d.gaps.join('; ')}</p> : null}
        </section>
      ) : null}
    </DocsRoot>
  );
}
