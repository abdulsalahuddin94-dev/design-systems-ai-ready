# Android Form Elements - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

All sets have M3 kit descriptions (e.g. Text field: "Use a text field when someone needs to enter text into a UI..."), except building blocks.

## Text field - 6261:11017 (➜ Text Fields, section "Text fields" 6261:11016)
Props: Show supporting text (B), Label text, Placeholder text, Input text, Supporting text (T); Style Filled|Outlined; State Enabled|Hovered|Focused|Error|Disabled; Text configurations Input text|Label text|Placeholder text; Leading icon True|False; Trailing icon True|False. 120 variants.
Outlined/Focused/Input text/Leading: 210x56; `Text field` stroke Schemes/Primary/Primary 3dp radius 4 (raw); `State-layer` padding 4/16/4/0 gap 4; `Leading icon` = **remote** `Icon button - standard` (48); `Content` padding 4/0; `Supporting text` row padding 4/16, text body/small On Surface Variant.
Sampled tokens: 21 local fills, 0 remote; 12 local text styles; 23 raw paddings; 10 raw radii.

## Checkboxes - 6243:15946 (➜ Checkbox)
Props: Show focus indicator (B); Type Selected|Unselected|Indeterminate|Error unselected|Error indeterminate|Error selected; State Enabled|Hovered|Focused|Pressed|Disabled. 30.
Selected/Enabled: 48x48 padding 4; `state-layer` 40x40 padding 11 radius 100; `container` 18x18 radius 2 fill Schemes/Primary/Primary; `check_small` **remote** icon 24.

## Radio buttons - 6160:1105 (➜ Radio; loose state label texts Enabled/Selected/Deselected/Hovered/Focused/Pressed/Disabled on the page)
Props: Show focus indicator; Selected True|False; State x5. 10.

## Switch - 6157:765 (➜ Switch; loose label texts on the page; section "Toggle" holds only a Header)
Props: Show focus indicator; Selected; State x5; Icon True|False. 20.
Selected/Enabled/No icon: 52x32 fill Schemes/Primary/Primary padding 2/4 radius 100; `Handle` 44x28 with `Target` 48x48.

## Search (➜ Search)
Search bar 6254:31293: Show 2nd trailing icon, Show 1st trailing icon, Placeholder text, Show leading icon; State Enabled|Hovered|Pressed; Show avatar. 6.
Search full-screen layout 6254:31409 / docked 6254:31438: Show trailing Icon, Show list items, Input text, Placeholder text; Configuration Input text|Supporting text.
Baseline versions 6254:31353 / 6254:31381. Page sample: 148 local fills, **157 remote**; 60 local text styles, **132 remote**.

## Sliders (➜ Sliders)
Standard 6259:33655 (Show value indicator, Show stops, Icon (I), Show icon; Orientation; Size Large|XLarge|Medium|Small|XSmall; State Enabled|Hovered|Pressed|Disabled; Value 0|50|100) 120.
Centered 6259:34278 (Value -50|0|+50) 120. Range 6259:35109 (Horizontal only) 60.
Building blocks: Handle 6259:35659, Track stop 35661, Inactive track left 35663, Inactive track 35666, Stops 35669, Active track 35681, Value indicator 35683 (Label text).
Sample: 66 local fills, **125 remote**.

## Loading & progress (sections Progress Indicators 6252:20563, Loading Indicators 6252:21147)
Linear-determinate 6252:20594 (Type Flat|Wave; Thickness 4 dp|8 dp; Progress 0|10|20|50|80|100) 24 · Linear-indeterminate 6252:20881 (Step 0|1|2) 12 · Circular-determinate 6252:21056 (Progress 0|10|30|50|80|100) 24 · Circular-indeterminate 6252:21122 (Show track; Step 1|2) 8 · Loading indicator 6252:21150 (Steps 1-7; Show container) 14.
Building blocks: `.Building Blocks/Progress indicator/Width 4|8/{Segment - wave, Stop, Segment - flat, Track}`.
Sample: 32 local fills, 0 remote.

## Date & Time Pickers (sections Date pickers 6243:22483, Time PIcker (typo) 6247:25806, Note 6247:26716)
Docked input date picker [desktop] 6243:22678 (Show Clear button; Type Day|Month|Year) · Input date picker 6243:22791 (Supporting text, Headline, Headline (plural), Show clear button; Type Single input|Range) · Modal date picker 6243:22820 (Headline, Supporting text (+range), Show clear button; Type Day|Year|Full-screen (range)) · Dial picker 6247:26037 (Headline; Format 12|24 hour; Orientation) · Keyboard picker 6247:26098 (Headline; Format).
Building blocks: `.Building Blocks/Local M3 calendar cell` 6243:22485 (Extra right/left, Start/End range, Date, Show focus indicator; Type Default|Today|Selected|Selected (Middle)|Null|Prev/Next; State Enabled|Hovered|Focused|Pressed|Disabled|**Hovere**), Year 22600, Menu button 22639, Hour 25809 (Hour Line swap), Clock face 12/24 hour, Input 25877, Direct Input (keyboard) input 25886, Period Selector (+ Horizontal), hour-line (24 angles).
Sample: 675 local fills, 132 remote; 341 local / 223 remote text styles; 1311 raw paddings.
