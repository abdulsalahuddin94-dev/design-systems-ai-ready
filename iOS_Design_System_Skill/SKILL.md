---
name: ios-design-system-builder
description: Main skill for building a new iOS design system in Figma from scratch (Scenario A), from existing iOS UI (Scenario B) or for an AI-ready refactor (Scenario C). Defines the file structure, build order, Apple HIG token architecture (iOS semantic color roles, text styles with Dynamic Type, pt spacing, continuous radius, Liquid Glass materials), SF Symbols icon rules, required components and states, and the mistakes to avoid - learned from studying the Trianglz iOS Design System. Independent from the Web and Android skills. Load with figma-use, figma-generate-library and figma-swiftui before creating anything; save the project's skills under [Root]\My Projects\[Project]_iOS\.
---

# iOS Design System Builder (Main Skill)

Reference implementation studied: **Trianglz - IOS Design System** (`Trianglz_iOS/` in the Root; Figma template link in `References.md`).
Copy its **structure and its Apple-aligned type scale**. Do **not** copy its mistakes (section 9): most of its components are unmodified Apple UI Kit copies bound to remote Apple variables.
Platform: iOS / iPadOS 26, Apple Human Interface Guidelines, SF Pro, points (pt).
Node IDs quoted in the Trianglz skills are valid in the original Trianglz file only. In a duplicated template or any other file, find pages, component sets, styles and variables by **name**.

**Tools and generic skills (figma-console).** The Figma tool (Desktop Bridge or FigCli) is picked in Intake section 0b (`status.json > figma.tool`), which also says when to suggest the other one. Work runs through figma-console `figma_execute` (plain Plugin API) when the official `use_figma` server is not connected. figma-use and figma-generate-library are still loaded for their rules, but their helper APIs (`figma.createAutoLayout`, `node.set`, `node.query`) do not exist in figma-console and fail with "not a function": use `figma.createFrame()` + `layoutMode`, `appendChild`, `setBoundVariable` directly. Call `resize()` before setting auto layout sizing to AUTO/HUG (resize resets it to FIXED), and re-apply `componentPropertyReferences` after cloning a variant. The Trianglz page layout (section 1) and the intake checkpoints (Design_System_Intake_Skill section 8) override figma-generate-library's page skeleton and its per-phase checklist posts.

**Knowledge base (JSON, source of truth for exact values):** every DS folder has `data/tokens.json` (variables per mode, aliases, shade-scale curves, recolor readiness), `data/component-registry.json` (components, variants, properties, tiers), `data/rules.json` (numeric rules: contrast, touch targets, icon sizes, spacing, recolor) and `data/screen-templates.json` (Login, Sign up, OTP, List, Detail, Form, Settings, Empty state), plus `docs/decisions.md`. Read values from these files instead of copying numbers into skills; the reference versions are in `Trianglz_iOS/data/`. Tools: `tools/build_tokens.py`, `tools/recolor.py` (see `tools/README.md`).

---

## 0. Both + Native projects (Abdul, 2026-09-30)

When intake 1.3 answers **Native** for Both, this skill builds only the iOS half: `<Project> iOS Design System` in `My Projects/<Project>_iOS/`, with its own Semantics (System Background, Label, Separator...), Dynamic Type text styles, SF Symbols icons and pt units. The Android half is a separate system built with `Android_Design_System_Skill` in `<Project>_Android/`; never reuse its names, files or components.
- Optional Brand Foundation (`<Project> Brand Foundation`, Primitives only): copy its Primitives into this file's local Primitives collection (same names and values), never enable it as a library. A brand change goes into the Brand Foundation first, then `tools/recolor.py` on this folder.
- The iOS Design file (`<Project> iOS`) enables only the iOS DS library. The file check rejects the Android library in it.
- `status.json`: `mobile_setup: native`, `sibling_project: My Projects/<Project>_Android/`, `figma.brand_foundation` when used.
- **Cross-platform** (one shared design) is not this path: one DS in `<Project>_Mobile/`; this skill applies there only when intake 1.5 chose Apple HIG as the base.

## 1. File structure (pages, in this order)

```
Cover
------------------------
⭐Setup
➜ Layout Grid                (iPhone 402x874 + iPad grids, safe areas)
➜ Colors                     (↳ Primitives, ↳ Brand, ↳ Semantic - Light and Dark swatch frames, all bound)
➜ Typography                 (text styles + Dynamic Type table)
➜ Spacing
➜ Radius
➜ Materials & Shadows        (Liquid Glass, blur, shadow effect styles)
➜ Icons                      (SF Symbols-style Icon set)
➜ App Icon                   (1024 master + required sizes)
➜ App Store Screenshots      (6.9", 6.5", 13" iPad)
➜ Keyboards                  (system keyboards for mockups)
-----
⭐Form Elements
➜ Text Fields                (Input, Secure, Search field, Text area)
➜ Selection                  (Toggle, Checkmark row, Checkbox/Radio only for brand forms)
➜ Pickers                    (Date & time, wheel, menu picker)
➜ Segmented Controls, Sliders & Steppers
-----
⭐Navigation
➜ Buttons                    (Bordered Prominent, Bordered, Borderless, Glass, Glass Prominent, Destructive)
➜ Navigation Bars & Toolbars (Toolbar - Top, Toolbar - Bottom, Back button)
➜ Tab Bar
➜ Sidebar (iPad)
➜ Action Sheets & Alerts
➜ Menus & Context Menus
-----
⭐Data display
➜ Lists & Cells              (inset grouped, plain, swipe actions)
➜ Cards, Badges & Avatars
➜ Sheets & Popovers
➜ Progress & Activity
➜ Banners & Empty States
➜ System UI                  (status bar, home indicator, Face ID, share sheet - mock only)
-----
```

### Group routing rule
| Request is about... | Goes under | iOS examples |
|---|---|---|
| Tokens, type, materials, grid, icons, app icon, keyboards | **⭐Setup** | new color role, Dynamic Type size, glass style |
| Anything the user **enters or chooses data** with | **⭐Form Elements** | text field, secure field, toggle, picker, segmented control, slider, stepper, search field |
| Any **action** or **movement between screens** | **⭐Navigation** | buttons, nav bar, toolbar, tab bar, sidebar, alerts/action sheets, menus |
| Anything that **displays information** | **⭐Data display** | lists/cells, cards, badges, sheets, progress, banners, system UI mocks |

- `⭐` pages empty group headers; `➜` topic pages; separators empty pages. No stray spaces (the reference has ` ➜ Colors System`, `➜  Buttons`, `⭐Navigation `).
- One documentation frame per component family (Header band + Content: title, description, component set), plus **Light and Dark preview frames** of instances with the Semantic mode switched (the reference does this correctly only on Input and Tab Bar).

## 2. Build order (each layer only uses the layers before it)

1. **Primitives** - raw palette, **1 mode** (Apple system grays and hues + brand ramp).
2. **Semantic** colors aliased to Primitives, modes **Light / Dark** (optionally Increased Contrast).
3. **Spacing, Radius, Typography** variables (Typography with **Dynamic Type modes**).
4. **Styles**: text styles bound to Typography vars; effect styles for Liquid Glass, blur and shadows; grid styles.
5. **Icons** (atoms), then components **Atoms -> Molecules -> Organisms -> Patterns**.
6. **Documentation pages** linked to variables/styles.
7. **Audit** (audit-design-system) + write the project skills (Foundation_Skill + Component_Skills per group).
Before each component: state tier, list dependencies, build missing lower tiers first, post the atomic structure map.

## 3. Token architecture (iOS naming)

### Primitives (1 mode, no scopes, hidden from publishing)
- `gray/{1..6}` + `gray/base` mapped to Apple systemGray..systemGray6 values (light) and a dark ramp, `white`, `black`.
- System hues with Apple values at the key step: `blue #007AFF, green #34C759, red #FF3B30, orange #FF9500, yellow #FFCC00, purple #AF52DE, pink, teal, indigo, cyan, mint, brown` (+ dark variants: blue #0A84FF, green #30D158, red #FF453A...).
- Brand ramp `brand/{50..950}`; **alpha primitives** `alpha/black-{10,20,30,40,50}` and `alpha/white-*` (needed for fills, separators, scrims).
- Lowercase, no double spaces, no typos.

### Semantic (modes Light / Dark) - mirror Apple UIKit/SwiftUI roles
| Group | Roles (Apple name in brackets) | Scope |
|---|---|---|
| label | primary (label), secondary (secondaryLabel), tertiary, quaternary, placeholder (placeholderText), link, on-tint | TEXT_FILL |
| background | primary (systemBackground), secondary, tertiary; grouped-primary (systemGroupedBackground), grouped-secondary, grouped-tertiary; elevated variants | FRAME_FILL, SHAPE_FILL |
| fill | primary..quaternary (systemFill...) - alpha grays for controls | FRAME_FILL, SHAPE_FILL |
| separator | default (separator, alpha), opaque (opaqueSeparator) | STROKE_COLOR, SHAPE_FILL |
| tint | accent (brand / tintColor), accent-pressed | all fills + text |
| icon | primary, secondary, tertiary, disabled, tint, on-tint | FRAME_FILL, SHAPE_FILL, STROKE |
| status | {info, success, warning, danger}/{text, background, border, icon} (systemBlue/Green/Orange/Red) | per role |
| overlay | scrim (alpha black 40% light / 60% dark) | FRAME_FILL |
- Code syntax **iOS** on every variable: `Color.labelPrimary` / `UIColor(named: "labelPrimary")` (or SwiftUI `Color(.label)` where it maps 1:1 to a system color). Description on every variable. Never ALL_SCOPES.
- Contrast: label/secondary >= 4.5:1 on backgrounds; tint text >= 4.5:1; focus/border >= 3:1 (the reference's Borders/Focus blue-400 fails).

### Typography - Apple text styles (1 variable per style per property)
`font-size/{large-title, title-1, title-2, title-3, headline, body, callout, subheadline, footnote, caption-1, caption-2}`, `line-height/{same}`, `letter-spacing/{same}` (**local**, not remote), `font-weight/{regular, medium, semibold, bold}`, `font-family/{display, text}` = SF Pro.
Default (Large) values: 34/41 +0.40 · 28/34 +0.38 · 22/28 -0.26 · 20/25 -0.45 · 17/22 -0.43 (headline semibold) · 17/22 -0.43 · 16/21 -0.31 · 15/20 -0.23 · 13/18 -0.08 · 12/16 0 · 11/13 +0.06 (Apple Caption 2 is **11/13**; the reference uses 10/12).
**Dynamic Type**: modes `xSmall, Small, Medium, Large (default), xLarge, xxLarge, xxxLarge` (+ `AX1..AX5` for accessibility) on the Typography collection, values from Apple's Dynamic Type table.

### Spacing (pt) - `space/{0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48}` + `space/margin-compact 16`, `space/margin-regular 20`, `space/list-row-inset 16`. Scopes GAP + WIDTH_HEIGHT (padding allowed). Names spelled right (`spacnig` in the reference).
### Radius - `radius/{none 0, xs 4, sm 8, md 12, lg 16, xl 20, xxl 26, sheet 38, full 999}` with usage descriptions (md fields/cells groups, xxl alerts, sheet sheets/cards in iOS 26). Apply **corner smoothing ~60%** (continuous corners).
### Opacity - `opacity/disabled` 0.3-0.4 (Apple dims disabled content, not recolors).

## 3b. Recolor-ready colors (Abdul's rule: a color change must update every shade cleanly)

Build rules (every new DS):
- Primitives hold the only raw colors. Each hue is a full shade scale with fixed step names (50 ... 950 for brand, Apple key step for system hues); a brand color is a ramp, never a single swatch.
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
- **Text styles** `{Style}/{Regular|Emphasized}` (22), all properties bound (size, line height, tracking, weight, family). Description `17pt / 22pt / Semibold · SwiftUI .headline`.
- **Effect styles**: `glass/regular`, `glass/prominent`, `glass/clear` (Liquid Glass recipe: glass/background blur + inner highlight), `blur/thin|regular|thick` materials, `shadow/popover`, `shadow/sheet`, `shadow/card`, `focus-ring` (iPad keyboard focus). Bind colors where possible.
- **Grid styles**: `Grid/iPhone 402` 4 col / 16 margin / 12 gutter, `Grid/iPhone landscape`, `Grid/iPad 820` (12 col / 20-24 margin), plus safe-area guides (status bar 62, home indicator 34 on Face ID iPhones).
- No color styles.

## 5. Icons
- `Icon/<Name>` component set in **SF Symbols style** (export the real symbols from the SF Symbols app into vectors, or draw matching glyphs), variants `Style = Outline | Fill`, weights matching text (Regular default), sizes 17/22/24/28pt frames with symbol centered on the text baseline.
- Colors bound to `icon/*`; exposed through INSTANCE_SWAP (leading/trailing icon on buttons, fields, rows, tab items with `Icon` + `Icon (selected)`).
- Never text glyphs (private-use SF Symbols characters) - they vanish without SF Pro and cannot be swapped (reference mistake).

## 6. Component conventions
- Names `Family / Variant`, Title Case; no `_` prefix for public components (use `_` or `.` only for private building blocks and keep them on a Building Blocks frame).
- Properties: `Style`, `Size`, `State` (Default, Pressed, Disabled, Focused - iPad; no Hover on iPhone), `Selected`/`Is On`, `Role` (Default, Cancel, Destructive). **Never a `Mode=Light|Dark` variant** - dark is a variable mode.
- TEXT for every string, BOOLEAN for optional parts, INSTANCE_SWAP for icons, SLOT for sheet/alert content; every property wired.
- 100% bound: fills, strokes, padding, gap, radius, text styles, effect styles; **0 remote** variables, styles or components (copy Apple kit parts only after re-binding them to local tokens).
- Touch targets **44x44pt** minimum; list rows 44pt min (52-60 with subtitle).
- Disabled = content at `opacity/disabled` or Apple disabled label colors.

### Required inventory and states (iOS)
| Tier | Component | Variants / states |
|---|---|---|
| Atom | Button | Bordered Prominent, Bordered, Borderless, Glass, Glass Prominent · Small 28 / Medium 34 / Large 50 · Title, Icon, Title+Icon · Default, Pressed, Disabled · Role Destructive |
| Atom | Toggle (Switch) | On/Off x Default, Pressed, Disabled |
| Atom | Checkmark / Checkbox / Radio | Selected, Unselected, Disabled (checkbox/radio only for brand forms) |
| Atom | Tab item, Segment, Page dots, Badge, Avatar, Separator, Grabber, Icon | Selected/Default, Disabled |
| Molecule | Text field (+ Secure, Search, Text area) | Empty, Focused, Filled, Error, Disabled · label, helper, error, clear button |
| Molecule | Segmented control, Stepper, Slider, List cell (default, subtitle, value, toggle, disclosure, swipe actions), Menu item | per HIG |
| Organism | Navigation bar (inline, large title), Bottom toolbar, Tab bar (2-5, search role, minimized), Sidebar, Alert (side-by-side / stacked), Action sheet, Sheet (medium/large detents), Popover, Context menu, Date picker (compact/inline/wheel) | |
| Pattern | Sign in, OTP, list/settings, detail, map, onboarding | |

## 7. Theming and adaptivity
- Dark mode = Semantic mode Dark on the frame; optional Increased Contrast mode.
- **Single-mode systems** (intake 0.4 = Light only or Dark only): the Semantic collection has one mode named after the answer (`Light` or `Dark`). Every "Light and Dark" requirement in this skill, the intake checkpoints, the audits, the docs pages and the Storybook quality bar means "each mode the project has": no second preview frame, one swatch frame per collection, screenshots in that mode only, contrast checked against that mode's surfaces only.
- Dynamic Type = Typography mode; layouts must reflow at AX sizes (stack instead of truncate).
- Size classes: compact vs regular width (iPhone vs iPad); iPad adds sidebar, popovers, keyboard focus.

## 8. Documentation pages (linked, never static)
- ➜ Colors: Primitive and Semantic **Light and Dark swatch frames**, every swatch bound, card named with the variable path, hex label from the resolved value; also document icon/fill/separator roles.
- ➜ Typography: every sample uses its style; a Dynamic Type table from the real mode values.
- Spacing, Radius, Materials pages show the real variables/styles (reference pages were static and wrong: xxl 48 vs 40, Full 999 vs 99).

## 9. Mistakes found in Trianglz iOS - never repeat them
1. Components copied from Apple's iOS 26 UI Kit still bound to **30 remote Apple variables** (`Labels/Primary`, `Fills/Tertiary`, `Accents/*`...) and remote text styles/components (Liquid Glass, Menu, _Buttons).
2. Dark mode as `Mode=Light|Dark` variants and remote collection modes.
3. SF Symbols drawn as **text glyphs**; almost no icon library (`Component 1`, `akar-icons:check`).
4. Semantic set missing Apple roles: separator, fills, grouped/elevated backgrounds, quaternary label, scrim (no alpha primitives).
5. Letter spacing bound to a remote variable; no Dynamic Type modes; Caption 2 10pt instead of 11.
6. Primitive and Brand collections with identical Light/Dark modes; Brand ALL_SCOPES.
7. Typos and spacing in names: `spacnig`, `Raduis`, `Typography ` , `Primary Blue  500`, `Brand  secondary`, `Status4`, `disabled (selected)`, `State=filled`, `Property 1`.
8. Radius bound to a spacing variable; padding bound to a GAP-only variable; remote Web tokens (`p_0`, `rounded_none`) inside the Input.
9. No effect styles (glass/shadows raw); one grid style only.
10. Static, wrong documentation (unbound swatches, unstyled type samples, spacing/radius tables that disagree with variables); misnamed doc frames.
11. Duplicate sets (RadioButton on two pages); navigation organisms (nav bar, toolbar) placed in Form Elements.
12. Missing components: segmented control, stepper, slider, text area, secure field, list cells, cards, badges, banners, sidebar.
13. Non-native checkbox/radio used without guidance; 20pt controls without 44pt hit areas.
14. Focus border contrast < 3:1.

## Screens (Design files)
- Screens are built only from the published DS library, section by section (figma-generate-design + figma-use + ui-ux-pro-max), at the sizes in Design_System_Intake_Skill section 7d.
- **Screen fidelity (Abdul's rule):** follow Design_System_Intake_Skill section 7f (`Design_System_Intake_Skill/steps/screens.md`): screen spec from every source image first, real content in every instance, one section per script, side-by-side check after each screen (run in ds-auditor), `tools/check_screens.figma.js`, checkpoint stays `Ready for review` until the user approves.
- **Multi-screen flows (Abdul's rule):** follow Design_System_Intake_Skill section 7e (`steps/screens.md`) in order: approved gap table, missing components in the DS file, publish + Accept updates + verify, screens one by one with a Design file audit after each, changelog + Storybook question.
- **Scenario C, imperfect DS + Design file (Abdul's rule):** follow Design_System_Intake_Skill section 7 (`steps/brownfield-3-scenario-c.md`) in order: Variable Map, DS fixes (safe ones as Fix on create, the rest after approval) + publish, screen-by-screen audit report, raw-value rules, fixes after approval, log + Accept updates. iOS mapping: colors map to the Apple semantic roles in section 3 (System Background, Label...), text to the Dynamic Type text styles, spacing to the pt scale; a fixed font size that should scale with Dynamic Type is flagged.
- **Design file audit (Abdul's rule, every time screens are built or changed):** run audit-design-system (ds-auditor, `screens` mode) on that Design file to confirm it really uses the DS: library components only (no local copies, detached instances or hand-drawn parts), library variables and styles only (no raw values, no variables used for the wrong purpose), latest library version. Fix what it finds, save the report in `<Project folder>/audits/`, and log the result in `CHANGELOG.md` (`Design file audit: <numbers>, report <path>`).

## 10. Final QA checklist
- [ ] 0 remote variables, styles and components; 0 raw fills/strokes/padding/gap/radius/effects in components.
- [ ] Every variable: scope, iOS code syntax, description. Every set: description, Title Case props, wired props, no `Mode` variant.
- [ ] Apple semantic roles present (label 1-4, background + grouped 1-3, fill 1-4, separator, tint, scrim, status).
- [ ] Typography: local tracking, Dynamic Type modes, styles fully bound.
- [ ] Icons are SF Symbols-style instances with swap properties; colors from `icon/*`.
- [ ] Touch targets >= 44pt; contrast text >= 4.5:1, UI >= 3:1 in each mode the project has.
- [ ] Light and Dark preview frames per family; Colors/Typography docs linked.
- [ ] Screenshot every variant (light + dark) and compare with the description.
- [ ] Save a version after each phase; write Foundation_Skill and Component_Skills per group.
- [ ] `tokens.json > recolor_readiness.ready` is true (0 raw hex in Semantic/Brand tokens) and a test run of `tools/recolor.py` on the brand ramp shows no NEW contrast failures.
- [ ] `data/tokens.json`, `component-registry.json`, `rules.json`, `screen-templates.json` and `docs/decisions.md` are generated for the new DS.
- [ ] `python tools/fix_tokens.py <folder>` returns an empty plan (0 operations).
