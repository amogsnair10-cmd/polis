# Light Bulb: status and next steps (as of 2026-11-12)

## PINNED DECISIONS (owner, 16 Nov)
- **Quiz mix: of every 10 questions, exactly 5 are UPSC-style** (Consider-the-following statements, how-many-correct, match-the-pairs, Statement-I/II, NOT/odd-one-out; with deliberate hedge words may/can/only/all) **and 5 are plain direct questions.** Brief: `docs/UPSC_QUIZ_BRIEF.md`. Every question must be answerable from that lesson's own cards (audit running: docs/QUIZ_AUDIT_*.md).
- **Generation must cost no Claude tokens where possible:** use a script in GitHub Actions calling the free Gemini key (secret `GEMINI_API_KEY`) with a verify pass, or deterministic fact-bank generators (`docs/ADAPTIVE_QUESTIONS_PLAN.md`). Use Haiku only for small checks. No older Claude models are offered here; Haiku is the cheapest tier.
- **Streak:** one main streak across ALL subjects, counted on the phone's local date; per-subject streaks shown separately (done 16 Nov).
- **Widgets:** keep ALL four designs (Bento, Ledger, Poster, Ring) as separate choosable widgets; mock-ups in docs/widget-mock.html.

## Where things live
- **Site:** https://lightbulb.amogbuilds.net — Cloudflare Pages project `lightbulb-study`, published by `.github/workflows/site.yml` on every push to `main` (needs secret `CLOUDFLARE_API_TOKEN`). The repo is now PRIVATE, so GitHub Pages no longer works. The new domain must be in Firebase → Authentication → Authorized domains.
- **Android app:** `.github/workflows/android.yml` builds `LightBulb.apk` when `mobile/**`, `icons/**` or the workflow change. Download: https://lightbulb.amogbuilds.net/LightBulb.apk (copied from the `app-latest` release by site.yml; the release link itself needs a GitHub login now the repo is private). The app loads the live site, so web changes need no reinstall.
- **Accounts:** Firebase project `light-bulb-3a6fe` (Google sign-in only; phone hidden). Config is in `account.js`. Rules in `firestore.rules` (paste into Firestore → Rules). In the APK, Google sign-in goes through `auth.html` in Chrome and returns via `lightbulb://auth`.
- **Ask a doubt:** `ask.js`. Gemini (default) and Claude with the reader's own key. Retries busy Gemini and falls back to other Flash models.

## Content
- 11 subjects in `subjects.json`; PSIR at repo root, others in `subjects/<id>/`.
- Build: `node scripts/build.js` (must print ok). Free style check: `node scripts/lint.js <dir>`.
- Briefs: `docs/WRITER_BRIEF.md`, `docs/EXPAND_BRIEF.md` (append-only new lessons), `docs/CHECKER_BRIEF.md`, `docs/PIPELINE.md`.
- ~30 new lessons per subject were planned: done for PSIR (32) and World History (30); History, Communist Theory and Astronomy were partly done; Geography, Environment, Physics, Chemistry, Biology, Quantum not started.

## Photos and listening
- ~1,200 graded free-licence photos (Wikimedia via Wikipedia lead images) in `art/photos/<id>/`, mapped in `photos.json`. Made by `scripts/photos.py` via the "Lesson photos" GitHub workflow (input: JSON list of subject ids; resumable). If its merge step fails, run "Merge lesson photos" with the run id.
- Listen button (`listen.js`): phone voice; native TTS plugin in the APK.

## Review, PYQs, Play Store (added 15 Nov)
- Review mode: wrong quiz answers go into `S.rev` (inside progress, so it syncs) and return after 1/3/7/21 days; "Review" card on home; `openReview()` in app.js.
- PYQ card + badge read optional `<subject dir>/pyq.json` (`{"lessonId":[{y,p,q,m}]}`). DATA NOT WRITTEN YET: four Sonnet workers hit the weekly limit (resets 18 Nov 13:00 UTC). Re-run them then; questions must be real and need a spot-check against official papers.
- Owner full access: `FULL` hash list in account.js sets `window.LB_FULL` (no paywall exists yet; use this flag when one is built).
- android.yml: if secrets `KEYSTORE_B64` + `KEYSTORE_PASSWORD` exist it builds a signed release APK and `LightBulb.aab` (versionCode = run number); if `PLAY_SERVICE_ACCOUNT_JSON` exists it uploads the AAB to Play internal testing. The keystore was given to the user as a file; it is not in the repo.
- Privacy policy: `privacy.html` (live at /polis/privacy.html).

## Points, levels, badges, mixed revision (15 Nov)
- XP in `S.xp` per subject (synced, max-merged in account.js). Lesson 30+5/correct (replay 5+2), chapter test 10+4/correct, review 3/correct, mixed test 20+4/correct, +10 first study of a day. 8 levels in `LEVELS`, 20 badges in `BADGES` (app.js), derived from saved progress; `lb:badges` remembers which were celebrated (toast). Home shows a level strip; My learning shows level + badge grid.
- Mixed revision: `openMix()` = 20 questions from finished lessons, weighted to weaker ones; wrong answers feed the review list.
- Hosting is Cloudflare (lightbulb.amogbuilds.net). An old APK that points at github.io shows a 404: reinstall from /LightBulb.apk.

## Restore + sync safety (15 Nov)
- Me -> "Restore my progress" (`openRestore` in account.js): user sets lessons finished per subject + streak; only adds. Built because moving host (new origin) plus reinstall wiped local storage.
- Sync safety: `pushSoon` now refuses to write until `pull()` has merged the cloud copy in this sign-in (`pulled` flag), so an empty phone cannot overwrite cloud data.
- Play Store timeline: closed test needs 12 opted-in testers for 14 days, then apply for production (review a few days), so ~3 weeks after the first closed-test upload.

## Doodles
- Chapter doodles: all 11 subjects done (`art/doodles/<id>/<section>-<unit>.svg`).
- Lesson doodles (cover + 2 key cards, `art/doodles/<id>/L/`): done for all 11 subjects.
- Brief: `docs/LESSON_DOODLE_BRIEF.md` (has a resume rule, so re-running skips finished lessons). Use Sonnet.

## Open items
1. (Done) Lesson doodles. Optional: redraw weak ones the user points out.
2. Server features are off since leaving Netlify: built-in Gemini (no key) and browser push reminders. Plan: a free Cloudflare Worker; then set `window.LB_API` to its URL. Code for the functions is in `netlify/functions/` and `netlify/lib/` to port.
3. Remaining ~30-lesson expansions: Geography (62) and Environment (51) done now; Physics, Chemistry, Biology, Quantum not started. Fact-check items: docs/CHECK_PSIR.md; new Geography facts unverified.
6. Permanent APK signing key (keystore in a GitHub secret) so updates install without uninstalling.
4. Play Store: needs a Play Console account, a signed release bundle (keystore in GitHub secrets), privacy policy, screenshots.
5. User reported general "bugs/abruptness"; a motion pass was done. Ask for specific screenshots of anything still off.

## Working rules
- The user is on an Android phone (OnePlus); main PC is Windows. Plain language, short steps.
- Never put secrets in the repo (repo is public). Firebase web config is fine to include.
- Batch pushes are fine now (GitHub Pages), but keep usage lean: Haiku for checks, Sonnet for writing and doodles.
