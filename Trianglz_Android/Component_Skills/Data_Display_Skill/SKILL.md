---
name: trianglz-android-data-display
description: Use when building, auditing or coding information surfaces with the Trianglz Android Material 3 Design System (Figma JUs2c8IO6ybFcGRZjcQzr9) - cards, dialogs, avatars, badges, carousel, chips (assist, filter, input, suggestion), dividers, lists and list items, expressive shapes, bottom and side sheets, snackbar and tooltips. Covers only the ⭐Data display group; tells the agent which M3 component to use and how it is tokenized.
---

# Trianglz Android M3 DS - Data Display

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

**Load `../../Foundation_Skill/SKILL.md` first** (schemes, state layers, type scale, shape, build order, atomic rules).

Scope: **⭐Data display** pages only: ➜ Cards, ➜ Dialogs, ➜ Avatars, ➜ Badges, ➜ Carousel, ➜ Chips, ➜ Dividers, ➜ Lists, ➜ Shapes, ➜ Sheets, ➜ Snackbar, ➜ Tooltips. Platform Android (M3 Expressive).
Reference: `references/components.md`, `references/gaps.md`, `references/screens/` (to capture).

## 1. Inventory

| Component | Set id | Variants | Tier |
|---|---|---|---|
| **Stacked card** / **Horizontal card** | 6239:11690 / 6239:11763 | 6 each = Style (Outlined, Elevated, Filled) x Layout (Slot, Media & text) | Organism |
| Card states (Outlined / Elevated / Filled) | 6239:11809 / 11821 / 11833 | 5 each (Enabled, Hovered, Focused, Pressed, Dragged) | Atom (background) |
| **Basic dialog**, List dialog, Scrollable list dialog | 6247:26947 / 26968 / 26988 | 2 each (Icon) | Organism |
| XR/XR Dialog | 6247:27013 | 4 | Organism (XR) |
| **Generic avatar** | 6263:18913 | 3 = Style (Check, Monogram, Avatar) | Atom |
| **Badges** | 6239:11385 | 2 = Size (Large, Small) | Atom |
| **Carousel** / Carousel - Full screen | 6239:12040 / 12037 | 10 = Context (Mobile, Tablet) x Layout (Hero, Center-aligned hero, Multi-browse, Uncontained, Multi-aspect ratio) / 1 | Organism |
| **Assistive / Filter / Input / Suggestion chip** | 6243:16757 / 16322 / 16962 / 16133 | 48 / 96 / 48 / 48 | Atom |
| Chip groups | 6243:17184 | 8 = Type x Layout (single row scrollable, multiple rows) | Molecule |
| **Divider** Horizontal / Vertical | 6251:3296 / 3309 | 4 / 3 (`Property 1` = Full-width, Inset, Middle-inset, Divider with subhead) | Atom |
| **List** | 6251:5346 | 12 = Type (Standard, Segmented (filled), Expandable, Draggable, Swipable standard/segmented) x Multi-line | Organism |
| **List item** (expressive) | 6251:5509 | 24 = Alignment x State (6) x Selected | Molecule |
| List item - Accordion / Swipe | 6251:5666 / 5671 | 2 / 4 | Molecule |
| List item building blocks | 6251:5683 Leading (Icon, Indent, Image, Avatar, Video, Icon button, Checkbox, Radio, Switch, Slot), 5707 Trailing, 5730 Content, 5739 Reveal, 5767 Accordion button | | Atoms |
| List Item baseline (density 0 / -2 / -4) + Full Lists | 6251:12306 / 9650 / 7268 / 19565 | 238 / 217 / 197 / 3 | Molecule (older M3) |
| **Shape Set** (expressive shapes) | 6264:19851 | 35 shapes (Circle, Pill, 4-leaf clover, cookies, Burst, Gem, Heart...) | Atom |
| **Bottom sheet** / **Side Sheet** | 6259:31984 / 6259:31921 | 2 (Modal) / 4 (Type Standard, Modal x Show back) | Organism |
| **Snackbar** | 6259:37768 | 10 = Configuration (Text only, Text & action, Text & longer action) x lines x close | Molecule |
| **Plain Tooltip** / **Rich Tooltip** | 6262:18531 / 6263:18853 | 2 / 1 | Molecule |

## 2. How to choose

| Need | Use |
|---|---|
| Group content + actions about one subject | Card: **Elevated** (default, Surface Container Low + Elevation 1), **Filled** (Surface Container Highest, lowest emphasis), **Outlined** (Surface + Outline Variant, for grids / separation). Stacked = vertical; Horizontal = list-like |
| Browse visual items | Carousel (Multi-browse on phones, Hero for featured, Uncontained for long text-free rows) |
| A vertical index of items | List + List item (expressive); leading avatar/icon/image/checkbox, trailing text/icon/switch; Segmented for grouped settings; Expandable, Draggable, Swipable for actions |
| Separate groups | Divider (Full-width between sections, Inset in lists) - prefer spacing first |
| Compact choices / filters / entered tokens | Chips: **Filter** (toggle filters, check icon when selected), **Input** (user-entered items with close), **Assistive** (smart actions like "Add to calendar"), **Suggestion** (dynamic suggestions/replies) |
| Unread count / status dot | Badge Small (6dp dot) or Large (number, label/small, Error + On Error) on nav items, icons |
| Person or entity | Generic avatar (Avatar image, Monogram letter on Primary Container, Check when selected) |
| Critical decision | Basic dialog (title headline/small, supporting text, 2 text-button actions, radius 28, Surface Container High); List dialog for a choice; Scrollable when long; full-screen dialog missing |
| Brief feedback | Snackbar (Inverse Surface, 1-2 lines, optional action + close, Elevation 3, bottom) - one at a time, 4-10s |
| Label an icon / extra info | Plain tooltip (Inverse Surface, body/small, radius 4); Rich tooltip (subhead, text, actions) |
| Supplementary content from an edge | Bottom sheet (Modal with scrim, drag handle, radius 28 top) on phones; Side sheet (Standard or Modal) on large screens |
| Decorative / avatar masks, expressive accents | Shape Set |

## 3. Tokens (observed)

- Cards: Outlined bg Surface + stroke Outline Variant radius 12 (Medium); Elevated uses `Elevation Light/1`; content padding 16, header padding 12/4/12/16.
- Dialog: Surface Container High, radius 28, padding 24, gap 16, actions row padding 20/24/20/8, divider optional, actions = `Button - text` (remote instances).
- Snackbar: fill **remote** `Schemes/Inverse Surface`, text **remote** `M3/body/medium`, effect remote `M3/Elevation Light/3` (local equivalents exist), radius 4.
- Badge: Error fill, On Error label (remote `M3/label/small`), radius Full, padding 0/4.
- Avatar: Primary Container + On Primary Container placeholder, radius Full (40dp).
- Tooltip: Inverse Surface + Inverse On Surface, body/small, padding 4/8, radius 4.
- Chips: height 32, radius 8 (Small), label/large, 18dp icons (remote `check`, `arrow_drop_down`), Disabled container On Surface Variant 10%.

## 4. M3 rules to keep
- Touch target 48dp (chips 32 visual inside 48 target).
- One snackbar at a time; don't put critical info only in a snackbar.
- Dialogs: max 2 actions preferred (text buttons, confirm on the right), headline optional, no dismiss by scrim for destructive choices.
- Lists: 56 (one-line), 72 (two-line), 88 (three-line) dp heights at density 0; keep leading element alignment consistent.
