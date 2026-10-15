# iOS Navigation - states and tokens (verified 2026-10-01)

> Read-only trace of the live file through FigCli, checked against the Light/Dark screenshots in `screens/`. `R:` = remote Apple iOS 26 UI Kit variable/style/component. Find nodes by name, never by id.

## Tab bar
- `_Tab Bar Button - iPhone` (72x50): icon = local `Component 1` instance (24pt, `Property 1` Selected/Default) + label `Caption2/Emphasized`. Unselected: label `Text/Secondary Text`. Selected: 76x54 `Backgrounds/Group` pill, label `Brand Primary`, plus raw `#ffffff` 50% and a `Tint (Plus D)` layer filled `Brand Primary` (blend). The `Symbol` TEXT property is unused.
- `_Tab Bar Button - iPhone - Search` (54pt): local `Search Icon`; selected adds the `Backgrounds/Group` circle.
- `Tab Bar - iPhone`: tabs on R:`Liquid Glass - Regular - Small` (62pt high capsule, 188 / 274 / 360 wide for 2 / 3 / 4-5 tabs; tab width 92-93, 76 with 5 tabs). `Minimized=True` = one 48pt glass circle with the active tab. `Type=Search Role` and `Prominent Tab` both put a separate 62pt glass circle with the search tab on the trailing side (the two variants are built the same way).
- `Mode` variants use the same local variables in both modes; Dark comes from switching `Color / Semantic` on the frame.

## Buttons
| `Button - Content Area` Style | Container | Label + symbol |
|---|---|---|
| Bordered - Prominent | `Brand Primary` capsule (radius 1000) | `Text/On Brand Text` / `Icon/On Brand` |
| Bordered - Prominent, Destructive | R:`Accents/Red` | On Brand |
| Bordered | R:`Fills/Tertiary` 12% | `Brand Primary` |
| Borderless | none | `Brand Primary` |
| any, `Is Enabled=False` | R:`Fills/Tertiary` 12% (Borderless: none) | R:`Labels/Tertiary` 30% |
- Sizes: Small 28pt (R:`Subheadline/Regular`), Medium 34pt (R:`Subheadline/Regular`), Large 50pt (R:`Body/Regular`). Icon only = square/circle of the same height. Symbol = SF Symbol text glyph in the `Symbol` TEXT property ("􀊄").
- `Button - Liquid Glass - Text` (Small 28 / Medium 34 / Large 50) and `- Symbol` (50pt): R:`Liquid Glass - Regular - Small` background + `_Label - Text` / `_Label - Symbol - *`. Visual check (`screens/buttons-glass-over-light.png`): Glass Prominent = `Brand Primary` blue capsule with white label, Glass = neutral glass with dark label, Destructive = red fill (prominent) or red label (glass), Disabled = label 50%.
- `_Label - Text`: Preferred `Text/On Brand Text`, Default `Text/Primary Text`, Destructive `Status/Danger/Danger Text`; disabled = raw `#262626` at 50%.
- `_Label - Symbol - Preferred / Default / Destructive Default`: all three hold the local **`akar-icons:check`** icon (not an SF glyph), so every symbol glass button shows a checkmark until swapped; disabled 50%.

## Alerts and action sheets
- `Alert` (300 wide) on R:`Liquid Glass - Regular - Medium`: title R:`Labels/Primary` + local `Headline/Emphasized`, message R:`Labels/Primary` + local `Body/Regular`, optional `Text Field` (radius 26, 1 or 2 fields), `Actions` slot of `_Buttons` (48pt capsules; Side-by-Side 132 each, Stacked 272).
- `_Buttons` Role: Default = R:`Accents/Blue` capsule + R:`Grays/White` label `Body/Emphasized` (Apple blue, **not** Brand Primary); None / Cancel = R:`Fills/Secondary` 16% + R:`Labels/Primary`; Destructive = same grey capsule with a raw `#ff383c` label. Light/Dark variants differ only by a raw white 60% / black 67% overlay.
- `_Text Field Background`: R:`Fills/Secondary` 16% (Light) / R:`Fills/Tertiary` 12% (Dark), radius 26.
- `Action Sheet` (300x294, single component): title + message + stack of **remote** `_Buttons` instances.
