# Redo the Lumen sheets on a flat magenta background (brief for a LOCAL Claude Code session on the owner's PC)

Why: the first sheets came on cream, which is almost the same colour as Lumen's face, so cut-outs lost his lower face or left halos. A flat magenta background (#FF00FF) can be removed perfectly because the character has no magenta.

## Inputs already in this repo
- Master reference: `art/lumen/sheets/look-master-sunglasses.webp` (attach it first in every chat).
- Character lock + the sheet prompts: `docs/LUMEN_INSPECTOR_PROMPTS.txt` (SHEET 1 to 10). Pose list per sheet: `art/lumen/README.md`.
- Existing (cream) sheets for comparison: `art/lumen/sheets/sheet-*.webp`.

## Add this to the END of every sheet prompt
"Solid flat pure magenta background (#FF00FF) behind all poses. No shadows, no gradient, no ground line, no glow outside the character, no text. No magenta anywhere on the character. Keep clear space around every pose."
(The bulb glow stays inside the bulb only.)

## Order of priority (most visible in the app first)
1. SHEET 9 subject props A, SHEET 10 subject props B and signature (home screen of every subject)
2. SHEET 4 streak states, plus the 3-pose widget strip (streak-1..3 and widget-states used by the widgets)
3. SHEET 2 sunglasses play (pose 1 is the app icon and loading screen)
4. Then the rest: 3, 5, 6, 7, 8, and SHEET 1 (expressions; the original front sheet was transparent and is fine).

## What the session should do
1. Use whichever image tool the owner has set up (ChatGPT image generation) for each sheet; one sheet per message; same chat so the character stays consistent.
2. Save each result as a PNG in `art/lumen/sheets/magenta/<sheet-name>.png` (names as in `sheets/sheet-<name>.webp`, e.g. `subjects-a.png`).
3. Do NOT cut or wire them into the app. Commit and push the PNGs; the cloud session will cut (remove magenta), resize to 420 px WebP, replace `art/lumen/<name>-<n>.webp` and rebuild the widget drawables.
4. Keep pose order identical to the current sheets (3 columns x 2 rows, left to right, top to bottom).

Never put API keys in the repo; they live in the local environment only.
