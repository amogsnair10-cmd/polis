# Living hero plates: brief for the local session (GPT image generation)

Goal: new, grand, hyper-detailed artwork for the 11 subject banners. In the app each banner is a layered animated scene with the mascot Inspector Lumen standing in the middle. These images become the painted layers behind and in front of him. They replace the old hero images. Do not edit the app. Only create and save images.

## Save here (fresh folder)
`art/hero-plates/<subject-id>/` with exactly these files per subject:

| File | What | Size |
|---|---|---|
| `plate.png` | Full background scene, no characters | 1024 x 1536 (2:3 portrait) |
| `rotor.png` | One centrepiece ring/object on a TRANSPARENT background, face-on, that the app will spin and orbit | 1024 x 1024, transparent PNG |
| `foreground.png` | Blurred out-of-focus shapes along the left and right edges only, TRANSPARENT background, centre completely empty | 1024 x 1536, transparent PNG |

Subject ids: psir, history, geography, environment, world, communism, astronomy, physics, chemistry, biology, quantum. 33 images in total. After each subject, commit and push (message: `Hero plates: <id>`). Never put keys or tokens in the repo.

## How to run it
1. Start ONE new ChatGPT image chat per subject (keeps the style consistent inside a subject). Paste the SHARED STYLE first, then the subject's three prompts one at a time.
2. If a plate has text, people or a busy centre, reply: `Redo. No text or characters. Keep the centre third calm and empty, and keep the bottom 28% fading to near-black.`
3. For the two transparent files ask for `a transparent PNG background` (cut-out). If the result has a solid background, reply: `Give me the same image on a fully transparent background, PNG, with soft edges.` If transparency is not possible, use a flat pure magenta #FF00FF background instead and save it as `rotor-magenta.png` / `foreground-magenta.png`; the cloud session will remove the magenta.
4. Palette is strict. The colours below must dominate. No other hue should compete.

## SHARED STYLE (paste first in every chat)
Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark. Composition rule for plates: portrait 2:3. The upper two thirds carry the grandeur. The CENTRE THIRD stays calm and empty (a small mascot will stand there). The LOWER-CENTRE is a softly lit stage (ledge, plinth or ground plane). The bottom 28% fades smoothly to near-black so a title can sit there. Warm light seems to come from the centre, as if from a glowing bulb.

---

## psir: Polis (Political Science (PSIR))

**Palette (strict):** deep shadow `#0a1428`, mid-tone `#13294b`, atmosphere glow `#2a4a80`, light and highlights `#c9a45c`.

**Chapter themes to hint at, small and in the margins:** Political Theory & Thought; Indian Government & Politics; Comparative Politics & IR; India and the World.

**Save to:** `art/hero-plates/psir/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A colossal marble senate-library at dusk seen from floor level: towering fluted Ionic columns receding into mist, a vast oculus pouring a shaft of golden light onto a polished marble stage, carved laurel friezes, scrolls and glowing script glyphs drifting in the beams. Weave in tiny motifs of the four themes at the edges: a thinker's bust and open book, a Parliament dome, a world map relief, a diplomatic scroll with wax seal.

STRICT PALETTE: deep shadow #0a1428, mid-tone #13294b, atmosphere glow #2a4a80, light and highlights #c9a45c. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large ornate bronze-and-gold zodiac-style ring (tick marks, small engraved glyphs, laurel leaves), seen face-on, perfectly circular. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #0a1428, #13294b, #2a4a80, #c9a45c. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred marble capitals, drifting scroll edges and golden dust motes along the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #13294b, #2a4a80, #c9a45c. No text, no characters.
```

---

## history: Chronicle (History)

**Palette (strict):** deep shadow `#24150c`, mid-tone `#3b2416`, atmosphere glow `#5a3a22`, light and highlights `#d9a441`.

**Chapter themes to hint at, small and in the margins:** Ancient India; Medieval India; Indian Art and Culture; Modern Indian History; Post-Independence India; World History.

**Save to:** `art/hero-plates/history/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A vast hall of the ages in amber haze: layered silhouettes of a Mauryan lion pillar, a Mughal dome, a Dravidian gopuram, a hill fort and a colonial-era building rising behind one another, oil lanterns on chains, worn stone steps climbing to a lit landing, loose manuscript pages and embers in the air. Hint at the six themes: Harappan seals, a temple relief, a miniature painting, a freedom-struggle banner, a tricolour flag, a world map.

STRICT PALETTE: deep shadow #24150c, mid-tone #3b2416, atmosphere glow #5a3a22, light and highlights #d9a441. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large antique bronze Ashoka-chakra-style wheel with 24 spokes and an engraved rim, face-on, circular. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #24150c, #3b2416, #5a3a22, #d9a441. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred hanging lantern, curled manuscript corner and ember sparks at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #3b2416, #5a3a22, #d9a441. No text, no characters.
```

---

## geography: Terra (Geography)

**Palette (strict):** deep shadow `#082631`, mid-tone `#0f3d4c`, atmosphere glow `#1b6175`, light and highlights `#f2b66d`.

**Chapter themes to hint at, small and in the margins:** Physical Geography; Indian Geography; World and Human Geography; Disasters and Mapping.

**Save to:** `art/hero-plates/geography/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A low-angle view of a giant hand-built relief map table of the Indian subcontinent: the Himalaya as snow-capped jagged peaks, rivers as threads of molten gold winding to a teal sea, monsoon storm clouds above, brass surveying instruments and a compass rose inlaid in the stone rim. Hint at the four themes: a volcano and fold mountains, a river delta, a city-lights night map, a cyclone swirl.

STRICT PALETTE: deep shadow #082631, mid-tone #0f3d4c, atmosphere glow #1b6175, light and highlights #f2b66d. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large antique brass armillary-style globe frame with latitude and longitude rings and a compass-rose ring, face-on. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #082631, #0f3d4c, #1b6175, #f2b66d. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred cloud wisps, brass instrument edges and drifting paper-map corners at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #0f3d4c, #1b6175, #f2b66d. No text, no characters.
```

---

## environment: Verdant (Environment)

**Palette (strict):** deep shadow `#10241a`, mid-tone `#1d3b2a`, atmosphere glow `#2f5d43`, light and highlights `#e0c35a`.

**Chapter themes to hint at, small and in the margins:** Ecology Basics; Biodiversity; Pollution and Degradation; Climate Change; Environmental Governance.

**Save to:** `art/hero-plates/environment/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A cathedral-scale ancient forest at golden hour: colossal moss-covered roots curving into a natural amphitheatre, shafts of light through a high canopy, waterfall mist, glowing fungi, fireflies and tiny wildlife silhouettes in the ferns. Hint at the five themes: a food-web of leaves, a tiger and a bird in the trees, a clear stream against a distant smog line, melting ice on one far horizon, a small wooden gavel-and-scroll carved into a trunk.

STRICT PALETTE: deep shadow #10241a, mid-tone #1d3b2a, atmosphere glow #2f5d43, light and highlights #e0c35a. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large wreath ring woven from leaves, vines and tiny flowers, perfectly circular, face-on. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #10241a, #1d3b2a, #2f5d43, #e0c35a. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred hanging vines, big leaves and glowing spores at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #1d3b2a, #2f5d43, #e0c35a. No text, no characters.
```

---

## world: Odyssey (World History)

**Palette (strict):** deep shadow `#0b0820`, mid-tone `#1b1440`, atmosphere glow `#3d2b7a`, light and highlights `#e8a65a`.

**Chapter themes to hint at, small and in the margins:** Before History; The First Civilisations; The Classical World; Faith, Steppe and Sea; The World Connects; Revolutions; The Violent Century; Our World; Hidden Histories.

**Save to:** `art/hero-plates/world/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A monumental brass armillary courtyard under a violet cosmos: floating stone platforms carrying miniature wonders (pyramid, pagoda, Greek temple, aqueduct, galleon) orbiting a central warm glow, swirling constellations, engraved astrolabe rings catching amber light. Hint at the nine themes: a cave painting, a ziggurat, a Roman arch, a mosque dome and a steppe horse, a printing press, a barricade flag, a battlefield silhouette, a skyline, a hidden door.

STRICT PALETTE: deep shadow #0b0820, mid-tone #1b1440, atmosphere glow #3d2b7a, light and highlights #e8a65a. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large antique brass astrolabe/armillary ring set with engraved scales, seen face-on, circular. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #0b0820, #1b1440, #3d2b7a, #e8a65a. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred brass ring edges, stars and violet nebula wisps at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #1b1440, #3d2b7a, #e8a65a. No text, no characters.
```

---

## communism: Manifesto (Communist Theory)

**Palette (strict):** deep shadow `#1a0607`, mid-tone `#5a0f12`, atmosphere glow `#8c1a1f`, light and highlights `#f2c14e`.

**Chapter themes to hint at, small and in the margins:** Before and Around Marx; Marx and Engels; Lenin and the Soviet Experiment; Western Marxism; Revolutions of the Global South; After 1968; The Reckoning.

**Save to:** `art/hero-plates/communism/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A monumental industrial forge hall: giant gears and a roaring furnace pouring molten gold, long red cloth banners hanging from iron trusses, chimney and crane silhouettes against a smoky crimson sky, searchlight beams through steam, distant crowd silhouettes. Hint at the seven themes: a printing press and manuscripts, a Victorian factory, a Winter-Palace-style gate, a lecture hall, rice paddies and a mountain trail, Paris street cobbles, a fallen wall.

STRICT PALETTE: deep shadow #1a0607, mid-tone #5a0f12, atmosphere glow #8c1a1f, light and highlights #f2c14e. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large riveted iron-and-brass gear with engraved teeth and a star-shaped cut-out in the hub, face-on, circular. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #1a0607, #5a0f12, #8c1a1f, #f2c14e. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred cloth banner edges, steam and glowing sparks at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #5a0f12, #8c1a1f, #f2c14e. No text, no characters.
```

---

## astronomy: Nebula (Astronomy)

**Palette (strict):** deep shadow `#06051a`, mid-tone `#120f2e`, atmosphere glow `#2c2470`, light and highlights `#9fd3ff`.

**Chapter themes to hint at, small and in the margins:** The Sky; The Solar System; Stars; Galaxies and Cosmos; Exploration.

**Save to:** `art/hero-plates/astronomy/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A mountaintop observatory ledge under the full arch of the Milky Way, a vast ringed gas giant rising over the horizon, a distant telescope dome silhouette, drifting dust lanes, a faint aurora, razor-sharp stars. Hint at the five themes: constellations drawn faintly, a solar-system orbit diagram, a stellar nursery nebula, a spiral galaxy, a rocket trail.

STRICT PALETTE: deep shadow #06051a, mid-tone #120f2e, atmosphere glow #2c2470, light and highlights #9fd3ff. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large antique celestial-sphere ring set (ecliptic and equator rings with engraved tick marks), face-on, circular, silver and ice-blue. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #06051a, #120f2e, #2c2470, #9fd3ff. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred star clusters, dust lanes and faint comet tails at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #120f2e, #2c2470, #9fd3ff. No text, no characters.
```

---

## physics: Circuit (Physics)

**Palette (strict):** deep shadow `#061822`, mid-tone `#0f2a3a`, atmosphere glow `#1d4d66`, light and highlights `#ffb547`.

**Chapter themes to hint at, small and in the margins:** Mechanics; Heat; Electricity and Magnetism; Light; Modern Physics.

**Save to:** `art/hero-plates/physics/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A grand physics hall: Tesla-coil arcs, a giant Foucault pendulum over a mirror-polished blueprint floor, magnetic field lines as glowing amber filaments, brass instruments and copper coils. Hint at the five themes: pulleys and levers, a steam engine valve, a bar magnet with field lines, a prism splitting light, an atom model.

STRICT PALETTE: deep shadow #061822, mid-tone #0f2a3a, atmosphere glow #1d4d66, light and highlights #ffb547. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large glowing atom model: three tilted electron orbit rings around a bright nucleus, copper and amber, face-on. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #061822, #0f2a3a, #1d4d66, #ffb547. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred copper coils, sparks and glass lens flares at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #0f2a3a, #1d4d66, #ffb547. No text, no characters.
```

---

## chemistry: Alembic (Chemistry)

**Palette (strict):** deep shadow `#08201c`, mid-tone `#14332e`, atmosphere glow `#24584f`, light and highlights `#7fe0c4`.

**Chapter themes to hint at, small and in the margins:** Foundations; Reactions; Elements and Materials; Organic Chemistry; Chemistry in the World.

**Save to:** `art/hero-plates/chemistry/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A cathedral of an alchemist's glass laboratory: spiralling distillation tubes forming gothic arches, huge glowing flasks with swirling liquid, floating molecular lattices, crystal clusters, drifting mint vapour, periodic-table tiles carved into a stone wall. Hint at the five themes: an atom diagram, a bubbling reaction, metal ingots, a benzene ring, a water-treatment plant.

STRICT PALETTE: deep shadow #08201c, mid-tone #14332e, atmosphere glow #24584f, light and highlights #7fe0c4. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large benzene-ring molecule model with glowing ball-and-stick atoms inside a ring of element-symbol medallions, face-on. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #08201c, #14332e, #24584f, #7fe0c4. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred glass flask edges, bubbles and mint vapour at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #14332e, #24584f, #7fe0c4. No text, no characters.
```

---

## biology: Helix (Biology)

**Palette (strict):** deep shadow `#0a2111`, mid-tone `#173a1f`, atmosphere glow `#2a6136`, light and highlights `#a6e36b`.

**Chapter themes to hint at, small and in the margins:** The Cell; Genetics; Evolution; The Human Body; Diversity and Ecology.

**Save to:** `art/hero-plates/biology/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
The inside of a vast living cell imagined as a rainforest cathedral: translucent membrane vaults, a DNA double helix forming a glowing spiral staircase, bioluminescent organelles, a leaf canopy overhead in lime-green light. Hint at the five themes: a nucleus, a chromosome pair, a tree of life, a neuron and heart, a coral-reef-and-forest ecosystem.

STRICT PALETTE: deep shadow #0a2111, mid-tone #173a1f, atmosphere glow #2a6136, light and highlights #a6e36b. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large DNA double helix coiled into a perfect ring with glowing base-pair rungs, face-on, circular. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #0a2111, #173a1f, #2a6136, #a6e36b. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred cells, spores and curling fern tips at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #173a1f, #2a6136, #a6e36b. No text, no characters.
```

---

## quantum: Quantum (Quantum Physics)

**Palette (strict):** deep shadow `#0c0620`, mid-tone `#1c1036`, atmosphere glow `#3b2470`, light and highlights `#c792ff`.

**Chapter themes to hint at, small and in the margins:** The Crisis; The Theory; The Weirdness; Frontiers.

**Save to:** `art/hero-plates/quantum/plate.png`, `rotor.png`, `foreground.png`

**1. plate.png prompt**
```
A cosmic double-slit stage: a monolithic slit gate releasing glowing ribbons of violet interference light, probability clouds forming layered ghostly shapes, drifting luminous particles, a dark infinite void with soft depth haze. Hint at the four themes: a glowing black-body curve, a wave-function equation made of light, a ghostly cat in a box, a quantum-computer chandelier.

STRICT PALETTE: deep shadow #0c0620, mid-tone #1c1036, atmosphere glow #3b2470, light and highlights #c792ff. No other hue should compete.
Portrait 2:3. Centre third calm and empty, lower-centre a softly lit stage, bottom 28% fading to near-black. Ultra-detailed cinematic digital painting, premium concept-art quality, epic grand scale, dramatic rim lighting and volumetric god-rays, rich fine micro-detail in every surface, atmospheric depth and haze, painterly but crisp. NO characters, NO people, NO animals as the focus, NO text, NO letters, NO numbers, NO logos, NO watermark.
```

**2. rotor.png prompt**
```
A large glowing orbital-lobe flower (four petals) inside a tilted Bloch-sphere ring, violet light, face-on. Isolated on a fully transparent background, PNG, soft clean edges, nothing else in the frame, centred, fills about 90% of the square. Ultra-detailed, engraved metal and glass texture, subtle inner glow. STRICT PALETTE: #0c0620, #1c1036, #3b2470, #c792ff. No text, no letters, no numbers.
```

**3. foreground.png prompt**
```
A transparent PNG overlay, portrait 2:3: only blurred glowing particles, wave-front ribbons and faint probability mist at the left and right edges. Large, soft, out-of-focus, cinematic depth-of-field shapes hugging the left and right edges, with the whole centre 60% completely empty and transparent. Rich colour from this palette only: #1c1036, #3b2470, #c792ff. No text, no characters.
```

---
