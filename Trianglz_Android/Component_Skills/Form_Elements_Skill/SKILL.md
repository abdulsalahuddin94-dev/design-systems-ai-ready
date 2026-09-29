---
name: trianglz-android-form-elements
description: Use when building, auditing or coding data-entry controls with the Trianglz Android Material 3 Design System (Figma JUs2c8IO6ybFcGRZjcQzr9) - text fields (filled/outlined), checkbox, radio, switch, search bar and search views, sliders, date and time pickers, progress and loading indicators. Covers only the ⭐Form Elements group; tells the agent which M3 component and variant to use, how it is tokenized and where it departs from Material 3.
---

# Trianglz Android M3 DS - Form Elements

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (schemes, state layers, type scale, shape, file structure, build order, atomic rules).

Scope: **⭐Form Elements** pages only: ➜ Date & Time Pickers, ➜ Checkbox, ➜ Radio, ➜ Search, ➜ Switch, ➜ Text Fields, ➜ Loading & progress, ➜ Sliders. Platform Android (M3 Expressive).
Reference: `references/components.md`, `references/gaps.md`, `references/screens/` (to capture).

## 1. Inventory

| Component | Set id | Variants | Tier |
|---|---|---|---|
| **Text field** | 6261:11017 | 120 = Style (Filled, Outlined) x State (Enabled, Hovered, Focused, Error, Disabled) x Text configurations (Input text, Label text, Placeholder text) x Leading icon x Trailing icon | Molecule |
| **Checkboxes** | 6243:15946 | 30 = Type (Selected, Unselected, Indeterminate, Error unselected/indeterminate/selected) x State (Enabled, Hovered, Focused, Pressed, Disabled) | Atom |
| **Radio buttons** | 6160:1105 | 10 = Selected x State | Atom |
| **Switch** | 6157:765 | 20 = Selected x State x Icon | Atom |
| **Search bar** | 6254:31293 | 6 = State (Enabled, Hovered, Pressed) x Show avatar | Molecule |
| Search full-screen layout / docked layout | 6254:31409 / 6254:31438 | 2 each (Input text / Supporting text) | Organism |
| Search ... (baseline) | 6254:31353 / 6254:31381 | 2 each | Organism (older M3) |
| **Standard / Centered / Range slider** | 6259:33655 / 6259:34278 / 6259:35109 | 120 / 120 / 60 = Orientation x Size (XSmall..XLarge) x State x Value | Molecule |
| Slider building blocks | 6259:35659-35683 | Handle, Track stop, Inactive/Active track, Stops, Value indicator | Atoms |
| **Linear-determinate / indeterminate progress** | 6252:20594 / 6252:20881 | 24 / 12 = Type (Flat, Wave) x Thickness (4dp, 8dp) x Progress/Step | Atom |
| **Circular-determinate / indeterminate progress** | 6252:21056 / 6252:21122 | 24 / 8 | Atom |
| **Loading indicator** (expressive shape morph) | 6252:21150 | 14 = Steps 1-7 x Show container | Atom |
| **Modal date picker**, Input date picker, Docked input date picker [desktop] | 6243:22820 / 6243:22791 / 6243:22678 | 3 / 2 / 3 | Organism |
| **Dial picker**, Keyboard picker (time) | 6247:26037 / 6247:26098 | 4 / 2 | Organism |
| Date/time building blocks | 6243:22485 (calendar cell, 22), Year, Menu button, Hour, Clock faces, Input, Period Selector, hour-line | | Atoms |

## 2. Text field (Molecule)

Props: `Style` Filled | Outlined · `State` Enabled | Hovered | Focused | Error | Disabled · `Text configurations` Input text | Label text | Placeholder text · `Leading icon` / `Trailing icon` (variant booleans) · BOOLEAN `Show supporting text` · TEXT `Label text`, `Placeholder text`, `Input text`, `Supporting text`.
Anatomy (Outlined Focused): 56dp field, radius 4 (Extra-small), stroke **3dp Schemes/Primary/Primary** (M3 focus = 2dp... here 3), state-layer padding 4/16, leading = `Icon button - standard` instance (48dp), content (label + input body/large), supporting text `body/small` On Surface Variant, padding 4/16.
- Filled: Surface Container Highest fill, 1dp On Surface Variant bottom indicator (2dp Primary when focused), top corners 4.
- Outlined: Outline 1dp border; Focused Primary; Error = Schemes/Error border + label + supporting text + error icon.
- Disabled: On Surface at 38% / border 12%.
When to use: Filled for most forms (stronger affordance), Outlined for dense or already-busy surfaces; don't mix in one form. Always show a floating label; placeholder only as extra hint. Supporting text for help or error message; character counter goes trailing in supporting row.

## 3. Selection controls (Atoms)

- **Checkbox**: 48dp target, 40dp state layer (radius Full), 18dp container radius 2, Selected fill `Schemes/Primary/Primary` with `check_small` icon (On Primary). Types include **Error** versions (Error color). Use for multi-select and to confirm (terms). `Show focus indicator` boolean.
- **Radio**: Selected True/False; 20dp ring Primary when selected, On Surface Variant when not. Single choice among 2-5 visible options; more options -> menu / list.
- **Switch**: 52x32 track radius Full; Selected track Primary with On Primary handle (28dp, 24 when unselected... handle grows on press), optional check/close icon in the handle (`Icon=True`). Use for instant on/off settings. Unselected: Surface Container Highest track + Outline border.
State layers: Hovered 8%, Focused 10% + focus ring, Pressed 10% (ripple), Disabled 38%.

## 4. Search

- **Search bar** (56dp, radius Full, Surface Container High): leading icon (menu/back), `Placeholder text`, trailing icon(s) (`Show 1st/2nd trailing icon`), optional avatar. Use at the top of a screen as entry point.
- **Search full-screen layout** (Compact windows) and **docked layout** (Medium+), each with list items for suggestions (`Show list items`). Baseline versions are the older M3 look - prefer the non-baseline ones.

## 5. Sliders

Standard (0-100), Centered (-50..+50) and Range. `Size` XSmall..XLarge (track 16-... per M3 Expressive), `Orientation` Horizontal/Vertical, `Show value indicator`, `Show stops`, `Show icon` + `Icon` swap (inset icon on large sizes). Use for choosing a value where precision is low (volume, brightness, price range). Pair with a text field when exact values matter.

## 6. Progress and loading

- **Linear / Circular determinate** (known %): Flat or **Wave** (expressive, for long playful waits), 4dp or 8dp thickness.
- **Indeterminate** (unknown duration).
- **Loading indicator** (M3 Expressive morphing shape, 7 steps, optional container): short waits < 5s, pull-to-refresh, replacing indeterminate circular in expressive UIs.
Colors: active Primary, track Secondary Container / Surface Container Highest, stop indicator Primary.

## 7. Date and time pickers

- **Modal date picker** (Type Day | Year | Full-screen (range)) for picking dates in a dialog; **Input date picker** (Single input | Range) when the user knows the date (birthdays); **Docked input date picker [desktop]** for large screens.
- **Dial picker** (12/24 hour, Vertical/Horizontal) for time with clock face; **Keyboard picker** for typed time.
- Calendar cell `Type` = Default | Today | Selected | Selected (Middle) | Null | Prev/Next with range booleans.

## 8. Choosing a control (Android)

| Need | Use |
|---|---|
| Free text | Text field (Filled default) |
| On/off, applies immediately | Switch |
| One of 2-5 | Radio (or Segmented / Connected button group - Navigation) |
| One of many | Menu / dropdown (Menu + Text field trailing `arrow_drop_down`), or list |
| Multi-select | Checkbox, or Filter chips (Data display) |
| Value on a range | Slider |
| Date / time | Modal date picker / Dial picker |
| Search | Search bar -> full-screen (compact) / docked (medium+) |
| Waiting | Loading indicator (short), Linear determinate (known) |
