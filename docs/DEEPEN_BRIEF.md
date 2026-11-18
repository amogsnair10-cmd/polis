# Deepen brief: add depth to EXISTING lessons (for Haiku workers)

The owner finds lessons fun but too short and too condensed. For each lesson in your list, ADD, never remove:

## 1. One new card "Go deeper"
- Insert it as a new card in `cards`, directly BEFORE the card tagged "Recap". Use `"tag":"Go deeper"`, a specific heading `h`, 180-260 words in `b`.
- It must add NEW substance about THIS lesson's topic: the "why" behind the idea, a second worked example, a sharper distinction, a famous case or number, or a common exam trap. Not a repeat of an existing card, no study tips, no padding, no all-caps.
- For maths/physics/chemistry lessons include one fully worked numeric example, step by step, one step per line.
- For UPSC subjects (psir, history, geography, environment, world, communism) end with a short "How it is asked" line (prelims angle and mains angle in one sentence each).

## 2. Make formulas readable (maths/physics/chemistry/quantum/astronomy/biology only)
Wherever a card has a formula in a `<div class="box">`, keep it as it is (the app typesets it). Right AFTER that box add a short `<p>` that starts with "Here" and says what each symbol means with its unit, e.g. `<p>Here F is the force in newtons, m the mass in kilograms and a the acceleration in metres per second squared.</p>`. If a `<p>` right after already does this, leave it.
Write formulas in plain words exactly like the existing ones: `F = m x a`, `v = u + a t`, `s = u t + (1/2) a t squared`, `square root of (...)`, `x` for times, `/` for division. One formula per line, lines separated by `<br>`.

## Rules
- Edit each lesson JSON in place with a Python script (`json.load`, change, `json.dump(..., ensure_ascii=False, indent=1)`). Do not touch `quiz`, `id`, `title`, `sources` or any other card. Keep every existing card exactly as it is except the "Here ..." sentences.
- Body HTML only: `<p> <b> <i> <ul>/<ol> <li>`, `<div class="box"><h4>..</h4>..</div>`. No SVG in the new card.
- Every fact must be right. If you are not sure of a number or date, leave it out or say "about". Do not invent quotes, statistics or case names.
- Plain, short sentences for a phone screen. Someone who is weak at maths should be able to follow.
- Do not commit. Skip a lesson that already has a "Go deeper" card. After your batch run `node scripts/build.js` once; it must print ok.
- Final reply: lesson ids done and any facts you were not sure about. Nothing else.
