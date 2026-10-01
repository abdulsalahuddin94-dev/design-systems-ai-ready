# Foundation audit gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

## Status after fixes (2026-09-29)
**Fixed:** 1 (code syntax), 2 partially (line height bound; letter spacing only scoped), 3 partially (color/icon/* added; still no brand group), 5 (scopes), 12 partially, 13 (Typography page sizes corrected), 17 (focus-ring styles), 18, 19 (grid styles), 20-22 (icons renamed Icon/*, bound to color/icon/*, used by components).
**Also fixed:** 2 (letter spacing bound), 7 (bg/overlay is a 50%/70% scrim).
**Still open:** 4 (btn naming " 2" suffixes), 6, 8, 9 (no disabled/opacity token), 10, 11, 14, 15, 16 (shadow colors raw; binding effect colors made exports hang).

## Variables
1. **High** - No variable has **code syntax** (WEB) set, so Dev Mode / MCP can't give developers CSS or Tailwind names. Add e.g. `var(--color-text-primary)`.
2. **High** - Text styles don't bind **line height** or **letter spacing**: `line-height/*` and `letter-spacing/*` have no scopes, so they can't be bound. On iPad/Mobile the font shrinks but line height stays Desktop (sm 12px on 20px line). Give them scopes and bind them.
3. **High** - No **icon color** tokens (`color/icon/*`) and no **brand** group; brand lives in `btn/Primary/bg 2`.
4. **Med** - Naming: `btn/Primary/bg 2`, `text 2`, `border 2`, `bg-hover 2`, `bg-active 2` carry a " 2" suffix; case mixes `Primary/Info/Neutral` with `secondary/danger/success/warning`; `Light` vs `light`; `border/Dark` is a color name inside a role group. Primitives: `Orange` capitalised, `black and white` has spaces.
5. **Med** - Scopes: `border/Dark`, all `btn/*/light` and `btn/warning/Light` use ALL_SCOPES, so they show in every picker. `btn/Primary/Light` is fill-only while its siblings are ALL.
6. **Med** - `btn/warning/Light` Dark value is `Orange/950` while every other `light` uses its own hue's 950.
7. **Med** - `bg/overlay` is opaque gray/900 (no alpha); a scrim needs transparency (e.g. 50-60%).
8. **Med** - `btn/primary` has no `light` text pairing and there is no `text/on-primary` / `text/on-status` role; developers must guess text color on solid buttons.
9. **Med** - No disabled, opacity or focus-ring tokens; components hard-code 30-50% opacity and a raw 2px blue ring.
10. **Low** - Primitives are published (not hidden from publishing); consumers of the library will see them. Only scopes hide them.
11. **Low** - Primitive gray/800-950 deviate strongly from Tailwind values though names match Tailwind; say so in descriptions.
12. **Low** - No descriptions on Semantic, Typography or Spacing variables (Radius has them).

## Typography
13. **Med** - Documentation mismatch: the ➜ Typography page and style descriptions list 3xl 30px, 4xl 36px, 5xl 48px, 6xl 60px (Tailwind defaults), but the variables and styles are 28, 32, 40, 48. The ➜ Responsive Typography table shows the real values.
14. **Med** - Letter spacing per style (+0.2, -0.2, -0.6, -1, -1.2) doesn't match the letter-spacing variables (-0.8, -0.4, 0, 0.4, 0.8, 1.6).
15. **Low** - `Font weight/Light` variable exists with no styles; no italic styles.

## Effects
16. **Med** - Effect styles use raw black; no shadow color variable, so shadows don't adapt to Dark mode.
17. **Med** - No focus-ring effect style; components each draw it with raw values.
18. **Med** - Components don't use the local effect styles (raw copies of shadow-sm; a remote `Shadow/Elevation 1/E 1 Rest state` in OTP cells).

## Grid
19. **Med** - The grid is documentation only: there are no layout grid styles, so frames can't apply "Desktop 12-col" with one click. Create grid styles (12/80/24, 8/32/16, 4/16/16).

## Icons
20. **High** - The 39 icons are standalone components, not organised as a set or with a consistent naming scheme (`Add`, `left`, `Close Icon`, `close`, `Linear / Call / Phone Rounded`, ` Arrow Right` with a leading space, `Arrow Down ` with a trailing space).
21. **High** - Icon color is bound to `color/border/inverse` (a stroke role used as a fill); `Close Icon` uses `bg/inverse` + a remote `Neutral/Grey 800`; `Export` is raw #1c274c.
22. **Med** - Form, navigation and data components mostly redraw icons as vectors instead of using these components (see each component skill's gaps).
23. **Low** - No icon descriptions / keywords, one size only (24).
