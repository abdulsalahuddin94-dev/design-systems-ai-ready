// Live foundation tables. Everything is read from src/tokens/tokens.ts (generated from the Figma
// variables), so these pages are linked to the tokens, never static - same rule as the Figma docs pages.
import React from 'react';
import { tokens } from '../tokens/tokens';
import { Icon, iconNames } from '../lib/Icon';

type Tok = (typeof tokens.tokens)[number];
const byCollection = (c: string) => tokens.tokens.filter((t) => t.collection === c) as Tok[];
const valueText = (t: Tok, mode: string) => {
  const v = (t.values as Record<string, unknown>)[mode];
  const r = (t.resolved as Record<string, string>)[mode];
  if (v && typeof v === 'object' && 'alias' in (v as object)) return `→ ${(v as { alias: string }).alias.split('::')[1]}${r ? ` (${r})` : ''}`;
  return String(v);
};

const cell: React.CSSProperties = { padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border-default)', textAlign: 'left', verticalAlign: 'middle' };
function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <table className="ts-sm-regular" style={{ borderCollapse: 'collapse', width: '100%', color: 'var(--color-text-primary)' }}>
      <thead><tr>{head.map((h) => <th key={h} className="ts-xs-medium" style={{ ...cell, color: 'var(--color-text-muted)' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={cell}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
const code = (s: string) => <code style={{ fontSize: '12px' }}>{s}</code>;
const swatch = (css: string, mode?: string) => (
  <div data-semantic={mode} style={{ width: 48, height: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-default)', background: `var(${css})` }} />
);

export function PrimitiveColors() {
  const ramps = new Map<string, Tok[]>();
  byCollection('Primitives').filter((t) => t.type === 'color').forEach((t) => {
    const k = t.name.split('/')[0];
    ramps.set(k, [...(ramps.get(k) ?? []), t]);
  });
  return (
    <div className="sb-col">
      {[...ramps].map(([ramp, list]) => (
        <div key={ramp}>
          <div className="ts-sm-medium" style={{ marginBottom: 'var(--space-2)' }}>{ramp}</div>
          <div className="sb-row" style={{ gap: 'var(--space-2)' }}>
            {list.map((t) => (
              <div key={t.css} title={`${t.figma}\n${t.css}`} style={{ width: 88 }}>
                <div style={{ height: 48, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-default)', background: `var(${t.css})` }} />
                <div className="ts-xs-medium">{t.name.split('/').slice(1).join('/')}</div>
                <div className="ts-xs-regular" style={{ color: 'var(--color-text-muted)' }}>{valueText(t, 'Value')}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SemanticColors({ filter }: { filter?: string }) {
  const list = byCollection('Semantic').filter((t) => !filter || t.name.startsWith(filter));
  return (
    <Table
      head={['Figma variable', 'Light', 'Dark', 'CSS variable', 'Light value', 'Dark value']}
      rows={list.map((t) => [code(t.name), swatch(t.css, 'Light'), swatch(t.css, 'Dark'), code(t.css), valueText(t, 'Light'), valueText(t, 'Dark')])}
    />
  );
}

export function TypeScale() {
  const sizes = ['6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'];
  const weights = [['Regular', 'regular'], ['Medium', 'medium'], ['Semi Bold', 'semi-bold'], ['Bold', 'bold']];
  const t = (n: string) => tokens.tokens.find((x) => x.figma === `Typography::${n}`) as Tok | undefined;
  return (
    <Table
      head={['Text style', 'Sample', 'Size D / iPad / M', 'Line height', 'Letter spacing']}
      rows={sizes.flatMap((s) =>
        weights.map(([w, cls]) => {
          const fs = t(`font-size/${s}`), lh = t(`line-height/${s}`), ls = t(`letter-spacing/${s}`);
          const v = (x?: Tok) => (x ? ['Desktop', 'iPad', 'Mobile'].map((m) => (x.values as Record<string, number>)[m]).join(' / ') : '-');
          return [code(`${s}/${w}`), <span className={`ts-${s}-${cls}`}>The quick brown fox</span>, v(fs), v(lh), v(ls)];
        }),
      )}
    />
  );
}

export function Dimensions({ collection, kind }: { collection: 'Spacing' | 'Radius'; kind: 'space' | 'radius' }) {
  const list = byCollection(collection);
  const modes = tokens.collections[collection].modes as readonly string[];
  return (
    <Table
      head={['Figma variable', 'Preview', 'CSS variable', ...modes]}
      rows={list.map((t) => [
        code(t.name),
        kind === 'space'
          ? <div style={{ width: `var(${t.css})`, height: 16, background: 'var(--color-btn-primary-bg-2)', borderRadius: 'var(--radius-sm)' }} />
          : <div style={{ width: 48, height: 48, border: '2px solid var(--color-btn-primary-bg-2)', borderRadius: `var(${t.css})` }} />,
        code(t.css),
        ...modes.map((m) => `${(t.values as Record<string, number>)[m]}px`),
      ])}
    />
  );
}

export function Shadows() {
  const names = ['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'inset-shadow-2xs', 'inset-shadow-xs', 'inset-shadow-sm', 'focus-ring', 'focus-ring-offset'];
  return (
    <div className="sb-row" style={{ gap: 'var(--space-8)' }}>
      {names.map((n) => (
        <div key={n} style={{ width: 120 }}>
          <div style={{ height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-muted)', boxShadow: `var(--${n})` }} />
          <div className="ts-xs-medium" style={{ marginTop: 'var(--space-2)' }}>{n}</div>
        </div>
      ))}
    </div>
  );
}

export function Icons() {
  return (
    <div className="sb-row" style={{ gap: 'var(--space-3)' }}>
      {iconNames.map((n) => (
        <div key={n} style={{ width: 96, textAlign: 'center', color: 'var(--color-icon-default)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)' }}><Icon name={n} size={24} /></div>
          <div className="ts-xs-regular" style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>Icon/{n}</div>
        </div>
      ))}
    </div>
  );
}
