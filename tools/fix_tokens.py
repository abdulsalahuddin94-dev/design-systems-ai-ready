"""Find and fix token problems automatically, so a new project starts clean.

Usage:  python tools/fix_tokens.py <folder>
Reads   <folder>/data/tokens.json and <folder>/data/rules.json
Writes  <folder>/data/fixes/<date>-fix-plan.json   (every fix, and what still needs a person)
        <folder>/data/fixes/<date>-fix-plan.figma.js (figma_execute script: values, aliases, renames)

Fixes, in this order:
 1. Derived tokens (e.g. M3 state layers, surface tints) recomputed from their role color.
 2. Aliases listed in rules.json > known_fixes.alias_fixes (e.g. an alias to another library).
 3. Contrast: a Semantic token that fails a rules.json contrast pair is re-pointed to the nearest
    step of the SAME ramp that makes every pair it takes part in pass (never a raw hex).
 4. Names: explicit renames in rules.json > known_fixes.renames, plus automatic clean-up of double
    spaces, trailing spaces and "??" in variable names. Renames run last and keep every binding
    (Figma binds by id).
After applying the script in Figma: re-export variables and run tools/build_tokens.py <folder>.
"""
import copy, datetime, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ds_color import contrast, regenerate_ramp
from recolor import resolve, apply_derived

ROOT = pathlib.Path(__file__).resolve().parent.parent


def clean_name(name):
    parts = []
    for p in name.split('/'):
        p = re.sub(r'\?+', '', p)
        p = re.sub(r'\s{2,}', ' ', p).strip()
        parts.append(p)
    return '/'.join(parts)


def main(folder):
    data = ROOT / folder / 'data'
    tokens = json.loads((data / 'tokens.json').read_text(encoding='utf-8'))
    rules = json.loads((data / 'rules.json').read_text(encoding='utf-8'))
    kf = rules.get('known_fixes', {})
    variables = tokens['variables']
    roles = {c: v['role'] for c, v in tokens['collections'].items()}
    after = copy.deepcopy(variables)
    ops, manual = [], list(kf.get('manual', []))

    # 0. palettes with hand-picked tones -> true tones (tone = CIELAB L*), same key color
    if kf.get('normalize_tones'):
        for rk, r in tokens['ramps'].items():
            curve = copy.deepcopy(r['generation'])
            for s in curve['steps']:
                curve['steps'][s]['L_star'] = float(s)
            new = regenerate_ramp(curve, r['base_hex'], r['order'], mode='m3-tone')
            for s, var in r['variables'].items():
                for m, old in after[var]['values'].items():
                    if isinstance(old, str) and old.upper() != new[s]:
                        after[var]['values'][m] = new[s]
                        ops.append({'op': 'set', 'key': var, 'mode': m, 'value': new[s], 'why': f'tone {s} normalized to L* {s} ({old} -> {new[s]})'})

    # 1. derived tokens
    for full, modes in apply_derived(after, rules).items():
        for m, hexv in modes.items():
            ops.append({'op': 'set', 'key': full, 'mode': m, 'value': hexv, 'why': 'derived token recomputed from its role color'})

    # 2. explicit alias fixes
    for fx in kf.get('alias_fixes', []):
        if fx['token'] in after and fx['alias_to'] in after:
            after[fx['token']]['values'][fx['mode']] = {'alias': fx['alias_to']}
            ops.append({'op': 'alias', 'key': fx['token'], 'mode': fx['mode'], 'target': fx['alias_to'], 'why': fx.get('why', 'known alias fix')})
        else:
            manual.append(f'alias fix skipped (token not found): {fx}')
    for item in tokens['recolor_readiness'].get('unresolved_aliases', []):
        tok = item.split(' [')[0]
        if not any(o['op'] == 'alias' and o['key'] == tok for o in ops):
            manual.append(f'unresolved alias, pick a local Primitive: {item}')

    # 3. contrast
    ramp_of = {}
    for rk, r in tokens['ramps'].items():
        for step, var in r['variables'].items():
            ramp_of[var] = (rk, step)
    pairs = rules.get('contrast_pairs', [])

    def pair_ok(p, mode):
        fg, bg = resolve(after, p['fg'], mode), resolve(after, p['bg'], mode)
        return fg is None or bg is None or contrast(fg, bg) >= p['min']

    prefer = rules.get('contrast_fix', {}).get('prefer', 'fg')

    def ramp_step(tok, mode):
        """Follow the alias chain of tok in mode to a ramp step: (ramp, step) or None."""
        cur, seen = after.get(tok, {}).get('values', {}).get(mode), 0
        while isinstance(cur, dict) and 'alias' in cur and seen < 10:
            if cur['alias'] in ramp_of:
                return ramp_of[cur['alias']]
            nxt = after.get(cur['alias'])
            cur = nxt['values'].get(mode, next(iter(nxt['values'].values()))) if nxt else None
            seen += 1
        return None

    for p in pairs:
        if p['fg'] not in after or p['bg'] not in after:
            manual.append(f'contrast pair uses a missing token: {p["fg"]} on {p["bg"]}')
            continue
        for mode in tokens['collections'][after[p['fg']]['collection']]['modes']:
            if pair_ok(p, mode):
                continue
            movable = [p['fg'], p['bg']] if prefer == 'fg' else [p['bg'], p['fg']]
            movable = [tk for tk in movable if roles.get(after[tk]['collection']) in ('semantic', 'brand-alias') and ramp_step(tk, mode)]
            if not movable:
                manual.append(f'contrast fail, {p["fg"]} on {p["bg"]} [{mode}]: neither token aliases a ramp; fix by hand')
                continue
            best = None
            for tk in movable:  # exhaust the preferred token before touching the other one
                rk, step = ramp_step(tk, mode)
                order = tokens['ramps'][rk]['order']
                i0 = order.index(step)
                cur = after[tk]['values'][mode]
                was_ok = [q for q in pairs if tk in (q['fg'], q['bg']) and q is not p and pair_ok(q, mode)]
                for d in range(1, len(order)):
                    for j in (i0 + d, i0 - d):
                        if 0 <= j < len(order):
                            target = tokens['ramps'][rk]['variables'][order[j]]
                            after[tk]['values'][mode] = {'alias': target}
                            if pair_ok(p, mode) and all(pair_ok(q, mode) for q in was_ok):
                                best = (tk, step, order[j], target)
                                break
                            after[tk]['values'][mode] = cur
                    if best:
                        break
                if best:
                    break
            if best:
                tk, old, new_step, target = best
                ops = [o for o in ops if not (o['op'] == 'alias' and o['key'] == tk and o['mode'] == mode)]
                fg, bg = resolve(after, p['fg'], mode), resolve(after, p['bg'], mode)
                ops.append({'op': 'alias', 'key': tk, 'mode': mode, 'target': target,
                            'why': f'contrast {p["fg"].split("::")[1]} on {p["bg"].split("::")[1]}: moved {tk.split("::")[1]} {old} -> {new_step} ({contrast(fg, bg):.2f} >= {p["min"]})'})
            else:
                manual.append(f'contrast fail with no passing step: {p["fg"]} on {p["bg"]} [{mode}]')

    # 4. names
    renames = {r['from']: r['to'] for r in kf.get('renames', [])}
    for g in kf.get('group_renames', []):
        col, prefix = g['from'].split('::', 1)
        for full, v in variables.items():
            if v['collection'] == col and v['name'].startswith(prefix) and full not in renames:
                renames[full] = g['to'] + v['name'][len(prefix):]
    for full, v in variables.items():
        cleaned = clean_name(v['name'])
        if full in renames:
            renames[full] = clean_name(renames[full])
        elif cleaned != v['name']:
            renames[full] = cleaned
    for old, new in renames.items():
        if old in variables:
            ops.append({'op': 'rename', 'key': old, 'to': new, 'why': 'naming clean-up'})
    col_renames = kf.get('collection_renames', {})

    out = data / 'fixes'
    out.mkdir(exist_ok=True)
    stamp = datetime.date.today().isoformat()
    plan = {'folder': folder, 'date': stamp, 'counts': {k: sum(1 for o in ops if o['op'] == k) for k in ('set', 'alias', 'rename')},
            'collection_renames': col_renames, 'operations': ops, 'needs_a_person': manual}
    (out / f'{stamp}-fix-plan.json').write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding='utf-8')
    js = FIGMA_JS.replace('__OPS__', json.dumps(ops, ensure_ascii=False)).replace('__COLS__', json.dumps(col_renames, ensure_ascii=False))
    (out / f'{stamp}-fix-plan.figma.js').write_text(js, encoding='utf-8')
    print(f'{folder}: {plan["counts"]["set"]} values set (tones + derived), {plan["counts"]["alias"]} re-pointed aliases, '
          f'{plan["counts"]["rename"]} renames, {len(col_renames)} collection renames, {len(manual)} need a person')
    for o in ops:
        if o['op'] != 'set':
            print('  ', o['op'], o['key'], o.get('mode', ''), '->', o.get('target', o.get('to')), '|', o['why'])
    for m in manual:
        print('   MANUAL', m)


FIGMA_JS = r"""// Generated by tools/fix_tokens.py. Run with figma_execute in the DS file (never in an original template).
// Finds variables by "<Collection>::<name>". Sets values and aliases first, renames last.
const OPS = __OPS__;
const COLLECTION_RENAMES = __COLS__;
const toRGBA = h => { h = h.replace('#',''); const n = i => parseInt(h.slice(i, i+2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }; };
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byKey = new Map(vars.map(v => { const c = cols.find(c => c.id === v.variableCollectionId); return [c.name + '::' + v.name, { v, c }]; }));
const done = { set: 0, alias: 0, rename: 0, collections: 0 }, missing = [];
for (const op of OPS.filter(o => o.op !== 'rename')) {
  const hit = byKey.get(op.key); if (!hit) { missing.push(op.key); continue; }
  const mode = hit.c.modes.find(m => m.name === op.mode); if (!mode) { missing.push(op.key + ' [' + op.mode + ']'); continue; }
  if (op.op === 'set') { hit.v.setValueForMode(mode.modeId, toRGBA(op.value)); done.set++; }
  if (op.op === 'alias') { const t = byKey.get(op.target); if (!t) { missing.push(op.target); continue; }
    hit.v.setValueForMode(mode.modeId, figma.variables.createVariableAlias(t.v)); done.alias++; }
}
for (const op of OPS.filter(o => o.op === 'rename')) {
  const hit = byKey.get(op.key); if (!hit) { missing.push(op.key); continue; }
  hit.v.name = op.to; done.rename++;
}
for (const [from, to] of Object.entries(COLLECTION_RENAMES)) {
  const c = cols.find(c => c.name === from); if (c) { c.name = to; done.collections++; } else missing.push('collection ' + from);
}
return { done, missing };
"""

if __name__ == '__main__':
    main(sys.argv[1])
