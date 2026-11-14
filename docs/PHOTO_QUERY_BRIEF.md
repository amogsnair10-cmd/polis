# Photo queries: pick one Wikipedia article per card

Goal: for each lesson, choose the English Wikipedia article whose lead photo would best illustrate the cover and each teaching card.

Input: lesson files of your subject (PSIR = `lessons/<id>.json`, others = `subjects/<id>/lessons/<id>.json`; skip index.json and search.json). Read title + each card's `h` and the first ~200 characters of `b`.

Output: `art/photo_queries/<subjectId>.json`, one object:
`{"<lessonId>": "Article title", "<lessonId>_<k>": "Article title" | null, ...}`
- `<lessonId>` = cover. `<lessonId>_<k>` = card k (0-based index in `cards`).
- Use null for "Exam lens", "Recap", "How UPSC asks this", quick-revision or pure-list cards.
- The title must be a real, specific English Wikipedia article you are confident exists, e.g. "Bhimbetka rock shelters", "Battle of Plassey", "Jean-Jacques Rousseau", "Photosynthesis", "Chilika Lake". Prefer a concrete person, place, event, object, artwork or phenomenon over an abstract concept article (abstract articles rarely have photos). Hard, grim history is fine.
- Avoid repeating the same article within a lesson.

Workflow: one Python script that loops lessons, with your chosen titles written into a dict inside the script (do it in batches of ~10 lessons per script run, appending to the JSON). Don't print lesson bodies you don't need. Reply with one line: lessons and entries written.
