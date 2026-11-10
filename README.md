# Polis — PSIR Daily

The whole UPSC PSIR optional in 120 daily lessons. An offline web app (PWA) you can install on your phone.

## Run it on your PC (Windows)
1. Install Node.js (nodejs.org) and Python.
2. Open Command Prompt in this folder.
3. Run `node scripts\build.js` (checks lessons, updates the offline file list).
4. Run `python -m http.server 8000`, then open http://localhost:8000.

## Put it online (Netlify)
Connect this repo in Netlify. `netlify.toml` already says what to do: it runs the build and publishes this folder.

## Files
- `index.html`, `app.js`: the app. `sw.js` is generated; edit `scripts/sw.template.js`.
- `syllabus.json`: all 120 lesson titles.
- `lessons/<paper>-<unit>-<lesson>.json`: one file per lesson. Schema is in `HANDOFF.md`.
- After adding or editing a lesson, run `node scripts/build.js`.
