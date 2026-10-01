---
name: trianglz-ios-navigation
description: Use when building, auditing or coding actions and navigation with the Trianglz iOS Design System (Figma q5nQHGEGzZ94WN0wilJwLW) - tab bar (iOS 26 Liquid Glass), buttons (bordered prominent, bordered, borderless, Liquid Glass text/symbol, destructive), action sheets and alerts. Covers only the ⭐Navigation group; tells the agent which component and variant to use on iOS and how it maps to Apple HIG.
---

# Trianglz iOS DS - Navigation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, text styles, file structure, build order, atomic rules).

Scope: **⭐Navigation** pages only: ➜ Tab Bar, ➜ Buttons (page name `➜  Buttons`), ➜ Action Sheets + Alerts. Platform iOS (HIG, iOS 26 Liquid Glass).
Navigation bars and bottom toolbars currently live in ⭐Form Elements (➜ Toolbars & Search) - see that skill; they should move here.
Reference: `references/inventory.md` (every set and property, live 2026-10-01), `references/states.md` (what each state looks like and which token draws it, verified), `references/components.md`, `references/gaps.md`, `references/screens/` (Light + Dark).

## 1. Inventory

| Component | Set id | Variants | Tier | Tokens |
|---|---|---|---|---|
| `_Tab Bar Button - iPhone` | 10:1712 | 4 (Mode x Selected) | Atom | local (Brand Primary, Text/Secondary Text, Backgrounds/Group) + raw overlays |
| `_Tab Bar Button - iPhone - Search` | 10:1695 | 4 | Atom | local/raw |
| **Tab Bar - iPhone** | 10:1739 | 24 = Minimized x Tabs (2-5) x Type | Organism | remote Liquid Glass background |
| `_Label - Text` | 197:2886 | 24 = Mode x Size (Large/Small) x Type (Default/Preferred/Destructive) x Is Enabled | Atom | mixed |
| `_Label - Symbol - Preferred / Default / Destructive Default` | 197:2761 / 2770 / 2779 | 4 each | Atom | mixed |
| **Button - Content Area** | 197:2272 | 108 = Size (S/M/L) x Style x Label Style x Is Enabled x Destructive | Atom/Molecule | Brand Primary + remote fills/text styles |
| **Button - Liquid Glass - Text** | 197:2788 | 24 = Size x Style (Glass / Glass Prominent) x Is Enabled x Destructive | Molecule | remote glass + `_Label - Text` |
| **Button - Liquid Glass - Symbol** | 197:2861 | 8 | Molecule | remote glass + symbol label |
| **Alert** | 7:1004 | 2 (Button Layout Side-by-Side / Stacked) | Organism | remote glass/labels, local text styles |
| **Action Sheet** | 7:972 | 1 | Organism | local text colors, remote button instances |
| `_Buttons` (alert/sheet action) | 7:1113 | 8 = Mode x Role (None/Default/Destructive/Cancel) | Atom | remote |
| `Text Field` (alert field) / `_Text Field Background` | 7:1024 / 7:1054 | 1 / 2 | Molecule | raw/remote |

## 2. Tab Bar (Organism)

- `Tab Bar - iPhone`: `Tabs` = 2 | 3 | 4 | 5 · `Type` = Default | Search Role | Prominent Tab · `Minimized` = False | True (iOS 26 collapses the bar on scroll).
- Built from `_Tab Bar Button - iPhone` instances over a remote `Liquid Glass - Regular - Small` background (402x95, padding 16/25/25/25).
- Tab button: 24pt icon instance (`Component 1`, `Property 1 = Selected | Default`) + label `Caption2/Emphasized`. Selected = label `Brand Primary`, 76x54 pill `Backgrounds/Group` + raw white 50% + `Brand Primary` tint blend layer; Unselected = label `Text/Secondary Text`. Light/Dark are **variants** (`Mode`) that bind the same local tokens; the Light/Dark doc frames switch Semantic mode.
- Bar widths: 188 / 274 / 360 for 2 / 3 / 4-5 tabs on a 62pt glass capsule; `Minimized=True` = one 48pt glass circle. `Search Role` and `Prominent Tab` are built the same way (separate trailing search circle).
- Search role tab (`_Tab Bar Button - iPhone - Search`) sits apart on the trailing side (iOS 26 pattern).

Use: 3-5 top-level app sections on iPhone, always visible except in immersive flows. Never use for actions (use toolbar buttons). Max 5 tabs; more goes into a "More" tab or a different IA. Labels 1 word; icons SF Symbols style (filled when selected).

## 3. Buttons

Apple styles implemented:
| Style (property) | HIG name | Look | Use |
|---|---|---|---|
| `Bordered - Prominent` | .borderedProminent | Brand Primary capsule, white text (`Text/On Brand Text`) | the one primary action of a screen/sheet |
| `Bordered` | .bordered | tinted gray capsule (remote `Fills/Tertiary`), brand text | secondary actions |
| `Borderless` | .borderless / plain | text or symbol only, brand color | tertiary, inline, toolbar-like |
| `Glass Prominent` (Liquid Glass) | .glassProminent | tinted glass capsule | primary action floating over content/media |
| `Glass` (Liquid Glass) | .glass | clear glass capsule | secondary action over content/media |
| `Destructive = True` | role .destructive | systemRed fill (remote `Accents/Red`) on Prominent, `Status/Danger/Danger Text` label elsewhere | delete, remove; pair with Cancel |

- `Button - Content Area`: `Size` = Small | Medium (34pt: padding 7/14, Subheadline 15) | Large (50pt, Body 17) · `Label Style` = Title and Icon | Icon only | Title only · `Is Enabled` · `Destructive`. TEXT `Label`, `Symbol` (the SF Symbol glyph as text). Radius Full (capsule).
- `Button - Liquid Glass - Text/Symbol` wrap `_Label - Text` / `_Label - Symbol - *` atoms over a remote `Liquid Glass - Regular - Small` background (padding 8/12, gap 4). Glass Prominent renders as a Brand Primary capsule with white label; every `_Label - Symbol - *` holds the local `akar-icons:check` icon, so symbol buttons show a checkmark until swapped.
- Disabled (`Is Enabled=False`): container remote `Fills/Tertiary` 12%, label remote `Labels/Tertiary` 30% (Content Area); label 50% (glass).
- Examples: sections Light Examples / Dark Examples / over light or dark background context (instances; the Dark section uses a remote collection mode).

HIG rules: minimum 44x44pt tap area (Small buttons need extra padding in a row); one prominent button per view; destructive buttons never prominent-blue; use Liquid Glass styles only on top of content (toolbars, media, maps), not in plain forms; labels are verbs in Title Case.

## 4. Alerts and Action Sheets (Organisms)

- **Alert** (300 wide, Liquid Glass Medium background, padding 14): Title (`Headline/Emphasized`), Message (`Body/Regular`, `Show Message`), optional `Show Text Field` (Text Field molecule, radius 26), `Actions` slot with `_Buttons` instances; `Button Layout` = Side-by-Side (2 actions) | Stacked (3+ or long labels).
- **Action Sheet** (300 wide): Title + Message (`Show Message`), Actions stack of `_Buttons` (Destructive first when relevant, Cancel separated).
- `_Buttons` `Role` = None | Default (Apple blue capsule, remote `Accents/Blue`, white Body/Emphasized - not Brand Primary) | Destructive (grey capsule, raw `#ff383c` label) | Cancel (grey capsule, remote `Fills/Secondary` 16%); 48pt capsules.

Use Alert for critical info that needs a decision (max 2-3 actions, Cancel on the leading side in side-by-side). Use Action Sheet for choosing among actions tied to the user's last tap (share, delete options). Don't use either for routine confirmation that can be undone - use an undo toast or inline feedback.

## 5. Choosing (iOS)

| Need | Use |
|---|---|
| Switch between top-level sections | Tab Bar - iPhone |
| Go back / drill down | Navigation bar (`Toolbar - Top - iPhone`) with `_Back Bar Button Item` |
| Primary action on a screen | Button Bordered - Prominent (Large), or bottom toolbar prominent button |
| Secondary | Button Bordered or Glass |
| Inline / low emphasis | Button Borderless |
| Destructive | Button with Destructive=True + confirmation (Alert or Action Sheet) |
| Choose one of several actions | Action Sheet (iPhone) / Context Menu (Data display) |

## 6. Rules for AI agents

**Always**
- One `Bordered - Prominent` (or Glass Prominent over media) per screen or sheet; secondary actions `Bordered` / `Glass`, inline ones `Borderless`.
- Labels are verbs in Title Case ("Save", "Add to Cart"); swap the placeholder glyph or checkmark for the real SF Symbol.
- Tab bar: 3-5 sections, one-word labels, filled icon when selected, always visible except in immersive flows.
- Alerts: 2 actions side by side (Cancel leading, confirm trailing), 3+ stacked; destructive actions in red and never as the default.
- Keep >= 44pt targets (Small 28pt buttons need row padding).

**Never**
- Use a tab bar for actions or a toolbar for top-level navigation.
- Put Liquid Glass buttons on plain forms; they belong over content, media or maps.
- Use an alert for routine, undoable confirmations (use inline feedback or undo).
- Detach instances to recolor; use `Style`, `Destructive`, `Is Enabled`.

## 7. SwiftUI map

| Figma | SwiftUI |
|---|---|
| `Tab Bar - iPhone` (+ Search Role, Minimized) | `TabView { Tab(...) }`, `Tab(role: .search)`, `.tabBarMinimizeBehavior(.onScrollDown)` |
| `Button - Content Area` Bordered - Prominent / Bordered / Borderless | `Button(...).buttonStyle(.borderedProminent / .bordered / .borderless)`, `.controlSize(.small / .regular / .large)`, `role: .destructive` |
| `Button - Liquid Glass - Text/Symbol` Glass / Glass Prominent | `.buttonStyle(.glass)` / `.buttonStyle(.glassProminent)` |
| `Alert` | `.alert(title, isPresented:) { Button(...) } message: { ... }` (with a `TextField` for the field variant) |
| `Action Sheet` | `.confirmationDialog(title, isPresented:)` |
Tint with `.tint(...)` set to Brand Primary at the app root; destructive via `role: .destructive`, not a custom color.

## 8. Final check after using this skill
Run audit-design-system: every action is an instance of a public set above, one prominent action per view, real SF Symbols instead of the checkmark or glyph placeholders, no new remote Apple variables, and Light and Dark match `references/screens/`. Note workarounds in `references/gaps.md`.
