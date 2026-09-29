---
name: trianglz-android-navigation
description: Use when building, auditing or coding actions and navigation with the Trianglz Android Material 3 Design System (Figma JUs2c8IO6ybFcGRZjcQzr9) - buttons (filled, tonal, outlined, elevated, text; toggle), icon buttons, FAB / extended FAB / FAB menu, button groups, segmented and split buttons, app bars, menus, navigation bar and rail, toolbars and tabs (plus XR variants). Covers only the ⭐Navigation group; tells the agent which M3 component to use and how it is tokenized.
---

# Trianglz Android M3 DS - Navigation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (schemes, state layers, type scale, shape, build order, atomic rules).

Scope: **⭐Navigation** pages only: ➜ Buttons, ➜ App Bar, ➜ Menu, ➜ Navigation, ➜ Toolbar, ➜ Tabs. Platform Android (M3 Expressive, 2025).
Reference: `references/components.md`, `references/gaps.md`, `references/screens/` (to capture).

## 1. Inventory (public sets)

| Family | Sets | Tier |
|---|---|---|
| Buttons | `Button` (filled) 6218:8358, `Button - tonal` 9449, `Button - outline` 9178, `Button - elevated` 8900, `Button - text` 8629 - each 50 = Type (Round, Square) x Size (XSmall, Small, Medium, Large, XLarge) x State (Enabled, Hovered, Focused, Pressed, Disabled) | Atom |
| Toggle buttons | `Toggle button` 6218:7810 (+ elevated, outline, tonal) - 100 each (+ Selected) | Atom |
| Icon buttons | `Icon button` (filled) 6226:14936, `- standard`, `- outline`, `- tonal` - 150 each = Type x Size x Width (Narrow, Default, Wide) x State; `Icon button togglable` (+ tonal, outline, standard) - 300 each | Atom |
| FAB | `FAB` 6239:6848 (Size Default, Medium, Large x Color Primary/Secondary/Tertiary (container or solid) x State) 72; `Extended FAB` 6239:6498 72; `FAB menu` 6239:7406 (Color x segments 3-6) | Atom / Organism |
| Button groups | `Standard button group` 6226:11659 (60), `Connected button group` 6226:11289 (10) + segment building blocks per size | Molecule |
| Segmented button | `Segmented button` 6239:7675 (Segments 2-5 x Density 0..-3) + start/middle/end segment blocks | Molecule (baseline, superseded by connected button group) |
| Split button | `Split button` 6239:8490 (180 = Size x Color Filled/Tonal/Elevated/Outlined x leading/trailing state) | Molecule |
| App bars | `App bar` 6239:10688 (Configuration Small-centered, Small-image, Search, Small, Medium, Large x Elevation Flat, On-scroll); `Bottom app bar` 6239:10864 (Icons 1-4, Show FAB); `XR/XR App Bar` | Organism |
| Menus | `Menu` 6253:23492 (Theme Standard, Vibrant x Groups 1-3), `Menu item/Standard` / `Vibrant` (State x Selected), `Menu (baseline)` + baseline list items (density 0, -2, -4) | Organism / Atom |
| Navigation | `Navigation Bar: Horizontal items` 6253:27221 (3-6), `Navigation Bar: Vertical items` 6253:27244 (3-5), `Navigation Rail` 6253:29093 (3-6 items, FAB, menu), `Navigation Rail: Expanded` 6253:28884 (Docked/Floating); nav item blocks (Vertical/Horizontal, badge None/Small/Large); XR rail/bar | Organism / Atom |
| Toolbar | `Toolbar` 6262:17053 (Floating, Docked x Horizontal, Vertical x Vibrant, Standard) + icon/button blocks; `XR/XR Toolbar` | Organism |
| Tabs | `Tabs` 6261:9711 (Fixed, Scrollable x Primary, Secondary x Icon only, Label & icon, Label only), items `Primary tabs/Icon and label | Icon only | Label only`, `Secondary tabs/Label only | Icon and label` (Selected x State, Show badge) | Organism / Atom |

## 2. Buttons: which one

| Emphasis | Component | Tokens | Use |
|---|---|---|---|
| Highest | FAB / Extended FAB | Primary/Secondary/Tertiary container (or solid), Elevation 3, radius Large-XL | the single main action of a screen (compose, create) |
| High | `Button` (filled) | Primary + On Primary | final/primary action (Save, Confirm) - one per view |
| Medium-high | `Button - tonal` | Secondary Container + On Secondary Container | important but not primary (Next in flows) |
| Medium | `Button - elevated` | Surface Container Low + Primary text, Elevation 1 | when the button sits on busy/patterned backgrounds |
| Medium | `Button - outline` | Outline border + On Surface Variant/Primary text | secondary actions (Cancel, Back) |
| Low | `Button - text` | Primary text, no container | tertiary, dialog actions, inline |
| Toggle | `Toggle button*` | Selected changes container/shape | on/off action with button look (bold, favorite) |
| Icon only | `Icon button*` (standard, filled, tonal, outline) | same color logic | compact actions in bars, lists, cards |

- Sizes (M3 Expressive): XSmall 32, Small 40, Medium 56, Large 96, XLarge 136 container heights; visual Small = 40dp inside a 48dp target. `Type` Round (Full radius) vs Square (Medium/Large corner, morphs on press).
- Anatomy: `Content` (container) > `State-layer` (padding 10/16 Small, gap 8) > optional `Icon` (INSTANCE_SWAP, `Show icon`) + `Label` (label/large). Disabled = container `State Layers/On Surface/Opacity-10`, content 38%.
- Properties: `Label text`, `Show icon`, `Icon`, `Icon (selected)` (toggles), `Show focus indicator`.
- Button groups: `Standard button group` (spaced, Filled/Tonal/Outline, Icon or Label) for related actions; `Connected button group` replaces segmented buttons for single/multi select (2-5 segments). `Split button` = main action + menu trigger.

## 3. Top of screen: App bar

`App bar` Configuration: **Small** (default inner screens), **Small-centered** (brand/home), **Medium** / **Large** (collapsing headline for top-level screens), **Search** (search as the title), **Small-image** (avatar/logo). `Elevation` Flat (at rest) / On-scroll (Surface Container on scroll). Leading = navigation icon button (menu/back), up to 3 trailing actions (`Show 1st/2nd/3rd trailing action`), avatar optional. Title `title/large` (Small), headline sizes for Medium/Large.
`Bottom app bar`: 1-4 action icons + optional FAB - use on compact screens for frequent actions (M3 Expressive prefers the docked/floating **Toolbar** instead).

## 4. Moving between destinations

| Window | Component |
|---|---|
| Compact (phones) | `Navigation Bar: Horizontal items` 3-5 destinations (Vertical items = icon above label, the classic bottom nav) |
| Medium (foldables, small tablets) | `Navigation Rail` (3-6 items, optional FAB + menu) |
| Expanded+ | `Navigation Rail: Expanded` (Docked or Floating; replaces the navigation drawer in M3 Expressive) |
Nav item: selected = pill `Secondary Container` + icon swaps to `Icon (selected)` (filled) + label On Secondary Container (label/medium); badge None/Small/Large. Don't use nav bars for actions; 3-5 destinations only.
Tabs: group related content at the same level inside a screen. Primary tabs under the app bar (indicator Primary, label title/small); Secondary tabs inside content. Fixed for 2-4 tabs, Scrollable for more.
Menus: temporary list of choices from a button, text field (dropdown) or long press. Standard (Surface Container) or Vibrant (Tertiary container) theme, groups with section labels, items with leading icon, trailing text/shortcut/badge, selected state.
Toolbar: contextual actions for the current page; Floating (over content, Vibrant or Standard) or Docked (full-width bottom).

## 5. XR
Sections "... for XR" hold Android XR spatial variants (XR App Bar, Navigation Rail/Bar, Toolbar, Dialog) with Surface container elevations. Use only for XR targets.
