# How to build a new subject cheaply

1. Add the subject to `subjects.json` (`"soon": true`), create `subjects/<id>/syllabus.json` in the same
   format as the root one (sections → units → lesson titles, with 1 for "asked often").
2. Writers: 2 Sonnet agents, each given `docs/WRITER_BRIEF.md` plus a list of lesson ids. High-yield units first.
3. After each writer finishes: `node scripts/build.js` and `node scripts/lint.js <DIR>`; fix lint output.
4. Checker: 1 Haiku agent per batch with `docs/CHECKER_BRIEF.md`. Apply its table, then commit.
5. One phone-screen test per subject (not per unit): open two lessons at 390×844, look at diagrams.
6. Remove `"soon"` from the subject, run the build, commit and push.
Run big writing jobs when you are away, so a usage-limit reset doesn't block you.
