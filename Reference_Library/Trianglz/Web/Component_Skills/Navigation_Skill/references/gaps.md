# Navigation - audit gaps (2026-09-29, read-only, structure + screenshots)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Status after fixes (2026-09-29)
**Fixed:** 1 (disabled keeps type at 50%), 2 (Type=Danger added), 3 (focus-ring-offset on every type), 8 (description), 9 (Ellipsis state), 10 (arrow icons), 17 partially (Breadcrumb added).
**Still open:** 4 (pressed/loading), 5-6 (label not a text prop, icon not instance-swap, 400 variants), 7, 11 (pagination hover/focus), 12 and 14 (bars not components), 13 (Pill tab active mismatch), 15, 16, top bar / sidebar / menu button.

## Button
1. **High** - Disabled uses the same pale fill (`btn/Primary/Light` blue-100) with white text for all four types. White on blue-100 is about 1.3:1 (unreadable), and Outline/Link change shape when disabled. Use the type's own style at 50% opacity, or disabled text/bg tokens.
2. **High** - Only one color intent (primary). No danger/destructive, success or neutral buttons, although `btn/danger|success|warning|Info|Neutral/*` tokens exist and are unused here.
3. **High** - Focus on Filled/Pill is a 3px border in the same blue family as the fill (blue-600 on blue-800): barely visible. Outline/Link correctly use `border/focus`. Use one focus ring (2-3px `border/focus` with offset) for all.
4. **Med** - No Pressed/Active state (Focus reuses the `bg-active` color); no Loading state.
5. **Med** - No component properties besides variants: label is not a TEXT property and icons are not instance-swap properties, so every change needs layer editing. The Icon variant (None/Left/Right/Only) could be two booleans + a swap.
6. **Med** - 320 variants make the set heavy; Pill differs from Filled only by radius (could be a boolean `Rounded`).
7. **Med** - Icon-only buttons are not square (58x40 at base) and have no tooltip guidance.
8. **Low** - No description on the set; size names lowercase while other values are Title Case; the "Architecture" diagram at the top of the page is not a component.

## Pagination
9. **High** - `Type=Ellipsis` has no `State` value, so the set has property errors and `componentPropertyDefinitions` can't be read by tools.
10. **Med** - Prev/Next arrows are text glyphs (← →) instead of the local `Arrow Left`/`Arrow Right` icons.
11. **Med** - No hover state for Prev/Next; no focus states anywhere; no compact (icon-only) or mobile variant.
12. **Low** - No Pagination bar component (only an example frame with a detached ellipsis).

## Tabs
13. **High** - Pill tab `Active` variant (bg/secondary + blue text) doesn't match the Pill bar example (white tab + dark text). Pick one.
14. **Med** - Tab bars are example frames built from plain frames, not instances of the item components, and not components themselves.
15. **Med** - No focus state; no icon or count/badge slot; no size variants.
16. **Low** - `Style` is a single-value variant property on each set (two sets could be one set with `Style=Underline|Pill`). Page name typo "Paganation".

## Missing navigation components
17. **Med** - No breadcrumb, top navigation bar / header, sidebar, dropdown menu, stepper, or standalone text link component.
