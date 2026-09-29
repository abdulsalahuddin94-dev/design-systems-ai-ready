# Android Data Display - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

| Set | Id | Properties | Anatomy / tokens (first variant) | Page sample totals |
|---|---|---|---|---|
| Stacked card | 6239:11690 | Slot swap (I), Show secondary action, Header text, Subhead text, Title text, Subtitle text, Supporting text, Content (S); Style Outlined/Elevated/Filled; Layout Slot / Media & text | 360x480 radius 12; Content section (Header 72 padding 12/4/12/16, Media 188, Text content padding 16 gap 32) over `Background` = `.Building Blocks/Card states/Outlined` (Surface + Outline Variant) | Cards: 38 local / 4 remote fills; 9 remote + 6 unstyled texts |
| Horizontal card | 6239:11763 | Slot swap, Header text, Subhead text, Content; Style; Layout | | |
| Card states Outlined / Elevated / Filled | 6239:11809 / 11821 / 11833 | Show focus indicator; State Enabled/Hovered/Focused/Pressed/Dragged | | |
| Basic dialog | 6247:26947 | Show divider, Title, Supporting text, Content (S); Icon True/False | 312x240 Surface Container High radius 28; Title & Description padding 24/24/0/24 gap 16; Divider (remote `Horizontal/Full-width`); Actions padding 20/24/20/8 gap 8 with **remote** `Button - text` x2 | Dialogs: 218 local / **238 remote** fills; 56 local / **216 remote** text styles |
| List dialog / Scrollable list dialog | 6247:26968 / 26988 | Title, Supporting text, Content; Icon | | |
| XR/XR Dialog | 6247:27013 | Headline text, Supporting text, Icon, Show secondary action, Show divider, Content; Elevation; Show icon | | |
| Generic avatar | 6263:18913 | Letter (T); Style Check/Monogram/Avatar | 40x40 Primary Container radius 100 (raw), placeholder vector On Primary Container | |
| Badges | 6239:11385 | Badge label (T); Size Large/Small | 16x16 Error, label On Error remote `M3/label/small`, padding 0/4 | |
| Carousel | 6239:12040 | Item 1-5 (I), Show 4th/5th item; Context Mobile/Tablet; Layout Hero/Center-aligned hero/Multi-browse/Uncontained/Multi-aspect ratio | radii bound (8 Shape), 18 raw fills (images), 18 remote text styles | |
| Carousel - Full screen | 6239:12037 | Context Mobile; Layout Full screen | | |
| Suggestion chip | 6243:16133 | Leading icon, Label text, Show focus indicator; Style Outlined/Elevated; State x6 (incl. Dragged, Disabled); Selected; Show icon | | Chips: 47 local, 2 remote, **31 raw** fills |
| Filter chip | 6243:16322 | Trailing icon, Leading icon, Label text, Show focus indicator; Style; Configuration Label only/Label & leading icon; State x6; Selected; Show trailing icon | Elevated Disabled Selected: 104x32 radius 8 fill `State Layers/On Surface Variant/Opacity-10`, state layer padding 6/8 gap 8, Selected icon **remote** `check` 18, label/large On Surface, trailing remote `arrow_drop_down` | |
| Assistive chip | 6243:16757 | Leading icon, Branded icon, Favicon, Label text, Show focus indicator; Style; Configuration Label only/Label & icon/Label & favicon/Label & brand icon; State x6 | | |
| Input chip | 6243:16962 | Leading icon, Avatar, Label text, Show focus indicator; Configuration; State Enabled/Hovered/Focused/Dragged; Selected; Show closing icon false/true (lowercase) | | |
| Chip groups | 6243:17184 | Type; Layout | | |
| Horizontal / Vertical divider | 6251:3296 / 3309 | `Property 1` (generic name) | | |
| List | 6251:5346 | Show divider; Type x6; Multi-line | | Lists: 286 local / 109 remote fills; 109 local / 130 remote text styles |
| List item | 6251:5509 | Show trailing element, Show leading element, Show focus indicator, Content (S); Alignment Middle/Top; State x6; Selected | | |
| List item - Accordion  (trailing space) | 6251:5666 | Accordion Collapsed/Expanded | | |
| List Item - Swipe | 6251:5671 | Swipe state Default/Initiate reveal/Swipe Action/Revealed | | |
| Building blocks Leading / Trailing / Content / Reveal / Accordion buttton (typo) | 6251:5683 / 5707 / 5730 / 5739 / 5767 | see SKILL | | |
| List Item: 0 / -2 / -4 Density (baseline) | 6251:12306 / 9650 / 7268 | many booleans (Show leading avatar, icon, image, video, checkbox, radio, switch, divider...), texts (Overline, Headline, Supporting, Trailing), Condition | 238 / 217 / 197 variants | |
| Full Lists | 6251:19565 | `Property 1` List (baseline) / -2 / -4 | | |
| Shape Set | 6264:19851 | Shape x35 | | |
| Side Sheet | 6259:31921 | Show actions, Headline text, Content; Type Standard/Modal; Show back | | Sheets: 32 local fills; 4 unstyled texts |
| Bottom sheet | 6259:31984 | Show drag handle, Content; Modal | | |
| Snackbar | 6259:37768 | Supporting text; Configuration x3; **unnamed property** (`# of lines`?) One line/Two lines; Show close affordance | 344x112 **remote** `Schemes/Inverse Surface`, remote `M3/body/medium`, remote `M3/Elevation Light/3`, radius 4; action = `.Building Blocks/Snackbar-action`, close 48 | Snackbar: 7 local / 6 remote fills |
| Plain Tooltip | 6262:18531 | Supporting text; Type Single/Multi line | 108x24 Inverse Surface, body/small Inverse On Surface, padding 4/8, radius 4 | |
| Rich Tooltip | 6263:18853 | Show Subhead, Subhead text, Supporting text, Show actions, Show secondary button | | |
