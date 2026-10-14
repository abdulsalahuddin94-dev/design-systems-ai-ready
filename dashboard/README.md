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
| Update banner | Appears when `origin/master` has merged changes you do not have, listing them. **Update now** runs `git pull --ff-only origin master` in the Root: it never merges, discards or overwrites local edits, and stops with the file names when it cannot fast-forward |

## How it works
- `server.mjs` (Node, no framework) listens on 127.0.0.1 only and refuses requests from other sites.
- Each conversation is one `query()` from the Claude Agent SDK with `cwd` = Root and `settingSources` user, project and local, so `CLAUDE.md`, `.claude/settings.json` hooks, skills, agents and your permission mode load as in the terminal. The installed `claude` is used when found (a Windows `.cmd` shim falls back to the SDK's own copy).
- `canUseTool` turns every AskUserQuestion call and permission prompt into an event for the browser and waits for the click; answers go back as the tool's `answers` (question text -> label, several labels joined with ", ").
- Events reach the browser over Server-Sent Events; a reload replays the conversation. Recent conversations are saved in `.claude/.state/dashboard-sessions.json` (git-ignored) and can be resumed.
- `public/` is plain HTML, CSS and JavaScript (no build step). It uses `docs/assets/docs.css`, so it matches the docs pages in light and dark.

## Rules for changing it
- Workflow logic stays in the skills. The dashboard only starts conversations with a prompt; it never re-implements intake questions or checkpoints, so a skill change needs no dashboard change.
- Hidden projects: list folder names in `private/dashboard-hidden.txt` (git-ignored, one per line); they never appear.
- Nothing here sends data anywhere except what Claude Code itself sends.
