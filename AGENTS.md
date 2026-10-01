# AGENTS.md

Instructions for any AI coding tool or agent working in this repo (Codex, Cursor, Antigravity, Copilot, Gemini, Windsurf, ...). Claude Code reads `CLAUDE.md`; this file mirrors it for every other tool. `GEMINI.md`, `.cursor/rules/storybook.mdc` and `.github/copilot-instructions.md` point here.

## This repo has a live Storybook (mention it; ask about the project first)
The design system is documented in a runnable Storybook: every Figma component with its variants, properties, use cases and tokens, with names identical to Figma.

- Location: `Trianglz/storybook/` (Trianglz Web Design System). Other projects get their own `<project folder>/storybook/`.
- **At the start of every session, mention in one line that this repo has a Storybook (information only, no question).** The first question is about the project (intake 0.0). Also run `python tools/project_status.py` and mention any project whose Figma changes are not yet in Storybook, whose Storybook plan is Later, or whose Design files still need Accept updates for the library. Ask about updating a project's Storybook when the user picks that project, at intake 0.7, or when the user asks. (Claude Code gets this from a hook; other tools must run it themselves.)
- Run it: `cd Trianglz/storybook`, `npm install` (first time; ask the user before installing), `npm run storybook`, open http://localhost:6006. Needs Node.js 18+.
- MCP: while it runs, the Storybook MCP server is at `http://localhost:6006/mcp` (add it to your tool's own MCP config as an HTTP server; it is not committed to this repo, `.mcp.example.json` shows the entry). Use it to list components and read their docs and props before building any UI.
- Update it from Figma: follow `Storybook_Design_System_Skill/SKILL.md` section 5; first ask the user to open the project's DS file with the Desktop Bridge plugin (tokens: `python tools/tokens_to_css.py <folder>`, stories: `python tools/storybook_stories.py <folder>`, name check: `python tools/storybook_parity.py <folder>`), then `python tools/project_status.py "<folder>" --mark-synced`.
- Storybook is documentation, not production code. Keep component, variant, property and token names exactly as in Figma.

## What this repo is
Skills and data for building, auditing and scaling AI-ready design systems (Web, iOS, Android) in Figma. The Root holds only the workflow; projects live in `My Projects/`.

- **Choice questions (whole workflow):** every question the user answers by picking (intake, steps, quick mode, checkpoints and approvals, Scenario C decisions, publish / Accept updates confirmations, Storybook questions; written `Ask (choice)` / `Ask (multi)` in the skills) is a numbered list, recommended option first; the user replies with a number, several numbers for `Ask (multi)`, or free text. Claude Code uses its AskUserQuestion arrow-key menu instead (Intake section 0).
- **Always start here:** `Design_System_Intake_Skill/SKILL.md`. It checks which Figma tools are installed (`python tools/figma_tools_check.py`: Figma Desktop Bridge and/or FigCli in Safe mode; setup guide `Figma_Tools/README.md`), asks which one to use when both are (saved per file in `status.json > figma`; switching any time is allowed, section 0b), asks which project (from `My Projects/`) or a new one, then asks one question at a time and routes to the right path. Do not touch Figma until the user approves the Intake Summary.
- **Quick mode (Abdul, 2026-10-01):** when the user asks for one specific task on a live file (one component, an audit, one fix) without a project setup, follow `Design_System_Intake_Skill/steps/quick-mode.md` instead of the intake questions: no `My Projects/` folder, no project skills, but the preflight, file check, rules, atomic tiers and audit still apply.
- **Token budget (Abdul, 2026-10-01):** the intake `SKILL.md` is a router; load the `Design_System_Intake_Skill/steps/` file of the current step only (map in its section 0c). One phase per session with a handoff in `Project_Brief.md`, `CHANGELOG.md` and `status.json`. Paste `tools/figma_helpers.figma.js` into `figma_execute` once per file per session and call its `DS.*` helpers instead of redefining them.
- **Platform Main Skills:** `Web_Design_System_Skill/` (Tailwind conventions), `iOS_Design_System_Skill/` (Apple HIG), `Android_Design_System_Skill/` (Material 3). Optional: `Storybook_Design_System_Skill/`.
- **Standing decisions:** `memory/decisions.md` (read before any work). Figma template references: `memory/references.md`, `References.md`.
- **Projects:** `My Projects/<Project>/` (Web), `<Project>_iOS/`, `<Project>_Android/`, `<Project>_Mobile/`, each copied from `My Projects/_Project_Template/`: `Project_Brief.md`, `CHANGELOG.md`, `status.json` (linked Figma files), `Inputs/`, `Foundation_Skill/`, `Component_Skills/`, `data/`, `docs/`, `audits/`. See `My Projects/README.md`.
- **Knowledge base:** each DS folder's `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`, `docs/decisions.md`. Prohibitions: `data/rules.json > off_limits`. Tools in `tools/`.
- **Build order:** Primitives, Semantics (Light/Dark), Spacing/Radius/Typography variables, styles, icons, components (Atoms, Molecules, Organisms, Patterns), linked docs, audit, project skills. Never build a component before its lower-tier parts exist.
- **Rules:** paths relative to the repo root only (never machine paths); platforms never share files; find Figma nodes by name; never install tools or packages without asking; never edit the original Trianglz Figma templates; Semantic colors only alias Primitives; real icons only; approval checkpoints Foundation, Components, Screens with Light and Dark screenshots.
- **Mobile "Both" (Abdul, 2026-09-30):** intake 1.3 asks Native or Cross-platform. Native = optional `<Project> Brand Foundation` file (Primitives only, copied into each DS, never a library) + separate iOS DS (HIG names, Dynamic Type, SF Symbols) and Android DS (`md.sys.color`, M3 type, state layers, elevation, Material Symbols) + separate iOS and Android Design files, each linked only to its own DS; folders `<Project>_iOS/` and `<Project>_Android/`. Cross-platform (Flutter / React Native custom UI) = one DS + one Design file in `<Project>_Mobile/`. Details: `Design_System_Intake_Skill/SKILL.md` section 2.
- **Figma files:** before any Figma work, check the connected file's key against the project's `status.json > figma` (Intake section 7c). On a mismatch, stop and warn the user. After any DS change, ask the user to publish the library and list the Design files that still need Accept updates.

## Handoff (every tool other than Claude Code)
Several tools may work on the same project. Claude Code picks up after them from the git log and the changelog, so every tool must leave both behind.

1. **Log every Figma or project change** in that project's `CHANGELOG.md`, newest first:
   ```
   ## YYYY-MM-DD - <what> (<tool name>, e.g. Cursor)
   - Storybook synced: no
   - Tool: <Codex / Cursor / Antigravity / ...>
   - Changed: <components, variables, styles, files added, changed or removed>
   - Figma file: <name>
   - Library published: <yes / no> (DS changes only)
   - Design files updated (Accept updates): <name: yes / no>
   ```
   Then run `python tools/project_status.py "My Projects/<Project>"` to refresh `status.json`.
2. **Commit locally** with the tool name first: `git commit -m "[Cursor] Build Radio component"`. Never push or create a remote unless the user asks.
3. **Follow the skills by hand.** Hooks, slash commands and subagents (`.claude/`) are Claude Code only, so nothing checks your work automatically:
   - read `Design_System_Intake_Skill/SKILL.md`, the platform Main Skill and the project's `Project_Brief.md` before starting;
   - the audit checklist is in `.claude/agents/ds-auditor.md` (run it yourself if you can; Claude Code re-runs it when it takes over);
   - never write absolute machine paths into files; never detach components; ask before writing to an original Trianglz template.
4. **Design file audit (Abdul's rule):** every time you build or change screens in a Design file, audit that file for real use of the design system (checklist: `.claude/agents/ds-auditor.md` > Screens mode): library components only, no detached or hand-drawn parts, library variables and styles only, no raw values or misused variables. Save the report in `<Project folder>/audits/<date>-screens-<file>.md` and add `Design file audit: <numbers>, report <path>` to the changelog entry.
5. **Multi-screen flows (Abdul's rule):** follow `Design_System_Intake_Skill/SKILL.md` section 7e in order. (1) Flow gap analysis first: split each screen into sections and write one table of existing vs missing DS components, with the tier (Atom / Molecule / Organism) and atomic map of each missing one; Abdul approves it before any build. (2) Build missing components in the DS file only (never the Design file) from existing variables and atoms, each with its description, Component_Skill entry and audit; propose any missing token and wait for approval. (3) Ask Abdul to publish the library and wait for his confirmation; he runs Accept updates in the Design file; verify the new components appear there. (4) Build the screens one by one from library instances only, at 375 / 1440 (Brownfield keeps existing sizes), following item 7 (screen fidelity), auditing the Design file after each screen. (5) Log it in `CHANGELOG.md` and ask about the Storybook update. Screens that need no new component may be built while waiting for the publish.
6. **Scenario C, imperfect DS + Design file (Abdul's rule):** follow `Design_System_Intake_Skill/SKILL.md` section 7 in order. (1) Understand the DS: read every variable (collection, modes, scopes, Light/Dark values, alias target, where DS components use it) and write a Variable Map (name, inferred usage, scope, confidence) in `<Project folder>/audits/`; read the user's references (docs, dev tokens, Storybook) first; ask Abdul only about low-confidence names. (2) Fix the DS itself: safe fixes without asking (descriptions, high-confidence scopes, typo renames, missing states); approval first for anything that changes how live screens look (values, aliases, contrast fixes, low-confidence scopes, merges or deletes); flag gaps; then ask Abdul to publish. (3) Audit the Design file screen by screen: raw values (hex, px, fonts), misused variables (against scope and the Variable Map, e.g. a border color used as a fill), detached instances, frames without Auto Layout, default layer names; one proposed fix per issue. (4) Raw values with no matching Semantic: near-miss -> nearest token; repeated new value -> propose a new Primitive + Semantic (never added without Abdul's approval; add it in the DS file, publish, then bind); one-off off-scale value -> nearest scale step; unsure -> `needs decision`. (5) Fix screens only after Abdul approves the report, screen by screen, asking on ambiguous cases; keep the existing screen sizes. (6) Log it in `CHANGELOG.md`, publish, and list every linked Design file that needs Accept updates.
7. **Screen fidelity (Abdul's rule, every screen you build or rebuild, `Design_System_Intake_Skill/SKILL.md` section 7f).** A screen that uses the DS but does not look like its source is a failed screen. (1) Open every source screenshot or frame at full size and look at it; `Inputs/Extracted_Tokens.md` is for tokens, never the screen reference. (2) Write a screen spec per screen in `<Project folder>/audits/<date>-screen-spec-<screen>.md`: sections top to bottom with the DS component and variant, every text exactly as shown, icons, item counts, selected states, full-bleed or gutter, pinned or scrolling; Abdul approves the specs with the gap table before any build. Brownfield type 1 (section 5 steps 7-8) follows the same order. (3) Set every text, variant, icon swap and image of every instance from the spec; no default placeholder text ("Filter", "Track title", "Label") may remain. Status bar, app bars, mini player and bottom navigation are pinned and keep the source width (full-bleed, or inset like a floating mini player); the gutter is for content only; horizontal rows clip and scroll; nothing overflows or gets squashed; the screen frame's fill, padding and gaps are bound to variables. (4) Build one section per script call, never a whole screen in one script. (5) After each screen, capture it (`figma_capture_screenshot`), put it next to the source and compare order, texts, counts, icons, sizes and colors; fix and repeat up to 3 rounds. If the capture fails, stop and ask Abdul to bring the Design file to the front in Figma; never report a screen without its side-by-side images. (6) Run `tools/check_screens.figma.js` with `figma_execute`; every count must be 0. (7) Screen work needs a strong reasoning model; if yours is a fast or light model, say so to Abdul before starting.
8. **Never approve a checkpoint yourself.** Show the result (screenshots, side-by-side for screens, audit numbers) and write `Ready for review` in `Project_Brief.md > Checkpoints`; only Abdul's reply makes it `Approved`. Never write "Passed" or "All green" from instance counts, and never overwrite another report in `audits/` (use the dated file name).
9. Note anything unfinished or uncertain in the changelog entry, so the next tool does not have to guess.

## Figma setup for other tools (figma-console-mcp)
Every tool needs its own figma-console-mcp entry plus the Figma Desktop plugin (Desktop Bridge) running in the open file. Use a Figma personal access token (scopes: File content Read, File versions Read, Variables Read, Comments Read and write). Keep the token in your user config, never in this repo. Source: https://github.com/southleft/figma-console-mcp

- **Cursor** (verified in the figma-console-mcp README): `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` in this repo (do not commit a token):
  ```json
  {
    "mcpServers": {
      "figma-console": {
        "command": "npx",
        "args": ["-y", "figma-console-mcp@latest"],
        "env": { "FIGMA_ACCESS_TOKEN": "figd_YOUR_TOKEN_HERE", "ENABLE_MCP_APPS": "true" }
      }
    }
  }
  ```
- **Codex** (OpenAI; standard Codex MCP format, not listed in the figma-console-mcp README): `~/.codex/config.toml`:
  ```toml
  [mcp_servers.figma-console]
  command = "npx"
  args = ["-y", "figma-console-mcp@latest"]
  env = { FIGMA_ACCESS_TOKEN = "figd_YOUR_TOKEN_HERE", ENABLE_MCP_APPS = "true" }
  ```
  Newer Codex versions can also add it with `codex mcp add figma-console --env FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -- npx -y figma-console-mcp@latest` (unverified; check `codex mcp --help`).
- **Antigravity** (Google; unverified, the file location changes between versions): open the agent panel menu > MCP Servers > Manage MCP Servers > View raw config, which opens `mcp_config.json` (usually `~/.gemini/antigravity/mcp_config.json` or `~/.gemini/config/mcp_config.json`; on Windows `~` is your user folder, `%USERPROFILE%`). Add the same `mcpServers` block as Cursor, then refresh the server list.
- **Plugin (all tools):** in Figma Desktop, Plugins > Development > Import plugin from manifest..., pick `~/.figma-console-mcp/plugin/manifest.json`, and run it in the file. Only one tool should be connected to the bridge at a time (default WebSocket port 9223; set `FIGMA_WS_PORT` to change it).
