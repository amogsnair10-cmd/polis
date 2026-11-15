# Light Bulb mascot: design brief

Status: proposal for owner review (2026-11-15). Nothing is built yet.

Goal: give Light Bulb a small, dignified character that appears at key moments (a greeting, a good score, a streak warning, a new badge). It should feel like a calm study companion, not a game mascot.

---

## 1. Is a mascot worth it for this audience?

- **For:** A mascot gives the app a face. Duolingo's owl is a big part of why people remember it, and a friendly character makes a streak feel like a relationship, not a number.
- **For:** The character can carry the emotional moments (streak lost, level up) so the text does not have to. Short, warm lines beat long messages for a phone user.
- **Against:** UPSC aspirants are adults studying for one of the hardest exams in India. A cartoon with big eyes and jokes can look childish and cost trust, especially on a serious-looking app with serif titles and gold ink.
- **Against:** Mascots are a lot of upkeep. Every new pose, animation and voice line costs time and needs checking.
- **Verdict:** Yes, but only a restrained one. Keep the character small, quiet and drawn in the same ink style as the doodles. If it ever looks like a children's app, drop it.

---

## 2. Three concept directions

### Direction A: Lumen the firefly
- **Who:** A small firefly whose lit abdomen is shaped like a light bulb. Name ideas: **Lumen** (first choice), Ignis, Lucerna.
- **Personality:** Curious, calm, encouraging. Speaks in short, full sentences. Never sarcastic, never teases a wrong answer.
- **Stays dignified by:** No costume, no hat, no big eyes. Just two thin wings, two antennae and a glowing body. Glow shows mood, not face.
- **Fit with the app:** Strong. The firefly is a light-bearer, which links to "Light Bulb" without copying it. It is drawn in plain ink lines, the same as the existing doodles.

### Direction B: Noctua the bulb-headed owl
- **Who:** A small owl with a bulb-shaped head that glows with its mood. Name ideas: **Noctua**, Minerva, Glaux.
- **Personality:** Wise, patient, a little formal. Likes to say "Read it once more."
- **Stays dignified by:** Drawn as a classical scholar's owl in ink, with a plain, almost heraldic look rather than a round cartoon.
- **Risk:** The owl is Duolingo's shape. Even a different drawing style may look copied. This is the biggest reason not to pick it.

### Direction C: Stella the constellation creature
- **Who:** A small creature made of star dots joined by thin lines, in the same style as the Athena-helm constellation logo. Name ideas: **Stella**, Asterion, Cygnus.
- **Personality:** Steady, thoughtful, a bit poetic. Quiet encouragement, long-view advice ("Stars take a long time to shine").
- **Stays dignified by:** Very little drawn detail. The mood shows through how bright the stars are and how the lines bend.
- **Risk:** Hard to show emotion with dots alone, and harder to animate. It may read as a logo rather than a character.

### Recommendation: Direction A, Lumen the firefly
Lumen is the best balance. It matches the ink doodles, it is unique among study apps, it has no Duolingo echo, and its glow is an easy way to show mood (bright for a good day, dim for a streak at risk, asleep for a lost streak). Keep Direction C as the fallback if the owner wants a tighter link to the Athena logo. Lumen can also wear a tiny constellation pattern on its wings later.

---

## 3. Poses and emotions

Each pose is tied to one moment in the app. Glow means the bulb-shaped lantern on Lumen's body.

| # | Pose / mood | When it shows | Where in the app | Glow and body |
|---|---|---|---|---|
| 1 | **Greeting** (small nod) | Each time the home screen opens | Top of home, above the level strip | Steady glow, wings half open |
| 2 | **Celebrate** (wings up) | Quiz score 10 out of 10 | End-of-quiz result sheet (`score` block) | Bright glow, wings spread |
| 3 | **Encourage** (calm, hand on a book) | Quiz score 4 to 9 out of 10 | End-of-quiz result sheet | Steady glow, no celebration |
| 4 | **Streak at risk** (flicker) | Streak not yet kept today, after 9 pm | Streak card on home; the 9 pm reminder notification | Dim, flickering glow |
| 5 | **Streak lost** (rest, gentle) | Streak broke | Home, once, with a line like "Let's start again today." | Very dim, folded wings, no blame |
| 6 | **New badge** (holding a laurel leaf) | A badge is first earned | The badge toast; the badge grid in My learning | Medium glow, leaf held up |
| 7 | **Level up** (rising) | Level goes up | The level button on home; the level-up toast | Brightest glow, rising pose |
| 8 | **Review time** (holding a small clock) | Review cards are due | "Review" card on home | Steady glow, clock in hand |
| 9 | **Loading** (slow spin or curl) | App is loading | Loading screen | Glow pulses slowly |
| 10 | **Empty: no lessons yet** (looking at blank page) | My learning with nothing finished | My learning | Steady glow, curious |
| 11 | **Empty: no review due** (sleeping on a cushion) | Review list empty | Review screen | Low glow, eyes closed (a line) |
| 12 | **Empty: no questions yet** (open empty book) | Mixed test needs finished lessons | Mixed revision screen | Steady glow, curious |
| 13 | **Speaking** (small open wing) | Listen mode is playing | Listen button and player | Glow pulses with the voice |

### Home-screen widget (Android)
The phone widget is small, so it shows one image only, not an animation:
- **Streak kept today:** Pose 1 (greeting) with bright glow.
- **Streak at risk:** Pose 4 (flicker).
- **Streak lost or no study yet:** Pose 5 (rest).

The widget is built in `mobile/native` and reads the streak from the phone. It will need a small PNG (about 256 px) for each of the three states.

---

## 4. Image-generation prompts

### 4a. Style words (use in every prompt)
`hand-drawn ink doodle, single colour, fine pen line, uneven but controlled line weight, no fill, no gradient, no shading, no text, transparent or plain background, calm dignified scholarly mood, classical understated style, centred, one subject`

Colour for the on-screen version: dark gold ink (#c9a45c) on warm parchment (#f3f1ec), or the same gold on deep navy (#1d2433).

### 4b. Character sheet (recommended character)
> Character design sheet of Lumen, a small friendly firefly guardian for a serious study app. Body is a tiny glowing lantern shaped like a light bulb, two delicate wings, two short antennae ending in small dots. Show front, side and three-quarter views on one sheet. Hand-drawn ink doodle, single colour, fine pen line, no fill, no gradient, no shading, no text. Dark gold ink lines on warm parchment. Calm, dignified, understated, classical. Not cartoonish: no big eyes, no wide smile. Centred, one sheet.

### 4c. One prompt per pose
Use with the character sheet as the reference image, if the tool allows.

1. **Greeting:** Lumen gives a small polite nod, wings half open, steady glow, one hand-drawn line of light beneath it. [style words]
2. **Celebrate:** Lumen with wings spread wide, bright glow, a few short ink rays around the bulb body. Joyful but restrained. [style words]
3. **Encourage:** Lumen resting on a closed book, steady glow, one antenna raised, calm and warm. [style words]
4. **Streak at risk:** Lumen with a dim, flickering bulb body, wings folded a little, looking toward a small candle. [style words]
5. **Streak lost:** Lumen very dim, resting on a stone step, wings folded, no blame in the expression, a faint star above. [style words]
6. **New badge:** Lumen holding a small laurel leaf up in one claw, medium glow, quiet pride. [style words]
7. **Level up:** Lumen rising upward on one wing, brightest glow, a short line of light trailing below. [style words]
8. **Review time:** Lumen holding a small pocket clock, steady glow, looking at the time. [style words]
9. **Loading:** Lumen curled into a small ball, glow pulsing softly, a thin ring of dots around it. [style words]
10. **Empty, no lessons:** Lumen looking at a blank open page, curious, steady glow. [style words]
11. **Empty, no review due:** Lumen asleep on a small cushion, low glow, eyes shown as one line. [style words]
12. **Empty, no questions:** Lumen beside an empty open book, head tilted, steady glow. [style words]
13. **Speaking:** Lumen with one wing lifted as if explaining, small sound lines near the bulb body. [style words]

### 4d. "Vector doodle" version (recolourable by theme)
The app's doodles are single-colour line drawings in SVG (see `art/doodles/chemistry/L/0-0-1.svg`: 160 by 120 view box, stroke width 2.2, round ends and joins, no fills). The mascot should match that, so its colour can follow the theme.

Prompt for the raster step (then trace it into a clean vector):
> Monochrome vector line drawing of Lumen, a small firefly with a light-bulb-shaped glowing body, two wings, two antennae. Pure black line art on a plain white background. Uniform stroke weight, no shading, no gradient, no fill, no text. Simple closed paths, few nodes, icon-like, suitable for tracing into a clean SVG. Square composition, subject centred.

Then in the SVG file:
- Set the stroke colour to `currentColor` (not `#000`), so the theme colour applies.
- Keep the stroke width near 2.2 at a 160 by 160 view box, to match the doodles.
- Keep fills off, so the mascot is line only.
- Save one file per pose, named like `art/mascot/lumen-<pose>.svg`.

Ask Claude to do the tracing and colour change; the owner does not need to edit SVG by hand.

### 4e. Notes for the owner
- Check every image: the look should not copy Duolingo, Disney or any named artist.
- Generated faces and bodies are fine here, since Lumen is not a real person.
- Keep a note of which tool made which image (for the licence record).

---

## 5. Rollout plan

### Phase 1: static poses (first)
- **What:** Make the character sheet and the poses that matter most.
  - Result sheet: poses 2 and 3 (10/10 celebrate, encourage).
  - Empty states: poses 10, 11, 12.
  - Greeting on home: pose 1.
- **Format:** Plain PNG for screens, plus the line-only SVG for recolouring.
- **Done when:** The owner has looked at the sheet and approved the name and the look. Each pose is checked on a phone in light and dark themes.
- **Not yet:** No animation, no widget, no voice.

### Phase 2: animation (after Phase 1 is approved)
- **What:** Make Lumen move a little, to show life without noise.
  - Slow glow pulse on the loading screen (pose 9) and in Listen mode (pose 13).
  - Wings flutter on celebrate and level up.
  - Flicker for streak at risk.
- **How:** Prefer CSS animation on the SVG. This keeps the app light and avoids a new library. A Lottie file (JSON) is possible later, but adds a vendored library, so only if CSS is not enough.
- **Also in this phase:** The Android widget, using the three small PNGs.
- **Done when:** Animations stop when the user has reduced-motion turned on, and the app still feels fast.

### Phase 3: voice lines in Listen mode
- **What:** Lumen speaks short lines when Listen mode plays, for example "Here is the key idea." or "Shall we go on?"
- **How:** Use the existing Listen feature (`listen.js`, phone voice or the native voice in the APK). Keep lines to one sentence each.
- **Rules:** Lines are written by Claude and checked by the owner before use. No jokes that could sound childish. No lines that mock a wrong answer.
- **Done when:** A short set of lines (about 20) is written and approved, and Listen mode still works when the voice is off.

---

## Decisions still open (for the owner)
1. Pick a direction: A (Lumen, recommended), B (owl, not recommended because of Duolingo), or C (constellation creature).
2. Approve the name.
3. Decide whether Phase 1 goes ahead now or after the Play Store release.
