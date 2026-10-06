# Data Display - components (Astryx Library DS)

> **Node IDs:** none are stored here. In a duplicate every id changes, so find components, styles and variables by **name**.

> **Generated** from `data/component-registry.json` (read-only FigCli scan, 2026-10-06). When this file and the JSON differ, the JSON wins.

58 components, 479 variants. Light screenshots of every set were checked; Dark was checked by computed contrast (see `contrast` column), not by screenshots.


## Atoms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| .TreeRail (internal) | Table & List | 1 | - | Line (boolean) | - | **no** | 0/0 |
| AspectRatio | Layout | 3 | Ratio: 4:3, 1:1, 16:9 | - | - | **no** | 3/0 |
| Avatar | Content | 60 | Size: Tiny, XSmall, Small, Medium, Large; Content: Image, Initials, Icon; Status: None, Positive, Neutral, Negative | - | - | **no** | 0/0 |
| Avatar | Content | 15 | Size: lg, md, sm, xl, xsm; Content: Image, Initials, Icon | Status (boolean), Initials (text) | - | **no** | 0/0 |
| Avatar / AvatarStatusDot | Content | 9 | Variant: Positive, Neutral, Negative; Size Tier: Small, Medium, Large | - | - | **no** | 0/0 |
| Badge | Feedback & Status | 28 | Variant: Neutral, Info, Success, Warning, Error, Blue, Cyan, Green, Orange, Pink, Purple, Red, Teal, Yellow; Shape: Pill, Dot | Icon (boolean), Label (text) | - | yes | 1/0 |
| Chat / ChatMessageMetadata | Chat | 6 | status: none, sending, sent, delivered, read, error | - | - | **no** | 0/0 |
| Chat / ChatSystemMessage | Chat | 2 | variant: default, divider | - | - | **no** | 0/0 |
| Chat / ChatTokenizedText | Chat | 1 | - | - | - | **no** | 0/0 |
| Citation | Content | 3 | Variant: Label, Number; Icon: No, Yes | - | - | **no** | 1/0 |
| Code | Content | 3 | Color: Primary, Secondary, Inherit; Size: inherit | Code (text) | - | **no** | 1/0 |
| Divider | Layout | 8 | Orientation: horizontal, vertical; Variant: subtle, strong; Label: false, true | - | - | **no** | 0/0 |
| Heading | Content | 4 | Level: 1, 2, 3, 4 | Content (text) | - | yes | 0/0 |
| Kbd | Content | 4 | Keys: Single, Double, Triple, Quad | Key Label (text), Key 1 Label (text), Key 2 Label (text), Key 1 Label2 (text), Key 2 Label2 (text), Key 3 Label (text), Key 1 Label3 (text), Key 2 Label3 (text), Key 3 Label2 (text), Key 4 Label (text) | - | yes | 0/0 |
| ResizeHandle | Layout | 12 | Direction: Horizontal, Vertical; State: Default, Active; Pill Placement: Center, Start, End | Has Divider (boolean), Always Visible (boolean) | - | **no** | 0/0 |
| Skeleton | Feedback & Status | 7 | Radius: none, 0, 1, 2, 3, 4, rounded | - | - | yes | 0/0 |
| Spinner | Feedback & Status | 16 | Size: sm, md, lg, xl; Shade: default, onMedia; Label: false, true | - | - | **no** | 4/0 |
| StatusDot | Feedback & Status | 10 | Variant: positive, warning, negative, info, neutral; isPulsing: false, true | - | - | yes | 0/0 |
| TableCell | Table & List | 9 | Density: Compact, Balanced, Spacious; State: Default, Hovered, Selected | Align Right (boolean), Leading Checkbox (boolean), Leading Expand (boolean), Divider Bottom (boolean), Divider Right (boolean) | Content | **no** | 0/0 |
| TableHeaderCell | Table & List | 9 | Density: Compact, Balanced, Spacious; Sort: None, Ascending, Descending | Label (text), Sortable (boolean), Align Right (boolean), Has Checkbox (boolean), Has Filter (boolean), Resizable (boolean) | Content | **no** | 0/0 |
| Text | Content | 2 | Truncation: none, single-line | Content (text) | - | yes | 0/0 |
| Thumbnail | Content | 4 | State: Image, Placeholder, Loading, Uploading | Remove (boolean) | - | **no** | 0/0 |
| Timestamp | Content | 32 | Format: Relative, Auto, Date, Date Time, Time, System Date, System Date Time, System Time; Color: Primary, Secondary, Disabled, Active | - | - | yes | 0/0 |
| Token | Content | 44 | Color: Default, Red, Orange, Yellow, Green, Teal, Cyan, Blue, Purple, Pink, Gray; Size: SM, MD; State: Default, Disabled | Has Icon (boolean), Removable (boolean), Label (text), End Content (boolean) | [Slot: endContent] | **no** | 0/0 |
| Tooltip | Overlay | 1 | - | Content (text) | - | **no** | 0/0 |

## Molecules

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Banner | Feedback & Status | 8 | Status: info, success, warning, error; Container: card, section | Title (text), Description (text), Has Description (boolean), Is Dismissable (boolean), Has Content Area (boolean), Is Collapsible (boolean) | Content, End Content | yes | 0/0 |
| Blockquote | Content | 1 | - | Has Cite (boolean), Cite (text) | Content | yes | 0/0 |
| Card | Container | 16 | Padding: none, compact, default, spacious; Elevation: none, low, med, high | - | Content | yes | 0/0 |
| Chat / ChatMessage | Chat | 2 | sender: assistant, user | - | - | **no** | 0/0 |
| Chat / ChatMessageBubble | Chat | 4 | sender: assistant, user; variant: filled, ghost | - | - | **no** | 0/0 |
| ClickableCard | Container | 20 | State: Rest, Hover, Pressed, Focused, Disabled; Elevation: none, low, med, high | - | Content | yes | 16/16 |
| Collapsible | Container | 2 | State: Collapsed, Expanded | triggerLabel (text), isDisabled (boolean) | Content | **no** | 0/0 |
| EmptyState | Content | 2 | Size: Default, Compact | Title (text), Description (text), Has Description (boolean), Has Icon (boolean), Has Actions (boolean) | Icon, Actions | **no** | 0/0 |
| HoverCard | Overlay | 1 | - | - | Content | **no** | 0/3 |
| Item | Table & List | 6 | Density: Compact, Balanced, Spacious; Align: Center, Start | Label (text), Description (text), Has Description (boolean), Has Marker (boolean), Has Start Content (boolean), Has End Content (boolean) | Marker, Start Content, End Content | yes | 0/0 |
| Layout / Section | Layout | 3 | Variant: section, transparent, wash | - | Children | **no** | 0/2 |
| List / .ListItem (internal) | Table & List | 12 | Density: Compact, Balanced, Spacious; State: Default, Hovered, Selected, Disabled | Description (boolean), Has Start Content (boolean), Has End Content (boolean), Label Text (text), Description Text (text), Divider (boolean) | Start Content, End Content | **no** | 3/0 |
| MetadataList / MetadataListItem | Table & List | 2 | Layout: Inline, Stacked | Icon (boolean), Label (text), Value (text) | Value Slot | **no** | 0/0 |
| OverflowList | Table & List | 4 | State: All Visible, Overflowed; Collapse From: End, Start | overflowLabel (text), item1Label (text), item2Label (text), item3Label (text), item4Label (text), item5Label (text) | - | yes | 0/0 |
| Overlay | Overlay | 9 | Scrim: dark, light, none; Align: end, start, center | - | DATA-UNSPLASH-@manrason-Nature, Overlay Content | yes | 6/6 |
| Popover | Overlay | 1 | - | hasCloseButton (boolean), title (text) | Content | **no** | 0/2 |
| ProgressBar | Feedback & Status | 10 | Variant: accent, warning, error, success, neutral; Mode: Determinate, Indeterminate | Label (boolean), Value Label (boolean), Label Text (text), Value Text (text) | - | **no** | 0/0 |
| SelectableCard | Container | 24 | Selected: false, true; State: rest, hover, disabled; Elevation: none, low, med, high | - | Children | **no** | 0/32 |
| Toast | Overlay | 2 | type: default, error | - | - | **no** | 0/0 |
| TreeList / .TreeListItem (internal) | Table & List | 9 | Node: Expanded, Collapsed, Leaf; State: Default, Selected, Disabled | Label (text), Description (text), Has Description (boolean), Has Start Content (boolean), Has End Content (boolean) | Start Content, End Content, Rails | **no** | 0/0 |

## Organisms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Carousel | Container | 1 | - | Has Edge Fade (boolean), Has Buttons (boolean) | Children | yes | 0/0 |
| Chat / ChatMessageList | Chat | 1 | - | - | Content | yes | 0/0 |
| Chat / ChatToolCalls | Chat | 8 | status: pending, running, success, error; state: collapsed, expanded | Tool Name (text), Target (text), Show Target (boolean), Show Duration (boolean) | Details | **no** | 34/34 |
| CodeBlock | Content | 2 | size: md, sm | header (boolean), lineNumbers (boolean), copyButton (boolean), title (text) | - | **no** | 24/22 |
| Dialog | Overlay | 2 | Variant: Standard, Fullscreen | Title (text), Has Subtitle (boolean), Subtitle Text (text), Has Close Button (boolean), Has Header Divider (boolean), Has Footer (boolean), Has Footer Divider (boolean) | Body, Footer Actions, Header Start, Header End | **no** | 0/2 |
| Layout / FormLayout | Layout | 3 | Direction: Vertical, Horizontal, Horizontal Labels | - | - | **no** | 0/0 |
| Lightbox | Overlay | 1 | - | Has Navigation (boolean), Has Caption (boolean), Has Zoom (boolean), Has Thumbnails (boolean) | Media | **no** | 2/0 |
| List | Table & List | 1 | - | Header (boolean), Header Text (text) | Children | **no** | 0/6 |
| Markdown | Content | 2 | density: default, compact | - | - | yes | 22/22 |
| MetadataList | Table & List | 8 | Orientation: Vertical, Horizontal; Label Position: Start, Top; Columns: Single, Multi | title (boolean), showMore (boolean) | - | **no** | 0/0 |
| TreeList | Table & List | 2 | variant: lineGuides, noGuides | Header (text), Has Header (boolean) | Children | **no** | 0/0 |

## Patterns

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| AppShell | Layout | 16 | Variant: Elevated, Wash, Surface, Section; Nav Layout: TopNav + SideNav, SideNav Only, TopNav Only, Content Only | Banner (boolean) | - | **no** | 24/0 |
| Chat / ChatLayout | Chat | 1 | - | - | - | **no** | 1/1 |

## Figma descriptions (as written in the file)

- **Badge**: XDS Badge â€” status indicator in pill or dot shape. 5 semantic variants (Neutral, Info, Success, Warning, Error). Pill shows label + optional icon; Dot is a minimal 8px circle.
- **Banner**: Persistent status notification for info, warning, error, or success messages. Supports optional description, dismissible behavior, collapsible content area, and end-area slot for action buttons.
- **Blockquote**: A styled quotation (<blockquote>) with a left accent rule and optional attribution. Content slot holds the quote; toggle "Has Cite" to show the citation footer.
- **Card**: A card container with border and themed styling. Use the Padding property to control internal spacing. The Content slot accepts any content.
- **Carousel**: Horizontal scroll container (Carousel). â€¢ Children â€” native slot: the horizontal scroll row of items (default = Card instances). â€¢ Has Edge Fade â€” gradient fade masks at both edges signalling off-screen items. â€¢ Has Buttons â€” prev/next circular nav buttons (ghost icon-only), shown when scrollable. â€¢
- **Chat / ChatMessageList**: Scrolling container that stacks Chat / ChatMessage rows in a vertical auto-layout with density-based spacing (balanced). Content is a native slot; gap and padding bound to Spacing.
- **ClickableCard**: ClickableCard â€” an interactive Card used as a navigation or action target (onClick / href). Built on the Card surface (bg variant, container radius, border, padding). State axis: Rest, Hover (5% overlay + emphasized border), Pressed (10% overlay + emphasized border), Focused (2px accent focus ring), Disabled (50% opacity). The Content slot accepts any card content; nested interactive elements work
- **Heading**: Semantic heading component. Renders h1â€“h6 elements with themed styling.  Props: level (required), color, accessibilityLevel, display, maxLines, hasStrikethrough, hasCapsize
- **Item**: Generic row/list-item layout primitive: [Marker] [Start Content] [Label + Description] [End Content]. Density controls block padding (Compact/Balanced/Spacious); Align controls vertical alignment of leading/trailing content. Slots: Marker, Start Content, End Content. Gated by Has Marker/Start Content/Description/End Content. Basis for List and MetadataList rows.
- **Kbd**: Displays keyboard shortcuts as styled key badges. Use "Keys" variant to set number of keys.  Symbols: âŒک Cmd, âŒƒ Ctrl, âŒ¥ Alt, â‡§ Shift, â†µ Enter, âŒ« Backspace, â‡¥ Tab, â†‘â†“â†گâ†’ Arrows
- **Markdown**: Renders a markdown string as XDS-styled components. Supports headings, paragraphs, bold/italic, inline code, code blocks, blockquotes, lists, tables, links, and horizontal rules. Use for AI responses, documentation, and user-generated content.
- **OverflowList**: A horizontal list that hides items that don't fit and shows an overflow indicator. Items that overflow are collapsed from either end. The overflow indicator (e.g. "+3 more") appears when items don't fit.  Props: children, gap (SpacingStep, default 2), collapseFrom (start|end), minVisibleItems, behavior (observeSelf|observeParent), overflowRenderer
- **Overlay**: Overlay â€” renders `content` on top of base media (image/card/video) with a scrim. Base slot = base content; Overlay Content slot = content shown over the scrim.  Variants: â€¢ Scrim: dark (Core/Overlay token) | light (light translucent) | none (transparent) â€¢ Align: start (top-left) | center | end (top-right) â€” matches CSS flex mapping for position=fill.  Defaults: scrim=dark, align=end, position=fi
- **Skeleton**: A placeholder shape that indicates content is loading. Renders a pulsing block with configurable width, height, and border radius. Use the Radius property to control corner rounding.
- **StatusDot**: A small colored dot indicator for status display (online/offline, severity, etc). Fixed 8px size. isPulsing shows the mid-pulse state at 50% opacity â€” in code, this animates between 100% and 50% opacity.
- **Text**: Semantic text component. Renders text with type-based styling from the theme. Supports 8 text types, 5 color options, and truncation. Use type="body" for paragraphs, "label" for form labels, "supporting" for helper text, "code" for inline code, and "display-*" for hero headings.
- **Timestamp**: Displays formatted timestamps. Supports relative, absolute, and system formats with configurable color.
