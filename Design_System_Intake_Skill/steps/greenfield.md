# Greenfield path

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load when 2.1 = Greenfield.

## 4. Step 3 - Greenfield

### 3a. Existing AI-ready DS
Question 3.1: "Do you already have an AI-ready design system for this project, meaning a Figma DS file plus .md / skill files? Yes / No / Start from a Trianglz template (Web/iOS/Android)"
- **Yes** -> ask "Please share the DS Figma link and the path to the skill files." Then:
  1. Read the skill files (Foundation_Skill, Component_Skills) and the DS file (⭐Setup first, then component groups; screenshot every variant light and dark).
  2. Run a **quick audit** (audit-design-system): remote variables/styles, raw values, unbound tokens, missing states, bad names, dead properties, missing descriptions. Compare against the platform Main Skill section 9 and 10.
  3. Report findings in a short list and ask: "The DS passed / has N issues. Fix the issues first (recommended) / Work from it as it is"
  4. Run **Fix on create** (section 7b) on it, then work from the fixed DS. Skip to the checkpoint that matches what is missing.
- **Start from a Trianglz template** -> 3a-2.
- **No** -> 3b.

### 3a-2. Start from a Trianglz template
Templates are listed in `References.md` in the Root (Web, iOS, Android). Use the template of the platform chosen in Step 1 only.
1. Ask: "Please open the Trianglz <Platform> template from References.md, duplicate it into your own Figma workspace (Duplicate to your drafts, then move it to the project folder), rename it '<Project> Design System', and send me the link."
2. Load the platform's Trianglz skills (`Trianglz/`, `Trianglz_iOS/` or `Trianglz_Android/`: Foundation_Skill first, then the component skills) as the map of what is in the file.
3. **Node IDs change in a duplicate.** Find every page, component set, style and variable by **name**, never by the ids written in those skills (they belong to the original file only).
4. Run the brand steps 3b and 3c to get the project's colors, fonts and direction, then rebrand the copy: update Primitives and Semantics, fonts, radius and spacing per the direction.
5. Run **Fix on create** (section 7b) on the copy: token fixes with `tools/fix_tokens.py`, then the component gaps from each skill's `references/gaps.md` and the platform Main Skill section 9. Then continue with 3d from the first missing layer.

### 3b. Colors from the brand folder
Look in `[Project folder]\Inputs\Brand\` (PDF brand book, logo, images, mood board).
- Files found -> extract brand colors (dominant + accent + neutrals), build hue ramps 50-950 around each, map to Semantics per the platform naming, check contrast (text >= 4.5:1, UI >= 3:1, Light and Dark). Show the palette and the Semantic mapping for approval.
- Folder empty -> Question 3.3: "I found no brand files. What is the primary / brand color (hex)? Add a secondary color too if you have one."
  If the user has none, ask: "Should I propose a palette based on the industry? Yes / No"
- **Brand contrast pre-check (right after the brand color is known):** run `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <modes> --check-only` (or `ds_color.contrast`) and show the brand color against white, black and each mode's base surface. It decides how every filled button looks: e.g. `#299B48` + white text = 3.57:1, fails 4.5:1, so filled buttons need dark text or a darker brand step. Put the result and the chosen fix in the Intake Summary's Direction line.

### 3c. Design direction from the inspiration folder
Look in `[Project folder]\Inputs\Inspiration\` (screenshots, links, Dribbble shots, competitor apps).
Derive and write down: corner style (sharp 0-4 / soft 6-12 / rounded 16+ / pill), density (compact / comfortable / spacious), elevation (flat / subtle shadows / layered), border use, type personality (geometric / humanist / grotesk), icon weight (outline / filled, stroke 1.5 / 2), imagery and illustration style.
- Folder empty -> Question 3.4: "I found no inspiration files. Which industry is the product in? (e.g. fintech, healthcare, e-commerce, education, government, SaaS)"
  Derive a style from the industry (use ui-ux-pro-max and Impeccable for the direction; avoid generic AI-looking UI). From ui-ux-pro-max take only the **style**, the **anti-patterns** and the **color mood** (e.g. a dark-palette hint); ignore its landing-page patterns (hero, scroll journeys, CTA placement) and its font pairing. Intake answers always win: fonts (0.6), modes (0.4), brand color (3.3) and RTL (0.5) are never overridden by a skill's suggestion.
  Do not ask for a separate approval: the direction goes into the Intake Summary (section 9), which is approved once.

### 3d. Build
**Which Figma file:** use the connected file if the user confirmed it at 0.2 as this project's DS file and it is empty; otherwise ask: "Please create a new Figma design file named '<Project> Design System' and send me its link." Register it in `status.json > figma.design_system`. A plugin cannot rename a file: if the connected file has another name, add "Rename the file to '<Project> Design System'" to the user's to-do list at the Foundation checkpoint.
**Foundation generator:** `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <Light,Dark | Light | Dark>` writes `data/source/foundation-spec.json` (ramps from the brand color with stored curves, the Semantic mapping per mode, the paired-token check and every contrast pair). Fix every failure it prints (re-point the Semantic alias to another step), then build the Primitives and Semantics in Figma from the spec.
Follow the platform Main Skill build order exactly:
1. Primitives -> 2. Semantics (Light / Dark) -> 3. Spacing, Radius, Typography variables -> 4. Text and effect styles -> 5. Icons -> 6. Components: Atoms -> Molecules -> Organisms -> Patterns -> 7. Linked documentation pages -> 8. Audit + project skills.
Before each component: state its tier, post its atomic structure map, check dependencies exist, build missing lower tiers first.
Colors are built **recolor-ready** (platform Main Skill section 3b): full shade scales generated from one base color with a stored curve, Semantic tokens only alias Primitives, so a later color change regenerates every shade and everything follows.
