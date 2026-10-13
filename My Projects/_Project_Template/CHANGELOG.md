# <Project> - Changelog

What was built or changed in Figma, newest first. Every build or Figma change session adds one entry with `Storybook synced: no`; a Storybook update marks the entries `yes` (`python tools/project_status.py "My Projects/<Project>" --mark-synced`). The daily check reads only this file and `status.json`, never Figma.

Entry format:

```
## YYYY-MM-DD - <what, e.g. Components: Button, Input Field>
- Storybook synced: no
- Tool: <Claude Code / Codex / Cursor / Antigravity / ...>
- Changed: <components, variables or styles added, changed or removed>
- Figma file: <name>
- Library published: <yes / no> (DS changes only)
- Design files updated (Accept updates): <name: yes / no, one per linked Design file>
- Phase: <Intake / Foundation / Components / Screens / Storybook / Quick task> (one entry per phase session)
- Tokens: <from `python tools/session_cost.py`, run at the end of the session; `--since <date>` when the phase took several sessions>
- Time: <active time from the same command>
- Deprecated / Removed: <name -> replacement, usage count> (only when something was deprecated or removed; `Workflow_References/governance/deprecation.md`)
```
