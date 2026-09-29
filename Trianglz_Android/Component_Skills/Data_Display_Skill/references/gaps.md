# Android Data Display - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Dialogs (238 remote fills, 216 remote text styles), Lists (109 / 130), Snackbar (remote Inverse Surface, remote `M3/body/medium`, remote `M3/Elevation Light/3`) still point to the M3 kit library although local equivalents with the same names exist.
2. **High** - Remote kit components nested: dialog actions (`Button - text`), divider (`Horizontal/Full-width`), chip icons (`check`, `arrow_drop_down`).
3. **Med** - Raw paddings everywhere; radii raw (avatar 100, cards 12, dialog 28) except Carousel.
4. **Med** - Chips: 31 raw fills sampled; Input chip `Show closing icon` values lowercase `false/true`.
5. **Med** - Naming: Divider and Full Lists use `Property 1`; Snackbar has an **empty property name** for line count; `List item - Accordion ` trailing space; `Accordion buttton` typo.
6. **Med** - Missing: full-screen dialog, navigation drawer (if needed for legacy), date/time in lists, image list/grid, empty state, banner (M3 has no banner but many apps need inline alerts), data table.
7. **Med** - Baseline list items (197-238 variants each) coexist with the expressive List item - mark deprecated.
8. **Low** - Shapes (expressive shape set) is decorative foundation; consider moving to ⭐Setup.
9. **Screenshots** - captured 2026-09-29 in `references/screens/` (18 PNGs: avatars, badges, bottom-sheets, cards, carousel, chip-assistive, chip-filter, chip-input, chip-suggestion, dialogs, dividers, list-items-baseline, lists, shapes, side-sheets, snackbars, tooltips, xr-dialogs). Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. The file has no Dark preview frames for these components, so only Light was captured.
