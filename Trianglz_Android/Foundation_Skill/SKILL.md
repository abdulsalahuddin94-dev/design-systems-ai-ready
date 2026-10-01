---
name: trianglz-android-foundation
description: Use before building, extending, auditing or coding anything with the Trianglz Android Material 3 Design System (Figma file JUs2c8IO6ybFcGRZjcQzr9, "Trianglz - Android M3 x Design System"). Defines the ⭐Setup foundations - m3 color schemes (md.sys.color) on tonal Palettes, state layers, surfaces, Google Sans Flex type scale, Shape corner scale, M3 elevation styles, window-size-class grids, Material Symbols icons and utilities - plus file structure, build order, M3 naming and the rules for new tokens and components. Android only; independent from the Web and iOS skills. Load it with any Trianglz_Android Component_Skills.
---

# Trianglz Android M3 DS - Foundation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../data/component-registry.json`, `../data/rules.json`, `../data/screen-templates.json`, and `../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

Source: ⭐Setup pages of `Trianglz - Android M3 x Design System`, read through the Figma Desktop Bridge on 2026-09-29 (read-only study, nothing was changed).
Platform: **Android, Material Design 3 (M3 Expressive, 2025 kit), dp / sp**. The file is built on Google's Material 3 Design Kit re-themed with Trianglz palettes.

Reference files:
- `references/variables.md` - every collection, scheme role, palette tone, text/effect/grid style.
- `references/gaps.md` - foundation audit.
- `references/screens/*.png` - screenshots of every Setup documentation section (SVG export rendered to PNG).

Component skills: `Component_Skills/Form_Elements_Skill`, `Component_Skills/Navigation_Skill`, `Component_Skills/Data_Display_Skill`.

---

## Update 2026-10-01 (live re-study through FigCli, read-only - overrides older details below)

Every variable, style and component set was re-read from the open file with read-only scripts; each public set's states were traced layer by layer (fills, strokes, state layers, opacity, text and effect styles, radius bindings, nested instances), and the Light/Dark screenshots in the component skills were re-checked against them. Per-group results: `Component_Skills/*/references/inventory.md` (every set and property) and `references/states.md` (what each state looks like and which token draws it).

Confirmed: 4 collections (`m3` 235 Light/Dark, `Palettes` 118, `Font` 1, `Shape` 10), 0 code syntax, 4 descriptions, all `m3` and `Palettes` variables ALL_SCOPES (Shape = CORNER_RADIUS); 30 text styles, 10 effect styles, 11 grid styles, 2 paint styles; 197 non-icon component sets/components + 141 icons. Scheme aliases in `references/variables.md` are correct.

Corrections:
- `Surfaces/Surface Tint 5..14%` are **raw** colors, not aliases: Light #193b6e (= RN-40), Dark **#abc7ff** (Google baseline, not RN-80 #9bb9f4).
- State layers Dark values are Google baseline colors too (e.g. `State Layers/Primary/*` Dark #abc7ff, `On Surface/*` Dark #e5e2e2 vs scheme N-90 #eaecf0). Light `Primary/*` = #002049. Trianglz brand changes never reach them.
- Text styles: title/large binds only remote letter spacing; title/medium, title/small, label/large, label/medium and all body styles bind remote font size + line height; label/small binds remote line height only; display/headline bind only `Font-family`.
- Elevation effects use raw black 30% / 15% (not bound to `Schemes/Shadow`); Light and Dark sets are identical apart from layer order.

The M3 recipe as this file draws it (verified on every public set):
| State | How it is drawn |
|---|---|
| Enabled | container role + its On- role for content |
| Hovered | `State-layer` frame filled `State Layers/<content role>/Opacity-08` |
| Focused | same layer at `Opacity-10`; the 3dp ring is a separate `Show focus indicator` boolean (off by default) |
| Pressed | layer `Opacity-08` + a `Ripple` vector at `Opacity-10`; Round buttons **morph** their container radius from Full to 8 (Small) - M3 Expressive shape morph |
| Dragged | layer `Opacity-16` (cards, chips, list items) |
| Disabled | two recipes exist: (a) container `State Layers/On Surface/Opacity-10` + `State-layer` frame at 38% opacity (filled, tonal, outline buttons, chips, switch); (b) whole component or content at 38% opacity (checkbox, radio, slider handle, list item content, menu leading/trailing). Text field: overlay On Surface 4% + field 38% |
| Selected | stronger container (Primary, Secondary, Inverse Surface, Secondary Container or Tertiary Container) and, for toggles, a squarer radius (12) |

Remote dependencies still inside public components (the file is not self-contained): icons (`stars`, `stars_filled`, `check_small`, `radio_button_checked`, `check`, `close`, `arrow_drop_down`, `keyboard_arrow_down/up`, `local_taxi`, `mobile_check`...), `Icon button - standard` (text field, search, app bar, dialogs, pickers, sheets, rail), `Button - text` (dialog and picker actions), `Generic avatar` (cards, search), `List item` and `List (baseline)` (search, list dialogs, docked date picker), `Horizontal/Full-width` divider (tabs, sheets), `Shared Building Blocks/Slot-component` (cards), Bottom app bar's `<Deprecated> Icon button` / `<Deprecated> FAB`, remote `Corner/*` radius variables (FAB, menu, list, carousel) and remote `M3/*` text and elevation styles (cards, snackbar, badge, elevated buttons/chips, menus, bottom sheet). In a project copy, swap each for the local twin with the same name before use.

Screens: the component screenshots (Light + Dark for every public set except Shapes, XR and baseline sets) are in each component skill's `references/screens/`. FigCli renders only the file as it is (the Dark captures from 2026-09-30 needed a temporary page with the Dark mode, which is a write); with fixes paused, new Dark captures wait until a duplicate exists.

---

## 0. File structure (exact page order)

| # | Page (exact name) | Content |
|---|---|---|
| 1 | Cover | `Thumbnail`, `Plugin / file cover - 1` |
| 2 | `-` | separator |
| 3 | **⭐Setup** | group header |
| 4 | ➜ Research | section "Research by Salma" (12800x11700): screenshots, State Layers Colors, Questions, In-Depth Research, notes |
| 5 | ➜ Color Palette | sections `Color Palette` (material-theme schematic: schemes Light/Dark) and `Colors` (tonal palettes 0-100 per hue) |
| 6 | `➜  Corner Radius` (double space) | `Corner Radius` (10 shape groups) + `Note` (image) |
| 7 | `➜  Elevation` | `Elevation` (Light frame + Dark frame on a remote mode) + `Note` "Why & how to use different elevations?" |
| 8 | `➜  Icons` | `Icons` section: 141 Material Symbols components (24dp) |
| 9 | `➜  Layout` | `Layout Breakpoints` (5 window size classes + `Examples/Layout grid` set) + `Example Layouts` (Home, Upcoming, Detailed view, Reviews, Library, Gallery, Messaging mobile; Gallery / Home web) |
| 10 | ➜ Typography | `Typography` section with `typescale` group |
| 11 | ➜ Utilities | status-bar, navigation (gesture bar), Keyboard (12), Scrim, Focus indicator, Device frame, Slot-component |
| 12 | `-` | separator |
| 13 | **⭐Form Elements** | ➜ Date & Time Pickers, ➜ Checkbox, ➜ Radio, ➜ Search, ➜ Switch, ➜ Text Fields, ➜ Loading & progress, ➜ Sliders |
| 22 | `------------------` | separator |
| 23 | **`⭐Navigation `** (trailing space) | ➜ Buttons, ➜ App Bar, ➜ Menu, ➜ Navigation, ➜ Toolbar, ➜ Tabs |
| 30 | `-----------------------` | separator |
| 31 | **⭐Data display** | ➜ Cards, ➜ Dialogs, ➜ Avatars, ➜ Badges, ➜ Carousel, ➜ Chips, ➜ Dividers, ➜ Lists, ➜ Shapes, ➜ Sheets, ➜ Snackbar, ➜ Tooltips |

Page layout convention: each ➜ page holds one or more **Sections** named after the component family, containing a `Header` instance (M3 kit header), the component sets, a `Building Blocks` frame for private parts (names start with `.Building Blocks/` or `Building Blocks/`), optional `Baseline` sections (older M3 baseline versions) and `... for XR` sections (Android XR variants), plus `Note` sections. **No dark preview frames** on component pages.

Differences from Web/iOS: Setup includes Research, Utilities and Layout example screens; no Spacing page (no spacing tokens); Shapes (expressive shape set) sits in Data display; private building blocks live on the same page as the public set.

## 0b. Build order (Abdul's rule, applies to every Android project)

1. **Primitives** = tonal `Palettes` (tones 0-100 per key color), 1 mode.
2. **Semantic** = `m3` Schemes (md.sys.color roles) aliased to Palettes, Light / Dark (add Medium/High contrast modes when needed); **state layers** as aliases + opacity.
3. **Spacing (to add), Shape (corner scale), Typography** (md.sys.typescale size/line-height/tracking/weight) variables.
4. **Text styles** (bound to Typography variables) and **effect styles** (Elevation 1-5), grid styles per window size class.
5. **Icons** (Material Symbols, atoms), then components **Atoms -> Molecules -> Organisms -> Patterns**, only from the variables and styles above.
6. **Audit** (audit-design-system), then update these skills and gaps.

## 1. Architecture at a glance

```
Palettes (Regal Navy, Orange, Purple, Red, Yellow, Green, Blue, Neutral, Neutral Variant; tones 0-100)
   └─ m3 / Schemes (Primary, Secondary, Tertiary, Error, Warning, Success, Info, Neutral, Surface, Surface Container,
                    On Surface, Outline, Inverse, Fixed, Shadow, Scrim)  Light / Dark  ─> components
   m3 / State Layers (<role>/Opacity-08|10|16, raw RGBA)                 ─> hover / focus / pressed overlays
   m3 / Surfaces (Surface Tint 5-14%)                                    ─> legacy tonal elevation
Font (Google Sans Flex) ─> 30 text styles (display, headline, title, label, body x regular/emphasized)
Shape (Corner None..Full)                                               ─> corner radius
Effect styles Elevation Light|Dark /1..5; grid styles per window size class
Icons: 141 Material Symbols (Rounded/Outlined 24dp), fill bound to Schemes/On Surface
```

Health: colors are **well tokenized** (most component fills bind local `m3` schemes; Color pages ~97% linked). Weak spots: no spacing variables (all padding raw), most radii raw (Shape collection underused), components still use **remote M3 kit icons and remote `M3/*` text styles**, and some scheme bindings point to the remote M3 kit variables with the same names. See gaps.md.

## 2. Color (md.sys.color)

Naming: `Schemes/<Group>/<Role>` in Title Case, mirroring md.sys.color (`Schemes/Primary/On Primary Container` = `md.sys.color.on-primary-container`).

| Need | Token | Light / Dark tone |
|---|---|---|
| Key action fill (filled button, FAB primary, selected control) | Schemes/Primary/Primary + On Primary | RN-40 / RN-80 |
| Lower-emphasis fill (tonal button, selected nav pill uses Secondary Container) | Primary Container / Secondary Container + On ... Container | 90 / 30 |
| Accent (brand orange) | Schemes/Secondary/* | O-40 / O-80 |
| Contrast accent | Schemes/Tertiary/* | P-40 / P-80 |
| Errors | Schemes/Error/* | R-40 / R-80 |
| Status (custom roles) | Schemes/Warning/*, Success/*, Info/* | 40 / 80 |
| Screen background | Schemes/Surface/Surface | N-100 / N-0 |
| Cards, sheets, dialogs, menus, nav bar | Schemes/Surface Container/{Lowest, Low, Container, High, Highest} | N-100..N-80 / N-0..N-40 |
| Main text & icons | Schemes/On Surface/On Surface | N-10 / N-90 |
| Secondary text & icons | Schemes/On Surface/On Surface Variant | NV-30 / NV-80 |
| Borders | Schemes/Outline/Outline (inputs, outlined buttons) · Outline Variant (dividers, card outlines) | NV-50 · NV-80 |
| Snackbar / tooltip | Schemes/Inverse/Inverse Surface + Inverse On Surface (+ Inverse Primary for action) | |
| Modal dim | Schemes/Scrim (N-0) at 32% | |

Rules:
- Always pair a container with its **On-** role (Primary Container -> On Primary Container). Never put On Surface Variant text on a Primary fill.
- Surfaces: use **Surface Container** tiers for elevation hierarchy (M3 tonal surfaces), not shadows; shadows only on floating items (FAB, menus, elevated cards/buttons).
- Dark mode = switch `m3` to Dark on the frame. No duplicate components.
- Brand: Primary = **Regal Navy #193b6e**, Secondary = **Orange #f78730**.

### State layers (interaction)
M3 states are drawn as an overlay on a `State-layer` frame inside each component:
| State | Opacity | Token pattern |
|---|---|---|
| Hovered | 8% | `State Layers/<On-role of the container>/Opacity-08` |
| Focused | 10% | `.../Opacity-10` + Focus indicator (3dp ring, `Utilities > Focus indicator`) |
| Pressed | 10% | `.../Opacity-10` + ripple |
| Dragged | 16% | `.../Opacity-16` |
| Disabled | container On Surface at 10-12%, content On Surface at 38% | `State Layers/On Surface/Opacity-10` + layer opacity 0.38 |
Pick the layer color from the **content** color on that container (filled button: On Primary; text button: Primary; surface list item: On Surface).

## 3. Typography (md.sys.typescale, Google Sans Flex)

30 text styles `role/size` and `role/size-emphasized`:
| Role | large | medium | small | Use |
|---|---|---|---|---|
| display | 56/64 | 48/56 | 40/48 | hero numbers, splash |
| headline | 32/40 | 28/36 | 24/32 | screen headlines, dialogs (headline/small) |
| title | 20/28 | 16/24 | 14/20 | app bar title (title/large), card titles, tabs (title/small) |
| label | 14/20 | 12/16 | 10/16 | buttons & chips (label/large), nav labels (label/medium), badges (label/small) |
| body | 16/24 | 14/20 | 12/16 | text field input (body/large), content, supporting text (body/small) |

- Font `Font-family` = Google Sans Flex, weights Regular and SemiBold (`-emphasized`). Observed: button label `label/large`, text field supporting `body/small`, nav label `label/medium`, tab label `title/small`, tooltip `body/small`.
- Units: text in **sp**; sizes deviate slightly from M3 baseline (display 56/48/40 vs 57/45/36; title/large 20 vs 22; label/small 10 vs 11) and **tracking is 0** everywhere (M3 uses 0.1-0.5).

## 4. Shape, spacing, layout

- Shape (`Shape` collection, md.sys.shape.corner): None 0 · Extra-small 4 (text field top, snackbar, tooltip) · Small 8 (chips) · Medium 12 (cards) · Large 16 (nav drawer, FAB small) · Large-increased 20 · Extra-large 28 (dialogs, large FAB, bottom sheet top) · Extra-large-increased 32 · Extra-extra-large 48 · Full 1000 (buttons, badges, switches, nav pill).
- Spacing: **no variables**. M3 uses a 4dp grid: 4, 8, 12, 16, 24, 32... Observed paddings: button 10/16 (gap 8), text field 4/16, dialog 24, list item 8/16, card text 16, nav bar item 8/16. Create `Spacing` variables before new work.
- Layout: grid styles per M3 **window size class** - Compact 0-599dp (4 col / 16 margin / 16 gutter), Medium 600-839 (8 / 32 / 16), Expanded 840-1199 (12 / 24 / 24), Large 1200-1599 (12 / 200 / 24), Extra-large 1600+ (12 centered). Each has "layout regions off/on/expanded" versions for the navigation region.
- Touch target **48x48dp** minimum (components wrap 40dp visuals in 48dp targets, e.g. checkbox 48, button 96x48 with 40 content).

## 5. Elevation

Effect styles `Elevation Light/1..5` and `Elevation Dark/1..5` (M3 levels 1-5: key + ambient shadow). Use: level 1 elevated card/button, 2 menus scrolled app bar, 3 FAB / snackbar / navigation drawer (modal), 4-5 rare. Combine with Surface Container tone (M3: elevation = tone first, shadow only when floating). `Surfaces/Surface Tint x%` exist for legacy tint overlays; prefer Surface Container roles.

## 6. Icons

141 local components on `➜  Icons`, Material Symbols names in snake_case (`arrow_back`, `more_vert`, `check_small`, `stars_filled`, `favorite`, `settings`...), 24x24, single vector fill bound to `Schemes/On Surface/On Surface`. Some names repeat (two `check_box`, `mail`, `share`, `edit`, `delete`, `settings`, `alarm`, `mic`... = outline vs filled without a suffix).
Components currently instance the **remote M3 kit icons** (e.g. `stars_filled`, `check_small`, `arrow_drop_down`) instead of these local ones.
Rule for new work: Material Symbols (Rounded, weight 400, grade 0, optical size 24; `_filled` suffix for fill=1), 24dp (18dp in chips, 20dp in small buttons, 36dp in large FAB), color via On-roles, always as instances with INSTANCE_SWAP (`Icon`, `Icon (selected)`) - the M3 kit convention already present in every component.

## 7. Atomic hierarchy (standing rule)

- **Atoms**: Icon, Checkbox, Radio, Switch, Badge, Divider, Avatar, Button (all colors), Icon button, FAB, Chip, Tab item, Nav item, Menu item, List item building blocks, Slider parts, Progress indicator, Focus indicator, Scrim.
- **Molecules**: Text field, Search bar, Segmented/connected button group, Split button, List item, Snackbar, Tooltip, Card content, Date cell rows.
- **Organisms**: App bar, Navigation bar / rail, Toolbar, Tabs bar, Menu, Dialog, Bottom/Side sheet, Card, Date & time pickers, Carousel, FAB menu, Search view (docked/full-screen).
- **Patterns**: Example Layouts (Home, Detail, Gallery, Messaging) and screens per window size class.
Before any build: state the tier, list dependencies, build missing lower tiers first; expose `Show ...` booleans, `Label text` texts and `Icon` swaps upward (the M3 kit already does this).

## 7b. Documentation must be linked (standing rule)

- ➜ Color Palette: swatches are bound (Color Palette 121/125, Colors 130/132 fills bound locally). Keep it that way: each new role gets a bound swatch in Light and Dark schematic.
- ➜ Typography: only 30 of 405 text nodes use a local style (the specimens); the table labels use remote styles. Samples must use their local style.
- ➜ Corner Radius: 13 shape swatches are **not bound** to `Shape` variables - bind them.
- ➜ Elevation: uses the local effect styles (10); its Dark frame uses a remote collection mode - switch to local `m3` Dark.

## 8. Conventions for new Android work in this file

1. New color: add palette tones only if missing, then a Scheme role with Light/Dark (and On- pair), scope it (not ALL_SCOPES), describe it with its md.sys.color name and code syntax (Android: `colorScheme.primary` / `R.color.md_theme_primary`).
2. New component: fills/strokes -> `m3` Schemes; state overlays -> State Layers; radius -> `Shape`; text -> local text styles; shadow -> local Elevation styles; icons -> local Material Symbols instances. No remote M3 kit variables/styles/components.
3. Properties follow the M3 kit: `State` = Enabled | Hovered | Focused | Pressed | (Dragged) | Disabled, `Selected` True/False, `Size` XSmall..XLarge, `Type`/`Style`/`Color`/`Configuration`; booleans `Show ...`; TEXT `Label text`, `Supporting text`; INSTANCE_SWAP `Icon`, `Icon (selected)`; `Show focus indicator` boolean.
4. Disabled = M3 recipe (container On Surface 12%, content 38%), never a random gray.
5. Dark mode via `m3` mode; responsive via window-size-class grids and component variants (e.g. Navigation bar -> rail -> drawer).
6. After building: run audit-design-system and compare with `references/gaps.md`.
