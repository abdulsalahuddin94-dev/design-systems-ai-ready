"""Flatten a transparent raw color onto its real background and find the nearest Semantic color token,
per mode (Design_System_Intake_Skill section 7, step 4 "Alpha colors").

  python tools/flatten_alpha.py <folder> --color "#1A73E81F" --bg "bg/primary"
  python tools/flatten_alpha.py <folder> --color "#000000" --alpha 0.08 --bg Light=#FFFFFF --bg Dark=#121212

--bg is a Semantic token name (resolved in every Semantic mode), a hex (one mode), or Mode=<token|hex>,
repeatable. Flattening is in sRGB like Figma: result = color*alpha + bg*(1-alpha).
Distance is deltaE OK (OKLab distance x 100). Verdict: `auto-map` when the same token is nearest in every
mode with deltaE < --max-de (default 2), else `needs decision`. Standard library only."""
import argparse
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ds_color import hex_to_rgba, rgb_to_hex, rgb_to_oklab  # noqa: E402


def delta_e(h1, h2):
    a = rgb_to_oklab(*hex_to_rgba(h1)[:3])
    b = rgb_to_oklab(*hex_to_rgba(h2)[:3])
    return math.dist(a, b) * 100


def flatten(color, alpha, bg):
    c, b = hex_to_rgba(color)[:3], hex_to_rgba(bg)[:3]
    return rgb_to_hex(*(ci * alpha + bi * (1 - alpha) for ci, bi in zip(c, b)))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('folder', help='DS folder with data/tokens.json (e.g. Trianglz or My Projects/<Project>)')
    p.add_argument('--color', required=True, help='raw color, #RRGGBBAA or #RRGGBB with --alpha')
    p.add_argument('--alpha', type=float, help='layer/fill opacity 0..1 (multiplied with the hex alpha)')
    p.add_argument('--bg', action='append', required=True, help='token name, hex, or Mode=<token|hex>')
    p.add_argument('--max-de', type=float, default=2.0)
    p.add_argument('--top', type=int, default=3)
    a = p.parse_args()

    data = json.load(open(os.path.join(a.folder, 'data', 'tokens.json'), encoding='utf-8'))
    sem = {v['name']: v for v in data['variables'].values()
           if v['type'] == 'color' and data['collections'][v['collection']]['role'] == 'semantic'}
    modes = next(c['modes'] for c in data['collections'].values() if c['role'] == 'semantic')

    r, g, b, ha = hex_to_rgba(a.color)
    alpha = ha * (a.alpha if a.alpha is not None else 1.0)
    base = rgb_to_hex(r, g, b)

    def resolve(val, mode):
        if val.startswith('#'):
            return val
        if val not in sem:
            sys.exit(f'Unknown Semantic token: {val}')
        return sem[val]['resolved'][mode]

    bgs = {}
    for item in a.bg:
        mode, _, val = item.partition('=') if '=' in item else ('', '', item)
        if mode:
            bgs[mode] = resolve(val, mode if mode in modes else modes[0])
        elif val.startswith('#'):
            bgs['given'] = val
        else:
            bgs.update({m: resolve(val, m) for m in modes})

    print(f'color {base} alpha {alpha:.2f}')
    winners = []
    for mode, bg in bgs.items():
        flat = flatten(base, alpha, bg)
        key = mode if mode in modes else modes[0]
        cands = sorted((delta_e(flat, v['resolved'][key]), n, v['resolved'][key]) for n, v in sem.items()
                       if v['resolved'].get(key, '#00000000')[7:9] in ('', 'FF', 'ff'))
        winners.append(cands[0])
        print(f'\n[{mode}] bg {bg} -> flattened {flat}')
        for de, n, val in cands[:a.top]:
            print(f'  {n:40} {val:10} dE {de:.2f}')

    same = len({w[1] for w in winners}) == 1
    ok = same and all(w[0] < a.max_de for w in winners)
    print('\nverdict:', f'auto-map -> {winners[0][1]}' if ok else
          'needs decision (' + ('different token per mode' if not same else f'dE >= {a.max_de}') + ')')
    print('Exceptions stay transparent (scrim/overlay over content, over images, hover/pressed state layers).')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
