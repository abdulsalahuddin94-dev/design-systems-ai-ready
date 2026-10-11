# Drift score (one number, with history)

Adapted from [MUZEEBURRAHAMAN/design-system-skills](https://github.com/MUZEEBURRAHAMAN/design-system-skills) `skills/ds-report.md` (MIT, a fork of NewMediaStudio's design-system-skills). Their weights compare Figma with React code; ours compare the Figma DS file with what the workflow saved about it, and with the Storybook when the project has one. Figma is the source: every difference is drift in the saved files or the Storybook, never "Figma is out of date".

ds-auditor computes it in `drift` mode (`.claude/agents/ds-auditor.md`) and appends it to `<project>/audits/drift-history.json`.

## Formula (target 0%)

```
Component drift % = (1 - components in full parity / components in Figma or the registry) x 100
Token drift %     = (variables added, removed, renamed or changed per mode / variables in Figma or tokens.json) x 100
Docs drift %      = (Figma descriptions that differ from `tools/component_docs.py <folder> figma` + `... check` gaps) / components x 100
Storybook drift % = 100 - fidelity % from `tools/style_parity.py` (0 when the project has no Storybook)
Overall drift %   = 50% component + 25% token + 15% docs + 10% Storybook
```

A component is in full parity when its name, variants, properties and slots match `data/component-registry.json`, and (with a Storybook) its stories match the same names (`tools/storybook_parity.py`). A component in Figma but not in the registry, or in the registry but no longer in Figma, counts as drift.

Without a Storybook, the weights become 55% component, 28% token, 17% docs.

## History

`audits/drift-history.json`:

```json
{ "history": [
  { "date": "2026-10-11", "overall": 3.7, "component": 1.8, "token": 5.2, "docs": 4.0, "storybook": 0, "figma_version": "<version id or null>" }
] }
```

- Trend = this overall minus the previous one; show it as up / down / same with the number.
- Keep every entry (the file is small); never rewrite old ones.
- The weekly drift audit (`.claude/scheduled/weekly-drift-audit.md`, off by default) reads the last entry to decide whether to report.

## In the report

One line at the top: `Drift 3.7% (down 1.2 since 2026-10-04): components 1.8, tokens 5.2, docs 4.0, Storybook 0`. Then the existing drift-mode lists, each item with the fix (resync tokens, regenerate descriptions, resync Storybook).
