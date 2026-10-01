# Data display - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

"(raw)" = hard-coded, "(remote)" = bound to a variable/style from another library.

## User Avatar
- Light `75:26830` key `6cfdb6a5a06012f3792fd1ae87af144f6c9a2032` · Dark copy `75:26834` key `1e45f1396d13a8818d7f6027f7fafe0026212506`
- Properties: `Type` = text | Icon | Photo · `size` = Large | Meduim | small | xsmall | large (Large is used by text, large by Icon/Photo - two spellings of the same size)

| Type | Size values | Structure |
|---|---|---|
| text | 100 / 60 / 40 / 32 | group "profilePicture" with rectangle fill `btn/Neutral/bg-active`, radius remote `Full`; initials "AK" `text/secondary`: 2xl/Semi Bold, lg/Medium, sm/Medium, xs/Medium |
| Icon | 100 / 60 / 40 / 32 | frame fill `btn/Neutral/bg-active`, radius remote `Full`; "Icon/User" vector fill `bg/primary` (raw vector, not the local `user` icon) |
| Photo | 100 / 60 / 40 / 32 | frame with IMAGE fill + 1px `border/strong`, radius remote `Full` |

Visual: light grey circles with grey initials or white person glyph; photos have a thin grey ring. Dark mode: circles become gray-700 with a dark glyph.

## upload image
- Light `75:26917` key `1a9f6d93c119a0972d55b11f07668ff36d47e9c2` · Dark copy `75:26944` key `b228007a000b9da496a385756d026082131f64b0`
- `Property 1` = Default | uploaded | error · 105x104
- 100px circle (as Avatar Icon type; `uploaded` adds an IMAGE fill) + "Action Buttons" 32px circle `btn/Primary/bg 2`, radius/full, padding/gap bound to remote `Space 1` / `(Space 3)`, containing an "Edit Icon" vector (fill bg/primary; children bound to remote `Text/Links color`).
- error: 1px `border/error` on the circle. In dark the edit button becomes light blue (blue-300).

## Tooltip
- Light `75:26731` key `116916b411f17771952de554f043f82e00a88f7d` · Dark copy `75:26735` key `8911c35b3aa51fcd2f88cc6fc322b5cd11ef6afc`
- `Arrow` = up | down | left | right · `Size` = small | large
- small: content 69x40 ("Tooltips"); large: 320x72 (two-three lines, centered)
- Content frame: fill `bg/primary`, 1px `border/muted`, radius 8 (raw), padding 12 (raw); text 12 **Inter** Regular `text/primary`, no text style. Arrow vector 16x8 fill `bg/primary` in a "div" frame placed before/after content depending on direction. Effect style remote `Shadow/M`.
- Arrow semantics: `down` = arrow under the bubble (tooltip sits above the trigger); `up` = arrow on top (tooltip below the trigger); `left`/`right` = arrow on that side.

## Alerts (banners)
- Light `77:27906` key `d0e9f8ad43c26151a76d44ba0bcf3f3e20ee5fa4` · Dark copy `77:27907` key `f3ab8a56359a05df482517102d2a53e0b343bc9f`
- 4 variants, **all named `Property 1=Default`** (Figma property error). Order: info, warning, error, success.
- Frame 996x60, radius 8 (raw), padding 8/24/8/24 (raw), gap 16 (raw), horizontal.

| Variant | Fill | Border | Icon (32) | Title (16 Medium, remote style) | Message (14 Regular, remote style) |
|---|---|---|---|---|---|
| info | btn/Info/light | btn/Primary/border 2 | "Info Icon" text/info | text/info "Information" | btn/Info/text |
| warning | btn/warning/Light | btn/warning/border | "danger" triangle btn/warning/bg | btn/warning/bg "Warning" | btn/warning/text |
| error | btn/danger/light | border/error | "Info Icon" (exclamation circle) text/error | text/error "Error" | btn/danger/text |
| success | btn/success/light | btn/success/border | "Check Icon" btn/success/bg | btn/success/bg "Success" | btn/success/text |

Close: 24px "Close Icon" vector fill bg/inverse (children remote `Neutral/Grey 800`). Icons are vectors; child vectors bind remote `Charcoal`, `Text/Body text color`.

## badges
- Light `77:27864` key `b6292cef74f2f0cfcf3a63222356449d063b55e9` · Dark copy `77:27872` key `abd049304a9263c482a21cc526a018d236c7dd96`
- `Property 1` = info | warning | danger | Success · 24px tall · radius `radius/2xl` · padding 4/8 (raw) · gap 4 (raw)

| Variant | Fill | Border | Text (xs/Regular) | Icon (16, info glyph) |
|---|---|---|---|---|
| warning | btn/warning/Light | btn/warning/border | btn/warning/bg "Warning" | btn/warning/bg |
| danger | btn/danger/light | border/error | text/error "Error" | btn/danger/bg |
| Success | btn/success/light | btn/success/border | btn/success/bg "Success" | btn/success/bg |
| info | btn/Info/light | btn/Primary/border 2 | text/info "Badge" | text/info |

## Confirmation Popups
- Set `222:3717` key `71e7d56523eb723ba05499811e9cdabaabd2fbc4` (sits directly on the page, not in a showcase frame)
- `Property 1` = success (78:28060) | info (78:28070) | warning (78:28080) | danger (78:28090) · 443x276
- Card: fill remote `Backgrounds/Main Section`, 1px remote `Borders/Border Darker`, radius remote `L`, padding remote `Space 6`, gap remote `Buttons Padding`.
- Content (gap 16): icon badge 48px circle fill `btn/{status}/light`, radius remote `Full`, padding 8, containing a 32px icon (danger uses remote `trash Icon` instance); title "Main Text" `lg/Medium` text/primary; body `sm/Regular` text/secondary (gap 8).
- Actions (gap 16): `Button` Outline xs Default ("Button text") + `Button` Filled xs Default with fill overridden (danger: btn/danger/bg; warning: btn/warning/bg; success/info: primary blue).
- Close: local `Close Icon` instance 24px top-right.
