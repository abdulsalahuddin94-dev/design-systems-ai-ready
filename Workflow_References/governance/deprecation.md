# Deprecating a component, variant or token

Adapted from [murphytrueman/design-system-ops](https://github.com/murphytrueman/design-system-ops) `skills/deprecation-process` (MIT), cut down to what a Figma DS in this workflow needs. Use it when a component, variant, property or variable is replaced or removed in a DS file that Design files or a Storybook already use. Renaming inside a project that has no screens yet is not a deprecation: just rename and log it.

A deprecation is a promise to the people using the DS: they are told, they get a replacement, and nothing disappears from under them. Removing a library component that screens still use leaves them as detached-looking local copies after Accept updates.

## 1. What and why

Ask (choice) only what the request does not say: "What replaces it?" "<the closest existing component> (Recommended)" / "Nothing, it is removed" / "Back". Write a decision record (`decision-record.md`) with the reason.

## 2. Count the usage (read-only)

- Every Design file in `status.json > figma.design_files`: instances of the item per page (FigCli Yolo `eval` with `FIGMA_FILE` set, a read-only script), plus nested use inside other DS components (a Molecule that uses a deprecated Atom must migrate first).
- Variables: which components, styles and screens bind it (the Variable Map's "Used in" column when it exists).
- Storybook: stories and Docs pages that show it; code: the `Code:` line in its description.
Report the numbers. 0 uses -> skip to step 5 (remove at once, still logged).

## 3. Mark it, in Figma and everywhere else, in one pass

- Figma: prefix the name with `[Deprecated] ` and add a first description line `Deprecated: use <replacement>. Removed after <date or next major update>.`; for a variable, the same in its description and `hiddenFromPublishing = true` once nothing new should bind it. Do not move or detach it yet.
- Registry `docs` block: `"deprecated": { "replacement": "<name>", "remove_after": "<date>" }` so the Figma description, `components.md` and the Storybook Docs page all show it (the Storybook shows a Deprecated badge and the replacement).
- `CHANGELOG.md`: a `Deprecated:` line in the entry, plus the usage numbers.
- Publish the library and list the Design files that need Accept updates (section 7c to-do list).

## 4. Migrate

- Swap each instance for the replacement (`swapComponent` after resetting overrides; see the instances rules in `.claude/skills/figma-plugin-api-rules/references/instances.md`), carrying text, booleans and swaps over by property name; one Design file at a time, ds-auditor screens mode after each.
- Variables: rebind to the replacement (`.claude/skills/fix-variable-bindings`), never delete a bound variable.
- Anything that cannot migrate the standard way is listed with the reason and an agreed plan.

## 5. Remove

Only when the usage count is 0 in every Design file (recount, do not trust the earlier number): delete it from the DS file (Ask (choice) "Remove it now (Recommended)" / "Keep it deprecated" / "Back"), remove the registry entry and stories, publish, Accept updates, log `Removed:` in `CHANGELOG.md`, run ds-auditor drift mode. Never in an original reference template.

## Rollback

Until step 5, un-deprecating is just removing the prefix and description line; say so in the decision record. After removal, restore it from the Figma version history (the version id is in the CHANGELOG entry).
