# Navigation - audit gaps (2026-10-06, read-only)

> **Node IDs:** none are stored here. Fix in a project copy (Fix on create), never in the original.

Checked: structure (FigCli scripts), Light screenshots of every set, text contrast computed from bound variables in Neutral Light and Neutral Dark. Per-component numbers: `../../../data/component-registry.json`.

## Dark mode (computed)
1. **High** - Raw (unbound) white fills keep menus and nav light in Dark, so Dark text on them disappears: ContextMenu (Text/Primary 1.04:1, 8 text layers), Navigation / MobileNav (28), Pagination (8). Bind the fills to `Surface/Popover` / `Core/Background Surface`.

## States and accessibility
2. **High** - Button `Focused` is a 1px `Core/Accent` stroke with no offset: on Primary (fill `Core/Accent`) the focus ring is invisible; on the others it is a 1px line (WCAG 2.4.13 wants a 2px ring at 3:1). Use our `focus-ring-offset` effect.
3. **High** - Tabs / .Tab: `state` default / selected only (no hover, focus, disabled).
4. **Med** - No Focus state on Pagination, Navigation / .TopNavItem, .SideNavItem, Breadcrumbs / BreadcrumbItem, MoreMenu (Rest, Hover, Disabled, Open). Button, Link and SegmentedControl items do have Focus.
5. **Med** - Light: `Text/Secondary` on `Background Muted` 4.20:1 inside SegmentedControl and Toolbar (12 text layers each); TopNavMegaMenu supporting text `Text/Disabled` 2.23:1.

## Structure and naming
6. **Med** - Button has 576 variants (Variant 4 x Size 3 x State 6 x Type 2 x Elevation 4). Elevation is an effect style choice, not an axis; Icon Only belongs in its own Icon Button set (our rule). Button padding and gap are raw numbers (0 of 10 bound in the first variant) although `Spacing/*` exists; 24 unbound fills.
7. **Med** - Mixed casing: Button / ToggleButton uses `size`, `isPressed`, `isIconOnly` (React prop names) with values `false` / `true`; Link uses lowercase `active, primary`; Tabs use `size`, `state`, `hasDivider`; Button uses Title Case.
8. **Med** - 26 of 40 components have no Figma description (DropdownMenu and its items, MoreMenu, Link, Breadcrumbs, Pagination parts, TopNav menus, SideNav parts, CommandPalette).
9. **Low** - 10 default layer names (`Line` dividers in DropdownMenu, `Text` in SideNavHeading); ContextMenu has a raw fill; `Action / ButtonGroup` is the only set prefixed with its page name.
10. **Low** - DropdownMenu / DropdownMenuItem uses `hasIcon` as a variant (true / false) instead of a boolean property.

## Missing compared with our Web inventory
11. **Low** - No Stepper / Wizard steps, no Bottom Navigation for mobile web, no Back link pattern.
