# Usability review (UX heuristics)

Adapted from [wondelai/skills](https://github.com/wondelai/skills) `ux-heuristics` (MIT, copyright Wondel.ai sp. z o.o., copied 2026-10-13; license in `../licenses/wondelai_skills.txt`). The files in this folder are the original skill, unchanged except for the notes at their top; this index says how the workflow uses them. Nothing is installed: the agent reads these files.

**Why (Abdul, 2026-10-13):** audit-design-system checks that screens use the DS (components, variables, styles), Impeccable judges visual quality, and `../ux/` gives rules per screen while it is specified and built. None of them asks whether the whole flow is easy to use: can the user tell where they are, get back, recover from an error, find the same words for the same thing on every screen. This review does, with Nielsen's 10 heuristics and Krug's principles, and gives each issue a severity.

## When

| Where | What is reviewed | Input |
|---|---|---|
| **Flow map** (Intake 7e.0, `steps/plan-user-flows.md`) | The map before any spec: exits, error recovery, decisions with no way back, one term per concept. Always run, no question (text only, cheap) | The flow map text |
| **End of a flow** (Intake 7e step 4b, `steps/screens.md`), optional, asked | Every screen of the flow together, after each screen passed its audit and Impeccable critique | Screenshots of the flow in order (ds-auditor `usability` mode) |
| **Audit of existing screens** (Quick mode "Audit a file or page", Scenario C step 3), optional, asked | The screens as they are, next to the DS audit | Screenshots (ds-auditor `usability` mode) |

Not for single components or foundations: a usability review needs a task and at least one screen.

## How to run it

1. **Task first.** Name the user and the goal of each flow (from the flow map or `Project_Brief.md`; ask once in one Ask (choice) only if neither says). Heuristics are judged against a task, not in general.
2. **Load only what is needed:** `framework.md` (Krug, Nielsen 10, severity scale, Quick Diagnostic) always; `nielsen-heuristics.md` when a finding needs the detail of one heuristic; `krug-principles.md` for the Trunk Test on navigation; `heuristic-conflicts.md` when two heuristics disagree; `dark-patterns.md` for sign-up, checkout, subscription or cancel flows; `cultural-ux.md` when the project has Arabic / RTL or more than one market. Accessibility stays with `../ux/accessibility.md` and the ds-auditor contrast and touch-target checks (not repeated here).
3. **Review screen by screen, then the flow as a whole:** run the Quick Diagnostic per screen, the Trunk Test on every screen that can be opened directly (deep link, notification, tab), then the flow-wide heuristics (4 Consistency, 3 User control, 9 Error recovery) across screens.
4. **Report** to `<Project folder>/audits/<date>-usability-<flow or file>.md`, using `audit-template.md` as the per-screen layout, plus:
   - one row per issue: screen, element (layer name), heuristic, what the user would do or fail to do, severity 0-4, proposed fix;
   - the score out of 10 (`framework.md` > Scoring) at the top, with the previous report's score next to it when there is one.

## Our rules win

- **Severity to our two levels:** 3 Major and 4 Catastrophic are **Blocking** (as in `../ux/README.md`): the screen is not shown at the Screens checkpoint as ready until each is fixed or the user accepts it. 1-2 are ordinary findings. 0 is not reported.
- **Fixes use the DS only:** a fix is a different component, variant, state, text or screen, never a raw value. A fix that needs a new component goes through the 7e gap table; a new token is proposed and approved first, as everywhere.
- **The user decides.** The review only reports; nothing in Figma changes until the user picks the fixes (Ask (multi): one option per issue, or per heuristic when there are more than 4). A finding that contradicts a screen spec the user approved, or a source screen in Brownfield, is listed as a question, not a fix.
- **Opinion, not measurement.** Heuristic findings are judgement based on principles, unlike the DS audit's counts. Each finding says what was looked at and why it breaks the heuristic; "looks confusing" is not a finding.
- Platform conventions (HIG, Material 3, Tailwind/Web, our Main Skills) win over the generic web examples in these files (for example "search top-right" or "logo top-left").
- Not adopted: the upstream "Further Reading" links, user testing and A/B testing (outside Figma), `wcag-checklist.md` (covered by our accessibility checks).

## Logging

`CHANGELOG.md` entry: `Usability review: <score>/10, <n> issues (<b> blocking), report <path>`, or `Usability review: skipped`.
