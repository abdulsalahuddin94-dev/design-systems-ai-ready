# Tools

Python 3, standard library only. Run from the Root.

| Script | What it does |
|---|---|
| `build_tokens.py <folder>` | Builds `<folder>/data/tokens.json` from the Figma variable export in `data/source/` (every variable per mode, aliases, resolved values, shade scales with their OKLCH curve, and a recolor-readiness report). |
| `recolor.py <folder> --list` | Lists the shade scales (ramps) and their base colors. |
| `recolor.py <folder> --ramp "<ramp>" --base "#hex"` | Regenerates the whole ramp from a new base color, recomputes derived tokens, re-checks contrast in every mode and writes `data/recolor/<date>-<ramp>.json` plus a `.figma.js` script for figma_execute. Add `--write-tokens` after the Figma update to store the new values. |
| `fix_tokens.py <folder>` | Finds and fixes token problems (hand-picked M3 tones, stale state layers, aliases to other libraries, contrast failures, bad names) and writes `data/fixes/<date>-fix-plan.json` plus a `.figma.js` script. Used by the intake's Fix on create step. Lists what still needs a person (component fixes). |
| `ds_color.py` | Color math used by both (OKLCH, CIELAB L*, WCAG contrast, ramp curves). |
| `new_foundation.py <folder> --brand "#hex" --modes Light,Dark` | Greenfield foundation (intake 3d): brand ramp with a stored curve (base step picked by lightness), gray/status ramps, the Semantic mapping per mode (single-mode systems supported), every contrast pair (including `action/*/border`) and the paired-token check (hover/strong/focus tokens must alias different steps). Writes `data/source/foundation-spec.json`; exits 1 on any failure. `--check-only` prints only the brand contrast pre-check (intake 3.3). |
| `export_variables.figma.js` | Paste into figma-console `figma_execute` when `figma_export_tokens` returns 0 tokens. Returns the same DTCG JSON; save it as `data/source/figma-variables.dtcg.json`. Read-only. |
| `figma_helpers.figma.js` | Paste into `figma_execute` once per file per session (Intake section 0c). Keeps `DS.*` helpers loaded in the plugin: `DS.v`, `DS.fill`, `DS.stroke`, `DS.radius`, `DS.gap`, `DS.pad`, `DS.frame` (Auto Layout, bound spacing), `DS.text` (text style + color variable), `DS.icon`, `DS.instance`, `DS.props`, `DS.importVar`, `DS.comp`, `DS.section`, `DS.report` (unbound fills/padding left). Later scripts call them instead of redefining helpers. |
| `check_bindings.figma.js` | Paste into `figma_execute` (read-only): per component set, unbound fills/strokes/padding/gap/radius, text without a style, and property coverage per variant (properties some variants lost after cloning). Used by ds-auditor. |
| `check_screens.figma.js` | Paste into `figma_execute` (read-only, timeout 30000) on a Design file: per screen, placeholder texts left, sibling instances sharing one text, overflowing layers, squashed instances, bars that are not full-bleed, raw fill/padding/gap on the screen frame, and instance counts to compare with the screen spec. Used by ds-auditor screens mode (Design_System_Intake_Skill section 7f). |
| `split_library.figma.js` | Paste into `figma_execute` on the new Design file when a single-file DS is split into a library (Design_System_Intake_Skill section 7g, path 2). Dry run first: swaps local instances for library components with the same name (overrides kept), rebinds local variables and styles to the library ones by name, moves explicit Light/Dark modes to the library collection, and lists anything with no match. Writes only when `DRY_RUN = false`. |
| `flatten_alpha.py <folder> --color "#RRGGBBAA" --bg <token or Mode=#hex>` | Flattens a transparent raw color on its background per mode and lists the nearest opaque Semantic tokens by OKLCH deltaE; verdict `auto-map` (same token in every mode, deltaE < 2) or `needs decision`. Used by Scenario C (Intake section 7 step 4). |
| `add_reference.py --company --platform --name --figma-url [--default]` | Adds a studied design system to the reference library: scaffolds `Reference_Library/<Company>/<Platform>/`, marks its original file key off-limits and registers it in `references.json` (`status: studying`). Procedure: `References.md` > "Adding a design system" (`/study-reference-ds`). |
| `figma_tools_check.py [--json]` | Read-only: which Figma tools are installed (Desktop Bridge = figma-console-mcp in `.mcp.json` or `~/.claude.json`; FigCli = a `figma-cli*` folder in a `Tools` folder or `FIGMA_CLI_DIR`, with `node_modules` and a working `--version`). Used by Intake section 0b. |
| `project_status.py [<folder>] [--mark-synced] [--add-design-file <url> --name "<name>"]` | Storybook sync status from each project's `CHANGELOG.md`, Design files needing Accept updates, projects whose Storybook plan is Later; `--add-design-file` registers a Design file in `status.json > figma`. |
| `tokens_to_css.py`, `storybook_stories.py`, `storybook_parity.py` | Storybook generators and the Figma name check (Storybook_Design_System_Skill section 5). |

## Refresh tokens from Figma
1. Open the DS file in Figma Desktop with the Desktop Bridge plugin running.
2. Export with figma-console `figma_export_tokens` (format `dtcg`, colorFormat `hex8`, strategy `replace`) to `<folder>/data/source/figma-variables.dtcg.json`. If it returns 0 tokens, run `tools/export_variables.figma.js` with `figma_execute` and save its result to the same file.
3. Make sure `<folder>/data/source/config.json` maps each collection id to its name and role (`primitive`, `semantic`, `brand-alias`, `typography`, `spacing`, `radius`).
4. `python tools/build_tokens.py <folder>`.

## How a recolor stays clean
- Only Primitive values change; names never change, so every Semantic alias and every component follows.
- Each ramp keeps the curve captured from its original steps: lightness per step (OKLCH L, or M3 tone = L* for Android), chroma relative to the base, and hue offset. The base step becomes the new color.
- Derived tokens that Figma cannot alias (colors with alpha, like M3 state layers) are recomputed from their role color (`rules.json > recolor.derived_tokens`).
- Contrast pairs in `rules.json` are checked before and after; only NEW failures block the change.
