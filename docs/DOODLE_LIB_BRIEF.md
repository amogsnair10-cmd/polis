# Doodle library brief: 300 standalone SVG doodles that also combine

You draw doodles for a study app. Each one must work ALONE on a card, and any two must also look good COMBINED (side by side, or one small in the corner of another).

## Your job
Your list of concept ids is in `art/doodle-lib/_todo-<category>.txt` (one id per line). For EACH id write `art/doodle-lib/<id>.svg`. Then write `art/doodle-lib/tags-<category>.json`: `{"<id>": ["5 to 8 lowercase keywords a lesson title or card might contain, e.g. court, judge, trial, justice"]}`.

## SVG format (exact)
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` ...paths... `</svg>`
- Black strokes only (the app recolours them). Small solid accents allowed with `fill="#000"` (dots, eyes, a flame core). No text or letters, no gradients, filters, masks, clip-paths or images. No background rectangle, no frame, no ground line that spans the canvas.
- ONE clear subject, centred, filling about 80% of the canvas (keep a 10 unit margin so two doodles never touch when placed together). It must read instantly at 48 px.
- 10 to 28 elements. Confident, slightly organic hand-drawn curves (cubic beziers), not rigid geometry. 2 to 4 small accents for life (sparkles, motion lines, tiny dots). Same line weight everywhere.
- Draw the SPECIFIC thing named by the id with its recognisable features. Think of what a viewer would draw on a napkin. For multi-word ids combine the parts into one compact composition (e.g. `handshake-contract` = two hands clasping over a small scroll).
- Under 3 KB each, valid XML, no duplicate ids.

## Workflow (be economical)
- Use ONE Python script per 8 to 10 doodles that writes the files, then check XML validity once at the end (`python3 -c` with xml.dom.minidom). Do not re-read finished files. Do not commit.
- Final reply: the number written and any id you could not draw well.
