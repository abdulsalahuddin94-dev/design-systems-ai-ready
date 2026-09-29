---
name: trianglz-ios-data-display
description: Use when building, auditing or coding information and system surfaces with the Trianglz iOS Design System (Figma q5nQHGEGzZ94WN0wilJwLW) - status bar and iPad menu bar, bottom sheets, Face ID, progress indicators (linear, spinner), activity view (share sheet) and context menus. Covers only the ⭐Data display group; tells the agent which component to use on iOS and how it maps to Apple HIG.
---

# Trianglz iOS DS - Data Display

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, text styles, file structure, build order, atomic rules).

Scope: **⭐Data display** pages only: ➜ Status Bars and Menu Bars, ➜ Bottom Sheets, ➜ Face ID, ➜ Progress Indicators, ➜ Activity Views, ➜ Contextual Menus. Platform iOS (HIG, iOS 26).
All components in this group are Apple iOS 26 UI Kit copies (remote Apple variables, remote text styles, raw glass/blur effects); only the progress fill uses a local token (`Brand Primary`).
Reference: `references/components.md`, `references/gaps.md`, `references/screens/` (to capture).

## 1. Inventory

| Component | Set id | Variants / props | Tier |
|---|---|---|---|
| Status bar and Menu bar - iPad | 211:23 | Full Screen, Menu Expanded, Background=Light; slot Menubar | Organism (system) |
| **Sheet - iPhone** | 11:2450 | Detent Medium / Large / Large (Stacked); Show Grabber, Show Dimming Layer (B); Content (Slot) | Organism |
| Overlay | 11:2446 | dimming layer (remote `Overlays/Default`) | Atom |
| Grabber | 11:2447 | Mode Light/Dark | Atom |
| Face ID | 11:2559 | State Authenticating / Success | Organism (system) |
| **Progress Bar - Determinate Linear** | 11:2594 | Value 0%-100% (11); Show Label (B), Label (T) | Molecule |
| **Progress Bar - Indeterminate Circular ("Spinner")** | 11:2639 | Size Small / Regular / Large; Show Label, Label | Atom |
| Activity View - iPhone / iPad | 203:9029 / 203:9036 | Mode Dark/Light | Organism (system share sheet) |
| `_Activity View`, `_Header`, `_Action`, `_Actions`, `_Contact`, `_Close Button`, `_Separator`, `_Button - Liquid Glass` | 203:9045... | building blocks | Atoms/Molecules |
| **Context Menu** | 203:10473 | Alignment Vertical / Horizontal (iPad only); Side Trailing / Leading | Organism |

No iPhone status bar component (only iPad status + menu bar), no list/table cell, no card, no badge, no avatar, no banner/toast, no empty state, no image/media component.

## 2. How to use each

- **Sheet - iPhone**: modal task or detail without leaving context. Detent Medium (half height) for quick choices/previews, Large for full tasks, Large (Stacked) when presented over another sheet. Keep the grabber visible when the sheet is resizable; show the dimming layer for modal sheets (not for non-modal medium detents in iOS 26 where content behind stays interactive). Content goes in the `Content` slot; sheet surface is Liquid Glass Medium, width 390 inset (iOS 26 floating sheet).
- **Progress Bar - Determinate Linear**: known-duration tasks (upload, onboarding steps). Track remote `Fills/Primary` 4pt, fill `Brand Primary`, radius full; optional label (Body). Use Value variants for mockups.
- **Spinner**: unknown duration; Small inside buttons/rows, Regular in content areas, Large for full-screen loading. Prefer skeletons for content lists.
- **Context Menu**: long-press / secondary-click actions on an item; shows a preview (`Content Area`, elevated background, radius 30, drop shadow) plus a `Menu` (remote instance). Destructive items last, in red. Horizontal alignment only on iPad.
- **Activity View**: the system share sheet - use only to mock sharing; never rebuild it as custom UI.
- **Face ID**: system biometric HUD (Authenticating spinner / Success checkmark glyph). Mock only; the real one is drawn by iOS.
- **Status bar / Menu bar (iPad)**: system chrome for mockups; iPadOS 26 menu bar with Menubar slot.

## 3. HIG notes

- Sheets, menus, alerts and share sheets are system UI: match Apple's metrics and materials instead of branding them heavily; brand via tint color and content.
- Respect safe areas: status bar and home indicator zones are not content areas.
- Loading: show progress within 0.5s-1s of a wait; always give a cancel path for long tasks.
- Components that exist in Apple's kit but are missing here and are commonly needed: lists/table cells (inset grouped), badges on tab items, banners/notifications, empty states, page control, segmented control, image thumbnails.
