---
name: trianglz-foundation
description: Use before building, extending, auditing or coding anything with the Trianglz Web Design System (Figma file 7qsOqckanKwGDbkljD3rb9). Defines the foundations from the ⭐Setup page group - variable collections and modes (Primitives, Semantic Light/Dark, Typography and Spacing Desktop/iPad/Mobile, Radius), text styles, effect styles, layout grid, icon library - plus the conventions for creating new tokens and components. Load it together with any Trianglz Component_Skills.
---

# Trianglz Web DS - Foundation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../data/component-registry.json`, `../data/rules.json`, `../data/screen-templates.json`, and `../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

Source: ⭐Setup pages of `Trianglz - Web Design System` (➜ Layout Grid, ➜ Typography, ➜ Colors, ➜ shadows,
➜ Corner Radius & spacings, ➜ Icons). Read through the Figma Desktop Bridge; every documentation frame was
also checked visually (screenshots in `references/screens/`). Platform: **Web, Tailwind conventions**.

Reference files:
- `references/variables.md` - every variable with all mode values and scopes.
- `references/gaps.md` - foundation audit (what is not tokenized or inconsistent).
- `references/screens/*.png` - the Setup documentation frames.

Component skills that build on this: `Component_Skills/Form_Elements_Skill`, `Component_Skills/Navigation_Skill`,
`Component_Skills/Data_Display_Skill`.

---

## Update 2026-09-29 (gap fixes applied in Figma - overrides older details below)

- All variables have WEB code syntax `var(--path-with-dashes)` (e.g. `var(--color-text-primary)`, `var(--space-4)`).
- Scopes fixed: line-height LINE_HEIGHT, letter-spacing LETTER_SPACING, font weight FONT_STYLE, family FONT_FAMILY; no ALL_SCOPES left.
- Text styles bind **line height** to `line-height/*` and **letter spacing** to new size-keyed `letter-spacing/{xs..6xl}` variables (xs +0.2, sm/base 0, lg/xl -0.2, 2xl -0.4, 3xl -0.6, 4xl -0.8, 5xl -1, 6xl -1.2).
- `color/bg/overlay` is a real scrim: Light = `alpha/black-50` (gray-900 at 50%), Dark = `alpha/black-70` (new alpha primitives).
- New Semantic tokens: `color/icon/{default, strong, muted, brand, inverse, error, warning, success, info}` and `color/border/input` (gray/400 · gray/500) for form-control borders.
- `color/text/muted` and `color/text/placeholder` are now gray/500 (Light) / gray/400 (Dark) for contrast.
- New effect styles: `focus-ring` (inputs: shadow-sm + 2px inner blue ring) and `focus-ring-offset` (buttons/controls: 2px bg gap + 4px blue ring). Raw focus colors (binding effect colors to variables made exports hang).
- Grid styles: `Grid/Desktop 1440` (12/80/24), `Grid/iPad 768` (8/32/16), `Grid/Mobile 375` (4/16/16).
- Icons renamed `Icon/<Name>` (Add, Chevron Left/Right/Down, Edit, Upload, Download, Log In/Out, Eye, Eye Off, Delete, Share, Language, Close, Arrow *, Phone, Bell, Mail, Export, Check, Check Circle, Close Circle, Question, Alert Circle, Info, Cancel, Warning, Clock, Calendar, Search, File, User, Users, Minus); fills bound to `color/icon/default` (Close: `color/icon/strong`).
- No remote variables/styles remain in components; dark-mode duplicate component sets were removed (dark previews are instances in Dark-mode frames).
- Restore points in version history: "Before AI gap fixes (Claude)" and later checkpoints.

## 0. File structure (page order in Figma)

The file is organised as groups: a `⭐` header page (empty, acts as a group title), then `➜` pages for each topic,
then a separator page (`-----`, `--`) before the next group. Keep this order and naming when adding pages.

| # | Page | Content |
|---|---|---|
| 1 | Cover | File cover frame |
| 2 | `-----------------------------` | separator |
| 3 | **⭐Setup** | group header (foundations) |
| 4 | ➜ Layout Grid | grid documentation (Desktop 1440 / iPad 768 / Mobile 375) |
| 5 | ➜ Typography | type scale table + Responsive Typography table |
| 6 | ➜ Colors | Primitive + Semantic color docs, each in Light and Dark frames |
| 7 | ➜ shadows | effect style docs |
| 8 | ➜ Corner Radius & spacings | spacing table + radius table |
| 9 | ➜ Icons | 39 icon components grouped: Actions, Arrows, Communication, Status & Feedback, Input Fields, Users |
| 10 | `-----` | separator |
| 11 | **⭐Form Elements** | group header |
| 12 | ➜ Input Fields and Dropdown | Input / Text, URL, Card Number, OTP, Stepper, Upload Field, Search |
| 13 | ➜ Text Area | Textarea |
| 14 | ➜ Checkboxe | Checkbox (light + dark showcase) |
| 15 | ➜ Toggles | Toggle (light + dark showcase) |
| 16 | ➜ Radio Buttons | Radio (light + dark showcase) |
| 17 | `---------------------` | separator |
| 18 | **⭐Navigation** | group header |
| 19 | ➜ Buttons & links | Button (320 variants) + architecture diagram |
| 20 | ➜ Paganation & Tabs | Pagination / Item, Tabs items, example bars |
| 21 | `--` | separator |
| 22 | **⭐Data display** | group header |
| 23 | ➜ Avatars & upload image | Avatar, Avatar Upload (light + dark) |
| 24 | ➜ Tooltips | Tooltip (light + dark) |
| 25 | ➜ Banners & Badges | Alert, Badge (light + dark) |
| 26 | ➜ Popups | Confirmation Popup |
| 27 | ➜ Favicon | favicon guidance |
| 28 | `--` | separator |

Verified against the file on 2026-09-29. Exact page names contain stray spaces: `➜ Colors ` (trailing),
`⭐Navigation ` (trailing), `➜  Buttons & links` (double space), `➜ Favicon ` (trailing). Exceptions to the frame
convention: ➜ Paganation & Tabs holds everything in one frame named `Frame 1`; ➜ Popups has the component set
directly on the page (no documentation frame, no dark showcase); ➜ Colors has 4 frames (Primitive Light, Primitive
Dark, Semantic Light, Semantic Dark).

On each component page: one documentation frame per component family, titled with the family name (Poppins
2xl/Semi Bold), containing the component set inside a dashed purple frame (Figma's default set styling); dark
showcase = a copy of that frame with the Semantic collection set to Dark.

## 0b. Build order

Each layer is built only from the layer before it:
1. **Primitives** - the raw values (color palette).
2. **Semantic** variables - built on (aliased to) the Primitives, Light / Dark.
3. **Spacing, Radius and Typography** variables (Desktop / iPad / Mobile where responsive).
4. **Styles** built from those variables - text styles (bound to Typography variables) and effect styles.
5. **Components** built on the variables and styles, bottom-up: Atoms, then Molecules, then Organisms, then Patterns.
   (Icons are atoms built right after the styles; grid styles support layout.)
6. **Audit** - run audit-design-system, then update the skills and their gaps files.

## 1. Architecture at a glance

```
Primitives (raw palette, 1 mode, hidden from pickers)
   └─ aliased by ─> Semantic (color roles, Light / Dark)
                        └─ bound by ─> components
Typography (Desktop / iPad / Mobile) ─> text styles ─> components
Spacing    (Desktop / iPad / Mobile) ─> padding / gap / sizes
Radius     (1 mode)                  ─> corner radius
Effect styles (Tailwind shadow scale, raw values)
Icons: 39 local 24x24 icon components (Solar "Linear" style)
```

| Collection | Vars | Modes | Scopes | Role |
|---|---|---|---|---|
| Primitives | 86 | Value | none (hidden from pickers) | Tailwind-like palette: black and white, gray, blue, red, yellow, green, purple, Orange (0, 50-950) |
| Semantic | 69 | Light, Dark | set per role | All UI color. Always bind components here |
| Typography | 32 | Desktop, iPad, Mobile | FONT_SIZE for sizes; line-height/letter-spacing have none | Sizes, line heights, tracking, family, weights |
| Spacing | 24 | Desktop, iPad, Mobile | WIDTH_HEIGHT, GAP | Tailwind spacing scale `space/0`...`space/64` |
| Radius | 9 | Default | CORNER_RADIUS | `radius/none`...`radius/full` |

No color styles and no grid styles exist; color is variables only.

---

## 2. Color (Semantic)

Naming: `color/{group}/{role}` with groups:
- `text/*`: primary, secondary, muted, disabled, inverse, placeholder, error, warning, success, info, link, link-hover. Scope TEXT_FILL.
- `bg/*`: primary, secondary, muted, subtle, inverse, error, warning, success, info, overlay. Scope FRAME_FILL + SHAPE_FILL.
- `border/*`: default, muted, strong, inverse, focus, error, success, warning, Dark. Scope STROKE_COLOR.
- `btn/{Primary|secondary|Info|danger|success|warning|Neutral}/{bg|text|border|bg-hover|bg-active|light}`. Button-only roles.

Key values (Light -> Dark):

| Role | Light | Dark |
|---|---|---|
| text/primary | gray/900 #020810 | gray/50 |
| text/secondary | gray/600 #4b5563 | gray/400 |
| text/muted, text/placeholder | gray/400 #9ca3af | gray/500 |
| bg/primary | white | gray/950 #020713 |
| bg/secondary / muted / subtle | gray/50 / 100 / 200 | gray/800 / 700 / 800 |
| border/default / strong | gray/200 / 300 | gray/700 / 600 |
| border/focus | blue/500 | blue/400 |
| brand (btn/Primary/bg 2) | blue/600 #2563eb | blue/300 |
| status text | red/600, yellow/600, green/600, blue/600 | red/400, yellow/300, green/400, blue/400 |
| status bg | red/50, yellow/50, green/50, blue/50 | */950 |

Rules:
- Components bind to **Semantic only**; Primitives are never bound directly (they have no scopes, so they don't appear in pickers).
- Brand color is **blue/600** (`color/btn/Primary/bg 2`). There is no dedicated `color/brand/*` group.
- Choose by role, not by look: body copy `text/primary`, supporting copy `text/secondary`, hints `text/muted`, surfaces `bg/primary` then `bg/secondary`, dividers `border/default`.
- Dark mode = set the `Semantic` collection to `Dark` on the top frame. Never duplicate components for dark.
- There are **no icon color tokens** (`color/icon/*`). The icon library uses `color/border/inverse`; component icons use `text/*`. Until icon tokens exist: neutral icons `text/secondary`, brand/action icons `btn/Primary/bg 2`, status icons the matching `text/{status}`.

## 3. Typography

Font **Poppins**, weights Regular 400, Medium 500, Semi Bold 600, Bold 700 (a `Light` weight variable exists but no styles use it).
40 local text styles named `{size}/{weight}`: sizes `xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl`, weights `Regular, Medium, Semi Bold, Bold`.

| Size | Desktop | iPad | Mobile | Line height (style) | Tracking (style) | Tailwind |
|---|---|---|---|---|---|---|
| xs | 12 | 12 | 12 | 16 | +0.2 | text-xs |
| sm | 14 | 12 | 12 | 20 | 0 | text-sm |
| base | 16 | 14 | 14 | 24 | 0 | text-base |
| lg | 18 | 16 | 16 | 28 | -0.2 | text-lg |
| xl | 20 | 18 | 18 | 28 | -0.2 | text-xl |
| 2xl | 24 | 22 | 20 | 32 | -0.4 | text-2xl |
| 3xl | 28 | 24 | 24 | 36 | -0.6 | (custom: Tailwind is 30) |
| 4xl | 32 | 28 | 28 | 40 | -0.8 | (custom: Tailwind is 36) |
| 5xl | 40 | 36 | 32 | 48 | -1 | (custom: Tailwind is 48) |
| 6xl | 48 | 44 | 40 | 60 | -1.2 | (custom: Tailwind is 60) |

Styles bind font size, family and weight to Typography variables, so switching the frame's Typography mode to iPad/Mobile resizes text.
Line height and tracking are fixed in the style (not bound), see gaps.

Usage conventions observed in components: labels `sm/Medium`, body/values `sm/Regular`, hints and captions `xs/Regular`,
large numerals `2xl/Semi Bold`, section/page titles `2xl`-`4xl` Semi Bold/Bold.

## 4. Spacing, radius, grid

Spacing `space/{n}` = Tailwind scale (n x 4px) on Desktop, compressed on iPad/Mobile from `space/5` upward
(e.g. `space/6` 24/22/18, `space/8` 32/28/24, `space/16` 64/52/40). Values 0-4 (0-16px) never change, so use them for
component internals and `space/5+` for layout rhythm. Tailwind: `p-{n}`, `gap-{n}`.

Radius: `none 0 · sm 2 · base 4 · md 6 · lg 8 · xl 12 · 2xl 16 · 3xl 24 · full 9999` (Tailwind `rounded-*`).
Documented usage: `base` default, `md` small cards, `lg` cards and inputs, `xl` panels, `2xl` modals, `full` pills and avatars.

Layout grid (documented only, no grid style exists):

| Breakpoint | Frame | Columns | Margin | Gutter | Column |
|---|---|---|---|---|---|
| Desktop | 1440 | 12 | 80 | 24 | 84.7 |
| iPad | 768 | 8 | 32 | 16 | 74 |
| Mobile | 375 | 4 | 16 | 16 | 73.8 |

Set Typography and Spacing variable modes to match the frame (Desktop / iPad / Mobile).
Tailwind: container with `px-4 md:px-8 xl:px-20`, `grid-cols-4 md:grid-cols-8 xl:grid-cols-12`, `gap-4 xl:gap-6`.

## 5. Elevation (effect styles)

11 local effect styles, exact Tailwind values: `shadow-none, shadow-2xs, shadow-xs, shadow-sm, shadow-md, shadow-lg,
shadow-xl, shadow-2xl, inset-shadow-2xs, inset-shadow-xs, inset-shadow-sm`. Colors are raw black (not variables).
Suggested use: `xs/sm` inputs and cards at rest or hover, `md` dropdowns and popovers, `lg/xl` modals and dialogs, `2xl` rare hero surfaces.
There is **no focus-ring style**; the components draw it as a raw 2px blue-500 inner shadow.

## 6. Icons

39 local components on ➜ Icons, all **24x24**, outline style (Solar "Linear"), grouped:
- Actions: Add, left, right, edit, upload, download, log out, log in, Eye (opened), Eye (closed), delete, share, language, Close Icon
- Arrows: Arrow Left, Arrow Right, Arrow Down, Arrow Up, Arrow Left Down, Arrow Right Down, Arrow Left Up, Arrow Right Up
- Communication: Phone Rounded, Bell, Letter (plus Export)
- Status & Feedback: check, close, question, danger, info, cancel, Exclamation mark
- Input Fields: clock, calendar, search, file
- Users: user, users

Color: the union fill is bound to `color/border/inverse` (child vectors hold a masked raw #1c274c).
Rules: always reuse these icons as instances, expose them through instance-swap properties, recolor by overriding the fill with a Semantic token, and add missing icons in the same Solar Linear style (Web platform default would be Lucide; keep Solar for consistency with this file).

---

## 7. Atomic hierarchy (standing project rule)

Every component belongs to one tier and is built only from lower tiers:
- **Atoms**: built from tokens only (may contain Icon instances). Button, Checkbox, Radio, Toggle, Badge, Avatar, Tab item, Pagination item, Tooltip, code field, Icon.
- **Molecules**: nest atoms only, strict auto layout. Input fields, Search, Upload Field, Textarea, OTP group, Stepper, Alert banner, upload image, (to build) Tab bar, Pagination bar, Breadcrumb, Toast.
- **Organisms**: nest molecules/atoms, expose nested instance properties at the top level. Confirmation Popup, (to build) Dropdown menu, Top bar, Nav bar.
- **Patterns**: responsive auto-layout frames of organisms (sign-up form, OTP form, list pages).

Before building anything: state its tier, list its dependencies, build any missing lower-tier component first, then assemble with nested instances and exposed properties.

## 7b. Documentation pages must be linked (standing rule)

- **➜ Colors**: every swatch rectangle is bound to its variable (card frame named with the exact variable path). Primitive
  and Semantic docs each have a Light frame (Semantic mode Light) and a Dark frame (Semantic mode Dark). When a new
  color variable is added, add its swatch card to both frames, bound to the variable, and refresh the hex label.
- **➜ Typography**: every sample uses its text style, and the text keeps font family, size, weight and line height bound to
  Typography variables through the style. New styles get a sample row.
- Verified 2026-09-29: all 86 primitive and 79 semantic swatches bound in both modes (icon colors and border/input added);
  all 40 samples use their styles with bound variables.

## 8. Conventions for building new things in this file

1. **New color**: add the raw value to Primitives only if the palette lacks it, then create a Semantic alias with a role name in the right group and both Light and Dark values; set scopes (TEXT_FILL / FRAME_FILL+SHAPE_FILL / STROKE_COLOR). Don't add more `btn/*` groups; propose `color/icon/*` and `color/brand/*` instead.
2. **New component**: bind every fill/stroke to Semantic, every padding/gap to `space/*`, every radius to `radius/*`, every text to a text style, every shadow to an effect style. No raw values, no remote variables.
3. Variant property named `State` (plus `Size`, `Type` etc.), values in Title Case (`Default, Hover, Focus, Disabled, Error`). Add a component description with purpose and when to use.
4. Disabled = 50% layer opacity on the whole component (the file's dominant pattern) until a disabled token exists.
5. Icons as instances of the local icon components, with leading/trailing instance-swap properties.
6. Show dark mode by switching the frame's Semantic mode; show responsive variants by switching Typography/Spacing modes.
7. After building, run `audit-design-system` and check against `references/gaps.md`.
