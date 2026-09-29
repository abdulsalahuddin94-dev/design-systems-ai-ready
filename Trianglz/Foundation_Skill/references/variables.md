# Trianglz Web DS - all local variables (read 2026-09-29)

> **Superseded for values:** exact values, modes and aliases now live in `../../data/tokens.json` (pulled from Figma). This file keeps the study notes; if they differ, trust tokens.json. (Web: tokens.json was built from this file and still needs a Figma re-sync.)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

No variable has code syntax set. Primitives have no scopes (hidden from pickers).

## Primitives (1 mode "Value")
- black and white/white #ffffff · black and white/black #000000
- gray: 0 #fafafa · 50 #f9fafb · 100 #f3f4f6 · 200 #e5e7eb · 300 #d1d5db · 400 #9ca3af · 500 #6b7280 · 600 #4b5563 · 700 #374151 · 800 #0b1017 · 900 #020810 · 950 #020713
- blue: 0 #eff9ff · 50 #eff6ff · 100 #dbeafe · 200 #bfdbfe · 300 #93c5fd · 400 #60a5fa · 500 #3b82f6 · 600 #2563eb · 700 #1d4ed8 · 800 #1e40af · 900 #1e3a8a · 950 #172554
- red: 0 #fff5f5 · 50 #fef2f2 · 100 #fee2e2 · 200 #fecaca · 300 #fca5a5 · 400 #f87171 · 500 #ef4444 · 600 #dc2626 · 700 #b91c1c · 800 #991b1b · 900 #7f1d1d · 950 #450a0a
- yellow: 0 #fffef5 · 50 #fffbeb · 100 #fef3c7 · 200 #fde68a · 300 #fcd34d · 400 #fbbf24 · 500 #f59e0b · 600 #d97706 · 700 #b45309 · 800 #92400e · 900 #78350f · 950 #451a03
- green: 0 #f0fff4 · 50 #f0fdf4 · 100 #dcfce7 · 200 #bbf7d0 · 300 #86efac · 400 #4ade80 · 500 #22c55e · 600 #16a34a · 700 #15803d · 800 #166534 · 900 #14532d · 950 #032712
- purple: 0 #faf0ff · 50 #faf5ff · 100 #f3e8ff · 200 #e9d5ff · 300 #d8b4fe · 400 #c084fc · 500 #a855f7 · 600 #9333ea · 700 #7c3aed · 800 #6d28d9 · 900 #581c87 · 950 #3b0764
- Orange: 0 #fffcf9 · 50 #fff7ed · 100 #ffedd5 · 200 #fed7aa · 300 #fdba74 · 400 #fb923c · 500 #f97316 · 600 #ea580c · 700 #c2410c · 800 #9a3412 · 900 #7c2d12 · 950 #431407

Note: gray/800-950 are much darker than Tailwind (Tailwind gray-800 #1f2937, 900 #111827). Purple is not used by any Semantic token.

## Semantic (Light / Dark)
| Variable | Light | Dark | Scopes |
|---|---|---|---|
| color/text/primary | gray/900 | gray/50 | TEXT_FILL |
| color/text/secondary | gray/600 | gray/400 | TEXT_FILL |
| color/text/muted | gray/400 | gray/500 | TEXT_FILL |
| color/text/disabled | gray/300 | gray/600 | TEXT_FILL |
| color/text/inverse | white | gray/900 | TEXT_FILL |
| color/text/placeholder | gray/400 | gray/500 | TEXT_FILL |
| color/text/error | red/600 | red/400 | TEXT_FILL |
| color/text/warning | yellow/600 | yellow/300 | TEXT_FILL |
| color/text/success | green/600 | green/400 | TEXT_FILL |
| color/text/info | blue/600 | blue/400 | TEXT_FILL |
| color/text/link | blue/600 | blue/400 | TEXT_FILL |
| color/text/link-hover | blue/700 | blue/300 | TEXT_FILL |
| color/bg/primary | white | gray/950 | FRAME_FILL, SHAPE_FILL |
| color/bg/secondary | gray/50 | gray/800 | FRAME_FILL, SHAPE_FILL |
| color/bg/muted | gray/100 | gray/700 | FRAME_FILL, SHAPE_FILL |
| color/bg/subtle | gray/200 | gray/800 | FRAME_FILL, SHAPE_FILL |
| color/bg/inverse | gray/900 | gray/50 | FRAME_FILL, SHAPE_FILL |
| color/bg/error | red/50 | red/950 | FRAME_FILL, SHAPE_FILL |
| color/bg/warning | yellow/50 | yellow/950 | FRAME_FILL, SHAPE_FILL |
| color/bg/success | green/50 | green/950 | FRAME_FILL, SHAPE_FILL |
| color/bg/info | blue/50 | blue/950 | FRAME_FILL, SHAPE_FILL |
| color/bg/overlay | gray/900 | gray/950 | FRAME_FILL, SHAPE_FILL (opaque, no alpha) |
| color/border/default | gray/200 | gray/700 | STROKE_COLOR |
| color/border/muted | gray/100 | gray/800 | STROKE_COLOR |
| color/border/strong | gray/300 | gray/600 | STROKE_COLOR |
| color/border/inverse | gray/700 | gray/300 | STROKE_COLOR |
| color/border/focus | blue/500 | blue/400 | STROKE_COLOR |
| color/border/error | red/500 | red/500 | STROKE_COLOR |
| color/border/success | green/500 | green/500 | STROKE_COLOR |
| color/border/warning | yellow/500 | yellow/500 | STROKE_COLOR |
| color/border/Dark | gray/800 | gray/100 | ALL_SCOPES |
| color/btn/Primary/bg 2 | blue/600 | blue/300 | FRAME_FILL, SHAPE_FILL |
| color/btn/Primary/Light | blue/100 | blue/50 | FRAME_FILL, SHAPE_FILL |
| color/btn/Primary/text 2 | gray/0 | gray/900 | TEXT_FILL |
| color/btn/Primary/border 2 | blue/600 | blue/300 | STROKE_COLOR |
| color/btn/Primary/bg-hover 2 | blue/700 | blue/400 | FRAME_FILL, SHAPE_FILL |
| color/btn/Primary/bg-active 2 | blue/800 | blue/500 | FRAME_FILL, SHAPE_FILL |
| color/btn/secondary/bg | white | gray/800 | FRAME_FILL, SHAPE_FILL |
| color/btn/secondary/text | gray/700 | gray/200 | TEXT_FILL |
| color/btn/secondary/border | gray/300 | gray/600 | STROKE_COLOR |
| color/btn/secondary/bg-hover | gray/50 | gray/700 | FRAME_FILL, SHAPE_FILL |
| color/btn/secondary/bg-active | gray/100 | gray/600 | FRAME_FILL, SHAPE_FILL |
| color/btn/Info/bg · border | blue/600 | blue/500 | fill · stroke |
| color/btn/Info/text | blue/900 | blue/300 | TEXT_FILL |
| color/btn/Info/bg-hover · bg-active | blue/700 · blue/800 | blue/400 · blue/300 | fill |
| color/btn/Info/light | blue/50 | blue/950 | ALL_SCOPES |
| color/btn/danger/bg · border | red/600 | red/600 | fill · stroke |
| color/btn/danger/text | red/900 | red/200 | TEXT_FILL |
| color/btn/danger/bg-hover · bg-active | red/700 · red/800 | red/500 · red/400 | fill |
| color/btn/danger/light | red/50 | red/950 | ALL_SCOPES |
| color/btn/success/bg · border | green/600 | green/600 | fill · stroke |
| color/btn/success/text | green/900 | green/200 | TEXT_FILL |
| color/btn/success/bg-hover · bg-active | green/700 · green/800 | green/500 · green/400 | fill |
| color/btn/success/light | green/50 | green/950 | ALL_SCOPES |
| color/btn/warning/bg · border | yellow/500 | yellow/500 | fill · stroke |
| color/btn/warning/text | yellow/900 | yellow/300 | TEXT_FILL |
| color/btn/warning/bg-hover · bg-active | yellow/600 · yellow/700 | yellow/400 · yellow/300 | fill |
| color/btn/warning/Light | yellow/50 | Orange/950 | ALL_SCOPES |
| color/btn/Neutral/text | gray/600 | gray/300 | TEXT_FILL |
| color/btn/Neutral/bg-hover | gray/100 | gray/800 | fill |
| color/btn/Neutral/bg-active | gray/200 | gray/700 | fill |

Note: `btn/{Info,danger,success,warning}/text` are the dark 900 shades (for text on the `light` tint), not the text on a solid button (use `text/inverse` or `btn/Primary/text 2` there).

## Typography (Desktop / iPad / Mobile)
| Variable | Desktop | iPad | Mobile | Scopes |
|---|---|---|---|---|
| font-size/xs | 12 | 12 | 12 | FONT_SIZE |
| font-size/sm | 14 | 12 | 12 | FONT_SIZE |
| font-size/base | 16 | 14 | 14 | FONT_SIZE |
| font-size/lg | 18 | 16 | 16 | FONT_SIZE |
| font-size/xl | 20 | 18 | 18 | FONT_SIZE |
| font-size/2xl | 24 | 22 | 20 | FONT_SIZE |
| font-size/3xl | 28 | 24 | 24 | FONT_SIZE |
| font-size/4xl | 32 | 28 | 28 | FONT_SIZE |
| font-size/5xl | 40 | 36 | 32 | FONT_SIZE |
| font-size/6xl | 48 | 44 | 40 | FONT_SIZE |
| line-height/xs | 16 | 16 | 16 | none |
| line-height/sm | 20 | 18 | 18 | none |
| line-height/base | 24 | 22 | 20 | none |
| line-height/lg | 28 | 26 | 24 | none |
| line-height/xl | 28 | 26 | 26 | none |
| line-height/2xl | 32 | 30 | 28 | none |
| line-height/3xl | 36 | 34 | 32 | none |
| line-height/4xl | 40 | 38 | 36 | none |
| line-height/5xl | 48 | 44 | 40 | none |
| line-height/6xl | 60 | 56 | 48 | none |
| letter-spacing/tighter · tight · normal · wide · wider · widest | -0.8 · -0.4 · 0 · 0.4 · 0.8 · 1.6 | same | same | none |
| Font Family/Font Family | Poppins | | | ALL_SCOPES |
| Font weight/Bold · Semi-Bold · Medium · Regular · Light | Bold · SemiBold · Medium · Regular · Light | | | ALL_SCOPES |

## Spacing (Desktop / iPad / Mobile), scopes WIDTH_HEIGHT + GAP
space/0 0/0/0 · 1 4/4/4 · 2 8/8/8 · 3 12/12/12 · 4 16/16/16 · 5 20/20/16 · 6 24/22/18 · 7 28/26/22 · 8 32/28/24 · 9 36/32/26 · 10 40/36/28 · 11 44/40/32 · 12 48/44/32 · 14 56/48/36 · 16 64/52/40 · 20 80/64/48 · 24 96/76/56 · 28 112/88/64 · 32 128/96/72 · 36 144/112/80 · 40 160/120/88 · 48 192/144/96 · 56 224/168/104 · 64 256/192/112

## Radius (1 mode), scope CORNER_RADIUS
none 0 · sm 2 · base 4 · md 6 · lg 8 · xl 12 · 2xl 16 · 3xl 24 · full 9999 (each has a usage description)
