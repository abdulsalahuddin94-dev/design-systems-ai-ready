# Screens: sizes, Design file audit, flows, fidelity

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load only when screens are built or changed (0.8 = Yes, Brownfield rebuilds, flows).

## 7d. Screen sizes (Abdul's rule, every path that builds screens)

**Design file audit (Abdul's rule, every time screens are built or changed):** run audit-design-system (ds-auditor, `screens` mode) on that Design file to confirm it really uses the DS: library components only (no local copies, detached instances or hand-drawn parts), library variables and styles only (no raw values, no variables used for the wrong purpose), latest library version. Fix what it finds, save the report in `<Project folder>/audits/`, and log the result in `CHANGELOG.md` (`Design file audit: <numbers>, report <path>`).

- Screens are always **Mobile 375px** and **Desktop 1440px** wide.
- **Brownfield exception:** keep the sizes of the screens that are already designed in the file, so they are not broken.
- If the existing "screens" are only screenshots (images, not designed frames), they do not set the size: use 375 / 1440.

## 7e. Multi-screen flows (Abdul's rule, every request for a flow of two or more screens)

A flow (e.g. sign-up, checkout, booking) always runs in this order. Load figma-generate-design + figma-use + ui-ux-pro-max for the screens, and figma-generate-library + figma-use for any new component.

1. **Flow gap analysis first (no build yet).** When the screens have a visual source (screenshots, existing frames, a mockup), write its screen spec first (section 7f). Split every screen of the flow into sections (e.g. Top Bar, Form, Summary, Button Docked). Produce **one table** for the whole flow: screen, section, element, the DS component that covers it (existing) or `missing`. For each missing component give its tier (Atom / Molecule / Organism) and its atomic structure map (which existing atoms and variables it is built from). Save it in `<Project folder>/audits/<date>-flow-<name>.md` and show it, then Ask (choice): "Approve the gap table?" "Approve (Recommended)" / "Request changes". **Abdul approves the table before anything is built.**
2. **Build the missing components in the DS file, never in the Design file.** Lower tier first, only from existing variables, styles and atoms (Atomic Design golden rule). Each one gets its Figma description (Purpose, Usage Rules, Accessibility), an entry in its group's Component_Skill and `data/component-registry.json`, and an audit (ds-auditor). If a component needs a token that does not exist, **propose it (name, value, Primitive it aliases) and wait for approval** (Ask (multi) when several are proposed: one option per token); never add it silently.
3. **Publish and update the Design file.** Ask Abdul to publish the library (section 7c) and wait for his confirmation (Ask (choice): "Done" / "Not yet"). Then he runs Accept updates in the Design file; open it, run the file check (section 7c) and **verify the new components appear** in its library before using them.
4. **Build the screens one by one** from library instances and variables only (no local copies, detached instances or raw values), section by section, at the sizes in section 7d (375 / 1440; Brownfield keeps existing sizes). Follow the screen fidelity rules and the visual loop in section 7f. **Audit the Design file after each screen** (ds-auditor, `screens` mode, fidelity checks included) and fix before the next screen.
5. **Log and ask.** Append the entry to `CHANGELOG.md` (components added, library published, Design files updated, Design file audits) with `Storybook synced: no`, run `tools/project_status.py`, then Ask (choice): "Update the Storybook now?" "Update now" / "Later".

- Screens that need **no new component** may be built while waiting for the Publish confirmation; screens that use a new component wait for step 3.
- The Screens checkpoint (section 8) shows the whole flow, per mode, with the audit results.

## 7f. Screen fidelity (Abdul's rule, every path that builds or rebuilds screens)

Brownfield trial (2026-09-30): screens built from the text inventory alone, with default instance text and no visual check, passed the DS audit but looked nothing like the source. A screen is done only when it matches its source, not when it only uses the DS.

1. **Look at the source first.** Open every source screenshot or frame at full size (view the image file, or `figma_capture_screenshot` of the frame). `Inputs/Extracted_Tokens.md` is for tokens only; it is never the reference for a screen.
2. **Screen spec** (one file per screen, `<Project folder>/audits/<date>-screen-spec-<screen>.md`), sections top to bottom. Per section: the DS component and variant, every text exactly as shown (keep the original language), icons, item counts (e.g. 8 playlist rows, 3 chips), selected/active states, alignment, full-bleed or inside the gutter, and whether it scrolls, scrolls horizontally or is pinned (status bar, app bar, mini player, bottom navigation), and each bar's width as the source shows it (full-bleed, or inset like a floating mini player). Anything the DS lacks goes in the 7e gap table. The specs are approved together with the gap table (the same Ask (choice)), before any build.
3. **Build rules.**
   - Every text, variant, boolean, icon swap and image slot of every instance is set from the spec. No default placeholder text may remain ("Label", "Filter", "Track title", "Title"); two instances only share a text when the source does.
   - Item counts match the spec. A list or rail that continues off screen keeps the visible count plus the partial item the source shows.
   - Screen structure: status bar and top bars at the top; mini player and bottom navigation pinned at the bottom (outside the scrolling content); each bar full-bleed or inset exactly as the spec says (a floating mini player stays inset); the gutter applies to the content only. Horizontal rows clip and scroll; they never overflow the screen or squash their children.
   - Fixed-size instances keep their size (no instance narrower than its component's minimum width). Hug or fill is chosen per the spec, never left to overflow.
   - The screen frame's background, padding and gaps are bound to DS variables, like everything inside it.
   - Build one section per script call and check it before the next; never build a whole screen in one script.
4. **Visual loop (mandatory, every screen).** (Runs in the ds-auditor agent, section 0c: it captures and compares, the main session fixes from its list.) After each screen: capture it with `figma_capture_screenshot`, place the capture next to the source image, and compare section by section: order, texts, counts, icons, sizes (within 4 px), colors, pinned bars. Fix and repeat, up to 3 rounds; list what still differs and why. If the capture fails, stop and ask the user to bring the Design file to the front in Figma (section 7c.7), then retry. A screen is never reported as done without its side-by-side images.
5. **Fidelity audit.** ds-auditor `screens` mode includes the fidelity checks (placeholder texts left, counts vs spec, overflowing or squashed children, pinned bars, unbound screen frames). `tools/check_screens.figma.js` does the structural part.
6. **Report, never self-approve.** Show every screen next to its source (each mode the project has) with the audit numbers, and set the Screens checkpoint to `Ready for review`. Only the user's reply sets `Approved` (section 8).
7. **Brownfield `screen-templates.json`:** generated from the approved screen specs of the project's real screens, not copied from a Trianglz reference.
