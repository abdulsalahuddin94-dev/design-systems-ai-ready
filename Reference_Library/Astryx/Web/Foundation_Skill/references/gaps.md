# Foundation - audit gaps (2026-10-06, read-only, FigCli scripts + Light screenshots + computed Dark contrast)

> **Node IDs:** none are stored here. Find everything by name. Fix these in a project copy (Fix on create), never in the original.

Measured against `Web_Design_System_Skill` (sections 3, 4, 9, 10). High = breaks a rule or accessibility; Med = slows AI or humans; Low = naming / polish.

## Tokens
1. **High - No Primitive tier.** `Color` holds 216 raw hex values (108 variables x 2 modes); no semantic aliases anything (`tokens.json > recolor_readiness.ready = false`). A brand recolor means editing hex by hand. The code has an OKLCH palette (stops 0-100 by 5, dark chroma taper) that Figma does not carry. Fix: Primitives from the code palette, Semantics aliasing them.
2. **High - Every color variable has ALL_SCOPES**, so the picker offers text colors for fills and so on. Spacing, Size, Radius and Typography do have correct scopes.
3. **High - Contrast at token level (Neutral Light / Dark):**
   - `Border/Emphasized` (input, checkbox and select borders) 1.48:1 on Surface (Light), 1.94:1 (Dark); needs 3:1.
   - `Text/Disabled` is used as **placeholder** text in the chat composer, tool-call targets and code line numbers: 2.52:1 Light, 1.94-2.2:1 Dark.
   - `Text/Secondary` on `Background Body` / `Background Muted` (#F1F1F1): 4.20:1 Light (passes on Surface, 4.74:1). Hits SegmentedControl, Toolbar, AppShell side nav, InputGroup addons, List selected rows.
   - `Component/Badge/Error Bg` + `On Vivid`: 4.14:1 Light.
   - Neutral `Badge` dot (`#E5E5E5`) 1.26:1 on white: invisible.
4. **Med - Component-specific tokens** (`Component/Badge/*`, `Component/ProgressBar/*`, `Component/Input Ring/*`, 16 variables) although our rules allow only Primitives + Semantics. Several are vivid hex not shared with Status (`#0074E2`, `#198100`, `#E33F4A`), so status blue/green/red exist twice with different values.
5. **Med - Duplicates and same-value roles:** `Core/Accent` = `Text/Accent` = `Icon/Accent`; `Core/Background Body` = `Background Muted`; `Surface/Card` = `Surface/Popover`; `Status/Success Muted` = `Green/Background`; `Status/Error Muted` = `Red/Background`; `Effects/Shadow` = `Elevation Shadow Strong`. Paired-state rule is fine for Overlay Hover / Pressed.
6. **Med - No descriptions and no code syntax on any variable** (0 of 166), though the code has exact names. AI agents cannot map Figma to StyleX tokens.
7. **Med - Radius names:** `Radius/None` = 4 (not 0); the Shape doc says "No rounding" for it. `Border Width` exists but 799 of 807 strokes are raw.
8. **Low - Naming mix:** `Spacing/half`, `Spacing/1-half`; `Font Size/4xs..5xl` lowercase vs Title Case groups; `Component/ProgressBar` (no space) vs `Component/Input Ring`.

## Themes (extended collections)
9. **Med - Theme Dark modes are not real dark palettes in places:** Butter Dark repeats Butter Light for 40 color roles (all hue families: light pastel backgrounds in Dark), Gothic has 88 roles identical in Light and Dark (a dark-only theme with no light variant), Y2K repeats 26 (status colors). 18 roles (Component/*, Elevation Shadow, Track, Error Inverted) are never overridden by any theme.
10. **Med - Theme fonts do nothing in Figma:** Typography extensions override only `Font Family/*`, which are CSS stacks no text style binds. Text keeps Figtree in every theme.

## Styles
11. **Med - Text styles bind size and line height only**, not family, weight or letter spacing (0 everywhere). Code style uses JetBrains Mono; the Foundation page says Menlo.
12. **Low - No grid styles** and no breakpoints documented (AppShell is 1000 px wide; templates mostly 1440).
13. **Low - Font Size/4xs 6 px and 3xs 7 px** exist (below any readable size); no style uses them.

## Icons
14. **Med - Icon color is not tokenized at the icon level** (the description says to override the fill on the instance). Only 3 INSTANCE_SWAP properties exist in the file; most icons inside components are fixed nested instances.
15. **Low - 1,694 icon components** with default `Vector` layer names (fine for icons, flagged by our default-name check).

## Docs pages
16. **Good:** the Foundation Color and Typography frames are linked (221 bound fills; samples use the text styles). Keep.
17. **Low - Doc frames use remote doc-template components** (`Document Header`, `Section Header`, `Banner`, `Types`, `Device`, tagged `#quality_disable`) from another library, and the About page uses old `XDS*` components (XDSButton, XDSBadge, XDSFieldLabel...). Leftover "XDS" naming also appears in Button, Badge and Icon descriptions.
