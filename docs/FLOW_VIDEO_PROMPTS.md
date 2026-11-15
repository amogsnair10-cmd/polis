# Hero videos for Light Bulb: Google Flow prompts (Veo)

Last updated: 2026-11-15

Goal: each subject's hero picture gets a short, silent video that moves gently and loops with no jump. The picture stays the same. Only light, dust, smoke, water and small details move.

The 11 subject ids are: psir, history, geography, environment, world, communism, astronomy, physics, chemistry, biology, quantum.

All commands below are for **Command Prompt** on Windows.

---

## 0. One-time setup: install ffmpeg

Open Command Prompt and run:

```
winget install ffmpeg
```

Close Command Prompt and open it again. Then check it works:

```
ffmpeg -version
```

If you see a version number, you are ready.

---

## 1. Make a Flow start image for each subject

Flow is happier with PNG than WebP, and it needs a tall 9:16 picture. Run this in the `polis` folder, once per subject (change `psir` to the id each time):

```
ffmpeg -i art\psir.webp -vf "crop=ih*9/16:ih,scale=1080:1920" flow_start_psir.png
```

Check the new PNG. If the crop cuts off the main subject, tell Claude and it will adjust the crop. Use this one PNG as **both** the first frame and the last frame in Flow.

---

## 2. The prompts

Every prompt uses the same rules:

- Motion is ambient and slow. Light, dust, smoke, water and leaves move.
- Motion goes out and comes back, so the last moment matches the first.
- The main subject stays where it is.

Paste the **Flow prompt** into Flow. Paste the **Negative** line into the negative prompt box if Flow has one. If it does not, add the Negative line at the end of the prompt.

**Shared negative base (already included in every negative line below):** camera cut, camera movement, zoom, pan, tilt, text, letters, logo, watermark, new people, new objects entering, morphing, changing faces, flashing light, blur, shaky footage.

### psir

**What it shows:** A white stone bust of a bearded Greek thinker, with a gold ring of light behind his head, two broken stone columns and drifting rock bits, on a deep blue smoky background.

**Flow prompt:** Cinematic, very subtle, seamless loop. The stone bust stays perfectly still. Gold dust particles drift slowly upward around the glowing halo ring, and the halo brightens and dims gently. Blue smoke moves slowly across the dark background and returns to its starting shape. Floating rock fragments hover and bob a few millimetres. Calm, reverent mood.

**Negative:** camera cut, camera movement, zoom, text, new people, new objects entering, statue moving, face changing, flashing light.

### history

**What it shows:** A stack of old manuscript books with a brass oil lantern lit in front, a red cloth, a quill in an inkpot and a scroll. Behind them, misty outlines of a domed palace, a temple tower and a stone lion pillar.

**Flow prompt:** Cinematic, very subtle, seamless loop. The lantern flame flickers softly and its glow pulses gently. Tiny dust motes float in the lantern light. Smoke drifts slowly through the misty background and returns to its starting shape. The red cloth stirs very slightly. The books, quill and scroll stay still. Warm, old-library mood.

**Negative:** camera cut, camera movement, zoom, text, pages turning, new objects entering, lantern going out, flashing light.

### geography

**What it shows:** A satellite-style view of India with glowing rivers and borders, snowy Himalayan peaks at the top, and a large cyclone swirling over the sea on the right.

**Flow prompt:** Cinematic, very subtle, seamless loop. The clouds over the mountains drift slowly sideways and return. The cyclone turns very slightly, rocking back and forth a little, not making a full spin. Glowing river and border lines shimmer softly. Sunlight on the mountain tops shifts gently. The land and coastline stay fixed.

**Negative:** camera cut, camera movement, zoom, full spinning, text, labels appearing, new objects entering, land changing shape, flashing light.

### environment

**What it shows:** A huge banyan tree with hanging aerial roots, a glowing sun through the leaves, waterfalls over mossy rocks, a tiger standing on a rock and small fireflies.

**Flow prompt:** Cinematic, very subtle, seamless loop. Water in the waterfalls shimmers and flows in place. Mist drifts slowly through the trees. The hanging vines sway gently and return. Fireflies drift and blink softly. Light rays through the leaves move a little. The tiger stays completely still. The tree and rocks do not move.

**Negative:** camera cut, camera movement, zoom, tiger walking, new animals, text, waterfall stopping, flashing light, leaves falling in bulk.

### world

**What it shows:** A large golden astrolabe floating in purple space, with small floating islands along a glowing orbit line: pyramids, an arch, a Viking ship, a rocket and a city skyline. A spiral galaxy sits at the top right.

**Flow prompt:** Cinematic, very subtle, seamless loop. The glowing dots on the orbit line pulse softly one after another. The astrolabe rings turn very slightly back and forth and return. The purple nebula drifts slowly. Stars twinkle gently. The rocket's exhaust flickers, but the rocket stays on its island. The islands and buildings do not move.

**Negative:** camera cut, camera movement, zoom, rocket launching, new objects entering, text, islands moving, flashing light.

### communism

**What it shows:** A large cracked red star with glowing gold light pouring through the crack. Factory chimneys smoke on the right. Silhouetted crowds walk up a slope at the bottom, and warm light rays cross the sky.

**Flow prompt:** Cinematic, very subtle, seamless loop. The gold light inside the crack pulses slowly and returns. Factory smoke drifts slowly and fades back. The light rays shimmer softly. Dust drifts in the warm air. The crowd silhouettes stay in place, with only a very slight shimmer. The red star does not move.

**Negative:** camera cut, camera movement, zoom, marching crowd, new people, text, symbols appearing, star moving, flashing light.

### astronomy

**What it shows:** A large black hole with a glowing orange and blue accretion disk, a spiral galaxy band across the sky, and a domed observatory on a snowy mountain below.

**Flow prompt:** Cinematic, very subtle, seamless loop. The glowing disk around the black hole turns slowly and returns to where it started. Stars twinkle gently. Faint clouds drift slowly across the mountains. The observatory dome light stays steady. The black hole and mountains do not move.

**Negative:** camera cut, camera movement, zoom, shooting star, new objects entering, text, flashing light, black hole growing or shrinking.

### physics

**What it shows:** A polished Newton's cradle with five glass spheres showing a galaxy, Jupiter, Earth, Saturn and Mars. Glowing wave lines and rings sit behind and under it.

**Flow prompt:** Cinematic, very subtle, seamless loop. The glowing wave lines in the background ripple slowly and return. Light rings on the floor pulse outward softly and fade. Fine grid lines shimmer. The metal glints move a little with the light. The spheres and the frame stay still.

**Negative:** camera cut, camera movement, zoom, balls swinging, new objects entering, text, flashing light, frame moving.

### chemistry

**What it shows:** A glass alembic on a stand with a small flame underneath, and a round flask full of glowing green liquid. Green vapour rises from the flask. Crystals sit around the base, with a mortar and pestle and a molecule model at the top.

**Flow prompt:** Cinematic, very subtle, seamless loop. Bubbles rise slowly inside the green liquid. The flame flickers softly. Green vapour curls up and fades in a slow loop. The crystals catch light and glint gently. The molecule model turns very slightly and returns. The glassware and mortar stay in place.

**Negative:** camera cut, camera movement, zoom, glass breaking, liquid spilling, new objects entering, text, flashing light.

### biology

**What it shows:** A green tree whose trunk is a DNA double helix, with a glowing cell, a yellow butterfly, a small second butterfly and a hand reaching in from the upper right.

**Flow prompt:** Cinematic, very subtle, seamless loop. Leaves sway gently and return. The yellow butterfly flaps its wings and drifts in a small loop back to its spot. Golden light specks float upward through the green air. The glow along the DNA rungs pulses softly. The hand and the tree trunk stay still.

**Negative:** camera cut, camera movement, zoom, hand moving, new animals, text, butterflies flying away, flashing light.

### quantum

**What it shows:** A dark purple scene with a light beam going through a two-slit barrier, bright and dark interference bands, and two translucent ghost-like cat silhouettes sitting in a wave field.

**Flow prompt:** Cinematic, very subtle, seamless loop. The interference bands shimmer softly and return to their starting brightness. Purple wave lines flow slowly through the scene and come back. Dust specks drift in the light. The ghostly cat outlines brighten and dim gently in place, without moving their bodies. The barrier and beam stay steady.

**Negative:** camera cut, camera movement, zoom, cats moving or walking, new objects entering, text, flashing light, beam changing direction.

---

## 3. How to make it loop perfectly

**Flow settings (Frames to Video):**

1. Choose **Frames to Video** (sometimes called "Start and end frame").
2. Upload `flow_start_<id>.png` as the **first frame**.
3. Upload **the same file** as the **last frame**.
4. Paste the Flow prompt and the Negative line for that subject.
5. Set **9:16** (vertical), **8 seconds**, and **no audio** if Flow asks.
6. Generate. If you do not like it, generate again. Keep the one with the smallest, calmest motion.
7. Download the video. Save it as `flow_raw_<id>.mp4` in the `polis` folder.

**Check the seam:** Play the video 3 times in a row with repeat on (VLC or a browser). Watch the moment it jumps from the end back to the start. If it looks smooth, you are done. If you see a jump, use the fallback in the next step.

**Fallback: fix the seam with ffmpeg (run in the folder with the file).**

*Option A: crossfade loop (recommended).* This blends the last second into the first and makes a 7-second loop:

```
ffmpeg -i flow_raw_psir.mp4 -filter_complex "[0:v]split=2[a][b];[a]trim=end=7,setpts=PTS-STARTPTS[main];[b]trim=start=7,setpts=PTS-STARTPTS[tail];[main][tail]xfade=transition=fade:duration=1:offset=6[v]" -map "[v]" -an loop_psir.mp4
```

*Option B: ping-pong.* This plays the video forward, then backward. It is 16 seconds long and always loops cleanly, but the motion reverses, so use it only for calm, slow motion:

```
ffmpeg -i flow_raw_psir.mp4 -filter_complex "[0:v]split=2[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0[v]" -map "[v]" -an loop_psir.mp4
```

Use the file named `loop_<id>.mp4` in the next section. Replace `psir` with the subject id.

---

## 4. Prepare the files for the app

The app needs two versions of each video: MP4 and WebM. Both are 720 x 1280 (9:16), 24 frames per second, with no audio, and each must be under 2.5 MB.

Make the folder once:

```
mkdir art\video
```

**MP4 (H.264):**

```
ffmpeg -i loop_psir.mp4 -vf "fps=24,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1" -an -c:v libx264 -preset slow -crf 28 -maxrate 2000k -bufsize 4000k -pix_fmt yuv420p -movflags +faststart art\video\psir.mp4
```

**WebM (VP9):**

```
ffmpeg -i loop_psir.mp4 -vf "fps=24,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1" -an -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -pix_fmt yuv420p art\video\psir.webm
```

**Check the size:** Run `dir art\video`. Each file must be under 2.5 MB. If one is too big, run the same command again with a higher number after `-crf`: use 30 for the MP4 and 42 for the WebM. A higher number means a smaller file and slightly lower quality.

**Do all 11 at once (optional):** Put the 11 loop files in a folder called `loops`, then run this in Command Prompt from the `polis` folder:

```
for %i in (psir history geography environment world communism astronomy physics chemistry biology quantum) do ffmpeg -i loops\%i.mp4 -vf "fps=24,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1" -an -c:v libx264 -preset slow -crf 28 -maxrate 2000k -bufsize 4000k -pix_fmt yuv420p -movflags +faststart art\video\%i.mp4
```

**Poster image:** You do not need a new file. The existing `art\<id>.webp` picture is the poster. The video should show that picture first, so the switch from picture to video looks seamless.

**File names:**

- `art/video/<id>.mp4`
- `art/video/<id>.webm`

**For the app:** Each subject in `subjects.json` will get a field called `heroVideo`, for example `"heroVideo": "art/video/psir"`. The app code that uses it is **not written yet**. Until that is done, nothing changes in the app, and the existing `hero` picture still shows.
