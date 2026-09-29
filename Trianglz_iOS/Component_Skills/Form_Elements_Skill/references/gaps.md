# iOS Form Elements - gaps (2026-09-29, read-only)

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

1. **High** - Missing components: dropdown/select (page name promises it), text area, secure field variant, OTP, stepper, segmented control, slider, wheel picker, search field as a Trianglz component.
2. **High** - Toggle, Date pickers, Toolbars and Search are Apple-kit copies bound to remote Apple variables/text styles, with `Mode=Light|Dark` variants instead of variable modes; raw glass effects.
3. **High** - Toolbars (navigation bar, bottom toolbar) are navigation organisms placed in ⭐Form Elements; by the routing rule they belong in ⭐Navigation.
4. **Med** - Input: radius bound to a spacing variable (`spacnig/sm`); inner wrapper uses remote Web tokens `p_0` / `rounded_none`; `State=filled` lowercase; emoji property names (`🎲 Type`, `🎚️ State`, `📏 Size`, `✏️ Title`) - readable in Figma but awkward for code mapping; no description; no Success or Pressed state; Disabled uses Backgrounds/Group with no opacity token.
5. **Med** - Checkbox/Radio: raw padding, gap and radius; check/dash are drawn vectors (not Icon instances); `Status4` and `disabled (selected)` naming; no Pressed/Focused/Error; Radio disabled-selected label is not dimmed; duplicate RadioButton set on the Checkbox page; doc frames named "Text Fields".
6. **Med** - Checkbox/Radio are non-native on iOS; document when to use list checkmarks instead.
7. **Med** - Touch targets: checkbox/radio 20pt with no 44pt hit area; Input md 45pt ok.
8. **Low** - No component descriptions (Date pickers carry Apple's placeholder description).
9. **Screenshots** - not captured: Figma export hung (see Foundation gaps #22). Capture all variants, Light + Dark (Input Light/Dark frames 2006:772 / 2006:779 exist).
