# Workflow references

Ready-made guides the workflow loads at one step, taken from public MIT-licensed agent-skill repos on GitHub (studied 2026-10-11) and adapted to our rules, so we did not have to write them from scratch. Each file names its source at the top; the license texts are in `licenses/`. Our own rules (`memory/decisions.md`, `memory/lessons.md`, the platform Main Skills) win wherever a file differs.

Load only the file the current step needs (token budget, Intake section 0c).

| File | Used at | Source (MIT) |
|---|---|---|
| `audit/readiness-scoring.md` | ds-auditor build mode: a 0-100 score per component and per file | natdexterra/work-with-design-systems |
| `audit/drift-score.md` | ds-auditor drift mode: one drift % with history in `audits/drift-history.json` | MUZEEBURRAHAMAN/design-system-skills (fork of NewMediaStudio) |
| `ux/README.md` + `ux/*.md` | Screens (Intake 7e, 7f): rules per screen content (forms, tables, search, navigation, states, loading, copy, accessibility...) in the screen spec and the critique | schudarin/chudarin-figma-skills |
| `governance/deprecation.md` | Replacing or removing a component, variant or variable that screens use | murphytrueman/design-system-ops |
| `governance/decision-record.md` | Token, property or breaking changes and trade-offs, in the project's `docs/decisions.md` | murphytrueman/design-system-ops |
| `ai-readiness.md` | Background: what "AI-ready" means and why descriptions, tokens and checks matter | murphytrueman/design-system-ops |

Also adopted from the same study, outside this folder:

| Where | What | Source (MIT) |
|---|---|---|
| `.claude/skills/figma-plugin-api-rules/` | About 370 real Plugin API failures with their fix, loaded before any Figma write script (FigCli eval, figma_execute or use_figma), one topic file at a time | schudarin/chudarin-figma-skills |
| `.claude/skills/fix-variable-bindings/` | Scan, report, approve, rebind for unbound typography, spacing, radius and colors | schudarin/chudarin-figma-skills |
| `tools/figma_helpers.figma.js` `DS.readBack` + `.claude/hooks/audit_reminder.cjs` | Per-write check: every write script reads its bindings back; the hook reminds at once when one did not (FigCli eval included) | chudarin hard rule 7; claude2figma's post-write QA idea |
| `Design_System_Intake_Skill/steps/plan-user-flows.md` | 7e.0 flow map: every screen, state and decision before the gap table | schudarin/chudarin-figma-skills |
| `tools/design_md.py` | `DESIGN.md` + an `AGENTS.md` block per project for coding agents | MUZEEBURRAHAMAN/design-system-skills, google-labs-code/design.md format, natdexterra code export |
| `tools/lint_token_names.cjs` + `tools/token_lint_rules.json` | Token name linter with an exit code (Fix on create, finish, Team CI) | michaelwnau/figma-design-system-engineering |
| `tools/component_docs.py` (`behavior`, `avoid`, `props_map`, `deprecated`) | Richer Figma descriptions for agents reading them over MCP | natdexterra component-description template, design-system-ops AI component description |

Not adopted: tools that write React code or treat code as the source (our Figma is the source), Component-specific token tiers, and plugin-install instructions.
