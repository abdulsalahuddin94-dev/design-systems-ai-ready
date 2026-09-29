---
name: trianglz-ios-form-elements
description: Use when building, auditing or coding data-entry controls with the Trianglz iOS Design System (Figma q5nQHGEGzZ94WN0wilJwLW) - text input, checkbox, radio, toggle (switch), date and time pickers, toolbars and search fields. Covers only the ⭐Form Elements group; tells the agent which component and variant to use on iOS, how it is tokenized and where it departs from Apple HIG.
---

# Trianglz iOS DS - Form Elements

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, text styles, file structure, build order, atomic rules).

Scope: **⭐Form Elements** pages only: ➜ Input Fields and Dropdown, ➜ Checkbox, ➜ Radio Buttons, ➜ Toggles, ➜ Date and Time Pickers, ➜ Toolbars & Search. Platform iOS (HIG).
Reference: `references/components.md` (ids, anatomy, tokens per variant), `references/gaps.md` (audit), `references/screens/` (to capture, see gaps).

## 1. Inventory

| Component | Set id | Variants | Tier | Built by | Tokens |
|---|---|---|---|---|---|
| **Input** | 214:7577 | 14 | Molecule | Trianglz | 100% local Semantic + spacing + text styles |
| **Checkbox** | 233:1893 | 5 | Atom | Trianglz | local colors; raw padding/radius |
| **RadioButton** (➜ Radio Buttons) | 2006:974 | 4 | Atom | Trianglz | local colors; raw padding/radius |
| RadioButton (duplicate on ➜ Checkbox) | 233:1916 | 4 | - | duplicate | same as above, delete candidate |
| **Toggle - Switch** | 11:2728 | 8 | Atom | Apple kit | remote Apple colors, raw glass effects |
| **Date and time - Pickers** | 203:8254 | 2 (Compact, Inline) | Organism | Apple kit | remote |
| Date and time - Collapsed | 203:8313 | 2 | Molecule | Apple kit | remote |
| `_Day` / `_Week` | 203:8334 / 203:8326 | 5 / 1 | Atom | Apple kit | remote |
| **Toolbar - Top - iPhone** (navigation bar) | 211:1450 | 5 styles | Organism | Apple kit | mixed |
| **Toolbar - Bottom - iPhone** | 211:1496 | 6 types | Organism | Apple kit | mixed |
| `_Search - Top` / `_Search - Bottom` | 211:1174 / 211:1236 | 6 each (Mode x State) | Molecule | Apple kit | remote |
| `_Button - Text`, `_Button - Text - Prominent`, `_Button - Symbol`, `_Button - Symbol - Prominent`, `_Buttons - Top`, `_Button - Bottom`, `_Back Bar Button Item` | 211:11xx-12xx | 4-8 each | Atom/Molecule | Apple kit | remote |
| `_Title - Large Title / Body / Subheadline`, `_Subtitle - Subheadline / Caption`, `_Page Dots`, `_Toolbar page control` | 211:1292... | 2-35 | Atom | Apple kit | remote |

No dropdown/select, text area, OTP, stepper, segmented control, slider or picker wheel component exists despite the page name "Input Fields and Dropdown".

## 2. Input (Molecule) - the main text field

Properties: `🎲 Type` = Default | Error | Disabled · `🎚️ State` = Default | Focus | filled (lowercase) · `📏 Size` = md (45pt field) | lg (56pt field) ·
BOOLEAN `👁️ IconLeft`, `👁️ IconRight`, `👁️ Description` · TEXT `✏️ Title`, `✏️ Textfield`, `✏️ Description` · INSTANCE_SWAP `⮑ 🔄 iconLeft`, `⮑ 🔄 iconRight` (default `View Icon`). 14 variants (Disabled has no Focus).

Anatomy: vertical stack (gap `spacnig/xxs` 4) = `wrapper` field (fill, 1pt border, padding `spacnig/md` 16, gap `spacnig/sm` 12, radius 12) + helper `Description` (Footnote/Regular).
- Default/empty: placeholder text (`✏️ Title`) in `Text/Placeholder`, Callout/Regular.
- Focus and filled: floating label layout - label (`✏️ Title`, Caption1/Regular) above value (`✏️ Textfield`, Callout/Regular, `Text/Primary Text`).

| Type / State | Field fill | Border | Label | Value / placeholder | Helper |
|---|---|---|---|---|---|
| Default / Default | Backgrounds/Card | Borders/Default 1pt | - | Text/Placeholder | Text/Secondary Text |
| Default / Focus | Backgrounds/Card | **Borders/Focus 1.5pt** | Text/Link Text (brand) | Text/Primary Text | Text/Secondary Text |
| Default / filled | Backgrounds/Card | Borders/Default 1pt | Text/Secondary Text | Text/Primary Text | Text/Secondary Text |
| Error / Default | Backgrounds/Card | Status/Danger/Danger Border 1pt | - | Text/Placeholder | Status/Danger/Danger Text |
| Error / Focus | Backgrounds/Card | Danger Border 1.5pt | Danger Text | Text/Primary Text | Danger Text |
| Disabled / * | **Backgrounds/Group** | Borders/Default | Text/Secondary Text | Text/Secondary Text | Text/Secondary Text |

When to use: every single-line entry (name, email, password with `View`/`Hide` trailing icon, search-like filters inside forms). Use lg (56pt) as default for touch comfort; md only in dense forms (still >= 44pt).
Error message goes in `✏️ Description` with Type=Error. Put the field label in `✏️ Title` (it shows as placeholder until focused - iOS style floating label, not a separate label above the field).

HIG notes: Apple's native text field is a borderless row in a grouped list (inset grouped) or a rounded rect with `tertiarySystemFill`; this outlined card style is a brand choice - keep it consistent. Always pair with a keyboard type (see ➜ Keyboards in Setup: Email, URL, Number Pad, Numeric...).

## 3. Checkbox and Radio (Atoms)

Checkbox `Status` = Default | Checked | Indeterminate | Disabled | `disabled (selected)` · TEXT `Text`.
- 20x20 box, radius 4, 2pt stroke; label Footnote/Regular `Text/Primary Text`, gap 8.
- Default: fill Backgrounds/Card, stroke Icon/Tertiary. Checked/Indeterminate: fill + stroke `Brand Primary`, checkmark vector stroke `Icon/On Brand` 1.75. Disabled: stroke Borders/Disabled, label Text/Disabled Text. Disabled selected: fill/stroke Icon/Disabled.
RadioButton `Status` = Default | Checked | Disabled | **Status4** (= disabled selected) · TEXT `Text`. 20pt circle, 2pt ring, 10pt inner dot `Brand Primary`.

HIG: iOS has **no native checkbox or radio**. Apple uses a checkmark accessory in list rows for single/multi selection, and switches for on/off. Use these only for brand forms (terms acceptance, multi-select in a web-like form) and give them a 44pt hit area (whole row tappable). Prefer list rows with checkmarks for settings-style choices.

## 4. Toggle - Switch (Atom, Apple kit)

Properties: `State` = Idle | Pressed · `Is On` = True | False · `Is Enabled` = True | False · BOOLEAN `Show AX Label` (on/off accessibility glyphs).
64x28 track (iOS 26 size), knob 38x24 white; Pressed shows the Liquid Glass knob (58x38, glass + inner shadows + specular). On = remote `Accents/Green`, Off = remote `Labels/Tertiary`; Disabled = 50% opacity.
Use for immediate on/off settings (no Save button). Tint: Apple default green; switch to `Brand Primary` only if brand requires it (then bind a local token).

## 5. Date and time pickers (Apple kit)

- `Date and time - Pickers` Style = **Compact** (inline row with date/time pills that open a popover) | **Inline** (full month calendar + time row, 370x377, `Backgrounds (Grouped)/Secondary`). Booleans `Show Date`, `Show Time`.
- `Date and time - Collapsed`: the compact row (Month, Year, Time texts; State Default | Selected).
- `_Day` states: Default | Current | Selected | Current and Selected | Null.
Use Compact inside forms/list rows; Inline when choosing a date is the main task of the screen or sheet. No wheel picker component exists.

## 6. Toolbars and search (Apple kit)

- **Toolbar - Top - iPhone** (navigation bar) `Style` = Default | Inline Large | Large Title | Title 2 Line | Title 2 Line Left; slots `Leading`, `Trailing`; BOOLEAN `Show Subtitle`. Use Large Title on top-level tab roots, Default (inline) on pushed screens.
- **Toolbar - Bottom - iPhone** `Type` = Buttons | Buttons + Page Dots | Search | Search with Focus | Search + Trailing Item | Search + Leading Item; slots `Buttons Leading`, `Buttons Trailing`. iOS 26 places search at the bottom on iPhone.
- `_Search - Top/Bottom` State = Placeholder | Typing | Value (TEXT Value, Placeholder).
- Bar buttons: `_Button - Text` / `_Button - Symbol` State = Default | Tinted | Selected | Disabled; Prominent versions = Default | Disabled; `_Back Bar Button Item` (Title, Show Title).
These are organisms that really belong to navigation (see gaps); keep using them from this page until the file is reorganized.

## 7. Choosing a control (iOS)

| Need | Use |
|---|---|
| Free text | Input (lg) + correct keyboard |
| On/off, applies immediately | Toggle - Switch |
| One of 2-5 short options | (missing) segmented control -> build it; for now Radio in a list |
| One of many | List row + checkmark, or a menu (Context Menu) |
| Multi-select | List rows with checkmarks, or Checkbox in brand forms |
| Date / time | Date and time - Pickers (Compact in forms, Inline in sheets) |
| Search | `_Search - Bottom` inside Toolbar - Bottom (iPhone), `_Search - Top` in nav bar |
