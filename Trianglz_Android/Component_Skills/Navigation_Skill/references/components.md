# Android Navigation - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## ➜ Buttons (sections Buttons 6218:7809, Button groups 6226:11284, Icon button 6226:14893, FAB 6239:6497, FAB menu 6239:7296, Baseline 6239:7674, Split button 6239:8483)
| Set | Id | Variants | Properties |
|---|---|---|---|
| Toggle button | 6218:7810 | 100 | Label text, Show icon, Icon, Show focus indicator, Icon (selected); Type Round/Square; Size XSmall..XLarge; State x5; Selected |
| Button (filled) | 6218:8358 | 50 | Label text, Show icon, Icon, Show focus indicator; Type; Size; State |
| Button - text | 6218:8629 | 50 | same |
| Button - elevated | 6218:8900 | 50 | same |
| Button - outline | 6218:9178 | 50 | same; State value typo **Presssed** |
| Button - tonal | 6218:9449 | 50 | same (Size order differs) |
| Toggle button - elevated / outline / tonal | 6218:9720 / 10261 / 10802 | 100 each | as Toggle button |
| Connected button group | 6226:11289 | 10 | Show 3rd/4th/5th segment; Type; Size |
| Building Blocks/Button group/Connected segments/{XSmall..Xlarge} | 6226:11384-11604 | 10 each | Icon, Label text, Show icon, Show label text, Show focus indicator, Icon (selected); Selected; State |
| Standard button group | 6226:11659 | 60 | Show 5th/6th/7th button; Type; Size; Color Filled/Tonal/Outline; Button type Icon/Label |
| Icon button (filled) | 6226:14936 | 150 | Icon, Show focus indicator; Type; Size; Width Narrow/Default/Wide; State |
| Icon button - standard / outline / tonal | 6226:15597 / 16258 / 16919 | 150 each | same (no description) |
| Icon button togglable (+ tonal, outline, standard) | 6226:17616 / 19237 / 20858 / 22478 | 300 each | + Icon (selected), Selected |
| Extended FAB | 6239:6498 | 72 | Label text, Icon, Show focus indicator; Size Small/Medium/Large; Color Primary container/Secondary container/Tertiary container/Primary/Secondary/Tertiary; State Enabled/Hovered/Focused/Pressed |
| FAB | 6239:6848 | 72 | Show focus indicator, Icon; Size Default/Medium/Large; Color x6; State x4 |
| .Building Blocks/FAB Menu/{Primary,Secondary,Tertiary}/{Segment, FAB} | 6239:7303-7390 | 4 each | |
| FAB menu | 6239:7406 | 3 | Show 3rd-6th segment; Color x3 containers; Segments 3 |
| Segmented button | 6239:7675 | 16 | Segments 2-5; Density 0/-1/-2/-3 |
| Building Blocks/Segmented button/Button segment (start/middle/end) | 6239:7751 / 7877 / 8003 | 27 each | Icon, Label text; Configuration Label only/Label & icon/Icon only; State; Selected |
| Split button | 6239:8490 | 180 | Leading icon, Show leading icon, Leading label text, Show focus indicator; Size; Color Filled/Tonal/Elevated/Outlined; Leading state; Trailing state (+Selected) |
Anatomy samples: Button Small Round Enabled 96x48 > `Content` 96x40 fill Schemes/Primary/Primary radius 100 (raw) > `State-layer` padding 10/16 gap 8 > Icon 20 (**remote** `stars_filled`) + Label label/large On Primary. Disabled: Content fill `State Layers/On Surface/Opacity-10`, state layer opacity 0.38.
FAB Large Tertiary Pressed 96x96 fill Schemes/Tertiary/Tertiary radius **remote** `Corner/Extra-large` (28) + effect `Elevation Light/3`; State-layer `State Layers/On Tertiary/Opacity-08`, padding 30, Icon 36 remote, Ripple vector Opacity-10.
Page sample: 304 local fills, 0 remote; 63 local / 10 remote text styles; 34 bound / 74 raw radii; effects 12 local + 4 remote.

## ➜ App Bar (sections App Bars 6239:10687, App Bar for XR 6239:10814, Baseline 6239:10859)
App bar 6239:10688 (12): Image (I), Show 1st/2nd/3rd trailing action; Configuration Small-centered/Small-image/Search/Small/Medium/Large; Elevation Flat/On-scroll.
Small-centered Flat: 412x64 padding 8/4 gap 1 = Leading icon (**remote** `Icon button - standard` 48) + Text content (`.Building Blocks/App bar/Content/Text Small`) + Trailing (Avatar 32).
Building blocks: Search bar - Modified (Flat/On-scroll x Centered/Left), Content/Text Small|Medium|Large (Headline, Show-supporting-text, Supporting Text, Alignment), Thumbnail, Avatar (Image/Monogram).
XR/XR App Bar 6239:10816 (6). Bottom app bar 6239:10864 (Show FAB; Icons 1-4).

## ➜ Menu (sections Baseline 6253:23058, Menus 6253:23476)
Menu 6253:23492 (Show scrollbar, Show section label, List 1-3 content slots; Theme Standard/Vibrant; Groups 1-3) · Menu item/Standard 6253:23617 & /Vibrant 6253:23710 (Show leading/trailing element, Show divider, Show focus indicator, Content slot; State Enabled/Hovered/Focused/Pressed/Disabled/Active; Selected) · building blocks Leading element (Icon/Indent/Slot), Content (Text/Slot), Trailing element (Text/Icon/Slot/Badge), Label-basic / Label-vibrant.
Baseline: Menu (baseline) 6253:23426 (Density 0/-2/-4) + Menu list item (0, -2, -4 density) + Leading/Trailing element (+selected).
Sample: 219 local / 159 remote fills; 72 local / 103 remote text styles.

## ➜ Navigation (sections Navigation Bars 6253:26883, Navigation Rail for XR 27952, Navigation Bar for XR 28256, Navigation rail 28426)
Navigation Bar: Horizontal items 6253:27221 (Nav items 3-6) - 3 items: 741x64 fill Surface Container, padding 0/160 gap 20 (tablet width) · Navigation Bar: Vertical items 6253:27244 (3-5).
Horizontal nav item 6253:27054 Selected: 92x64; `Icon container` 92x40 fill Secondary Container radius 20; state layer padding 8/16 gap 4; Icon + Icon (selected) (**remote** `stars` / `stars_filled`); Label label/medium On Secondary Container. Props: Icon, Icon (selected), Label text, Show Label Text, Show focus indicator; State x4; Badge None/Small/Large; Selected.
Vertical nav item 6253:26886 (24). Navigation Rail 6253:29093 (Show FAB, Show Menu, Segments slot; Alignment Top/Middle; Nav items 3-6) · Navigation Rail: Expanded 6253:28884 (Type Docked/Floating) · rail items vertical 6253:28430 (48, Show label) / horizontal 6253:28741 · XR rail 6253:27953 / XR bar 6253:28409 + items.
Sample: 226 local fills, 0 remote; 69 local text styles.

## ➜ Toolbar (sections Toolbars 6262:16733, Toolbars for XR 6262:17102)
Toolbar 6262:17053 (Content (standard) / (vibrant) slots; Configuration Floating/Docked; Orientation Horizontal/Vertical; Color Vibrant/Standard) + Standard/Vibrant building blocks (Icon button, Icon button toggleable, Button toggleable) + XR/XR Toolbar 6262:17103 and XR building blocks (Surface high, Tertiary container, Surface).

## ➜ Tabs (section Tabs 6261:9710, Building Blocks 6261:9828)
Tabs 6261:9711 (Tab group slot; Configuration Fixed/Scrollable; Style Primary/Secondary; Layout Icon only/Label & icon/Label only) 10.
Items: Primary tabs/Icon and label 6261:9830, Icon only 9899, Label only 9960; Secondary tabs/Label only 10013, Icon and label 10062 - each 8 = Selected x State (Enabled/Hovered/Focused/Pressed); Icon, Label text, Show focus indicator, Show badge.
Primary Icon and label Selected Pressed: 56x64 fill Surface; State-layer `State Layers/Primary/Opacity-08` padding 0/16; label title/small Primary; Indicator 24x6; Ripple ellipse Opacity-10.
Sample: 104 local / 27 remote fills.
