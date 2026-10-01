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
9. **Screenshots** - captured 2026-09-29/30 in `references/screens/` (29 PNGs). Light: avatars, badges, bottom-sheets, cards, carousel, chip-assistive, chip-filter, chip-input, chip-suggestion, dialogs, dividers, list-items-baseline, lists, shapes, side-sheets, snackbars, tooltips, xr-dialogs. Dark: avatars-dark, badges-dark, cards-dark, carousel-dark, chips-dark, dialogs-dark, dividers-dark, lists-dark, sheets-dark, snackbars-dark, tooltips-dark. Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. Dark sets were captured from a temporary page of instances with the Dark mode applied (page deleted afterwards).

## Update 2026-10-01 (live re-study through FigCli, read-only)
10. **Correction** - The Snackbar property is named `# of lines` (One line / Two lines), not empty; the earlier read split the name on `#`.
11. **High** - Cards: all texts use remote `M3/title/medium`, `M3/body/medium`, `M3/body/large`; header avatar is remote `Generic avatar`; Slot layout nests remote `Shared Building Blocks/Slot-component`; Elevated background uses remote `M3/Elevation Light/1`.
12. **Med** - Badge label uses remote `M3/label/small`; Plain tooltip Multi line uses remote `M3/body/small` (Single line is local); Avatar Monogram initial has **no text style**; Avatar Check uses remote `Icons/check_24px`.
13. **Med** - Lists and list items bind remote `Corner/Extra-small|Medium|Large`; List item Hovered root radius is raw 4.
14. **Med** - Bottom sheet (non-modal) uses remote `M3/Elevation Light/3`; Side sheet Modal radius 16 raw; sheets nest remote `Icon button - standard` and dividers.
15. **Med** - Carousel items are remote `Building blocks/General item` and `Building blocks/Multi-ratio items/*` with remote `Corner/Extra-large`.
16. **Low** - No descriptions on `Generic avatar`, `Chip groups`, `Horizontal`, `Vertical`, `List`, `List item`, `List item - Accordion `, `List Item - Swipe`, `Shape Set`.
