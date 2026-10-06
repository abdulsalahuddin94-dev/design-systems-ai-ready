# iOS polish rules for Figma (from "The Final 5%")

Source: heyimjames iOS Design Engineering Skills, `the-final-5-percent` (MIT, Copyright (c) 2026 James Frewin, https://github.com/heyimjames/ios-design-skills). Only the parts that change a Figma design system or a Figma screen are kept here, rewritten as checks. The original is about 135 KB of SwiftUI code (about 35K tokens per load); this file replaces loading it. Read it at the Components checkpoint, when writing component descriptions and before each Screens checkpoint (iOS Main Skill section 11).

Precedence: intake answers, `data/rules.json`, the iOS Main Skill (tokens, sizes, names) and the reference entry win over anything here. A number below is a guide: in Figma it snaps to the nearest existing token, or becomes a proposed Primitive/Semantic token with approval. Motion, haptics and sound are written into the component description (Usage Rules) and Storybook docs, never into variables.

## Typography
- Use the Dynamic Type text styles only (Large Title 34, Title 1 28, Title 2 22, Title 3 20, Headline 17 Semibold, Body 17, Callout 16, Subheadline 15, Footnote 13, Caption 1 12, Caption 2 11). A fixed size that should scale is a finding.
- Keep SF Pro's built-in tracking. Exceptions: all-caps labels get +1.2 to +2.0 pt; display sizes 60 pt+ may go -0.5 to -1.5.
- Line height: body about 1.4x, headlines about 1.15x, display (28 pt+) 1.1-1.2x.
- Hierarchy needs two sizes and two weights (for example 17 Regular + 22/28 Semibold). No Light weight under 20 pt. Body text is leading-aligned (right in RTL), never centered.
- A custom brand font is for display and section titles; body stays SF Pro (or the font the intake chose). Changing numbers (prices, timers, counters) use tabular / monospaced digits.

## Color and materials
- Foreground hierarchy uses the label roles, never raw opacity: Primary 100%, Secondary 60%, Tertiary 30%, Quaternary 18% (disabled, placeholder).
- Backgrounds: System Background for content, Secondary System Background for cards, System Grouped Background for settings and forms. True black (#000000) only for camera, photo and video surfaces.
- One accent per screen: only the primary action is tinted; secondary actions are neutral, tertiary are text only.
- Shadows are rare on iOS. If used: black at 6% (subtle, y 4 blur 8), 12% (card, y 8 blur 16), 18% (floating, y 12 blur 24), or tinted with the element's color. In Dark, lighter or none; use a 1 pt white 6% stroke for separation.
- Gradients: two stops at most, brand colors only, no purple-blue-pink.
- Materials (Ultra Thin to Ultra Thick) for floating overlays and sticky chrome; each needs an opaque fallback for Reduce Transparency (document it in the description).

## Spacing
- 4 pt grid: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Hero numbers and large titles get 24 pt or more above and below.
- Group by spacing, not lines: 4 pt inside a group, 16 pt between groups.
- Cards may take a little more bottom than top padding (16 / 20). Buttons: horizontal padding about 1.2x the font size, vertical about 0.6x.
- No layout shift between states: a selected tab keeps its width (color or opacity shows selection, not a heavier weight), badges overlay their icon, loading keeps the button width, skeletons match the real layout.

## Buttons
- Hit area 44 x 44 pt minimum, even when the visual is smaller (chips, icon buttons): add a hit-area frame in the component.
- Hierarchy: Primary (filled tint, one per screen), Secondary (tint at about 12%), Tertiary (text only), Destructive (red fill or red text), Icon only (44 x 44 with an accessibility label in the description).
- States: Default, Pressed, Disabled, Loading (spinner inside, same width), Success (past-tense label, check icon), Error ("Try Again"). Disabled always comes with a reason in helper text.
- Labels are specific verbs in Title Case with no final period: "Save Photo", "Delete Photo", "Buy for $9.99"; never "Submit", "OK", "Proceed", "Click here".
- Press motion for the description: scale 0.96 and opacity 0.85 on touch-down, light impact haptic on touch-down, spring back on release.
- Liquid Glass buttons (iOS 26+): only for floating controls (toolbar items, floating action buttons, picker controls); only the primary one is tinted; never glass on glass.

## Sheets and presentation
- Sheet for transient tasks, push for hierarchy, full-screen cover for a different mode (camera, player), menu for fewer than 6 actions, confirmation dialog for 1-3 destructive choices, alert only for critical blocking messages.
- Heights: quick confirm about 25% or 220 pt, picker Medium, filters Medium then Large, forms and compose Large. Stacked sheets must differ visibly in height (25% or more).
- A draggable sheet shows the grab handle; a fixed one has a close button. Sheet corner radius matches the card radius token.
- Confirmation copy names the action: title `Delete "Sunset.jpg"?`, button `Delete Photo`, message "This can't be undone.", Cancel last.

## Loading, empty and settings screens
- Every list or card component that loads data gets a Skeleton variant with the same structure (avatar circle, title and subtitle bars).
- Nothing under 500 ms; 0.5-2 s a small inline indicator; over 2 s a progress bar or the system spinner. No custom spinners.
- Empty states have three parts: symbol or illustration, one warm line that says what to do, one primary action. Separate variants for no results (repeat the query), first use, error (with retry) and locked feature.
- Settings use grouped sections with footers for context; Sign Out and Delete Account in their own last section, in red; About section last.

## Microcopy
- Say less, use the user's words, be specific ("Saved to Inbox").
- Title Case for navigation titles, section headers and buttons; sentence case for body, hints and descriptions. No terminal period on buttons, titles and toasts; full sentences end with a period.
- Errors are recoverable: "We couldn't load this. Tap to retry."

## Accessibility (also in the checkpoint audit)
- Contrast 4.5:1 for text, 3:1 for large text and UI, in every mode the project has. Color is never the only signal (error = color + icon + text).
- Test text styles at the largest accessibility size: buttons use minimum height (not fixed), horizontal rows can wrap, labels can take two lines.
- Every icon-only control has a VoiceOver label (and hint when needed) in its description; a cell reads as one element.
- Every animation has a Reduce Motion alternative (short crossfade); every material has a Reduce Transparency fallback.

## Liquid Glass (iOS 26+)
- Glass only for the floating control layer (tab bar, toolbar, floating buttons, sheets); never for page backgrounds or cards.
- Tint the primary action only; others stay clear glass. Don't stack glass on glass (glass nav bar + glass button + glass card).
- Floating bars use a capsule shape, floating buttons a circle. Effect styles: `glass/regular`, `glass/prominent`, `glass/clear` (iOS Main Skill section 4).

## Screen review checklist (before the Screens checkpoint)
- [ ] Text styles only, no fixed sizes; tracking only on all-caps; body leading-aligned.
- [ ] Label roles for text hierarchy; semantic backgrounds; one tinted action per screen.
- [ ] 44 pt hit areas; no layout shift between states.
- [ ] Loading, empty and error states exist for every data screen, with real copy.
- [ ] Buttons and dialogs use specific verbs; capitalization consistent.
- [ ] Sheets use the right presentation and distinct heights.
- [ ] Glass only on floating controls; Reduce Motion and Reduce Transparency noted.
- [ ] Every screen (settings, empty, error, onboarding) gets the same care as the main one.
