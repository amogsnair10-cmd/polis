# Expansion brief: add about 30 NEW lessons to one subject

You are adding lessons to a UPSC/learning app. Read `docs/WRITER_BRIEF.md` (short) and follow its JSON shape, style, diagram, fact and budget rules.

## Rules for new lessons
- Add about 30 NEW lessons. Do NOT make existing lessons longer.
- APPEND ONLY so readers' progress stays valid: add new lesson titles at the END of an existing unit's list, or add new units at the END of a section's `units` list. Never reorder, rename or delete anything that exists.
- A lesson id is `<section>-<unit>-<lesson>` (0-based). After appending, the new ids follow from the new positions.
- Choose topics that fill real gaps: frequently asked PYQ themes and thinkers for exam subjects; the most fascinating missing stories/concepts for the others. Mark a new unit "asked often" (third value 1) only if it truly is.
- First edit the syllabus file, then write each new lesson file, then run `node scripts/build.js` and `node scripts/lint.js <DIR>` and fix issues in YOUR new files only.
- Do not commit. Final reply: the list of new lesson titles grouped by unit, plus facts you could not verify. Keep it short.

## Never pad
If lint says a card is thin, add specific facts about THAT card's topic. Never add generic study tips or the same sentence to several cards.
