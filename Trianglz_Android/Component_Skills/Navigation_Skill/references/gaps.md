# Android Navigation - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Icons inside buttons, nav items, app bars are **remote M3 kit icons** (`stars`, `stars_filled`) and leading icon buttons are remote `Icon button - standard` instances, although local sets exist on the same page / ➜ Icons.
2. **High** - Paddings raw everywhere (no spacing tokens); most radii raw; FAB binds a **remote** `Corner/Extra-large` variable.
3. **Med** - Menus page: 159 remote fills and 103 remote text styles (baseline menu parts).
4. **Med** - Duplicated generations: Segmented button (baseline) next to Connected button group; Menu (baseline) and baseline list items; Bottom app bar next to Toolbar. Mark baseline as deprecated with a description ("use Connected button group").
5. **Med** - Naming: `Button - outline` State `Presssed`; Size option order differs between sets (tonal/standard list Large first); `Xlarge` vs `XLarge` in connected segments; no descriptions on standard/outline/tonal icon button sets.
6. **Med** - Navigation Bar: Horizontal items sample is 741 wide with 160 side padding (tablet); no compact 360/412 phone example as the default variant. No navigation drawer (M3 Expressive replaces it with expanded rail - document this).
7. **Low** - Variant counts are large (Icon button togglable 300 x 4 sets); fine for M3 parity but heavy - consider Size as a separate set per use.
8. **Screenshots** - not captured (Figma export hung). Capture each button family (Size x State, Round/Square), FABs, groups, app bar configurations, nav bar/rail, tabs, menus, toolbar in Light + Dark.
