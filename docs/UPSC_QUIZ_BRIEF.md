# UPSC quiz brief (rewrite one lesson's 10-question quiz)

Use this with a lesson file (`lessons/<id>.json`, or `subjects/<id>/lessons/<id>.json`). Change only the `"quiz"` key. Leave `cards`, `sources`, `verified` and the rest as they are.

The quiz should feel like UPSC's statement-based questions, not a plain recall quiz. Each question tests whether the reader understood the lesson. Use only facts printed in that lesson's cards.

## 1. The mix of 10

| # | Type | Count |
|---|------|-------|
| 1 | "Consider the following statements ... Which of the statements given above is/are correct?" (2 or 3 statements) | 3 |
| 2 | "Consider the following statements ... How many of the statements given above are correct?" (3 statements) | 2 |
| 3 | "Consider the following pairs ... How many pairs are correctly matched?" (always 3 pairs) | 2 |
| 4 | Statement-I / Statement-II (assertion-reason) | 1 |
| 5 | "Which one of the following is NOT ...?" (odd one out) | 1 |
| 6 | "Arrange these in chronological order" (4 items) | 1 |

That is 10 in total. Do not add a plain direct question. If the lesson truly has no material for one slot, you may use one plain direct question in its place (at most one per lesson).

## 2. Exact question shapes

Use "\n" inside `q` to put each item on its own line.

**Statement questions, 2 statements.** Options are exactly the four combinations, in any order:
`"1 only"`, `"2 only"`, `"1 and 2 only"`, `"Neither 1 nor 2"`

**Statement questions, 3 statements.** Options are exactly these four, in any order:
`"1 and 2 only"`, `"2 and 3 only"`, `"1 and 3 only"`, `"1, 2 and 3"`

Question text: `"Consider the following statements:\n1. ...\n2. ...\nWhich of the statements given above is/are correct?"`

**How many.** Question text: `"Consider the following statements:\n1. ...\n2. ...\n3. ...\nHow many of the statements given above are correct?"`
Options are exactly: `"Only one"`, `"Only two"`, `"All three"`, `"None"`, in any order.

**Pairs.** Always 3 pairs. Question text: `"Consider the following pairs:\n1. X: Y\n2. ...\n3. ...\nHow many pairs are correctly matched?"`
Options are exactly: `"Only one"`, `"Only two"`, `"All three"`, `"None"`, in any order.

**Assertion-reason.** Question text: `"Consider the following statements:\nStatement-I: ...\nStatement-II: ...\nWhich one of the following is correct in respect of the above statements?"`
Options are exactly these four, in this UPSC form (use this wording, not a paraphrase):
- `"Both Statement-I and Statement-II are individually true and Statement-II is the correct explanation of Statement-I"`
- `"Both Statement-I and Statement-II are individually true but Statement-II is not the correct explanation of Statement-I"`
- `"Statement-I is true but Statement-II is false"`
- `"Statement-I is false but Statement-II is true"`

**Odd one out.** Question text: `"Which one of the following is NOT ...?"`. Three options belong to one group the lesson names; one does not.

**Sequence.** Question text: `"Arrange these in chronological order:\n1. ...\n2. ...\n3. ...\n4. ...\nWhich one of the following is the correct order?"`
Options are four strings such as `"1-3-4-2"`. One is correct. The three wrong options must each be a different wrong order.

## 3. Building false statements the UPSC way

Every statement must be checkable against the lesson's card text. Make a statement false by one of these:
1. Swap a name, date, book or place for a close alternative from the same lesson (for example Easton for Cobban, or 1969 for 1971).
2. Reverse a definition (for example, say normative theory asks what is).
3. Add an absolute the lesson does not support: only, all, always, never, solely, altogether.
4. Turn a hedged claim into an absolute (for example "generally" becomes "always").

Make a statement true by copying the lesson's claim, or by keeping its hedge. For example, "Traditional approaches are generally state-centric" is true, so hedges can make a true statement safe.

Rules:
- Keep each statement to one sentence.
- Use only facts printed in the lesson's cards (`h` and `b`). Never add outside facts, even if you know them. If a statement would need an outside fact, drop it.
- If you think a card is wrong, do not use the wrong part. Mention it in your final reply.
- Each statement must be clearly true or clearly false from the card text.
- Design for elimination. In a 2-statement question, make statement 1 clearly true or clearly false, so it rules out two options. In pairs and sequences, make at least one item easy to check.
- Put the correct option in different places. Across the 10 questions, the index `a` should use 0, 1, 2 and 3, and no index more than 3 times.
- Do not use "All of the above" or "None of the above" as options.
- Each question should test a different card. Do not ask two questions on the same point.

## 4. The explanation `w`

Give one short clause for each statement, saying why it is true or false. Example: `"1 is true: Easton said theory had become mere history of ideas. 2 is false: Laslett blamed positivism for saying value statements were meaningless."`
- Statement questions: go through each statement.
- How many and pairs: go through each statement or pair.
- Assertion-reason: say whether Statement-I and Statement-II are each true or false, and whether II explains I when both are true.
- Odd one out: say what the other three are.
- Sequence: give the dates or years that set the order.
Keep `w` under about 60 words.

## 5. JSON rules

Each quiz item has exactly these keys: `"q"` (string, with "\n" between lines), `"o"` (exactly 4 strings), `"a"` (integer 0 to 3, the index of the correct option), and `"w"` (string). The quiz has exactly 10 items.

Write the file with Python: `json.load`, replace only `quiz`, then `json.dump(..., ensure_ascii=False, indent=1)`. Keep the file's existing trailing newline, or lack of one.

Plain English. No all-caps labels. No emojis.

## 6. Worked examples (taken from lessons 0-0-0, 0-0-1 and 0-0-2)

**Example 1: statements, 3 statements.** Source: lesson 0-0-0, "The defence" card (Berlin, Bell) and "Wider debate" card (Bell) and "The defence" card (Rawls).
- q: "Consider the following statements:\n1. Isaiah Berlin said political theory will exist as long as people disagree about ends such as liberty and equality.\n2. John Rawls's A Theory of Justice (1971) is described as the book that ended the revival of normative theory.\n3. Daniel Bell's The End of Ideology (1960) argued that the West had settled its big ideological fights.\nWhich of the statements given above is/are correct?"
- o: "1 and 2 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"
- a: 1
- w: "1 is true: Berlin's test was disagreement about ends. 2 is false: Rawls's book is described as the start of the revival, not its end. 3 is true: Bell said the big ideological fights were settled."
- Why it works: statement 2 swaps "revival" for "ended", so the reader has to know which way the lesson goes.

**Example 2: how many.** Source: lesson 0-0-1, "Common features" card and "Comparative" card.
- q: "Consider the following statements about traditional approaches:\n1. They are value-laden, openly judging what is good.\n2. They rely mainly on surveys and statistics.\n3. They are state-centric, with the state as the main unit of study.\nHow many of the statements given above are correct?"
- o: "Only two", "Only one", "All three", "None"
- a: 0
- w: "1 is true: they openly judge what is good. 2 is false: they rely on reasoning, history and legal texts, not surveys or statistics. 3 is true: the state is the main unit. Two are correct."
- Why it works: statement 2 turns the lesson's "not surveys or statistics" into the opposite.

**Example 3: pairs.** Source: lesson 0-0-2, "Behaviouralism & After" cards "Big picture" and "Indian angle".
- q: "Consider the following pairs:\n1. Charles Merriam: the Chicago School of the 1920s\n2. Karl Deutsch: The Civic Culture (1963)\n3. Rajni Kothari: Politics in India (1970)\nHow many pairs are correctly matched?"
- o: "None", "All three", "Only one", "Only two"
- a: 3
- w: "1 is correct: the roots of behaviouralism go to the Chicago School under Merriam. 2 is wrong: The Civic Culture is by Almond and Verba. 3 is correct: Kothari's book. Two are correct."
- Why it works: pair 2 swaps a name for a close alternative (Deutsch for Almond and Verba) from the same lesson.

## 7. Before you save

- Check the JSON loads, the quiz has 10 items, each `o` has 4 strings, and each `a` is 0 to 3.
- Check every statement against the card text, and make sure each `w` covers every statement.
- Check the spread of `a` values (no index more than 3 times).
- Run `node scripts/build.js`. It must print `ok`.
- Do not commit. Reply with the lesson id, the number of questions changed, and any question you were unsure about.

## Extra rules added after the pilot (read these)
- NEVER write "according to the lesson", "as the lesson lists them", "the card says". A real UPSC question stands alone. Make the statement self-contained.
- Do not make a false statement obviously absurd. Real UPSC false statements are plausible: change ONE detail (a name, a date, a place, a cause) or add one absolute word (only, all, always, solely) to an otherwise true sentence. If a student can eliminate a statement without knowing the topic, rewrite it.
- Hedge words used on purpose: "may", "can", "generally", "primarily" usually make a statement TRUE; "only", "all", "always", "never", "solely", "exclusively" usually make it FALSE. Use both ways, not always the same way.
- At least 4 of the 10 questions should need two-step elimination (the answer options are built so knowing one statement removes two options).


## PINNED (owner decision, 16 Nov): 5 of 10, not 10 of 10
Out of each lesson's 10 questions, **5 are UPSC-style** (statement / how-many / pairs / Statement-I-II / NOT) and **5 are plain direct questions** (one clear stem, four short options). The mix table above (3 statements, 2 how-many, 2 pairs, 1 assertion-reason, 1 NOT, 1 sequence, 1 direct) is replaced by: 2 'Consider the following statements', 1 'how many correct' or pairs, 1 Statement-I/II, 1 NOT/odd-one-out, plus 5 plain direct questions. Every question must be answerable from that lesson's cards only.
