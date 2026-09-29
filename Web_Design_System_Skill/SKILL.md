---
name: web-design-system-builder
description: Main skill for building a new Web design system in Figma from scratch (Scenario A) or from existing UI (Scenario B). Defines the file structure, build order, token architecture, style, icon and component conventions, required states per component, and the mistakes to avoid - learned from studying the Trianglz Web Design System. Load it with figma-use and figma-generate-library before creating anything; save the project's own skills under [Root]\[Project]\.
---

# Web Design System Builder (Main Skill)

Reference implementation studied: **Trianglz - Web Design System** (`Trianglz/` in the Root; Figma template link in `References.md`).
Copy its **structure**. Do **not** copy its mistakes: every item in section 9 must be done correctly from the start.
Platform: Web, Tailwind conventions (scale names, breakpoints, hover/focus/active states).
Node IDs quoted in the Trianglz skills are valid in the original Trianglz file only. In a duplicated template or any other file, find pages, component sets, styles and variables by **name**.

**Knowledge base (JSON, source of truth for exact values):** every DS folder has `data/tokens.json` (variables per mode, aliases, shade-scale curves, recolor readiness), `data/component-registry.json` (components, variants, properties, tiers), `data/rules.json` (numeric rules: contrast, touch targets, icon sizes, spacing, recolor) and `data/screen-templates.json` (Login, Sign up, OTP, List, Detail, Form, Settings, Empty state), plus `docs/decisions.md`. Read values from these files instead of copying numbers into skills; the reference versions are in `Trianglz/data/`. Tools: `tools/build_tokens.py`, `tools/recolor.py` (see `tools/README.md`).

---

## 1. File structure (pages, in this order)

```
Cover
-----------------------------
⭐Setup
➜ Layout Grid
➜ Typography
➜ Colors
➜ Shadows
➜ Corner Radius & Spacing
➜ Icons
-----
⭐Form Elements
➜ Input Fields and Dropdown      (Input / Text, URL, Card Number, Select / Dropdown, Menu, OTP, Stepper, Upload Field, Search)
➜ Text Area
➜ Checkboxes
➜ Toggles
➜ Radio Buttons
-----
⭐Navigation
➜ Buttons & Links
➜ Pagination, Tabs & Breadcrumb
-----
⭐Data Display
➜ Avatars & Upload Image
➜ Tooltips
➜ Banners, Badges & Toasts
➜ Popups
➜ Favicon
-----
```
### Where a new request goes (group routing rule)
| Request is about... | Goes under | Examples |
|---|---|---|
| Foundations: tokens, colors, typography, spacing, radius, shadows, grid, icons | **⭐Setup** | new color, text style, grid, icon |
| Any component the user **enters data** with | **⭐Form Elements** | input, select, date picker, checkbox, radio, toggle, slider, upload, search field, OTP, stepper |
| Any **action** or anything that **moves the user from place to place** | **⭐Navigation** | button, link, tabs, pagination, breadcrumb, navbar, sidebar, menu, stepper-wizard |
| Any component that **displays information** | **⭐Data Display** | avatar, badge, tooltip, alert, toast, card, table, list, popup, empty state, progress |

Create a new `➜` page inside the matching group when no existing page fits, and put the component skill in the matching Component_Skills file (Form_Elements_Skill, Navigation_Skill, Data_Display_Skill); foundation rules go in Foundation_Skill.

- `⭐` pages are empty group headers; `➜` pages hold one topic; separators are empty pages.
- No stray spaces or typos in page names.
- On each component page: one documentation frame per component family (title in `2xl/Semi Bold`, short description, the component set inside). Next to it a **dark preview frame** with `Semantic` mode = Dark containing **instances** of the light master (never a duplicate component set).
- Popups and every other family also get a documentation frame (no loose sets on the page).

## 2. Build order (each layer only uses the layers before it)

1. **Primitives** - raw values.
2. **Semantic** variables aliased to Primitives (Light / Dark).
3. **Spacing, Radius, Typography** variables (Desktop / iPad / Mobile where responsive).
4. **Styles** from those variables: text styles, effect styles, grid styles.
5. **Icons** (atoms) bound to icon tokens.
6. **Components**: Atoms -> Molecules -> Organisms -> Patterns.
7. **Documentation pages** linked to variables and styles (section 8).
8. **Audit** (audit-design-system) + write the project skills (Foundation_Skill + Component_Skills per group).

Before each component: state its tier, list dependencies, build missing lower tiers first.

## 3. Token architecture

### Primitives (1 mode "Value", scopes `[]`, published hidden)
- `white`, `black`; hue ramps `gray, blue, red, yellow, green, orange, purple` with steps `0, 50, 100 ... 900, 950`.
- **Alpha primitives** for scrims: `alpha/black-50`, `alpha/black-70` (and white alphas if needed).
- Lowercase names, no spaces (`black-and-white/white` is wrong, use `white`). Say in descriptions if values deviate from Tailwind.

### Semantic (modes Light / Dark) - naming `color/{group}/{role}`, lowercase, no numeric suffixes
| Group | Roles | Scope |
|---|---|---|
| text | primary, secondary, muted, placeholder, disabled, inverse, link, link-hover, error, warning, success, info, on-brand | TEXT_FILL |
| bg | primary, secondary, muted, subtle, inverse, overlay (alpha), error, warning, success, info, brand, brand-hover, brand-active | FRAME_FILL, SHAPE_FILL |
| border | default, muted, strong, input, inverse, focus, error, warning, success, brand | STROKE_COLOR |
| icon | default, strong, muted, brand, inverse, error, warning, success, info | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| action (buttons) | `action/{primary,secondary,danger}/{bg,bg-hover,bg-active,text,border}` | per role |

- Status UI (alerts, badges, toasts) uses `bg/{status}`, `text/{status}`, `border/{status}`, `icon/{status}` - never button tokens.
- Contrast targets decided at token level: `text/muted` and `text/placeholder` >= 4.5:1 on `bg/primary` (gray-500 light, gray-400 dark); `border/input` >= 3:1 (gray-400/500); status text on status bg >= 4.5:1 (use 700 shades for warning/success text).
- **Every variable** gets explicit scopes (never ALL_SCOPES), WEB code syntax `var(--color-text-primary)`, and a description.

### Typography (modes Desktop / iPad / Mobile)
- `font-family/base` (Poppins by default for this org, or the brand font), `font-weight/{regular,medium,semibold,bold}` (FONT_STYLE scope).
- `font-size/{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl}` (FONT_SIZE), `line-height/{same keys}` (LINE_HEIGHT), `letter-spacing/{same keys}` (LETTER_SPACING).
- Trianglz values: sizes 12/14/16/18/20/24/28/32/40/48 (Desktop), iPad/Mobile shrink from sm up; line heights 16/20/24/28/28/32/36/40/48/60; tracking +0.2, 0, 0, -0.2, -0.2, -0.4, -0.6, -0.8, -1, -1.2.

### Spacing (modes Desktop / iPad / Mobile) - `space/{0,1,2,3,4,5,6,7,8,9,10,11,12,14,16,20,24,28,32,36,40,48,56,64}` = n x 4px on Desktop; 0-4 fixed across modes, 5+ compress on iPad/Mobile. Scopes GAP (+ WIDTH_HEIGHT).
### Radius (1 mode) - `radius/{none 0, sm 2, base 4, md 6, lg 8, xl 12, 2xl 16, 3xl 24, full 9999}` with usage descriptions (base default, lg inputs/cards, xl panels, 2xl modals, full pills/avatars).
### Opacity - `opacity/disabled` = 0.5 (use for all disabled states).

## 3b. Recolor-ready colors (Abdul's rule: a color change must update every shade cleanly)

Build rules (every new DS):
- Primitives hold the only raw colors. Each hue is a full shade scale with fixed step names (0, 50, 100 ... 900, 950); a brand color is a ramp, never a single swatch.
- Generate each ramp from one base color with a stored curve (OKLCH curve: steps keep their lightness and chroma ratio, hue follows the base), not by hand-picking steps. Record the base and the curve in `data/tokens.json > ramps` (run `python tools/build_tokens.py <folder>` after exporting variables).
- Semantic (and Brand) tokens **only alias** Primitives. Zero raw hex outside Primitives; `tokens.json > recolor_readiness.ready` must be `true`.
- Components use Semantic tokens only, never Primitives directly and never raw colors.
- Colors that need alpha (scrims, state layers, tints) use alpha Primitives, or are listed as **derived tokens** in `data/rules.json > recolor.derived_tokens` so the recolor script regenerates them.
- Never rename a Primitive during a recolor: names are the contract that keeps every alias linked.

Recolor procedure (when the user asks to change a color):
1. Find the ramp in `data/tokens.json > ramps` and which Semantic tokens alias it.
2. Run `python tools/recolor.py <folder> --ramp "<ramp>" --base "#hex"`. It regenerates every step with the ramp's curve, recomputes derived tokens, and re-checks every contrast pair in `data/rules.json` in Light and Dark (pairs that were already failing are reported separately).
3. Fix any NEW contrast failure by re-pointing that Semantic alias to another step (never a raw hex), then run the script again.
4. Apply the generated `data/recolor/<date>-<ramp>.figma.js` with figma_execute: it sets values into the SAME variables by name and never creates, renames or deletes.
5. Re-export variables and run `tools/build_tokens.py` (or re-run recolor with `--write-tokens`) so `tokens.json` matches Figma.
6. Screenshot ➜ Colors and every component page in Light and Dark; compare with the previous screenshots.
7. Log it in `docs/decisions.md`.

**Fix on create:** when a DS starts from an existing file or a Trianglz template, run `tools/fix_tokens.py` and apply its plan before building anything (Design_System_Intake_Skill section 7b). New builds run it as the last foundation step; its plan must come back empty.

## 4. Styles

- **Text styles**: `{size}/{weight}` (40 styles: 10 sizes x Regular, Medium, Semi Bold, Bold). Bind font family, weight, size, **line height and letter spacing** to variables. Description: `14px / 20px / 500 · Tailwind text-sm font-medium` - must match the real values.
- **Effect styles** (exact Tailwind): `shadow-2xs, shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, inset-shadow-2xs/xs/sm`, plus `focus-ring` (inputs: inset 2px `border/focus`) and `focus-ring-offset` (buttons/controls: 2px bg gap + 4px focus ring). Use raw colors in effect styles (binding effect colors to variables made plugin exports hang).
- **Grid styles**: `Grid/Desktop 1440` 12 col / 80 margin / 24 gutter, `Grid/iPad 768` 8 / 32 / 16, `Grid/Mobile 375` 4 / 16 / 16.
- No color styles (color = variables only).

## 5. Icons

- One component per icon, named `Icon/<Name>` in Title Case (Icon/Chevron Down, Icon/Close, Icon/Search, Icon/Info, Icon/Alert Circle, Icon/Warning, Icon/Check, Icon/Check Circle, Icon/Add, Icon/Minus, Icon/Edit, Icon/Delete, Icon/Upload, Icon/File, Icon/User, Icon/Arrow Left/Right...). 24x24, one consistent set (Lucide for Web by default; Solar Linear if the brand uses it).
- Fill/stroke bound to `color/icon/default`; recolor instances with other `color/icon/*` tokens.
- Components **only** use Icon instances (never drawn vectors or text glyphs like ← →), exposed through INSTANCE_SWAP properties (leading/trailing icon on buttons, inputs, menu items, list items).

## 6. Component conventions

- Names: `Family / Variant` (Input / Text, OTP / Cell, Menu / Item, Tabs / Item — Underline). Unique set names.
- Variant properties in Title Case: `State`, `Type`, `Size`, `Status`, `Open`; values Title Case (`Default, Hover, Focus, Filled, Error, Success, Disabled`). Never `Property 1`, `Variant5`, `Status4`, `folled`, `dimmed`.
- Every set: description with tier + purpose + when to use / not use.
- TEXT properties for every visible string (label, hint, error, title, message, placeholder where constant), BOOLEAN for optional parts (show hint, show optional, show tooltip, show close, show icon), INSTANCE_SWAP for icons. Every property must be wired to a layer (no dead properties, no property that hides the wrong layer).
- 100% bound: fills, strokes, padding, gap, radius, text styles, effect styles. No raw values, no remote variables/styles.
- Auto layout everywhere; instances set to Fill container in forms.
- Disabled = the component's own look at `opacity/disabled` (never recolor all types the same).
- Molecules/organisms nest atom instances and expose nested properties (`isExposedInstance`).
- Keep variant matrices sane: Button uses Type x Size x Icon x State; don't create a variant per icon.

### Required inventory and states (Web)
| Tier | Component | Required variants / states |
|---|---|---|
| Atom | Button | Type Filled, Outline, Pill, Link, **Danger** · Size xs 32, sm 36, base 40, lg 48, xl 56 · Icon None/Left/Right/Only · State Default, Hover, Pressed, Focus, Disabled, Loading |
| Atom | Checkbox, Radio | Unchecked, Checked, (Indeterminate), Hover, Focus, Error, Disabled (+ checked variants) |
| Atom | Toggle | On/Off x Default, Hover, Focus, Disabled |
| Atom | Badge | Info, Success, Warning, Error, Neutral · optional icon · sm/md |
| Atom | Avatar | Photo, Initials, Icon · 24, 32, 40, 60, 100 · optional status dot |
| Atom | Tooltip | Arrow Up/Down/Left/Right · Small/Large (dark and light style) |
| Atom | Tabs / Item, Pagination / Item, Breadcrumb / Item, Menu / Item, OTP / Cell | Default, Hover, Active/Selected/Current, Focus, Disabled |
| Molecule | Input / Text (+ URL, Card Number, Password, Date, Phone) | Default, Hover, Focus, Filled, Error, Success, Disabled · label, optional, tooltip, hint, error |
| Molecule | Textarea, Search, Upload Field, OTP / Field, Stepper | same state set where applicable; Stepper uses Button instances |
| Molecule | Alert, Toast, Menu, Tab bar, Pagination bar, Breadcrumb, Avatar Upload | Status variants; built from atoms |
| Organism | Select / Dropdown, Confirmation Popup / Modal, Top bar, Sidebar | open/closed; exposed nested props |

Hint text sits between label and field; error text below the field (12px), same in every input.

## 7. Theming and responsive
- Dark mode = switch the `Semantic` mode on the frame. No duplicate dark components.
- Responsive = switch Typography/Spacing modes (Desktop/iPad/Mobile) + grid style.

## 8. Documentation pages (linked, never static)
- ➜ Colors: Primitive Light/Dark and Semantic Light/Dark frames; every swatch bound to its variable, card named with the variable path, hex label matching the resolved value. Add a card whenever a variable is added.
- ➜ Typography: every sample uses its text style (variables bound through the style); responsive table shows the real mode values.
- Shadows, Radius & Spacing, Grid, Icons pages show the real styles/variables with Tailwind class names.

## 9. Mistakes found in Trianglz - never repeat them
1. Variables bound to other libraries (remote spacing, radius, colors, text styles, effect styles).
2. Raw values: radius 8/20, padding 8/12, gaps 6/10, hard-coded shadows and focus rings.
3. Generic or broken naming: `Property 1`, `Variant5`, `Status4`, `folled`, `Meduim`, `Large` + `large`, 4 variants all named `Default`, 3 sets with the same name, " 2" suffixes on tokens, mixed case.
4. Dead or mis-wired properties (Upload/Search props wired to nothing; a boolean hiding the whole input).
5. No descriptions on components or variables; no code syntax.
6. Icons drawn as vectors or text glyphs instead of Icon instances; no icon tokens; icon library bound to a border token.
7. Dark mode shipped as duplicate component sets.
8. Missing states: no hover/focus/error on checkbox, radio, toggle; no pressed/loading on buttons; no success on inputs; disabled buttons all pale blue with white text.
9. Weak focus (same-hue border on filled buttons).
10. Low contrast: muted/placeholder gray-400 (2.5:1), input borders gray-200/300, warning text yellow-500 on yellow-50.
11. Status components colored with button tokens.
12. Line height and letter spacing not bound in text styles; wrong sizes in style descriptions and on the Typography page.
13. Grid documented but no grid styles; `bg/overlay` opaque.
14. Molecules not built from atoms (stepper buttons, avatar upload, tab bars as plain frames); example bars not components.
15. Component using a different font (Inter) than the system font.
16. Missing components: danger button, dropdown menu, toast, breadcrumb, password/date fields, navbar/sidebar.

## 10. Final QA checklist (run before handing over)
- [ ] 0 remote variables/styles; 0 raw fills/strokes/padding/gap/radius in components.
- [ ] Every variable: scope, code syntax, description. Every set: description, Title Case properties, wired props.
- [ ] Every component has Hover/Focus/Disabled (+ Error/Success where relevant); focus visible (focus-ring styles).
- [ ] Contrast: text >= 4.5:1, UI boundaries >= 3:1, in Light and Dark.
- [ ] Icons are instances with swap properties; icon colors from `color/icon/*`.
- [ ] Dark previews are instances in Dark-mode frames; Colors/Typography docs linked.
- [ ] Screenshot every variant (light + dark) and compare against the description.
- [ ] Save a version in history after each phase; write Foundation_Skill and Component_Skills per group.
- [ ] `tokens.json > recolor_readiness.ready` is true (0 raw hex in Semantic/Brand tokens) and a test run of `tools/recolor.py` on the brand ramp shows no NEW contrast failures.
- [ ] `data/tokens.json`, `component-registry.json`, `rules.json`, `screen-templates.json` and `docs/decisions.md` are generated for the new DS.
- [ ] `python tools/fix_tokens.py <folder>` returns an empty plan (0 operations).
