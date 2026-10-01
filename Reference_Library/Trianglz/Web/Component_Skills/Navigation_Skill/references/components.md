# Navigation - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Button
- Set `103:859` · key `84a0003e89f3359867c495872411d818109e658c` · page ➜ Buttons & links · 320 variants
- Variant name format: `Type=Filled, Size=base, Icon=Left, State=Default`
- No descriptions, no text property for the label (edit layer "Text"), no instance-swap for the icon.
- All fills, strokes, radius, padding, gap and text are bound to local variables / text styles (fully tokenized).
- Icons: local icon components `Add` (Left), `right` (Right), `upload` (Only), resized to 12/16/18/20/20 per size.

| Size | Padding (T/R/B/L) | Gap (text+icon) | Height | Text style | Icon |
|---|---|---|---|---|---|
| xs | space/2 · space/3 | space/1 | 32 | xs/Medium | 12 |
| sm | space/2 · space/3 | space/1 | 36 | sm/Medium | 16 |
| base | space/2 · space/5 | space/1 | 40 | sm/Medium | 18 |
| lg | space/3 · space/5 | space/2 | 48 | base/Medium | 20 |
| xl | space/4 · space/6 | space/2 | 56 | base/Medium | 20 |

Note: `space/5` and `space/6` shrink on iPad/Mobile modes (20 -> 16, 24 -> 18), so button padding tightens on smaller breakpoints.

| Type / State | Fill | Stroke | Text |
|---|---|---|---|
| Filled Default | btn/Primary/bg 2 | - | btn/Primary/text 2 |
| Filled Hover | btn/Primary/bg-hover 2 | - | btn/Primary/text 2 |
| Filled Focus | btn/Primary/bg-active 2 | btn/Primary/border 2, 3px | btn/Primary/text 2 |
| Pill (all) | as Filled | as Filled | as Filled; radius/3xl |
| Outline Default | none | btn/secondary/border 1px | btn/secondary/text |
| Outline Hover | btn/secondary/bg-hover | btn/secondary/border 1px | btn/secondary/text |
| Outline Focus | btn/secondary/bg-hover | border/focus 3px | btn/secondary/text |
| Link Default | none | - | text/link |
| Link Hover | btn/secondary/bg | - | text/link |
| Link Focus | none | border/focus 3px | text/link |
| Any Disabled | btn/Primary/Light | - | btn/Primary/text 2 |

Visual (screenshots): Filled = solid blue rectangle 6px corners; Focus = darker navy with a slightly lighter blue 3px edge;
Outline = white with grey border and dark-grey text, Focus adds a bright blue 3px ring; Link = blue text only, focus ring on hover
area; Disabled = very pale blue with white text for every type.

## Pagination / Item
- Set `245:24` · key `0c6d50a71f427cbe4f33fc7083643dab5b2f5e22` · page ➜ Paganation & Tabs
- Properties: `Type` (Number, Ellipsis, Prev, Next) and `State` (Default, Hover, Active, Disabled) - `Type=Ellipsis` has no State, so the variant matrix is incomplete (Figma reports property errors).

| Variant | Size | Fill | Stroke | Text |
|---|---|---|---|---|
| Number Default | 40x40 | bg/primary | border/default | sm/Medium text/primary |
| Number Hover | 40x40 | bg/secondary | border/default | text/primary |
| Number Active | 40x40 | btn/Primary/bg 2 | - | text/inverse |
| Number Disabled | 40x40 | bg/primary | border/default | text/disabled |
| Ellipsis | 40x40 | - | - | "..." sm/Regular text/secondary |
| Prev Default / Disabled | 114x40 | bg/primary | border/default | "←" sm/Regular + "Previous" sm/Medium, text/primary or text/disabled |
| Next Default / Disabled | 85x40 | bg/primary | border/default | "Next" + "→" |

All radius/md, Prev/Next padding space/4, gap space/2. Example bar `245:25`: gap space/1, the "..." there is a detached frame.

## Tabs / Item — Underline
- Set `245:54` · key `ca661f9e14723f8aabcd7bf600afd02b13c4b5f6`
- `Style=Underline` (single value) x `State=Default|Hover|Active|Disabled`; 98x36; padding space/2 · space/4
- Text sm/Medium: Default text/secondary · Hover text/primary · Active text/link + bottom stroke border/focus · Disabled text/disabled
- Bar example `245:64`: plain frames (not instances) on a bottom border/default line.

## Tabs / Item — Pill
- Set `245:63` · key `e1972b1fafb3054d95559dbb15f1e92ed5237b82`
- `Style=Pill` x `State=Default|Hover|Active|Disabled`; 98x36; radius/lg
- Default text/secondary · Hover bg/muted + text/primary · Active bg/secondary + text/link · Disabled text/disabled
- Bar example `245:75`: bg/muted track, radius/xl, padding/gap space/1, active = bg/primary (white) + text/primary. Items are plain frames.
