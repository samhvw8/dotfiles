# Media Playbooks & Quantitative Evidence Reference

## Contents
- 1. Foundational Quantitative Benchmarks
- 2. Website & Landing Page Playbook
- 3. UI/UX Product & Dashboard Playbook
- 4. Images, Posters & Thumbnails Playbook
- 5. Presentation Slides & Pitch Decks Playbook
- 6. Vlogs & Short/Long-Form Video Playbook
- 7. Motion Graphics & Explainer Animation Playbook
- 8. Podcast & Audio Storytelling Playbook

---

## 1. Foundational Quantitative Benchmarks

| Phenomenon | Measured Metric | Primary Citation |
|------------|-----------------|------------------|
| **Photopic Peak & Yellow Luminance** | `555 nm` peak; `#FFFF00` relative luminance `L = 0.9278` (`19.56:1` on `#000000`, `1.07:1` fail on `#FFFFFF`) | `Itti, Koch, & Niebur (1998)`; `Camgöz et al. (2002, 2004)` |
| **Von Restorff Isolation CTA Lift** | `+6.3% to +34%` conversion lift when 1 chromatic outlier sits in a neutral field | `Von Restorff (1933)`; `Hunt (1995)`; `CXL / Baymard` |
| **Web Aesthetic First Impression** | `17–50 ms` (`r = .947` with `500 ms`); driven by low visual complexity ($\eta_p^2 = .520$) and high layout prototypicality ($\eta_p^2 = .552$) | `Lindgaard et al. (2006)`; `Tuch et al. (2012)` |
| **Web First-Fixation Predictors** | Mean error in pixels: **Position `39.1 px`**, **Text Style `81.4 px`**, **Color Contrast `96.9 px`**, **Images `172.6 px`**, **Size `326.6 px`** | `Still (2018)`, *ACM TOCHI* |
| **Viewport & Horizontal Fixation Share** | **57%** above the fold; **74%** in first 2 viewports; **80%** on left half; **0.8%** on ad-like right rail (`33×` penalty) | `Fessenden / NN/g (2017, 2018)`; `Burke et al. (2005)`; `Pernice (2018)` |
| **Disrupt-Then-Reframe (DTR) Paradox** | **65% vs. 35%** compliance when a brief disruption is immediately followed by a value reframe | `Davis & Knowles (1999)`; `Fennis et al. (2004)` |
| **Working Memory Focus Limit** | **`4 ± 1` chunks (3 to 5 items)** once covert rehearsal is controlled | `Cowan (2001)`, *Behavioral and Brain Sciences* |
| **Multimedia Learning Effect Sizes** | **Temporal Contiguity `d = 1.31`**, **Spatial Contiguity `d = 1.12`**, **Coherence `d = 0.86`**, **Segmenting `d = 0.79`**, **Redundancy `d = 0.72`**, **Signaling `d = 0.46`** | `Mayer (2009, 2020)` |
| **Short-Video Swipe & Hook Window** | Mean swipe decision `2.8 s` (`72%` in $\le 3\text{ s}$); greetings raise 3s bounce `+37%`; $\le 15$-word paradox lifts completion `+20–22%` | `Tencent / Douyin Creator Data (2025)` |
| **Neurocinematics & Cut Overload** | `65%` neocortical fMRI sync (directed suspense) vs. `<5%` (raw); `>16–24 cuts/min` during complex speech overloads memory | `Hasson et al. (2008)`; `Lang (2000)` |
| **Podcast Speech Rate & MMN** | `100–250 ms` Mismatch Negativity on sudden silence (`150–175 ms` TWI); **`170–190 wpm`** optimal recall ($\eta_p^2 = .51$); collapse `>210 wpm` | `Näätänen et al. (2007)`; `Yabe et al. (1997)`; `Rodero (2016, 2021, 2023)` |

---

## 2. Website & Landing Page Playbook

1. **Pass the 50ms Gist Gate:** Use standard navigation placement and clean grid alignment above the fold so prototypicality stays high ($\eta_p^2 = .552$).
2. **Anchor the Top-Left Entry Point:** Place the paradox headline and primary value metric in the top-left zone where 80% of horizontal fixations concentrate.
3. **Replace F-Pattern Walls with Layer-Cake Bands:** Break long prose into horizontal bands of 3–4 cards (`4 ± 1`), front-loading the first 2–3 words (~11 chars) of every heading and bullet with concrete nouns and numbers.
4. **Eliminate Right-Rail Islands:** Never place testimonials, security badges, or CTAs in ad-shaped right-rail boxes (`0.8%` gaze share due to Hot-Potato Banner Blindness).

---

## 3. UI/UX Product & Dashboard Playbook

1. **Compress Choice Latency:** Group navigation bars, tabs, and KPI summary rows into 3–5 items (`Cowan, 2001`). Move secondary filters into progressive disclosure drawers.
2. **Enforce a 4-Level Typographic Ceiling:** Limit any single viewport to at most 4 font-size/weight hierarchy levels.
3. **Align Chromatic Salience with User Intent:** Never make a destructive or exit button ("Cancel", "Log Out", "Delete") the sole high-contrast outlier on a neutral screen.
4. **Prevent OLED Halation:** Use `#121212` or `#0F172A` dark surfaces with `87%` white (`#E2E8F0`) body text for long-session readability.

---

## 4. Images, Posters & Thumbnails Playbook

1. **Enforce the 3-Chunk Cap:** Include at most (1) one expressive face or anomalous object, (2) one 2–4 word high-contrast badge (`#FFD600` on `#0B0E14`), and (3) one clean figure-ground background (`>8:1` local contrast).
2. **Direct Biological Gaze Cueing:** Orient the subject's eyes or pointing gesture directly toward the paradox object or 2–4 word badge (`Friesen & Kingstone, 1998`).
3. **Complement, Never Duplicate the Title:** Put the visual anomaly in the thumbnail and the mechanism/stakes in the title (`Mayer Redundancy Principle, d = 0.72`).

---

## 5. Presentation Slides & Pitch Decks Playbook

1. **Use Assertion–Evidence Structure (`Alley & Neeley, 2005`):** Write a full-sentence conclusion/paradox ($\le 14$ words) as the top-left headline, and fill the slide body with one visual diagram or 3-column comparison instead of bullet lists.
2. **Respect Phonological Loop Limits:** Never display multi-line sentences while speaking them aloud (`Mayer, 2009`).
3. **Apply Direct Spatial Contiguity & Signaling:** Place labels directly on chart lines/bars (delete separate legends), mute baseline bars to `#475569`, and highlight only the 1 target series in `#FFD600` or `#FF5500`.

---

## 6. Vlogs & Short/Long-Form Video Playbook

1. **Start In-Motion at Frame 1 (`0.0–3.0s`):** Cut all creator greetings (`+37%` bounce penalty). Open mid-action with immediate vocal onset (`<150 ms`) and a 2–4 word center-frame kinetic anchor.
2. **Land the Paradox + Stakes (`3.0–15.0s`):** State a $\le 15$-word counterfactual claim and show visual proof of the outcome before second 15 (`Teixeira, Wedel, & Pieters, 2012`).
3. **Reset Visual Framing Every 4–8s (`Guo et al., 2014`):** Alternate talking-head shots with B-roll or progressive diagrams (`+15–20%` engagement lift).
4. **Chain Cascading Zeigarnik Loops:** Open the next question before closing the current one at every chapter boundary.

---

## 7. Motion Graphics & Explainer Animation Playbook

1. **Single-Vector Motion Discipline:** Animate strictly 1 focal group per beat so the V1/MT Winner-Take-All saliency peak never splits across competing moving objects.
2. **Lock `±100 ms` Temporal Contiguity:** Trigger kinetic text pops and diagram callouts within `±100 ms` of the spoken keyword (`Mayer, 2009`, `d = 1.31`).
3. **Apply the Inverse Pacing Law (`Lang LC4MP, 2000`):** Use fast cuts (`1.5–3s`) during simple visual montages, but slow down to `6–12s` progressive canvas morphs (`<12 cuts/min`) when explaining complex technical mechanisms.

---

## 8. Podcast & Audio Storytelling Playbook

1. **Trigger Auditory MMN with Silence:** Before a core thesis, cut the music bed, pause for `0.8–1.5 s` of dead air, and drop into a lower vocal register (`Näätänen et al., 2007`).
2. **Hold the `170–190 wpm` Recognition Sweet Spot (`Rodero, 2016`):** Avoid exceeding `210 wpm` (phonological loop overflow) or dropping below `150 wpm` (mind-wandering), and stress only 1–2 keywords per sentence (`8.9` pitch peaks per 60 words).
3. **Match Cold Open to Genre:** Use *in medias res* cold opens (`0–35s`) for narrative podcasts; for conversational/companion podcasts, preserve embodied vocal authenticity (`具身本真性`) and provide clickable `MM:SS` Shownotes (`Xiaoyuzhou FM 2024`).
