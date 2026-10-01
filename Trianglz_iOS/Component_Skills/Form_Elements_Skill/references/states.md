# iOS Form Elements - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli: every variant one property away from the default, walked layer by layer, then checked against the Light/Dark screenshots in `screens/`. `R:` = remote variable or style from Apple's iOS 26 UI Kit (does not follow the local `Color / Semantic` mode). Find nodes by name, never by id.

## Input (Trianglz-built, fully local)
| Type / State | `wrapper` field | Label (`✏️ Title`) | Value / placeholder | Helper (`✏️ Description`) |
|---|---|---|---|---|
| Default / Default | `Backgrounds/Card`, 1pt `Borders/Default` | shown as placeholder `Text/Placeholder` Callout/Regular | - | `Text/Secondary Text` Footnote/Regular |
| Default / Focus | `Backgrounds/Card`, **1.5pt `Borders/Focus`** | floats up, `Text/Link Text` Caption1/Regular | `Text/Primary Text` Callout/Regular | Secondary |
| Default / filled | Card, 1pt Default | floats, `Text/Secondary Text` | Primary | Secondary |
| Error / * | Card, 1pt `Status/Danger/Danger Border` | Danger | Primary | `Status/Danger/Danger Text` |
| Disabled / * | **`Backgrounds/Group`**, 1pt Default | placeholder stays `Text/Placeholder` | - | Secondary (no dimming) |
- `📏 Size` lg = 56pt field, md = 45pt. Radius bound to `spacnig/sm` (12, a spacing variable). Leading/trailing `View Icon` instances (24pt) via `⮑ 🔄 iconLeft/iconRight`, shown by `👁️ IconLeft/IconRight` (both on by default - turn them off when unused).

## Checkbox and RadioButton (Trianglz-built)
| Status | Checkbox (20pt, radius 4, 2pt stroke) | RadioButton (20pt ring, 10pt dot) |
|---|---|---|
| Default | `Backgrounds/Card` + `Icon/Tertiary` stroke | `Icon/Tertiary` ring, no fill |
| Checked | `Brand Primary` fill + stroke, check vector `Icon/On Brand` 1.75pt | `Brand Primary` ring + dot |
| Indeterminate | same, dash vector | - |
| Disabled | Card + `Borders/Disabled`, label `Text/Disabled Text` | ring `Borders/Disabled`, **fill `Icon/On Brand` (white)** - renders as a white disc on Dark (`screens/checkbox-dark.png`) |
| `disabled (selected)` / `Status4` | `Icon/Disabled` fill + stroke, label stays `Text/Primary Text` (not dimmed) | `Icon/Disabled` ring + dot, label not dimmed |
Label `Footnote/Regular` `Text/Primary Text`, gap 8. Radio radius is a raw 16777200 (Figma "max"), not `Raduis/Full`.

## Toggle - Switch (Apple kit)
64x28 track, 38x24 knob raw `#ffffff`. On = R:`Accents/Green`; Off = R:`Labels/Tertiary` at 30%; `Is Enabled=False` = whole switch 50% opacity; `State=Pressed` = Liquid Glass knob 58x38 (raw shadow, 9% white glass, specular layer). `Show AX Label` adds the on/off glyphs.

## Date and time pickers (Apple kit)
- `Date and time - Collapsed` (204x34): two R:`Fills/Tertiary` 12% capsules (date, time), text R:`Labels/Primary` R:`Body/Regular`; `State=Selected` turns the texts R:`Accents/Blue` (the picker is open). This is the form row.
- `Date and time - Pickers` `Style=Compact` = the **popover** that opens from the collapsed row (370x377 on R:`Liquid Glass - Regular - Large`, radius 13). `Style=Inline` = the calendar embedded in content on R:`Backgrounds (Grouped)/Secondary`. Both: month title R:`Body/Emphasized` + blue disclosure glyph, prev/next glyphs, weekday row R:`Labels/Tertiary` 30%, `_Week` rows, `Time` row with a time capsule.
- **Bug (seen in `screens/date-time-pickers.png`)**: the Compact weekday header reads SUN MON WED THU FRI SAT SUN (TUE missing, SUN twice); the layer names are right, the texts are shifted.
- `_Day` (38pt): Default R:`Labels/Primary`; Current = R:`Accents/Blue` text on a 12% blue circle; Selected = R:`Labels/Primary` (black) circle + R:`Backgrounds/Primary` text; Current and Selected = R:`Accents/Blue` circle + white; Null = empty.
- Tint is Apple blue (`Accents/Blue`), not `Brand Primary`.

## Toolbars and search (Apple kit, iOS 26 Liquid Glass)
- `Toolbar - Top - iPhone` (402x54): `_Title - Body` (R:`Headline/Regular`), `_Title - Large Title` (R:`Large Title/Emphasized`), `_Title - Subheadline` / `_Subtitle - *` for two-line titles, all R:`Labels - Vibrant/*`. Leading/trailing are **remote** `_Buttons - Top` instances (the local set of the same name is not used); two button groups carry a raw `#ffffff` fill.
- `_Buttons - Top` (44pt) and `_Button - Bottom` (48pt): capsule on R:`Liquid Glass - Regular - Small` holding `_Button - Symbol`, `_Button - Text`, their Prominent versions, a 3-symbol Button Group or `_Back Bar Button Item`. `_Button - Bottom` nests the remote copies too.
- `_Button - Symbol` / `_Button - Text` states: Default R:`Labels - Vibrant - Controls/Primary`; Tinted = `Brand Primary` glyph/text; Selected = `Brand Primary` capsule + raw `#ffffff`; Disabled = `Labels - Vibrant - Controls/Tertiary`. Icons are SF Symbol **text glyphs** (e.g. "􀓔"), not icon instances.
- `_Search - Top` (44pt) / `_Search - Bottom` (48pt): glass capsule, magnifier glyph, placeholder `Controls/Tertiary`, value `Controls/Primary`, `Brand Primary` 2pt cursor while Typing, mic/clear glyph `Controls/Secondary`.
- `Toolbar - Bottom - iPhone` (402x84): 4 `_Button - Bottom` groups, or search field 346 wide (286 with a leading/trailing item), or buttons + `_Toolbar page control` (2-8+ dots, glass capsule, selected dot `Controls/Primary`).
- `Mode=Light|Dark` variants on these parts bind the **same** remote variables in both modes; the dark look only appears when the remote Apple collection is switched on a parent frame.
