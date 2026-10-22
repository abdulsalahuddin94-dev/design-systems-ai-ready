# Screens Handoff Skill (trial: The Live Prototype)

Status: **trial, not part of the workflow yet**. Nothing here is loaded by the intake, the Main Skills or the dashboard until Abdul approves the trial.

Goal: turn the finished screens of a Design file into a live, clickable prototype that a developer can open, built only from the project's own design system (its tokens and its Storybook React components), and carry review comments back into Figma.

Trial project: Music App (Android, Brownfield), flow **Listen**.

## Steps (go / no-go after each)

Each step ends with a report to Abdul and a go / no-go answer. Nothing moves to the next step without his go. No self-approval.

1. **Local prototype from Figma.** `tools/screens_export.figma.js` (read-only) exports each screen of the flow as a tree of DS instances (main component, variant properties, text overrides, auto layout, sizes) plus its prototype reactions (routes, overlays) into `data/screens.json`. `tools/build_prototype.py` generates the screens and routes into a copy of `templates/prototype/` (Vite + React + TypeScript + Tailwind v4, `@theme` from the project's `data/tokens.json`, the project's Storybook components reused, never re-created). Android device frame, Light/Dark and EN/AR toggles, flow list on the left; every element carries `data-figma-node` and `data-component`. Fidelity check: each prototype screen against the Figma export of the same frame, Light and Dark, up to 3 fix rounds. Runs locally only; nothing is published.
2. **Every mode.** All screens of the flow in Light/Dark and EN/AR (RTL), with the prototype interactions from Figma (navigate, overlays, back).
3. **Code handoff.** A Code tab per screen with Jetpack Compose code that uses the real DS names (md.sys tokens, component and property names as in Figma and Storybook).
4. **Comment round trip.** A reviewer comments on an element in the prototype; the comment lands in Figma on the matching node (`data-figma-node`), and a fix in Figma regenerates the prototype.
5. **Decide.** Measure tokens and time, compare with building the same screens by hand, and decide whether this becomes a workflow step (intake, decisions, dashboard).

## Success criteria

- Fidelity **>= 98%** per screen on the Music App Listen screens (prototype vs Figma export, same size and mode).
- Light and Dark, EN and AR (RTL) all render correctly.
- Compose code uses the real DS names, no raw values.
- One comment completes the round trip prototype -> Figma -> prototype.

## Rules for the trial

- All work happens in this branch's worktree; the Root stays on `master`.
- Generated output for a real project stays outside the repo's tracked files (in the project's own folder under `My Projects/`, or in the git-ignored `.trial/`).
- Figma is read only in step 1 (FigCli Yolo, `FIGMA_FILE` set to the exact file name).
- `memory/decisions.md`, the intake files and the dashboard are not changed until the trial is approved.
