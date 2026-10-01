# Android Data Display - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli (every variant one property away from the default, layer by layer), checked against the Light/Dark screenshots in `screens/`. `SL/` = `State Layers/`, `R:` = remote M3 kit. Find nodes by name, never by id.

## Cards (`Stacked card` 360x480, `Horizontal card` 360x80; radius 12 raw)
| Style | Background building block |
|---|---|
| Outlined | `.Building Blocks/Card states/Outlined`: `Surface` + 1dp `Outline Variant` |
| Elevated | `.../Elevated`: `Surface Container Low` + R:`M3/Elevation Light/1` |
| Filled | `.../Filled`: `Surface Container Highest` |
- Media & text layout: header row (R:`Generic avatar` 40, `Header` On Surface R:`M3/title/medium`, `Subhead` R:`M3/body/medium`, R:`Icon button - standard` overflow), `Media` 188dp (`Surface Container High` + image), `Title` R:`M3/body/large`, `Subtitle` On Surface Variant, `Supporting text`, actions (`Show secondary action`). Horizontal card: 80dp media square on the right.
- Slot layout: a slot (`Content`) filled by R:`Shared Building Blocks/Slot-component` placeholder - replace with real content.
- Card states sets: Hovered `SL/On Surface/Opacity-08`, Focused 10%, Pressed 10%, Dragged 16%; Elevated shadow goes 1 -> 2 on hover and -> 4 when dragged (remote `M3/Elevation Light/*`).

## Dialogs (312 wide, `Surface Container High`, radius 28 raw)
- `Basic dialog`: optional 24dp icon (R:`mobile_check` placeholder, `Icon=True` centers the headline), `Headline` `headline/small` On Surface, `Supporting text` `body/medium` On Surface Variant, two R:`Button - text` actions right-aligned (Cancel, then confirm).
- `List dialog` / `Scrollable list dialog`: same header + R:`List (baseline)` (scrollable version clips a 683dp list with dividers).
- XR dialog: `Surface container high|highest` elevation option. No full-screen dialog in the file.

## Avatar, badge
- `Generic avatar` 40dp `Primary Container`, radius 100 raw: Avatar = person placeholder `On Primary Container`; Monogram = letter (no text style); Check = R:`Icons/check_24px` (selected state in lists).
- `Badges`: Large 16dp `Error` pill + label `On Error` R:`M3/label/small`; Small 6dp `Error` dot. Dark screenshot: R-80 pink dot.

## Carousel
Items are R:`Building blocks/General item` (`Surface Container High` + image, radius R:`Corner/Extra-large` 28). Mobile widths: Hero 316 + 56 peek; Center-aligned hero 56 / 252 / 56; Multi-browse 188 / 120 / 56; Uncontained equal 154 items; Multi-aspect ratio 16:9 / 4:3 / 1:1 / 3:4 items. `Carousel - Full screen` = one 412x892 item.

## Chips (32dp high, radius 8 raw, label `label/large`, 18dp icons)
| Chip | Enabled (Outlined) | Selected | Disabled |
|---|---|---|---|
| Assistive | 1dp `Outline Variant`, label **On Surface** | - | stroke `SL/On Surface/Opacity-10`, label On Surface 38% |
| Filter | stroke, label `On Surface Variant` | `Secondary Container` + `On Secondary Container`, leading R:`check` appears | same |
| Input | stroke, label `On Surface Variant`; avatar config radius 30 with 24dp avatar; trailing R:`close` with `Show closing icon=true` | `Secondary Container` | (no Disabled variant; has Dragged) |
| Suggestion | stroke, label `On Surface Variant` | `Secondary Container` | same |
- Elevated style: `Surface Container Low` + R:`M3/Elevation Light/1`, no stroke.
- Hovered 8% / Focused 10% / Pressed 10% `SL/On Surface Variant` over a `Surface` fill; Dragged 16%.
- `Chip groups`: a row (single row, scrollable) or wrap (multiple rows) of local chip instances.

## Dividers
`Horizontal` / `Vertical`: 1dp `Outline Variant`. `Property 1`: Full-width, Inset (16 start), Middle-inset (16 both), Divider with subhead (`title/small` On Surface Variant above the line).

## Lists
- `List item` 280 wide: Enabled no fill (inherits the list), Hovered `SL/On Surface/Opacity-08`, Focused 10%, Pressed 8% + Ripple, Dragged = item lifts as a `Tertiary Container` card (radius 16, R:`M3/Elevation Light/5`, layer `SL/On Tertiary Container` 16%) over a `Surface Container` slot, Disabled leading/content/trailing at 38%; **Selected** = `Secondary Container` with radius R:`Corner/Large` (16). Height 52 (one line, Standard list) / 64 (multi-line) / 80 (default with overline + supporting). Building blocks: Leading (Icon, Indent, Image, Avatar, Video, Icon button, Checkbox, Radio, Switch, Slot), Content (Overline, Label, Supporting text or Slot), Trailing (Accordion button, Checkbox, Icon, Icon button, Radio, Switch, Slot, Trailing text).
- `List`: Standard (items on the screen surface), Segmented (filled) (items `Surface` blocks with 2dp gaps on a rounded R:`Corner/Large` group), Expandable (first item is `List item - Accordion `), Draggable (dragged item lifts to `Surface Container`, radius Large), Swipable standard / segmented (`List Item - Swipe` with `Reveal element` actions 1-3).
- Baseline `List Item: 0 / -2 / -4 Density` (56 / 48 / 40dp one-line) and `Full Lists`: older M3, keep only for legacy.

## Sheets
- `Bottom sheet` 412x480 `Surface Container Low`, top corners 28, `Drag handle` 32x4 `Outline`; Modal=True adds the local `Scrim` (black 32%), Modal=False uses R:`M3/Elevation Light/3`.
- `Side Sheet` 320x700: Standard = `Surface` + 1dp vertical divider; Modal = `Surface Container Low`, radius 16; header `title/large` On Surface Variant with back/close R:`Icon button - standard`, footer with local `Button` + `Button - outline`.

## Snackbar and tooltips
- `Snackbar` 344 wide, 48 (one line) / 68 (two lines): R:`Inverse Surface`, text R:`Inverse On Surface` R:`M3/body/medium`, R:`M3/Elevation Light/3`, radius 4; action `.Building Blocks/Snackbar-action` (Inverse Primary text), close `.Building Blocks/Snackbar-close-affordance` 48dp. Properties `Configuration`, `# of lines`, `Show close affordance`.
- `Plain Tooltip` `Inverse Surface` radius 4 + `Inverse On Surface` `body/small` (Multi line uses remote `M3/body/small`). `Rich Tooltip` 312 wide: `Surface Container`, radius 12, local `Elevation Light/2`; subhead `title/small` + supporting text `body/medium` (both On Surface Variant), two local `Button - text` actions.
