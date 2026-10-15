# Dashboard

A local browser interface for the workflow. It is a window onto Claude Code, not a second workflow: every conversation runs Claude Code in the Root with your own settings, sign-in, skills, hooks and memory files, exactly as in the terminal.

## Start
- Windows: double-click `Start-Dashboard.cmd` in the Root. Mac: `Start-Dashboard.command`.
- The first start runs `npm ci` here (one package, `@anthropic-ai/claude-agent-sdk`), then opens http://localhost:4777. Keep the window open while you work; closing it stops the dashboard and any running conversation.
- Needs Node.js 18+ (`Setup-Windows.cmd` / `Setup-Mac.command`) and Claude Code installed and signed in on this computer (open `claude` once in a terminal to sign in).
- By hand: `npm ci` in this folder, then `node server.mjs --open`. Other port: `DASHBOARD_PORT=4800`.

## What it shows
| Screen | What you do there |
|---|---|
| Home | Start a new project (the intake), join a team project, a quick task (`/ds-quick`) or any request; open a project from `My Projects/` (phase, last CHANGELOG entry, next step, Storybook changes waiting, Figma / Storybook / team repo links); continue a recent conversation |
| Conversation | Claude's replies; tool steps as small chips; AskUserQuestion menus as buttons (recommended first, Back, an "Other" box, several questions with "Send answers"); permission prompts as Yes / Yes, don't ask again / No; screenshots Claude takes or reads moved into the next approval card (click to zoom); paste, drop or attach your own images; Stop; Open in Claude Code (`claude --resume` in a terminal) |
| Project sidebar | Quick actions that send a prompt: Continue, Run an audit, Add or change a component, Change a token, Update Storybook, Project status |
| Sign in | The pill at the top right shows whether Claude Code is signed in (`claude auth status`). **Sign in** runs `claude auth login`: the browser opens the Claude sign-in page, a code box appears if the page gives a code, and the pill turns green when done. An expired sign-in inside a conversation shows a card with Sign in and Try again. Fallback: Use a terminal instead (`claude`, then `/login`) |
| Add to the workflow | Reference design system, Icon library, Skill from GitHub. The dialog lists what you need and what happens, asks for the name and link (Figma or GitHub links are checked), then starts `/contribute` with them (CONTRIBUTING.md: the work happens on a branch and ends as a pull request after "Send it for review") |
| Permissions pill | How often Claude asks, saved in `.claude/.state/dashboard-settings.json` and applied at once to running conversations: **Auto** (Recommended, Claude Code's auto mode: routine steps run, risky ones still ask) or **Ask every time**. A mode that never asks is not offered. AskUserQuestion menus and checkpoints are decisions, not permissions, so they always wait for you |
| Settings | **AI tools**: Claude Code, Codex, Gemini CLI, Cursor CLI, Copilot CLI and the Antigravity app, each with installed / version / signed-in state, **Sign in** (opens the tool's own login command in a terminal), **Open** and a model field (empty = the tool's default). **When Claude hits its usage limit**: Ask me / Codex / Gemini. **Usage**: tokens and turns per tool, today and 7 days, top projects, last limit (`.claude/.state/dashboard-usage.json`, this computer only). **GitHub** account and repo with Sign in (`gh auth login --web`), **Figma** tools check, permissions and Node / Python / Git versions. No token or password is read, stored or shown |
| Another tool | **Continue with another tool** (conversation) or the usage-limit card writes the conversation to `.claude/.state/handoff.md` and opens Codex, Gemini CLI or Antigravity in its own window on the Root with that note. The tool runs interactively there and asks its own approvals; it follows `AGENTS.md` (CHANGELOG `Tool:` line, `[Tool]` commits), and Claude audits that work at its next session start |
| Update banner | Appears when `origin/master` has merged changes you do not have, listing them. **Update now** runs `git pull --ff-only origin master` in the Root: it never merges, discards or overwrites local edits, and stops with the file names when it cannot fast-forward |

## How it works
- `server.mjs` (Node, no framework) listens on 127.0.0.1 only and refuses requests from other sites.
- Each conversation is one `query()` from the Claude Agent SDK with `cwd` = Root and `settingSources` user, project and local, so `CLAUDE.md`, `.claude/settings.json` hooks, skills, agents and your permission mode load as in the terminal. The installed `claude` is used when found (a Windows `.cmd` shim falls back to the SDK's own copy).
- `canUseTool` turns every AskUserQuestion call and permission prompt into an event for the browser and waits for the click; answers go back as the tool's `answers` (question text -> label, several labels joined with ", ").
- Events reach the browser over Server-Sent Events; a reload replays the conversation. Recent conversations are saved in `.claude/.state/dashboard-sessions.json` (git-ignored) and can be resumed.
- `public/` is plain HTML, CSS and JavaScript (no build step) with its own stylesheet (the print-production look, light and dark) and inline Lucide icons. Fonts (Archivo, Red Hat Mono; OFL in `public/fonts/OFL.txt`) are served from `public/fonts/`, so the dashboard needs no internet.
- `tools.mjs` detects the other AI tools, holds their login and handoff commands and keeps the usage log. The dashboard never runs another tool unattended: it only opens it in its own window.

## Rules for changing it
- Workflow logic stays in the skills. The dashboard only starts conversations with a prompt; it never re-implements intake questions or checkpoints, so a skill change needs no dashboard change.
- Hidden projects: list folder names in `private/dashboard-hidden.txt` (git-ignored, one per line); they never appear.
- Nothing here sends data anywhere except what Claude Code itself sends.
