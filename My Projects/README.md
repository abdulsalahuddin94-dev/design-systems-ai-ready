# My Projects

Every design system project lives here, one folder per project. The workflow itself (Main Skills, rules, hooks, tools, `CLAUDE.md`) stays in the Root and is never copied into a project.

## Start a new project
- Easiest: open the Root in Claude Code and say what you want (or run `/design-system-intake`). Intake lists the folders here, asks which project to work on or whether to start a new one, and creates the new folder from `_Project_Template/` for you.
- By hand: duplicate `_Project_Template/` and rename the copy after the project, with the platform suffix:
  - `<Project>/` Web, `<Project>_iOS/`, `<Project>_Android/`, `<Project>_Mobile/` (Both, cross-platform: one shared design).
  - Both + Native: `<Project>_iOS/` and `<Project>_Android/` (each linked only to its own DS), plus `<Project>_Brand/` when the optional Brand Foundation (Primitives only) is used.
  - Use `_` instead of spaces in folder names.
  - Replace `<Project>` in `Project_Brief.md`, `docs/decisions.md` and the skill stubs.

## What the template holds
- `Project_Brief.md`: intake answers, links, decisions, status.
- `Inputs/Brand`, `Inputs/Inspiration`, `Inputs/Screens`: drop brand books, references and screenshots here before intake.
- `Foundation_Skill/` and `Component_Skills/` (`Form_Elements_Skill`, `Navigation_Skill`, `Data_Display_Skill`): empty stubs, filled at the end of the build.
- `data/`, `docs/`, `audits/`: knowledge base, decision log, audit reports.
- `status.json > figma`: the project's one Design System file and its list of Design files (name, URL, file key). Claude checks the open file against it before touching Figma.
- `CHANGELOG.md` and `status.json`: every Figma change adds a dated entry marked `Storybook synced: no`. At the start of each session Claude reads these (not Figma) and asks whether to open the Figma plugin and update Storybook for projects with unsynced changes. `python tools/project_status.py` lists them; `--mark-synced` after a Storybook update.

Never edit `_Project_Template/` for a single project; change it only when the template itself should change for every future project.

## Tools
Tools in the Root take the project folder relative to the Root, in quotes because of the space:
`python tools/build_tokens.py "My Projects/<Project>"`

## Git (optional)
Each project folder can become its own private GitHub repo, separate from the workflow repo, so a client's work can be shared without the workflow. To do that, run `git init` inside the project folder and add `My Projects/<Project>/` to the Root `.gitignore`. Nothing is created or pushed automatically.
