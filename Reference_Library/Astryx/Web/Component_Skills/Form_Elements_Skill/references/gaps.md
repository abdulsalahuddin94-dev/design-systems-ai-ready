# Form Elements - audit gaps (2026-10-06, read-only)

> **Node IDs:** none are stored here. Fix in a project copy (Fix on create), never in the original.

Checked: structure of every set (FigCli scripts), Light screenshots of every set, text contrast computed from bound variables in Neutral Light and Neutral Dark (no Dark screenshots: the file is read only and has no Dark preview frames). Numbers per component: `../../../data/component-registry.json > components[].contrast_fails`.

## Accessibility
1. **High** - Control borders use `Border/Emphasized`: 1.48:1 Light, 1.94:1 Dark on Surface (TextInput, TextArea, Selector, date inputs, Checkbox box). Needs 3:1 (`border/input` in our rules).
2. **High** - Checkbox has no Error state; CheckboxListItem and RadioListItem have no Focus state (Default, Hovered, Disabled only).
3. **Med** - Placeholder and secondary text: chat composer placeholder `Text/Disabled` 2.52:1 Light / 2.2:1 Dark; InputGroup addon text and InputGroupText `Text/Secondary` on `Background Muted` 4.20:1 Light.
4. **Med** - Slider value bubble: `Text/On Dark` on the Dark-mode bubble resolves to white on white (1.0:1) in Neutral Dark (6 variants).

## Structure and naming
5. **Med** - Switch packs value and state into one `State` axis (`off, on, disabled-off, disabled-on, focused-off, focused-on, hover-off, hover-on`). Split into `Value` x `State` like Checkbox.
6. **Med** - Selector / MultiSelector has 192 variants (Size 3 x State 4 x Display 4 x Status 4). `Status` repeats the Field status; `Display` could be a slot.
7. **Med** - Mixed property casing: `state`, `size`, `hasSearch`, `descriptionText`, `startIconType`, `showLabel` (camelCase, mirrors React props) next to `State`, `Size`, `Has Description`, `Show Labels`. Values too: `rest` vs `Rest`, `sm` vs `Small` vs `SM`. Our rule: Title Case everywhere.
8. **Med** - 24 of 33 components have no Figma description (no Purpose, Usage Rules, Accessibility). The 9 that have one (Slider, InputGroup, DateRangeInput, DateTimeInput, SegmentedControl, ChatComposerInput, ChatComposerDrawer, ChatComposerTokenElement, SegmentedControlItem) are good models: anatomy + variants + token names + the code path.
9. **Low** - Duplicate slot + boolean pairs in CheckboxListItem: `[Slot: startContent]` slot next to `Start Content` boolean (the slot keeps its code name in brackets).
10. **Low** - Raw fills: Switch has 36 unbound fills (track and thumb); 1 default layer name (`InputGroupText > Text`); 28 frames without Auto Layout on the page (mostly Calendar grid and Slider marks).

## Missing compared with our Web inventory
11. **Med** - No OTP / code input, no password field with show/hide, no phone input, no color picker, no rating.
12. **Low** - No standalone Radio atom (only RadioListItem inside RadioList) and no standalone Select menu list component (the Selector popover is drawn inside the organism).
