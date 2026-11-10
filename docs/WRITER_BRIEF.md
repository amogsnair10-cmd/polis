# Writer brief (send this, not HANDOFF.md, to lesson writers)

You write lessons for a UPSC phone app. Audience: aspirants aged 22–30, reading on phones.
Subject folder: `<DIR>` (PSIR is the repo root; others are `subjects/<id>/`). Titles are in `<DIR>/syllabus.json`.
Lesson id = `<section>-<unit>-<lesson>` (0-based indexes into syllabus.json). File: `<DIR>/lessons/<id>.json`.

## Shape (JSON)
`{"id","title","emoji","cards":[{"tag","h","b","cls"?}],"quiz":[{"q","o":[4],"a":0-3,"w"}],"sources":[],"verified":"YYYY-MM-DD"}`

- 10–14 cards, ~120–200 words each. Split, don't cram.
- Order: "Why this matters" → core idea → 2–4 key-idea/thinker cards (book or source + year + claim) → debate/critique → tag "Indian angle" → tag "Exam lens" with `"cls":"exam"` (PYQ-style questions + answer structure), always last.
- Body HTML only: `<p> <b> <i> <ul>/<ol> <li>`, `<div class="box"><h4>..</h4>..</div>`, `<div class="quote">..</div><div class="who">..</div>`.
- One inline diagram where useful: `<svg class="d" viewBox="0 0 320 H">`, text ≥10px, labels inside boxes, unique marker ids. Colours: ink #1d2433, grey #5d6474, gold #a8792a / #f1e4c6, teal #2f6f7a / #dceaec, red #a3362a / #f4dcd5.
- Exactly 10 quiz questions, 4 plausible options, vary the answer position, no repeats.
- Plain, short sentences. Full exam depth: names, years, Articles, cases, numbers. No all-caps.

## Facts
- Every fact must be right. Quote only short phrases you are sure of; otherwise paraphrase.
- Search the web only for facts after 2022 or anything you doubt (≤2 searches per lesson; ≤3 for current affairs). Say "as of <year>" for anything that changes.

## Budget rules
- Write each lesson in ONE step (a Python script with `json.dump(..., ensure_ascii=False, indent=1)`).
- Run `node scripts/build.js` once per lesson. Do not re-read finished lessons or other people's files.
- Do not commit. Final reply: lesson ids written + facts you could not verify. Nothing else.
