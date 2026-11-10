# Polis — PSIR Daily: build brief for Claude Code

## What this is
Polis is a mobile app that teaches the whole UPSC CSE Mains PSIR optional (Political Science and International Relations) in 120 daily lessons. Each lesson is a deck of swipeable cards followed by a five-question quiz. The audience is UPSC aspirants aged 22–30, who read it on their phones.

Live prototype: https://claude.ai/artifact/EPMgbgDF5M9mMiv4fCBMem
Source: `index.html`. It is a single self-contained file with vanilla JS, SVG art and no build step.
Syllabus: `syllabus.json` holds all 120 lesson titles in four sections, mapped to the official UPSC syllabus.

## Current state
- **Done (8 lessons):**
  - Unit 1 (meaning and approaches): 3 lessons.
  - Unit 2 (theories of the state: liberal and neoliberal, Marxist, pluralist, post-colonial, feminist): 5 lessons.
- **Judged:** an independent reviewer went through a full lesson, and every fix it raised has been applied.
- **Still to write:** 112 lessons. Their titles are already in `syllabus.json`.

## Target build
1. Make it an installable offline PWA, with a manifest, a service worker and icons. Host it on Netlify. Optionally wrap it with Capacitor to get an Android APK.
2. Move the lesson content out of `index.html` into one `lessons/<paper>-<unit>-<lesson>.json` file per lesson. Lazy-load each file when it is opened.
3. Keep the design exactly as it is now (see the design tokens below).
4. Progress is kept in localStorage: completed lessons, quiz scores and the days studied. Streaks must use local IST dates, not UTC. This is already fixed in the prototype.
5. Nice-to-haves:
   - A review screen for wrong answers.
   - Spaced-repetition re-quizzes on days 3, 7 and 30 after a lesson.
   - A daily reminder notification.
   - Search across all lessons.

## Lesson JSON schema
```json
{
  "id": "0-2-0",
  "title": "Rawls's Theory of Justice",
  "emoji": "⚖️",
  "cards": [
    {"tag": "Core idea", "h": "Card heading", "b": "<p>HTML body. <b>Bold</b> marks key terms.</p>", "cls": "exam (optional)"}
  ],
  "quiz": [
    {"q": "Question", "o": ["A", "B", "C", "D"], "a": 1, "w": "Why the right answer is right."}
  ],
  "sources": ["Book or article, year", "PYQ year and marks this lesson answers"],
  "verified": "2026-11-10"
}
```
Card body HTML may use these pieces:
- `.box` with an `<h4>`, for a thinker or concept block.
- `.quote` followed by `.who`, for a quote and its attribution.
- An inline `<svg class="d">` diagram, using the palette below.

## Every lesson must follow this pattern
Each lesson has 8–16 cards. Go deep: use as many words as the topic needs, but keep it digestible. Split a long idea across cards rather than writing a wall of text:
1. Hook: why this topic matters.
2. Core idea in plain words.
3. 2–4 thinker cards, each giving the book, the year and the key claim.
4. A debate or critique card.
5. An "Indian angle" card with real Indian examples.
6. An "Exam lens" card (`cls: "exam"`) with real PYQ-style questions and an answer structure.

Then ten quiz questions with plausible distractors. Don't add throwaway options.

### Writing style (non-negotiable)
- Plain, easy English. Write complete sentences and keep them short. Nothing should need reading twice.
- Keep UPSC optional depth: name thinkers, books, years and key terms that examiners look for.
- Aim for about 120–180 words per card. Detail is welcome; if a card runs longer, split it into two cards.
- Don't use all-caps labels.

### Verification (non-negotiable)
- Check every name, book title, year, quote, Article number, amendment and case against a reliable source. For thinkers, use Gauba, Heywood, the Stanford Encyclopedia of Philosophy and the original texts. For Indian polity, use the Constitution text, PRS and PIB. For foreign policy, use MEA and PIB.
- Quote short phrases only and attribute them precisely. If you can't verify a quote, paraphrase it.
- Paper II Section B goes stale fast. Re-check every current fact at build time, and write the date into `verified`.
- After every unit, run a separate judge agent. It should go through the lesson in Playwright at 390×844, check the facts, and report bugs, UI problems and content problems.

## Priority order (from PYQ analysis, 2013–2026)
Units marked `true` in `syllabus.json` are asked often. Write these first:
- **Paper I Section A:** Western thought (about 22% of 1A marks) and Indian thought (about 17%). Thinkers make up about 40% of 1A marks. The most-asked thinkers are Marx, Rawls, Gandhi, Ambedkar and Aristotle. Political ideologies are about 12.6%.
- **Paper I Section B:** federalism (nearly every year), the party system, caste, religion and ethnicity, and the salient features of the Constitution.
- **Paper II Section A:** IR theory, including constructivism (Wendt, Finnemore and Sikkink, Katzenstein), plus globalisation and global concerns.
- **Paper II Section B:** India–China has been asked every year from 2015 to 2025. India–USA comes close behind, then South Asia, Indo-Pacific and West Asia.

About half of each year's questions repeat themes from earlier papers. Map each lesson's exam card to real PYQs from politicsforindia.com (topic-wise PYQs, 1995–2026) and the official UPSC papers.

Topper sources to cross-check content against:
- Shubhra Ranjan class notes.
- O.P. Gauba, *An Introduction to Political Theory*.
- Tushar Gupta's notes.
- politicsforindia.com notes.
- Pushpesh Pant, *International Relations*.
- Rajiv Sikri, *Challenge and Strategy*.
- Laxmikanth, *Indian Polity*.

## Design tokens
Colours:
- lapis `#13294b`
- night `#0c1c36`
- gold leaf `#c9a45c`
- dark gold (text on marble) `#7d5a1c`
- marble `#f3f1ec`
- ink `#1d2433`
- vein grey `#5d6474`
- Pompeian red (wrong answer) `#a3362a`
- teal (correct answer, exam cards) `#2f6f7a`

Type: Cinzel for display headings and numerals, and Spectral for body text (17px, line-height 1.65).

Motifs:
- Greek-key border.
- Hand-drawn SVG bust between Ionic columns in the hero.
- Marble texture made with `feTurbulence`.
- Laurel wreath on the quiz end screen.

Motion: one page-load rise on the hero and nothing else, and respect `prefers-reduced-motion`.

## Known gaps to fix
- **Missing content:** Lesson 1 should add Skinner and the Cambridge School, plus Bell's *The End of Ideology* (1960) and Fukuyama, in the decline-and-revival section.
- **Diagrams:** add more SVG diagrams. Ideas: a Rawls original-position diagram, a Kautilya mandala diagram, an India–China border map schematic, and timelines for the freedom struggle.
