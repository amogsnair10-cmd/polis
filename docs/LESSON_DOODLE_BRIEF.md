# Lesson doodles: 3 per lesson (cover + 2 key cards)

For each lesson of your subject, draw 3 SVG doodles:
1. **Cover**: the lesson's central idea. File `art/doodles/<subjectId>/L/<lessonId>.svg`
2. **Two key cards**: pick the 2 cards that carry the main ideas (usually the "Core idea" card and one key thinker / concept / process card; never the "Exam lens"/"Recap" card). File `art/doodles/<subjectId>/L/<lessonId>_<k>.svg` where k is the card's 0-based index in the lesson's `cards` array.

Lesson files: PSIR = `lessons/<id>.json` (subjectId `psir`); others = `subjects/<subjectId>/lessons/<id>.json`. Skip index.json and search.json.

## Drawing style (quality matters)
- A good illustrator's ink doodle: confident, expressive, recognisable at 120px, charming. Think editorial spot illustration in single-line ink.
- `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">`
- Black strokes only (the app recolours). Small solid accents allowed with `fill="#000"` (dots, eyes, tiny shapes). No text/letters/numbers, no gradients, no filters, no images.
- 8 to 30 paths. Use flowing cubic curves; slightly imperfect hand-drawn feel; add 2–4 small decorative touches (motion lines, sparkles, hatching, little stars) for life. 6px margin.
- Draw the specific idea, not a generic icon: e.g. Hobbes' Leviathan → a giant crowned figure made of tiny people over a town; Rawls' veil of ignorance → a figure behind a draped veil with scales; photosynthesis → leaf with sun rays, CO2 bubbles in, O2 bubbles out; Quit India → crowd with raised fists and a flag.
- Under 3 KB each. Valid XML.

## Workflow (keep it lean)
- One Python script per ~5 lessons: read each lesson's title and card headings only, then write its 3 SVG files. Don't re-read files you wrote.
- At the end run `node scripts/build.js` (must print ok). Don't commit. Reply with one line: lessons done and doodles written.

## Resume rule
Skip any lesson whose 3 doodle files already exist. Only draw what's missing.
