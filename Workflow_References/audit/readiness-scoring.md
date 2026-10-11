# Readiness score (0-100 per component)

Adapted from [natdexterra/work-with-design-systems](https://github.com/natdexterra/work-with-design-systems) `references/inspect/readiness-scoring.md` (MIT). The weights and labels are theirs; the inputs are mapped to our ds-auditor build-mode checklist (`.claude/agents/ds-auditor.md`).

ds-auditor adds one score per component set and one file score to every `build` report. It is a triage signal (which component needs work first), not a quality grade. It never replaces the targets of 0 in the checklist: a checkpoint still needs every count at 0.

## Inputs (from the checklist)

| Term | Checklist lines | Range |
|---|---|---|
| `errors` | 1 remote variables, 2 raw values, 3 Semantic with raw hex, 4 detached / local copies, 6 unwired properties and coverage gaps, 13 off-limits violations, 14 wrong slot content | count per component |
| `warnings` | raw opacity, blur or shadow values; default-looking layer names that are not off-limits; missing docs fields from `component_docs.py check` | count per component |
| `states` | 5: required states present / required states (platform Main Skill) x 100 | 0..100 |
| `accessibility` | 8 contrast + 9 touch targets: checks passed / checks run x 100 (Light and Dark) | 0..100 |
| `naming` | 10 + 11: names, properties and group placement that pass / total x 100 | 0..100 |

`max_errors` and `max_warnings` are the largest counts of any component in the scope, at least 5 and 3 (so a file with 1-3 components does not score 0 on the error term).

## Formula

```
score = ( (1 - errors / max_errors)     * 2.0 * 100
        + (1 - warnings / max_warnings) * 0.6 * 100
        + states        * 3.0
        + accessibility * 1.0
        + naming        * 0.5 ) / 7.1
```

Why these weights: missing states are the most expensive failure (developers invent state styles), hardcoded values break theming and Dark mode, accessibility misses are usually fixable per component, raw opacity/blur is sometimes intentional, naming is cosmetic for rendering but matters for AI code generation.

Worked example: Button with 3 errors (file max 12), 1 warning (max 4), states 60, accessibility 75, naming 80: `(150 + 45 + 180 + 75 + 40) / 7.1 = 69` -> Needs work.

## Labels

| Score | Label | Meaning |
|---|---|---|
| 90-100 | Production ready | Every checklist count at 0 for this component. |
| 75-89 | Nearly ready | One focused pass. |
| 50-74 | Needs work | Several structural fixes. |
| 0-49 | Not ready | Treat as in progress. |

File score = mean of the component scores, same labels. Flag the spread when the standard deviation is above 15 (one weak component hidden by strong ones).

## In the report

- File score and label at the top, next to the checklist totals.
- One line per component: score, label and where it lost points (for example `Button 69 Needs work: states 60, 3 raw values`). Never print the formula.
- The previous report's score next to it, so the trend is visible.
- The score does not measure visual quality, missing components, Storybook coverage or adoption. Those stay in their own checks.
