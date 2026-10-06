---
name: astryx-data-display
description: Use when building, auditing or coding components that show information with the Astryx Library DS reference (Web) - Card, ClickableCard, SelectableCard, Collapsible, Carousel, Avatar, Badge, Token, StatusDot, Banner, Toast, ProgressBar, Spinner, Skeleton, EmptyState, Heading, Text, Code, CodeBlock, Markdown, Kbd, Timestamp, Citation, Dialog, Popover, HoverCard, Tooltip, Lightbox, Overlay, List, Item, MetadataList, TreeList, OverflowList, table cells, Divider, Section, FormLayout, AppShell and the AI chat messages. Tells the agent which component to use, its axes and slots, and what to fix when copying.
---

# Astryx Library DS (Web) - Data Display

> **Node IDs:** none are stored here; find components by page + set name.

> **Data files:** `../../data/component-registry.json` (exact variants, properties, slots, contrast results), `../../data/tokens.json`, `../../data/rules.json`, `../../data/screen-templates.json`. The JSON wins over this file.

**Load `../../Foundation_Skill/SKILL.md` first.** Scope: everything that displays information. In Figma: the **Container, Content, Feedback & Status, Layout, Overlay, Table & List** pages and the chat message parts (Chat page). Inventory: `references/components.md`; audit: `references/gaps.md`.

## 1. Inventory (58 components, 479 variants)

| Tier | Components |
|---|---|
| Atom | Avatar (two sets: legacy 60 variants, new 15), Avatar / AvatarStatusDot, Badge (28), Token (44), StatusDot (10), Spinner (16), Skeleton (7), Divider (8), Heading (4), Text (2), Code (3), Kbd (4), Timestamp (32), Citation (3), Thumbnail (4), Tooltip, AspectRatio (3), ResizeHandle (12), TableCell (9), TableHeaderCell (9), .TreeRail, Chat / ChatMessageMetadata (6), ChatSystemMessage (2), ChatTokenizedText |
| Molecule | Card (16), ClickableCard (20), SelectableCard (24), Collapsible (2), Banner (8), Toast (2), ProgressBar (10), EmptyState (2), Blockquote, Item (6), List / .ListItem (12), MetadataList / MetadataListItem (2), TreeList / .TreeListItem (9), OverflowList (4), Popover, HoverCard, Overlay (9), Layout / Section (3), Chat / ChatMessageBubble (4), ChatMessage (2) |
| Organism | Dialog (2), Lightbox, Carousel, CodeBlock (2), Markdown (2), List, MetadataList (8), TreeList (2), Layout / FormLayout (3), Chat / ChatMessageList, ChatToolCalls (8) |
| Pattern | AppShell (16: Variant Elevated, Wash, Surface, Section x Nav Layout TopNav + SideNav, SideNav Only, TopNav Only, Content Only), Chat / ChatLayout |

## 2. Which component to use

| Need | Astryx component |
|---|---|
| Group content | Card (Padding none, compact, default, spacious x Elevation none, low, med, high; Content slot). Whole card clickable: ClickableCard (Rest, Hover, Pressed, Focused, Disabled). Choose one of several: SelectableCard |
| Show / hide a section | Collapsible (trigger label, Content slot) |
| Status label | Badge: 5 semantic vivid (Neutral, Info, Success, Warning, Error) + 9 soft hues; Pill or Dot. Removable or colored tag: Token (11 colors, SM / MD, removable, end content slot). Live status: StatusDot (pulsing) |
| Page or section message | Banner (info, success, warning, error; card or section container; dismissable, collapsible, content and end content slots). Short-lived: Toast (default, error) |
| Progress | ProgressBar (accent, warning, error, success, neutral; determinate / indeterminate), Spinner (sm-xl, default / on media), Skeleton |
| Nothing to show | EmptyState (icon and actions slots; Default / Compact) |
| Rows of data | Item is the generic row primitive (Marker, Start Content, Label + Description, End Content; Density Compact, Balanced, Spacious). List / .ListItem, MetadataList (label-value pairs; vertical / horizontal, multi-column), TreeList (expand, line guides), OverflowList (+N more) |
| Tables | TableHeaderCell (sort, filter, checkbox, resizable) + TableCell (leading checkbox / expand, dividers, Hovered / Selected) in 3 densities. No Table organism: tables are assembled in the Templates page (Grouped Table, Searchable Table) |
| Text and code | Heading (Level 1-4), Text (truncation), Code (inline), CodeBlock (header, line numbers, copy), Markdown (default / compact), Blockquote, Kbd (1-4 keys), Timestamp (8 formats), Citation |
| Floating content | Tooltip (text), Popover (title, close, Content slot), HoverCard, Dialog (Standard / Fullscreen; Header Start / End, Body, Footer Actions slots; dividers), Lightbox (media, navigation, caption, zoom, thumbnails), Overlay (scrim dark / light / none over media) |
| Page frame | AppShell, Layout / Section (section, transparent, wash), FormLayout (Vertical, Horizontal, Horizontal Labels), Divider (subtle / strong, label), AspectRatio, ResizeHandle |
| AI chat | ChatLayout (pattern) = ChatMessageList (Content slot) of ChatMessage (assistant / user) with ChatMessageBubble (filled / ghost), ChatMessageMetadata (sending, sent, delivered, read, error), ChatSystemMessage, ChatToolCalls (pending, running, success, error; collapsed / expanded; Details slot) + the composer (Form Elements) |

## 3. Rules to copy
- **Item as one row primitive** behind List, MetadataList and menus: one anatomy, density axis, slots for leading and trailing content.
- Containers are slots (Card Content, Dialog Body / Footer Actions, Popover Content), so screens drop DS components into them instead of detaching.
- Status UI uses Status tokens (Banner, inputs) and hue families (Badge soft, Token), never button tokens.
- Elevation is a small axis (none, low, med, high) bound to `Elevation/*` effect styles.

## 4. Fix when copying (details in `references/gaps.md`)
- Dark mode breaks on SelectableCard, Dialog, Popover, HoverCard, List and Layout / Section: raw white fills (computed Text/Primary 1.04:1 in Neutral Dark).
- Two component sets named `Avatar`; the legacy one has no Auto Layout, 45 default layer names and 20 text layers without a text style.
- Toast has only default / error; Tooltip has no placement or size variants.
- 41 of 58 components have no Figma description.
