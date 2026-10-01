---
name: trianglz-data-display
description: Use when building, auditing or coding feedback and data display UI with the Trianglz Web Design System (Figma file 7qsOqckanKwGDbkljD3rb9) - user avatars, profile image upload, tooltips, alert banners, status badges, confirmation popups (modals) and favicon guidance. Tells the agent which Data display component and variant to use, how it is built, and when each one is appropriate.
---

# Trianglz Web DS - Data display

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, styles, icons, file structure, build order and atomic rules live there).

Scope: the **⭐Data display** page group only: ➜ Avatars & upload image, ➜ Tooltips, ➜ Banners & Badges, ➜ Popups, ➜ Favicon.
Platform: Web (Tailwind). Source: structure via Figma Desktop Bridge + screenshots of every variant in light and dark (`references/screens/`).

Reference files: `references/components.md` (ids, keys, anatomy, tokens), `references/gaps.md` (audit).

---

## Update 2026-09-29 (gap fixes applied in Figma - overrides older names/states below)

| Old | New | Properties |
|---|---|---|
| User Avatar | **Avatar** | Type = Initials, Icon, Photo · Size = Large, Medium, Small, XSmall |
| upload image | **Avatar Upload** | State = Default, Uploaded, Error (edit icon = `Icon/Edit`) |
| Tooltip | Tooltip | Arrow = Up, Down, Left, Right · Size = Small, Large · Text / Text (large) props; Poppins `xs/Regular`; `shadow-md` |
| Alerts | **Alert** | Status = Info, Warning, Error, Success (duplicate names fixed) · Show close; local text styles; Icon instances |
| badges | **Badge** | Status = Info, Warning, Error, Success; `Icon/Info` instance |
| Confirmation Popups | **Confirmation Popup** | Status = Success, Info, Warning, Danger · Title, Body, Show close; surface bound to local bg/primary, border/strong, radius/xl, space/10; Danger uses `Button Type=Danger` |
| (new) | **Toast** (Molecule) | Status = Info, Success, Warning, Error · Title, Message, Show close; nests Icon + Button (Link, Icon=Only) |

- Dark copy sets removed; dark previews are instances inside the Dark-mode frames.
- All remote variables/styles replaced with local ones.

## 1. Inventory (6 components + favicon guidance)

| Component | Set id (light master) | Variants | What it is |
|---|---|---|---|
| **User Avatar** | `75:26830` | Type(text, Icon, Photo) x size(4) = 12 | Round user picture: initials, placeholder icon or photo |
| **upload image** | `75:26917` | Default, uploaded, error | Profile photo picker: 100px avatar + blue edit (pencil) button |
| **Tooltip** | `75:26731` | Arrow(up, down, left, right) x Size(small, large) = 8 | White bubble with arrow and soft shadow |
| **Alerts** | `77:27906` | 4 (info, warning, error, success - all named `Default`) | Full-width banner: icon, title, message, close x |
| **badges** | `77:27864` | info, warning, danger, Success | Small outlined status pill with trailing info icon |
| **Confirmation Popups** | `222:3717` | success, info, warning, danger | Centered dialog card: status icon, title, text, Cancel + confirm buttons, close x |

Dark duplicates (showcase frames in `Semantic: Dark`, identical components): User Avatar `75:26834`, upload image `75:26944`,
Tooltip `75:26735`, Alerts `77:27907`, badges `77:27872`. Always use the light master; switch the frame's Semantic mode for dark.
Popups have no dark showcase. ➜ Favicon is documentation only (no component).

### Tier of each component

| Tier | Component | Should nest | Current state |
|---|---|---|---|
| Atom | User Avatar, badges, Tooltip | tokens + Icon (user, info) | Icons drawn as vectors |
| Molecule | upload image | User Avatar + Button (Icon=Only, edit) | Rebuilds the avatar and button from frames |
| Molecule | Alerts (inline banner) | Icon (status) + text + Button Link Icon=Only (close) | Icons and close drawn as vectors |
| Organism | Confirmation Popups | Icon badge + text + 2 x Button + close Icon | Buttons are real Button instances; close is a local Icon instance |

## 2. Which component when

- **Show who someone is** (comments, table rows, header account menu, lists) -> **User Avatar**.
  - `Type=Photo` when a picture exists; `Type=text` (initials, 2 letters) when not; `Type=Icon` for unknown / anonymous / empty state.
  - Sizes: **Large 100** profile headers · **Meduim 60** cards / profile summary · **small 40** lists, tables, comments · **xsmall 32** dense rows, header, avatar stacks.
- **Let the user set their profile photo** (account settings, onboarding) -> **upload image** (`Default` no photo, `uploaded` photo set, `error` invalid file with red ring). Pair with an error text below in code.
- **Explain an icon or truncated text on hover/focus** -> **Tooltip**. `small` for a 1-3 word label, `large` (320px) for one or two sentences. Choose `Arrow` pointing at the trigger (tooltip above the trigger = `Arrow=down`). Never put interactive content or essential info only in a tooltip.
- **Page- or section-level message that persists until dismissed** (system status, form summary errors, success after save) -> **Alerts** (info / warning / error / success). Place at the top of the content area, full width of the container.
- **Label an item's status inline** (table cell, card corner, list item) -> **badges** (info = neutral/blue "Badge", warning, danger = "Error", Success). Keep text to one word.
- **Ask the user to confirm a consequential action** (delete, submit, discard, leave) -> **Confirmation Popups**. `danger` for destructive (trash icon, red confirm), `warning` for risky/irreversible, `info` for neutral confirmation, `success` for completion with a follow-up action.
- Transient "saved" feedback -> not available (no toast component); use an Alerts success banner and flag it.

## 3. Anatomy and tokens (short)

- **User Avatar**: circle, placeholder fill `btn/Neutral/bg-active` (gray-200), initials `text/secondary` with `2xl/Semi Bold` (100), `lg/Medium` (60), `sm/Medium` (40), `xs/Medium` (32); Icon type = white user glyph; Photo = image fill + 1px `border/strong`. Corner radius bound to a **remote** `Full` variable.
- **upload image**: 100px avatar + 32px blue (`btn/Primary/bg 2`) round edit button at bottom-right with a white pencil; error adds 1px `border/error` ring.
- **Tooltip**: `bg/primary` card, 1px `border/muted`, radius 8 (raw), padding 12 (raw), text 12px **Inter** Regular `text/primary` (no text style), 16x8 arrow, remote effect style `Shadow/M`. In dark mode it becomes a dark card (bg/primary dark) with light text.
- **Alerts**: 996x60, radius 8, padding 8/24, gap 16 (raw). Fill `btn/{Info|warning|danger|success}/light`, 1px border of the same hue, 32px status icon, title 16 Medium + message 14 Regular (both **remote** text styles), 24px close icon. Title in the status color, message in the darker `btn/*/text` shade.
- **badges**: 24px tall, radius `radius/2xl`, padding 4/8, gap 4, `xs/Regular` text, 1px border + light fill of the status hue, 16px info icon after the text.
- **Confirmation Popups**: 443px card, padding 24, vertical stack gap; 48px round tinted icon (status `light` bg + status icon), title `lg/Medium` `text/primary`, body `sm/Regular` `text/secondary`, centered; buttons = **Button instances** `Outline xs` (Cancel) + `Filled xs` (confirm, fill overridden to the status color: blue for success/info, `btn/warning/bg`, `btn/danger/bg`); close x top-right. Surface, border, radius and padding are bound to **remote** variables.

## 4. Rules for AI agents

- Instantiate the light master sets; edit text layers for content (no text properties exist).
- Avatar initials: first letter of first and last name, uppercase. Always set alt text in code. Don't mix avatar sizes within one list.
- Alerts: one per context; title = short state ("Payment failed"), message = what to do next. Keep the close x only if the message can be dismissed safely.
- Badges: map meaning to variant consistently (Success = done/active, warning = pending/attention, danger = failed/blocked, info = neutral label). Don't use badges as buttons.
- Popups: title is a question or outcome ("Delete project?"), body states the consequence, confirm button repeats the verb ("Delete"), cancel is the Outline button on the left. Put the popup over a scrim (`bg/overlay` at ~50% opacity; the token itself is opaque, see Foundation gaps). Use `lg/base` Button sizes in real product dialogs; the component uses xs.
- Tooltip text max ~80 characters; never on disabled elements without a wrapper; show on hover **and** keyboard focus.
- Use local icons from ➜ Icons (info, danger, check, Exclamation mark, delete, Close Icon, user, edit) when you rebuild or extend these; the components themselves redraw most icons as vectors.

## 5. Web / Tailwind map

| Component | Code |
|---|---|
| Avatar | `<img class="rounded-full size-10 border border-[--color-border-strong] object-cover" alt>`; initials `<span class="rounded-full size-10 bg-gray-200 text-sm font-medium grid place-items-center">`; sizes `size-8/10/[60px]/[100px]` |
| Upload image | `<label>` wrapping hidden `<input type="file" accept="image/*">`, edit button `aria-label="Change photo"` |
| Tooltip | `role="tooltip"`, trigger `aria-describedby`; `rounded-lg p-3 text-xs shadow-md bg-[--color-bg-primary] border border-[--color-border-muted]` |
| Alert | `role="alert"` for errors / `role="status"` for info+success; `rounded-lg border px-6 py-2 flex gap-4`; close button `aria-label="Dismiss"` |
| Badge | `<span class="inline-flex items-center gap-1 rounded-2xl border px-2 py-1 text-xs">` |
| Confirmation popup | `<dialog>` / `role="alertdialog"` `aria-modal="true"`, focus trapped, Esc closes, focus returns to trigger; `rounded-xl p-6 w-[443px] max-w-[calc(100%-32px)] shadow-xl` |

## 6. Favicon (documentation only)
Provide 16x16 (tabs, bookmarks), 32x32 (high-DPI, Windows taskbar) and 48x48 (pinned site / install prompt). The page uses a purple placeholder square, not the real brand mark; supply the logo files in code (`favicon.ico` + `icon.svg` + `apple-touch-icon.png` 180 recommended).
