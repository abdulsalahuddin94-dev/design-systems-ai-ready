# iOS Data Display - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Every component here is an Apple iOS 26 UI Kit copy bound to remote Apple variables (`Labels/*`, `Fills/*`, `Overlays/Default`, `Backgrounds/Primary - Elevated`, `Grays/Black`) and remote text styles; hundreds of texts have no style (Activity Views 199, Context Menus 136). Trianglz tokens do not drive them.
2. **High** - The key data-display components for apps are missing: list / table cell (inset grouped), card, badge, avatar, banner / toast, empty state, image thumbnail, page control, segmented control.
3. **High** - Sheets and context menus reference remote Liquid Glass and Menu components; if the Apple library is removed they break.
4. **Med** - Dark mode as `Mode` variants and remote collection modes on example sections.
5. **Med** - Glyph icons (SF Symbol characters) and raw colors (Face ID success #87fa89).
6. **Med** - Group routing: Status bar / menu bar and Face ID are system chrome (belong to Setup/Utilities); Sheets and Context Menus are overlays; only Progress fits "data display" strictly.
7. **Low** - Loose `Overlay` instance on ➜ Activity Views; Apple placeholder descriptions ("Guidelines / Feedback").
8. **Screenshots** - captured 2026-09-29 in `references/screens/` (7 PNGs: activity-views, bottom-sheets, context-menus, face-id, progress-dark-examples, progress-indicators, status-menu-bars). Method: Figma PNG export hangs on this machine, so frames were exported as SVG through the Desktop Bridge and rendered locally with headless Chrome; Liquid Glass / background blur effects do not survive SVG export. Dark captures exist only where the file has a Dark frame or section (progress-dark-examples).
