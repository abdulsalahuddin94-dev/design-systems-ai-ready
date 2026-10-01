# Android Navigation - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli (every variant one property away from the default, layer by layer), checked against the Light/Dark screenshots in `screens/`. `SL/` = `State Layers/`, `R:` = remote M3 kit. Find nodes by name, never by id.

## Buttons (Small, Round shown; all five sizes share the recipe)
| Set | Enabled container + content | Hover / Focus layer | Disabled |
|---|---|---|---|
| `Button` (filled) | `Primary` + `On Primary` | `SL/On Primary` 8% / 10% | container `SL/On Surface/Opacity-10`, content On Surface, state layer frame 38% |
| `Button - tonal` | `Secondary Container` + `On Secondary Container` | `SL/On Secondary Container` | same as filled |
| `Button - elevated` | `Surface Container Low` + `Primary`, R:`M3/Elevation Light/1` | `SL/Primary` 8%, focus `SL/Surface Tint` 10% | **no container**, icon + label at 38% |
| `Button - outline` | no fill, 1dp **`Outline Variant`** stroke + **`On Surface Variant`** content | `SL/On Surface Variant` | On Surface 10% fill, keeps the stroke |
| `Button - text` | no container, `Primary` content | `SL/Primary` | On Surface 10% fill |
- Pressed: state layer 8% + `Ripple` 10%, and Round buttons **morph to radius 8** (M3 Expressive press shape). Square buttons keep their corner. Visual check (`screens/button-filled.png`): Pressed column is square-cornered, Disabled is a light grey pill with grey label.
- Sizes (container height / icon / label style): XSmall 32 / 20 / `label/large`, Small 40 / 20 / `label/large`, Medium 56 / 24 / `title/medium`, Large 96 / 32 / `headline/small`, XLarge 136 / 40 / `headline/large`. The component frame is the 48dp touch target for XSmall and Small.
- Icons are remote `stars` / `stars_filled` placeholders; swap via the `Icon` property.

## Toggle buttons (Selected True vs False)
| Set | Unselected | Selected |
|---|---|---|
| `Toggle button` | `Surface Container` + `On Surface Variant` | `Primary` + `On Primary`, radius **12** (label R:`M3/label/large`) |
| `Toggle button - elevated` | `Surface Container Low` + `Primary` | `Primary` + `On Primary`, radius 12 |
| `Toggle button - tonal` | `Secondary Container` + `On Secondary Container` | `Secondary` + `On Secondary`, radius 12 |
| `Toggle button - outline` | `Outline Variant` stroke + `On Surface Variant` | **`Inverse Surface` + `Inverse On Surface`**, radius 12 |
Icon swaps from `Icon` (outlined) to `Icon (selected)` (filled).

## Icon buttons (Small = 40dp container in a 48dp target, 24dp icon)
Same color logic as buttons: `Icon button` = Primary, `- tonal` = Secondary Container, `- outline` = Outline Variant stroke, `- standard` = no container (layer `SL/On Surface Variant`). `Width` Narrow / Default / Wide changes only the container width. Togglable sets: unselected `Surface Container` (filled) / `Secondary Container` (tonal) / stroke (outline) / none (standard); selected `Primary` / `Secondary` / `Inverse Surface` / standard keeps no container, radius 12, icon swaps to `Icon (selected)`.

## FAB, Extended FAB, FAB menu
- `FAB` Default 56 (icon 24, radius R:`Corner/Large` 16) / Medium 80 (icon 28, R:`Corner/Large-increased` 20) / Large 96 (icon 36, R:`Corner/Extra-large` 28); `Elevation Light/3` at rest, **/4 on hover**; layer `SL/On <color>` 8/10%. Colors: Primary/Secondary/Tertiary container (+ On ... Container icon) or solid Primary/Secondary/Tertiary (+ On ...).
- `Extended FAB` Small 56 high: icon 24 + label **`title/medium`** (not label/large).
- `FAB menu`: close FAB (`Primary`/`Secondary`/`Tertiary` solid, Elevation 3) + 3-6 `Segment` pills (container color, radius R:`Corner/Extra-large`).

## Button groups, segmented, split
- `Connected button group`: segments are `Building Blocks/Button group/Connected segments/<Size>`; selected segment `Secondary` with a rounder corner (24), unselected `Secondary Container` with inner corners 8; outer container radius 20 (Small).
- `Standard button group`: 4-7 spaced `Icon button togglable` or toggle buttons (Color Filled/Tonal/Outline).
- `Segmented button` (baseline, Density 0/-1/-2/-3 = 48/44/40/36dp): older M3, prefer Connected button group.
- `Split button`: leading button (label + icon) + 48dp trailing button with `keyboard_arrow_down` (turns `keyboard_arrow_up` and rounds fully when `Trailing state=Selected` = menu open). Filled = Primary, Tonal = Secondary Container, Outlined = Outline Variant stroke, Elevated = Surface Container Low + R:`M3/Elevation Light/3`.

## App bars
- `App bar` 412x64: Flat = **no fill**, On-scroll = `Surface Container`. Leading R:`Icon button - standard`, `Text content` building block (Small 28 / Medium 36 / Large 48 tall, `Headline` + optional supporting text, Centered or Left), trailing actions (R:`Icon button - standard`) or 32dp `Avatar` (Image/Monogram). Search configuration = `Search bar - Modified` (Flat/On-scroll). Small-image = `Thumbnail` logo.
- `Bottom app bar` 412x80 `Surface Container` with R:`<Deprecated> Icon button` x1-4 + R:`<Deprecated> FAB` (Secondary Container). Legacy.

## Menus
- `Menu` Standard: container `Surface Container Low`, radius R:`Corner/Large` (16), R:`M3/Elevation Light/3`; with 2-3 Groups each list is its own `Surface Container Low` block (radius Small) with gaps. Vibrant: `Tertiary Container`.
- `Menu item/Standard` 228x48 (inner 220x44): Hovered `SL/On Surface` 8%, Focused 10%, Pressed 8% + Ripple, **Active** = 8% (open submenu), Disabled = leading/trailing 38%; **Selected** = `Tertiary Container` pill radius R:`Corner/Medium` (12). Vibrant: Selected = `Tertiary`, layers `SL/On Tertiary` / `On Tertiary Container`.

## Navigation
- `Navigation Bar: Vertical items` 412x64 (phone, icon above label) and `Horizontal items` 741x64 (tablet, icon beside label), both `Surface Container`. Selected item: Vertical = 56x32 `Secondary Container` pill (radius 16) over a `label/medium` label in **`Secondary`** (brand orange); Horizontal = 40dp-high pill around icon + label, label `On Secondary Container`. Icon swaps to `Icon (selected)` (filled). Rail vertical items are the same; with `Show label=False` the pill is a 56dp circle.
- `Navigation Rail` 96 wide (FAB `Primary Container` + menu R:`Icon button - standard`, 3-6 vertical items). `Navigation Rail: Expanded` 220 wide: Docked (no container) or Floating (`Surface Container`, radius 16, R:`Corner/Large`); R:`Extended FAB`; selected horizontal item pill `Secondary Container` radius Full; optional section headers.

## Toolbar
`Toolbar` Floating = 168x64 pill radius 32 (raw) + `Elevation Light/3`, Standard `Surface Container` or Vibrant `Primary Container`; Docked = 412x64 full width `Surface Container`, no shadow. Content slots hold `Building Blocks/Standard|Vibrant/Icon button`, `Icon button toggleable`, `Button toggleable`. Vertical orientation for side placement.

## Tabs
- `Tabs` container `Surface`, bottom R:`Horizontal/Full-width` divider; Fixed (equal width) or Scrollable (90dp items).
- Primary tab: label `title/small`; unselected `On Surface Variant`; selected `Primary` label/icon + 3dp `Primary` indicator 20dp wide (content width) under the content. Hover 8% / Focus 10% / Pressed 8% + Ripple, all `SL/On Surface`.
- Secondary tab: selected label stays `On Surface`, indicator 2dp `Primary` across the **full tab width**.
