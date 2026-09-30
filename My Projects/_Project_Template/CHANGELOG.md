# <Project> - Changelog

What was built or changed in Figma, newest first. Every build or Figma change session adds one entry with `Storybook synced: no`; a Storybook update marks the entries `yes` (`python tools/project_status.py "My Projects/<Project>" --mark-synced`). The daily check reads only this file and `status.json`, never Figma.

Entry format:

```
## YYYY-MM-DD - <what, e.g. Components: Button, Input Field>
- Storybook synced: no
- Changed: <components, variables or styles added, changed or removed>
- Figma file: <name>
```
