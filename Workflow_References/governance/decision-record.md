# Decision records (why, not only what)

Adapted from [murphytrueman/design-system-ops](https://github.com/murphytrueman/design-system-ops) `skills/decision-record` (MIT). Records go in the project's `docs/decisions.md`, newest first (workflow-wide decisions stay in `memory/decisions.md`). `CHANGELOG.md` says what changed; a decision record says why, so the same debate does not come back and a later session does not undo a choice it cannot see the reason for.

## When to write one

Write a record when any of these is true:
- It changes a token name, value or alias that live screens use, a naming convention, or a component's properties.
- It deprecates or removes something (`deprecation.md`).
- It is a trade-off where reasonable people could disagree (one file vs a library, a component-specific token, a size that breaks the scale).
- Someone asked "why is it like this?" and the answer was not written down, or the same question came up twice.

Skip it when the choice follows an existing rule with no exception, or is easy to undo and nobody else is affected. Scenario C approvals, Fix on create results and recolors already have their own log lines; link them instead of repeating.

## Format

```
## <NNNN> <title> (<YYYY-MM-DD>)
Status: Proposed / Accepted / Declined / Superseded by <NNNN>
Decided by: <name>   Written by: <Claude Code / Codex / name>

Context: <2-4 sentences: the situation and the constraints at the time, without making the outcome look inevitable>
Drivers: <3-5 forces that decided it: a rule, a deadline, a platform guideline, the user's preference>
Options: <each option really considered, why it was viable, why it was not chosen; mark the chosen one>
Decision: <one sentence, then 2-4 sentences of reasoning, including the trade-off that was accepted>
Impact: <only for token, property or breaking changes: components, variables, Design files and screens affected (counted, or "not measured"), what has to migrate>
Consequences: <what gets easier, what gets harder, any new rule for later work>
Related: <CHANGELOG entry date, audit report, earlier records>
```

Record only reasons the user gave or that appear in the sources (intake answers, the thread, audit reports). Where a reason is missing, write `[unknown, ask <who>]`; never invent a plausible reason, because later readers will treat it as fact. When a later record replaces this one, set this one's status to `Superseded by <NNNN>`; never delete records.
