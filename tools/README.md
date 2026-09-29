# Tools

Python 3, standard library only. Run from the Root.

| Script | What it does |
|---|---|
| `build_tokens.py <folder>` | Builds `<folder>/data/tokens.json` from the Figma variable export in `data/source/` (every variable per mode, aliases, resolved values, shade scales with their OKLCH curve, and a recolor-readiness report). |
| `recolor.py <folder> --list` | Lists the shade scales (ramps) and their base colors. |
| `recolor.py <folder> --ramp "<ramp>" --base "#hex"` | Regenerates the whole ramp from a new base color, recomputes derived tokens, re-checks contrast in every mode and writes `data/recolor/<date>-<ramp>.json` plus a `.figma.js` script for figma_execute. Add `--write-tokens` after the Figma update to store the new values. |
| `ds_color.py` | Color math used by both (OKLCH, CIELAB L*, WCAG contrast, ramp curves). |

## Refresh tokens from Figma
1. Open the DS file in Figma Desktop with the Desktop Bridge plugin running.
2. Export with figma-console `figma_export_tokens` (format `dtcg`, colorFormat `hex8`, strategy `replace`) to `<folder>/data/source/figma-variables.dtcg.json`.
3. Make sure `<folder>/data/source/config.json` maps each collection id to its name and role (`primitive`, `semantic`, `brand-alias`, `typography`, `spacing`, `radius`).
4. `python tools/build_tokens.py <folder>`.

## How a recolor stays clean
- Only Primitive values change; names never change, so every Semantic alias and every component follows.
- Each ramp keeps the curve captured from its original steps: lightness per step (OKLCH L, or M3 tone = L* for Android), chroma relative to the base, and hue offset. The base step becomes the new color.
- Derived tokens that Figma cannot alias (colors with alpha, like M3 state layers) are recomputed from their role color (`rules.json > recolor.derived_tokens`).
- Contrast pairs in `rules.json` are checked before and after; only NEW failures block the change.
