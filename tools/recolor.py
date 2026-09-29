"""Recolor a shade scale (ramp) cleanly: every step regenerates from the new base color with the
ramp's captured curve, Semantic tokens follow through their aliases, derived tokens (e.g. M3 state
layers) are recomputed, and contrast is re-checked in every mode.

Usage:
  python tools/recolor.py <folder> --list
  python tools/recolor.py <folder> --ramp "<ramp key or last part>" --base "#1E66F5" [--write-tokens]

Writes:
  <folder>/data/recolor/<date>-<ramp>.json      new values, affected semantics, contrast report
  <folder>/data/recolor/<date>-<ramp>.figma.js  script for figma_execute (sets values by variable NAME)
--write-tokens also stores the new values in tokens.json (do this after the Figma update succeeded).
The ramp's curve is never overwritten, so repeated recolors do not drift.
"""
import argparse, copy, datetime, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ds_color import regenerate_ramp, contrast, hex_to_rgba, rgb_to_hex, hex_to_oklch

ROOT = pathlib.Path(__file__).resolve().parent.parent


def resolve(variables, full, mode, depth=0):
    v = variables.get(full)
    if v is None or depth > 10:
        return None
    val = v['values'].get(mode, next(iter(v['values'].values()), None))
    if isinstance(val, dict) and 'alias' in val:
        return resolve(variables, val['alias'], mode, depth + 1)
    return val


def with_alpha(hex_color, alpha):
    r, g, b, _ = hex_to_rgba(hex_color)
    return rgb_to_hex(r, g, b, alpha)


def apply_derived(after, rules):
    """Recompute derived tokens (colors with alpha that must track a role color) in place.
    Returns {variable: {mode: hex}} for the values that changed."""
    changes = {}
    for rule in rules.get('recolor', {}).get('derived_tokens', []):
        pat = re.compile(rule['pattern'])
        for full, v in after.items():
            m = pat.match(full)
            if not m:
                continue
            if 'source' in rule:
                src = rule['source'] if rule['source'] in after else None
            else:
                role = m.group('role')
                names = [role, rule.get('role_aliases', {}).get(role, role)]
                src = next((f for n in names for f in after
                            if f.split('/')[-1] == n and rule.get('source_prefix', '::Schemes/') in f), None)
            if not src:
                continue
            alpha = int(m.group('pct')) / 100
            modes = {}
            for mode in v['values']:
                base_color = resolve(after, src, mode)
                if base_color:
                    val = with_alpha(base_color, alpha)
                    if v['values'][mode] != val:
                        v['values'][mode] = val
                        modes[mode] = val
            if modes:
                changes[full] = modes
    return changes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('folder')
    ap.add_argument('--ramp')
    ap.add_argument('--base')
    ap.add_argument('--list', action='store_true')
    ap.add_argument('--write-tokens', action='store_true')
    a = ap.parse_args()
    data = ROOT / a.folder / 'data'
    tokens = json.loads((data / 'tokens.json').read_text(encoding='utf-8'))
    rules = json.loads((data / 'rules.json').read_text(encoding='utf-8'))
    ramps, variables = tokens['ramps'], tokens['variables']
    if a.list or not a.ramp:
        for k, r in ramps.items():
            print(f'{k}  base {r["base_step"]} = {r["base_hex"]}  ({len(r["order"])} steps)')
        return
    matches = [k for k in ramps if k == a.ramp or k.split('/')[-1] == a.ramp or k.split('::')[-1] == a.ramp]
    if len(matches) != 1:
        sys.exit(f'Ramp "{a.ramp}" matched {matches or "nothing"}. Use --list.')
    key = matches[0]
    ramp = ramps[key]
    gen = ramp['generation']
    new = regenerate_ramp(gen, a.base, ramp['order'], mode=gen['method'])

    after = copy.deepcopy(variables)
    changes = {}
    for step, full in ramp['variables'].items():
        v = after[full]
        modes = {}
        for m, old in v['values'].items():
            if isinstance(old, str):
                v['values'][m] = new[step]
                modes[m] = new[step]
        changes[full] = modes

    changes.update(apply_derived(after, rules))

    # which semantics change
    affected = []
    for full, v in variables.items():
        if tokens['collections'].get(v['collection'], {}).get('role') in ('semantic', 'brand-alias') and v['type'] == 'color':
            for m in v['values']:
                b, c = resolve(variables, full, m), resolve(after, full, m)
                if b != c:
                    affected.append({'token': full, 'mode': m, 'before': b, 'after': c})

    report = []
    for p in rules.get('contrast_pairs', []):
        if p['fg'] not in after or p['bg'] not in after:
            report.append({**p, 'status': 'missing token'})
            continue
        modes = tokens['collections'][after[p['fg']]['collection']]['modes']
        for m in modes:
            fg, bg = resolve(after, p['fg'], m), resolve(after, p['bg'], m)
            if not fg or not bg:
                continue
            r = contrast(fg, bg)
            b_fg, b_bg = resolve(variables, p['fg'], m), resolve(variables, p['bg'], m)
            before = contrast(b_fg, b_bg) if b_fg and b_bg else None
            report.append({'fg': p['fg'], 'bg': p['bg'], 'mode': m, 'fg_hex': fg, 'bg_hex': bg,
                           'ratio': round(r, 2), 'before': round(before, 2) if before else None,
                           'min': p['min'], 'pass': r >= p['min'],
                           'caused_by_recolor': r < p['min'] and (before is None or before >= p['min'])})

    out_dir = data / 'recolor'
    out_dir.mkdir(exist_ok=True)
    slug = re.sub(r'[^A-Za-z0-9]+', '-', key.split('::')[-1]).strip('-').lower()
    stamp = datetime.date.today().isoformat()
    result = {'ramp': key, 'method': gen['method'], 'old_base': ramp['base_hex'], 'new_base': a.base.upper(),
              'new_ramp': new, 'changes': changes, 'affected_semantics': affected,
              'contrast': report, 'failures': [r for r in report if r.get('pass') is False],
              'new_failures': [r for r in report if r.get('caused_by_recolor')]}
    (out_dir / f'{stamp}-{slug}.json').write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding='utf-8')
    js = FIGMA_JS.replace('__CHANGES__', json.dumps(changes, ensure_ascii=False))
    (out_dir / f'{stamp}-{slug}.figma.js').write_text(js, encoding='utf-8')

    print(f'Ramp {key}: {ramp["base_hex"]} -> {a.base.upper()} ({gen["method"]})')
    for s in ramp['order']:
        print(f'  {s:>4}  {ramp["values"][s]} -> {new[s]}')
    print(f'{len(changes)} variables change, {len(affected)} semantic mode values follow.')
    fails = result['failures']
    print(f'Contrast: {len(report) - len(fails)} pass, {len(fails)} fail')
    for f in fails:
        tag = 'NEW ' if f['caused_by_recolor'] else '(already failing) '
        print(f'  {tag}FAIL {f["fg"]} on {f["bg"]} [{f["mode"]}] {f["before"]} -> {f["ratio"]} (min {f["min"]})')
    if any(f['caused_by_recolor'] for f in fails):
        print('Fix NEW failures by re-pointing those Semantic aliases to another step before applying.')
    print(f'Wrote data/recolor/{stamp}-{slug}.json and .figma.js')

    if a.write_tokens:
        for full, modes in changes.items():
            variables[full]['values'].update(modes)
        for full, v in variables.items():
            if 'resolved' in v:
                v['resolved'] = {m: resolve(variables, full, m) for m in v['resolved']}
        ramp['values'] = new
        ramp['base_hex'] = new[ramp['base_step']]
        gen['current_base_oklch'] = [round(x, 4) for x in hex_to_oklch(ramp['base_hex'])]
        tokens.setdefault('recolor_history', []).append({'date': stamp, 'ramp': key, 'from': result['old_base'], 'to': result['new_base']})
        (data / 'tokens.json').write_text(json.dumps(tokens, indent=1, ensure_ascii=False), encoding='utf-8')
        print('tokens.json updated.')


FIGMA_JS = r"""// Generated by tools/recolor.py. Run with figma_execute in the target DS file.
// Sets new values into EXISTING variables found by "<Collection>::<name>". Never creates, renames or deletes.
const CHANGES = __CHANGES__;
const toRGBA = h => { h = h.replace('#',''); const n = i => parseInt(h.slice(i, i+2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }; };
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync('COLOR');
const byKey = new Map(vars.map(v => { const c = cols.find(c => c.id === v.variableCollectionId); return [c.name + '::' + v.name, { v, c }]; }));
const missing = [], done = [];
for (const [key, modes] of Object.entries(CHANGES)) {
  const hit = byKey.get(key);
  if (!hit) { missing.push(key); continue; }
  for (const [modeName, hex] of Object.entries(modes)) {
    const mode = hit.c.modes.find(m => m.name === modeName);
    if (!mode) { missing.push(key + ' [' + modeName + ']'); continue; }
    const cur = hit.v.valuesByMode[mode.modeId];
    if (cur && cur.type === 'VARIABLE_ALIAS') { missing.push(key + ' is an alias, skipped'); continue; }
    hit.v.setValueForMode(mode.modeId, toRGBA(hex));
    done.push(key + ' [' + modeName + ']');
  }
}
return { updated: done.length, missing };
"""

if __name__ == '__main__':
    main()
