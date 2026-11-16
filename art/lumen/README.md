# Inspector Lumen poses

Transparent WEBP cut-outs from the mascot sheets in `sheets/`. Each sheet is a grid (3 columns x 2 rows, or 3 x 1 for widget-states), read left to right, top to bottom. Poses are at most 420 px tall.

| File | Pose |
|---|---|
| expressions-front-1.webp | Neutral, unimpressed look |
| expressions-front-2.webp | Flat, serious look |
| expressions-front-3.webp | Surprised, mouth open |
| expressions-front-4.webp | Smug smile, eyes half-closed |
| expressions-front-5.webp | Big open-mouth grin |
| expressions-front-6.webp | Sideways glance, skeptical |
| expressions-angles-1.webp | Standing, hands in pockets (used as lumen_neutral) |
| expressions-angles-2.webp | Hand on chin, thinking |
| expressions-angles-3.webp | Side view, mouth open |
| expressions-angles-4.webp | One arm out, smirking |
| expressions-angles-5.webp | Both arms out, big grin |
| expressions-angles-6.webp | Turned away, looking back |
| sunglasses-1.webp | Sunglasses on, hand to face |
| sunglasses-2.webp | Lowering sunglasses, walking |
| sunglasses-3.webp | Sitting on block, folding glasses |
| sunglasses-4.webp | Side view, glasses in hand |
| sunglasses-5.webp | Pointing with glasses, shrugging |
| sunglasses-6.webp | Adjusting sunglasses, smiling |
| streak-1.webp | Tipping hat, proud (used as lumen_kept) |
| streak-2.webp | Checking pocket watch, worried (used as lumen_risk) |
| streak-3.webp | Sitting on block, head down (used as lumen_lost) |
| streak-4.webp | Hand to hat, walking |
| streak-5.webp | Spinning with sparkles |
| streak-6.webp | Holding gold badge, winking |
| study-1.webp | Reading book with magnifier |
| study-2.webp | Writing notes, cross-legged |
| study-3.webp | Headphones on, music notes |
| study-4.webp | Highlighting an open book |
| study-5.webp | Pinboard with red string, thinking |
| study-6.webp | Reading open book, eyes closed |
| review-1.webp | Holding pocket watch, pointing |
| review-2.webp | Holding a stack of papers |
| review-3.webp | Writing at a desk |
| review-4.webp | Stamping a checked paper |
| review-5.webp | Filing folders into boxes |
| review-6.webp | Magnifier and bookshelf |
| rewards-1.webp | Holding a golden sprig |
| rewards-2.webp | Wearing a gold medal |
| rewards-3.webp | Walking with a gold trophy |
| rewards-4.webp | Standing on a stack of books |
| rewards-5.webp | Planting a flag on a hill |
| rewards-6.webp | Floating with glowing rays |
| daily-1.webp | Holding coffee at sunrise |
| daily-2.webp | Relaxing in a deckchair |
| daily-3.webp | Reading under moon and stars |
| daily-4.webp | Walking with umbrella in rain |
| daily-5.webp | Stretching arms up, cheering |
| daily-6.webp | Asleep in an armchair |
| subjects-a-1.webp | Holding scroll, bust beside |
| subjects-a-2.webp | Holding lantern and scroll |
| subjects-a-3.webp | Holding globe and compass |
| subjects-a-4.webp | Holding a potted plant |
| subjects-a-5.webp | Holding a ship's wheel |
| subjects-a-6.webp | Writing with a quill |
| subjects-b-1.webp | Holding a telescope |
| subjects-b-2.webp | Holding an atom symbol |
| subjects-b-3.webp | Holding a flask |
| subjects-b-4.webp | Working at a microscope |
| subjects-b-5.webp | Thinking, science squiggles |
| subjects-b-6.webp | Arms out, eureka rays |
| widget-states-1.webp | Tipping hat, smiling |
| widget-states-2.webp | Checking pocket watch, unhappy |
| widget-states-3.webp | Sitting on block, downcast |
| face.webp | 256 x 256 head and hat close-up |

The `lumen_*.webp` copies (300 px tall) are in `mobile/native/res/drawable-nodpi/`:

| Drawable | Source |
|---|---|
| lumen_neutral.webp | expressions-angles-1 |
| lumen_kept.webp | streak-1 |
| lumen_risk.webp | streak-2 |
| lumen_lost.webp | streak-3 |

Fixes made: the expressions-front sheet is stored with a transparent background, so it was flattened onto cream before cutting. That removed ragged edges and leftover background on the coat and wing. All other sheets cut cleanly.

## 16 Nov redo (transparent sheets)
study, subjects-a, subjects-b, sunglasses, daily, expressions-front, review and rewards were re-cut from transparent GPT sheets (alpha cut, no background guessing). `misc-1..6` is an extra set not yet used in the app (proud with sparkles, hat tip, arms crossed, holding a book, sitting with books, sitting arms crossed). Still to redo from transparent sheets: streak, widget-states, expressions-angles.
