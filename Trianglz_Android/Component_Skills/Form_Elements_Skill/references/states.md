# Android Form Elements - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli: for each public set, every variant that differs from the default in one property was walked layer by layer, then checked against the Light and Dark screenshots in `screens/`. `SL/` = `State Layers/`. `R:` = remote (M3 kit library), not local. Find nodes by name, never by id.

## Text field (`Text field`, default Style=Filled, State=Enabled, Input text, trailing icon on)
| State | Filled | Outlined |
|---|---|---|
| Enabled | field `Surface Container Highest`, `Active indicator` 1dp `On Surface Variant`, label `body/small` On Surface Variant, input `body/large` On Surface | no fill, 1dp `Outline` stroke radius 4 (raw), floating label sits on a `Label text container` filled `Surface` (the notch) |
| Hovered | + `State-layer` `SL/On Surface/Opacity-08`, indicator turns `On Surface` | stroke `On Surface` |
| Focused | label `Primary`, caret 1dp `Primary`, indicator **3dp** `Primary` (M3 spec 2dp) | stroke 3dp `Primary` |
| Error | label, indicator (3dp), caret and supporting text `Error`; trailing icon swaps to the error icon | stroke `Error` |
| Disabled | overlay `disabled-state-color` On Surface at 4%, field + indicator + supporting row at 38% | same 38% recipe |
- `Text configurations`: Input text (label floats, value shown), Label text (empty, label sits inside at `body/large`), Placeholder text (label floats, placeholder On Surface Variant).
- Leading/trailing icons are remote `Icon button - standard` instances (48dp). Supporting text row: `body/small`, padding 4/16.
- Visual check (Dark screenshot): Filled field reads as a grey slab (N-40) with a blue (RN-80) indicator on focus and pink-red (R-80) on error; Outlined notch label shows a black patch on Dark because the container is `Surface` = N-0.

## Checkbox (`Checkboxes`, default Type=Selected, State=Enabled)
| Type / State | Look |
|---|---|
| Selected / Indeterminate | 18dp container radius 2 filled `Primary`, remote `check_small` / `check_indeterminate_small` icon |
| Unselected | 2dp `On Surface Variant` border, no fill |
| Error selected / indeterminate | container `Error` |
| Error unselected | 2dp `Error` border |
| Hovered | 40dp round `state-layer` `SL/Primary/Opacity-08` (selected types) |
| Focused | same layer at 10% |
| Pressed | layer 10% + `Ripple` On Surface at 20% |
| Disabled | container `On Surface`, whole component 38% opacity |
48dp target, 40dp state layer, `Show focus indicator` boolean.

## Radio (`Radio buttons`, default Selected=True)
Icon is a remote `radio_button_checked` / `radio_button_unchecked` instance (24dp) inside a 40dp container: Hovered `SL/Primary/Opacity-08`, Focused `SL/Primary/Opacity-10`, Pressed `SL/On Surface/Opacity-10`, Disabled icon at 38%.

## Switch (`Switch`, default Selected=True, State=Enabled, Icon=False)
| State | Selected=True | Selected=False |
|---|---|---|
| Enabled | track 52x32 `Primary`, handle 24 `On Primary` | track **`Surface Container`** (M3 spec: Surface Container Highest) + 2dp `Outline` border, handle 16 `Outline` |
| Hovered / Focused | handle `Primary Container`, state layer 8% / 10% `SL/Primary` | handle `Neutral/On Neutral Container` (stays 16dp), layer `SL/On Surface` 8% / 10% |
| Pressed | handle **28dp** `Primary Container` | handle 28dp `On Neutral Container` |
| Disabled | track `SL/On Surface/Opacity-10`, handle `Surface` | track `SL/Surface Variant/Opacity-10` + 2dp `SL/On Surface/Opacity-10` border, handle `On Surface` 38% |
`Icon=True` puts a remote `check` (selected) or `close` (unselected) 16dp icon in the handle; the unselected handle with icon is 24dp.

## Search
- `Search bar` 360x56, `Surface Container High`, radius 28 (raw, = Full at 56dp), placeholder `body/large` On Surface Variant "Hinted search text", leading + trailing remote `Icon button - standard`, `Show avatar=True` adds a remote `Generic avatar` 30dp. Hovered/Pressed: full `SL/On Surface/Opacity-08` layer (+ Ripple 10% on press).
- `Search full-screen layout` 412x250 radius 16 and `Search docked layout` 360x250: search bar + `list` of 3 remote `List item` instances (64dp, radius remote `Corner/Extra-small`); docked list sits on `Surface Container High` radius 12. Input text On Surface `body/large` + 1dp `Primary` caret.

## Sliders
| Size | Track height | Handle height |
|---|---|---|
| XSmall | 16 | 44 |
| Small | 24 | 44 |
| Medium | 40 | 52 |
| Large | 56 | 68 |
| XLarge | 96 | 108 |
Handle is a 4dp `Primary` bar (2dp while Pressed). Pressed shows the `Value indicator` (48x44 pill, `Inverse Surface`). Disabled: handle `On Surface` 38%, active track 38%. Active track `Primary`, inactive `Secondary Container`. `Centered slider` fills from the middle; `Range slider` has two handles (its `Value` options `-50/0/+50` are copied from Centered - read them as positions) and a remote `.Building Blocks/Track dot`.

## Progress and loading
- Linear: `Track` (`Secondary Container`) + flat or wave `Segment` (`Primary`) + end `Stop` dot; 4dp or 8dp thickness. Progress=100 is one full segment.
- Circular: `Track` `Secondary Container` ring + `Active indicator` `Primary`; 40dp (4dp) / 44dp (8dp) / 48dp (wave).
- `Loading indicator`: morphing `Shape` in `Primary` (7 steps); `Show container=True` puts it on a 48dp `Primary Container` circle with the shape in `On Primary Container`.

## Date and time pickers
- `Modal date picker` (Day, Year) 360 wide, `Surface Container High`, radius 28; Full-screen (range) has no radius. Header `label/large` "Select date" + `headline/large` date, divider `Outline Variant`. Actions are remote `Button - text` (Cancel / OK).
- `Input date picker` 328x278 radius 28 with local `Text field` instances (Single input / Range).
- `Docked input date picker [desktop]` radius 16; Day uses local `Icon button - standard` and `Menu button`, Month/Year lists use remote `List (baseline)`.
- `Dial picker` (328x520 vertical, 572x384 horizontal) and `Keyboard picker` radius 28: `Input` boxes 96x80 radius 8 with `display/large` digits (selected = `Primary Container` + `On Primary Container`, unselected = `Surface Container Highest` + `On Surface`), `Period Selector` 1dp `Outline` radius 8, clock face 256dp `Surface Container Highest`, selected `Hour` = 48dp `Primary` circle with `On Primary` number on the `hour-line`. Title `label/medium`.
- Calendar cell (40dp circle in a 48dp cell, date in remote `M3/body/large`): Default On Surface; Today = 1dp `Primary` ring + `Primary` date; Selected = `Primary` circle + `On Primary`; Selected (Middle) = range band `Secondary Container` + `On Secondary Container`; Prev/Next = On Surface at 38%; Null = empty. State value `Hovere` is a typo for Hovered.
