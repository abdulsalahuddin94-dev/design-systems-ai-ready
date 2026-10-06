---
name: astryx-form-elements
description: Use when building, auditing or coding inputs with the Astryx Library DS reference (Web) - TextInput, TextArea, NumberInput, Date/Time/DateRange/DateTime inputs, Selector, MultiSelector, Typeahead, Tokenizer, InputGroup, FileInput, Checkbox and Radio lists, Switch, Slider, SegmentedControl, Calendar, PowerSearch and the AI chat composer. Tells the agent the shared Field anatomy, which input to pick, the variant axes and slots, and what to fix when copying them.
---

# Astryx Library DS (Web) - Form Elements

> **Node IDs:** none are stored here; find components by page + set name.

> **Data files:** `../../data/component-registry.json` (exact variants, properties, slots, contrast results), `../../data/tokens.json`, `../../data/rules.json`. The JSON wins over this file.

**Load `../../Foundation_Skill/SKILL.md` first.** Scope: everything a user enters data with. In Figma these sit on the **Data Input** page, plus SegmentedControl (Action page) and the chat composer parts (Chat page). Inventory with every variant and property: `references/components.md`; audit: `references/gaps.md`.

## 1. Inventory (33 components, 679 variants)

| Tier | Components |
|---|---|
| Atom | Checkbox / CheckboxInput (24), Switch (16), SegmentedControl / SegmentedControlItem (45), Field / .FieldLabel (3), Calendar / .CalendarDay (8), InputGroupText (1), Chat / ChatComposerTokenElement (4) |
| Molecule | TextInput, TextArea, NumberInput, DateInput, TimeInput, Selector, Typeahead, Tokenizer (24 each = state 8 x size 3), InputGroup (15), FileInput (16), Slider (14), Field (4), Checkbox / CheckboxListItem (24), Checkbox / CheckboxList (4), Radio / RadioListItem (24), Radio / RadioList (4), SegmentedControl (18), PowerSearch / Trigger (6), Chat / ChatComposerInput (4), Chat / ChatComposerDrawer (2) |
| Organism | Selector / MultiSelector (192), DateRangeInput (24), DateTimeInput (24), Calendar (4), PowerSearch / Popover (4), Chat / ChatComposer (3) |

## 2. The Field pattern (shared by every text-like input)

Every input is `Label (+ Optional / Required indicator, info tooltip) -> Description -> control -> status message`:
- `Field / .FieldLabel`: Indicator Default / Optional / Required, `hasIcon`, `hasTooltip`.
- Control states (same 8 on every input): `rest, hover, focused, error, warning, success, loading, disabled`; sizes `sm, md, lg` (heights from `Size/Element/Small 28, Medium 32, Large 36`).
- Status message sits **below** the control in a tinted block (`Status/*` + `*/Muted`), with a status icon at the end of the control. Focus and status rings are inner-shadow effect styles `Input Ring/*` (3px).
- Properties (TextInput): `showLabel`, `description` + `descriptionText`, `placeholder`, `statusMessage` + `statusText`, `startIcon` + `startIconType` (instance swap).
- `InputGroup` adds `Prefix` / `Suffix` slots (drop `InputGroupText` or a Button) gated by `hasPrefix` / `hasSuffix`.

Use this anatomy for our Input / Text family: it matches our "hint between label and field, error below" rule and adds Warning and Loading states we do not require yet.

## 3. Which input to use

| Need | Astryx component |
|---|---|
| Single line text | TextInput (start icon for search) |
| Text with fixed addons (`https://`, `.com`, unit) | InputGroup + InputGroupText |
| Multi-line | TextArea |
| Number with steppers | NumberInput (`Show Labels`) |
| Date, time, both, range | DateInput, TimeInput, DateTimeInput, DateRangeInput (Calendar popover; Calendar Mode Single / Range, 1 or 2 months) |
| One choice from a list | Selector (`hasSearch` for long lists); Radio / RadioList for 2-6 visible options (our rule: 7+ -> Selector) |
| Many choices | MultiSelector (Display: Placeholder, Count, Labels, Badges) or Checkbox / CheckboxList |
| Free tags / chips | Tokenizer; suggestions while typing: Typeahead |
| Files | FileInput (mode input or dropzone) |
| On/off setting | Switch (Label Position end / start, optional description) |
| Value on a range | Slider (single / range, marks, value bubble) |
| Switch a value between 2-5 options inline | SegmentedControl (controls a value, not a view; for views use Tabs) |
| Query builder / filters | PowerSearch (Trigger + Popover with Fields, Value Editor, Results, Empty) |
| AI prompt box | Chat / ChatComposer (state empty, typing, streaming; Header / Footer slots, ComposerInput with token elements: Mention, Command, Attachment, Text) |

## 4. Rules to copy

- One state axis with the same 8 values on every input, one size axis with 3 values bound to `Size/Element/*`.
- Checkbox / Radio lists are separate list molecules built from list items; list items carry `label`, `description` and `Start Content` / `End Content` slots.
- Slots for content areas (`Prefix`, `Suffix`, `Content`, `Header`, `Footer`) instead of variant explosions.

## 5. Fix when copying (details in `references/gaps.md`)

- Border `Border/Emphasized` is 1.48:1: use our `border/input` (>= 3:1).
- No Figma description on 24 of 33 components; the chat composer placeholder uses `Text/Disabled` (2.5:1 Light, 2.2:1 Dark).
- Checkbox has no Error state; Switch packs value and state into one axis (`disabled-off`, `focused-on`, `hover-on`); RadioListItem and CheckboxListItem have no Focus state.
- MultiSelector has 192 variants (State x Display x Status x Size): turn Display into a slot or property.
- Lowercase and camelCase property names (`state`, `size`, `hasSearch`, `descriptionText`) next to Title Case ones.
