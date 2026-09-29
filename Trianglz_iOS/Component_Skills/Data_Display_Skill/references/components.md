# iOS Data Display - component reference (read 2026-09-29)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

| Set | Id | Page / doc frame | Structure (first variant) | Token totals on page |
|---|---|---|---|---|
| Status bar and Menu bar- iPad | 211:23 | ➜ Status Bars and Menu Bars / 211:210 | 1210x32, padding 0/16, remote `iPad - Leading Accessories` + Menubar slot (gap 966) + remote `iPad - Trailing Accessories` | 41 remote fills, 3 raw, 29 unstyled texts |
| Sheet - iPhone | 11:2450 | ➜ Bottom Sheets / 179:1418 | Detent Medium 402x874: `Overlay` instance (remote `Overlays/Default`) + `Sheet` 390x459 = remote `Liquid Glass - Regular - Medium` + `Content` slot (padding top 16) + `Grabber` (padding top 5) | 3 local, 23 remote, 22 raw fills; 17 raw effects |
| Overlay | 11:2446 | same | full-screen dim | |
| Grabber | 11:2447 | same | Mode Light/Dark | |
| Face ID | 11:2559 | ➜ Face ID / 179:1638 | 402x190 background blur; `Bezel` 151 radius 40 remote `Grays/Black` + drop shadow; Success checkmark = SF Symbol glyph "􀆅" raw #87fa89 42pt | 3 remote, 9 raw fills |
| Progress Bar - Determinate Linear | 11:2594 | ➜ Progress Indicators / 203:8539 (+ Light / Dark example sections on remote mode) | 402x44 padding 20/16 gap 3; label "Loading..." (hidden, remote Body/Regular); `Track` 370x4 remote `Fills/Primary` radius 100, `Filled` Brand Primary | 11 local, 49 remote fills; 13 remote text styles |
| Progress Bar - Indeterminate Circular ("Spinner") | 11:2639 | same | 8 rotated 2x4 rects remote `Labels/Secondary`; hidden label | |
| Activity View - iPhone / iPad | 203:9029 / 203:9036 | ➜ Activity Views / 203:9869 | Mode Dark/Light; built from `_Activity View` (Show Grabber, Action Group 1/2 slots), `_Header` (Title, Subtitle, Show Subtitle, Show Menu, Secondary Menu, Show Close), `_Action` / `_Actions` (Action, Symbol), `_Contact` (names, People 1/2), `_Close Button`, `_Separator`, `_Button - Liquid Glass` (Label, Symbol, Show Symbol) | 310 remote, 70 raw fills; 199 unstyled texts |
| Context Menu | 203:10473 | ➜ Contextual Menus / 203:10726 | `Content Area` 351x161 remote `Backgrounds/Primary - Elevated` radius 30 drop shadow + remote `Menu (Mode=Light)` instance 250x278 | 161 remote, 16 raw fills; 136 unstyled texts |

Loose instance `Overlay` (203:9088) sits on ➜ Activity Views outside any frame.
