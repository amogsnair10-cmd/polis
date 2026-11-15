# Dynamic UPSC-style questions from user patterns

Status: draft for decision. Written 15 Nov 2026. Companion to `docs/PAID_PLAN.md`.

## 1. The honest answer

Training or fine-tuning a tiny model to write questions is **not the reliable route**.

- A small model does not know facts reliably. It will invent a year, an Article number or a thinker's claim, and sound sure of it.
- Training needs thousands of checked examples. We do not have them.
- Even a well-trained model still needs every question checked. So the checking work stays.

Reliability comes from **grounding**. Store the facts once, checked, with sources. Build questions from those facts with code, so the right answer is taken from data and not guessed. Use an LLM only for wording and for suggesting plausible wrong statements, and always check its output with a second pass.

A small model still has a job, but as a **ranker**, not a writer: deciding which fact a user should see next (section 4).

## 2. Architecture

**(1) Fact bank.** Break each lesson into atomic facts. One fact = one checkable claim.

```json
{
  "id": "F-0101",
  "entity": "Article 352",
  "attribute": "grounds for proclaiming national emergency",
  "value": "war, external aggression or armed rebellion",
  "year": "1978 (44th Amendment)",
  "source": "Constitution of India, Art. 352(1); 44th Amendment Act 1978",
  "lesson": "<lesson id where it is taught>",
  "checked": "2026-11-20",
  "check_by": ["strong model", "human spot check"]
}
```

- A stronger model extracts the facts. A second model checks each one against the lesson text and the source.
- A human spot-checks about 1 in 10, and every fact that the two models disagree on.
- Expected size for PSIR: roughly 150 lessons times 15 to 20 facts, about 2,000 to 3,000 candidates, fewer after removing duplicates (estimate).

**(2) Deterministic generators.** Code builds UPSC-style formats from the fact bank. The answer key is computed from the stored `value` fields, so it cannot drift.

Formats to build first:
- "Consider the following statements": pick statements, mark each true or false, then the options are "1 and 2 only", "2 and 3 only", "1 only", "all of these", and so on. The correct option is computed.
- "How many of the above are correct?" (counts from the same marked set).
- Match the pairs (entity to value, from the same attribute).
- Chronological order (from `year` fields).
- Statement-I and Statement-II (assertion and reason).
- "Which of the following is NOT...": pick from one attribute group, flip one.

**Distractors come from the same attribute pool.** If the right value is a year, the wrong values are other years from the same topic. If it is an Article, the wrong values are other Articles. This keeps every option plausible and stops the answer being obvious from its form.

**Hedge words are used on purpose.** False statements often use "only", "all", "always", "indefinitely" or "can". In true statements these words are correct: "can be proclaimed only on...". The rule is: a hedge word may make a statement false, but never because the writer was careless. Each false statement stores which fact it breaks.

**(3) LLM for wording, then a second check.**
- An LLM may paraphrase the stem and propose wrong statements that look close to the truth.
- A second, independent LLM pass reads each question against the lesson text and the fact's source. If it disagrees with the computed answer, the question is rejected.
- Every question stores its `fact_ids`, the `lesson` ids, the generator name, and the verifier's result.

**(4) Adaptivity.** Use the review data we already keep (wrong answers, scores, and the review steps of 1, 3, 7 and 21 days).
- Pick facts the user got wrong, then facts due for review, then new facts.
- Difficulty ladder: (a) single fact, (b) two statements, (c) three statements with hedge traps, (d) match or order.
- Interleave subjects so one lesson's facts do not repeat in a row.
- Avoid repeats: a question is not shown again for at least 30 days.
- Start with simple rules (like a Leitner box). Once there are about 5,000 answered questions from real users, a small ranker (logistic regression, run on the phone) can replace the rules. It only chooses; it never writes questions.

**(5) Safety valves.**
- Each question has a confidence flag: verified by two models, or human-checked.
- A "Report this question" button on every question.
- New questions are shown only after a human has checked a sample.
- Two or more reports on one question pull it out of rotation automatically. It goes to a review queue.
- A human reviews a random sample of new questions every week.

**(6) Where it runs.**
- Preferred: pre-generate batches offline in GitHub Actions and save them as JSON per subject. This is free and repeatable, and a human can read every batch before it ships.
- Optional: live generation with Gemini for more variety, always with the verification pass. Free-tier limits change, so check them before relying on it.
- The phone never generates a question on its own. It only picks from the stored set.

**Data use.** Progress data stays with the user's account, under the existing sign-in and Firestore rules. Say so in the privacy policy.

## 3. Worked example

Three facts (all from the same lesson topic: emergency provisions; the lesson id is to be confirmed when the fact bank is built):

| Id | Entity | Attribute | Value | Source |
|---|---|---|---|---|
| F-0101 | Article 352 | grounds for national emergency | war, external aggression or armed rebellion | Art. 352(1), as amended by 44th Amendment (1978) |
| F-0102 | Article 356 | condition for President's Rule in a State | failure of the constitutional machinery in the State | Art. 356(1) |
| F-0103 | Article 360 | approval for a financial emergency | must be approved by both Houses within two months, or it ceases to operate | Art. 360(2) |

The generator marks statement 1 and 2 true, and statement 3 false (it uses the hedge word "indefinitely" to break F-0103):

**Question.** Consider the following statements about emergency provisions in the Indian Constitution:
1. A proclamation of national emergency under Article 352 can be made only on grounds of war, external aggression or armed rebellion.
2. President's Rule under Article 356 can be imposed when the constitutional machinery in a State has failed.
3. A proclamation of financial emergency under Article 360 remains in force indefinitely without any approval from Parliament.

Which of the statements given above are correct?
(a) 1 and 2 only
(b) 2 and 3 only
(c) 1 only
(d) 1, 2 and 3

**Answer: (a) 1 and 2 only.**

**Explanation.**
- Statement 1 is correct. The 44th Amendment (1978) replaced "internal disturbance" with "armed rebellion" as a ground.
- Statement 2 is correct. Article 356(1) allows President's Rule when the State's government cannot run according to the Constitution.
- Statement 3 is wrong. Under Article 360(2), a financial emergency ceases to operate after two months unless both Houses of Parliament approve it.

**Stored record.** `question_id: Q-PSIR-0457`, `fact_ids: [F-0101, F-0102, F-0103]`, `format: consider_statements`, `hedge_used: [only, indefinitely]`, `verified_by: [model A, model B]`, `human_checked: false` (set to true after the weekly sample).

**Why the check matters.** If the second model reads statement 1 and thinks "can be made only" is wrong, the question is held for a human. This happens automatically, so the disagreement is seen before any user does.

## 4. Phases and rough effort

Part-time, one person, with AI help. Estimates only.

| Phase | Work | Time |
|---|---|---|
| 0. Pilot | Hand-write 50 facts from one unit. Agree the schema. Build the first two formats. | 1 week |
| 1. Fact bank | Extract and check facts for all PSIR lessons. Human spot-check. | 3 to 4 weeks |
| 2. Generators | Build the 6 formats from the fact bank. Automated tests: each answer must match its facts. | 2 weeks |
| 3. Wording and verification | LLM paraphrase and distractor proposals. Second-pass check. Measure the rejection rate (expect 10 to 30%). | 2 weeks |
| 4. Adaptive picker | Rules using review data. Report button, flags, quarantine. | 2 weeks |
| 5. Upkeep | Weekly human sample. Yearly fact refresh. Ranker only after enough data. | Ongoing, a few hours a week |

Total to first usable version: about 10 to 12 weeks. This work also produces the question bank the paid product needs (see `docs/PAID_PLAN.md`, section 3).

## 5. Limits and risks

- Questions are "UPSC-style", not UPSC questions. Never call them past papers.
- Facts go stale, especially 2026 current affairs. Each fact carries a `checked` date and an expiry for current-affairs items.
- Hedge words are a trap for the writer too. Review false statements for accidental truth.
- The rejection and report rates will show quality. If reports rise, pause that format.
- Cost: pre-generation is cheap. Human checking is the main cost.
