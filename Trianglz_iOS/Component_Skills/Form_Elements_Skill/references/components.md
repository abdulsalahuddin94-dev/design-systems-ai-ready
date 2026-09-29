# iOS Form Elements - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Input - set 214:7577 (page ➜ Input Fields and Dropdown, doc frame "Text Fields" 2006:765, Light 2006:772 / Dark 2006:779 preview frames)
Variant name: `🎲 Type=Default, 🎚️ State=Default, 📏 Size=lg`. No description.
Root: vertical AL, gap `spacnig/xxs` (4), 343 wide.
`wrapper`: horizontal AL, padding `spacnig/md` 16 all sides, gap `spacnig/sm` 12, radius bound to **`spacnig/sm`** (12, should be `Raduis/Md`), fill Backgrounds/Card (Disabled: Backgrounds/Group), stroke 1pt Borders/Default (Focus 1.5pt Borders/Focus; Error Status/Danger/Danger Border).
Children: `View Icon` instance (24, visible `👁️ IconLeft`, swap `⮑ 🔄 iconLeft`) · text block · `View Icon` (IconRight).
Text block Default: one text `✏️ Title` Callout/Regular Text/Placeholder (239x21).
Text block Focus/filled: inner `wrapper` (vertical, gap 0, padding/radius bound to **remote** `p_0` / `rounded_none` from the Web library) holding label `✏️ Title` Caption1/Regular + value `✏️ Textfield` Callout/Regular Text/Primary Text.
Helper `✏️ Text` Footnote/Regular Text/Secondary Text (Error: Danger Text), visible `👁️ Description`.
Heights: lg field 56 (total 78), md field 45 (total 67). 1 raw stroke found in the set.

## Checkbox - set 233:1893 (page ➜ Checkbox, doc frame named "Text Fields" 2006:937)
Status: Default | Checked | disabled (selected) | Indeterminate | Disabled. TEXT `Text`.
Root horizontal gap 8 (raw). `Container` 20x20 radius 4 (raw), stroke 2pt:
- Default: fill Backgrounds/Card, stroke Icon/Tertiary.
- Checked: fill + stroke Brand Primary; `Icon` 14x14 frame with check vector stroke Icon/On Brand 1.75 (drawn vector, not an Icon instance).
- Indeterminate: same, dash vector.
- disabled (selected): fill + stroke Icon/Disabled.
- Disabled: fill Backgrounds/Card, stroke Borders/Disabled, label Text/Disabled Text.
Label `Checkbox` Footnote/Regular Text/Primary Text.

## RadioButton - set 2006:974 (page ➜ Radio Buttons) and duplicate 233:1916 (page ➜ Checkbox)
Status: Default | Checked | Status4 | Disabled. TEXT `Text`.
`Container` 20 circle, 2pt ring: Default stroke Icon/Tertiary; Checked stroke Brand Primary + 10pt dot Brand Primary; Status4 (disabled selected) ring + dot Icon/Disabled (label stays Text/Primary Text); Disabled fill Icon/On Brand, ring Borders/Disabled, label Text/Disabled Text. Radius raw (20 / 16777200).

## Toggle - Switch - set 11:2728 (page ➜ Toggles, doc frame 179:799)
Props: Show AX Label (B) · State Idle|Pressed · Is On True|False · Is Enabled True|False (8 variants).
Track 64x28 radius 100, fill remote `Accents/Green` (on) / `Labels/Tertiary` (off); disabled = opacity 0.5.
Idle knob 38x24 raw #ffffff. Pressed knob 58x38 = Shadow (layer blur) + Glass Effect (GLASS + 3 inner shadows, #ffffff 9%, stroke #cccccc) + Specular Light. AX label: ellipse (off, remote stroke) / 1pt bar (on), hidden by default.
Totals on page: 8 remote fills, 14 raw fills, 23 raw radii, 6 raw effects.

## Date and time pickers (page ➜ Date and Time Pickers, frame 203:8493)
- `Date and time - Pickers` 203:8254: Show Date, Show Time (B), Text (T), Style Compact|Inline. Inline = 370x377, fill remote `Backgrounds (Grouped)/Secondary`, Date (header + month grid) + Time row (Title "Time" Body/Regular remote style).
- `Date and time - Collapsed` 203:8313: Month, Year, Time (T), Show date, Show time (B), State Default|Selected. Description = Apple kit placeholder "Guidelines: Feedback: feedbackassistant.apple.com".
- `_Day` 203:8334: Date (T), State Default|Current|Selected|Current and Selected|Null. `_Week` 203:8326.
Page totals: 138 remote fills, 3 raw, 105 texts without style, 16 remote text styles.

## Toolbars & Search (page ➜ Toolbars & Search, frame 211:2281)
| Set | Id | Props |
|---|---|---|
| Toolbar - Top - iPhone | 211:1450 | Show Subtitle (B), Leading (Slot), Trailing (Slot), Style Default / Inline Large / Large Title / Title 2 Line / Title 2 Line Left |
| Toolbar - Bottom - iPhone | 211:1496 | Buttons Leading / Trailing (Slot), Type Buttons / Buttons + Page Dots / Search / Search with Focus / Search + Trailing Item / Search + Leading Item |
| _Title - Large Title / Body / Subheadline | 211:1292 / 1302 / 1297 | Title (T), Mode Light|Dark |
| _Subtitle - Subheadline / Caption | 211:1312 / 1307 | Subtitle (T), Mode |
| _Page Dots | 211:1531 | Mode, Selected |
| _Toolbar page control | 211:790 | Dots 2..8+, Selection 1..8 (35) |
| _Button - Symbol / Text | 211:1128 / 1102 | Symbol or Label (T), Mode, State Default / Tinted / Selected / Disabled |
| _Button - Symbol - Prominent / Text - Prominent | 211:1145 / 1119 | Mode, State Default / Disabled |
| _Button - Bottom / _Buttons - Top | 211:1273 / 1214 | Buttons (Slot), Type Symbol - Prominent / Symbol / Button Group / Text / Text - Prominent (/ Back) |
| _Back Bar Button Item | 211:1089 | Title (T), Show Title (B), Mode, State Default / Disabled |
| _Search - Top / Bottom | 211:1174 / 1236 | Value, Placeholder (T), Mode, State Placeholder / Typing / Value |
Top bar example: Style=Inline Large, 402x54, `_Title - Large Title` + trailing `_Buttons - Top` (remote instance, raw #ffffff fill, radius 296).
Page totals: 18 local fills, 360 remote, 300 raw; 132 texts without style; 591 raw radii; 164 raw effects.
