"""Build <platform folder>/data/tokens.json from the Figma variable export.

Usage:  python tools/build_tokens.py <DS folder>   (e.g. a reference folder or "My Projects/<Project>")
Input:  <folder>/data/source/config.json and one of
        - data/source/figma-variables.dtcg.json  (figma-console figma_export_tokens, format dtcg)
        - data/source/variables.from-skill.json   (fallback built from the skill reference files)
Output: <folder>/data/tokens.json with every variable (per-mode values and aliases, scopes,
        descriptions), every shade scale with its captured OKLCH curve (for recolor), and a
        recolor-readiness report (semantic tokens that hold raw hex instead of aliases).
"""
import json, re, sys, datetime, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ds_color import capture_curve

ROOT = pathlib.Path(__file__).resolve().parent.parent


def load_dtcg(path, cfg):
    d = json.loads(path.read_text(encoding='utf-8'))
    cols = cfg['collections']
    tokens = []  # (slug, path list, token)

    def walk(o, p):
        for k, v in o.items():
            if k.startswith('$'):
                continue
            if isinstance(v, dict) and '$value' in v:
                tokens.append((p[0], p[1:] + [k], v))
            elif isinstance(v, dict):
                walk(v, p + [k])
    for top, v in d.items():
        if not top.startswith('$'):
            walk(v, [top])
    # dotted DTCG reference -> Figma full name
    ref = {}
    out = []
    for slug, p, t in tokens:
        ext = t['$extensions']['figma-console-mcp']
        col = cols[ext['collectionId']]['name']
        full = col + '::' + '/'.join(p)
        ref['{' + slug + '.' + '.'.join(p) + '}'] = full
        out.append((full, col, '/'.join(p), t, ext))
    variables = {}
    for full, col, name, t, ext in out:
        vals = {}
        for mode, mv in ext.get('lastSyncedValue', {}).items():
            if 'reference' in mv:
                r = mv['reference']
                vals[mode] = {'alias': ref.get(r, r)}
            else:
                vals[mode] = mv.get('literal')
        variables[full] = {'collection': col, 'name': name, 'type': t.get('$type'),
                           'values': vals, 'scopes': ext.get('scopes', []),
                           'description': t.get('$description', '')}
        if ext.get('codeSyntax'):
            # Figma "Code syntax" per platform (WEB / iOS / ANDROID): Storybook shows it as the code name
            variables[full]['code_syntax'] = ext['codeSyntax']
    return variables


def resolve(variables, full, mode, depth=0):
    v = variables.get(full)
    if v is None or depth > 10:
        return None
    val = v['values'].get(mode)
    if val is None:  # alias target has other modes (e.g. Value)
        val = next(iter(v['values'].values()), None)
    if isinstance(val, dict) and 'alias' in val:
        return resolve(variables, val['alias'], mode, depth + 1)
    return val


def main(folder):
    base = ROOT / folder / 'data'
    cfg = json.loads((base / 'source' / 'config.json').read_text(encoding='utf-8'))
    src = base / 'source' / 'figma-variables.dtcg.json'
    if src.exists():
        variables = load_dtcg(src, cfg)
        source = {'method': 'figma-console figma_export_tokens (Desktop Bridge, read-only)',
                  'file': str(src.relative_to(ROOT)).replace('\\', '/'), 'needs_resync': False}
    else:
        src = base / 'source' / 'variables.from-skill.json'
        variables = json.loads(src.read_text(encoding='utf-8'))
        source = {'method': 'built from Foundation_Skill/references/variables.md (Figma file not connected)',
                  'file': str(src.relative_to(ROOT)).replace('\\', '/'), 'needs_resync': True}
    roles = {c['name']: c['role'] for c in cfg['collections'].values()}
    modes = {}
    for v in variables.values():
        modes.setdefault(v['collection'], [])
        for m in v['values']:
            if m not in modes[v['collection']]:
                modes[v['collection']].append(m)
    for full, v in variables.items():
        if v['type'] == 'color' or any(isinstance(x, dict) for x in v['values'].values()):
            v['resolved'] = {m: resolve(variables, full, m) for m in modes[v['collection']]}

    # shade scales: primitive colors whose name ends in a number, grouped by parent path
    groups = {}
    for full, v in variables.items():
        if roles.get(v['collection']) != 'primitive' or v['type'] != 'color':
            continue
        m = re.search(r'(\d+)\s*$', v['name'].split('/')[-1])
        if not m:
            continue
        fam = v['collection'] + '::' + '/'.join(v['name'].split('/')[:-1])
        val = next(iter(v['values'].values()))
        if isinstance(val, str):
            groups.setdefault(fam, {})[m.group(1)] = (full, val)
    ramps = {}
    rc = cfg['ramp']
    for fam, steps in sorted(groups.items()):
        if len(steps) < 5:
            continue
        order = sorted(steps, key=int)
        b = rc.get('base_steps', {}).get(fam.split('::')[-1], rc['base_step'])  # per-ramp override
        b = b if b in steps else order[len(order) // 2]
        hexes = {s: steps[s][1] for s in order}
        ramps[fam] = {'variables': {s: steps[s][0] for s in order}, 'values': hexes,
                      'base_step': b, 'base_hex': hexes[b], 'order': order,
                      'generation': dict(method=rc['method'], **capture_curve(hexes, b))}

    # recolor readiness
    raw_semantic, unresolved = [], []
    for full, v in variables.items():
        if roles.get(v['collection']) in ('semantic', 'brand-alias') and v['type'] == 'color':
            for m, val in v['values'].items():
                if isinstance(val, str):
                    raw_semantic.append(f'{full} [{m}] = {val}')
                elif isinstance(val, dict) and '::' not in val['alias']:
                    unresolved.append(f'{full} [{m}] -> {val["alias"]}')
    ramp_vars = {x for r in ramps.values() for x in r['variables'].values()}
    loose_primitives = [f for f, v in variables.items()
                        if roles.get(v['collection']) == 'primitive' and v['type'] == 'color' and f not in ramp_vars]
    doc = {
        'meta': {'platform': cfg['platform'], 'figma_file': cfg['figma_file'], 'figma_url': cfg['figma_url'],
                 'source': source, 'generated_at': datetime.date.today().isoformat(),
                 'generated_by': 'tools/build_tokens.py',
                 'naming': 'Keys are "<Collection>::<variable name>" exactly as in Figma. Find variables by this name, never by id.',
                 'recolor': 'See rules.json > recolor and tools/recolor.py'},
        'collections': {c: {'role': roles.get(c), 'modes': m} for c, m in modes.items()},
        'variables': variables,
        'ramps': ramps,
        'recolor_readiness': {
            'ready': not raw_semantic and not unresolved,
            'semantic_tokens_with_raw_hex': raw_semantic,
            'unresolved_aliases': unresolved,
            'primitive_colors_outside_ramps': loose_primitives,
            'rule': 'Semantic tokens must only alias Primitives. Every item in semantic_tokens_with_raw_hex will NOT follow a recolor until it is re-pointed to a Primitive.'}
    }
    (base / 'tokens.json').write_text(json.dumps(doc, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'{folder}: {len(variables)} variables, {len(ramps)} ramps, '
          f'{len(raw_semantic)} raw semantic values, {len(unresolved)} unresolved aliases')


if __name__ == '__main__':
    main(sys.argv[1])
