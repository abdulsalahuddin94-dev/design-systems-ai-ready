# Navigation - components (Astryx Library DS)

> **Node IDs:** none are stored here. In a duplicate every id changes, so find components, styles and variables by **name**.

> **Generated** from `data/component-registry.json` (read-only FigCli scan, 2026-10-06). When this file and the JSON differ, the JSON wins.

40 components, 851 variants. Light screenshots of every set were checked; Dark was checked by computed contrast (see `contrast` column), not by screenshots.


## Atoms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| .CommandPaletteEmpty (internal) | Overlay | 1 | - | Message (text) | - | **no** | 0/0 |
| .CommandPaletteItem (internal) | Overlay | 3 | State: Rest, Highlighted, Selected | Label (text), Has End Content (boolean) | End Content | **no** | 0/0 |
| .ContextMenuItem (internal) | Action | 3 | Variant: Default, Disabled, Destructive | hasDescription (boolean), hasShortcut (boolean) | - | **no** | 0/0 |
| .OutlineItem (internal) | Navigation | 16 | State: Rest, Active; Density: Default, Compact; Level: 1, 2, 3, 4 | Label (text) | - | **no** | 0/0 |
| Breadcrumbs / BreadcrumbItem | Navigation | 12 | Type: Link, Current; Variant: Default, Supporting; State: Rest, Hovered; Separator: Chevron, Slash | Show Separator (boolean), Has Icon (boolean), Has Menu (boolean) | - | **no** | 0/0 |
| Button | Action | 576 | Variant: Primary, Secondary, Ghost, Destructive; Size: SM, MD, LG; State: Rest, Hover, Pressed, Disabled, Focused, Loading; Type: Default, Icon Only; Elevation: none, low, med, high | Icon (boolean), Label (text), Icon Source (instance_swap), Has End Content (boolean) | End Content | yes | 0/0 |
| Button / ToggleButton | Action | 12 | size: sm, md, lg; isPressed: false, true; isIconOnly: false, true | Label (text) | - | yes | 0/0 |
| Chat / ChatDictationButton | Chat | 4 | state: idle, listening; size: sm, md | - | - | **no** | 0/0 |
| Chat / ChatLayoutScrollButton | Chat | 2 | State: Collapsed, Expanded | - | - | yes | 0/0 |
| Chat / ChatSendButton | Chat | 6 | State: send, stop, disabled; Size: sm, md | - | - | yes | 0/0 |
| DropdownMenu / DropdownMenuCheckboxItem | Action | 2 | Checked: false, true | - | - | **no** | 0/0 |
| DropdownMenu / DropdownMenuItem | Action | 6 | State: Rest, Highlighted, Disabled; hasIcon: true, false | - | - | **no** | 0/0 |
| DropdownMenu / DropdownMenuRadioItem | Action | 2 | Selected: false, true | - | - | **no** | 0/0 |
| Link | Action | 64 | Color: active, primary, secondary, inherit; State: Default, Hover, Focus, Disabled; Underline: No, Yes; External: No, Yes | - | - | **no** | 0/0 |
| MoreMenu | Action | 24 | Variant: Ghost, Secondary; Size: SM, MD, LG; State: Rest, Hover, Disabled, Open | - | - | **no** | 0/0 |
| Navigation / .MobileNavToggle (internal) | Navigation | 2 | State: Rest, Hover | - | - | yes | 0/0 |
| Navigation / .SideNavCollapseButton (internal) | Navigation | 2 | State: Expanded, Collapsed | - | - | **no** | 0/0 |
| Navigation / .SideNavItem (internal) | Navigation | 12 | State: Default, Hover, Selected, Disabled; Size: md, sm, lg | Label (text), Show Icon (boolean), Show EndContent (boolean), Nested (boolean), Has Expand (boolean), Expanded (boolean) | EndContent | yes | 0/0 |
| Navigation / .TopNavItem (internal) | Navigation | 24 | state: default, hover, selected, disabled; Size: md, sm, lg; isIconOnly: false, true | label (text), hasIcon (boolean) | - | **no** | 0/0 |
| Tabs / .Tab (internal) | Navigation | 6 | size: sm, md, lg; state: default, selected | Label (text), Show Icon (boolean), Show End Content (boolean), isLabelHidden (boolean) | End Content | yes | 0/0 |

## Molecules

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Action / ButtonGroup | Action | 6 | Orientation: Horizontal, Vertical; Size: MD, SM, LG | - | Children | yes | 0/0 |
| Breadcrumbs | Navigation | 4 | Variant: Default, Supporting; Icons: false, true | - | Items | **no** | 0/0 |
| DropdownMenu / DropdownMenuRadioGroup | Action | 1 | - | - | - | **no** | 0/0 |
| Navigation / .SideNavHeading (internal) | Navigation | 2 | State: Default, Open | Heading (text), Superheading (text), Has Superheading (boolean), Subheading (text), Has Subheading (boolean), Has Menu (boolean) | - | **no** | 0/0 |
| Navigation / .SideNavSection (internal) | Navigation | 1 | - | Title (text), Subtitle (text), Has Subtitle (boolean), Show EndContent (boolean), Show Header (boolean) | - | yes | 0/0 |
| Navigation / .TopNavMegaMenuFeaturedCard (internal) | Navigation | 1 | - | - | Content | **no** | 2/1 |
| Navigation / .TopNavMegaMenuItem (internal) | Navigation | 2 | State: Rest, Hover | - | - | **no** | 0/0 |
| Navigation / TopNavHeading | Navigation | 1 | - | Heading (text), Superheading (text), Subheading (text), Has Superheading (boolean), Has Subheading (boolean), Has Menu (boolean) | - | **no** | 0/0 |
| Navigation / TopNavMenu | Navigation | 2 | State: Closed, Open | Label (text) | Content | **no** | 0/0 |
| Outline | Navigation | 1 | - | - | Children | **no** | 0/0 |
| Pagination | Navigation | 10 | Variant: Pages, Count, Compact, Dots, None; Size: md, sm | Has Prev (boolean), Has Next (boolean), Show Page Size Selector (boolean) | Pages | yes | 0/8 |
| Tabs / TabList | Navigation | 6 | size: sm, md, lg; hasDivider: false, true | - | Children | yes | 0/0 |

## Organisms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| CommandPalette | Overlay | 1 | - | - | Input, List, Footer | **no** | 0/0 |
| ContextMenu | Action | 1 | - | - | Children | **no** | 2/8 |
| DropdownMenu | Action | 12 | State: Closed, Open; Size: sm, md, lg; Trigger: Label, Icon Only | - | - | **no** | 0/0 |
| Navigation / MobileNav | Navigation | 4 | Side: Start, End; Header: True, False | header (text) | Children, Header Content | yes | 0/28 |
| Navigation / SideNav | Navigation | 2 | State: Expanded, Collapsed | - | Top Content, Items, Footer | **no** | 0/0 |
| Navigation / TopNav | Navigation | 1 | - | Has Center Content (boolean) | Heading, Start Content, Center Content, End Content | yes | 0/0 |
| Navigation / TopNavMegaMenu | Navigation | 2 | State: Closed, Open | - | Content | **no** | 2/1 |
| Toolbar | Action | 12 | Layout: Start + End, Start + Center + End; Density: Default, Compact; Variant: Transparent, Section, Wash | Bottom Divider (boolean) | Start Content, End Content, Center Content | yes | 12/0 |

## Figma descriptions (as written in the file)

- **Action / ButtonGroup**: Groups Button/IconButton children with connected styling â€” shared 1px dividers, rounded outer corners only, horizontal or vertical. Orientation and Size cascade to children. Default children = Secondary.
- **Button**: XDS Button component with 4 variants (Primary, Secondary, Ghost, Destructive), 3 sizes (SM, MD, LG), interaction states, and icon-only mode. Toggle the Icon boolean to show a leading icon. Supports label text override.
- **Button / ToggleButton**: A button that toggles between pressed and unpressed states. Ghost-style button with overlay-pressed background when active, semibold text emphasis, and icon swap support. Use for toolbar actions, view mode switches, and formatting controls. Works standalone or inside XDSToggleButtonGroup.
- **Chat / ChatLayoutScrollButton**: Floating scroll-to-bottom button for ChatLayout. Fades in as a compact icon button (Collapsed) and expands to show a label (Expanded) when new messages arrive.
- **Chat / ChatSendButton**: Circular send/stop toggle button for the chat composer (reuses Button). State: send (primary, arrow-up), stop (secondary, square), disabled (primary disabled). Size: sm/md.
- **Navigation / .MobileNavToggle**: Hamburger toggle button that opens/closes the mobile nav drawer. Ghost, icon-only Button with the Lucide menu (hamburger) icon. Accessible label ('Open navigation') is set at runtime â€” no Figma prop. Reads open state from AppShell context in code.
- **Navigation / .SideNavItem**: Navigation item for XDSSideNav. Supports icon, selected state, end content.
- **Navigation / .SideNavSection**: Section grouping for XDSSideNav items with title header.
- **Navigation / MobileNav**: Slide-out drawer overlay for mobile navigation. The mobile counterpart to SideNav â€” accepts the same children (SideNavSection, SideNavItem, or any ReactNode).  Props: â€¢ side: 'start' | 'end' â€” which side the drawer slides from â€¢ header: string â€” simple text heading (default 'Navigation') â€¢ Header Content: slot â€” custom header ReactNode (logo, SideNavHeading, search) â€¢ children: slot â€” drawer conte
- **Navigation / TopNav**: Slot-based top navigation bar (maps to packages/core TopNav.tsx). Fill Heading, Start Content, Center Content, End Content. Toggle 'Has Center Content' for the centered 3-section layout (code centerContent -> 1fr auto 1fr grid). End Content is pushed to the right edge.
- **Pagination**: Prop-driven pagination. VARIANT: Size (md/sm). SLOT: Pages â€” compose page-number Button instances (current page = Secondary variant), ellipsis, first/last. BOOLEAN: Has Prev / Has Next gate the prev/next chevron buttons; Show Page Size Selector reveals the page-size Selector. Prev/Next use real Ghost icon-only Buttons with Lucide chevron-left/right.
- **Tabs / .Tab**: Tab item component. Renders inside XDSTabList. Selected state shows primary text with semibold weight and a bottom indicator bar. Uses textSecondary for default state.
- **Tabs / TabList**: Tab navigation wrapper. Provides size context to XDSTab children. Optional bottom divider. Default size is md.
- **Toolbar**: Prop-driven Toolbar (overhaul). Content areas are native SLOTS (Start / Center / End) â€” drop Buttons, IconButtons, Dividers, SegmentedControls, etc. Bottom Divider is a boolean. VARIANT axes: Layout (Start + End | Start + Center + End), Density (Default | Compact), Variant (Transparent | Section | Wash). Replaces the deprecated 48-variant matrix.
