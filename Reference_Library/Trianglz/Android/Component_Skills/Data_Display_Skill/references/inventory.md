# ⭐Data display - live inventory (FigCli read-only extract, 2026-10-01)

> Generated from the open file "Trianglz - Android M3 x Design System" with a read-only script (nothing changed). Every component set and standalone component on the group's pages, in page order. Find them by **name**, never by id.
> Columns: page | section | name | variants | default size | Figma description present | properties ([V] variant options, [B] boolean default, [T] text, [I] instance swap, [S] slot). Building blocks start with `.Building Blocks/` or `Building Blocks/` (private, do not instance in screens).

| Page | Section | Name | Variants | Size | Desc | Properties |
|---|---|---|---|---|---|---|
| ➜ Cards | Cards | `Stacked card` | 6 | 360x480 | yes | Slot swap[I]; Show secondary action[B]=true; Header text[T]; Subhead text[T]; Title text[T]; Subtitle text[T]; Supporting text[T]; Content[S]; Style[V]=Outlined/Elevated/Filled; Layout[V]=Slot/Media & text |
| ➜ Cards | Cards | `Horizontal card` | 6 | 360x80 | yes | Slot swap[I]; Header text[T]; Subhead text[T]; Content[S]; Style[V]=Outlined/Elevated/Filled; Layout[V]=Slot/Media & text |
| ➜ Cards | Cards | `.Building Blocks/Card states/Outlined` | 5 | 360x360 | **no** | Show focus indicator[B]=false; State[V]=Enabled/Hovered/Focused/Pressed/Dragged |
| ➜ Cards | Cards | `.Building Blocks/Card states/Elevated` | 5 | 360x360 | **no** | Show focus indicator[B]=false; State[V]=Enabled/Hovered/Focused/Pressed/Dragged |
| ➜ Cards | Cards | `.Building Blocks/Card states/Filled` | 5 | 360x360 | **no** | Show focus indicator[B]=false; State[V]=Enabled/Hovered/Focused/Pressed/Dragged |
| ➜ Dialogs | Dialogs | `Basic dialog` | 2 | 312x240 | yes | Show divider[B]=false; Title[T]; Supporting text[T]; Content[S]; Icon[V]=True/False |
| ➜ Dialogs | Dialogs | `List dialog` | 2 | 312x434 | yes | Title[T]; Supporting text[T]; Content[S]; Icon[V]=False/True |
| ➜ Dialogs | Dialogs | `Scrollable list dialog` | 2 | 312x434 | yes | Title[T]; Supporting text[T]; Content[S]; Icon[V]=False/True |
| ➜ Dialogs | Dialogs for XR | `XR/XR Dialog` | 4 | 312x280 | yes | Headline text[T]; Supporting text[T]; Icon[I]; Show secondary action[B]=true; Show divider[B]=false; Content[S]; Elevation[V]=Surface container high/Surface container highest; Show icon[V]=True/False |
| ➜ Avatars | Avatars | `Generic avatar` | 3 | 40x40 | **no** | Letter[T]; Style[V]=Check/Monogram/Avatar |
| ➜ Badges | Badges | `Badges` | 2 | 16x16 | yes | Badge label[T]; Size[V]=Large/Small |
| ➜ Carousel | Carousel | `Carousel - Full screen` | 1 | 412x892 | yes | Context[V]=Mobile; Layout[V]=Full screen |
| ➜ Carousel | Carousel | `Carousel` | 10 | 412x221 | yes | Item 1[I]; Item 2[I]; Item 3[I]; Item 4[I]; Item 5[I]; Show 4th item[B]=true; Show 5th item[B]=true; Context[V]=Mobile/Tablet; Layout[V]=Hero/Center-aligned hero/Multi-browse/Uncontained/Multi-aspect ratio |
| ➜ Chips | Chips | `Suggestion chip` | 48 | 68x32 | yes | Leading icon[I]; Label text[T]; Show focus indicator[B]=false; Style[V]=Outlined/Elevated; State[V]=Enabled/Hovered/Focused/Pressed/Dragged/Disabled; Selected[V]=False/True; Show icon[V]=False/True |
| ➜ Chips | Chips | `.Building Blocks/Favicon` | 1 | 18x18 | **no** | Label text[T]; Leading icon[I] |
| ➜ Chips | Chips | `Filter chip` | 96 | 68x32 | yes | Trailing icon[I]; Leading icon[I]; Label text[T]; Show focus indicator[B]=false; Style[V]=Outlined/Elevated; Configuration[V]=Label only/Label & leading icon; State[V]=Enabled/Hovered/Focused/Pressed/Dragged/Disabled; Selected[V]=False/True; Show trailing icon[V]=False/True |
| ➜ Chips | Chips | `Assistive chip` | 48 | 68x32 | yes | Leading icon[I]; Branded icon[I]; Favicon[I]; Label text[T]; Show focus indicator[B]=false; Style[V]=Outlined/Elevated; Configuration[V]=Label only/Label & icon/Label & favicon/Label & brand icon; State[V]=Enabled/Hovered/Focused/Pressed/Dragged/Disabled |
| ➜ Chips | Chips | `Input chip` | 48 | 60x32 | yes | Leading icon[I]; Avatar[I]; Label text[T]; Show focus indicator[B]=false; Configuration[V]=Label only/Label & leading icon/Label & avatar; State[V]=Enabled/Hovered/Focused/Dragged; Selected[V]=False/True; Show closing icon[V]=false/true |
| ➜ Chips | Chips | `Chip groups` | 8 | 360x48 | **no** | Type[V]=Input chips/Assistive chips/Filter chips/Suggestion chips; Layout[V]=Single row - scrollable/Multiple rows - overflow |
| ➜ Dividers | Dividers | `Horizontal` | 4 | 320x1 | **no** | Property 1[V]=Divider with subhead/Full-width/Inset/Middle-inset |
| ➜ Dividers | Dividers | `Vertical` | 3 | 1x120 | **no** | Property 1[V]=Full-width/Inset/Middle-inset |
| ➜ Lists | Lists | `List` | 12 | 280x312 | **no** | Show divider[B]=false; Type[V]=Standard/Segmented (filled)/Expandable/Draggable/Swipable - standard/Swipable - segmented; Multi-line[V]=False/True |
| ➜ Lists | Lists | `List item` | 24 | 280x80 | **no** | Show trailing element[B]=true; Show leading element[B]=true; Show focus indicator[B]=false; Content[S]; Alignment[V]=Middle-aligned/Top-aligned; State[V]=Enabled/Hovered/Focused/Pressed/Dragged/Disabled; Selected[V]=False/True |
| ➜ Lists | Lists | `List item - Accordion ` | 2 | 280x52 | **no** | Accordion[V]=Collapsed/Expanded |
| ➜ Lists | Lists | `List Item - Swipe` | 4 | 280x52 | **no** | Swipe state[V]=Default/Initiate reveal/Swipe Action/Revealed |
| ➜ Lists | Lists | `Building blocks/Leading element` | 10 | 20x28 | **no** | Icon[I]; Selected[B]=true; Content[S]; Type[V]=Icon/Indent/Image/Avatar/Video/Icon button/Checkbox/Radio/Switch/Slot |
| ➜ Lists | Lists | `Building blocks/Trailing element` | 8 | 49x28 | **no** | Show trailing text[B]=true; Trailing text[T]; Icon[I]; Content[S]; Type[V]=Accordion button/Checkbox/Icon/Icon button/Radio/Switch/Slot/Trailing text only |
| ➜ Lists | Lists | `Building blocks/Content` | 2 | 400x60 | **no** | Show overline text[B]=true; Show supporting text[B]=true; Overline text[T]; Label text[T]; Supporting text[T]; Content[S]; Type[V]=Text/Slot |
| ➜ Lists | Lists | `Building blocks/Reveal element` | 9 | 8x48 | **no** | Actions[V]=1/2/3; Type[V]=Initiate reveal/Revealed/Swipe action |
| ➜ Lists | Lists | `Building blocks/List item/Accordion buttton` | 8 | 32x40 | **no** | Type[V]=Expand/Collapse; State[V]=Enabled/Hovered/Focused/Pressed |
| ➜ Lists | Baseline | `List item/List Item: -4 Density (baseline)` | 197 | 360x72 | yes | State-layer[I]; Show trailing supporting text[B]=false; Show divider[B]=false; Show leading avatar[B]=true; Show leading icon[B]=true; Show image[B]=true; Show video thumbnail[B]=true; Show checkbox[B]=true; Show radio button[B]=true; Show switch[B]=true; Swap divider type[I]; Overline[T]; Headline[T]; Trailing supporting text[T]; Supporting text[T]; Condition[V]=1 line/2 line/3 line+; Leading[V]=None/Monogram/Icon/Image/Video/Check Box/Radio Button/Switch; Trailing[V]=None/Check Box/Icon/Radio Button/Switch; Show overline[V]=False/True; Show supporting text[V]=False/True |
| ➜ Lists | Baseline | `List item/List Item: -2 Density (baseline)` | 217 | 360x80 | yes | State-layer[I]; Show trailing supporting text[B]=false; Show divider[B]=false; Show leading avatar[B]=true; Show leading icon[B]=true; Show image[B]=true; Show video thumbnail[B]=true; Show checkbox[B]=true; Show radio button[B]=true; Show switch[B]=true; Swap divider type[I]; Headline[T]; Overline[T]; Trailing supporting text[T]; Supporting text[T]; Condition[V]=1 line/2 line/3 line+; Leading[V]=None/Monogram/Icon/Image/Video/Check Box/Radio Button/Switch; Trailing[V]=None/Check Box/Icon/Radio Button/Switch; Show overline[V]=False/True; Show supporting text[V]=False/True |
| ➜ Lists | Baseline | `Building Blocks/state-layer/1. enabled` | 1 | 40x40 | **no** |  |
| ➜ Lists | Baseline | `List item/List Item: 0 Density (baseline)` | 238 | 360x88 | yes | State-layer[I]; Show trailing supporting text[B]=false; Show divider[B]=false; Show leading avatar[B]=true; Show leading icon[B]=true; Show image[B]=true; Show video thumbnail[B]=true; Show checkbox[B]=true; Show radio button[B]=true; Show switch[B]=true; Swap divider type[I]; Headline[T]; Overline[T]; Trailing supporting text[T]; Supporting text[T]; Condition[V]=1 line/2 line/3 line+; Leading[V]=None/Monogram/Icon/Image/Video/Check Box/Radio Button/Switch; Trailing[V]=None/Check Box/Icon/Radio Button/Switch; Show overline[V]=False/True; Show supporting text[V]=False/True |
| ➜ Lists | Baseline | `Full Lists` | 3 | 360x672 | **no** | Property 1[V]=List (baseline)/List: -2 Density (baseline)/List: -4 Density (baseline) |
| ➜ Shapes | Shapes | `Shape Set` | 35 | 380x380 | **no** | Shape[V]=4-leaf clover/4-sided cookie/6-sided cookie/7-sided cookie/8-leaf clover/9-sided cookie/12-sided cookie/Arch/Arrow/Boom/Bun/Burst/Circle/Diamond/Fan/Flower/Gem/Ghost-ish/Heart/Hexagon/Oval/Pentagon/Pill/Pixel Circle/Pixel triangle/Puffy/Puffy diamond/Semicircle/Slanted/Soft boom/Soft burst/Square/Sunny/Triangle/Very sunny |
| ➜ Sheets | Side Sheets | `Side Sheet` | 4 | 320x700 | yes | Show actions[B]=true; Headline text[T]; Content[S]; Type[V]=Standard/Modal; Show back[V]=False/True |
| ➜ Sheets | Side Sheets | `Building Blocks/Side sheets/Content` | 2 | 320x543 | **no** | Slot swap[I]; Layout[V]=Empty/Slot |
| ➜ Sheets | Bottom Sheets | `Bottom sheet` | 2 | 412x480 | yes | Show drag handle[B]=true; Content[S]; Modal[V]=False/True |
| ➜ Sheets | Bottom Sheets | `Building Blocks/Bottom sheets/Content` | 2 | 320x444 | **no** | Slot swap[I]; Layout[V]=Empty/Slot |
| ➜ Snackbar | Snackbars | `.Building Blocks/Snackbar-action` | 4 | 60x40 | **no** | Label text[T]; Show focus indicator[B]=false; State[V]=Enabled/Hovered/Focused/Pressed |
| ➜ Snackbar | Snackbars | `.Building Blocks/Snackbar-close-affordance` | 4 | 48x48 | **no** | Show focus indicator[B]=false; State[V]=Enabled/Hovered/Focused/Pressed |
| ➜ Snackbar | Snackbars | `Snackbar` | 10 | 344x48 | yes | Supporting text[T]; Configuration[V]=Text only/Text & action/Text & longer action; # of lines[V]=One line/Two lines; Show close affordance[V]=False/True |
| ➜ Tooltips | Tooltips | `Plain Tooltip` | 2 | 108x24 | yes | Supporting text[T]; Type[V]=Single line/Multi line |
| ➜ Tooltips | Tooltips | `Rich Tooltip` | 1 | 312x136 | yes | Show Subhead[B]=true; Subhead text[T]; Supporting text[T]; Show actions[B]=true; Show secondary button[B]=true |
