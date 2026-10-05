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
                  <thead><tr><th>Figma variable</th>{modes.map((m) => <th key={m}>{m}</th>)}<th>CSS variable</th><th>Use</th></tr></thead>
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
                        <td><Code>{t.css}</Code></td>
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

/* ---------- Foundations: typography at real size ---------- */
export const textClass = (style: string) => 'ts-' + style.toLowerCase().replace(/[/\s]+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

function Measured({ cls, sample }: { cls: string; sample: string }) {
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
        {m ? <><strong>{m.size}</strong> / {m.line}<br /><span className="dsd-muted">weight {m.weight} · tracking {m.tracking}</span></> : null}
      </div>
    </>
  );
}

export type TypeData = { font?: string; styles: string[]; groups?: { name: string; styles: string[] }[]; sample?: string; rules?: string[] };
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
      {groups.map((g) => (
        <div key={g.name} className="dsd-type-group">
          <div className="dsd-type-group-name">{g.name}</div>
          {g.styles.map((s) => (
            <div key={s} className="dsd-type-row">
              <div className="dsd-type-name"><Code>{s}</Code><div className="dsd-muted dsd-small">.{textClass(s)}</div></div>
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
              <thead><tr><th>Figma variable</th><th>Preview</th>{modes.map((m) => <th key={m}>{m}</th>)}<th>CSS variable</th></tr></thead>
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
                    <td><Code>{t.css}</Code></td>
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
                <div className="dsd-muted dsd-small">var({cssName(s)})</div>
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

/* ---------- Component docs (one page per Figma component) ---------- */
export type ComponentDocsData = {
  name: string; group: string; tier: string; page?: string; figma_url?: string; variant_count?: number;
  overview?: string; use_cases?: string[]; when_to_use?: string[]; when_not_to_use?: string[];
  anatomy?: { part: string; detail?: string }[];
  main_axis?: string; variants?: { value: string; meaning?: string }[];
  sizes?: { value: string; meaning?: string }[]; states?: { value: string; meaning?: string }[];
  icons?: { property: string; accepts?: string; default?: string; rule?: string }[];
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
        {playground && <Canvas of={playground} sourceState="hidden" />}
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
          <Gallery stories={stories} axis="State" items={d.states} />
        </section>
      ) : null}

      {d.icons?.length ? (
        <section>
          <H2 id="icons">Icons</H2>
          <table className="dsd-table">
            <thead><tr><th>Property</th><th>Accepts</th><th>Default</th><th>Rule</th></tr></thead>
            <tbody>{d.icons.map((i) => <tr key={i.property}><td><Code>{i.property}</Code></td><td>{i.accepts}</td><td>{i.default}</td><td className="dsd-small">{i.rule}</td></tr>)}</tbody>
          </table>
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
          <Canvas of={playground} />
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
