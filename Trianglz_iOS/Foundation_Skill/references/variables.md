# Trianglz iOS DS - variables (read 2026-09-29, Figma file q5nQHGEGzZ94WN0wilJwLW)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

6 local collections. No variable has code syntax. Only `Color / Semantic` has descriptions.

| Collection | Id | Modes | Vars | Scopes |
|---|---|---|---|---|
| `Typography ` (trailing space) | 1:133 | Value | 30 | per type (FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, FONT_STYLE) |
| `Spacing` | 7:645 | Mode 1 | 8 | GAP only |
| `Color / Primitive` | 14:327 | Light, Dark (**identical values**) | 83 | none (hidden from pickers) |
| `Color / Semantic` | 18:605 | Light (18:3), Dark (47:3) | 39 | set per role |
| `Color / Brand` | 18:606 | Light, Dark (identical) | 2 | ALL_SCOPES |
| `Raduis` (typo) | 233:57 | Mode 1 | 8 | CORNER_RADIUS |

## Typography (1 mode)
| Token (Apple text style) | Font Size | Leading |
|---|---|---|
| Large-title | 34 | 41 |
| Title-1 | 28 | 34 |
| Title-2 | 22 | 28 |
| Title-3 | 20 | 25 |
| Headline | 17 | 22 |
| Body | 17 | 22 |
| Callout | 16 | 21 |
| Subheadline | 15 | 20 |
| Footnote | 13 | 18 |
| Caption-1 | 12 | 16 |
| Caption-2 | 10 | 12 |

Names: `Font Size/<Style>`, `Leading (Line Height)/<Style>`, `Font Family/Font Family` = "SF Pro",
`Font Weight/{Regular, Regular-italic, Medium, Medium-italic, Semibold, Semibold-italic, Bold}`.
No letter-spacing (tracking) variables locally: text styles bind tracking to a **remote** variable. No Dynamic Type modes (xSmall ... AX5).
Values match Apple HIG "Large" (default) Dynamic Type size exactly.

## Spacing (1 mode) - name typo `spacnig/`
| Token | Value | Docs page says |
|---|---|---|
| spacnig/xxs | 4 | spacing/xxs 4pt |
| spacnig/xs | 8 | 8pt |
| spacnig/sm | 12 | 12pt |
| spacnig/md | 16 | 16pt |
| spacnig/lg | 24 | 24pt |
| spacnig/xl | 32 | 32pt |
| spacnig/xxl | **40** | **48pt** (mismatch) |
| spacnig/margin | 16 | 16pt standard screen margin (bound to the grid style offset) |
Scope GAP only (no WIDTH_HEIGHT), but components bind padding to it too.

## Radius (collection `Raduis`, 1 mode)
None 0 · XS 4 · S 8 · Md 12 · Lg 16 · XL 20 · XXL 24 · Full **99** (docs page says 999). Names mix case (`Md`, `Lg` vs `XS`, `XL`).

## Color / Primitive (83, both modes identical)
- `⭐ Brand Palette/Primary Blue/Primary Blue 100..900` (Tailwind blue: 100 #dbeafe, 400 #60a5fa, **500 #3b82f6**, 600 #2563eb, 900 #1e3a8a). Names 200-900 contain a **double space** ("Primary Blue  500").
- `⭐ Brand Palette/Secondary Indigo/Secondary Indigo 100..900` (Tailwind indigo, 500 #6366f1).
- `Neutral/Gray/Gray 100..900` = Apple system grays: 100 #f2f2f7 (systemGray6), 200 #e5e5ea (Gray5), 300 #d1d1d6 (Gray4), 400 #c7c7cc (Gray3), 500 #aeaeb2 (Gray2), 600 #8e8e93 (systemGray), 700 #636366, 800 #48484a, 900 #1c1c1e. `Neutral/White/white`, `Neutral/Black/Black`.
- Hue ramps 100..900 whose **500 = Apple system color**: Blue 500 #007aff, Green 500 #34c759, Red 500 #ff3b30, Orange 500 #ff9500, Yellow 500 #ffcc00, Purple 500 #af52de. Other steps are derived tints/shades.
- No 50/950 steps, no alpha primitives (no scrim).

## Color / Brand (2)
`Brand Primary` -> Primary Blue 500 (#3b82f6), `Brand  secondary` (double space, lowercase) -> Secondary Indigo 500. Same in Light and Dark. ALL_SCOPES.

## Color / Semantic (39, Light | Dark)
| Token | Light | Dark | Scope |
|---|---|---|---|
| Text/Primary Text | Gray 900 | Gray 100 | TEXT_FILL |
| Text/Secondary Text | Gray 700 | Gray 300 | TEXT_FILL |
| Text/Tertiary Text | Gray 500 | Gray 500 | TEXT_FILL |
| Text/Placeholder | Gray 500 | Gray 400 | TEXT_FILL |
| Text/Disabled Text | Gray 400 | Gray 600 | TEXT_FILL |
| Text/Link Text | Brand Primary | Brand Primary | TEXT_FILL |
| Text/On Brand Text | white | white | TEXT_FILL |
| Backgrounds/App | Gray 100 | Gray 900 | FRAME+SHAPE |
| Backgrounds/Card | white | Gray 800 | FRAME+SHAPE |
| Backgrounds/Group | Gray 200 | Gray 700 | FRAME+SHAPE |
| Backgrounds/Modal | white | Gray 800 | FRAME+SHAPE |
| Backgrounds/Brand | Brand Primary | Brand Primary | FRAME+SHAPE |
| Borders/Default | Gray 300 | Gray 600 | FRAME+SHAPE+STROKE |
| Borders/Strong | Gray 400 | Gray 500 | FRAME+SHAPE+STROKE |
| Borders/Focus | Primary Blue 400 | Primary Blue 400 | FRAME+SHAPE+STROKE |
| Borders/Disabled | Gray 200 | Gray 700 | FRAME+SHAPE+STROKE |
| Borders/Brand | Brand Primary | Brand Primary | FRAME+SHAPE+STROKE |
| Icon/Primary | Gray 700 | Gray 200 | FRAME+SHAPE+STROKE |
| Icon/Secondary | Gray 600 | Gray 400 | FRAME+SHAPE+STROKE |
| Icon/Tertiary | Gray 500 | Gray 500 | FRAME+SHAPE+STROKE |
| Icon/Disabled | Gray 400 | Gray 600 | FRAME+SHAPE+STROKE |
| Icon/Brand | Brand Primary | Brand Primary | FRAME+SHAPE+STROKE |
| Icon/On Brand | white | white | FRAME+SHAPE+STROKE |
| Status/Info/info Text · Background · Border · Icon | Blue 600 · 100 · 500 · 600 | Blue 300 · 700 · 500 · 400 | TEXT / FILL / STROKE / FILL |
| Status/Success/Success Text · Background · Border · Icon | Green 600 · 100 · 500 · 600 | Green 300 · 700 · 500 · 400 | same |
| Status/Warning/Warning Text · Background · Border · Icon | Orange 600 · 100 · 500 · 600 | Orange 300 · 700 · 500 · 400 | same |
| Status/Danger/Danger Text · Background · Border · Icon | Red 600 · 100 · 500 · 600 | Red 300 · 700 · 500 · 400 | same |

Missing vs Apple semantic set: separator (opaque / non-opaque), fill (systemFill 1-4), grouped backgrounds (systemGroupedBackground / secondary / tertiary), elevated backgrounds, quaternary label, overlay/scrim, tint. Components copied from the Apple kit still use the **remote** Apple variables for these (see gaps).

## Text styles (22 local, `{Apple style}/{Regular|Emphasized}`)
Large Title, Title1, Title2, Title3, Headline, Body, Callout, Subheadline, Footnote, Caption1, Caption2 x Regular / Emphasized.
Emphasized = Bold for Large Title/Title1/Title2, Semibold for the rest (matches Apple). `Headline/Regular` is Semibold (Apple: Headline is always semibold, so Regular and Emphasized are identical).
Tracking (Apple values): LT +0.40, T1 +0.38, T2 -0.26, T3 -0.45, Headline/Body -0.43, Callout -0.31, Subheadline -0.23, Footnote -0.08, Caption1 0, Caption2 +0.06.
Bindings: font size, weight, family, line height -> local Typography vars; **letter spacing -> remote variable** on 19 of 22 styles (Large Title Regular/Emphasized and Caption2/Regular unbound). `Title1/Emphasized` has no font-family binding.

## Other styles
- Effect styles: **none** (shadows/glass are raw effects inside components).
- Grid styles: `Layout Grid` = 4 columns, stretch, margin 16 (bound to `spacnig/margin`), gutter 12.
- Color styles: none.
