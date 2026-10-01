# Android Form Elements - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Remote M3 kit leftovers: Search (157 remote fills, 132 remote text styles), Sliders (125 remote fills), Date pickers (132 remote fills, 223 remote text styles); icons in Checkbox/Text field are remote kit components (`check_small`, `Icon button - standard`).
2. **High** - All paddings/gaps raw (no spacing variables); radii mostly raw (text field 4, checkbox 2/100) instead of `Shape` tokens.
3. **Med** - Text field focus stroke 3dp (M3: 2dp outlined focus); no exposed Dropdown / Exposed dropdown menu component (text field + menu); no text area (multi-line) variant; no prefix/suffix, counter.
4. **Med** - Naming slips: calendar cell State `Hovere`, section `Time PIcker`, `Toggle` section on the Switch page holding only a header; loose state label texts on ➜ Radio and ➜ Switch pages outside frames.
5. **Med** - Baseline (older M3) search layouts kept next to the new ones - mark deprecated or move to an archive page.
6. **Med** - Group routing: Loading & progress indicators display status (Data display by the routing rule); keep here only if the team agrees.
7. **Low** - No dark previews on these pages.
8. **Screenshots** - captured 2026-09-29/30 in `references/screens/` (18 PNGs). Light: checkbox-all-variants, date-pickers, loading-indicators, progress-indicators, radio-all-variants, search, sliders-all-variants, switch-all-variants, text-fields-all-variants, time-pickers. Dark: checkbox-dark, date-time-pickers-dark, loading-progress-dark, radio-dark, search-dark, sliders-dark, switch-dark, text-fields-dark. Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. Dark sets were captured from a temporary page of instances with the Dark mode applied (page deleted afterwards).

## Update 2026-10-01 (live re-study through FigCli, read-only)
10. **Med** - Switch unselected track uses `Surface Container` (M3: Surface Container Highest); on Dark it nearly disappears into Surface Container surfaces.
11. **Med** - Filled text field indicator is 3dp on focus and error (M3: 2dp); Outlined focus stroke 3dp (M3: 2dp).
12. **Med** - Range slider `Value` options are `-50/0/+50` (copied from Centered); it nests a remote `.Building Blocks/Track dot`.
13. **Med** - Calendar cell dates use remote `M3/body/large`; docked date picker Month/Year lists nest remote `List (baseline)`; search layouts nest remote `List item` with remote `Corner/Extra-small` radius; `Search bar` with avatar nests remote `Generic avatar` (local exists).
14. **Low** - Radio uses remote `radio_button_checked/unchecked` icons; local Material Symbols set has no radio icons, so add them before swapping.
15. Dark screenshots: every public set has one (see 8). Shapes, XR and baseline sets have Light only; new Dark captures need a duplicate file (a temporary Dark page is a write).
