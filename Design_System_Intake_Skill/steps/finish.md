# Finish: skills, final audit, Storybook

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load at the end of a build (Step 8) or when the Storybook step runs (Step 9).

## 11. Step 8 - Always finish with skills and the final audit

1. Run **audit-design-system** on the DS and on every Design file whose screens were built or relinked (section 7d rule): 0 remote variables/styles, 0 raw values, 0 detached components, every property wired, contrast passing in Light and Dark. Fix and re-run until clean, then report the numbers.
2. Screenshot every variant (each mode the project has) into the skills' `references\screens\`.
3. Write / update the project skills (usually through the docs-writer agent, which keeps `data/docs-progress.json` so a run cut off by a rate limit can resume where it stopped):
   - `Foundation_Skill`: variables (names, values per mode, scopes, code syntax), styles, grids, icon rules, direction decisions from the intake.
   - One Component_Skill per group: every component with tier, variants, properties, exact use cases, when not to use, and dependencies.
   - `gaps.md` in each: anything left open.
   - The JSON knowledge base in `My Projects/<Project>/data/`: export variables and run `python tools/build_tokens.py "My Projects/<Project>"` (tokens.json), then write `component-registry.json`, `rules.json`, `screen-templates.json` (copy the Trianglz reference versions as the starting shape) and `docs/decisions.md`.
   - Check `tokens.json > recolor_readiness.ready` is true.
4. Update `Project_Brief.md` with the final state and links, add the `CHANGELOG.md` entry (`Storybook synced: no`), refresh `status.json` with `tools/project_status.py`, and save the key facts to memory.
5. Reply to the user with the audit result, the skill paths and what is left.

---

## 12. Step 9 (optional) - Live Storybook

Runs when 0.7 = Yes, after the Components checkpoint is approved (or whenever the user asks later). When 0.7 = Later, ask again at the trigger in `status.json > storybook_ask_at` (Ask (choice): "Build Storybook now" / "Later" / "No") and move the trigger forward on each new "Later" (0.7 notes).
1. Load `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
2. Make sure `data/tokens.json` and `data/component-registry.json` reflect the live Figma file (token-extractor subagent if they need a resync).
3. Ask before installing any Node package: show the exact commands, then Ask (choice): "Yes, install" / "Not now".
   - iOS / Android: build the Storybook as web (React + CSS) styled like the native components (Storybook skill, principle 7).
   - Meet the Storybook quality bar (principle 8): working components, sidebar navigation, Figma description and use case per component, every Figma property as a control, all states in Light and Dark. Write each component description in Figma and in Storybook during the build.
4. Build the Storybook in `<platform folder>/storybook/`, one per platform, with names that match Figma exactly.
5. Verify (build, parity check, visual check against Light/Dark screenshots), then offer to register the Storybook MCP for this folder (Ask (choice): "Register it (Recommended)" / "Not now").
6. Record the path, run command and MCP status in `Project_Brief.md`, then mark the changelog synced: `python tools/project_status.py "My Projects/<Project>" --mark-synced`.
