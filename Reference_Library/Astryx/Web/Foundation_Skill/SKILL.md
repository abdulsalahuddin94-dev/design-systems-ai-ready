---
name: astryx-foundation
description: Use before building, extending, auditing or coding anything with the Astryx Library DS reference (Web, React + StyleX in code). Defines the foundations of the Figma file - pages, the Color collection (Neutral Light / Neutral Dark) with six theme extensions (Chocolate, Butter, Stone, Y2K, Gothic, Matcha), Spacing, Size, Border, Radius and Typography variables, 14 text styles, 8 effect styles and the 1,694 Lucide icons - plus what this reference does differently from our rules. Load it together with any Astryx Component_Skills.
---

# Astryx Library DS (Web) - Foundation

> **Node IDs:** none are stored in this folder. A duplicate gets new ids, so always find components, styles and variables by **name**.

> **Data files (source of truth for values):** `../data/tokens.json` (every base variable and mode), `../data/source/theme-extensions.json` (the six themes' override values), `../data/component-registry.json`, `../data/rules.json`, `../data/screen-templates.json`, `../docs/decisions.md`. When a number here and the JSON differ, the JSON wins.

Source: `Astryx Library DS` (Abdul's duplicate of the Astryx community file, key in `references.json > astryx-web`), studied read only through FigCli Yolo on 2026-10-06. Library version on the About page: v0.1.9. Platform: **Web** (Tailwind-like scales; the code is React + StyleX).

Reference files: `references/variables.md` (every variable, both modes, theme table), `references/gaps.md` (foundation audit against our Web rules).

---

## 0. What kind of reference this is

- **Code is the source of truth.** The About page says the library is kept in sync with the Astryx codebase by an automated agent ("Night Watch") that reads each release, classifies its Figma impact and updates the file. Figma follows code, never the other way. Use this reference for **component coverage, anatomy, slots and content patterns**; take token architecture from our Web Main Skill, not from this file (section 3).
- Very wide coverage (110 component sets, 1,988 variants, 21 standalone components, 33 page templates), strongest in data-heavy app UI: PowerSearch, Table, TreeList, MetadataList, CommandPalette, AppShell, and a full **AI chat** kit (composer, tool calls, streaming, message metadata).
- Weak where our rules are strict: no Primitive tier, no variable scopes, descriptions or code syntax, 40 of 131 components described, Dark mode broken on a few organisms (raw white fills).

## 1. File structure (page order)

| # | Page | Content |
|---|---|---|
| 1 | About | Cover, Info (how the agent sync works), Links (docs, GitHub, npm `@astryxdesign/core`) |
| 2 | Foundation | Three doc frames: **Shape** (radius usage), **Typography** (families, styles, usage per level), **Color** (every semantic swatch, bound to variables) |
| 3 | Icons | `Icon` set (Size xsm 12 / sm 16 / md 20 / lg 24) + 1,694 `icon/<lucide-name>` components |
| 4 | `-----` | separator |
| 5 | Templates | 33 `Example/*` page templates in 9 sections: Table, Form, Settings, Login, Tools, Content, AI Chat, Gallery, Shell |
| 6 | `---` | separator |
| 7-16 | Action, Chat, Container, Content, Data Input, Feedback & Status, Layout, Navigation, Overlay, Table & List | one page per category, each component in a doc frame (Document Header, Types, Banner, Device, Section Header - remote doc-template instances tagged `#quality_disable`) |

Differences from our layout: no `⭐` group headers or `➜` topic pages, categories by **code package area** (10 pages) instead of our three groups. Our mapping is in `../data/component-registry.json > meta.group_mapping`. Keep our page layout for projects built from this reference.

## 2. Variables

18 collections, 166 base variables (see `references/variables.md`):

| Collection | Modes | Variables | Notes |
|---|---|---|---|
| **Color** | Neutral Light, Neutral Dark | 108 | Raw hex per mode (no Primitives). Groups: Core (Accent, Accent Muted, On Accent, Neutral, Background Surface / Body / Muted / Inverted, Overlay, Overlay Hover / Pressed), Text (Primary, Secondary, Disabled, Accent, On Dark, On Light), Icon (Accent, Primary, Secondary, Disabled), Surface (Card, Popover), Status (Success, Error, Warning + Muted + On + Error Inverted), Border (Default, Emphasized), Effects (Skeleton, Shadow, Tint Hover, Elevation Shadow, Elevation Shadow Strong, Track), 10 hue families (Blue, Cyan, Gray, Green, Orange, Pink, Purple, Red, Teal, Yellow) x Background / Border / Icon / Text, Syntax (13 code-highlight roles), Component/* (Badge, ProgressBar, Input Ring) |
| Spacing | Default | 15 | `Spacing/0, half 2, 1 4, 1-half 6, 2 8, 3 12 ... 12 48` (n x 4px) |
| Size | Default | 3 | `Element/Small 28, Medium 32, Large 36` (control heights, bound on Button height) |
| Border | Default | 1 | `Border Width 1` (almost never bound: 8 of 807 strokes) |
| Radius | Neutral | 6 | Role names: `None 4` (sic), `Inner 6`, `Element 10`, `Container 12`, `Page 28`, `Full 9999` |
| Typography | Neutral | 33 | `Font Size/4xs 6 ... 5xl 42`, `Font Weight/Normal 400 ... Bold 700`, `Line Height/<style name>`, `Font Family/Body, Heading, Code` (CSS font stacks as strings) |
| 6 theme extensions of Color | parent modes + `<Theme> Light / Dark` | 90 overrides each | Chocolate, Butter, Stone, Y2K, Gothic, Matcha |
| 6 theme extensions of Radius | Neutral + `<Theme>` | 6 overrides | e.g. Y2K all 0, Matcha Element 12 / Page 42 |
| 6 theme extensions of Typography | Neutral + `<Theme>` | 3 overrides | font families only (Fraunces, Outfit, Montserrat, Poppins, Fustat, Playwrite US Trad...) |

**Themes are Figma extended collections** (`isExtension`, `parentVariableCollectionId`): one base collection plus a child collection per brand that overrides only some values. Switching a frame to `Chocolate Light` re-themes every component without touching them. This is the cleanest multi-brand mechanism we have seen; see `../docs/decisions.md` > Lessons.

Code context (not in Figma): the code palette is OKLCH with stops 0-100 in steps of 5 and a dark-mode chroma taper. Figma keeps only the resolved semantic hex values, so a recolor in Figma means editing up to 216 hex values by hand (`tokens.json > recolor_readiness`: not ready).

## 3. Text and effect styles

| Style | Font | Size / Line height | Bound |
|---|---|---|---|
| Display/Display 1, 2, 3 | Figtree Regular | 42/52, 35/44, 29/36 | size, line height |
| Heading/Heading 1, 2 | Figtree SemiBold | 24/32, 20/28 | size, line height |
| Heading/Heading 3, 4 | Figtree Bold | 17/24, 14/20 | size, line height |
| Heading/Heading 5, 6 | Figtree SemiBold | 12/20, 10/16 | size, line height |
| Text/Body, Large, Label, Supporting | Figtree Regular, SemiBold, Medium, Regular | 14/20, 17/24, 14/20, 12/20 | size, line height |
| Text/Code | JetBrains Mono Regular | 14/20 | size, line height |

Font family and weight are **not bound** (the family variables are CSS stacks, which Figma cannot bind), so the theme font overrides do nothing to text in Figma. Letter spacing is 0 everywhere. The Foundation page says Menlo for code; the style uses JetBrains Mono.

Effect styles: `Elevation/Low, Medium, High` (two drop shadows each, color bound to Effects/Elevation Shadow*) and `Input Ring/Focus, Hover, Success, Warning, Error` (3px inner shadow, color bound to Component/Input Ring/*). Focus is an **inset ring** on inputs; buttons use a separate focus treatment in their `Focused` variant.

## 4. Icons

- Lucide, 1,694 components named `icon/<lucide-name>` (kebab case, all on the Icons page).
- `Icon` component set wraps them: Size xsm 12, sm 16, md 20, lg 24; default `circle-dashed`; swap the nested instance. Components expose icons through `Icon Source` (Button) or `startIconType` (TextInput, InputGroup) instance swaps; only 3 swap properties exist in the whole file, other icons are fixed nested instances or slots.
- The Icon description says to override the fill directly on the instance (no token binding at the icon level); components bind the color they need (Icon/* tokens).

## 5. How to use this reference (for our builds)

- **Coverage and anatomy:** read `../data/component-registry.json` before building a component Astryx has: variant axes, booleans, text properties and slots are already worked out (e.g. Field anatomy shared by every input, Item as the generic row primitive behind List and MetadataList).
- **Tokens:** never copy the Color collection as is. Build Primitives (OKLCH ramps 0-100 by 5 like the Astryx code) + Semantics aliasing them, following `Web_Design_System_Skill` section 3. The Astryx role names (Core/Accent, Accent Muted, On Accent, Background Surface / Body / Muted, Overlay Hover / Pressed) map well to our `color/{group}/{role}`.
- **Themes:** when a project needs several brands, use Figma extended collections the Astryx way (base Semantic collection + one extension per brand), only after the user approves it (our rules do not have it yet).
- Fix on create: every gap in `references/gaps.md` and the Component_Skills gaps is fixed in a project copy; the original stays untouched.
