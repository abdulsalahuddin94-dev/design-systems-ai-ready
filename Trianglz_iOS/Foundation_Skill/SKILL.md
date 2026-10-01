---
name: trianglz-ios-foundation
description: Use before building, extending, auditing or coding anything with the Trianglz iOS Design System (Figma file q5nQHGEGzZ94WN0wilJwLW, "Trianglz - IOS Design System"). Defines the ⭐Setup foundations - collections (Typography, Spacing, Color Primitive/Semantic/Brand, Radius), the 22 Apple text styles, layout grid, icons, app icon and keyboards - plus the file structure, build order, iOS naming and the rules for new tokens and components. iOS only; independent from the Web and Android skills. Load it together with any Trianglz_iOS Component_Skills.
---

# Trianglz iOS DS - Foundation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../data/component-registry.json`, `../data/rules.json`, `../data/screen-templates.json`, and `../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

Source: ⭐Setup pages of `Trianglz - IOS Design System`, read through the Figma Desktop Bridge on 2026-09-29 (read-only study, nothing was changed).
Platform: **iOS, Apple HIG (iOS 26 / Liquid Glass era), SF Pro, points (pt)**.

Reference files:
- `references/variables.md` - every variable with values, modes and scopes; every text style.
- `references/gaps.md` - foundation audit: what is not tokenized, inconsistent, or off-HIG.
- `references/screens/*.png` - screenshots of every Setup documentation frame (SVG export rendered to PNG).

Component skills: `Component_Skills/Form_Elements_Skill`, `Component_Skills/Navigation_Skill`, `Component_Skills/Data_Display_Skill`.

---

## Update 2026-10-01 (live re-study through FigCli, read-only - overrides older details below)

Every variable, style and component set was re-read from the open file with read-only scripts; each public set's states were traced layer by layer (fills, strokes, opacity, text styles, nested instances, remote vs local) and checked against the Light/Dark screenshots. Results: `references/inventory.md` (Setup sets: icons and the keyboard parts), `Component_Skills/*/references/inventory.md` and `states.md`.

Confirmed: 6 collections - `Typography ` (30: 11 sizes, 11 line heights, 7 weights incl. Medium and italics, 1 family), `Spacing` (8, GAP scope only), `Color / Primitive` (83, Light/Dark identical, no scopes), `Color / Semantic` (39, Light/Dark), `Color / Brand` (2, ALL_SCOPES), `Raduis` (8); 22 text styles, **0 effect styles**, 1 grid style, 0 paint styles; 103 component sets/components (60 outside Setup).

Corrections:
- All 39 Semantic variables **have descriptions** (Typography, Spacing, Radius, Primitive and Brand have none). Semantic also has `Borders/Strong` (Gray 400 / 500) and `Backgrounds/Brand`; `Text/Tertiary Text` is Gray 500 in both modes.
- Caption2 is **10/12** in the file; Apple HIG Caption 2 is 11/13 - treat it as a gap, not HIG.
- Letter spacing: 19 of 22 text styles bind a remote tracking variable; Large Title (both) and Caption2/Regular use raw tracking. `Title1/Emphasized` has no font-family binding.
- Spacing scope is GAP only, so padding pickers do not offer spacing tokens; the Input radius is bound to `spacnig/sm`.
- Trianglz-built parts (Input, Checkbox, RadioButton, tab bar buttons, `_Label - Text`) bind local Semantic tokens; every Apple-kit part binds remote `Labels*`, `Fills*`, `Accents/*`, `Backgrounds*`, `Overlays/Default`, `Separators/*`, `Grays/*` and remote text styles. Their `Mode=Light|Dark` variants bind the **same** remote variables in both modes, so local Dark mode never reaches them.
- Two tints coexist: `Brand Primary` (#3b82f6) on buttons, tabs, checkboxes, progress and toolbar Tinted/Selected states; Apple `Accents/Blue` on date pickers and alert Default buttons.
- Icons: besides `Component 1`, `Search Icon` and `akar-icons:check`, the Input uses a `View Icon` instance; the glass symbol buttons (`_Label - Symbol - *`) use `akar-icons:check`, while toolbar, search, alert, activity and Face ID parts draw SF Symbols as text glyphs.
- Component set with Figma errors: `_Button - Symbol Keyboard` (➜ Keyboards) has conflicting variants (its properties cannot be read).

Screens: FigCli PNG export fails on this machine (same as the Desktop Bridge), so visual checks use the existing SVG-rendered screenshots; Liquid Glass and blur render flat in them. New Dark captures wait for a duplicate file (a temporary Dark page is a write).

---

## 0. File structure (exact page order)

| # | Page (exact name) | Content |
|---|---|---|
| 1 | Cover | `Plugin / file cover - 1` |
| 2 | `------------------------` | separator |
| 3 | **⭐Setup** | group header (empty) |
| 4 | ➜ Layout Grid | `iPhone 17 - 1` (402x874 grid demo) + `Layout Grid` doc table (Columns, 4, margin 16, gutter 12) |
| 5 | ` ➜ Colors System` (leading space) | overview frame "Colors / Semantic" explaining Primitive -> Semantic -> UI |
| 6 | `        ↳ Primitive Colors - Designers Only` | Neutrals, ⭐ Brand Palette, Blue, Green, Red, Orange, Yellow, Purple frames |
| 7 | `        ↳ Brand Colors` | Brand frame (Brand Primary / secondary, Light and Dark) |
| 8 | `        ↳ Semantic Colors` | overview + Text Colors, Backgrounds, Borders, Status (frame also named "Borders") tables: Token, Light, Dark, Example |
| 9 | ➜ Typography | two `Typography` frames: hierarchy table (text style, weight, size, leading, emphasized weight, example) |
| 10 | ➜ Spacing | table (frame named "Typography") of spacing tokens |
| 11 | ➜ Radius | table (frame named "Typography") of radius tokens |
| 12 | ➜ App Icon | 13 frames: 1024, 180, 167, 152, 120, 87, 83.5, 80, 76, 60, 40, 29, 20 (Icon + Badge instances) |
| 13 | ➜ App Store Screenshots | sections 6.5", 6.9" (iPhone 17 Pro Max), 13" iPad Pro, "Screenshots IOS" (6.7" 1284x2778, 5.5") |
| 14 | ➜ Icons | `Icons` frame: Nav Bar, tab bar icon, Search, Actions (Add, Down, View, Hide, Check) |
| 15 | `➜  Keyboards` (double space) | iPhone + iPad keyboard sections (Apple kit sets, Light/Dark as variants) + doc frame |
| 16 | `-----------` | separator |
| 17 | **⭐Form Elements** | ➜ Input Fields and Dropdown, ➜ Checkbox, ➜ Radio Buttons, ➜ Toggles, ➜ Date and Time Pickers, ➜ Toolbars & Search |
| 23 | `------------------` | separator |
| 24 | **`⭐Navigation `** (trailing space) | ➜ Tab Bar, `➜  Buttons` (double space), ➜ Action Sheets + Alerts |
| 28 | `----------------------------` | separator |
| 29 | **⭐Data display** | ➜ Status Bars and Menu Bars, ➜ Bottom Sheets, ➜ Face ID, ➜ Progress Indicators, ➜ Activity Views, ➜ Contextual Menus |

Differences from the Web file structure: Colors is split into a ➜ parent page plus three `↳` sub-pages; App Icon, App Store Screenshots and Keyboards are iOS-only Setup pages; there is no Shadows page (no effect styles). Documentation frames use `Header` + `Content` children; several are misnamed ("Typography" on Spacing/Radius pages, "Text Fields" on Checkbox/Radio pages, "Borders" for the Status table).

Documentation frame convention: one frame per page with a gray `Header` band ("<Topic> Documentation") and a `Content` block. Only ➜ Input Fields and ➜ Tab Bar have **Light** and **Dark** frames that switch `Color / Semantic` mode on a frame of instances (the correct pattern). Buttons and Progress pages use sections set to a **remote** (Apple kit) collection mode instead.

## 0b. Build order (Abdul's rule, applies to every iOS project)

1. **Primitives** - raw palette (`Color / Primitive`), 1 mode.
2. **Semantic** colors aliased to Primitives, modes Light / Dark (plus `Color / Brand` aliases).
3. **Spacing, Radius, Typography** variables (Typography per Apple text style; add Dynamic Type modes when needed).
4. **Text styles** (bound to Typography variables) and **effect styles** (shadows, Liquid Glass) built from those variables.
5. **Icons** (atoms), then components: **Atoms -> Molecules -> Organisms -> Patterns**, only from the variables and styles above.
6. **Audit** (audit-design-system), then update these skills and gaps files.

## 1. Architecture at a glance

```
Color / Primitive (Apple system grays + system hues, Tailwind brand blue/indigo)
   └─ Color / Brand (Brand Primary, Brand secondary)
   └─ Color / Semantic (Text, Backgrounds, Borders, Icon, Status; Light / Dark)  ─> components
Typography (Apple text styles, 1 mode) ─> 22 text styles ─> components
Spacing (spacnig/xxs..xxl, margin)     ─> padding / gap
Raduis (None..Full)                    ─> corner radius
Grid style "Layout Grid" 4 col / 16 margin / 12 gutter
```

Reality check: only the Trianglz-built components (Input, Checkbox, Radio, Tab bar button, parts of Buttons/Alerts) use these local tokens. Most components on Toolbars, Buttons, Date pickers, Keyboards, Sheets, Activity Views, Context Menus, Status bars were copied from Apple's iOS 26 UI Kit and still bind **30 remote Apple variables** (`Labels/Primary`, `Labels - Vibrant/*`, `Fills/*`, `Accents/Blue|Red|Green`, `Backgrounds/Primary`, `Separators/Vibrant`, `Overlays/Default`...) and remote text styles. See gaps.md.

## 2. Color

Naming: `Group/Role` in Title Case with words, e.g. `Text/Primary Text`, `Backgrounds/Card`, `Borders/Focus`, `Icon/On Brand`, `Status/Danger/Danger Text`.

| Need | Token (Light -> Dark) | Apple equivalent |
|---|---|---|
| Main text | Text/Primary Text (Gray 900 -> Gray 100) | label |
| Supporting text | Text/Secondary Text (Gray 700 -> Gray 300) | secondaryLabel |
| Hints, captions | Text/Tertiary Text (Gray 500) | tertiaryLabel |
| Placeholder | Text/Placeholder (Gray 500 -> 400) | placeholderText |
| Disabled | Text/Disabled Text (Gray 400 -> 600) | quaternaryLabel-ish |
| Links / tint | Text/Link Text (Brand Primary) | link / tintColor |
| Text on brand fill | Text/On Brand Text (white) | - |
| Screen background | Backgrounds/App (Gray 100 -> Gray 900) | systemGroupedBackground |
| Cards, cells, fields | Backgrounds/Card (white -> Gray 800) | secondarySystemGroupedBackground |
| Grouped / pressed / disabled field | Backgrounds/Group (Gray 200 -> 700) | tertiarySystemFill-ish |
| Sheets, modals | Backgrounds/Modal (white -> Gray 800) | systemBackground (elevated) |
| Brand fill | Backgrounds/Brand (Brand Primary) | tintColor |
| Dividers / field border | Borders/Default (Gray 300 -> 600) | separator (opaque) |
| Focus ring | Borders/Focus (Primary Blue 400) | keyboard focus |
| Icons | Icon/Primary, Secondary, Tertiary, Disabled, Brand, On Brand | label / secondaryLabel tints |
| Status | Status/{Info, Success, Warning, Danger}/{Text, Background, Border, Icon} | systemBlue/Green/Orange/Red |

Rules:
- Bind components to **Color / Semantic** (or `Brand Primary` where no semantic exists yet). Primitives have no scopes.
- Brand = **Primary Blue 500 #3b82f6** (Tailwind blue), not Apple systemBlue #007aff (that is `Blue/Blue 500`, used by status info).
- Dark mode = set `Color / Semantic` to Dark on the frame. Never duplicate components for dark. (The Apple-kit components carry a `Mode=Light|Dark` variant instead - do not copy that pattern into new components.)
- Destructive actions use `Status/Danger/*` (Apple systemRed family), not a new button color.

## 3. Typography (Apple HIG text styles, SF Pro)

22 styles named `{Style}/{Regular|Emphasized}`:

| Style | Size / Leading | Regular | Emphasized | Tracking | Use |
|---|---|---|---|---|---|
| Large Title | 34/41 | Regular | Bold | +0.40 | top-level screen title (nav bar large title) |
| Title1 | 28/34 | Regular | Bold | +0.38 | page / section hero |
| Title2 | 22/28 | Regular | Bold | -0.26 | section title |
| Title3 | 20/25 | Regular | Semibold | -0.45 | card title |
| Headline | 17/22 | Semibold | Semibold | -0.43 | list row title, alert title, emphasized body |
| Body | 17/22 | Regular | Semibold | -0.43 | default text, buttons (Large), field values |
| Callout | 16/21 | Regular | Semibold | -0.31 | text field value/placeholder in this file |
| Subheadline | 15/20 | Regular | Semibold | -0.23 | secondary row text, Medium buttons |
| Footnote | 13/18 | Regular | Semibold | -0.08 | helper text, checkbox/radio labels |
| Caption1 | 12/16 | Regular | Semibold | 0 | floating field label, metadata |
| Caption2 | 10/12 | Regular | Semibold | +0.06 | tab bar labels (Emphasized) |

- Family `SF Pro` (variable `Font Family/Font Family`); Apple uses SF Pro Display >= 20pt and SF Pro Text below (the single "SF Pro" variable font handles optical sizes).
- Values equal HIG at the default (Large) Dynamic Type size. There are **no Dynamic Type modes**; to support Dynamic Type add modes (xSmall..xxxLarge, AX1..AX5) to the Typography collection rather than new styles.
- Observed usage: field value/placeholder `Callout/Regular`, field label `Caption1/Regular`, helper `Footnote/Regular`, checkbox/radio label `Footnote/Regular`, tab label `Caption2/Emphasized`, alert title `Headline/Emphasized`, alert message `Body/Regular`.

## 4. Spacing, radius, grid

- Spacing `spacnig/{xxs 4, xs 8, sm 12, md 16, lg 24, xl 32, xxl 40, margin 16}` (pt, 1 mode). Use `margin` for screen edge insets (16pt compact width; Apple uses 16/20 depending on device), `md` for field/cell padding, `sm` for icon-text gaps, `xxs` for label-to-field gaps.
- Radius `Raduis/{None 0, XS 4, S 8, Md 12, Lg 16, XL 20, XXL 24, Full 99}`. Observed: checkbox 4 (XS), text field 12 (Md), buttons/capsules Full. iOS guidance: use continuous corners (Figma "corner smoothing" ~60% to mimic Apple squircles) on cards, fields and sheets.
- Grid style `Layout Grid`: 4 columns, stretch, margin 16 (bound to `spacnig/margin`), gutter 12, on a 402x874 iPhone 17 frame. There are no iPad or landscape grid styles.
- Minimum touch target **44x44pt** (HIG). Input md is 45pt high, lg 56pt; checkbox/radio boxes are 20pt (wrap them in a 44pt hit area).

## 5. Elevation and materials

No effect styles exist. Apple-kit components use raw effects: Liquid Glass (`GLASS` effect + inner shadows + specular layer), background blur, and drop shadows (context menu, Face ID bezel). Materials come from remote `Liquid Glass - Regular - Small/Medium` instances. When building new components: create effect styles first (`Glass/Regular`, `Glass/Prominent`, `Shadow/Popover`, `Shadow/Sheet`) and bind them.

## 6. Icons

➜ Icons holds only a handful of local components: `Component 1` (tab bar icon, `Property 1 = Selected | Default`), `Search Icon`, `akar-icons:check`, plus instances labelled Add, Down, View, Hide. The Input uses a `View Icon` instance swap.
Most Apple-kit components draw **SF Symbols as text glyphs** in SF Pro (e.g. "􀊄" in buttons, "􀆅" in Face ID) - that is Apple's own kit convention, but it breaks the project rule "icons are instances with a swap property".
Rule for new work (iOS): build an `Icon/<Name>` component set in **SF Symbols style** (outline + fill variants, weights matched to text: Regular for Body), 24pt frames (tab bar 25-28pt glyphs), colored with `Icon/*` tokens, exposed through INSTANCE_SWAP on buttons, fields, list rows and tab items. Reuse existing icon components first.

## 7. Atomic hierarchy (standing rule)

- **Atoms**: token-only, may contain Icon instances. Icon, Checkbox, Radio, Toggle (Switch), Tab Bar Button, Button label (`_Label - Text`, `_Label - Symbol`), Page Dots, Grabber, Day cell, Keyboard key, Separator.
- **Molecules**: nest atoms, strict auto layout. Input, Search field (`_Search - Top/Bottom`), Toolbar buttons (`_Button - *`), Back Bar Button Item, Buttons (Content Area / Liquid Glass wrap a label atom), Alert `_Buttons`, Progress bar, Spinner.
- **Organisms**: nest molecules/atoms, expose nested properties. Tab Bar, Toolbar Top (Navigation bar) / Bottom, Alert, Action Sheet, Sheet, Date picker, Context Menu, Activity View, Keyboard, Status/Menu bar.
- **Patterns**: full screens assembled from organisms (sign-in, OTP, list, settings, map).
Before any build: state the tier, list dependencies, build missing lower tiers first, expose booleans / text / instance swaps upward.

## 7b. Documentation pages must be linked (standing rule)

- `↳ Primitive Colors` / `↳ Semantic Colors` swatches must be bound to their variables, with a Light frame and a Dark frame (Semantic mode). Today only 86/370 primitive and 69/229 semantic swatch fills are bound locally; the rest are raw or bound to a remote `Neutrals colors/white` (table backgrounds). The semantic tables show Light and Dark hex text but not two mode-switched swatches.
- ➜ Typography: every sample must use its text style (only 11 of 76 text nodes do today) with variables bound through the style.
- Spacing/Radius tables must show real variable values (today they are static text and disagree with the variables: xxl 48 vs 40, Full 999 vs 99).

## 8. Conventions for new iOS work in this file

1. New color: add a primitive only if missing, then a Semantic alias with Light and Dark, correct scope, and a description; prefer Apple roles (label, secondaryLabel, separator, systemFill, groupedBackground...) mapped to Trianglz names.
2. New component: bind fills/strokes to `Color / Semantic`, padding/gap to `spacnig/*`, radius to `Raduis/*`, text to the local text styles; no remote Apple variables or styles; no `Mode` variant (use variable modes).
3. Properties: `State` (Default, Pressed, Focused, Disabled), `Size`, `Style`, `Selected`, `Is Enabled`-style booleans are acceptable Apple conventions but keep one convention per file; TEXT for every string, BOOLEAN for optional parts, INSTANCE_SWAP for icons.
4. iOS states: iOS has no hover on iPhone; required states are Default, Pressed (highlighted), Disabled, Selected/On, Focused (keyboard/iPad), plus Error for inputs.
5. Dark mode by switching `Color / Semantic` mode; Dynamic Type by Typography modes (to add).
6. After building: run audit-design-system and compare with `references/gaps.md`.
