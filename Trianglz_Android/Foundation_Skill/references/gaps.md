# Android foundation audit gaps (2026-09-29, read-only study - nothing fixed)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Variables
1. **High** - No **spacing** collection at all; every padding/gap in 338 components is a raw number.
2. **High** - No local typography variables (size, line height, tracking, weight). Title/label/body styles bind **remote** M3 kit `Static/<Role>/Size|Line Height|Tracking`; display/headline sizes are raw.
3. **High** - Scopes: `Palettes` (primitives) and nearly all `m3` roles use **ALL_SCOPES**, so raw tones and state layers show in every picker (text, stroke, gap...).
4. **High** - No code syntax (Android / Compose names like `MaterialTheme.colorScheme.primary`) on any variable.
5. **High** - **State Layers are raw RGBA**, not aliases of their scheme role + opacity. Several are stale vs the Trianglz scheme (e.g. `State Layers/Primary/*` = #002049 (RN-20) while Primary is RN-40 #193b6e; `Surface/*` = Google baseline #fcf8f9; `On Neutral Container/Opacity-16` Dark = #89a6e0, a blue). Changing a palette won't update them.
6. **Med** - Scheme values deviate from M3 tone rules: Dark `Surface` = N-0 pure black (M3 = tone 6), Surface Container Dark tiers N-0..N-40 (M3 = 4, 10, 12, 17, 22), On Primary Container Light = RN-30 (M3 = tone 10). Palettes are hand-picked, not HCT-generated (tone steps uneven, e.g. N-30 vs N-40 nearly equal).
7. **Med** - Naming: `Schemes/Surface/Surface Variant??` (question marks, deprecated role), `Schemes/Success/Sucess Container` typo, `Background (Deprecated)` still present and its Dark value is a **remote** alias.
8. **Med** - No contrast modes (Medium / High contrast) and no dynamic color strategy documented.
9. **Low** - Almost no descriptions; `Font` collection single var with ALL_SCOPES; Palettes not hidden from publishing.

## Styles
10. **High** - Components use **remote `M3/*` text styles** (e.g. `M3/body/large` 186 uses, `M3/label/medium`, `M3/body/medium`) and some remote `M3/Elevation Light/3` effect styles alongside the local ones with the same names.
11. **Med** - Typescale deviates from M3: display 56/48/40 (M3 57/45/36), title/large 20 (22), label/small 10 (11); tracking 0 everywhere (M3 0.1-0.5); emphasized = SemiBold (M3 Expressive uses Medium for body/label emphasized).
12. **Med** - Elevation Light and Dark styles have identical values (only layer order differs) - one set is enough; shadow colors raw (not `Schemes/Shadow`).
13. **Low** - Paint styles `add-on/*` are utilities; fine but name them `Utility/*`.

## Shape
14. **Med** - `Shape` collection exists but most component radii are raw (e.g. Buttons 34 bound / 74 raw sampled; FAB binds **remote** `Corner/Extra-large`). Corner Radius doc swatches unbound.

## Documentation
15. **Med** - Typography page: 30 of 405 texts use local styles (labels on remote styles). Elevation Dark frame on a remote collection mode. No dark previews on any component page.
16. **Low** - ➜ Research page is a large working board (12800x11700) inside the DS file; page names with double spaces (`➜  Corner Radius`, `➜  Elevation`, `➜  Icons`, `➜  Layout`) and `⭐Navigation ` trailing space.

## Icons
17. **High** - 141 local Material Symbols exist (fill bound to On Surface), but components instance the **remote M3 kit icons** (`stars`, `stars_filled`, `check_small`, `check`, `arrow_drop_down`...). Duplicated names without `_filled` suffix (two `check_box`, `mail`, `share`, `edit`, `delete`, `settings`, `alarm`, `mic`, `inbox`, `archive`...).

## Screenshots
18. Figma image export hung during this study (all `exportAsync` calls timed out in both files). No screenshots were captured for Android; re-run the capture pass after restarting the Desktop Bridge plugin (light + dark of every variant).
