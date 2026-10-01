# Data display - audit gaps (2026-09-29, read-only, structure + screenshots)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Status after fixes (2026-09-29)
**Fixed:** 1-3 (all remote variables, text styles, effect styles, icons relinked), 4-6 (naming: Alert Status, Avatar Size, Badge/Popup Status), 7 (dark copies removed), 8 partially (Tooltip text, Alert/Popup Show close, Popup Title/Body), 9 (descriptions), 10 (Tooltip Poppins xs/Regular), 11 (raw values bound), 13 (Danger popup uses Button Type=Danger), 14 (icons are Icon instances; avatar glyph still vector), 19 partially (Toast added).
**Still open:** 12 (status colors still from btn/* tokens), 15-18, Avatar Upload is not built from Avatar + Button instances, 20, 21-22 (warning contrast).

## Broken links to other libraries (highest risk)
1. **High** - Confirmation Popups surface is bound to remote variables (`Backgrounds/Main Section`, `Borders/Border Darker`, radius `L`, padding `Space 6`, gap `Buttons Padding`) and uses a remote `trash Icon`. It won't theme with this file's Dark mode and breaks if that library is removed.
2. **High** - Alerts use **remote text styles** (`Medium/SM Medium (Buttons & Labels)`, `Body/SM Regular`) instead of local `base/Medium` and `sm/Regular`.
3. **High** - Tooltip uses a remote effect style `Shadow/M` and Avatar/upload image use a remote radius `Full` and remote spacing `Space 1`, `(Space 3)`; icon vectors bind remote colors `Charcoal`, `Text/Body text color`, `Text/Links color`, `Neutral/Grey 800`.

## Structure and naming
4. **High** - All 4 Alerts variants are named `Property 1=Default`, so the variant can't be chosen by name and tools report property errors. Rename to `Status=Info|Warning|Error|Success`.
5. **Med** - Avatar `size` has 5 values for 4 sizes: `Large` (text) and `large` (Icon/Photo) are two spellings; `Meduim` is misspelled; lowercase property name `size`.
6. **Med** - Generic `Property 1` on upload image, badges and popups; mixed case values (`Success` vs `info`, `uploaded`).
7. **Med** - Dark mode shown with duplicate component sets (5 sets) instead of mode switching; popups have no dark showcase.
8. **Med** - No text properties (alert title/message, badge label, popup title/body, tooltip text) and no boolean to hide the alert close x or badge icon; no instance-swap for icons.
9. **Low** - No descriptions on any set.

## Tokens and styles
10. **Med** - Tooltip text is **Inter** 12px with no text style; the system font is Poppins.
11. **Med** - Raw values: Tooltip radius 8 / padding 12; Alerts radius 8, padding 8/24, gap 16; badge padding 4/8, gap 4; popup icon padding 8.
12. **Med** - Status colors come from `btn/*` button tokens (`btn/Info/light`, `btn/success/bg`...) instead of the existing `bg/{status}`, `text/{status}`, `border/{status}` roles; info alert border uses `btn/Primary/border 2`.
13. **Med** - Popup confirm buttons are Filled Button instances with a manual fill override for warning/danger (no danger button variant exists).

## Icons
14. **High** - Alerts, badges, avatar and upload image redraw icons as vectors; the local ➜ Icons page has `info`, `danger`, `check`, `Exclamation mark`, `Close Icon`, `user`, `edit`, `delete` that should be instances. Only the popups use instances (one remote).

## Missing states / components
15. **Med** - Alerts: no variant without close, no action link/button slot, no compact (single-line) version. Badges: no size variants, no neutral/gray or dot-only version, no version without the icon.
16. **Med** - Tooltip is light (white) only; no dark/inverse tooltip style for light surfaces with low shadow contrast.
17. **Med** - Avatar: no status dot, no avatar group/stack, no 24px size.
18. **Med** - Popups: no generic modal (form/content), no scrim, no sizes; buttons are xs (32px), below comfortable dialog targets.
19. **Med** - No toast/snackbar, card, table, list, empty state, progress, spinner/skeleton, or divider components in this group.
20. **Low** - Favicon page uses a purple placeholder, not the Trianglz brand mark; no exportable favicon assets.

## Accessibility
21. **Med** - Warning title/text and badge (yellow-500 `btn/warning/bg` on yellow-50) is about 2.1:1, below 4.5:1. Success title (green-600 on green-50) about 3.1:1.
22. **Med** - Badge text 12px Regular in status colors is low contrast for warning and success.
