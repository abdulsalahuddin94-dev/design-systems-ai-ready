# Decisions - Astryx Library DS

What this reference does and why, recorded while studying it. Add a dated entry for every later resync or rule change.

## 2026-10-06 - Study (read only)
- **Source:** `Astryx Library DS` (Abdul's duplicate of the Astryx community file, v0.1.9 on the About page), opened in Figma Desktop and read with FigCli Yolo (`FIGMA_FILE="Astryx Library DS"`, `figma.root.name` and file key checked first). Nothing was written to the file.
- **Counts:** 18 variable collections (6 base + 12 theme extensions), 166 base variables (108 color x 2 modes), 14 text styles, 8 effect styles, 0 paint styles; 110 component sets with 1,988 variants + 21 standalone components on 10 component pages (plus the Icon set and 1,694 Lucide icons); 74 slot, 119 boolean, 95 text and 3 instance-swap properties; 40 of 131 components with a Figma description; 33 page templates.
- **Data:** `data/source/figma-variables.dtcg.json` (tools/export_variables.figma.js through FigCli, chunked because one eval returns at most ~20 KB), `data/source/theme-extensions.json` (theme override values, not read by build_tokens.py), `data/tokens.json` (`python tools/build_tokens.py Reference_Library/Astryx/Web`), `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`.
- **Screenshots:** every component set captured in Light (FigCli `verify`, scale 1, kept in the session scratchpad, not committed). **Dark was not screenshotted:** the file has no Dark preview frames and setting a mode is a write. Dark was checked instead by computing text contrast from the bound variables in Neutral Dark (`component-registry.json > components[].contrast_fails`). A visual Dark pass needs a project copy (or Abdul's OK to set a mode on a scratch page of the duplicate).
- **Group mapping:** Astryx organizes pages by code area (Action, Chat, Container, Content, Data Input, Feedback & Status, Layout, Navigation, Overlay, Table & List). Mapped to our three groups in `component-registry.json > meta.group_mapping`.
- **Not the default:** `references.json > default.web` stays the existing default. Astryx is offered as a second Web template.

## 2026-10-06 - Recolor readiness
- Not recolor-ready: 216 raw hex values in Semantic-role variables, no Primitives (`tokens.json > recolor_readiness`). A project started from this template builds Primitives first (OKLCH ramps like the Astryx code: stops 0-100 by 5, chroma tapered in Dark) and re-points every Color variable to them (Fix on create).

## Lessons for our workflow (what Astryx does better or differently)

Better than our current rules, worth adopting (proposals; Abdul decides before any skill or rule changes):
1. **Multi-brand with Figma extended collections.** One base `Color` collection plus one extended collection per brand (Chocolate, Butter, Stone, Y2K, Gothic, Matcha) that overrides only what changes (90 colors, 6 radii, 3 font families). Components never change; a frame switches brand by mode. Our rules have no multi-brand mechanism; this fits on top of Primitives + Semantics without a Component Specific tier.
2. **Slots instead of variant matrices.** 74 native slot properties: Toolbar dropped a 48-variant matrix for Start / Center / End slots; Card, Dialog, Popover, List items, TopNav, SideNav and CommandPalette all take content through slots gated by `Has X` booleans. Our Main Skill mentions slots only for a few organisms; make "content area = slot" the default.
3. **A Size collection for control heights** (`Element/Small 28, Medium 32, Large 36`) bound to Button and input heights keeps every control on the same three heights. We have no height tokens.
4. **Role-named radius** (`Inner`, `Element`, `Container`, `Page`, `Full`) tells an agent which radius a new component should use. We could add role aliases over our t-shirt radius scale.
5. **One shared input anatomy and state axis:** every input uses the same Field (label + indicator, description, status message) and the same 8 states, including Warning and Loading, and 3 sizes. Our inputs require Success but not Warning / Loading.
6. **One row primitive (`Item`)** behind List, MetadataList and menus: Marker, Start Content, Label + Description, End Content, Density. Fewer one-off row components.
7. **Internal parts named with a leading `.`** (`Tabs / .Tab`, `.SideNavItem`): they are hidden from publishing and clearly not for direct use, which matches our atomic tiers (parts built first, organisms expose them).
8. **Descriptions written for agents:** the best Astryx descriptions list anatomy, variant axes, token names and the code path ("Maps to packages/core/src/Slider"). Add a `Code:` line (component path) and token names to our Purpose / Usage Rules / Accessibility template. (Per the brief, the Astryx code docs also carry keywords, anatomy and per-state accessibility rows; not verified here, but they would map well to our registry `docs` block.)
9. **Code is the source, an agent keeps Figma in sync** ("Night Watch": reads each release, classifies Figma impact, updates the library). Same direction as our Scenario D and Storybook sync; a release-driven changelog per component is worth copying into our CHANGELOG flow.
10. **AI product coverage:** a complete chat kit (composer with token elements, drawer, dictation and send/stop buttons, message bubble, metadata with delivery states, system messages, tool calls with pending / running / success / error, scroll button) plus PowerSearch, CommandPalette, TreeList and MetadataList. Our Web inventory has none of these.
11. **Templates page:** 33 page templates built only from library instances, each with the Color mode set explicitly, grouped by use (Table, Form, Settings, Login, Tools, Content, AI Chat, Gallery, Shell).

Different, and worse than our rules (do not copy; fix on create):
12. No Primitive tier, ALL_SCOPES on every color, no variable descriptions or code syntax.
13. Component-specific color tokens (Badge, ProgressBar, Input Ring) with status colors that differ from the Status tokens.
14. Dark mode broken by raw white fills on 10 components (SelectableCard, Dialog, Popover, HoverCard, List, Section, Toast, ContextMenu, MobileNav, Pagination).
15. Low-contrast tokens: control border 1.48:1, placeholder-as-disabled 2.5:1, secondary text on muted 4.2:1; Button focus invisible on Primary.
16. Variant bloat (Button 576 with an Elevation axis, MultiSelector 192), two sets both named `Avatar`, React prop names as Figma properties (`isPressed`, `hasSearch`), mixed value casing.
17. Text styles bind size and line height only; theme fonts are CSS stacks that Figma cannot bind, so themes do not change text in Figma.
