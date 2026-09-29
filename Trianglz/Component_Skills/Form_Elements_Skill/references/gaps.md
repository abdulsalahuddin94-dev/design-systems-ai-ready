# Form Elements - audit gaps (2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Status after fixes (2026-09-29)
**Fixed:** A1-A4 (descriptions, `State` naming, variant values, unique set names), B7-B10 (Upload props wired, Search dead props removed, card-number visibility bug, text props added), D19-D24 (remote variables and styles relinked, raw radius/padding/gap bound, focus/hover shadows now effect styles), 26a (line height bound), 26c, E27 (icons are local Icon instances), F28 (dark copies removed), G29-G30 (hint/placeholder gray/500, `color/border/input`), C15 partially (disabled still opacity-based but consistent per type).
**Also fixed:** C13 hover/focus (error state for controls still missing), Stepper uses Button instances, letter spacing bound.
**Still open:** error variants for Checkbox/Radio, C14 (no success state for inputs), C17 (password/date/phone fields), Checkbox tick is a vector, final screenshot check of Select / Dropdown open state and the new control states.

Read-only audit of the 15 component sets in the ⭐Form Elements group, from the file structure plus screenshots of every variant. Nothing in Figma was changed.
Severity: **High** = breaks theming/usage or a11y, **Med** = inconsistency that confuses AI or devs, **Low** = hygiene.

## A. Documentation and naming
1. **High** - No component set has a description (0 of 15). Figma/MCP consumers get no usage guidance from the file itself.
2. **High** - Variant property is `Property 1` on 14 of 15 sets (only Textarea uses `State`). Rename to `State` (and `Checked`/`Disabled` booleans for selection controls).
3. **Med** - Non-semantic variant values: `Variant5` (error), `folled` (typo for filled, payment set), `Status4` (radio checked+disabled), toggle `enabled/disabled` meaning On/Off, `dimmed` meaning disabled. Casing mixes `Default`/`default`, `hover`/`Hover`.
4. **Med** - Three different sets share the name `Input fields` (72:21377, 73:23456, 73:23641). Suggested: `Input / Text` (with chevron option -> or split `Select`), `Input / URL`, `Input / Card number`.
5. **Low** - `Catalyst / Textarea` keeps the source kit prefix; `code field`, `numeric field`, `RadioButton` casing differs from `Checkbox`, `Toggle`. `numeric field` is really a quantity stepper.
6. **Low** - Page name typo `➜ Checkboxe`; page `➜ Input Fields and Dropdown` has no dropdown menu component.

## B. Component properties
7. **High** - Upload Field and Search expose 5 properties each (Show Label, Label Text, Hint Text, Show (Optional), Show Help Icon) that are **not connected to any layer**. Search's copies still default to "Upload File".
8. **High** - Payment input 73:23641 `Default` variant: `Show Payment method icon` is also bound to the Input frame's visibility, so turning it off hides the whole field.
9. **Med** - Label, placeholder and hint texts are not exposed as TEXT properties on Input fields, Textarea, Toggle, OTP group (only Checkbox/Radio `Text`, Upload `Label Text`/`Hint Text` - the latter unwired).
10. **Med** - `Show link` and `Show Payment method icon` exist on all three Input sets even where they do nothing; `Show icon` is the only thing distinguishing text input from select.
11. **Med** - No leading/trailing icon instance-swap properties anywhere (project rule: inputs expose leading/trailing icons).
12. **Low** - RadioButton lacks `Show text` which Checkbox and Toggle have.

## C. Missing states / components
13. **High** - Checkbox, Radio and Toggle have no hover, focus or error variants. Web needs visible focus.
14. **Med** - No success state for text inputs/textarea; no error or disabled state for Search.
15. **Med** - Disabled is built with raw layer opacity at inconsistent values (inputs/textarea/upload 50%, OTP 40%, checkbox 40% vs 50%, radio 40% vs 50%, toggle 30% vs 50%). No opacity token or disabled color tokens exist, and fading the label and hint pushes already-low text contrast lower. `numeric field` `dimmed` actually means "at minimum value", not disabled.
16. **Med** - Hover styling differs by component: text input = grey fill + shadow, Textarea = lighter grey fill, Search = dark border, OTP cell = grey fill + 2px border. The URL input's `hover` variant also drops its "http://" prefix (screenshot-verified bug).
17. **Med** - Missing components a web form usually needs: open dropdown menu / option list, multi-select/combobox, password field with show/hide, date picker, phone with country code, form group/fieldset label for checkbox/radio groups, inline field-level success message.
18. **Low** - Hint position: above the field in 4 sets, below the field in the URL set (73:23456). Error text is 12px everywhere except Textarea (14px).

## D. Token binding (unbound / broken values)
19. **High** - 7 variables are bound to **remote libraries** not in this file: `Space 2`, `Space 4`, `(Space 3)` (Spacing), `Rounds Variables/roundes-lg`, `Neutral/Grey 800` (Base Colors), `Text/Body text color` (Semantic Variables), `Neutrals/Neutral 500` (Semantic Variables 02). Found in numeric field buttons, Down/Close/Doc/Trash/Add icons. Rebind to local Spacing/Semantic tokens.
20. **High** - Effect style `Shadow/Elevation 1/E 1 Rest state` used by all `code field` cells is remote (39 uses).
21. **Med** - Raw (unbound) values: radius 8 on code field, numeric field, Search inner field, Textarea tooltip; radius 4 on Checkbox box; radius 20 / 16777200 on Radio and Toggle (use `radius/full`); gaps 8 on Checkbox/Radio/Toggle, 6 and 12 on OTP group, 10 on code field; padding 8 on code field; toggle padding 4/24.
22. **Med** - Raw effects: hover shadow and focus ring (inner 2px #3b82f6) on Input fields and Textarea are local effects, not effect styles or variables. Create `Shadow/sm` and `Focus ring` styles.
23. **Med** - Raw colors: Upload icon children #292d32 (masked by union fill, still noise), card badge stroke #f2f4f7 and fill #ffffff (should be border/default, bg/primary).
24. **Med** - Token misuse: checkmark/indeterminate stroke uses `border/default` (should be text/inverse or an icon-on-primary token); chevron/close icons filled with `bg/inverse`; search icon uses `border/inverse`; OTP cells and stepper use `btn/secondary/*` button tokens for field surfaces.
25. **Med** - Semantic naming: `color/btn/Primary/bg 2`, `text 2`, `border 2` carry a " 2" suffix and mixed case (`Primary`, `Info`, `Neutral` vs `secondary`, `danger`). No `color/icon/*` group exists.
26. **Low** - Tooltip "i" text (3 sets) has no text style (9px Medium raw).
26a. **High** - Text styles bind font-size, family and weight to local Typography variables, but **not line-height or letter-spacing**. On iPad/Mobile modes font size shrinks while line height stays at the Desktop value (sm: 12px text on 20px line instead of 18). Bind line height to `line-height/*`, and letter spacing to `letter-spacing/*` (adding the missing +0.2, -0.2, -0.6, -1, -1.2 values).
26b. **Med** - Text style descriptions for 3xl-6xl state wrong sizes (3xl "30px", 4xl "36px", 5xl "48px/48px", 6xl "60px/60px" vs actual 28, 32, 40/48, 48/60).
26c. **Med** - 11 local effect styles exist (Tailwind shadow scale) but Form Elements use raw copies of `shadow-sm` and a remote elevation style instead of local `shadow-xs`. Effect style colors are raw black; no shadow color variable exists, so shadows don't adapt to Dark mode.

## E. Icons
27. **High** - All icons except one are flattened vectors inside frames ("Down Icon", "Upload Icon", "Doc Icon", "trash Icon", "Close", "Add Icon", "Linear / Search / Magnifer"), not Icon component instances, so they cannot be swapped and are not bound to icon tokens. The local ➜ Icons page already has matching components (`upload`, `file`, `delete`, `search`, `Close Icon`, `Add`, `info`, `Exclamation mark`) that should be used instead; there is no chevron-down icon yet. Only `alert-circle` (OTP error) is an instance, and it comes from a remote library.

## F. Theming
28. **Med** - Dark mode is shipped as **duplicate component sets** (Checkbox 2003:697, Toggle 2003:887, RadioButton 80:28758) inside frames set to `Semantic: Dark`. Components are already token-bound, so the duplicates are redundant and can drift. Keep one master and show dark mode by switching the frame mode.

## G. Accessibility (WCAG 2.2 AA)
29. **High** - `text/muted` and `text/placeholder` (gray/400 #9ca3af) on white = **2.5:1**. Hint text (12px) fails 4.5:1; placeholders are also below the recommended 4.5:1. Dark mode gray/500 on gray/950 is ~4.2:1, also short. Suggest gray/500 (#6b7280, 4.8:1) for Light hints/placeholders and gray/400 for Dark.
30. **High** - Field borders `border/default` gray/200 (1.2:1) and `border/strong` gray/300 (1.5:1) are below the 3:1 non-text contrast for input boundaries (1.4.11). Checkbox/radio unselected rings (gray/300) also fail.
31. **Med** - Checkbox/radio hit area is 20px; the label must be part of the click target in code to reach 24px minimum (2.5.8).
32. **Med** - Tooltip "i" is 14px, too small as a standalone target.

## Suggested fix order
1. Rebind remote variables + remote effect style (D19, D20), bind text-style line height / letter spacing (26a), and swap raw shadows for local effect styles (26c).
2. Fix property wiring bugs (B7, B8) and rename variants/sets (A2-A4).
3. Add descriptions to all sets (A1) - text can be lifted from `components.md` "Use for" lines.
4. Add focus/hover/error states to selection controls (C13), one disabled-opacity token (C15) and a single hover pattern (C16).
5. Replace vector icons with Icon instances + icon tokens (E27, D25).
6. Raise hint/placeholder/border contrast (G29, G30).
7. Remove dark duplicates (F28).
