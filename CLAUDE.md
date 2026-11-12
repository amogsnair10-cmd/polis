# Notes for Claude
- Read `HANDOFF.md` first: lesson schema, writing style and verification rules are non-negotiable.
- Run `node scripts/build.js` after any lesson change; it must print `ok`. Then `node scripts/lint.js` for free style checks.
- To save usage: follow `docs/PIPELINE.md`; send writers `docs/WRITER_BRIEF.md` and checkers `docs/CHECKER_BRIEF.md`, never the long HANDOFF.
- Design lives in styles.css (living background, glass panels, fluid type). Colours come from theme tokens in themes.js. Per-subject hero art: put a WebP in art/ and set "hero": "art/<id>.webp" on the subject in subjects.json.
- The user wants plain language. Main PC is Windows.
