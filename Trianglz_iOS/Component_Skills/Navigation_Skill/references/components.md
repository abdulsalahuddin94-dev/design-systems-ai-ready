# iOS Navigation - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## ➜ Tab Bar (frame 179:1535; Light 263:1240 and Dark 263:1247 preview frames with Color / Semantic mode)
### _Tab Bar Button - iPhone - 10:1712
Props: Symbol (T), Label (T), Mode Light|Dark, Selected True|False.
- Selected (72x54): `Selection` rect 76x54 fill Backgrounds/Group radius 100; `Symbol` stack (padding 6/8/7/8, gap 1) = icon instance `Component 1 / Property 1=Selected` 24x24 + label Caption2/Emphasized fill Brand Primary; overlay rects `FFFFFF @50%` (raw) and `Tint (Plus D)` Brand Primary (blend layers). Dark uses `000000 @ 50%` + `Tint (Plus L)` (a vector).
- Unselected (72x50): `Tab image` + label Text/Secondary Text Caption2/Emphasized.
- Symbol TEXT property exists but the icon is an instance (the text prop is a leftover from Apple's glyph version).
### _Tab Bar Button - iPhone - Search - 10:1695: Symbol (T), Mode, Is Selected.
### Tab Bar - iPhone - 10:1739 (24 variants)
Minimized False|True x Tabs 2|3|4|5 x Type Default|Search Role|Prominent Tab.
Tabs=4 Default: 402x95, padding 16/25/25/25; `Tab Bar Buttons` (352x54, gap -8) = remote `Liquid Glass - Regular - Small (Mode=Light, Active=True, Prominent=False)` BG + 4 `_Tab Bar Button - iPhone` instances (first Selected). Minimized: 402x88, single 48pt glass circle with the selected tab.
Page totals: 174 local fills, 189 raw, 185 raw paddings, 111 raw radii, 80 raw effects, 50 local text styles.

## ➜ Buttons (frame 197:3432 + example sections 197:2525 Light, 197:2634 Dark (remote mode), 197:2743 / 197:2752 context examples)
### Button - Content Area - 197:2272 (108)
Props: Label (T), Symbol (T), Size Small|Medium|Large, Style Bordered - Prominent|Bordered|Borderless, Label Style Title and Icon|Icon only|Title only, Is Enabled, Destructive.
- Medium Bordered Prominent Title only: 57x34, fill Brand Primary, padding 7/14, gap 4, radius 1000; Label "Play" fill Text/On Brand Text, SF Pro Regular 15 (remote `Subheadline/Regular`).
- Medium Bordered Title and Icon: fill remote `Fills/Tertiary`; Symbol glyph "􀊄" + Label, both Brand Primary.
- Large Borderless Icon only Destructive: 50x50 radius 500, Symbol glyph fill remote `Accents/Red`, remote `Body/Regular`.
### Button - Liquid Glass - Text - 197:2788 (24): Size Small|Medium|Large, Style Glass Prominent|Glass, Is Enabled, Destructive.
Medium Glass Prominent: 69x34 padding 8/12 gap 4 radius 1000 = remote `Liquid Glass - Regular - Small (Prominent=True)` + `_Label - Text (Size=Large, Type=Preferred)`.
### Button - Liquid Glass - Symbol - 197:2861 (8): Style, Is Enabled, Destructive.
### _Label - Text - 197:2886 (24): Label (T), Mode Dark|Light, Size Large|Small, Type Destructive|Default|Preferred, Is Enabled False|True.
### _Label - Symbol - Preferred 197:2761 / Default 197:2770 / Destructive Default 197:2779: Label (T), Mode, Is Enabled.
Page totals: 104 local fills, 165 remote, 114 raw; 144 remote text styles, 48 unstyled texts; 295 raw radii; 64 raw effects.

## ➜ Action Sheets + Alerts (frame 179:943)
### Alert - 7:1004: Title (T), Actions (Slot), Message (T), Show Message (B), Show Text Field (B), Button Layout Side-by-Side|Stacked.
300x305, padding 14, BG remote `Liquid Glass - Regular - Medium`; `Title and Description` (padding 8/8/24/8, gap 8): Title Headline/Emphasized fill remote `Labels/Primary`, Description Body/Regular; `Text Field` instance (radius 26); `Buttons` row gap 8 with `_Buttons` Cancel + Default (132x48, padding 13/16, radius 100).
### Action Sheet - 7:972 (component): Title (T), Message (T), Show Message (B). Title/Description use local Text/Primary Text; Actions = **remote** `_Buttons` instances (Destructive, None...) although a local `_Buttons` set exists.
### _Buttons - 7:1113 (8): Title (T), Mode, Role None|Default|Destructive|Cancel. Default = BG rect remote `Accents/Blue` radius 100 + label remote `Grays/White` Body/Emphasized; root raw #ffffff 60%.
### Text Field - 7:1024 (Second Field B), _Text Field Background - 7:1054 (Mode).
Page totals: 4 local fills, 43 remote, 22 raw; 28 local text styles; 49 raw radii.
