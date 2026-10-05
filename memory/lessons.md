# Lessons (mistakes fixed, so they never happen again)

Every mistake Abdul reports or a check finds gets one entry here in the session that fixes it: what broke, the root cause, the rule now in the workflow, and the check that catches it. Read before building or updating anything of the same kind. Newest first.

## Storybook (Native_One_File_Pilot, 2026-10-05)
1. **Docs not translated in Arabic.** AR flipped the layout, but every docs text stayed English.
   Cause: the docs had one language. Rule: a Language mode other than the default translates the docs from `storybook/src/i18n/<mode>.json` (`templates/docs/I18n.tsx`); Figma names, code names and component texts stay exact. Check: `templates/mode_check.js` `untranslated` must be empty in that mode (its list is the missing keys to translate). Skill section 4 step 7 and 6b.
2. **iOS and Android shown side by side.** Component pages had an iOS and Android panel, Sizing had two platform columns, Code had two file tabs.
   Rule: one platform at a time; the user switches Platform to compare. Check: `mode_check.js` `bothPlatforms` false. Skill principle 9 (Mobile Adaptive).
3. **Arabic did nothing on docs pages.** Only components went RTL; docs pages stayed left to right, samples stayed English.
   Rule: an RTL Language mode makes docs pages and examples RTL, type samples Arabic, code / hex / Figma names isolated LTR. Check: `mode_check.js` `ltrInRtl` empty.
4. **Dark mode unreadable.** Docs headings, MDX text, cards and Storybook's ArgTypes tables stayed light-themed on a dark page.
   Cause: fixed light fallbacks when the DS had no token with the expected name, and blocks outside the DS colors. Rule: docs colors fall back to mixes of the DS text and background; MDX and ArgTypes take the DS colors. Check: `mode_check.js` `unreadableCount` 0 in every mode.
5. **Reported done after checking only Light / EN.** Rule: every docs page is checked in every combination of the toolbar modes before a Storybook is called done, plus one Dark and one RTL screenshot.
