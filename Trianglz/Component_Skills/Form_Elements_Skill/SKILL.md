---
name: trianglz-form-elements
description: Use when building, auditing or coding any web form or input UI with the Trianglz Web Design System (Figma file 7qsOqckanKwGDbkljD3rb9) - text inputs, selects/dropdowns, URL or card-number fields, search bars, file upload, OTP/verification code, quantity steppers, text areas, checkboxes, toggles and radio buttons. Tells the agent which Form Elements component exists, which variant/state and properties to set, which tokens it uses, and when each one is the right choice.
---

# Trianglz Web DS - Form Elements

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

> **Data files (source of truth for values):** `../../data/tokens.json` (every variable and mode, aliases, shade scales and their recolor curves), `../../data/component-registry.json`, `../../data/rules.json`, `../../data/screen-templates.json`, and `../../docs/decisions.md`. When a number here and the JSON differ, the JSON wins (it is pulled from Figma). To change a color, follow the Recolor procedure in the platform Main Skill (section 3b).

Source: structure read through the Figma Desktop Bridge **and every variant checked visually from screenshots**
(light and dark showcase frames).

Scope: only the **⭐Form Elements** page group of `Trianglz - Web Design System`
(https://www.figma.com/design/7qsOqckanKwGDbkljD3rb9). Buttons, links, tabs, tooltips,
badges, popups etc. belong to other groupings and are **not** covered here.

**Load `../../Foundation_Skill/SKILL.md` first** (tokens, styles, icons, file structure, build order and atomic rules live there).

Reference files (load when you need the detail):
- `references/components.md` - every component set: node id, key, variants, properties, anatomy + bound tokens, do/don't.
- `references/screens/*.png` - screenshots of every variant (input-fields, otp-and-stepper, upload-field, search, textarea, checkbox, checkbox-dark, toggle, radio). Look at these to match the visual result.
- `references/gaps.md` - audit findings (unbound values, broken remote variables, naming, a11y). Read before editing the library or when output looks wrong.

---

## Update 2026-09-29 (gap fixes applied in Figma - overrides older names/states below)

| Old name | New name | Variant property / values |
|---|---|---|
| Input fields 72:21377 | **Input / Text** | State = Default, Hover, Focus, Filled, Error, Disabled |
| Input fields 73:23456 | **Input / URL** | same |
| Input fields 73:23641 | **Input / Card Number** | same (Show Payment icon bug fixed) |
| Upload Field | Upload Field | State = Default, Hover, Uploaded, Error, Disabled (Label/Hint/Optional/Help props now wired) |
| Search | Search | State = Default, Hover, Filled, Focus (dead props removed) |
| code field | **OTP / Cell** | State = Empty, Hover, Focus, Filled, Error, Success, Disabled |
| Verification code input field | **OTP / Field** | State = Empty, Filled, Success, Error, Disabled; Label, Hint text props |
| numeric field | **Stepper** | State = Default, Minimum; Decrease/Increase are Button instances (Link, sm, Icon=Only), Decrease disabled at Minimum |
| Catalyst / Textarea | **Textarea** | State = Default, Hover, Focus, Filled, Error, Disabled; Label, Hint, Error message props |
| Checkbox | Checkbox | State = Unchecked, Checked, Indeterminate, Disabled, Disabled Checked, Hover, Focus, Checked Hover, Checked Focus |
| Toggle | Toggle | State = On, Off, On Disabled, Off Disabled, On Hover, On Focus, Off Hover, Off Focus; Label prop |
| RadioButton | **Radio** | State = Unchecked, Checked, Disabled, Checked Disabled, Hover, Focus, Checked Hover, Checked Focus |
| (new) | **Menu / Item** (Atom), **Menu** (Molecule), **Select / Dropdown** (Organism, Open=True/False) | on ➜ Input Fields and Dropdown |

- Input sets gained TEXT props `Label`, `Hint`, `Error message` and BOOLEAN `Show tooltip`.
- All icons are local Icon instances (Chevron Down, Search, Close, Upload, File, Delete, Add, Minus, Info, Alert Circle).
- Focus on Checkbox/Radio/Toggle = effect style `focus-ring-offset`; hover darkens the ring (`border/inverse`) or the fill (`bg-hover`).
- Rest borders use `color/border/input`; hover borders `color/border/inverse`; focus uses effect style `focus-ring`.
- Dark copies (Checkbox/Toggle/Radio) removed; dark previews are instances in the Dark frames.
- Every set has a description (tier + usage).

## 1. Inventory (15 component sets = 12 distinct + 3 dark-mode duplicates)

| Component (Figma name) | Page | Set id | What it is |
|---|---|---|---|
| **Input fields** (chevron) | Input Fields and Dropdown | `72:21377` | Standard text input. With `Show icon` = true it is the **Select / Dropdown trigger**. |
| **Input fields** (link) | Input Fields and Dropdown | `73:23456` | URL input with an `http://` prefix add-on. |
| **Input fields** (payment) | Input Fields and Dropdown | `73:23641` | Card-number input with a card-brand (Mastercard) badge. |
| **Search** | Input Fields and Dropdown | `80:30243` | Search bar with magnifier icon and clear (x) when filled. No label. |
| **Upload Field** | Input Fields and Dropdown | `80:28810` | Single-file picker row: "Click to upload" -> uploaded file name + delete. |
| **Verification code input field** | Input Fields and Dropdown | `69:20901` | 6-digit OTP group with label, hint, success/error message. |
| **code field** | Input Fields and Dropdown | `68:20624` | One 60x60 OTP cell. Building block of the OTP group - do not use alone. |
| **numeric field** | Input Fields and Dropdown | `75:27016` | Quantity stepper: [ - ] value [ + ]. |
| **Catalyst / Textarea** | Text Area | `209:206` | Multi-line text input (114px tall field). |
| **Checkbox** | Checkboxe | `2003:636` | 20px checkbox + label. |
| **Toggle** | Toggles | `2003:826` | 44x24 switch + label. |
| **RadioButton** | Radio Buttons | `80:28711` | 20px radio + label. |

`Checkbox 2003:697`, `Toggle 2003:887`, `RadioButton 80:28758` are **Dark-mode showcase duplicates**
(identical components inside a frame set to `Semantic: Dark`). Always instantiate the light
master listed above and let the Dark variable mode on the parent frame theme it.

---

### Tier of each component

| Tier | Components | Should nest (atoms) | Current state |
|---|---|---|---|
| Atom | Checkbox, RadioButton, Toggle, code field | tokens + Icon | OK (checkmark is a vector, should be an Icon instance) |
| Molecule | Input fields (x3), Search, Upload Field, Catalyst / Textarea | Icon (chevron, search, close, upload, file, delete, info), tooltip badge | Icons are drawn vectors, not Icon instances |
| Molecule | Verification code input field | 6 x code field + Icon (alert-circle) | Nests code field correctly |
| Molecule | numeric field (stepper) | 2 x Button (Outline, Icon=Only) + code field | Buttons are plain frames, not Button instances |


## 2. Which component when (decision guide)

Ask what the user is entering, then pick:

1. **Free text, one line** (name, email, phone, title) -> `Input fields 72:21377`, `Show icon = false`.
2. **Pick one value from a list** -> `Input fields 72:21377` with `Show icon = true` (chevron) as the Select trigger.
   - 2-5 options that should all stay visible -> **RadioButton** group instead.
   - Only on/off -> **Toggle** or single **Checkbox** (see 8 and 9).
   - Note: the DS has **no open dropdown menu / option list** component. Do not invent one inside this group; flag it.
3. **Website / URL** -> `Input fields 73:23456` (`Show link = true` shows the `http://` prefix).
4. **Card number** -> `Input fields 73:23641` (`Show Payment method icon = true`). Only for card numbers; expiry/CVV use plain 72:21377.
5. **Filter or find content in a list/table/page** -> **Search**. Never use Search for form data entry, and never use a text input as a search bar.
6. **Attach a document** -> **Upload Field**. One file per field. Put accepted formats + max size in the hint.
7. **One-time code / PIN sent by SMS or email** -> **Verification code input field** (6 cells). Numeric only, fixed length.
8. **Small integer quantity** (cart qty, seats, guests) -> **numeric field** stepper. For large or free numbers use a text input.
9. **Several sentences** (description, notes, feedback, address block) -> **Catalyst / Textarea**.
10. **Multi-select from a list, or agreeing to terms** -> **Checkbox** (one per option). Use `Indeterminate` only on a "select all" parent when some children are checked.
11. **Exactly one choice from 2-5 mutually exclusive options, all visible** -> **RadioButton** group. Always pre-select a sensible default when one exists.
12. **Setting that takes effect immediately** (notifications on, dark mode) -> **Toggle**. If the change only applies after a Save/Submit button, use a Checkbox instead.

---

## 3. State vocabulary (Figma variant name -> meaning)

Variant names are inconsistent in the file. Map them like this and use the **Figma value** when setting the variant:

| Meaning | Input fields (72:21377 / 73:23456) | Input fields payment 73:23641 | Search | Upload Field | Textarea (`State`) | code field / OTP group |
|---|---|---|---|---|---|---|
| Rest, empty | `Default` | `Default` | `default` | `Default` | `Default` | `empty` |
| Hover | `hover` | `hover` | `hover` | `hover` | `Hover` | `hover` (cell only) |
| Focus / typing | `active` | `active` | `active` | - | `Focus` | `focused` (cell only) |
| Has value | `filled` | `folled` (typo) | `filled` | `Uploaded` | `filled` | `filled` |
| Error | `Variant5` | `Variant5` | - | `error` | `Invalid` | `error` |
| Success | - | - | - | - | - | `success` |
| Disabled | `dimmed` | `dimmed` | - | `dimmed` | `Disabled` | `dimmed` |

Selection controls:

| Meaning | Checkbox | RadioButton | Toggle |
|---|---|---|---|
| Unselected | `Default` | `Default` | `disabled` (= **Off**) |
| Selected | `Checked` | `Checked` | `enabled` (= **On**) |
| Partial | `Indeterminate` | - | - |
| Disabled, unselected | `Disabled` | `Disabled` | `disabled - dimmed` |
| Disabled, selected | `disabled (selected)` | `Status4` | `enabled - dimmed` |

Toggle warning: in this file `enabled/disabled` means **On/Off**, and `dimmed` means **disabled**.

Quantity stepper (`numeric field`): `dimmed` = value is at the **minimum** (shows 0, minus button faded to 40%);
`active` = value above minimum (shows 1, both buttons active). It is not a disabled state of the whole control.

How disabled looks (verified from screenshots): the file fades the component with **layer opacity**, not with
separate disabled colors. Input fields, Textarea, Upload = whole component at 50%. OTP cells = 40%.
Checkbox / Radio / Toggle = the control at 30-50% and the label switches to `text/muted`. Reproduce disabled
in code the same way (`opacity-50` + `cursor-not-allowed` + `disabled` attribute), not with new colors.

---

## 4. Shared anatomy of text-type fields

All labelled fields (Input fields x3, Upload Field, Textarea, OTP group) follow one stack
(vertical auto layout, gap `space/2` = 8px):

1. **Label row** (horizontal, gap `space/2`): Label text `sm/Medium` (14/20) `color/text/primary`
   + `(Optional)` `sm/Regular` `color/text/muted` (toggle with `Show optional`)
   + tooltip "i" badge (14px circle, 1px `color/text/secondary` stroke).
2. **Hint** `xs/Regular` (12/16) `color/text/muted` - sits **between label and field** (convention in 4 of 5 sets; the URL set places it below - prefer above).
3. **Field box**: height **40px** (textarea 114px), fill `color/bg/primary`, 1px stroke `color/border/default`,
   radius `radius/lg` (8), padding `space/2` (8) all sides, gap `space/2`, value text `sm/Regular`.
   Placeholder `color/text/placeholder`; typed value `color/text/secondary`.
4. **Error message** `xs/Regular` `color/text/error`, **below** the field; appears only in the error variant (`Show error message`). In error state the hint is hidden.

State styling of the field box:
- hover: light grey fill `color/bg/muted`, stroke `color/border/strong`, soft shadow-sm (Textarea hover uses the lighter `color/bg/secondary`).
- focus (`active`/`Focus`): white fill, blue `color/border/focus` border that reads as ~2px (1px stroke + 2px blue inner ring), text cursor shown.
- filled: white fill, value in `color/text/secondary` (dark grey), placeholder gone.
- error: red `color/border/error` border, hint hidden, red 12px error line under the field.
- disabled (`dimmed`): grey `color/bg/muted` fill and the **whole field, label and hint at 50% opacity**.

Upload Field is the exception: its empty/hover/disabled box has a **dashed** border (dash 8/2) to read as a drop target;
it becomes solid once a file is uploaded or in error.

Default width in Figma is 392px (textarea 889px). **When placing an instance, set it to Fill container** in its form column; never keep the fixed width.

---

## 5. Rules for AI agents

**Always**
- Instantiate the component set listed in section 1 (import by key from `references/components.md`); never redraw a field with frames.
- Set the variant to match the real state; one form should show at most one `active`/`Focus` field.
- Write real copy: specific label ("Work email"), useful placeholder example ("name@company.com"), and hints that explain format or constraints. Error text says what is wrong and how to fix it ("Enter a 16-digit card number"), not "Error message".
- Mark the minority: if most fields are required, show `(Optional)` on the optional ones and turn `Show optional` off everywhere else.
- Turn off `Show hint` when there is nothing useful to say; turn off the tooltip "i" unless it opens a real tooltip.
- Group radios/checkboxes vertically with 12px (`space/3`) between items; horizontal only for 2-3 short options.
- Stack form fields with `space/6` (24px) between fields and `space/8` (32px) between form sections; put a section heading above each group of related fields.
- Labels `sm/Medium`, values `sm/Regular`, hints and errors `xs/Regular` (token rules: Foundation_Skill).

**Never**
- Use `code field` on its own, Search in a form, or a Toggle inside a form that needs Submit.
- Use Checkbox for mutually exclusive options, or Radio for a single yes/no.
- Show error styling before the user has interacted or submitted.
- Detach instances to change color, radius or padding. If a variant is missing, note it as a gap.

---

## 6. Web / Tailwind implementation map

| Figma | Tailwind / CSS |
|---|---|
| Field height 40 | `h-10` |
| Padding `space/2` | `p-2` (consider `px-3` in code; Figma uses 8px) |
| Gap `space/2` / `space/1` | `gap-2` / `gap-1` |
| `radius/lg` 8 | `rounded-lg` |
| `radius/base` 4 (checkbox) | `rounded` |
| Toggle / radio | `rounded-full` |
| `sm/Regular` 14/20, `sm/Medium` | `text-sm font-normal`, `text-sm font-medium` |
| `xs/Regular` 12/16 | `text-xs` |
| Focus ring (2px blue-500 inner) | `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--color-border-focus]` |
| Hover shadow | `hover:shadow-sm` |

CSS variable names come from each variable's code syntax (see Foundation_Skill).

Semantic HTML:
- Input fields -> `<label for>` + `<input>`; hint and error linked with `aria-describedby`; error state sets `aria-invalid="true"`.
- Select trigger -> native `<select>` or a listbox button with `aria-haspopup="listbox"` / `aria-expanded`.
- URL -> `type="url"`, prefix as a non-editable add-on. Card -> `inputmode="numeric" autocomplete="cc-number"`.
- Search -> `<input type="search">` inside `role="search"`, visually hidden label, clear button with `aria-label="Clear search"`.
- Upload -> hidden `<input type="file" accept="...">` triggered by the row; delete button `aria-label="Remove file"`.
- OTP -> 6 inputs `inputmode="numeric" autocomplete="one-time-code" maxlength=1`, auto-advance, paste fills all.
- Stepper -> `<input type="number" min max>` with - / + buttons (`aria-label="Decrease"/"Increase"`).
- Textarea -> `<textarea>`; Checkbox/Radio -> native inputs in `<fieldset><legend>`; Toggle -> `<button role="switch" aria-checked>`.
- Hover/focus/active: every interactive control needs visible `focus-visible` styles, including checkbox, radio and toggle (the Figma file has no focus variant for them - use the 2px `--color-border-focus` ring).

---

## 7. Final check after using this skill

Run the `audit-design-system` pass on the result: every field is an instance of a set in section 1,
no local overrides of fill/stroke/radius, texts use `sm/*` or `xs/*` styles, and colors resolve to
`Semantic` variables. Report anything that needed a workaround against `references/gaps.md`.
