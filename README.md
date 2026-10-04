# Design systems Ai Ready

Skills that let Claude Code build, audit and scale AI-ready design systems in Figma for Web, iOS and Android: strictly tokenized, componentized and documented so AI agents can build UIs from them.


> **Live Storybook:** the design system runs in Storybook (the default Web reference's Storybook, folder in `references.json`). See [Storybook for the team](#storybook-for-the-team-run-it-on-your-machine) to run it in two commands.
## What is inside
- `CLAUDE.md`: read by Claude Code automatically; tells it to start every job with the intake.
- `Design_System_Intake_Skill/`: the entry flow (tools check, questions, path, approval checkpoints).
- `Web_Design_System_Skill/`, `iOS_Design_System_Skill/`, `Android_Design_System_Skill/`: platform Main Skills.
- Reference library: studied design systems the workflow learns from (foundations, components, known gaps), one folder per company and platform, indexed in `references.json`. Today it holds one company's Web, iOS and Android systems; add others the same way (`References.md`).
- `*/data/`: JSON knowledge base per DS (tokens, component registry, rules, screen templates) and `*/docs/decisions.md`.
- `tools/`: `build_tokens.py` (Figma export to tokens.json), `recolor.py` (change a color and regenerate all its shades), `tokens_to_css.py` (tokens.json to Storybook CSS variables) and `storybook_parity.py` (checks Storybook names match Figma). Needs Python 3.
- `Storybook_Design_System_Skill/`: optional live Storybook for developers (`/storybook-design-system`).
- `memory/`: shared project memory (decisions, references). `CLAUDE.md` imports it, so every Claude session in this folder starts with it.
- `.claude/agents/`, `.claude/hooks/`, `.claude/settings.json`, `.claude/scheduled/`: the Claude toolkit (see below).
- `References.md`: the reference library (entries, Figma links, how to add one) and tooling links.
- `.claude/skills/`: slash commands `/design-system-intake`, `/web-design-system`, `/ios-design-system`, `/android-design-system`.

## Setup
1. **Install Claude Code** and Node.js 18+ (`node --version`).
2. **Install Figma Desktop** (the web app is not enough).
3. **Install at least one Figma tool, ideally both** (full guide: `Figma_Tools/README.md`; check with `python tools/figma_tools_check.py`). With both installed, Claude uses FigCli Yolo for everything and the Desktop Bridge only for what Yolo cannot do (creating slots):
   - **figma-console-mcp** (Desktop Bridge; needed only for slots, or where Yolo is not allowed): create a Figma personal access token (scopes: File content Read, File versions Read, Variables Read, Comments Read and write), then run
     ```
     claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest
     ```
     In Figma Desktop: Plugins > Development > Import plugin from manifest..., pick `~/.figma-console-mcp/plugin/manifest.json`, and run the plugin in your file. Details: https://github.com/southleft/figma-console-mcp
   - **and/or FigCli (figma-cli)**: download https://github.com/silships/figma-cli into a `Tools` folder at a drive root (outside this folder), run `npm install` inside it, then connect in **Yolo mode** (Recommended): run `node src/index.js connect` in a terminal opened as administrator (it patches Figma, which reopens with local debugging port 9222; undo with `node src/index.js unpatch`), then `node src/index.js daemon restart`. No plugin needed. With several files open, set `FIGMA_FILE="<exact file name>"` on each command. Do not use Safe mode (not stable) or Browser mode. Risks and details: `Figma_Tools/README.md`.
4. **Recommended skills and connectors**: the official Figma MCP / Figma plugin (figma-use, figma-generate-library, figma-generate-design), audit-design-system, ui-ux-pro-max, Impeccable.
5. **Get this folder**: clone the repository (or copy the folder) anywhere on your machine. Paths inside are relative, so any location works.
6. **Templates (optional)**: duplicate a reference design system for your platform from `References.md` into your Figma workspace.

## Use
Open the folder in Claude Code and say what you want, or run `/design-system-intake`. Claude checks the Figma bridge, asks one question at a time, then builds with approval checkpoints (Foundation, Components, Screens) and finishes with the project's skills and an audit.

Project work is saved in `My Projects/<Project>/` (Web), `<Project>_iOS/`, `<Project>_Android/` or `<Project>_Mobile/`, each a copy of `My Projects/_Project_Template/`. See `My Projects/README.md`.

## Claude toolkit (in `.claude/`)

**Subagents** (`.claude/agents/`). Claude hands focused jobs to them; you can also ask for one by name ("run the ds-auditor on the Navigation group").
| Agent | Does | Writes |
|---|---|---|
| `ds-auditor` | Read-only QA: remote variables, raw hex/px, detached components, missing states, unwired properties, icons, contrast, naming, group placement, linked docs. `drift` mode compares Figma with the saved skills, data and Storybook. | `<folder>/audits/<date>-<mode>.md` |
| `token-extractor` | Exports Figma variables (or scans unstructured screens) and rebuilds `data/tokens.json` with exact Figma names. | `<folder>/data/`, `Inputs/Extracted_Tokens.md` |
| `docs-writer` | Writes Foundation and Component skills, `component-registry.json`, `Project_Brief.md` and Storybook usage pages from what is in Figma. | skill folders |

None of them can edit Figma; they only have read tools.

**Hooks** (`.claude/settings.json`, scripts in `.claude/hooks/`, need Python 3 on PATH).
- *Storybook notice*: at session start Claude is told the repo has a Storybook (installed or not, running or not) and mentions it in one line; it asks about the project first and about Storybook later (intake 0.7, or when you pick a project with pending Storybook work). The same hook is the daily Storybook check (there is no separate scheduled question): it reads each project's `CHANGELOG.md` and `status.json` (never Figma, which may be closed), lists projects whose Figma changes are not yet in Storybook and Design files that still need Accept updates for the library, and projects whose Storybook plan is Later; Claude asks whether to open the Figma plugin and update when you pick that project. Silent when everything is synced.
- *Block absolute paths*: any write to a repo file that contains a machine path like `D:\Work\...` or `/Users/...` is stopped, so the folder keeps working on any computer.
- *Audit reminder*: after Claude changes Figma, the first time it tries to finish it is asked once to run the QA checklist (ds-auditor). Running the ds-auditor or a Figma audit tool clears the reminder.

**Permissions** (`.claude/settings.json`). Figma read tools (status, variables, styles, components, screenshots, audits) and safe read commands (`git status/diff/log`, `ls`, version checks, `build_tokens.py`, running Storybook) run without prompts. Installing anything (`npm install`, `npm create`, `npx storybook add`, `pip install`, `claude mcp add`) and `git push` always ask first. `.env` files are never read. Figma write tools still ask, as before. Put personal overrides in `.claude/settings.local.json` (git-ignored).

**Scheduled weekly drift audit** (`.claude/scheduled/weekly-drift-audit.md`). A ready prompt that runs the ds-auditor in drift mode every Monday and writes a summary to `audits/`. It is not turned on. It must run on your computer (the Figma Desktop Bridge is local), so enable it as a scheduled task in the Claude desktop app or with Windows Task Scheduler; the file has both steps.

**Memory** (`memory/`). Stable facts every session needs: standing decisions (build order, atomic tiers, group placement, platforms independent, never install, Storybook direction) and the reference library. `CLAUDE.md` imports it. Update the matching file when a decision changes; keep one fact per file and relative paths only.

## Storybook for the team (run it on your machine)

The design system is live in Storybook: browse every component, try its variants and properties, read its use cases, and open it in Figma. Current Storybook: the default Web reference (`references.json`, today `Reference_Library/Trianglz/Web/storybook/`).

Needs **Node.js 18+** (`node --version`). Then:
1. `git clone <repo URL>` (private repo; ask for access).
2. `cd "<repo folder>/Reference_Library/Trianglz/Web/storybook"`
3. `npm install` (first time only; `node_modules` is not in the repo).
4. `npm run storybook`
5. Open http://localhost:6006

Updates: `git pull` in the repo, then `npm install` again if `package.json` changed, and restart `npm run storybook`.

**With an AI tool or agent:** while Storybook runs, its MCP server is at `http://localhost:6006/mcp` (not committed, so a fresh clone prompts nothing; in Claude Code register it once with `claude mcp add --transport http trianglz-web-storybook http://localhost:6006/mcp --scope local`, or copy `.mcp.example.json` to `.mcp.json`, which is git-ignored; add the same URL as an HTTP MCP server in Cursor or other tools). Every AI tool that opens this repo is told about the Storybook and mentions it (it asks about your project first): Claude Code through `CLAUDE.md` and a SessionStart hook, Cursor through `.cursor/rules/storybook.mdc`, Codex and others through `AGENTS.md`, Copilot through `.github/copilot-instructions.md`, Gemini through `GEMINI.md`.

## Live Storybook (optional)

Toolkit: **Claude -> MCP -> Figma + Storybook + GitHub.** Figma stays the source of truth. Storybook is the browsable documentation for developers and AI agents: every component with its variants and properties as controls, usage and use cases, tokens, and a link back to Figma. It is documentation, not production code.
- One Storybook per platform in `<folder>/storybook/`. Default stack for all platforms: React + Vite + Storybook; iOS and Android components are styled to look native and shown in a device frame.
- Component, variant, property and token names match Figma exactly; `tools/storybook_parity.py` checks it.
- Tokens are generated from `data/tokens.json` by `tools/tokens_to_css.py` (Figma modes become toolbar switches: Light/Dark, Desktop/iPad/Mobile).
- The official Storybook MCP addon (`@storybook/addon-mcp`) serves `http://localhost:6006/mcp` while Storybook runs, so agents can read components and docs before building UI. Docs: https://storybook.js.org/docs/ai/mcp/overview
- Ask for it in the intake (question 0.7) or later with `/storybook-design-system`. Claude asks before installing any Node package.

