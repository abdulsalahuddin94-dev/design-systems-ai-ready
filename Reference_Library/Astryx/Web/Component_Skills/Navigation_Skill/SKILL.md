---
name: astryx-navigation
description: Use when building, auditing or coding actions and navigation with the Astryx Library DS reference (Web) - Button (Primary, Secondary, Ghost, Destructive; icon-only; Loading), ToggleButton, ButtonGroup, Link, MoreMenu, DropdownMenu, ContextMenu, Toolbar, Tabs, Breadcrumbs, Pagination, Outline, TopNav (menus, mega menu), SideNav, MobileNav, CommandPalette and the chat action buttons. Tells the agent which component to use, its variant axes and slots, and what to fix when copying.
---

# Astryx Library DS (Web) - Navigation

> **Node IDs:** none are stored here; find components by page + set name.

> **Data files:** `../../data/component-registry.json` (exact variants, properties, slots, contrast results), `../../data/tokens.json`, `../../data/rules.json`. The JSON wins over this file.

**Load `../../Foundation_Skill/SKILL.md` first.** Scope: actions, buttons, links, tabs, menus and anything that moves between places. In Figma: the **Action** and **Navigation** pages, the CommandPalette (Overlay page) and the chat buttons (Chat page). Inventory: `references/components.md`; audit: `references/gaps.md`.

## 1. Inventory (40 components, 851 variants)

| Tier | Components |
|---|---|
| Atom | Button (576), Link (64), Button / ToggleButton (12), MoreMenu (24), DropdownMenu / DropdownMenuItem, CheckboxItem, RadioItem, .ContextMenuItem, Tabs / .Tab, Breadcrumbs / BreadcrumbItem, Navigation / .TopNavItem, .SideNavItem, .SideNavCollapseButton, .MobileNavToggle, .OutlineItem, .CommandPaletteItem, .CommandPaletteEmpty, Chat / ChatSendButton, ChatDictationButton, ChatLayoutScrollButton |
| Molecule | Action / ButtonGroup, Tabs / TabList, Breadcrumbs, Pagination, Outline, DropdownMenu / DropdownMenuRadioGroup, Navigation / TopNavMenu, TopNavHeading, .TopNavMegaMenuItem, .TopNavMegaMenuFeaturedCard, .SideNavHeading, .SideNavSection |
| Organism | DropdownMenu, ContextMenu, Toolbar, CommandPalette, Navigation / TopNav, TopNavMegaMenu, SideNav, MobileNav |

Names starting with `.` are internal parts (not meant to be placed alone), the same convention as Figma's hidden-from-publishing prefix.

## 2. Button
- `Variant` Primary (`Core/Accent` fill, `Core/On Accent` text), Secondary (`Core/Neutral` fill, `Text/Primary`), Ghost (no fill, `Text/Primary`), Destructive (soft: `Status/Error Muted` fill, `Status/Error` text) x `Size` SM 28, MD 32, LG 36 (height bound to `Size/Element/*`, radius `Radius/Element` 10) x `State` Rest, Hover, Pressed, Disabled, Focused, **Loading** x `Type` Default, Icon Only x `Elevation` none, low, med, high.
- Disabled = the variant's own look at 50% opacity (same as our rule). Focused = 1px stroke `Core/Accent` (Destructive: `Status/Error`).
- Properties: `Label` (text), `Icon` (boolean) + `Icon Source` (instance swap), `Has End Content` (boolean) + `End Content` (slot, for a Kbd, Badge or chevron).
- Use Primary once per view, Destructive only for irreversible actions, Ghost in toolbars and dense rows, icon-only with a Tooltip.
- `ToggleButton` = Ghost button with a pressed state (toolbar formatting, view switches); `ButtonGroup` joins buttons with shared dividers (Orientation, Size cascade to children through the `Children` slot).

## 3. Which navigation to use

| Need | Astryx component |
|---|---|
| App frame navigation | TopNav (Heading, Start / Center / End Content slots) with TopNavItem, TopNavMenu, TopNavMegaMenu; SideNav (Top Content, Items, Footer slots; Expanded / Collapsed) with SideNavHeading, SideNavSection, SideNavItem (nested, expandable, end content); MobileNav (sheet from Start / End) with MobileNavToggle |
| Switch views inside a page | Tabs / TabList (sizes sm, md, lg; divider) with Tabs / .Tab (icon, end content slot for counts, label can be hidden) |
| Where am I | Breadcrumbs (Items slot; Default or Supporting; Chevron or Slash separators; item menu for collapsed paths) |
| In-page table of contents | Outline with .OutlineItem (Level 1-4, Active) |
| Page through results | Pagination (Pages, Count, Compact, Dots, None; page-size selector) |
| Actions on an object | MoreMenu (ellipsis trigger) -> DropdownMenu (items, checkbox items, radio group); right-click: ContextMenu (items with shortcut and description, Destructive) |
| Global search and commands | CommandPalette (Input, List, Footer slots) with .CommandPaletteItem (Rest, Highlighted, Selected) |
| Bar of actions | Toolbar (Start / Center / End slots; Transparent, Section, Wash; Default or Compact density; bottom divider) |
| Inline link | Link (Color active, primary, secondary, inherit; underline; external icon) |

## 4. Rules to copy
- **Slots instead of variant matrices:** Toolbar replaced a 48-variant matrix with 3 native slots + 3 small axes (its description says so). TopNav, SideNav, CommandPalette, Breadcrumbs and ButtonGroup work the same way.
- Internal parts start with `.` and are built before their organism (atomic order is respected: SideNav nests SideNavItem, Tabs nest Tab).
- Menus use `Highlighted` (keyboard / pointer focus) instead of separate Hover and Focus states.

## 5. Fix when copying (details in `references/gaps.md`)
- Button has 576 variants: `Elevation` (shadow) should be an effect, not an axis; Icon Only could be a separate Icon Button set (our rule).
- Tabs / .Tab has only default / selected (no hover, focus, disabled); Pagination, TopNavItem and SideNavItem have no Focus state.
- Dark mode: raw white fills in ContextMenu, MobileNav and Pagination make text unreadable in Neutral Dark (Text/Primary 1.04:1).
- Focused Primary button: the focus stroke is the same `Core/Accent` as its fill, so focus is invisible; use our `focus-ring-offset`.
- 26 of 40 components have no Figma description.
