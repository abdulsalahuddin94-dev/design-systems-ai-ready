# Machine setup (intake 0b check 0)

Load when the session-start context says "Machine setup: this computer is missing workflow dependencies", or when a command fails because a tool in `tools/dependencies.json` is not found. Abdul's rule (2026-10-07): a new user is set up by Claude, not left to struggle, and a machine is checked once, not every session.

## How the check works
- `tools/dependencies.json` is the one list: Node.js 18+, Python 3, Git, Figma Desktop, each with its check and its install command per OS (`win32` = winget, `darwin` = Homebrew / Xcode tools) and a manual link. Add a dependency there, nowhere else.
- The SessionStart hook `.claude/hooks/setup_check.cjs` checks the list. Everything found -> it writes `.claude/.state/machine-setup.json` (git-ignored, this machine only) and says nothing; later sessions only compare that record with the list (no checks, no time). Something missing -> nothing is recorded and Claude gets the missing items with their install commands.
- The record is dropped and the check runs again when `tools/dependencies.json` changes, when the record is from another OS, or with `node .claude/hooks/run.cjs setup_check --force` (run this when a listed tool stops working). `--report` prints the table.
- Node.js is the exception: the hooks run on it, so it must be installed first (README > Setup step 1). Without Node.js no hook can run; tell the user to install it from https://nodejs.org (LTS) and restart Claude Code.

## Steps
1. Before the intake's first question (and in quick mode, before the task), say in one line which dependencies are missing and what each is for.
2. Ask (choice): "Set up the missing tools now?" "Set up now (Recommended)" (description: Claude runs the install commands below; approve each when asked) / "I'll install them myself" (description: show the commands and links) / "Later" (description: continue; steps that need a missing tool are skipped and named).
3. **Set up now:** run the install command from the context for each missing item, one at a time, in the order of the list. Windows: `winget`; if winget is missing (`winget --version` fails), give the manual links instead. macOS: `brew`; if Homebrew is missing, give the manual links (do not install Homebrew without a separate yes). A command that needs admin rights or opens an installer window: tell the user what will appear.
4. New programs reach Claude Code only after a restart (PATH). When the installs finish, ask the user to quit Claude Code fully and open it again in this folder. The next session start checks again and records the result; nothing else is needed.
5. Windows, Python: if `python` still opens the Microsoft Store or says "Python was not found" after the restart, the user turns off `python.exe` and `python3.exe` in Settings > Apps > Advanced app settings > App execution aliases. Until then scripts can run with `py -3`.
6. **Myself:** show each command and link, then continue as Later.
7. **Later:** continue. The check repeats at the next session start, because nothing is recorded until everything is installed. Any step that needs a missing tool (for example a `tools/*.py` script without Python) is skipped and named in one line.

Figma tools (FigCli Yolo, the Desktop Bridge) are not in this list: the preflight checks them next (0b checks 1-5) because the user runs their patch and token steps.
