# Token-free quiz generation (free Gemini, run on GitHub)

Costs **no Claude tokens**: a script in GitHub Actions calls the free Gemini API with your key.

## One-time
1. Make a **new** key at https://aistudio.google.com/apikey (the old one was pasted in chat once, so treat it as burned).
2. GitHub repo, Settings, Secrets and variables, Actions, **New repository secret**: name `GEMINI_API_KEY`, value = the key.

## Run
Actions, "Generate quizzes (free Gemini)", Run workflow. Subjects blank = all. Limit = lessons per run (the free quota is small; 30 is safe).
It is resumable (`art/quiz_state.json`): run it again tomorrow and it carries on. It stops politely when the daily quota is used up.

## What it does for each lesson
1. Reads only that lesson's cards.
2. Asks Gemini for 10 questions: exactly **5 UPSC-style** (2 statement questions, 1 how-many or pairs, 1 Statement-I/II, 1 NOT) and **5 plain**.
3. Checks the format in code (exact option sets, 3-item questions really have 3 items, no "the lesson" wording, 5 styled, answer positions spread).
4. A second Gemini pass checks every question against the cards. Anything not clearly SUPPORTED is regenerated (2 retries); if it still fails the lesson is left untouched.
5. `node scripts/build.js` must pass before anything is committed.

## Review first
Run it for one subject with a small limit, look at 5 lessons, then switch on the daily schedule by un-commenting `schedule:` in `.github/workflows/quiz-gen.yml`.

## Honest limits
The assertion-reason wording is the "individually true" form from the brief; check it against a real paper and change `AR` in `scripts/gen_quiz.py` if UPSC words it differently. Free-tier models can still slip a wrong fact that is also in the cards, so the weekly spot-check matters. Model names are in `GEMINI_MODELS` (default gemini-3.5-flash, gemini-3.8-flash).
