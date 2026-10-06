# Data Display - audit gaps (2026-10-06, read-only)

> **Node IDs:** none are stored here. Fix in a project copy (Fix on create), never in the original.

Checked: structure (FigCli scripts), Light screenshots of every set, text contrast computed from bound variables in Neutral Light and Neutral Dark. Per-component numbers: `../../../data/component-registry.json`.

## Dark mode (computed)
1. **High** - Raw (unbound) light fills stay light in Neutral Dark while text switches to light colors: SelectableCard (32 text layers, 24 raw fills), Dialog (12 raw fills; footer text 1.04:1), Popover, HoverCard, List (header), Layout / Section, Toast (4 raw fills). Bind every surface to `Surface/Card`, `Surface/Popover` or `Core/Background Surface`.
2. **Med** - ClickableCard Hover reads 1.1:1 in both modes in the computed check (the hover tint layer is `Effects/Tint Hover` at full alpha with layer opacity); confirm visually before copying the hover treatment.

## Accessibility (Light)
3. **Med** - CodeBlock and Markdown line numbers `Text/Disabled` 2.2:1; CodeBlock title `Text/Secondary` on `Background Muted` 4.20:1.
4. **Med** - Badge Error (white on `#E33F4A`) 4.14:1; Neutral dot `#E5E5E5` 1.26:1 on white.
5. **Low** - Text over media (Overlay, Lightbox caption, AspectRatio labels, Spinner on media) depends on the image; the scrim variants exist, `Scrim = none` with white text does not pass on light images.

## Structure and naming
6. **High** - Two sets named `Avatar` on the Content page: a legacy set (Size Tiny..Large x Content x Status = 60, no Auto Layout, 45 default `Ellipse` names, 20 text layers without a style) and a newer set (Size xsm..xl x Content = 15, `Status` boolean). Keep the newer one; remove or rename the legacy one.
7. **Med** - Overlay has a slot named `DATA-UNSPLASH-@manrason-Nature` (an image credit used as a property name).
8. **Med** - 41 of 58 components have no Figma description (Dialog, Toast, Avatar, Token, Thumbnail, Collapsible, SelectableCard, List parts, MetadataList, TreeList, table cells...).
9. **Med** - Skeleton `Radius` values `none, 0, 1, 2, 3, 4, rounded` do not match the Radius variables (None, Inner, Element, Container, Page, Full).
10. **Low** - 65 frames without Auto Layout on the Content page (legacy Avatar), 16 in Spinner, 12 in Divider (`Line` layers); mixed casing (`sender`, `variant`, `status`, `density`, `header`, `lineNumbers` next to Title Case).

## Missing compared with our Web inventory
11. **Med** - Toast has only `default` / `error` (no success, warning, info, no action or close properties); Tooltip has no arrow placement or size variants.
12. **Med** - No Table organism (only cells; tables live in Templates as examples), no Accordion group (single Collapsible only), no Stat / KPI tile, no Chart components, no Alert Dialog / confirmation variant of Dialog.
