---
name: trianglz-navigation
description: Use when building, auditing or coding actions and navigation with the Trianglz Web Design System (Figma file 7qsOqckanKwGDbkljD3rb9) - buttons (filled, outline, pill, link; 5 sizes; icon left/right/only), text links, pagination and tabs (underline and pill). Tells the agent which Navigation component and variant to use, how it is tokenized, and when each is appropriate.
---

# Trianglz Web DS - Navigation

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, styles, icons, file structure, build order and atomic rules live there).

Scope: the **⭐Navigation** page group only: ➜ Buttons & links, ➜ Paganation & Tabs. Platform: Web (Tailwind).
Source: structure via Figma Desktop Bridge + screenshots of every variant (`references/screens/`).

Reference files: `references/components.md` (ids, keys, anatomy, tokens per variant), `references/gaps.md` (audit).

---

## Update 2026-09-29 (gap fixes applied in Figma - overrides older details below)

- **Button** now has 400 variants: `Type` = Filled, Outline, Pill, Link, **Danger** (red, `btn/danger/*`) x Size x Icon x State.
- Disabled keeps each Type's own look at 50% opacity (no more pale blue for all). Focus = effect style `focus-ring-offset` (2px gap + 4px blue ring) on every Type.
- Pagination: Ellipsis is `Type=Ellipsis, State=Default` (property error fixed); Prev/Next arrows are `Icon/Arrow Left/Right` instances.
- New on ➜ Paganation & Tabs: **Breadcrumb / Item** (Atom, State = Default, Hover, Current; Label prop) and **Breadcrumb** (Molecule, items + `Icon/Chevron Right` separators, exposed item props).
- All sets have descriptions.

## 1. Inventory

| Component | Set id | Variants | What it is |
|---|---|---|---|
| **Button** | `103:859` | 320 = Type(4) x Size(5) x Icon(4) x State(4) | All buttons and button-styled links |
| **Pagination / Item** | `245:24` | 9 | One pagination cell: Number, Ellipsis, Prev, Next |
| **Tabs / Item — Underline** | `245:54` | 4 | One underline tab |
| **Tabs / Item — Pill** | `245:63` | 4 | One pill (segmented) tab |

Not components (examples only, frames): `Pagination / Bar — Example 245:25`, `Tabs / Bar — Underline 245:64`, `Tabs / Bar — Pill 245:75`.
Build bars yourself from item instances in a horizontal auto layout (see section 4).

No breadcrumb, navbar/header, sidebar, menu, stepper or text-link component exists in this group.

### Tier of each component

| Tier | Component | Nests | Current state |
|---|---|---|---|
| Atom | Button | Icon (Add, right, upload) | OK: icons are local Icon instances |
| Atom | Pagination / Item, Tabs / Item (Underline, Pill) | tokens only | Pagination arrows are text glyphs, should be Icon instances |
| Molecule (to build) | Pagination bar, Tab bar | Pagination / Item, Tabs / Item instances | Only example frames exist; the tab bars use plain frames |

## 2. Button

Properties (all variants, no boolean/text/instance-swap properties):
- `Type`: **Filled** | **Outline** | **Pill** | **Link**
- `Size`: **xs** | **sm** | **base** | **lg** | **xl**
- `Icon`: **None** | **Left** | **Right** | **Only**
- `State`: **Default** | **Hover** | **Focus** | **Disabled**

Which type:
- **Filled** - the one primary action of a view or dialog (Save, Continue, Submit). Max one per section.
- **Pill** - same weight as Filled with fully round corners; use for marketing/landing CTAs or chips-like actions. Don't mix Pill and Filled in one product surface.
- **Outline** - secondary actions next to a Filled button (Cancel, Back, Export).
- **Link** - tertiary, low-emphasis actions inline or in toolbars (Learn more, Edit, View all). It is a button with no fill/border, blue text.
- **Danger** - destructive actions (Delete, Remove). Pair with an Outline Cancel.

Which size (height · padding · text · icon):

| Size | Height | Padding (y/x) | Text style | Icon | Use |
|---|---|---|---|---|---|
| xs | 32 | space/2 · space/3 | xs/Medium 12 | 12 | dense tables, tags |
| sm | 36 | space/2 · space/3 | sm/Medium 14 | 16 | toolbars, cards |
| base | 40 | space/2 · space/5 | sm/Medium 14 | 18 | default; matches 40px inputs |
| lg | 48 | space/3 · space/5 | base/Medium 16 | 20 | forms on marketing pages, mobile primary |
| xl | 56 | space/4 · space/6 | base/Medium 16 | 20 | hero CTAs |

Use `base` next to form fields (both 40px). Radius: Filled/Outline/Link `radius/md` (6), Pill `radius/3xl`.

Icon:
- `Left` for actions with a verb icon (+ Add, upload). `Right` for forward/navigation (Next ›, View all ›). `Only` for toolbars; **always give an aria-label** and a tooltip.
- Default icons are local icon instances `Add` (left), `right` (right), `upload` (only). Swap the instance to the right local icon (there is no swap property; select the nested instance).
- Icon-only buttons are not square (base 58x40) because they keep the text padding.

States (screenshot-verified):
- Filled/Pill: Default `btn/Primary/bg 2` (blue-600) + white text; Hover `bg-hover 2` (blue-700); Focus `bg-active 2` (blue-800) + 3px `btn/Primary/border 2` border; Disabled pale `btn/Primary/Light` (blue-100) with white text.
- Outline: Default white/transparent + 1px `btn/secondary/border` (gray-300) + `btn/secondary/text` (gray-700); Hover `btn/secondary/bg-hover`; Focus 3px `border/focus` ring + hover fill.
- Link: Default `text/link` only; Hover gets `btn/secondary/bg` fill; Focus 3px `border/focus` ring.
- **Disabled is identical for every Type** (pale blue fill, white text): an Outline or Link button turns into a pale filled button when disabled.

## 3. Pagination / Item

Variants: `Type=Number, State=Default|Hover|Active|Disabled` · `Type=Ellipsis` (no state) · `Type=Prev, State=Default|Disabled` · `Type=Next, State=Default|Disabled`.
- Number cell 40x40, `radius/md`, 1px `border/default`, `sm/Medium` `text/primary`; Hover `bg/secondary`; **Active** solid `btn/Primary/bg 2` + `text/inverse`; Disabled `text/disabled`.
- Prev / Next: "← Previous" / "Next →" with padding space/4, gap space/2 (arrows are text glyphs, not icons).
- Ellipsis: "..." `text/secondary`, no border.

Use pagination for tables and lists with known page counts. Pattern: Prev · 1 · [current] · neighbours · ... · last · Next; show at most 7 number cells; disable Prev on page 1 and Next on the last page. For feeds use "Load more" (Button Outline) instead.

## 4. Tabs

`Tabs / Item — Underline` and `Tabs / Item — Pill`, each `State=Default|Hover|Active|Disabled`, 36px tall, padding space/2 · space/4, text `sm/Medium`.
- Underline: Default `text/secondary`, Hover `text/primary`, Active `text/link` + bottom border `border/focus`, Disabled `text/disabled`. Bar: items in a row with gap 0 on a 1px bottom `border/default` line.
- Pill: Default `text/secondary`, Hover `bg/muted` fill + `text/primary`, Active `bg/secondary` + `text/link`, Disabled `text/disabled`, radius `radius/lg`. Bar example: `bg/muted` track, `radius/xl`, padding and gap `space/1`, active tab white (`bg/primary`) + `text/primary` - **this differs from the Pill item's Active variant**; follow the item component and flag the mismatch.

When to use:
- **Underline tabs** - switch between sibling sections of one page/entity (Overview, Analytics, Settings). Page-level navigation under a header.
- **Pill tabs** - compact view switchers / segmented controls inside a card or toolbar (Day/Week/Month, List/Grid). 2-5 options.
- More than ~6 tabs or long labels -> use a Select or a side nav instead. Tabs never trigger actions (use Buttons).

## 5. Rules for AI agents
- Use instances of the sets above; never draw a button or tab from frames.
- One Filled button per section; pair it with Outline for the secondary action; right-align action groups in forms/dialogs (primary on the right), gap `space/3`.
- Write verb-first labels ("Save changes", "Create project"), not "OK"/"Submit" when a specific verb exists.
- Keep one size per row of buttons; match `base` with 40px inputs.
- Set `State` only to show a static mock of an interaction; default everything to `Default`.

## 6. Web / Tailwind map

| Figma | Code |
|---|---|
| Filled base | `h-10 px-5 py-2 rounded-md bg-[--color-btn-primary-bg] text-[--color-btn-primary-text] text-sm font-medium hover:bg-[--color-btn-primary-bg-hover] active:bg-[--color-btn-primary-bg-active]` |
| Outline | `border border-[--color-btn-secondary-border] text-[--color-btn-secondary-text] hover:bg-[--color-btn-secondary-bg-hover]` |
| Link | `text-[--color-text-link] hover:bg-[--color-btn-secondary-bg]` (or real `<a>` with underline on hover) |
| Pill | same as Filled + `rounded-full` |
| Focus | `focus-visible:ring-[3px] focus-visible:ring-[--color-border-focus]` (use the focus token for Filled too; the file's same-hue border is too weak) |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` on the type's own colors (the file's pale-blue-for-all is a gap) |
| Sizes | xs `h-8 px-3 text-xs` · sm `h-9 px-3` · base `h-10 px-5` · lg `h-12 px-5 text-base` · xl `h-14 px-6 text-base` |

Semantics: `<button type>` for actions, `<a href>` for navigation even when styled as a button. Icon-only needs `aria-label`.
Pagination: `<nav aria-label="Pagination">`, current page `aria-current="page"`. Tabs: `role="tablist"` / `role="tab"` `aria-selected` / `role="tabpanel"`, arrow-key navigation. Pill tabs used as a filter can be a radio group instead.
