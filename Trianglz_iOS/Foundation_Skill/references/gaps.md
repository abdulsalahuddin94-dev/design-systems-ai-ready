# iOS foundation audit gaps (2026-09-29, read-only study - nothing fixed)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

Severity: High = breaks tokens/AI use, Med = inconsistency, Low = cleanup.

## Variables
1. **High** - No code syntax on any variable (no iOS `Color("textPrimary")` / SwiftUI names), so Dev Mode and MCP give developers nothing to map.
2. **High** - Components copied from the Apple iOS 26 UI Kit bind **30 remote Apple variables** (top: `Labels/Primary` 2690 fills, `Labels/Secondary` 469, `Labels - Vibrant/*`, `Labels - Vibrant - Controls/*`, `Fills/Tertiary`, `Accents/Red`, `Accents/Blue`, `Backgrounds/Primary`, `Separators/Vibrant`, `Overlays/Default`, `Grays/*`, `Miscellaneous/*`). Changing Trianglz tokens does not restyle them, and they break if the Apple library is unlinked.
3. **High** - Semantic set lacks Apple roles those components need: separator (opaque/non-opaque), fills (systemFill 1-4), grouped backgrounds 1-3, elevated backgrounds, quaternary label, overlay/scrim (no alpha primitives at all), vibrant labels for materials.
4. **High** - Text styles bind **letter spacing to a remote variable** (19 of 22); there are no local tracking variables. `Title1/Emphasized` has no font-family binding. No Dynamic Type modes.
5. **Med** - `Color / Primitive` has Light and Dark modes with identical values (a primitive collection should have one mode). `Color / Brand` also has identical modes and ALL_SCOPES.
6. **Med** - Naming: `spacnig/` typo; collection `Raduis` typo; collection `Typography ` trailing space; `Primary Blue  200..900` double space; `Brand  secondary` double space and lowercase; mixed `Md/Lg` vs `XS/XL`; status tokens repeat the group (`Status/Info/info Text`, lowercase `info`).
7. **Med** - Spacing scope is GAP only but components bind padding; Input binds **corner radius to a spacing variable** (`spacnig/sm`) instead of `Raduis/Md`.
8. **Med** - `Borders/*` and `Icon/*` scopes include FRAME_FILL + SHAPE_FILL, so borders appear in fill pickers.
9. **Med** - Brand Primary = Tailwind blue 500 (#3b82f6) while Apple systemBlue (#007aff) is also in the palette; decide one tint and document it. `Borders/Focus` = Primary Blue 400 on white is ~2.5:1 (below 3:1 for focus indicators).
10. **Low** - No descriptions on Typography, Spacing, Radius, Primitive, Brand variables.
11. **Low** - Primitives not hidden from publishing (only scopes hide them).

## Styles
12. **High** - No effect styles: Liquid Glass, blur and shadows are raw effects inside components (Toggle knob, Tab bar, Alerts, Context menu, Face ID).
13. **Med** - `Headline/Regular` is Semibold (same as Emphasized) - fine per HIG, but name it `Headline` only or document it.
14. **Med** - Only one grid style (iPhone portrait 4 col). No iPad, landscape or regular-width grids.
15. **Low** - Remote text styles used in components: `Body/Regular` (235), `Subheadline/Regular` (288), `Caption2/Regular`, `Caption / Medium`, `Large Title/Emphasized`, `Headline/Regular`, `Body/Emphasized` from the Apple kit (same names as the local ones - easy to confuse).

## Documentation pages
16. **High** - Color docs are mostly static: Primitive page 86 of 370 swatch fills bound locally (284 remote/raw), Semantic page 69 of 229 bound; no mode-switched Light/Dark swatch frames (Light/Dark shown as hex text columns).
17. **High** - Typography page: only 11 of 76 text nodes use a text style; samples are not linked.
18. **Med** - Spacing and Radius pages are static text and disagree with the variables (`xxl` 48 vs 40; `Full` 999 vs 99; docs say `spacing/` while variables say `spacnig/`).
19. **Med** - `Icon/*` semantic tokens are not documented on ↳ Semantic Colors; Brand page frames use a remote collection mode.
20. **Low** - Frames misnamed: "Typography" on Spacing and Radius pages, "Text Fields" on Checkbox and Radio pages, "Borders" for the Status table; page names have leading/trailing/double spaces (` ➜ Colors System`, `➜  Keyboards`, `➜  Buttons`, `⭐Navigation `).

## Icons
21. **High** - Almost no icon library: `Component 1` (generic name, `Property 1`), `Search Icon`, `akar-icons:check` (Akar, not SF Symbols style), `View Icon`. Apple-kit components render SF Symbols as **text glyphs** (private-use Unicode in SF Pro) instead of Icon instances with swap properties; the glyphs only render with SF Pro installed.

## Screenshots
22. **Screenshots** - captured 2026-09-29 in `references/screens/` (24 PNGs: app-icon-1024, brand-colors, colors-overview, icons, keyboards, layout-grid, primitive-blue, primitive-brand-palette, primitive-green, primitive-neutrals, primitive-neutrals-intro, primitive-orange, primitive-purple, primitive-red, primitive-yellow, radius, semantic-backgrounds, semantic-borders, semantic-overview, semantic-status, semantic-text, spacing, typography, typography-header). Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. The file has no Dark preview frames for these components, so only Light was captured.
