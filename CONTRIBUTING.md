# Sharing what you learned (contributions)

The workflow gets better from every project. When something went wrong and you found the fix, or you found a better way to do a step, share it so the next person never hits the same problem. Abdul reviews every contribution before it becomes part of the workflow (`memory/lessons.md`, `memory/decisions.md` and the matching skill or tool).

In Claude Code: run `/contribute` (or say "share a lesson"). Claude asks a few questions, writes the entry for you and sends it. Other AI tools follow this file directly. Without any AI tool: open an issue with the **Lesson** or **Rule or improvement** form on GitHub.

## 1. What can be shared

| Kind | Example | Lands in (after review) |
|---|---|---|
| Lesson (a mistake and its fix) | "Dark screens turned Light after moving them into new sections" | `memory/lessons.md` + the skill or tool that now prevents it |
| Rule or decision | "Radio groups hold 2 to 6 options; 7 or more use Select" | `memory/decisions.md` + the skill that applies it |
| Improvement to a skill, step or tool | "The screens step should capture after chart animations finish" | that skill, step file or tool |

A question or a bug you could not fix is not a contribution yet: ask in a Claude session first, or open a plain issue.

## 2. Steps (Claude Code `/contribute`, any other tool the same way)
Every question with options is an Ask (choice) (other tools: a numbered list, recommended first). Every menu after the first ends with "Back" (Intake section 0).

1. **Kind**, Ask (choice): "What do you want to share?" "A lesson from a mistake (Recommended)" (description: something broke, you found the cause and the fix) / "A rule or decision" (description: a standing choice every project should follow) / "An improvement to a skill or tool" (description: a better way to do an existing step). When the session just fixed a mistake, skip this question: it is a lesson, prefilled from the session.
2. **The facts**, asked one at a time, skipping anything the session already knows. Lesson: what broke (what you saw), the cause, the rule that prevents it, the check that catches it next time, and the platform (Web / iOS / Android / all). Rule: the rule in one sentence, why, and where it applies. Improvement: which skill or step, what to change, and why.
3. **Check it is new:** search `memory/lessons.md`, `memory/decisions.md` and the named skill for the same problem or rule. Already covered -> say where, in one line, and Ask (choice) "Add it as more evidence" / "Drop it" / "Back". Conflicts with a standing decision -> say which one; the contribution is still sent, marked `Conflicts with: <decision>`, and Abdul decides.
4. **Write the entry** in the exact format of its file: a lesson as a numbered item with the bold title, then `Cause:`, `Rule:` and `Check:` (see the newest entry in `memory/lessons.md`); a rule as one bullet with `(<name>, <date>)` like the entries in `memory/decisions.md`. Name the files the fix should change.
5. **Make it safe for a public repo.** This repo is public. Remove client and product names, Figma file keys and links, people's names other than the contributor, tokens, emails and machine paths (use relative paths, "a DS file", "a healthcare project"). Screenshots only when the contributor confirms they show nothing private.
6. **Show the exact text** and Ask (choice): "Send it (Recommended)" (description: opens it on GitHub for Abdul's review) / "Edit it" / "Keep it on this machine" (description: saved in `contributions/`, nothing sent) / "Back". Nothing leaves the machine without "Send it".
7. **Send it**, the first way that works:
   - **Issue** (default, works for everyone with a GitHub account): `gh issue create --repo abdulsalahuddin94-dev/design-systems-ai-ready --title "[Lesson] <title>" --body-file <file> --label contribution` (`[Rule]` or `[Improvement]` for the other kinds). If the label is refused, run it again without `--label`.
   - **Pull request** (only when the contributor can push to the repo and wants to propose the exact edits): a branch `contrib/<YYYY-MM-DD>-<short-name>` from the latest `master`, the entry added to its memory file and the skill or tool change, one commit, `gh pr create --draft` with the same title and body. Never push to `master`.
   - **No GitHub CLI or not signed in:** save the text in `contributions/<YYYY-MM-DD>-<short-name>.md` (git-ignored) and give the link `https://github.com/abdulsalahuddin94-dev/design-systems-ai-ready/issues/new/choose` to paste it into the matching form. Never put the text in the URL.
8. **Confirm** in one line with the link, and say that Abdul reviews it before it becomes part of the workflow. The contributor's local `memory/` files stay unchanged, so their next pull has no conflicts.

## 3. Review (Abdul only: `/contribute review`)
Only the repo owner runs this (the `gh api user` login matches the owner in `git remote get-url origin`); anyone else is told that reviews are Abdul's.

1. List open contributions: `gh issue list --label contribution --state open` and `gh pr list --label contribution --state open` (also titles starting `[Lesson]`, `[Rule]`, `[Improvement]` without the label). None -> say so and stop.
2. For each one, oldest first, show in a few lines: what it says, where it would land, any duplicate or conflict with `memory/decisions.md` / `memory/lessons.md`, and the skill or tool change it needs. Then Ask (choice): "Accept (Recommended)" (description: add it and fix the matching skill or tool) / "Edit, then accept" (description: type what to change in Other) / "Decline" (description: closes it with your reason) / "Back". Recommend "Decline" instead when it conflicts with a standing decision or is already covered.
3. **Accept:** on a branch from the latest `master`, add the entry to its file (newest first, today's date, `(contributed by <GitHub login>)` after the title), apply the rule in the matching skill, step or tool (the lessons rule: a fix never depends on memory alone), update `docs/` when a user would see the change (FAQ, getting started, workflow map), then one draft PR whose body says `Closes #<n>`. A contribution PR that is already right is reviewed and marked ready instead.
4. **Decline:** ask the reason (typed), then comment it on the issue or PR and close it. Comments and closing happen only after Abdul's choice in step 2.
5. End with one line per contribution: accepted (PR link), declined, or skipped.

## 4. What reviewers check
- It is a real, repeatable problem or a clear rule, with a cause and a check, not a one-off preference.
- It fits the standing decisions, or says which one it changes and why.
- The fix is in the skill or tool too, not only in memory.
- Nothing private (step 5 above).
