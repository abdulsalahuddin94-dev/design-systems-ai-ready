# iOS Data Display - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli, checked against the Light/Dark screenshots in `screens/`. `R:` = remote Apple iOS 26 UI Kit variable/style/component. Find nodes by name, never by id.

## Sheet - iPhone
| Detent | Surface | Notes |
|---|---|---|
| Medium | R:`Liquid Glass - Regular - Medium`, 390 wide (floating, 6pt side inset), 459 high | dimming `Overlay` R:`Overlays/Default` 20% |
| Large | R:`Backgrounds/Primary - Elevated`, full width 402x812 | same dimming |
| Large (Stacked) | sheet 402x802 over a 370-wide `Background Page` (R:`Backgrounds/Primary`) dimmed with raw black 10% | presented over another sheet |
Each has a **remote** `Toolbar - Top - iPhone` header (the local set exists in ⭐Form Elements) and a `Grabber` 58x4 R:`Fills - Vibrant/Primary`. `Grabber` Light/Dark variants bind the same variable.

## Progress
- `Progress Bar - Determinate Linear` (402x44): track 370x4 R:`Fills/Primary` 20%, fill `Brand Primary` (local), radius full; Value 0% still draws a 6pt stub; `Show Label` adds a label.
- `Progress Bar - Indeterminate Circular ("Spinner")`: 8 ticks R:`Labels/Secondary` 60% at opacity 100 -> 15%; Small 2x4 ticks, Regular 3x7, Large 5x13 (default Large). Not tinted.

## Context Menu
`Content Area` preview (351x160, R:`Backgrounds/Primary - Elevated`, radius 30, placeholder text raw black 60% R:`Body/Regular`) + a remote `Menu` (250x278). 4 variants = Alignment Vertical / Horizontal (iPad only) x Side Leading / Trailing.

## Face ID
Bezel 151pt R:`Grays/Black` radius 40; Authenticating = raw `#87fa89` Face ID vectors; Success = 4.5pt `#87fa89` ring + checkmark glyph. System HUD, mock only.

## Activity View (share sheet)
- iPhone: R:`Backgrounds/Primary - Elevated` sheet holding `_Activity View`; iPad: R:`Popovers (iPad Only)` with R:`Popover Corner Radius`.
- `_Header`: 64pt thumbnail (radius 16, raw black 15% hairline), title/subtitle R:`Labels - Vibrant/*`, `_Button - Liquid Glass` options menu, `_Close Button` (a **remote** `_Buttons - Top`).
- `_Contact` (people row, 70pt avatars, R:`_System Icons` app badge), `_Action` (66pt R:`Fills - Vibrant/Tertiary` circle + SF glyph + name), `_Actions` (list rows with glyph + R:`Body/Regular` + R:`_Separator`).

## Status bar and Menu bar - iPad
1210x32, 4 variants (Full Screen x Menu Expanded; `Background` only Light): R:`iPad - Leading/Trailing Accessories`, R:`_Menu bar item`s; window controls raw red/yellow/green. No iPhone status bar exists.
