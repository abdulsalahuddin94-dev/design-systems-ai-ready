// Figma variable modes for every design system Storybook. Copied into <storybook>/src/docs/ by tools/storybook_docs.py.
// Do not edit the copy; change Storybook_Design_System_Skill/templates/docs/ and rerun the tool.
//
// - One toolbar per collection with more than one mode, named after the Figma collection and its modes
//   (Mobile Adaptive: the OS collection is the "Platform" switch, iOS / Android).
// - ModeScope sets every mode on one element (data-<collection> attributes, data-mode-scope, dir), so CSS aliases
//   resolve there, and gives docs blocks and components the same modes through React context.
// - resolveToken() follows Figma aliases across collections for a set of modes, so docs show the value developers get
//   on the selected platform and language (Font Size/Body: 17 on iOS, 16 on Android).
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { tokens } from '../tokens/tokens';

export type CodeName = { label: string; name: string; source?: string };
export type Collection = { modes: string[]; default: string; attribute: string; role?: string };
export type Token = {
  figma: string; collection: string; name: string; type: string; css: string;
  values: Record<string, unknown>; resolved?: Record<string, unknown>; description?: string;
  code?: CodeName[]; codes?: Record<string, CodeName[]>;
};
export type PlatformInfo = { key: string; label: string; mode: string; file: string };
type TokensFile = { platform?: string; platform_label?: string; platforms?: PlatformInfo[]; os_collection?: string | null; collections: Record<string, Collection>; tokens: Token[] };

const T = tokens as unknown as TokensFile;
export const COLLECTIONS = T.collections;
export const ALL_TOKENS = T.tokens;
export const OS_COLLECTION = T.os_collection || null;
export const PLATFORMS: PlatformInfo[] = T.platforms || [];
/** iOS + Android in one Figma file: the OS collection's mode is the platform. */
export const IS_ADAPTIVE = T.platform === 'adaptive' && !!OS_COLLECTION && PLATFORMS.length > 1;
const BY_KEY = new Map(ALL_TOKENS.map((t) => [t.figma, t]));
const roleOf = (c: string) => (COLLECTIONS[c]?.role || c).toLowerCase();

export type Modes = Record<string, string>;
export const DEFAULT_MODES: Modes = Object.fromEntries(Object.entries(COLLECTIONS).map(([c, m]) => [c, m.default]));
export const MODE_COLLECTIONS = Object.keys(COLLECTIONS).filter((c) => COLLECTIONS[c].modes.length > 1);
export const LANGUAGE_COLLECTION = Object.keys(COLLECTIONS).find((c) => roleOf(c).includes('language')) || null;
const globalKey = (c: string) => COLLECTIONS[c].attribute.replace(/^data-/, '');

const ModesContext = React.createContext<Modes>(DEFAULT_MODES);
export const useModes = () => React.useContext(ModesContext);

export const findToken = (name: string) => BY_KEY.get(name) || ALL_TOKENS.find((t) => t.name === name);
export const isTrue = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

/** Value of a token for a set of modes, following aliases across collections (other collections keep their mode). */
export function resolveToken(key: string, modes: Modes = DEFAULT_MODES, depth = 0): unknown {
  const t = BY_KEY.get(key);
  if (!t || depth > 12) return undefined;
  const mode = modes[t.collection] && t.collection in COLLECTIONS && COLLECTIONS[t.collection].modes.includes(modes[t.collection]) ? modes[t.collection] : COLLECTIONS[t.collection]?.default;
  const v = mode in t.values ? t.values[mode] : Object.values(t.values)[0];
  if (v && typeof v === 'object' && 'alias' in (v as object)) return resolveToken(String((v as { alias: string }).alias), modes, depth + 1);
  return v;
}
export const useToken = (name: string) => {
  const modes = useModes();
  const t = findToken(name);
  return t ? resolveToken(t.figma, modes) : undefined;
};

/** Current platform key: 'ios' | 'android' on a Mobile Adaptive Storybook (from the OS mode), else the Storybook's platform. */
export function platformOf(modes: Modes): string {
  if (!IS_ADAPTIVE) return T.platform || 'web';
  return PLATFORMS.find((p) => p.mode === modes[OS_COLLECTION!])?.key || PLATFORMS[0].key;
}
export const usePlatform = () => platformOf(useModes());
export const platformLabel = (key: string) => PLATFORMS.find((p) => p.key === key)?.label || T.platform_label || 'CSS variable';
export const usePlatformLabel = () => platformLabel(usePlatform());
/** Code names of a token for a platform: Figma Code syntax first, then the DesignTokens file name. */
export const codesFor = (t: Token, platform: string): CodeName[] => t.codes?.[platform] || t.code || [{ label: 'CSS variable', name: t.css }];

export function isRtl(modes: Modes): boolean {
  const dir = ALL_TOKENS.find((t) => t.type === 'boolean' && /direction\/is rtl$/i.test(t.name));
  if (dir) return isTrue(resolveToken(dir.figma, modes));
  return LANGUAGE_COLLECTION ? /^(ar|he|fa|ur)\b/i.test(modes[LANGUAGE_COLLECTION] || '') : false;
}
/** The Language mode that reads right to left (AR), when the file has one. */
export const RTL_MODE = LANGUAGE_COLLECTION ? COLLECTIONS[LANGUAGE_COLLECTION].modes.find((m) => isRtl({ ...DEFAULT_MODES, [LANGUAGE_COLLECTION]: m })) || null : null;

const attrsFor = (modes: Modes) => Object.fromEntries(MODE_COLLECTIONS.map((c) => [COLLECTIONS[c].attribute, modes[c]]));

/** Sets every Figma mode on one element and in context. dir follows the Language mode unless dir={false}. */
export function ModeScope({ modes, children, className, style, dir = true }: { modes?: Partial<Modes>; children: React.ReactNode; className?: string; style?: React.CSSProperties; dir?: boolean }) {
  const parent = useModes();
  const merged = { ...parent, ...(modes || {}) } as Modes;
  return (
    <ModesContext.Provider value={merged}>
      <div data-mode-scope="" {...attrsFor(merged)} dir={dir ? (isRtl(merged) ? 'rtl' : 'ltr') : undefined} className={className} style={style}>{children}</div>
    </ModesContext.Provider>
  );
}

/** Mirrors the modes on <html> so page backgrounds and :root aliases follow the toolbar too. */
function useHtmlModes(modes: Modes) {
  const key = JSON.stringify(modes);
  React.useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-mode-scope', '');
    Object.entries(attrsFor(modes)).forEach(([k, v]) => el.setAttribute(k, v));
    if (LANGUAGE_COLLECTION) el.setAttribute('lang', String(modes[LANGUAGE_COLLECTION]).toLowerCase());
    // the docs wrapper and the story canvas sit outside any ModeScope: mirror the direction there as well
    el.setAttribute('data-dir', isRtl(modes) ? 'rtl' : 'ltr');
    document.querySelectorAll('.sbdocs-wrapper, #storybook-root, #storybook-docs').forEach((n) => n.setAttribute('dir', isRtl(modes) ? 'rtl' : 'ltr'));
  }, [key]);
}

/* ---------- toolbars ---------- */
const TITLE: Record<string, string> = { os: 'Platform', semantic: 'Color', language: 'Language' };
const ICON: Record<string, string> = { os: 'mobile', semantic: 'mirror', language: 'globe' };
const titleOf = (c: string) => {
  const r = roleOf(c);
  const k = Object.keys(TITLE).find((x) => r.includes(x));
  return k && TITLE[k].toLowerCase() !== c.toLowerCase() ? `${TITLE[k]} (${c})` : c;
};
export const modeGlobalTypes = Object.fromEntries(MODE_COLLECTIONS.map((c) => {
  const r = roleOf(c);
  const icon = ICON[Object.keys(ICON).find((x) => r.includes(x)) || ''] || 'switchalt';
  return [globalKey(c), {
    description: `Figma variable collection "${c}": switch its mode (${COLLECTIONS[c].modes.join(' / ')})`,
    toolbar: { title: titleOf(c), icon, items: COLLECTIONS[c].modes.map((m) => ({ value: m, title: `${titleOf(c)}: ${m}`, right: c })), dynamicTitle: true },
  }];
}));
export const modeInitialGlobals = Object.fromEntries(MODE_COLLECTIONS.map((c) => [globalKey(c), COLLECTIONS[c].default]));
export function modesFromGlobals(g?: Record<string, unknown>): Modes {
  return { ...DEFAULT_MODES, ...Object.fromEntries(MODE_COLLECTIONS.map((c) => {
    const v = String(g?.[globalKey(c)] ?? '');
    return [c, COLLECTIONS[c].modes.includes(v) ? v : COLLECTIONS[c].default];
  })) };
}

/** Story decorator: the story renders inside the toolbar's modes. */
export const withModes = (Story: React.ComponentType, ctx: { globals?: Record<string, unknown> }) => {
  const modes = modesFromGlobals(ctx.globals);
  useHtmlModes(modes);
  return <ModeScope modes={modes} className="sb-canvas"><Story /></ModeScope>;
};

/** Docs container: docs pages follow the same toolbar, including the direction of the Language mode (AR = right to left). */
export function ModesDocsContainer(props: { context: any; children?: React.ReactNode; theme?: any }) {
  const { context } = props;
  const read = () => {
    try { return context?.store?.userGlobals?.get?.() || context?.store?.globals?.get?.() || {}; } catch { return {}; }
  };
  const [globals, setGlobals] = React.useState<Record<string, unknown>>(read);
  React.useEffect(() => {
    const ch = context?.channel;
    if (!ch) return undefined;
    const onChange = (e: { globals?: Record<string, unknown> }) => setGlobals(e?.globals || read());
    ch.on('globalsUpdated', onChange);
    ch.on('setGlobals', onChange);
    return () => { ch.off('globalsUpdated', onChange); ch.off('setGlobals', onChange); };
  }, [context]);
  const modes = modesFromGlobals(globals);
  useHtmlModes(modes);
  return (
    <DocsContainer {...(props as any)}>
      <ModeScope modes={modes} className="sb-docs-scope">{props.children}</ModeScope>
    </DocsContainer>
  );
}
