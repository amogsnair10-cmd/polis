# Doodle brief: one line-art doodle per chapter

Make one small SVG doodle for each chapter (unit) of the subjects you are given.

File: `art/doodles/<subjectId>/<section>-<unit>.svg` (0-based indexes into that subject's syllabus.json; PSIR's syllabus is `syllabus.json` at the repo root, subjectId `psir`; others are `subjects/<id>/syllabus.json`).

Style (must be consistent everywhere):
- Hand-drawn ink doodle, like a margin sketch in a good notebook. Single colour.
- `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` — black strokes only (the app recolours it), no fills except tiny dots (`fill="#000"` allowed on circles under r=3), no text, no gradients, no filters, no images.
- 4 to 14 paths. Slightly imperfect, organic lines (use quadratic/cubic curves, not perfect geometry). Keep a 6px margin inside the 120 box.
- Must read clearly at 36px: one clear central idea per chapter. E.g. Plato chapter → a Greek column with a scroll; Federalism → three interlocking circles under a dome; Monsoon → cloud with rain and an arrow; Black holes → swirl with a dark core; DNA → a short helix.
- Under 2 KB each. Valid XML.

Work in batches with one Python script per subject writing all its files. Don't re-read files you wrote. Don't touch anything else. When done, run `node scripts/build.js` (must print ok). Don't commit. Reply with one line: how many doodles per subject.

## Resume rule
Skip any doodle file that already exists.
