# iOS Navigation - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Buttons, Alerts and Action Sheets are Apple-kit copies: backgrounds/labels bound to remote Apple variables (`Fills/Tertiary`, `Accents/Red`, `Accents/Blue`, `Labels/Primary`, `Grays/White`), remote text styles, remote Liquid Glass instances. Only Brand Primary / On Brand Text were re-pointed to local tokens.
2. **High** - Icons are SF Symbol **text glyphs** (TEXT property `Symbol` = "􀊄") instead of Icon instances with INSTANCE_SWAP.
3. **High** - Dark mode shipped as `Mode=Light|Dark` variants (tab buttons, labels, _Buttons) and a remote collection mode on the Dark examples section, instead of Semantic variable modes.
4. **Med** - Action Sheet uses **remote** `_Buttons` instances while a local `_Buttons` set exists on the same page.
5. **Med** - Tab bar: raw white/black 50% overlay rects and blend "Tint (Plus D/L)" layers; the `Symbol` TEXT property is dead (icon is an instance); icon component named `Component 1` / `Property 1`.
6. **Med** - Navigation bar and bottom toolbar organisms live on ⭐Form Elements (➜ Toolbars & Search) instead of ⭐Navigation.
7. **Med** - Missing: segmented control, page control as a public component, link/text button atom with Trianglz tokens, sidebar (iPad), toolbar for iPad, back swipe/navigation stack guidance.
8. **Low** - No component descriptions; mixed state vocab (`Is Enabled`, `Selected`, `Is Selected`, `State`).
9. **Screenshots** - captured 2026-09-29/30 in `references/screens/` (12 PNGs). Light: alerts-action-sheets, buttons-all-variants, buttons-glass-over-light, buttons-light-examples, tab-bar-all-variants, tab-bar-light. Dark: alerts-action-sheets-dark, buttons-dark-all-variants, buttons-dark-examples, buttons-glass-over-dark, tab-bar-dark, tab-bar-dark-all-variants. Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. Dark sets were captured from a temporary page of instances with the Dark mode applied (page deleted afterwards). In iOS, fills bound to remote Apple-kit variables do not follow the local Dark mode, which is itself a gap (see above); Apple-kit sets with a `Mode` variant show their own Dark variants.

## Update 2026-10-01 (live re-study through FigCli, read-only)
10. **High** - `_Label - Symbol - Preferred / Default / Destructive Default` all contain the local `akar-icons:check` icon (an Akar icon, not SF Symbols style), so every `Button - Liquid Glass - Symbol` shows a checkmark by default and there is no icon swap property.
11. **Med** - Alert `_Buttons` Default role uses Apple `Accents/Blue`, not `Brand Primary`; Destructive label is raw `#ff383c`; Light/Dark variants differ only by raw white 60% / black 67% overlays.
12. **Med** - Tab bar `Type=Search Role` and `Type=Prominent Tab` are built identically (no visible prominent tab).
13. **Med** - `_Label - Text` disabled uses raw `#262626` at 50%; Content Area disabled uses remote `Fills/Tertiary` / `Labels/Tertiary`.
14. **Low** - No component descriptions on any Navigation set.
