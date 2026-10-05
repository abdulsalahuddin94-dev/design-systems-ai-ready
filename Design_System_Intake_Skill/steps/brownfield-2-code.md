# Brownfield type 2: live product, no Figma

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load when 2.2 = 2. Also load figma-files.md and screens.md.

## 6. Step 5 - Brownfield type 2: live product, no Figma

1. Ask, typed: "Please share the GitHub repository link and/or the local code path of the product."
2. **Extract tokens from the code first**: `tailwind.config.*`, CSS variables, theme files (`theme.ts`, `colors.ts`, SCSS variables), iOS `Assets.xcassets` / Color and Font extensions, Android `colors.xml`, `themes.xml`, `Theme.kt` / `Color.kt` / `Type.kt`, Flutter `ThemeData`. Also list the existing components and screens / routes grouped by module. Save to `[Project folder]\Inputs\Extracted_Tokens.md` and `Inputs\Code_Inventory.md`.
3. Show the merge summary of near-duplicates and ask the same Ask (choice) as type 1, step 3. If the code has no tokens, ask for screenshots of the live product and extract from them.
4. Ask, typed: "Please create two Figma design files in the same Figma project folder: '<Project>' (screens) and '<Project> Design System' (library). Send me both links." Register both in `status.json > figma` (section 7c).
5. **Build the full DS** per the platform Main Skill, matching the code token names where they are sensible (and noting the mapping for Code Connect).
6. Ask the user to publish the library and enable it in '<Project>', then Ask (choice): "Done" / "Not yet".
7. **Rebuild the screens** in '<Project>', **one page per module** (e.g. `Auth`, `Dashboard`, `Settings`), assembled only from DS components and variables. Then offer figma-code-connect mapping, Ask (choice): "Map to code now" / "Later".
