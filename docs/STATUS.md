# Light Bulb: status and next steps (as of 2026-11-12)

## Where things live
- **Site (live):** https://amogsnair10-cmd.github.io/polis/ — published by `.github/workflows/pages.yml` on every push to `main` (free, no limits). Netlify is no longer used (credits ran out).
- **Android app:** `.github/workflows/android.yml` builds `LightBulb.apk` when `mobile/**`, `icons/**` or the workflow change. Download: https://github.com/amogsnair10-cmd/polis/releases/download/app-latest/LightBulb.apk. The app loads the live site, so web changes need no reinstall.
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
