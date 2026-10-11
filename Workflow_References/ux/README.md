# UX rules for screens

Adapted from [schudarin/chudarin-figma-skills](https://github.com/schudarin/chudarin-figma-skills) `skills/design-screens/references/ux-rules.md` and `ux/*.md` (MIT, copyright Sergey Chudarin, copied 2026-10-11). The topic files are unchanged except for path fixes; this index is adapted to our Screens phase.

**In this workflow (Design_System_Intake_Skill section 7e, 7f):**
- **Before a screen is built**, its screen spec (7f) gets the rules from the rows below that match what the screen holds, next to the Impeccable `shape` plan. A rule met for the first time at the audit has already cost a rebuild.
- **After it is built**, the same rules are read as criteria during Impeccable `critique` and the ds-auditor screens pass. "Read" rules are numbers and node properties; "Look" rules need the screenshot.
- Our rules win where they differ: values always bind to DS variables (never raw), screen sizes from 7d, Radio up to 6 options then Select, our platform Main Skills (HIG, Material 3, Tailwind). Where a file mentions `design.md`, `briefs.md`, `checks.md` or `state.md` (the original skill's files), read our screen spec, Impeccable passes and ds-auditor instead.
- Token budget: load only the matching rows, plus `spacing.md` and `accessibility.md`, which apply to every screen.

## Routing: what to read when

| The screen contains | Read |
|---|---|
| prose — hints, messages, descriptions, empty-state text | `copy.md` |
| what a control is *called* — button, link, menu item, a dialog's answers | `labels.md` |
| a field, a form, validation, one step of a multi-step flow | `forms.md` |
| *which* control, and how it behaves — pickers, panels, targets, gestures | `controls.md` |
| saving, cancelling, deleting, acting on a selection | `actions.md` |
| anything that can be missing or can fail | `states.md` |
| anything that arrives asynchronously | `loading.md` |
| a hint, a hover explanation, an onboarding tour | `tooltips.md` |
| real data — names, amounts, dates, long strings, paragraphs | `content.md` |
| rows of the same kind of thing — a table, a list of records | `tables.md` |
| a search field, filter controls, a saved query | `search.md` |
| a place inside a flow, an overlay, a set of screens to move between | `navigation.md` |
| anything that appears, disappears, expands or moves | `motion.md` |
| more than one screen width — so, nearly always | `responsive.md` |
| any padding, gap, margin or position — so, always | `spacing.md` |
| anything at all | `accessibility.md` |

Load only the rows that match — except the last two, which have no exemption: every screen has
text, targets, states and distances.

**One file is not like the others.** `principles.md` holds the *why* — Hick, Miller, Fitts, one
accent per screen, what the default costs. Those change what you choose while building (step 3),
they cannot be checked off a finished screen, and they must never be reported as Accuracy findings.
Read it when composing something new or when a direction has been rejected and you need to know
what to change; skip it for a one-element edit.

## How each rule is written

Principle first, then how to verify it. Verification is one of two kinds, and the Accuracy pass
treats them differently:

- **Read** — verifiable without judging the render: node properties, numbers, or the strings
  themselves. A finding names the node and the value it holds; no taste is involved.
- **Look** — verifiable only on the render. Say what you looked at and what you saw; "looks fine"
  is not a result.

A rule with no verification line is not finished. Write one before adding it. (`principles.md`
is the exception, and says so at the top: its entries carry "use it when" instead, because they
inform a choice rather than judge a result.)

Some rules add **Blocking:** — the screen does not go to the user with that defect unfixed, and the
critic's verdict is FIX-FIRST rather than a listed finding. Everything unmarked is an ordinary
finding: real, fixable, not a stop. Two levels, because four invite arguing about which is Medium.

Where a rule holds only on one kind of device, it says so in italics — *Touch:*, *Pointer:*,
*Mobile:*. A rule with no marker holds everywhere.

**Rules that speak of tokens assume the product has them.** This skill works on products with no
design system too . There, the same rule applies to the values
themselves — one scale, one set of colours, recorded in `design.md` — and "not bound to a variable"
is not a finding. What stays a finding either way is a value that matches nothing else on the
screen.

## Growing this set

A rule belongs here when it is true **outside** the product it came from. A rule that is true only
for one product is a signature trait: it goes into that project's `design.md`
, never here — putting it here would push one product's
taste onto every other product this skill touches.

Split a topic file when it stops being one topic — when the routing row would need an "and" to
describe it. Around 120–140 lines is the signal to check, not the rule itself: `states.md` split
into states and loading because the wait and the failure are different questions, not because of a
line count.
