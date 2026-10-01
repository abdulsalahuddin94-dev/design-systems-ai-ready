---
name: trianglz-android-form-elements
description: Use when building, auditing or coding data-entry controls with the Trianglz Android Material 3 Design System (Figma JUs2c8IO6ybFcGRZjcQzr9) - text fields (filled/outlined), checkbox, radio, switch, search bar and search views, sliders, date and time pickers, progress and loading indicators. Covers only the ⭐Form Elements group; tells the agent which M3 component and variant to use, how it is tokenized and where it departs from Material 3.
---

# Trianglz Android M3 DS - Form Elements

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (schemes, state layers, type scale, shape, file structure, build order, atomic rules).

Scope: **⭐Form Elements** pages only: ➜ Date & Time Pickers, ➜ Checkbox, ➜ Radio, ➜ Search, ➜ Switch, ➜ Text Fields, ➜ Loading & progress, ➜ Sliders. Platform Android (M3 Expressive).
Reference: `references/inventory.md` (every set and property, live 2026-10-01), `references/states.md` (what each state looks like and which token draws it, verified), `references/components.md`, `references/gaps.md`, `references/screens/` (Light + Dark of every public set).

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
Anatomy (Outlined Focused): 56dp field, radius 4 (raw, = Extra-small), stroke **3dp Schemes/Primary/Primary** (M3 spec 2dp; the Filled indicator is also 3dp when focused or in error), state-layer padding 4/16, leading = `Icon button - standard` instance (48dp), content (label + input body/large), supporting text `body/small` On Surface Variant, padding 4/16.
- Filled: Surface Container Highest fill, 1dp On Surface Variant bottom indicator (On Surface on hover, 3dp Primary when focused, 3dp Error in error), top corners 4.
- Outlined: Outline 1dp border; Focused Primary; Error = Schemes/Error border + label + supporting text + error icon.
- Disabled: On Surface 4% overlay on the field, field, indicator and supporting row at 38% opacity.
When to use: Filled for most forms (stronger affordance), Outlined for dense or already-busy surfaces; don't mix in one form. Always show a floating label; placeholder only as extra hint. Supporting text for help or error message; character counter goes trailing in supporting row.

## 3. Selection controls (Atoms)

- **Checkbox**: 48dp target, 40dp state layer (radius Full), 18dp container radius 2, Selected fill `Schemes/Primary/Primary` with `check_small` icon (On Primary). Types include **Error** versions (Error color). Use for multi-select and to confirm (terms). `Show focus indicator` boolean.
- **Radio**: Selected True/False; remote `radio_button_checked/unchecked` icon (24dp) in a 40dp container, Primary when selected, On Surface Variant when not; hover/focus layer Primary, press layer On Surface. Single choice among 2-6 visible options (Abdul's rule: 7+ -> menu / dropdown).
- **Switch**: 52x32 track radius Full. Selected: Primary track, 24dp On Primary handle (Primary Container on hover/focus/press, 28dp on press). Unselected: **Surface Container** track (M3 spec says Highest) + 2dp Outline border, 16dp Outline handle (On Neutral Container on hover/focus, 28dp on press). `Icon=True` adds a check (selected) / close (unselected) icon and makes the unselected handle 24dp. Use for instant on/off settings.
State layers: Hovered 8%, Focused 10% + focus ring, Pressed 10% (ripple), Disabled 38%.

## 4. Search

- **Search bar** (360x56, radius 28 raw, Surface Container High, placeholder body/large On Surface Variant): leading icon (menu/back), `Placeholder text`, trailing icon(s) (`Show 1st/2nd trailing icon`), optional avatar. Use at the top of a screen as entry point.
- **Search full-screen layout** (Compact windows) and **docked layout** (Medium+), each with list items for suggestions (`Show list items`). Baseline versions are the older M3 look - prefer the non-baseline ones.

## 5. Sliders

Standard (0-100), Centered (-50..+50) and Range. `Size` XSmall/Small/Medium/Large/XLarge = track 16/24/40/56/96dp with a 4dp Primary bar handle (44-108dp tall, 2dp while pressed); active track Primary, inactive Secondary Container; Pressed shows the Inverse Surface value pill, `Orientation` Horizontal/Vertical, `Show value indicator`, `Show stops`, `Show icon` + `Icon` swap (inset icon on large sizes). Use for choosing a value where precision is low (volume, brightness, price range). Pair with a text field when exact values matter.

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
| One of 2-6 | Radio (or Connected button group - Navigation) |
| One of 7+ | Menu / dropdown (Menu + Text field trailing `arrow_drop_down`), or list |
| Multi-select | Checkbox, or Filter chips (Data display) |
| Value on a range | Slider |
| Date / time | Modal date picker / Dial picker |
| Search | Search bar -> full-screen (compact) / docked (medium+) |
| Waiting | Loading indicator (short), Linear determinate (known) |

## 9. Rules for AI agents

**Always**
- Instance the public set by name (section 1) and set real variant values; check `references/states.md` for what each state should look like.
- Give every text field a real `Label text`, a useful `Supporting text` (format or limit) and turn `Show supporting text` off when there is nothing to say. Errors say what is wrong and how to fix it ("Enter a 10-digit phone number").
- One form = one text field style (all Filled or all Outlined).
- Selection controls sit inside a 48dp target; keep 8-16dp between stacked controls and put the label to the right in a List item when it is a settings row.
- Swap remote kit icons/instances for the local ones with the same name when you build in a project copy (gaps 1).
- Dark mode = switch the `m3` mode on the frame; never pick Dark colors by hand.

**Never**
- Detach a component to change color, radius or padding; never draw a field or control with plain frames.
- Use the baseline search layouts in new work (use `Search full-screen layout` / `Search docked layout`).
- Use a Switch in a form that needs Save; use a Checkbox there.
- Show Error before the user has interacted or submitted.
- Use Radio for one yes/no choice or Checkbox for mutually exclusive options.

## 10. Jetpack Compose map (Material 3)

| Figma | Compose |
|---|---|
| `Text field` Filled / Outlined | `TextField` / `OutlinedTextField` (`label`, `placeholder`, `supportingText`, `leadingIcon`, `trailingIcon`, `isError`, `enabled`) |
| `Checkboxes` (Indeterminate) | `Checkbox` / `TriStateCheckbox`; Error types = `CheckboxDefaults.colors(...)` with `colorScheme.error` |
| `Radio buttons` | `RadioButton` inside `Modifier.selectableGroup()` rows |
| `Switch` (Icon=True) | `Switch(thumbContent = { Icon(...) })` |
| `Search bar` / full-screen / docked | `SearchBar` / `DockedSearchBar` (+ `SearchBarDefaults.InputField`) |
| `Standard` / `Range slider` (Centered = custom track) | `Slider` / `RangeSlider` (M3 Expressive sizes via `SliderDefaults.Track`) |
| Linear / Circular progress (Wave) | `LinearProgressIndicator` / `CircularProgressIndicator` (`LinearWavyProgressIndicator`, `CircularWavyProgressIndicator`) |
| `Loading indicator` (container) | `LoadingIndicator` / `ContainedLoadingIndicator` |
| `Modal date picker`, `Input date picker`, `Docked ... [desktop]` | `DatePickerDialog` + `DatePicker` (`DisplayMode.Picker / Input`), `DateRangePicker` |
| `Dial picker` / `Keyboard picker` | `TimePicker` / `TimeInput` |
Colors come from `MaterialTheme.colorScheme.<role>` (the `Schemes/*` names in camelCase), text from `MaterialTheme.typography.<role><Size>` (`bodyLarge`, `labelLarge`...), shapes from `MaterialTheme.shapes`. Touch targets 48dp (`minimumInteractiveComponentSize`), TalkBack labels on icon-only controls (`contentDescription`), error text announced with `semantics { error(...) }`.

## 11. Final check after using this skill
Run audit-design-system on the result: every control is an instance of a public set above (no detached copies, no baseline sets), fills resolve to local `m3` Schemes, text uses local styles, no remote kit icons left in a project copy, and Light and Dark screenshots match `references/screens/`. Report anything that needed a workaround against `references/gaps.md`.
