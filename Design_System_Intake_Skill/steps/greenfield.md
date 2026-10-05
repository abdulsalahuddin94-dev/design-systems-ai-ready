# Greenfield path

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load when 2.1 = Greenfield. Every `Ask (choice)` / `Ask (multi)` here also gets a "Back" option (`SKILL.md` section 0, Back on every menu).

## 4. Step 3 - Greenfield

### 3a. Existing AI-ready DS
Question 3.1, Ask (choice): "Do you already have an AI-ready design system for this project?" "Yes" (description: a Figma DS file plus .md / skill files) / "No" (description: build a new one) / "Start from a reference template" (description: a studied design system from `references.json` for the chosen platform)
- **Yes** -> ask, typed: "Please share the DS Figma link and the path to the skill files." Then:
  1. Read the skill files (Foundation_Skill, Component_Skills) and the DS file (⭐Setup first, then component groups; screenshot every variant light and dark).
  2. Run a **quick audit** (audit-design-system): remote variables/styles, raw values, unbound tokens, missing states, bad names, dead properties, missing descriptions. Compare against the platform Main Skill section 9 and 10.
  3. Report findings in a short list ("The DS passed" or "The DS has N issues") and Ask (choice): "Fix the issues first (Recommended)" / "Work from it as it is"
  4. Run **Fix on create** (section 7b) on it, then work from the fixed DS. Skip to the checkpoint that matches what is missing.
- **Start from a reference template** -> 3a-2.
- **No** -> 3b.

### 3a-2. Start from a reference template
Reference design systems are listed in `references.json` in the Root (one entry per company and platform; human list in `References.md`). Offer only entries with `status: "ready"` whose `platform` matches Step 1 (`cross-platform` when 1.3 picked one shared design). If there are several, Ask (choice) with one option per entry, the platform's `default` entry first and marked (Recommended), each described by its `name`; with one entry, use it without asking.
1. Ask, typed: "Please open '<entry name>' (<entry figma_url>), duplicate it into your own Figma workspace (Duplicate to your drafts, then move it to the project folder), rename it '<Project> Design System', and send me the link."
2. Load the entry's study skills (its `folder`: Foundation_Skill first, then the component skills) as the map of what is in the file. Record the entry `id` in `Project_Brief.md` (3.1) and `status.json > reference`.
3. **Node IDs change in a duplicate.** Find every page, component set, style and variable by **name**, never by the ids written in those skills (they belong to the original file only).
4. Run the brand steps 3b and 3c to get the project's colors, fonts and direction, then rebrand the copy: update Primitives and Semantics, fonts, radius and spacing per the direction.
5. Run **Fix on create** (section 7b) on the copy: token fixes with `tools/fix_tokens.py`, then the component gaps from each skill's `references/gaps.md` and the platform Main Skill section 9. Then continue with 3d from the first missing layer.

### 3b. Colors from the brand folder
Look in `[Project folder]\Inputs\Brand\` (PDF brand book, logo, images, mood board).
- Files found -> extract brand colors (dominant + accent + neutrals), build hue ramps 50-950 around each, map to Semantics per the platform naming, check contrast (text >= 4.5:1, UI >= 3:1, Light and Dark). Show the palette and the Semantic mapping, then Ask (choice): "Approve (Recommended)" / "Request changes".
- Brand color already confirmed at 0.3c ("Use these") -> skip 3.3 and go to the contrast pre-check.
- Folder empty -> Question 3.3, typed: "I found no brand files. What is the primary / brand color (hex)? Add a secondary color too if you have one. If you have none, say so."
  If the user has none, Ask (choice): "Should I propose a palette based on the industry?" "Yes, propose one (Recommended)" / "No, I will pick a color"
- **Brand contrast pre-check (right after the brand color is known):** run `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <modes> --check-only` (or `ds_color.contrast`) and show the brand color against white, black and each mode's base surface. It decides how every filled button looks: e.g. `#299B48` + white text = 3.57:1, fails 4.5:1, so filled buttons need dark text or a darker brand step. Put the result and the chosen fix in the Intake Summary's Direction line.

### 3c. Design direction from the inspiration folder
Look in `[Project folder]\Inputs\Inspiration\` (screenshots, links, Dribbble shots, competitor apps) and `[Project folder]\Inputs\Research\` (research, personas, PRDs: audience, tone, constraints).
Derive and write down: corner style (sharp 0-4 / soft 6-12 / rounded 16+ / pill), density (compact / comfortable / spacious), elevation (flat / subtle shadows / layered), border use, type personality (geometric / humanist / grotesk), icon weight (outline / filled, stroke 1.5 / 2), imagery and illustration style.
- Folder empty -> Question 3.4, Ask (choice): "I found no inspiration files. Which industry is the product in?" "SaaS" / "Fintech" / "Healthcare" / "E-commerce" (put first the one the project name or brief points to; education, government and any other industry are typed in Other)
  Derive a style from the industry (use ui-ux-pro-max and Impeccable for the direction; avoid generic AI-looking UI). From ui-ux-pro-max take only the **style**, the **anti-patterns** and the **color mood** (e.g. a dark-palette hint); ignore its landing-page patterns (hero, scroll journeys, CTA placement) and its font pairing. Intake answers always win: fonts (0.6), modes (0.4), brand color (3.3) and RTL (0.5) are never overridden by a skill's suggestion.
  Do not ask for a separate approval: the direction goes into the Intake Summary (section 9), which is approved once.

### 3d. Build
**Which Figma file:** use the connected file if the user confirmed it at 0.2 as this project's DS file and it is empty; otherwise ask, typed: "Please create a new Figma design file named '<Project> Design System' and send me its link." Register it in `status.json > figma.design_system`. A plugin cannot rename a file: if the connected file has another name, add "Rename the file to '<Project> Design System'" to the user's to-do list at the Foundation checkpoint.
**Foundation generator:** `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <Light,Dark | Light | Dark>` writes `data/source/foundation-spec.json` (ramps from the brand color with stored curves, the Semantic mapping per mode, the paired-token check and every contrast pair). Fix every failure it prints (re-point the Semantic alias to another step), then build the Primitives and Semantics in Figma from the spec.
Follow the platform Main Skill build order exactly:
1. Primitives -> 2. Semantics (Light / Dark) -> 3. Spacing, Radius, Typography variables -> 4. Text and effect styles -> 5. Icons -> 6. Components: Atoms -> Molecules -> Organisms -> Patterns -> 7. Linked documentation pages -> 8. Audit + project skills.
Before each component: state its tier, post its atomic structure map, check dependencies exist, build missing lower tiers first.
Colors are built **recolor-ready** (platform Main Skill section 3b): full shade scales generated from one base color with a stored curve, Semantic tokens only alias Primitives, so a later color change regenerates every shade and everything follows.
