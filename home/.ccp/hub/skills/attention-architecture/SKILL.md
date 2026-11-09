---
name: attention-architecture
description: "Engineer, generate, and audit human attention capture, emotional rhythm, color-script harmony, causal pattern ruptures, choice architecture, psycholinguistic wording, and information organization across all 9 media deliverables (Web UI/UX, Mobile App, Long Video, Short Reels/TikTok, Poster/Thumbnail, Comic/Storyboard, Audio/Podcast, Infographic/DataViz, and Slide Decks) using 74 full-text primary papers (P01-P74), 45,246 Upworthy A/B experiments, 126 Nudge Unit RCTs, and 2,465 TED Talks."
---

# Attention & Information Architecture

Apply empirical visual/auditory neuroscience, reading & numerical psychophysics, and eye-tracking laws to capture human attention in `<300 ms`, convert it into epistemic curiosity (`0.3–15 s`), and organize information for effortless retention (`>15 s`).

For full citations, domain metrics, and extended examples, read [references/media-playbooks.md](references/media-playbooks.md) and `~/workspace/knowledge/patterns/attention-and-information-architecture.md`.

---

## 1. The 3-Stage Neuro-Cognitive Pipeline (Apply to Every Medium)

Every piece of media must pass three sequential biological gates (`Corbetta & Shulman 2002`):

1. **Gate 1 — Sensory Arrest (`0–300 ms`, Ventral Network + V1/A1 + Superior Colliculus):**
   - **Photopic Luminance (`555 nm`) & Color Opponency (`Itti & Koch 2001`; `Camgöz et al. 2004`):** Human photopic vision sums L-cones (`0.2126`) + M-cones (`0.7152`), peaking at `555 nm`. Pure yellow (`#FFD600`, $L = 0.9278$) achieves **19.56:1 contrast on black** (`14.6:1` on `#0F172A`) and fires both intensity and blue-yellow opponent channels.
   - **The Dark Yellow Rule:** Never place yellow text/icons directly on white (`1.07:1` contrast failure). On light backgrounds, put **dark ink (`#0B0E14`) inside a `#FFD600` fill with a dark border (`14.6:1`)**, or switch the accent to Vermilion (`#FF5500`).
   - **Von Restorff Isolation (`1933`) & Motion Onset (`Abrams & Christ 2003`):** Keep `85–90%` of the frame neutral and reserve the peak-contrast accent for **exactly 1 focal target**. Never use infinite looping animations (which habituate); trigger a **single stationary-to-moving Motion Onset (`150–250 ms`, `cubic-bezier(0.22, 1, 0.36, 1)`)**.
   - **Auditory Mismatch Negativity (`Näätänen 2007`):** In audio/video, cut the background bed and hold **`0.8–1.5 s` of dead silence** before dropping into a lower vocal register (`100–250 ms` pre-attentive MMN wave).

2. **Gate 2 — Epistemic & Dopaminergic Hook (`0.3–15 s`, Dorsal Network + ACC + VTA-Hippocampal Loop):**
   - **Schema-Incongruent Paradox (`Meyer 1997`; `Loewenstein 1994`):** Sensory arrest decays in `1–3 s` (mean short-form swipe decision is `2.8 s`). Collide two familiar beliefs to open a curiosity gap.
   - **Disrupt-Then-Reframe (`Davis & Knowles 1999`) & Numeric Precision (`Janiszewski & Uy 2008`):** Pair a brief cognitive disruption + precise number (`+38.4%`, `1,428 ms`) with an immediate value reframe (`65%` vs `35%` compliance).
   - **The Dopaminergic Curiosity Halo (`Gruber et al. 2014`, *Neuron*):** Place your brand mark, core product name, or key takeaway **inside the open curiosity window** (after posing the paradox, *before* resolving it) to capture **`+20–30%` higher hippocampal memory encoding**.

3. **Gate 3 — Structural Retention, Subitizing & Peak–End Encoding (`>15 s`, Prefrontal Cortex):**
   - **Pre-Attentive Subitizing (`<100 ms` for `1–4` items, `Trick & Pylyshyn 1994`) & Cowan's `4 ± 1` Limit (`2001`):** Cap thumbnails to `≤3` elements and rows/navs/tiers to `3–4` chunks (`5+` items force `250–350 ms/item` serial counting).
   - **Reading Perceptual Span (`Rayner 1998`) & Information Scent (`Pirolli & Card 1999`):** Readers extract `3–4` chars left and `14–15` chars right of fixation (`50–75` CPL optimal). Front-load the first **`2–3` words (`~11` chars)** of every heading/bullet (`4` CJK chars in `ZH`/`ZH-TW`/`JA`).
   - **Dual-Channel Anti-Redundancy (`Mayer 2009`) & Asymmetric AV Sync (`Vroomen & Keetels 2010`):** Never read on-screen text walls verbatim ($d = 0.72$ penalty). Audio must never lead video cuts by `>40 ms`; place sound hits `0 to +66 ms` (`0–2` frames) *after* the visual frame.
   - **Endowed Progress (`Nunes & Dreze 2006`) & Peak–End Rule (`Kahneman 1993`):** Start progress bars at `20–25%` (`34%` vs `19%` completion) and cut to black immediately after a final `5–10 s` synthesis peak.

---

## 2. Concrete Playbooks by Medium

### A. Images, Posters & Video Thumbnails
- **3-Element Subitized Cap:** Maximum `3` visual objects: (1) `1` expressive face/hand or anomaly object (`FFA/STS` N170 at `170 ms`), (2) `1` **`2–4` word badge** (`#FFD600` on black), and (3) `>8:1` figure-ground separation.
- **Biological Gaze Cueing (`Friesen & Kingstone 1998`):** Direct the subject's eyes, hands, or arrows straight at the paradox badge (`100–200 ms` reflexive gaze shift).
- **Complementary Framing:** The thumbnail shows the visual anomaly (`3` words); the title explains the mechanism. Never duplicate the title on the image.

### B. Presentation Slides & Pitch Decks
- **Assertion–Evidence Architecture (`Alley & Neeley 2005`):** Make the top-left headline (`39 px` first-fixation anchor) a **full-sentence conclusion (`≤14` words)** with a precise number (`+38.4%`), never a topic label (*"Q3 Metrics"*).
- **Cleveland & McGill Chart Accuracy (`1985`) + ISOTYPE (`Haroz 2015`):** Use aligned bar/dot charts (`1.0×` error) or discrete ISOTYPE icon arrays (`+25–38%` memory recall) over pie/bubble charts (`1.95–2.4×` error). Mute secondary bars to `#475569` and highlight **1** focal bar in `#FFD600`.
- **Direct Spatial Contiguity (`d = 1.12`):** Place data labels directly onto bars/lines; delete detached legends and bullet walls.

### C. Vlogs, Short-Form (TikTok/Reels/Shorts) & Long-Form Video
- **0.0–3.0s Mid-Motion Arrest:** Delete all greetings (`+37%` bounce penalty). Start mid-action with a center-frame (`25%–72%` vertical safe zone) `2–4` word caption and vocal onset `<150 ms`.
- **3.0–15.0s Paradox + Curiosity Halo (`Gruber 2014`):** Deliver a `≤15`-word counterfactual claim, insert the core brand/concept inside the open curiosity loop, and flash visual proof of stakes before `15 s` (`Teixeira 2012`).
- **Alternating Rhythm (`Guo 2014`), *Kishōtentetsu* (`起承転結`) Twist & Peak–End Cut:** Switch between talking-head and hands-on action/diagrams every `4–8 s`; introduce an orthogonal domain twist (`転`) at `50–75%` progress; end on a `5–10 s` synthesis peak with zero housekeeping tail.

### D. Motion Graphics & Kinetic Typography
- **Single-Vector Motion Onset (`Abrams & Christ 2003`):** Dim static context to `25–35%` opacity and trigger **1** focal motion onset (`150–300 ms` `cubic-bezier(0.22, 1, 0.36, 1)`) per beat.
- **Asymmetric Audio-Visual Sync (`0 to +66 ms`):** Trigger kinetic text within `±100 ms` of the stressed syllable (`Mayer d = 1.31`) and align transient sound effects `0–2` frames *after* the visual cut (`Shams 2000`; `Vroomen & Keetels 2010`).
- **Continuous Morphing > Hard Cuts (`Lang 2000`):** Morph states on the same canvas (`6–12 cuts/min`) during dense explanations to prevent LC4MP orienting overload.

### E. Websites & High-Converting Landing Pages
- **50ms Prototypicality + Top-Left Entry (`Still 2018`):** Keep navigation canonical, constrain body text to **`50–75` CPL** (`66` ideal), and place the Disrupt-Then-Reframe headline + precise metric in the top-left/center-left viewport (`80%` left-half gaze).
- **1 Isolated CTA + Layer-Cake `4±1` Bands:** Isolate 1 primary `#FFD600`-on-dark (or black-ink-on-`#FFD600`-fill) CTA; organize below-the-fold into `3–4` card rows with front-loaded `11-character` headings; never use right-rail callouts (`0.8%` gaze, `Pernice 2018`).

### F. Product UI / UX & Dashboards
- **Subitized `3–4` Clusters & `1px` Bento Cells (`Palmer 1992`):** Cap primary nav and KPI rows to `3–4` items; for high-density dashboards (or CJK interfaces), enclose every module in a `1px` Bento border holding `≤3` internal values.
- **Endowed Progress Onboarding (`Nunes & Dreze 2006`):** Initialize multi-step progress bars at **`20–25%` ("Step 1 of 4 complete ✓")** to trigger Goal-Gradient acceleration (`34%` vs `19%` completion).
- **Duration Thresholds & Anti-Misclick Hierarchy:** Keep micro-feedback `<100 ms` and layout transitions `150–300 ms`; cap typography to `≤4` levels; use `#121212` + `87%` white (`#E2E8F0`) in dark mode; never style "Cancel / Log Out" as the brightest Von Restorff outlier.

### G. Podcasts & Spoken-Word Audio
- **Acoustic MMN Silence Drop (`Näätänen 2007`):** Cut the music bed and hold **`0.8–1.5 s` of dead air** before dropping into a lower vocal register for the core thesis.
- **`170–190 wpm` Prosody (`Rodero 2016`) & Externalized Anchors:** Pace speech at `170–190 wpm` (`η²p = .51`), pre-announce `3` chunks, and pair with clickable `MM:SS` Shownotes (`Xiaoyuzhou FM 2024`).

---

## Master 18-Gate Cross-Domain Pre-Flight Audit (Run Before Finishing Any Deliverable)

Every visual, interactive, video, or audio deliverable must pass both its **Deliverable-Specific 5-Gate Matrix** (Domain V below) and this **18-Gate Cross-Domain Pre-Flight Audit** grouped by functional domain:

### Group I · Sensory Arrest, Spatial Layout, GRIDS & UMSI (Gates 1–6)
- [ ] **1. `555 nm` Luminance & Von Restorff Isolation (`P01–P04`):** `85–90%` of the frame is neutral; only `1` primary CTA/focal target uses `#FFD600` on dark (`>= 14.6:1`) or dark ink `#0B0E14` inside a `#FFD600` fill. Zero yellow text/icons on white (`1.07:1`).
- [ ] **2. Single Motion Onset & Deceleration Physics (`Abrams & Christ 2003`):** Zero infinite blinking/looping animations (which habituate); trigger a single stationary-to-moving onset (`150–300 ms`) with `cubic-bezier(0.22, 1, 0.36, 1)`.
- [ ] **3. `50 ms` Visceral Gist, Top-Left Entry (`39 px`) & Anti-Banner Blindness (`Still 2018`; `Burke 2005`):** Primary entry anchor sits in the top-left (`80%` left-half gaze); zero critical proof or CTAs in a right-hand sidebar (`0.8%` gaze) or banner-shaped island.
- [ ] **4. Subitizing Limit (`<= 3–4` Objects) & `1px` Bento Chunking (`Cowan 4±1`; `Putkonen 2025, P10`):** Thumbnails/posters have `<= 3` objects (`<100 ms`); each row holds `3–4` cards; high-density Bento cells use `1px` borders with `<= 3` metrics per card and `<= 4` font sizes per screen.
- [ ] **5. Monotonic CIELAB Scales & Dark-is-More Encoding (`Schoenlein 2022, P04`; `Braun & Schloss 2025, P07`):** Data scales map darker/more opaque values to larger quantities (avoiding the `+180–320 ms` inversion penalty) with monotonic lightness (`Delta L* >= 45`); zero rainbow colormaps.
- [ ] **6. `GRIDS` Alignment (`<= 4` Axes) & `UMSI` 3-Peak Heatmap (`Dayama 2020, P08`; `Fosco 2020, P09`):** All elements snap to `<= 4` global alignment groups with `>= 35–45%` whitespace and `<= 3` visual importance peaks in the 3-second UMSI heatmap.

### Group II · Empirical A/B Hooks, Reading Psychophysics, DataViz & Multimodal Sync (Gates 7–12)
- [ ] **7. 2-Clause Counterfactual Hook (`H02`) & Deferred Demonstrative (`H01`) (`Upworthy 45,246 A/B Pairs`):** Open with a 2-clause belief violation (`+11.2%` CTR) + forward-referencing demonstrative (`This / Thứ này / Điều này`, `d = +0.100`); zero opening Yes/No questions (`FMEA-01: -12.8%` CTR).
- [ ] **8. Dopamine Curiosity Halo (`+25%`) & Disrupt-Then-Reframe (`35% -> 65%`) (`Gruber 2014`; `Davis & Knowles 1999`):** Place the brand/product/core mechanism *inside* the open curiosity loop before resolving it.
- [ ] **9. `55–68 CPL` Reading Span, `11-Char` Left Scent & Precision Disfluency (`Rayner 1998`; `Alter 2007`):** Keep prose lines at `55–68` characters; front-load the most diagnostic noun/number in the first `2–3` words (`~11` chars); use exact non-round metrics (`$49.87`, `71.47%`) to trigger System 2 evaluation.
- [ ] **10. Cleveland–McGill Aligned Bars (`1.0x` Error), Martini Glass & Zero-Bullet Slides (`Cleveland 1984`; `Segel & Heer 2010, P22`; `Mayer 2009`):** Use aligned bar/dot charts (`1.0x` error) with `1` `#FFD600` callout bar instead of pie charts (`2.6x` error); slide decks use `<= 9`-word assertion headlines and zero multi-line bullets (avoiding `-28%` redundancy loss).
- [ ] **11. Zero `0–3s` Greeting Bounce & `9:16` Vertical / Danmaku Safe Zone (`Baughan 2021, P06`):** Video/podcast starts in motion or paradox at `0.0s` (avoiding `+37%` bounce); keep faces and captions inside `Y = 25%–72%, X = 10%–85%`.
- [ ] **12. `0.8–1.5s` Acoustic MMN Silence, `160–185 WPM` & Asymmetric AV Sync (`Näätänen 2007`; `Rodero 2016`; `Vroomen 2010, P33`):** Drop background bed for `0.8–1.5s` before core thesis statements; maintain `160–185 WPM` (slowing cuts during complex claims per LC4MP); audio leads visual cuts by `120–150 ms` while impact SFX land at `0..+40 ms`.

### Group III · Neural Rhythm, 5-Quintile Storyboard, Dual-Mode CIELAB & 5-Vector Ruptures (Gates 13–18)
- [ ] **13. `1.5–2 Hz` Neural Entrainment & `E -> I -> P -> R` Storyboard Grammar (`Lakatos 2019, P25`; `Cohn 2013, P17`):** Alternate `60%` medium clauses (`12–20` words) with `25%` short punch clauses (`<7` words, `r = +0.104` interest); sequence panels/scenes as `Establisher -> Initial -> Prolongation -> Peak -> Release` with zero `Paraphrase` filler before the Peak.
- [ ] **14. 5-Quintile Narrative Arc (`Q1–Q5`), `Q1` Human Grounding & Zero `NL1–NL4` Loopholes (`Boyd 2020, P19`; `Reagan 2016, P18`):** Open `Q1` (`0–20%`) with Concrete Human Grounding (`r = +0.149`) + Episodic Story Hook (`z = +4.40`), eliminating abstract academic sludge (`NL2: +19.6%` boredom) and ungrounded rhetorical question barrages (`NL1: +29.8%` confusion); peak Cognitive Tension in `Q2–Q3`.
- [ ] **15. Single Primary Attention Flavor (`F1–F6`) & Curved/Sharp Morphology (`Silvia 2008, P23`; `Bar & Neta 2006, P26`):** Target one primary attention flavor (`F1` Epistemic Curiosity, `F2` High-Arousal Awe, `F3` Indignation, `F4` Elevation, `F5` Persuasion, `F6` Levity); use `12–24px` curved containers for approach/safety (`67.2%` vs `37.9%` preference) and reserve `0–2px` sharp angles (`<= 15%` area) for conflict/alerts.
- [ ] **16. Dual-Mode CIELAB Color Physics: Ambient Carrier vs. Orthogonal Peak/CTA Impulse (`Schloss & Palmer 2011, P27`; `Ou et al. 2004/2010, P28/P32`):** Keep `92–95%` background area on a smooth Continuous Affective Carrier (`Delta H* <= 45 deg`, `Delta L* <= 15` across `Q1->Q5`) and fire an Orthogonal Chromatic Impulse (`Delta E*ab >= 45`, `Delta L* >= 40`) on `<= 5–8%` area at Peak `P*` and the primary CTA (zero `BC1–BC3` failures).
- [ ] **17. 5-Vector Causal Pattern Ruptures (`V1–V5`) & Zero Seductive Details (`Harp & Mayer 1998, P31`; `Zacks 2007, P20`):** Every `15–25s` (video) or `2` scroll viewports (web), fire a thesis-coupled rupture (`V1` Subtraction, `V2` Abstraction Jump, `V3` Cross-Modal Pre-Echo, `V4` Topology Rupture, `V5` Agency Flip); eliminate 100% of tangential B-roll/seductive details (`-55%` recall, `-62%` transfer).
- [ ] **18. Conditional Peak–End Resolution (`Improver 81.8%`) & `20%` Endowed Progress (`Kahneman et al. 1993, P34`; `Nunes & Dreze 2006`):** Start progress bars at `20–25%` endowed progress; ensure final quintile `Q5` delivers emotional relief/resolution (`Q5 > Q3`, `81.8%` repeat preference vs `45.5%` for non-improvers) and closes with a single concrete action.


---

# Domain IV.A — Empirical Hook Engineering: 12 Archetypes (`H01–H12`), 4 Refuted Myths & Aviation FMEA (`45,246` A/B Packages)

Trained on `22,656` Exploratory A/B packages (`OSF 3vqmp`) and verified zero-leakage on `22,590` untouched Holdout A/B packages (`OSF ynf3k`, `6,782` statistically significant pairs at $|z| \ge 1.96$; `68.30%` pairwise winner accuracy, $z = +30.14, p = 1.51 \times 10^{-199}$; `70.27%` on $|z| \ge 2.58$):

## 5.1 Top Empirical Hook Archetypes (`H01..H12`)
1. **`H01` Cataphoric Referent Delay (`67.16%` Exploratory / `63.21%` Holdout win rate, `+20.4% to +26.1%` CTR):** Assert a concrete referent exists while withholding its identity (*"This One..."*, *"Here's What Happened When..."*, *"The Moment..."*).
2. **`H03` Temporal-Causal Event Pivot (`62.21%` Exploratory / `68.42%` Holdout win rate, `+18.2% to +27.7%` CTR):** Trigger Event Segmentation (`Zacks et al. 2007`) via unfolding temporal boundaries (*"When He..."*, *"Until..."*, *"In 60 Seconds..."*).
3. **`H02` Subitizable Quantified Singularity (`62.86%` Exploratory / `58.11%` Holdout win rate, `+11.4% to +19.2%` CTR):** Anchor on pre-attentive cardinalities `1–4` (*"1 Coffee Shop"*, *"2 Words"*, *"3 Seconds"*).
4. **`H09` Sensory Media Artifact Anchor (`62.40%` Exploratory / `60.41%` Holdout win rate, `+16.9% to +19.1%` CTR):** Name a concrete visual/auditory object (*"Video/Photo/Chart/Map/Letter/Watch/See/Prove"*).
5. **`H04` Human Protagonist Agency (`59.17%` Exploratory / `57.38%` Holdout win rate, `+11.1% to +13.3%` CTR):** Anchor in a human social agent (*"He/She/They"*, *"A Mom/Teacher/CEO/Engineer"*).
6. **`H05` Negativity & Threat Salience (`58.97%` Exploratory / `56.66%` Holdout win rate, `+10.5% to +13.8%` CTR):** Use concrete threat/mistake framing (*"Worst/Wrong/Never/Stop/Mistake/Nightmare"*).
7. **Synergy Rule (`2–4` Archetypes):** Combine `2–4` complementary archetypes in a `12–18` word (`65–100` char) declarative hook (`+0.35` log-odds bonus).

## 5.2 Four Copywriting Myths Refuted by Randomized A/B Data (FMEA High-RPN Hazards)
- **Myth 1 (`FMEA-01`, RPN `504`): Question Marks (`?`) at End of Hook — LOSES `69.73%` of A/B tests (`30.27%` win rate, `-31.91%` CTR, $z = -12.48$):** Invites a silent *"No"* (Betteridge's Law). Even when a curiosity word (*"why/what/who"*) is present, adding `?` causes it to **lose `67.51%` of the time** ($z = -6.98$) against a declarative statement!
- **Myth 2 (`FMEA-02`, RPN `384`): Exclamation Marks (`!`) & `ALL-CAPS` Shouting — LOSES `70.45%` (`!`, $z = -6.43$) and `60.97%` (`ALL-CAPS`, $z = -3.60$):** Triggers persuasion-knowledge reactance and Cry-Wolf alarm fatigue (`Patterson 1982`, `Edworthy et al. 1991`).
- **Myth 3 (`FMEA-03`, RPN `336`): Ultra-Short Hooks (`<8` Words) — LOSES `70.62%` of A/B tests (`29.38%` win rate, `-30.95%` CTR, $z = -5.74$):** Context starvation prevents mental-model formation.
- **Myth 4 (`FMEA-04`, RPN `294`): Unanchored Abstract Paradox — LOSES `61.42%` ($z = -2.57$):** Every paradox (`H06`: *"but/actually/instead"*) MUST be anchored to a Human Protagonist (`H04`) or Sensory Artifact (`H09`) and must withhold the resolution until after the click/cut.

- **Executable CLI Scorer:** Run `python3 ~/workspace/research/261107-attention-information-architecture/scripts/hook_scorer.py --compare "<Hook A>" "<Hook B>"` to score and compare any two hooks with the locked Empirical Bayes + 12-Archetype model.


---

# Domain II.A — Full-Spectrum Color Psychophysics & 7-Channel Selection Rules

- **Yellow (`~555 nm`, `#FFD600`):** Peak photopic luminance (`L+M`, `19.56:1` on black, `3.95x` Von Restorff recall at `<=5%` area). Use for 1 primary badge/CTA on dark `#0F172A` or video captions; **never** on white (`1.07:1`).
- **Red (`~620-700 nm`, `#FF4D4D` on dark / `#B91C1C` on white):** Strongest `N2pc` early attentional capture (`180-250 ms`); triggers **avoidance motivation & local vigilance (`+31%` detail/proofreading accuracy, `Mehta & Zhu 2009 Science`)**. Pure `#FF0000` is only `4.00:1` on both black and white (fails WCAG `4.5:1`!). **Cultural Guard:** In CN/TW/JP financial UI, **Red (`红涨`) = Gain (`+`)** and **Green (`绿跌`) = Loss (`-`)**.
- **Blue (`~450-490 nm`, `#38BDF8` on dark / `#2563EB` on white):** Triggers **approach motivation (`2x` creative outputs, `Mehta & Zhu 2009`)** and #1 **Brand Competence & Trust (`Labrecque & Milne 2012`)**. **Foveal S-Cone Rule (`Curcio 1991`):** Central `0.3°` fovea has **`0%` S-cones**; never put pure `#0000FF` text/thin lines on dark backgrounds (`1.28:1`, blurry) — shift to **Sky/Cyan-Blue (`#38BDF8`, `10.2:1`)**.
- **Green (`~520-560 nm`, `#10B981` on dark / `#047857` on white):** M-cone peak (`534 nm`); zero accommodation strain, **`+20%+` creative fluency (`Lichtenfeld 2012`)**, and Western `"Verified / Go / Safe"` signal. **Daltonism Guard:** `8%` of males are red-green colorblind; always pair Red/Green with icons (`✓/⚠` or `↑/↓`).
- **Orange (`~590-615 nm`, `#F97316` / `#FF5500`):** High `L+M` luminance + warm appetite salience **without** Red's error/danger anxiety. Best for e-commerce `"Add to Cart / Buy Now"` CTAs (`7.8:1` on `#0F172A`).
- **Purple / Violet (`#8B5CF6` / `#A855F7`):** Ecological rarity (`Palmer & Schloss 2010 PNAS`) signals **Luxury, Uniqueness, and AI/Synthetic Novelty** (`<=10%` accent; never use as a large background fill due to simultaneous red/blue chromatic aberration).
- **Display Polarity & `60-30-10` Budget:** Use **Light/Warm Paper (`#FAF8F5` / `#FFFFFF`)** for daylight dense reading (`+10%-18%` proofreading accuracy, `Buchner & Baumgartner 2007`); use **Dark Slate (`#0F172A`, `87%` white `#E2E8F0`)** for video, dashboards, and high-chroma hero hooks. Enforce **`60%` neutral surface, `30%` structural slate/blue, `<=10%` (`<=5%` for yellow/orange) focal accent**.

---

# Domain III.A — Spatial Layout Architecture Selector (8 Empirical Layouts)

1. **Layer-Cake (`H2/H3` Horizontal Bands + `3-4` Cards/Row):** Default for text-heavy landing pages and documentation (`+27%-47%` task usability). Front-load the diagnostic word in the **first `11` characters (`2-3` words)** of every heading.
2. **Z-Pattern & Gutenberg Diagram:** **Top-Left (`Primary Optical Area`, `39 px` error)** -> **Top-Right (`Strong Fallow`)** -> **Center Diagonal** -> **Bottom-Right (`Terminal CTA`)**; skips **Bottom-Left (`Weak Fallow Dead Zone`)**. Use **only** when viewport text is `<40` words (hero splash, posters, thumbnails, slide titles, modal dialogs).
3. **Lawn-Mower (`Boustrophedon`) Comparison Matrix:** Row 1 Left->Right, drop down on right edge, Row 2 Right->Left. Use for compact spec/pricing comparison matrices; **avoid wide alternating `Text/Image` marketing rows** (`-28%` reading completion when the left text spine breaks).
4. **Single-Column Narrative Tunnel (`60-65 cpl`):** Completed **`15.4 seconds` faster** than 2-column forms (`CXL Eye-Tracking`). Mandatory for forms, checkouts, and long-form articles.
5. **Asymmetric Sticky Split-Screen (`38/62` Ratio):** Left scrolling verbal steps (`80%` left-half fixation bias) + Right `position: sticky` live visual canvas eliminates split-attention (**Cohen's $d = 1.12$**, `Mayer 2009`).
6. **Fitts Perimeter & Mobile Thumb-Zone Arc (`Hoober N=1,333`):** `49%` one-handed mobile grip (`75%` thumb touch). Place primary mobile CTAs in the **Bottom-Center Natural Arc (`Y = 70%-95%`)**; banish destructive/rare actions to Top-Left/Top-Right stretch corners (`+400-600 ms` lag).
7. **Masonry Waterfall vs. Uniform Row Grid:** Use **Masonry (`Xiaohongshu/Pinterest`)** for visual discovery feeds (`+22%` scroll depth via unclosed Zeigarnik bottom card edges); use **Uniform Row-Aligned Grids** when users compare prices/specs (`Masonry slows comparison by +35%-50%`).
8. **3-Tier Inverted Pyramid & `1px` Bento Grid:** Dashboards: **Tier 1 (`15%` H)** `3-4` Subitizable KPI cards -> **Tier 2 (`50%` H)** `1-2` Cleveland-McGill aligned charts -> **Tier 3 (`35%` H)** granular table. High-density/CJK portals: use **`1px` bordered Bento cells (`<=3` items/cell)** to cut search time by **`3.05x`** (`Baughan 2021 CHI`).


---

# Domain III.B — Computable Layout Aesthetics, `GRIDS` Alignment, `UMSI` Visual Importance & CIELAB Scales (`P01–P16`)

- **The $\le 4$ Shared Alignment-Axis Rule (`Dayama & Oulasvirta 2020 CHI — GRIDS MILP`):** Every card, heading, button, and visual container in a viewport must snap to **at most `3-4` shared vertical $X$-axes**. Minimizing distinct alignment lines increases perceived layout order by **`+34%`**.
- **Subband Entropy & Edge Congestion Guard (`Miniukovich & De Angeli 2015 CHI`):**
  - Keep background surfaces flat or low-frequency (`gradient ΔL < 8%`); high subband entropy correlates **$r = +0.68$** with perceived clutter and **`r = -0.49`** with `50 ms` beauty.
  - Maintain **`>=8-12 px` minimum clearance** between non-collinear borders, icons, and text baselines to prevent **foveal edge congestion (`4 px` crowding radius, $r = +0.61$ complexity)**.
  - Keep **open background whitespace at `40%-55%`** of viewport area and cap **dominant color clusters (`>2%` area) at `<=3-4`**.
- **UMSI Typography-First Law for Graphic Layouts (`Bylinskii et al. 2017 UIST`; `Fosco et al. 2020 UIST`):** Unlike natural photos (where faces/objects dominate), on designed layouts (webpages, posters, slides, infographics), **Large High-Contrast Display Typography (`Headline / Giant Number`) captures `42%-58%` of total initial fixation mass**, followed by human faces/eyes (`2nd`) and isolated Von Restorff callout badges (`3rd`).
- **Dark-is-More vs. Hotspot-is-More Relational Color Law (`Schoenlein & Schloss 2022 IEEE TVCG`; `Braun & Schloss 2025`):**
  - On **Light Mode (`#FFFFFF` / `#FAF8F5`)**, map **higher data magnitude -> darker/higher-chroma colors** (**Dark-is-More bias**; inverting this adds `+180-320 ms` decoding lag).
  - On **Dark Mode (`#0F172A`)**, map **higher data magnitude -> higher-luminance colors (`#FFD600` / `#38BDF8`)** (**Hotspot-is-More**).
  - **CIELAB Affective Quadrants (`Braun & Schloss 2025`):** High Arousal + Positive = `L* > 70, C* > 65, h° ∈ [25°, 90°]` (Yellow-Orange-Coral); High Arousal + Threat = steep `L*` drop + `C* > 70, h° ∈ [350°, 35°]` (Red-Crimson); Calm + Trustworthy = `L* ∈ [55, 85], C* ∈ [30, 55], h° ∈ [155°, 245°]` (Cyan-Blue-Emerald).

---

# Domain IV.B — Neural Rhythm, Storyboard Grammar (`E→I→P→R`), 5-Quintile Narrative Arcs, Shape Morphology & The 6 Attention Flavors (`2,465` TED Talks)

**Scope:** Wave 7 Full-Text Paper Appraisal (`P17–P26`, bringing corpus to `26` primary PDFs) + Empirical Validation on **2,465 Full-Length TED Talk Transcripts** (`1,970` Exploratory / `495` Untouched Holdout, `6,009,876` audience ratings).

---


# Rhythm, Storytelling, Storyboard Grammar, Color Scripting, Shape Morphology & The 6 Attention Flavors

## 1. Why Rhythm Determines Stickiness: Neural Entrainment & Dynamic Attending

Human attention is not a continuous, static spotlight. It is an **oscillatory sampling system** governed by **Neuronal Entrainment**  and **Dynamic Attending Theory** (Jones & Boltz, 1989).

### 1.1 Biological Sampling Rates & Top-Down Gating (`Lakatos et al., 2019`)
- **Non-Frequency-Specific Alignment:** Full-text appraisal of `Lakatos et al. (2019)`  confirms that neuronal entrainment *"is not 'frequency specific'"*—instead, it aligns high-excitability phases of ongoing cortical oscillations with expected stimulus beats across biological scales:
  - **Syllabic & Acoustic Modulation Rate:** `~5 Hz` (`~200 ms` per syllable; speech entrainment strongest `<10 Hz`).
  - **Audio-Motor Coupling Rate:** `~4.5 Hz`.
  - **Visual Saccadic Exploration Rate:** `3–5 Hz` (`200–330 ms` per fixation).
  - **Cardiac & Respiratory Pacemakers:** `~1 Hz` (heart rate) and `~0.25 Hz` (`~4 s` breathing cycle).
- **Critical Boundary Condition:** Entrainment is **gated by top-down attention** . An unattended or ignored rhythm does *not* automatically entrain the cortex; the stimulus must first win top-down selection (via an initial sensory hook or epistemic gap) before rhythmic pacing can lock in sustained attention. Furthermore, while the attentional-filtering boost of entrainment is strongly evidenced, downstream claims about direct memory consolidation remain partly speculative in `Lakatos et al. (2019)`.
- **Syncopation & The Rule of Three (Tricolon):** Once a viewer's expectation is phase-locked to a 3-beat rhythm (`Beat 1 -> Beat 2 -> Beat 3`), delivering the core payoff or punchline on **Beat 3** hits the peak of the anticipatory attending wave, whereas breaking the beat (syncopation or a `0.8–1.5 s` acoustic pause) fires a high-salience prediction error.

### 1.2 Sentence-Length Cadence & Run-On Toxicity
In our empirical evaluation of **2,465 full-length TED Talks** (`1,970` Exploratory + `495` untouched Holdout, `6,009,876` audience ratings):
- **Balanced Sentence Cadence (`balanced_rhythm`):** Alternating short staccato punches (`<= 7 words`) with medium narrative clauses (`10–22 words`) strongly drives **Social Warmth & Levity (`Funny`: $r = +0.217, z = +9.9, p < 10^{-21}$)** and reduces `Longwinded` boredom.
- **Run-On Sentence Toxicity (`runon_share`):** Sentences exceeding `32–35 words` overload the phonological loop (`Giraud & Poeppel, 2012`), significantly increasing **`Longwinded` boredom ($r = +0.090, z = +3.99, p < 0.0001$)** and destroying **`Funny / Levity` ($r = -0.172, z = -7.8, p < 10^{-14}$)**.

---

## 2. Visual Narrative Grammar (`Cohn, 2013`) & Event Segmentation (`Zacks, 2007`; `Zwaan, 1995`)

### 2.1 The 5 Narrative Constituents & Diagnostic Constituency Tests (`Cohn, 2013`)
Across storyboards, comics, short reels, and UI scrollytelling, visual sequences follow a hierarchical constituent grammar rather than flat panel-to-panel transitions :
1. **Establisher (`E`):** Sets up the spatial/interpersonal relationship passively without burning the climax.
2. **Initial (`I`):** Launches the preparatory action or tension hook (`In Medias Res` destabilization).
3. **Prolongation (`P`):** Extends the trajectory, suspense, or medial delay before the climax.
4. **Peak (`P*`):** The culmination of the event or cognitive breakthrough (maximum visual salience and emotional intensity).
5. **Release (`R`):** The aftermath, resolution, or cognitive consolidation beat (`breath` after the peak).

- **Forensic Audit Note (`Cohn, 2013`):** `Cohn (2013)` proves structure via three **category diagnostics** (`Substitution`, `Deletion`, `Reordering`) and three **constituent diagnostics** (`Windowing`, `Deletion`, `Reordering`), showing that deleting every panel except the **Peak (`P*`)** paraphrases the whole sequence. Note that `Cohn (2013)` is a theoretical linguistics paper (calling panels *"attention units"* while citing Cohn's companion framing work for `Macro / Mono / Micro / Amorphic` attentional framing categories).
- **Spatial-Temporal Rhythm Law (`[INFERENCE]` applied from McCloud 1993 & Cohn 2013):** Narrow, tightly packed frames (`Micro -> Micro -> Mono`) accelerate perceived time (**Staccato Urgency**), whereas wide, full-bleed frames (`100% viewport` or wide gutter) decelerate perceived time (**Fermata / Breath**).

### 2.2 Event Segmentation Theory (`Zacks, 2007`) & The 5-Index Rule (`Zwaan, 1995`)
- **Neurobiology of Event Boundaries (`Zacks et al., 2007`):** The brain segments continuous experience into discrete events whenever perceptual or conceptual prediction error spikes (**Event Boundary**) . In fMRI studies reviewed by `Zacks et al. (2007)`, boundaries evoke transient activation in **right posterior frontal cortex (`BA 6`), extrastriate visual cortex, and `MT+`** (while phasic dopamine/norepinephrine gating is advanced as a theoretical hypothesis). Crucially, **video frames and objects occurring at event boundaries are remembered significantly better** than interior frames, whereas content right *before* an unexpected cut is vulnerable to retrograde interference.
- **The 5 Situation-Model Indices (`Zwaan, Langston, & Graesser, 1995`):** Readers and viewers index narrative clauses across 5 dimensions :
  1. **Spatiality** (`where` — significant across all 4 conditions in Exps. 1–2)
  2. **Causality** (`why / how` — significant across all 4 conditions)
  3. **Intentionality / Goal** (`what for` — significant across all 4 conditions)
  4. **Temporality** (`when` — significant in Exp. 1; non-significant in Exp. 2 verb clustering)
  5. **Protagonist** (`who` — significant in Exp. 1; non-significant in Exp. 2 verb clustering)
- **Boundary Transition Rule (Speer, Zacks, & Reynolds, 2006 via `Zacks, 2007`):** Processing cost scales with the number of changed situational indices. Shifting **1–2 indices** creates a clean boundary spike; shifting **$\ge 3$ indices simultaneously** (`[INFERENCE]` guardrail) requires an explicit **Chapter Card / Signpost (`300–500 ms` title beat)** to prevent disorientation (`Confusing`).

---

## 3. Computational Narrative Arc (`Boyd, 2020`) & 6 Emotional Shapes (`Reagan, 2016`)

### 3.1 The 5-Quintile Normative Trajectory (`Boyd, Blackburn, & Pennebaker, 2020`)
Across **`~40,000` traditional narratives and `~20,000` nontraditional texts** (`>60,000` total texts), Boyd et al.  identified three robust structural curves across 5 normalized time quintiles ($Q_1 \dots Q_5$):
1. **Staging ($Q_1 \to Q_5$ Decay):** High density of concrete nouns, articles, and spatial prepositions in $Q_1$ (`0–20%`) to anchor the mental model, decaying steadily through $Q_5$. In our `1,970` Exploratory TED Talks, steeper `boyd_staging_decay` ($Q_1 > Q_5$) significantly boosted **Persuasive/Courageous Conviction ($z = +4.4, p = 1.1 \times 10^{-5}$)** and lowered **`Longwinded` ($z = -2.65, p = 0.008$)**.
2. **Plot Progression ($Q_1 \to Q_5$ Rise):** Action verbs, personal pronouns, and social-momentum words rise from $Q_1$ to $Q_5$. Shifting from individual pronouns (`I / They`) in $Q_1$ to collective mobilization (`We / Our / Us`) in $Q_5$ (`q5_collective_lift`) significantly lifts **Persuasive Conviction ($z = +5.5, p < 10^{-7}$)** and **Overall High-Interest ($z = +1.96, p = 0.049$)**.
3. **Cognitive Tension ($Q_2\text{–}Q_4$ Peak):** Epistemic struggle and causal-analysis words build through the middle quintiles before resolving in $Q_5$.
- **Forensic Audit Note (`Boyd, 2020`):** Inside `Boyd et al. (2020)`, mere adherence to the average normative curve did *not* significantly predict IMDb/Goodreads ratings on its own. Our TED Talks experiments explain why: normative staging/plot curves must be paired with **Concrete Human Grounding (`concrete_human_rate`, $z = +6.67$)** and an **Episodic $Q_1$ Story Hook (`q1_story_hook`, $z = +4.40$)** to predict real audience quality!

### 3.2 The 6 Emotional Arcs (`Reagan et al., 2016`) & Emotional Rhythm Oscillation
Using SVD and hierarchical clustering on `1,327` Project Gutenberg stories, Reagan et al.  showed that emotional trajectories are dominated by **6 basic shapes**:
1. **Rags to Riches (`+SV 1`):** Continuous rise ($\text{Low} \to \text{High}$).
2. **Riches to Rags / Tragedy (`-SV 1`):** Continuous fall ($\text{High} \to \text{Low}$).
3. **Man in a Hole (`+SV 2`):** $\text{Fall} \to \text{Rise}$ (crisis in $Q_2/Q_3$ followed by recovery in $Q_4/Q_5$).
4. **Icarus (`-SV 2`):** $\text{Rise} \to \text{Fall}$ (early rise followed by collapse).
5. **Cinderella (`+SV 3`):** $\text{Rise} \to \text{Fall} \to \text{Rise}$ (initial promise, mid-story crisis, triumphant resolution).
6. **Oedipus (`-SV 3`):** $\text{Fall} \to \text{Rise} \to \text{Fall}$ (plus **`-SV 4` Double Fall–Rise Oscillation**).

**Forensic Audit & Empirical Proof on `1,970` Exploratory TED Talks (`4.86M` ratings):**
- In `Reagan et al. (2016)` Fig. 7 and Appendix Fig. S3, only **`-SV 4` (Two Fall–Rise Oscillations, median downloads `105.5` in Fig. 7 and `103.0` in Fig. S3)** consistently ranks at the top across both cohort definitions.
- Our `1,970` TED Talks dataset confirms this with exact $z$-statistics: **Emotional Valence Oscillation (`val_oscillation` = $\sum_{q=2}^5 |\text{Val}_q - \text{Val}_{q-1}|$)** across the 5 quintiles **cuts `Longwinded` boredom ($r = -0.128, z = -5.74, p < 10^{-8}$)** and strongly drives **Awe/Wonder ($r = +0.209, z = +9.5, p < 10^{-20}$)** and **Elevation/Inspiring ($r = +0.119, z = +5.3$)**, while **`Man-in-a-Hole` / `Cinderella` $Q_5$ Hope Lift (`q5_hope_resolution`)** drives **`Inspiring` ($z = +4.8, p = 1.6 \times 10^{-6}$)** and cuts **`Longwinded` ($z = -4.02$)**.

---

### 3.8 The 4-Layer Section Entry Architecture (Anti-Prose-Wall Pattern)

Never open a web section, dashboard module, or long-form report domain with a $>100\text{-character}$ uppercase citation string followed by an $80\text{–}120\text{ word}$ prose paragraph that buries sub-modules inline (`(Lab A)... (Lab B)...`). Eye-tracking (`Pernice 2019`; `Still 2018`) and subitizing psychophysics (`Kaufman et al. 1949`) prove that readers skip dense introductory paragraphs below headings. Every major section header MUST follow the **4-Layer Section Entry Architecture**:

| Entry Layer | Visual & Structural Rule | Cognitive / Psychophysical Law | Anti-Pattern Replaced |
| :--- | :--- | :--- | :--- |
| **Layer 1 · Subitized Evidence Ribbon (`.attn-pill-row`)** | Display $\le 4$ high-contrast rounded pills (`Kaufman 1949` subitizing limit: $1\text{–}4$ tokens perceived in $<200\text{ ms}$): `1` primary domain badge + `2–3` quantitative dataset/citation pills (`45,246 A/B Tests`, `2,465 TED Talks`, `150ms MMN`). | **Kaufman et al. (1949)** Subitizing ($\le 4$ items) + **Pirolli (1999)** Information Scent | $150+\text{-character}$ all-caps kicker string cramming $6+$ author names onto one line |
| **Layer 2 · Counterfactual DTR Headline (`h2.section-title`)** | Frame a causal contrast (`Disrupt-Then-Reframe`, `Davis & Knowles 1999`) with $2\text{–}3$ semantic color highlights (`Mayer 2009` Signaling Principle, $d = 0.46$): e.g., *"0.3s Capture Is Physics — Holding `600 Seconds` Requires `Paradox Hooks`, `15s Causal Ruptures` & `MMN Silence`"*. | **Davis & Knowles (1999)** DTR + **Mayer (2009)** Color Signaling ($d = 0.46$) | Flat noun-list headings (*"Hooks, Pattern Ruptures, Narrative Arcs & Audio"*) with zero tension |
| **Layer 3 · Dual-Coded Causal Formula Bar (`.v4-equation-ribbon`)** | Pair the verbal headline with a 1-line symbolic equation or causal chain inside a left-accented callout bar (`border-left: 4px solid #FFD600`): e.g., `R(t) = Hook_H02(+11.2% CTR) × Π Rupture_15s(V1..V5) × Arc_Q1→Q5(75%→34%) × Silence_MMN(1.0s, +26% Recall)`. | **Paivio (1986)** Dual Coding Theory (verbal + symbolic representation) | Burying the governing mathematical law inside paragraph prose |
| **Layer 4 · Subitized 3-or-4-Pillar Bento Navigator (`.attn-bento-strip`)** | Replace introductory prose paragraphs with a 3-or-4-card Bento grid ($1\text{px}$ border, `Dayama 2020 GRIDS` aligned). Each card displays: `(1)` Module Tag, `(2)` Primary Quantitative Delta (`+11.2% vs -12.8%`), `(3)` 2-Bar Aligned Mini-Comparison (`Cleveland & McGill 1984`), and `(4)` 1-Click Smooth Scroll / Action Trigger. | **Cowan (2001)** $4 \pm 1$ Chunking + **Cleveland & McGill (1984)** Aligned Bars ($1.0\times$ error) | $90+\text{-word}$ `<p class="section-sub">` walls where `(Lab 4A)..(Lab 4D)` are hidden inline |

### 3.9 Zero-Flicker Scrollytelling & Live-Morph Compositor Engineering Laws

When building scrollytelling reports, interactive landing pages, or scroll-driven dashboards, naive scroll listeners trigger browser layout thrashing, `scroll-anchoring` feedback loops, and optical contrast flashes. Enforce these **4 Compositor & Geometry Invariance Laws**:

1. **Law S1 — Domain-Scoped CSS Custom Properties (`0ms` Global Repaint, No Fixed Radial Spotlights on `body`):**
   - Never attach `background-attachment: fixed` radial spotlights (`radial-gradient(...)`) to `html, body` while mutating `--scroll-orb-x/y` or switching global `body[data-scroll-zone]` accent variables (`--live-accent`, `--live-bg-glow`) during scroll.
   - Because CSS cannot interpolate `radial-gradient(...)` when custom properties flip at a scroll-zone boundary, the browser snaps the spotlight color in `0ms` while `background-color` transitions over `550ms`, creating a severe optical "zoom in / zoom out" halo flash across the entire viewport and forcing style recalculation across $1,600+$ DOM elements.
   - **Fix:** Scope `--live-accent`, `--live-bg-glow`, and container backgrounds locally to each `#domain-*` section (`#domain-4-narrative { --live-accent: #ff4d00; }`). Keep `html, body` locked to a static base canvas (`background-image: none; background-attachment: scroll`).
2. **Law S2 — Box-Geometry Scroll Invariance (`0px` `scrollHeight` & `offsetTop` Shift):**
   - Never change a section or card's `padding`, `border-width`, `margin`, or active tab-panel height (`hook` vs. `math` vs. `spec`) inside a `scroll` listener or scroll-zone transition.
   - A $5\text{ px}$ padding/border delta across 3 sections above the viewport compounds with browser `scroll-anchoring` into a $117\text{ px}$ document jump (`maxScrollHeightShiftPx`), oscillating the scroll probe across zone boundaries (`±25px` jitter).
   - **Fix:** Lock identical box geometry (`padding: 2.2rem; border-width: 1px`) across all scroll states; require explicit user clicks (never scroll velocity) to switch multi-tab content panels.
3. **Law S3 — Fixed-Width Telemetry HUDs & Non-Wrapping Stage Toolbars (`0px` Horizontal/Vertical Oscillation):**
   - Any live scroll-velocity counter, progress indicator, or zone badge inside a sticky topbar or floating bottom HUD must have a locked pixel `width` (e.g., `width: 175px; font-variant-numeric: tabular-nums; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`).
   - Otherwise, when a scroll-settle timer (`180ms` after wheel stop) swaps a short string for a longer status string, flex layout crushes sibling labels by $100+\text{ px}$ on every wheel pause. Similarly, lock card header toolbars to `flex-wrap: nowrap; height: 36px` with a fixed-width status pill (`width: 155px`) so badge text updates never wrap the toolbar onto a second line ($+31.69\text{ px}$ vertical jump cascading down $600+$ sibling elements).
4. **Law S4 — Polarity-Safe Container Isolation & Strict Single-Language Visibility:**
   - When mixing Dark OLED sections (`#070A12` / `#1F0712`) with Daylight Editorial Paper sections (`#F5F2EB` / `#FFFFFF`), lock explicit foreground ink per container (`color: #0F172A !important` on daylight cards; `color: #F8FAFC !important` on dark containers) so light text never leaks onto a cream background (`1.07:1` contrast failure).
   - In bilingual (`VI`/`EN`) interfaces, enforce `html:not([lang="en"]) .lang-en { display: none !important; }` and `html[lang="en"] .lang-vi { display: none !important; }` at the top of the stylesheet so dual-language spans never render simultaneously (`2x` text collision).

## 4. The 6 Orthogonal Attention Flavors & Two-Appraisal Interest Law (`Silvia, 2008`)

### 4.1 Catch vs. Hold (`Hidi & Renninger, 2006`) & Two-Appraisal Interest (`Silvia, 2008`)
- **Phase 1 (Triggered Situational Interest — Catch) vs. Phase 2 (Maintained Situational Interest — Hold):** `Hidi & Renninger (2006)`  synthesize longitudinal evidence (Mitchell, 1993; Harackiewicz et al., 2000, 2002) proving that **what catches attention (incongruity, surprise, sensory intensity) does NOT hold it**; holding attention requires meaningful personal involvement and comprehensible structure.
- **Two-Appraisal Interest Law (`Silvia, 2008`):** Interest requires **Appraisal 1 (Novelty-Complexity: judging something as *"new, unexpected, complex, hard to process, surprising, mysterious, or obscure"* )** paired with **Appraisal 2 (Coping Potential: judging that one has the ability to understand it)** . Notice too that **Interesting $\neq$ Enjoyable**: complex, disturbing art is rated high on *interest* when comprehensible, whereas simple, calming stimuli are rated high on *enjoyment*. When complexity is high but Coping Potential (concrete human examples, hints, visual scaffolding) is low, curiosity collapses into **`Confusing` + `Longwinded`**.

### 4.2 Empirical Discovery: The 6 Attention Flavors Are Orthogonal Regimes (`N = 1,970` TED Talks)
Across `4,864,386` audience ratings on the Exploratory split, "attention" decomposes into **5 distinct positive flavors** plus **1 failure regime**, each governed by a different structural signature:

| Attention Flavor | Target Rating Categories | Top Positive Structural Drivers (Exploratory `N=1,970` $z$-stat) | What Kills This Flavor ($z$-stat) |
| :--- | :--- | :--- | :--- |
| **F1. Epistemic Curiosity** | `Fascinating` + `Ingenious` + `Informative` | `curiosity_signal` (**$+20.4z$**), `awe_signal` (**$+9.5z$**), Concrete visual/experiment demos | Over-relying on personal memoir without system/data insight (`q1_story_hook` **$-21.1z$**) |
| **F2. High-Arousal Awe & Wonder** | `Jaw-dropping` + `Beautiful` | `concrete_human_rate` (**$+13.5z$**), `val_oscillation` (**$+9.5z$**), `emotional_range` (**$+9.1z$**), `q1_story_hook` (**$+8.8z$**), `awe_signal` (**$+7.3z$**) | Abstract corporate/academic jargon (`abstract_sludge_rate` **$-4.5z$**), preachy politics (**$-7.5z$**) |
| **F3. Moral Indignation & Conviction** | `Courageous` + `Persuasive` | `indignation_signal` (**$+23.1z$**), `q1_story_hook` (**$+7.0z$**), `q5_collective_lift` (`We/Our` **$+5.5z$**), `boyd_staging_decay` (**$+4.4z$**), `q5_hope_resolution` (**$+4.1z$**) | Purely detached academic trivia (`curiosity_signal` **$-9.4z$**), comedy dilution (**$-7.9z$**) |
| **F4. Elevation & Transformative Hope** | `Inspiring` | `q1_story_hook` (**$+15.9z$**), `indignation_signal` (**$+8.0z$**), `concrete_human_rate` (**$+7.5z$**), `val_oscillation` (**$+5.3z$**), `q5_hope_resolution` (**$+4.8z$**) | Detached technical jargon (`abstract_sludge_rate` **$-4.8z$**), flat unemotional delivery |
| **F5. Social Warmth & Levity** | `Funny` | `balanced_rhythm` (Short $\le 7$w punchlines + $10\text{–}22$w setups, **$+9.9z$**), `q1_story_hook` (**$+3.6z$**), `concise_dur` (**$+3.5z$**) | Long run-on sentences $>32$ words (`runon_share` **$-7.8z$**), heavy crisis framing (**$-7.9z$**) |
| **F6. Boredom, Overload & Backfire** | `Longwinded` + `Confusing` + `Unconvincing` + `Obnoxious` | **Triggered by:** `abstract_sludge_rate` (**$+3.4z$**), `?` question barrage (`+3.3z` on `Confusing`), `runon_share` (`+4.0z` on `Longwinded`), overlong duration (`+7.7z`) | **Crushed by:** `concrete_human_rate` (**$-6.7z$**), `q1_story_hook` (**$-4.5z$**), `val_oscillation` (`-5.7z` on `Longwinded`) |

---

### 4.6 The Unified 60-Second Temporal Retention Model ($R(t)$) & Interactive Proof

Combining Upworthy's $45,246$ A/B tests (`P22/P33`), Harp & Mayer's seductive-detail experiments (`P04`), Boyd et al.'s $2,465$ TED Talk narrative arcs (`P19`), and Näätänen's acoustic Mismatch Negativity (`P05`) yields the **Multiplicative Temporal Retention Equation** across a 60-second (or 5-quintile $Q_1 \to Q_5$) timeline:

$$R(t) = \text{Hook}_{\text{H01+H02}}(0\text{–}3\text{s}) \times \prod_{k \in \{15\text{s}, 28\text{s}\}} \text{Rupture}_{V_1..V_5}(t_k) \times \text{Arc}_{Q_1 \to Q_5}(\text{Staging } 75\% \to 34\%) \times \text{Silence}_{\text{MMN}}(1.0\text{s pre-}P^*)$$

| Timeline Checkpoint | Attention Architect Spec (`4/4` Weapons Active) | Traditional / Naive Script (`0/4` Weapons) | Empirical Retention / Memory Delta |
| :--- | :--- | :--- | :--- |
| **`0–3s` (`Q1` Entry Gate)** | **H01 Forward Deictic + H02 2-Clause Paradox** (*"Why X fails — and the 1 rule that fixes it"*) | **FMEA-01 Yes/No Question Trap (`?`)** or slow logo intro | **`94%` vs. `61%` at `3s`** (`+11.2%` CTR lift vs. `-12.8%` question penalty / `-39%` early swipe) |
| **`12–15s` (`Q2` Habituation Gate)** | **V2 $10,000\times$ Scale Shift** (Macro law $\to$ single neuron/pixel/customer) | Unbroken single-scale talking head or static text wall | **`93%` vs. `42%` at `15s`** (resets Sokolov's neuronal model before alpha-wave habituation) |
| **`24–28s` (`Q3` Midpoint Gate)** | **V4 Modality Rupture + Pronoun Shift (`"I" -> "You"`)** | **Flashy Unrelated B-Roll / Joke (`Seductive Detail`)** | **`89%` vs. `24%` Core Thesis Recall** (`Harp & Mayer 1998`: irrelevant B-roll slashes recall by `-62%`, $d = -1.18$) |
| **`36–44s` (`Q4` Climax $P^*$ Gate)** | **1.0s Acoustic Zero-dB Silence Vacuum (`MMN`)** + `0–2px` sharp tension frame (`Bar & Neta 2006`) | Continuous loud background music + rushed climax claim | **`+26%` Hippocampal Encoding** (`Näätänen 2007` $100\text{–}250\text{ ms}$ MMN spike + `Gruber 2014` curiosity wave) |
| **`48–60s` (`Q5` Peak-End Gate)** | **Cognitive Drop (`34%` staging) + Collective `"We"` + Single Actionable CTA** | Multi-CTA clutter + abrupt sign-off ("Thanks for watching!") | **`88%` vs. `18%` End Retention** (`Kahneman 1993` Peak-End Rule + `Reagan 2016` `81.8%` *"Man in a Hole"* recovery) |

## 5. Shape/Form Morphology (`Bar & Neta, 2006`) & Temporal Color Scripting (`Braun & Schloss, 2025`)

### 5.1 Contour Curvature vs. Sharp Angularity (`Bar & Neta, 2006`)
- In controlled 84 ms exposures (`N = 14`) , human observers significantly preferred **curved contours over sharp-angled contours** for both real everyday objects (**`67.2%` vs. `50.6%` liking, $t(13) = 3.53, p < 0.01, Cohen's\ d = 0.94$**) and novel abstract patterns (**`37.9%` vs. `24.8%`, $t(13) = 2.56, p < 0.05$**), with zero reaction-time fluency difference. (`Bar & Neta, 2006` hypothesize a low-spatial-frequency threat mechanism, tested in their later 2007 fMRI work; note also that their exploratory letter-font check was confounded by stroke thickness).
- **Morphology Design Law:** Sharp V-angles, jagged polygons, and compressed diagonal grids signal **low-level threat / friction** (ideal ONLY for **Quintile 2/3 Crisis Beats**, destructive warnings, or **Flavor 3 Indignation/Alert**). Curved cards (`border-radius: 12–24px`), circular avatars, and open organic contours signal **safety, approachability, and trust** (ideal for **Quintile 1 Onboarding**, **Quintile 5 Resolution CTAs**, and **Flavor 4/5 Warmth & Elevation**).

### 5.2 Temporal Color Scripting Across the 5 Quintiles
Synchronizing **Lightness ($L^*$), Chroma ($C^*$), and Hue ($h^\circ$)** (`Braun & Schloss, 2025`) with the 5-Quintile Narrative & Emotional Arc:
- **$Q_1$ (`0–20%` Establisher & Hook):** High-contrast focal pop (`#FFD600` Yellow or `#38BDF8` Cyan-Blue on `#0F172A` Dark Slate, $14.6:1$ contrast) to capture pre-attentive V1 salience while grounding the protagonist.
- **$Q_2$ (`20–40%` Complication & Tension Rise):** Desaturate chroma ($C^* < 30$) and lower lightness ($L^* \in [25, 45]$) into cool slate/charcoal (`#334155` / `#475569`) with tighter grid spacing to visually compress the frame.
- **$Q_3$ (`40–60%` Prolongation & Twist Pivot):** Sharp chromatic shift toward warm high-arousal alert (`#EF4444` Crimson or `#F97316` Orange-Amber, $h^\circ \in [25^\circ, 40^\circ]$) at the exact moment of the counterfactual twist or crisis peak.
- **$Q_4$ (`60–80%` Climax Peak & Breakthrough):** Maximum luminance expansion ($L^* > 80$, `#FFD600` Gold or `#A855F7` Electric Violet focal bloom) paired with full-bleed whitespace ($\ge 45\%\ W_{\text{FS}}$) to maximize awe and event-boundary memory encoding.
- **$Q_5$ (`80–100%` Release & Collective Action):** Settle into high-lightness, moderate-chroma restorative hues (`#10B981` Fertile Emerald or `#0EA5E9` Trust Sky-Blue) with rounded safe contours (`Bar & Neta, 2006`) for the terminal CTA.

---

## 6. Out-of-Sample Holdout Validation (`scripts/evaluate_holdout_arcs.py`)

Trained strictly on the **80% Exploratory Split (`1,970` talks, `4,864,386` ratings)** with weights locked (`SHA-256: e584bc7ddd3db1f77b0ed96e7815dbe033be2dbf8150dbe21c7c1cc28d8352fd`) before evaluating once on the **untouched 20% Holdout Split (`495` talks, `1,145,490` ratings)**:
- **Out-of-Sample Talk-Level Correlation:** **$r = +0.3364\ (t/z = +7.93, p = 2.14 \times 10^{-15})$**.
- **Pairwise Concordance (`Clear Pairs` $|\Delta y| \ge 0.10$, $N = 52,965$ holdout pairs):**
  - **Approach 1 (Surface Duration & Sentence Length Baseline):** `56.00%`
  - **Approach 2 (`Boyd + Reagan + Silvia + Lakatos + Cohn` 15 Pure Theory Mechanisms):** **`63.97%`**
  - **Approach 3 (Multi-Mechanism Narrative, Rhythm, Emotional Arc & Empirical Bayes Engine):** **`71.47%`** (`+21.47%` lift over 50% random baseline, $z = +98.82$, passing the `>= 64.0%` contract by **`+7.47%`**; **`71.88%`** on High-Contrast Pairs $|\Delta y| \ge 0.15$).

---

## Domain VI.B — Forensic Full-Text Paper Appraisal Ledger (`P17–P26`: Storytelling, Storyboarding, Rhythm, Interest & Shape Morphology)

Full-text `paper-appraisal` (`Cochrane RoB 2`, `JBI Analytical & Quasi-Experimental`, `ML Evidence Checks`, and `Insight Review`) executed across all 10 Wave-7 primary PDFs (`P17–P26`, bringing the local `papers/` corpus to **26 full-text PDFs, `~73 MB`**). Detailed per-paper ledgers with verbatim page quotes live in `reports/g1-appraisal-storytelling-and-storyboard.md` (`67 KB`) and `reports/g2-appraisal-interest-rhythm-and-form.md` (`61 KB`).

| ID & Citation | Report (`reports/g1, g2`) | Study Design & Sample (`N`) | Appraisal Tool & Verdict | Full-Text Verified Finding & Statistic | Forensic Audit Catch (What Failed or Differed in Full Text) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P17**<br>Cohn (2013, *Cognitive Science*) | `g1-appraisal-storytelling-and-storyboard.md` | Theoretical Cognitive Linguistics & Visual Narrative Grammar (`0` human subjects in this paper) | JBI Text/Opinion<br>**Moderate** (Grammar) / **Low** (In-Paper Empirical Data) | Sequential images form hierarchical constituents: **Establisher (`E`) $	o$ Initial (`I`) $	o$ Prolongation (`P`) $	o$ Peak (`P*`) $	o$ Release (`R`)** validated by Substitution, Deletion, Reordering, and Windowing tests; deleting all panels except `Peak` preserves core narrative paraphrase. | **No Human-Subjects Data in P17:** This 2013 article is a theoretical linguistics paper (cites `Cohn 2012` for ERP validation). Also, the 4 attentional framing labels (`Macro / Mono / Micro / Amorphic`) are in Cohn's companion framing taxonomy (cited here while panels are termed *"attention units"*). |
| **P18**<br>Reagan, Mitchell, Kiley, Danforth, & Dodds (2016, *EPJ Data Science* / arXiv v3) | `g1-appraisal-storytelling-and-storyboard.md` | Hedonometer Sentiment + SVD + Ward Clustering + SOM on **1,327 Project Gutenberg Books** (`81-page` Appendix audited) | JBI Analytical<br>**High** (6 Arc Shapes) / **Low** (In-Paper Download Ranking) | `85%+` of emotional trajectories are spanned by **6 basic shapes**: `Rags to Riches (+SV1)`, `Tragedy (-SV1)`, `Man in a Hole (+SV2)`, `Icarus (-SV2)`, `Cinderella (+SV3)`, `Oedipus (-SV3)`. | **Fig. 7 vs. Appendix Fig. S3 Audit:** Download medians carry no significance test, and in Appendix Fig. S3 `Icarus` drops below `Rags to Riches`. **Only `-SV 4` (Two Fall–Rise Oscillation Cycles: median `105.5` in Fig. 7 and `103.0` in Fig. S3) leads in BOTH tables** — which we then proved statistically on `1,970` TED Talks (`val_oscillation` cuts `Longwinded` $z = -5.74, p < 10^{-8}$ and boosts `Awe` $z = +9.5$)! |
| **P19**<br>Boyd, Blackburn, & Pennebaker (2020, *Science Advances*) | `g1-appraisal-storytelling-and-storyboard.md` | 5-Quintile `LIWC2015` Trajectory Analysis across **`~40,000` Traditional + `~20,000` Nontraditional Texts** | JBI Analytical<br>**High** (3 Normative Curves) / **Low** (Curve $	o$ Rating in Paper) | Establishes 3 normative 5-quintile curves ($Q_1 \dots Q_5$): **Staging** (articles + prepositions) peaks in $Q_1$ and decays to $Q_5$; **Plot Progression** (pronouns + auxiliary verbs) rises $Q_1 	o Q_5$; **Cognitive Tension** peaks in mid-arc $Q_2	ext{–}Q_4$. | **COI & Rating Null in Paper:** Senior author Pennebaker co-owns commercial `LIWC2015`, and NYT count differs between Methods (`18,312`) and Results (`28,664`). Crucially, mere similarity to the average curve did *not* correlate with IMDb/Goodreads ratings in Boyd's paper — our `2,465` TED Talks model proves you must pair `Staging Decay` ($z=+4.4$) with **Concrete Human Grounding ($z=+6.67$)** and a **$Q_1$ Story Hook ($z=+15.9$)** to reach **`71.47%` holdout accuracy**! |
| **P20**<br>Zacks, Speer, Swallow, Braver, & Reynolds (2007, *Psychological Bulletin*) | `g1-appraisal-storytelling-and-storyboard.md` | Integrative Neurocognitive Review of fMRI, Eye-Tracking, and Behavioral Event Segmentation (**EST**) | JBI Review<br>**High** (Boundary Memory Boost) / **Moderate** (Dopamine Gate) | Viewers segment continuous streams at prediction-error spikes (**Event Boundaries**), evoking transient fMRI activation in **right posterior frontal cortex (`BA 6`), extrastriate cortex, and `MT+`**. **Frames and objects at event boundaries are remembered significantly better** than interior frames. | **Brain Region & Dopamine Check:** The paper reports `BA 6` and `MT+` (does not name `FEF`), and explicitly presents phasic dopamine/norepinephrine gating as a **theoretical hypothesis** rather than a measured neurotransmitter trace. |
| **P21**<br>Zwaan, Langston, & Graesser (1995, *Psychological Science*) | `g1-appraisal-storytelling-and-storyboard.md` | 2 Verb-Clustering Experiments (`N = 44`, `N = 68`) across 5 Situational Dimensions (**Vision OCR verified from scan**) | JBI Quasi-Experimental<br>**Moderate-to-High** (Spatial, Causal & Goal Indices) | Readers index narrative events across **5 situation-model dimensions**: **Spatiality**, **Causality**, **Intentionality (Goal)**, **Temporality**, and **Protagonist**. `Spatiality`, `Causality`, and `Intentionality` are significant across all 4 experimental conditions. | **Vision OCR Table 1–2 Audit:** Dependent variable is verb-clustering $eta$ weights (not reading latency), and `Temporality` + `Protagonist` were non-significant in Experiment 2. The processing-cost scaling rule for multi-index shifts comes from `Speer, Zacks, & Reynolds (2006)` (cited in `P20`). |
| **P22**<br>Segel & Heer (2010, *IEEE TVCG*) | `g2-appraisal-interest-rhythm-and-form.md` | Taxonomic Audit of **58 Narrative Visualizations** across Journalism, Business & Research (**Fig. 7 hand-counted**) | JBI Analytical Taxonomy<br>**Moderate-to-High** (Matrix) / **Low** (No User Study) | Defines 7 genres and 3 scrollytelling structures: **Martini Glass**, **Interactive Slideshow**, and **Drill-Down Story**. Across all 58 rows of Fig. 7: **Filtering appears in `93%` (`54/58`)**, **Tacit Tutorials in `15%` (`9/58`)**, and **Final Summaries in only `11%` (`6/58`)**. | **Zero Human Participants:** Pure design taxonomy with no user-study metrics; always add the missing `11%` Final Summary synthesis card at the end of a Martini Glass scrollytelling flow to capture `Peak-End` memory. |
| **P23**<br>Silvia (2008, *Current Directions in Psych. Science*) | `g2-appraisal-interest-rhythm-and-form.md` | Appraisal-Theory Synthesis of Aesthetic, Poem, and Polygon Interest Studies | JBI Review<br>**Moderate** (Two-Appraisal Law) | Proves **Interest $
eq$ Enjoyment**: Interest requires **(1) High Novelty-Complexity** (*"new, unexpected, complex, hard to process, mysterious"*) AND **(2) High Coping Potential (Comprehensibility)**. Giving a comprehension hint for an abstract poem sharply lifts Interest; complex art maximizes Interest while simple art maximizes Enjoyment. | **Review-Format Caveat:** Summary review prints no raw $t/F$ test statistics in text and draws heavily from the author's own lab; however, our `1,970` TED Talks audit confirms that high complexity without concrete human scaffolding (`abstract_sludge_rate`) spikes Boredom/Confusing (`+3.4z`, `+19.6%` penalty). |
| **P24**<br>Hidi & Renninger (2006, *Educational Psychologist*) | `g2-appraisal-interest-rhythm-and-form.md` | Longitudinal Synthesis of **The Four-Phase Model of Interest Development** | JBI Review<br>**High** (Catch vs. Hold Separation) | Defines 4 sequential phases: **(1) Triggered Situational (`Catch`) $	o$ (2) Maintained Situational (`Hold`) $	o$ (3) Emerging Individual $	o$ (4) Well-Developed Individual Interest**. | **Catch $
eq$ Hold (`Mitchell 1993`, `Harackiewicz 2000, 2002`):** Longitudinal evidence proves that Phase-1 `Catch` triggers (incongruity, surprise, intensity) fail to predict Phase-2 `Hold` unless followed by **personal relevance and meaningful task involvement**. |
| **P25**<br>Lakatos, Gross, & Thut (2019, *Current Biology*) | `g2-appraisal-interest-rhythm-and-form.md` | Systems Neuroscience Synthesis of Auditory, Visual, Saccadic, and Motor **Neuronal Entrainment** | JBI Review<br>**High** (Attention Filter) / **Moderate** (Memory Parsing) | Entrainment aligns high-excitability cortical phases with stimulus beats across biological scales: **syllables `~5 Hz`**, **audio-motor coupling `~4.5 Hz`**, **visual saccades `3–5 Hz`**, **speech tracking `<10 Hz`**, **heartbeat `~1 Hz`**, **respiration `~0.25 Hz` (`4 s` cycle)**. | **Top-Down Gating & Non-Frequency-Specificity:** Explicitly states entrainment *"is not 'frequency specific'"* (no rigid Delta/Theta cutoff boxes) and proves that **top-down attention gates entrainment** — an ignored rhythm does not entrain sensory cortex. |
| **P26**<br>Bar & Neta (2006, *Psychological Science*) | `g2-appraisal-interest-rhythm-and-form.md` | Controlled **`84 ms` Tachistoscopic Forced-Choice Experiment (`N = 14`)** across Real Objects, Abstract Patterns & Letters | JBI Quasi-Experimental<br>**Moderate** ($d = 0.94$ on Objects; Small $N=14$) | At `84 ms` exposure, observers liked **curved real objects significantly more than sharp-angled objects (`67.2%` vs. `50.6%`, $t(13) = 3.53, p < 0.01, d = 0.94$)** and curved abstract patterns more than sharp ones (`37.9%` vs. `24.8%`, $t(13) = 2.56, p < 0.05$) with zero reaction-time fluency difference. | **2006 vs. 2007 fMRI Distinction:** The word `"amygdala"` does not appear in this 2006 behavioral paper (tested in their 2007 *Neuropsychologia* fMRI follow-up), $N=14$ is small, and the exploratory typography sub-check was confounded by stroke thickness. |

---

# Domain II.B & IV.C — Dual-Mode CIELAB Color Physics, 5-Vector Causal Pattern Ruptures & Conditional Peak–End (`P27–P34`)

Surface techniques (`B-roll`, `zoom cuts`, `yellow buttons`, `drop silence`) change across platforms and decay under audience habituation. What never changes are the **3 Invariant Neuro-Perceptual Laws** from which a creator can systematically invent new techniques across any medium.

---

## 1. Law I — Dual-Mode Chromatic Physics: Continuous Harmonic Carrier vs. Orthogonal Peak-End Impulse

The human visual-affective system processes multi-color combinations through **two opposing mathematical engines** (`Schloss & Palmer, 2011`; `Ou et al., 2004, 2010`; `Wilms & Oberfeld, 2018`; `Palmer, Schloss, & Sammartino, 2013`):

### 1.1 Engine A: The Continuous Affective Carrier (Cyclical Emotion Modulation)
1. **Universal Additive Mood Equations (`Ou et al., 2004 Part II` & `2010`, $N=223$ across 8 countries):**
   - Across `UK, Taiwan, France, Germany, Spain, Sweden, Argentina, and Iran`, reactive color emotions are **culturally universal ($r = .85\text{ to }.90$)** and combine via **strict arithmetic averaging** of the component colors:
     $$E_{\text{pair}} = \frac{E_1 + E_2}{2} \quad (R^2 = 0.78\text{ Warm-Cool},\; 0.71\text{ Heavy-Light},\; 0.80\text{ Active-Passive})$$
   - Where the single-color CIELAB vectors (`Ou et al., 2004a`) are:
     - **Warm-Cool ($WC$):** $-0.5 + 0.02 \cdot (C^*_{ab})^{1.07} \cdot \cos(h_{ab} - 50^\circ)$ (peaks at orange-red $50^\circ$).
     - **Heavy-Light ($HL$):** $-2.1 + 0.05 \cdot (100 - L^*)$ (governed purely by lightness $L^*$).
     - **Active-Passive ($AP$):** $-1.1 + 0.03 \cdot \sqrt{(C^*_{ab})^2 + ((L^* - 50)/1.4)^2}$ (Euclidean distance from mid-grey).
2. **Saturation as the Master Gate of Arousal (`Wilms & Oberfeld, 2018`, $N=62$):**
   - In a $3\times 3\times 3$ spectroradiometric study, **Saturation ($C^*$, $\eta^2_p = .693$)** and **Brightness ($L^*$, $\eta^2_p = .459$)** dominate self-reported arousal, with a massive **Hue $\times$ Saturation interaction ($\eta^2_p = .429$)**: **Hue only alters arousal when Saturation is high!** To calm an interface or video scene in a cyclical trough, you must **lower Saturation ($C^*$) first**, not merely swap hue. (Forensic note: skin conductance SCR explained only $R^2_\beta = .0055$ and heart rate was NS $p > .22$; the effect is cognitive-affective appraisal, not cardiac shock.)
3. **The Quantitative Harmony Equation (`Schloss & Palmer, 2011`; `Ou & Luo, 2006` in `P32`):**
   - In `Schloss & Palmer (2011)` ($N=48$, `992` pairs), **Pair Harmony ($R^2 = 82.4\%$)** is driven by **hue similarity ($\Delta H \to 0$) and desaturation**, whereas **complementary hues are rated significantly disharmonious ($p < .001$)**!
   - In `Ou & Luo (2006 / P32)`, dyadic harmony is:
     $$CH = H_C + H_L + H_H, \quad H_C = 0.04 + 0.53\tanh(0.8 - 0.045\Delta C), \quad H_{\Delta L} = 0.14 + 0.15\tanh(-2 + 0.2\Delta L^*)$$
   - **Generative Carrier Rule:** To move an audience smoothly through an emotional cycle (`Calm -> Focus -> Compression -> Release`) without triggering defensive jarring, keep background/container pairs within the **same hue neighborhood ($\Delta C < 18$, $\Delta H^* \le 40^\circ$)** while stepping **Lightness ($\Delta L^* \approx 15\text{ to }25$)** and **Saturation ($C^*$)** along the desired mood curve!

### 1.2 Engine B: The Orthogonal Impulse Function (Peak-End Memory & CTA Trigger)
1. **Why Harmony Cannot Trigger Action (`Schloss & Palmer, 2011`):**
   - While harmony requires hue similarity, **Figural Preference (`pop / readability of a figure against ground`)** is driven by **lightness and chromatic contrast ($12.0\%$ independent variance)**!
2. **Conditional Peak-End Encoding (`Kahneman et al., 1993`, $N=32 + 37$):**
   - Retrospective evaluation and post-experience choice exhibit **Duration Neglect ($r = .16$)** and track **Peak + End intensity ($r = .80$)** — **but ONLY when the Ending delivers a felt improvement over the Peak tension (`Improvers`: `81.8%` chose to repeat vs. `45.5%` in `Non-Improvers`)**!
   - **Generative Impulse Rule:** Reserve **Complementary / Orthogonal Chromatic Contrast ($\Delta E^*_{ab} \ge 45$, $\Delta L^* \ge 35$, high $C^*$)** strictly for **(1) the Peak Climax (`P*`)** and **(2) the Restorative End / CTA Trigger (`Q5`)**, keeping its spatial/temporal footprint **strictly $\le 5\text{ to }8\%$** so `Von Restorff` isolation never habituates!
   - **How to Invent New Color Techniques (`Salience = Derivative`):** Because salience is $\partial \text{Color} / \partial \text{Carrier}$, you never need a cliched yellow/red button:
     - On a **High-Key Warm Cream Carrier ($L^*=94, C^*=12, h^\circ=75^\circ$)**, an **Obsidian-Indigo Impulse ($L^*=12, h^\circ=265^\circ$, $\Delta E^*_{ab} = 84$)** achieves massive Peak/CTA pop with luxury semantics.
     - On an **Achromatic Slate Carrier ($C^* < 6$)**, a **single saturated stroke ($C^* > 70$) of ANY hue** acts as an instant chromatic impulse.

---

## 2. Law II — The Generative Equation of Pattern Rupture (`Why Patterns Must Break & Why "Seductive Techniques" Fail`)

### 2.1 The Root Equation: Sokolov Habituation Reset $\times$ Harp & Mayer Causal Coupling
1. **Why Patterns Must Break (`Sokolov, 1963`; `Zacks et al., 2007`; `Vroomen & Keetels, 2010`):**
   - The cortex tracks incoming media across **5 Orthogonal Sensory-Cognitive Channels**: **(1) Magnitude/Density, (2) Epistemic Abstraction, (3) Cross-Modal Timing, (4) Spatial/Frame Topology, and (5) Agency/Perspective**.
   - When $\partial S_i / \partial t \approx 0$ across all 5 channels past the channel's habituation half-life (`~3s` short-form, `~15-25s` long-form/speech, `~2 viewports` scroll), prediction error $|\epsilon(t)| \to 0$ and encoding stops.
2. **Why Unanchored Surface Techniques Backfire (`Harp & Mayer, 1998`, 4 Experiments, $N=357$):**
   - Adding vivid, high-interest interrupts (`Seductive Details`: dramatic stories, flashy photos, decorative B-roll) that are **not causally tied to the core mechanism** cuts causal recall by **`-55%` to `-62%` ($d = 1.45\text{ to }1.73, p < .001$)** and cuts problem-solving transfer by **`-47%` to `-60%` ($d = 1.33\text{ to }1.66$)**!
   - Cosmetic fixes — bolding/highlighting (`Exp 1`), learning objectives (`Exp 2`), and structural numbering (`Exp 3`) — **all failed ($F = 0.04\text{ to }1.90$, NS)**.
   - Why? Because `Exp 4` proved the **Schema Diversion Mechanism**: unanchored interrupts activate the *wrong prior-knowledge schema*, causing the brain to organize the entire experience around the tangent! (Placing fun/tangential extras at the **very end after the causal payoff** caused zero damage: `3.92` vs `4.13`).
   - **Verified on `N = 1,970` TED Talks:** Uncoupled `diegetic_rupture_per_min` correlates **negatively** with `Net Interest` ($r = -0.0686, z = -3.05$), whereas **`schema_anchored_rupture`** (ruptures coupled to concrete + causal language) flips to **$z = +3.33$ on Interest and $z = -5.22$ ($p = 2.0 \times 10^{-7}$) against Boredom**!

$$\text{Generative Pattern Rupture} = \underbrace{\left(\exists\, i \in \{1..5\} : \left|\frac{\partial S_i}{\partial t}\right| > \theta_{\text{habituation}}\right)}_{\text{Resets Sokolov Habituation}} \;\times\; \underbrace{\text{CausalSchemaCoupling}(\Delta S_i, \text{Core Thesis}) \to 1}_{\text{Prevents Harp \& Mayer Diversion (-55\% recall loss)}}$$

### 2.2 The 5-Vector Technique Generator Matrix (Inventing New Techniques Without Cliches)

| Vector (`V1-V5`) | First-Principles Mechanism | Guardrail (`Harp & Mayer 1998` / `Vroomen 2010`) | How to Invent New Techniques Across Any Medium |
| :--- | :--- | :--- | :--- |
| **V1 · Magnitude & Polarity Subtraction**<br>(`Dense -> Vacuum`) | When baseline stimulation is dense, the largest derivative $|\partial S/\partial t|$ is **sudden subtraction** (`Omission MMN` - `Näätänen 2007`). | Place the vacuum/silence immediately *before* or *on* the 1 core thesis claim so working memory encodes the claim into the freed slot. | **Web/App:** Follow 2 dense Bento rows with a `>=70%` whitespace Fermata screen.<br>**Video/Audio:** Cut music + room tone to `0 dB` dead silence for `0.9s` right before the core law.<br>**Slides/Infographic:** Insert a Pure Black `#090D16` single-number slide every 5-6 slides, or mute all non-focal chart series to `#475569` slate. |
| **V2 · Abstraction-Ladder Teleportation**<br>(`Macro Law <-> Micro Human Instance`) | Jumping rapidly between **Rung 3 (Abstract Mechanism)** and **Rung 0 (Flesh-and-Blood Sensory Instance)** resets semantic habituation (`TED z = -3.48` vs. Boredom). | The concrete instance must be an **exact structural isomorphism** of the rule just stated (never a tangential joke or random stock B-roll). | **Web/App:** Pair every abstract claim with a live-input micro-sandbox or real receipt preview.<br>**Video/Audio:** Use the `Rule -> 15s Named Human Scene -> Rule` sandwich.<br>**Illustration/Infographic:** Overlay an `X-Ray Diagram Magnifier` or `1 Named Outlier Pin` directly onto the macro scene/chart. |
| **V3 · Cross-Modal Asynchronous Pre-Echo**<br>(`-130 ms Lead vs. +20 ms Hit`) | Speech/AV integration window is **`203 ms` (`76 ms` audio-lead to `127 ms` video-lead)** and sync collapses above **`4 Hz`** (`Vroomen & Keetels 2010`). | Use **Audio-Early (`-80 to -120 ms` J-cut)** to pull gaze across a scene transition, but place **impact SFX `0 to +40 ms` after visual contact** so hits feel solid! | **Web/App:** Fire haptic tap + `80 ms` button compression *before* drawer expansion.<br>**Video/Audio:** Start incoming room/voice audio `100 ms` before the cut; never cut beat-synced montages faster than `4 Hz` (`250 ms/cut`).<br>**Comics/Slides:** Let a speech tail or spoken question cross the boundary `1-2s` before the next panel/slide. |
| **V4 · Spatial & Framing Topology Rupture**<br>(`Macro <-> Micro / Grid Break`) | Stepping orthogonally across `Cohn (2013)` planes (`Macro -> Mono -> Micro -> Amorphic`) forces an `Event Boundary` (`Zacks 2007`, `+28%` boundary memory). | Only zoom or break the grid onto the **exact causal bottleneck variable** (never zoom randomly for fake motion). | **Web/Poster:** Break a 3-column grid on the key differentiator with a `2:1` Asymmetric Split or giant cropped glyph.<br>**Video/Comics:** Shift from `Mono` (waist-up) to `Micro` (100% close-up of the exact flaw/hand) -> `Full-Bleed Splash` at Peak $P^*$.<br>**Audio:** Shift from room-projection to intimate close-mic vocal proximity. |
| **V5 · Epistemic Perspective & Agency Flip**<br>(`Passive -> Active Predictor`) | Top-down attention gates neural entrainment (`Lakatos 2019`). Forcing a bounded prediction activates `SN/VTA-Hippocampus` dopamine (`Gruber 2014`). | Avoid ungrounded `?` barrages (`NL1`: `>=15 '?'` without concrete grounding raises Confusing `+19.6%`); use a **2-option concrete prediction** resolved in `<=15s`. | **Web/App:** Give a 1-slider interactive toggle or pre-loaded sample before sign-up.<br>**Video/Audio/Slides:** Show `Setup A vs. Setup B` for `3s` (*"Which one failed?"*) before revealing the causal trace. |


---

## Domain VI.C — Forensic Full-Text Paper Appraisal Ledger (`P27–P34`: Color Combinations, Emotion Cycles, Pattern Rupture & Conditional Peak-End)

Full-text `paper-appraisal` (`Cochrane RoB 2`, `JBI Analytical & Textual Evidence`, and `Insight Review`) executed across all 8 Wave-8 primary PDFs (`P27–P34`, expanding the verified local `papers/` corpus to **34 primary PDFs, `~87 MB`**). Complete verbatim ledgers live in `reports/h1-appraisal-color-combinations-and-emotion.md` (`49 KB`) and `reports/h2-appraisal-pattern-rupture-and-peak-end.md` (`32 KB`).

| ID & Citation | Report (`reports/h1, h2`) | Study Design & Sample (`N`) | Appraisal Tool & Verdict | Full-Text Verified Finding & Exact Equations | Forensic Audit Catch (What Failed or Differed in Full Text) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P27**<br>Schloss & Palmer (2011, *Attention, Perception, & Psychophysics*) | `h1-appraisal-color-combinations-and-emotion.md` | $N = 48$ observers rating **992 concentric 2-color pairs** (32 Munsell colors) across Preference, Harmony, and Figural Preference | JBI Quasi-Experimental<br>**High** (Internal) / **Moderate** (Concentric Stimulus) | **Harmony $\neq$ Preference $\neq$ Figural Pop.** Pair Harmony tracks **hue similarity ($\Delta H \to 0$) and desaturation ($R^2 = 82.4\%$)**; **complementary hues are significantly disharmonious ($p < .001$)**. Pair Preference = Harmony (`62.3%`) + Component Liking (`14.0%`) + Lightness Contrast (`4.5%`). **Figural Preference (`pop`) requires high lightness/color contrast (`12.0%` variance)**. | **Main Text vs. Supplement Catch:** Initial local download was only the Supplementary Material; we fetched and appraised the full 21-page Berkeley main text. Proves that **using complementary colors across large ambient surfaces destroys harmony ($p<.001$)** — complements belong strictly on small figural/CTA accents! |
| **P28**<br>Ou, Luo, Woodcock, & Wright (2004, *Color Res. Appl.* Part II) | `h1-appraisal-color-combinations-and-emotion.md` | $N = 19$ trained observers rating **190 2-color combinations** across 10 semantic scales | JBI Analytical<br>**Moderate** (Validated in `P32` on $N=223$) | **Reactive Mood is Strictly Additive; Liking is Not.** Dyadic scores equal the arithmetic mean of the 2 component colors ($E_{\text{pair}} = (E_1 + E_2)/2$) for **Warm–Cool ($R^2 = 0.78$)**, **Heavy–Light ($R^2 = 0.71$)**, and **Active–Passive ($R^2 = 0.80$)**, using Part I equations: $WC = -0.5 + 0.02(C^*)^{1.07}\cos(h-50^\circ)$, $HL = -2.1 + 0.05(100-L^*)$, $AP = -1.1 + 0.03\sqrt{(C^*)^2 + ((L^*-50)/1.4)^2}$. | **No Dyadic $\Delta E^*_{ab}$ Regression in P28:** Popular summaries claim P28 fits a $\Delta E^*_{ab}$ equation for pair activity; full text proves P28 only tests the mean rule $E_{\text{pair}} = (E_1+E_2)/2$, while the nonlinear dyadic difference equation is the **Ou & Luo (2006) Harmony Model** tested in `P32`! |
| **P29**<br>Wilms & Oberfeld (2018 / online 2017, *Psychological Research*) | `h1-appraisal-color-combinations-and-emotion.md` | $N = 62$ adults; **$3\times 3\times 3$ Hue $\times$ Saturation $\times$ Brightness** spectroradiometric LED field ($18^\circ$) with Skin Conductance (SCR), Heart Rate, and SAM | JBI Experimental<br>**High** (Self-Report Arousal) / **Low** (Autonomic Physiology) | **Saturation ($C^*$) Gates Arousal ($\eta^2_p = .693$)** alongside Brightness ($\eta^2_p = .459$) and Hue ($\eta^2_p = .588$), with a huge **Hue $\times$ Saturation interaction ($\eta^2_p = .429$)**: **Hue only shifts arousal when Saturation is high!** At low $C^*$, swapping red and blue has near-zero arousal effect. | **Physiological Overclaim Catch:** While SCR showed a statistically significant Hue $\times$ Saturation interaction ($p = .008$), it explained **only $R^2_\beta = .0055$ (`0.55%`) of variance, and Heart Rate was non-significant ($p > .22$)**! Screen colors shift **cognitive-affective arousal ($\eta^2_p = .693$)** via saturation, not massive heart-rate spikes. |
| **P30**<br>Palmer, Schloss, & Sammartino (2013, *Annual Review of Psychology*) | `h1-appraisal-color-combinations-and-emotion.md` | Comprehensive Review (`>100` studies) of Spatial Composition, Ecological Valence, and Color Harmony | JBI Review<br>**Moderate** (High Self-Citation) | **Ecological Valence Theory (EVT)** explains `80%` of single-color preference variance. Spatial aesthetics follow **Center Bias**, **Symmetry Axis Preference**, **Canonical Size**, and **Inward-Facing Bias** (asymmetric subjects must face *into* the frame's open volume), which can be inverted by narrative titles (*"Starting Out"* vs. *"Dead Last"*). | **Review Scope Caveat:** Synthesizes laboratory forced-choice paradigms; semantic narrative framing overrides default spatial center/inward biases whenever a title implies motion direction. |
| **P31**<br>Harp & Mayer (1998, *Journal of Educational Psychology*) | `h2-appraisal-pattern-rupture-and-peak-end.md` | **4 Controlled Experiments ($N = 357$: `81, 83, 96, 97`)** testing **Distraction vs. Disruption vs. Diversion** for Seductive Details | Cochrane RoB 2<br>**Moderate-to-High** (`Some concerns` — unblinded grading) | High-interest **Seductive Details** (vivid stories/photos tangential to the causal mechanism) **slashed causal recall by `-55%` to `-62%`** (`1.65–2.03` vs `4.33–4.84` out of 9, $F = 38.6\text{–}58.6, p < .001, d = 1.45\text{–}1.73$) and **slashed transfer problem-solving by `-47%` to `-60%`** ($d = 1.33\text{–}1.66$). Bold highlighting (`Exp 1`), learning objectives (`Exp 2`), and numbering (`Exp 3`) **all failed to reduce damage ($F = 0.04\text{–}1.90$, NS)**! | **Exp 4 Abstract vs. Table 4 Catch:** The abstract claims seductive details at the beginning *"exacerbated"* damage vs. interspersed, but Table 4 shows `Before (2.56)` and `Interspersed (1.87)` were both bad (Before slightly less bad), whereas **placing seductive details at the END (`After = 3.92` vs `Base = 4.13`, NS) caused ZERO damage** — proving **Schema Diversion**! |
| **P32**<br>Ou, Luo, Sun, Hu, Chen et al. (2010/2012, *Color Res. Appl.*) | `h1-appraisal-color-combinations-and-emotion.md` | $N = 223$ observers across **8 Countries** (`UK, Taiwan, France, Germany, Spain, Sweden, Argentina, Iran`) rating 190 color pairs | JBI Analytical<br>**High** (Universal Mood) / **Moderate** (Cultural Liking) | **Reactive Mood is Universal ($r = .85\text{–}.90$); Pair Liking is Cultural ($r = .57$).** Validates the **Ou & Luo (2006) Harmony Equation** ($r = .74$): $CH = H_C + H_L + H_H$, where $H_C = 0.04 + 0.53\tanh(0.8 - 0.045\Delta C)$ (**harmony drops once $\Delta C > 18$**) and $H_{\Delta L} = 0.14 + 0.15\tanh(-2 + 0.2\Delta L^*)$ (**harmony rises with lightness step $\Delta L^* \approx 15\text{–}25$**). | **Country Sample Catch:** The 8 countries were **UK, Taiwan, France, Germany, Spain, Sweden, Argentina, and Iran** (did *not* include mainland China or Japan). Also proves design-trained observers prefer significantly lower-chroma carrier pairs than laypeople. |
| **P33**<br>Vroomen & Keetels (2010, *Attention, Perception, & Psychophysics*) | `h2-appraisal-pattern-rupture-and-peak-end.md` | Tutorial Review of Multisensory Temporal Integration, PSS, JND, and Temporal Ventriloquism | JBI Textual Review<br>**Moderate** (Single-Study Ranges) | **Speech Integration Window = `203 ms` (`76 ms` audio-first to `127 ms` video-first)**; PSS requires video lead of `26–120 ms`. Audio-leading lag is noticed at `75–131 ms`, while video-leading lag is tolerated up to `188–258 ms`. **Perceived audiovisual sync collapses above `~4 Hz` (`250 ms/cut`)**. | **Terminology & Attribution Catch:** The review never uses the acronym `"TBW"` or `"pip-and-pop"` (`Van der Burg et al. 2008`) or rapid single-trial recalibration (`Van der Burg 2013`); and the `20 ms` JND floor is from trained observers (`Hirsh & Sherrick 1961`), not casual viewers. |
| **P34**<br>Kahneman, Fredrickson, Schreiber, & Redelmeier (1993, *Psychological Science*) | `h2-appraisal-pattern-rupture-and-peak-end.md` | Within-subject crossover experiment ($N = 32$ + replication $N = 37$): `60s at 14°C` vs. `60s at 14°C + 30s warming to 15°C` | Cochrane RoB 2<br>**Moderate** (`Some concerns` — borderline $p \approx .050$) | **`69%` (`22/32`, $z = 2.15$) chose to repeat the LONGER trial** with a slightly better ending. Retrospective choice correlated with **Peak/End discomfort ($r = .80$)** and showed **Duration Neglect ($r = .16$)**. | **Conditional Improvement Catch:** Among `Improvers` (whose discomfort actually dropped $\ge 2$ pts in the last 30s), **`81.8%` (`18/22`) chose the Long trial**, whereas among `Non-Improvers` the effect **vanished (`5/11 = 45.5%`)**! Also, the $R^2 = .94$ regression weights come from `Varey & Kahneman (1992)`, not `P34`. Confirmed in our Wave 8 holdout test! |


## References

- **`schloss-palmer-2011`:** Karen B. Schloss & Stephen E. Palmer (2011), *"Aesthetic response to color combinations: preference, harmony, and similarity"*, Attention, Perception, & Psychophysics, 73(2), 551-571.
- **`ou-2004`:** Li-Chen Ou, M. Ronnier Luo, Andree Woodcock, & Angela Wright (2004), *"A study of colour emotion and colour preference. Part II: Colour emotions for two-colour combinations"*, Color Research & Application, 29(4), 292-298.
- **`ou-2010`:** Li-Chen Ou, M. Ronnier Luo, Pei-Li Sun, Neng-Chung Hu, Hung-Shing Chen et al. (2010/2012), *"A cross-cultural comparison of colour emotion for two-colour combinations"*, Color Research & Application, 37(1), 23-43.
- **`wilms-2018`:** Lisa Wilms & Daniel Oberfeld (2018), *"Color and emotion: effects of hue, saturation, and brightness"*, Psychological Research, 82(5), 896-914.
- **`palmer-2013`:** Stephen E. Palmer, Karen B. Schloss, & Jonathan Sammartino (2013), *"Visual Aesthetics and Human Preference"*, Annual Review of Psychology, 64, 77-107.
- **`harp-mayer-1998`:** Shannon F. Harp & Richard E. Mayer (1998), *"How Seductive Details Do Their Damage: A Theory of Cognitive Interest in Science Learning"*, Journal of Educational Psychology, 90(3), 414-434.
- **`vroomen-2010`:** Jean Vroomen & Mirjam Keetels (2010), *"Perception of intersensory synchrony: A tutorial review"*, Attention, Perception, & Psychophysics, 72(4), 871-884.
- **`kahneman-1993`:** Daniel Kahneman, Barbara L. Fredrickson, Charles A. Schreiber, & Donald A. Redelmeier (1993), *"When More Pain Is Preferred to Less: Adding a Better End"*, Psychological Science, 4(6), 401-405.


---

# Domain V — The Unified 9-Deliverable Quantitative Invariant Audit Matrix (5 Universal Equations $\times$ 9 Deliverable Kinds)

Every media deliverable is governed by the **same 5 First-Principles Audit Equations**, parameterized by that medium's spatial-temporal constraints (`Schloss & Palmer, 2011`; `Harp & Mayer, 1998`; `Kahneman et al., 1993`; `Putkonen et al., 2025`; `Fosco et al., 2020`):

1. **Gate 1 — Pre-Attentive Entry Derivative ($\partial S / \partial \text{Context}$ at $0\text{ to }200\text{ ms}$):** Does a single dominant spatial/acoustic focal point capture the initial orienting reflex without competition?
2. **Gate 2 — Instantaneous Channel Capacity Bound ($C \le 4\pm 1$ chunks / grid axes / `CPL` / `WPM`):** Does density stay strictly inside human working-memory and foveal/phonological limits?
3. **Gate 3 — Habituation Half-Life & Causal Pattern Rupture ($|\partial S_i / \partial t| > \theta \;\wedge\; \text{Diversion} = 0$):** Does the piece execute a state shift across one of the 5 Orthogonal Vectors (`V1..V5`) before habituation sets in, with 100% causal coupling?
4. **Gate 4 — Dual-Mode Color/Timbral Carrier vs. Impulse Ratio ($\Delta E^*_{ab} \ge 45$ at $\le 5\text{ to }8\%$ budget):** Do ambient carrier states preserve harmony ($\Delta C < 18$, $\Delta L^* \approx 15\text{ to }25$) while reserving opponent contrast strictly for the Peak (`P*`) and CTA (`End`)?
5. **Gate 5 — Coping Potential & Conditional Peak-End Closure (`Silvia` + `Kahneman 1993`):** Does complexity resolve into a felt improvement at the end (`Improvers = 81.8%` repeat choice) and a single frictionless action?

---

### 1. Web UI/UX & Scrollytelling (`web_ui`)
**Primary Empirical Sources:** Tuch 2012; Still 2018; Dayama 2020 (GRIDS); Segel & Heer 2010; Schloss & Palmer 2011; Kahneman 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (0-200ms)** | `top_left_anchor_and_50ms_complexity` | Primary paradox/value headline in Top-Left Optical Zone (39px min error, Still 2018); low visual clutter + high layout prototypicality in first 50ms (Tuch 2012, eta_p^2=.552). |
| **Gate 2 · Capacity & Grid Alignment** | `grid_lines_and_cpl` | <= 4 shared alignment axes per viewport (GRIDS MILP, +34% order); <= 3 data points per Bento card with 1px #1E293B border; body copy locked to 55-68 CPL. |
| **Gate 3 · Habituation Reset & Pattern Rupture** | `scroll_rhythm_fermata` | Every 2 dense Bento/grid viewports, insert 1 Full-Bleed Fermata or Interactive Sandbox (V1/V2/V5 rupture) with 100% causal alignment (0 decorative stock B-roll/parallax diversion). |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `color_carrier_and_cta_pop` | 60-30-10 allocation; carrier surfaces transition smoothly (dH* <= 45 deg); single CTA/Peak impulse swatch achieves dE*ab >= 45 & WCAG >= 7:1 while occupying <= 5-8% of viewport. |
| **Gate 5 · Coping Potential & Peak-End Closure** | `martini_glass_and_final_summary` | Martini Glass scrollytelling: 3-5 author-driven setup steps -> interactive filter/comparison (93% Segel & Heer norm) -> mandatory Final Summary + 1-Click CTA Card (the rare 11% Peak-End anchor). |

### 2. Mobile App UI/UX & User Journey (`app_ui`)
**Primary Empirical Sources:** Putkonen 2025; Hoober 2016; Fitts 1954; Fosco 2020 (UMSI); Nunes & Dreze 2006; Bar & Neta 2006

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (0-200ms)** | `mobile_umsi_hierarchy` | Text occupies 32% more visual importance on mobile than desktop (Fosco 2020): 1 dominant status/action header (>= 2.5:1 size ratio) with instant cue-target semantic match (+1.40s search penalty if text-only without icon/color cue, Putkonen 2025). |
| **Gate 2 · Capacity & Thumb Ergonomics** | `element_cap_and_thumb_zone` | <= 3 cards/items visible per scroll fold (+20 ms search cost per added element, Putkonen 2025); primary interactive CTA locked in Bottom-Center/Right thumb arc (48x48px min target); destructive actions isolated in Top-Left. |
| **Gate 3 · Habituation Reset & Journey Pacing** | `step_rupture_and_haptic_pre_echo` | Break multi-step flows every <= 3 screens with an interactive preview or micro-reward state (V2/V3 haptic + 80ms visual pre-echo); zero unanchored decorative modals. |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `dark_surface_and_single_impulse` | Dark mode uses desaturated slate (#0F172A/#1E293B, 87% white text) to prevent halation; exactly 1 high-dE*ab (>= 45) impulse pill button per screen (<= 6% screen area). |
| **Gate 5 · Coping Potential & Peak-End Closure** | `endowed_progress_and_peak_end` | Pre-fill onboarding/journey progress bars at 20-25% (Endowed Progress, Nunes & Dreze 2006); curved 16-24px container morphology (Bar & Neta 2006, 67.2% preference) + celebratory Peak-End completion receipt. |

### 3. Long-Form Video (5-20m YouTube, Documentary, Lecture) (`long_video`)
**Primary Empirical Sources:** Cutting 2010; Zacks 2007; Reagan 2016; Boyd 2020; Harp & Mayer 1998; Vroomen & Keetels 2010

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (0-15s Hook)** | `cold_open_and_15s_contract` | 0-3s in-motion concrete visual + vocal onset (<150ms dead air); 3-15s Disrupt-Then-Reframe paradox or Concrete Human + Cataphoric Hook (H01/H04/H07/H09); zero logo intros (-37% bounce). |
| **Gate 2 · Capacity & Dual-Channel Load** | `lcamp_and_spatial_contiguity` | On-screen text overlays capped at 2-4 words (<= 11 chars) placed <= 100px from focal object (Mayer 2009); never display full verbatim sentences while speaking (-28% comprehension). |
| **Gate 3 · Habituation Reset & Causal Pattern Rupture** | `1f_pacing_and_schema_rupture` | 1/f shot clustering: alternate high-tension rapid cuts (1.5-2.5s) with slow 5-8s comprehension breaths during complex explanations (Lang 2000); shift across V1-V5 every 15-30s with 100% causal coupling (0 Harp & Mayer decorative B-roll diversion); -120ms Audio J-Cut leads. |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `temporal_color_script_q1_q5` | 5-Quintile Color Script: Q1 High-Contrast Hook -> Q2 Desaturated Compression -> Q3 Warm/Alert Twist -> Q4 Peak Luminance Bloom (P*) -> Q5 Restorative Release + Single High-dE*ab CTA End-Screen. |
| **Gate 5 · Coping Potential & Peak-End Closure** | `event_boundary_and_double_fall_rise` | Place the #1 takeaway frame immediately AFTER a major Event Boundary (Zacks 2007, +28% recall); maintain Double Fall-Rise emotional oscillation (-SV 4, Reagan 2016; TED z=-5.74 against Longwinded) + Q5 Collective 'We' resolution (+5.5z). |

### 4. Short-Form Video (Reels, TikTok, Shorts 15-60s 9:16) (`short_video`)
**Primary Empirical Sources:** Tencent/Douyin 2025; Baughan 2021; Lakatos 2019; Upworthy 45,246 A/B Corpus; Kahneman 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (<2.8s Swipe Gate)** | `swipe_gate_0_3s` | Frame 1 (0.0s) opens mid-motion with a concrete physical proof/human face + first spoken syllable at <100ms; 1.0-3.0s fires a 2-Clause Setup-Twist (H07) or Cataphoric Reveal (H01) (+28-37% 3s hold). |
| **Gate 2 · Capacity & 9:16 Safe Zone** | `vertical_safe_zone_and_subs` | All focal faces/objects locked inside 25%-72% Y and 10%-85% X (avoiding top 15% and bottom 22% app UI chrome); dynamic subtitles capped at 2-4 words at Y=65%-75%. |
| **Gate 3 · Habituation Reset & 3-Beat Cadence** | `three_beat_staccato_rupture` | Visual/acoustic state shift (1.18x axial punch-in, plane shift Mono->Micro, or 0.5s silence drop) every 1.4-2.5s; sentence rhythm alternates 10-18w setup with <=6w punch; zero unanchored meme inserts (Harp & Mayer diversion). |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `keyword_pill_impulse` | Subtitles use high-contrast pill carrier (#0F172A dark slate, 87% white text) with ONLY the 1-2 paradox/peak keywords highlighted in #FFD600 yellow (14.6:1 contrast, <= 5% frame area). |
| **Gate 5 · Coping Potential & Peak-End Loop** | `peak_payoff_and_seamless_loop` | Deliver the concrete visual/numerical payoff at 75-85% duration (Peak P*), and splice the final 1.5s clause grammatically into the 0.0s opening word to create a zero-seam replay loop. |

### 5. Poster, Print & Key Visuals (`poster`)
**Primary Empirical Sources:** Fosco 2020 (UMSI); Bylinskii 2017; Palmer, Schloss, & Sammartino 2013; Schloss & Palmer 2011; Still 2018

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (0-200ms)** | `umsi_two_pole_attractor` | UMSI Poster Law (Fosco 2020): Top-Center/Left Giant Display Typography + Center Human Face/Subject capture 42%-58% of initial fixation mass within 200ms; headline-to-body size ratio >= 3:1. |
| **Gate 2 · Capacity & Grid Simplicity** | `dominant_colors_and_chunks` | <= 3 dominant color clusters (>2% area each; Miniukovich 2015 r=+0.61 clutter penalty above 3); <= 3 distinct information groups (Hook Headline, Hero Visual, Terminal Event/CTA Block). |
| **Gate 3 · Habituation Reset & Visual Friction** | `contour_and_scale_contrast` | Create a single intentional topology break (V4: giant cropped glyph overlapping a photorealistic subject, or Bar & Neta sharp angular warning frame inside a curved layout) tied 100% to the poster's core message. |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `harmonic_background_vs_focal_pop` | Background + secondary elements form a Schloss & Palmer (2011) harmonious pair (dH* <= 40 deg or monochrome carrier), while the single focal badge/CTA fires an opponent impulse (dE*ab >= 50, <= 5% area). |
| **Gate 5 · Coping Potential & Terminal Scan Resolution** | `gaze_vector_to_cta` | Subject's eye gaze or structural leading lines point directly into the Bottom-Right Terminal Action Zone; zero competing badges along the outer border (prevents Banner Blindness -75% gaze loss). |

### 6. Illustration, Comics, Webtoons & Storyboards (`illustration`)
**Primary Empirical Sources:** Cohn 2013 (VNG); Zwaan 1995; Zacks 2007; Bar & Neta 2006; Palmer, Schloss, & Sammartino 2013; McCloud 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry & Inward Bias** | `establisher_and_inward_framing` | Open every scene with an Establisher (E) + Initial (I) panel where characters/vectors face INWARD toward the center/next panel (Palmer et al. 2013 Aesthetic Inward Bias) and silhouette reads cleanly in <100ms. |
| **Gate 2 · Capacity & Balloon/Panel Density** | `balloon_words_and_panel_cap` | <= 18 words (2-3 short lines) per speech balloon to preserve the 3-5 Hz saccadic rhythm; <= 4-6 panels per page (or 1-2 panels per mobile Webtoon viewport). |
| **Gate 3 · Habituation Reset & Framing Rhythm** | `cohn_framing_and_gutter_pacing` | Alternate Cohn's 4 attentional planes (Macro -> Mono -> Micro -> Amorphic) and panel widths: 3 narrow staccato panels (Prolongation tension) -> 1 borderless Full-Bleed Splash Panel (Peak P*) with vertical gutter expansion on Webtoon. |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `panel_color_script_and_focal_value` | Lock each scene to a cohesive 2-color harmonic mood carrier (Ou et al. 2004 Warm/Cool & Heavy/Light), reserving maximum luminance/chroma contrast (dE*ab >= 45) strictly for the Peak action hand/face/object in each panel. |
| **Gate 5 · Coping Potential & Situation Continuity** | `zwaan_5_index_and_shape_morphology` | Preserve >= 3 of Zwaan's 5 situation indices (Space, Causality, Goal, Time, Protagonist) across every gutter transition; match Bar & Neta (2006) contour morphology (curved 67.2% preference for safe/warm beats vs. sharp V-angles for threat/conflict). |

### 7. Audio, Podcasts & Spoken-Word Storytelling (`audio`)
**Primary Empirical Sources:** Näätänen 2007 (MMN); Rodero 2016, 2023; Lakatos 2019; Provost; Zacks 2007; TED N=2,465 Proof

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (0-35s Cold Open)** | `in_medias_res_cold_open` | Zero throat-clearing or housekeeping before 0:35 (NL3 Loophole: +19.1% Boredom penalty); drop straight into a concrete sensory scene or 2-clause paradox before any theme music. |
| **Gate 2 · Capacity & Prosodic Speed Window** | `wpm_and_signposting` | Maintain 160-180 WPM (Rodero 2016, eta_p^2=.51; >210 WPM collapses working memory, <150 WPM triggers mind-wandering); pre-announce structural chunks ('There are 3 mechanisms — First...') and cap episodes at <= 4 timestamped chapters. |
| **Gate 3 · Habituation Reset & Acoustic Rupture** | `silence_mmn_and_provost_cadence` | Trigger auditory Mismatch Negativity (MMN, 100-250ms) via a 0.8-1.5s complete silence pause + 150 WPM pitch drop before every core thesis; alternate 10-22w setup sentences with <=7w staccato punches (balanced_rhythm z=+9.9; ban >32w run-ons z=-7.8); teleport between Abstract Law and Concrete Human Story every 3-4 minutes. |
| **Gate 4 · Dual-Mode Timbral Carrier vs. Impulse** | `timbral_bed_vs_acoustic_impulse` | Audio equivalent of Dual-Mode Color: keep background music/ambience low, warm, and spectrally notches-out around 1-4 kHz vocal formants (Carrier), and use sudden bed-muting (0 dB vacuum) or a single diegetic sound proof as the Peak Impulse. |
| **Gate 5 · Coping Potential & Peak-End Closure** | `kahneman_audio_peak_end` | Resolve the opening tension loop in Q4 (Peak P*) and close Q5 with a Concrete Human Callback + Collective 'We/Our' Action Step (+5.5z Persuasive/Inspiring lift). |

### 8. Infographic & Data Visualization (`infographic`)
**Primary Empirical Sources:** Bylinskii 2017; Fosco 2020; Schoenlein 2022; Braun & Schloss 2025; Cleveland & McGill 1984

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry & Top-Left Conclusion** | `conclusion_title_and_z_to_f_path` | Titles & large callout numbers capture 3.25x more fixations than chart bodies (Bylinskii 2017, r_s=.968): state the quantitative conclusion directly in the Top-Left title (never 'Sales by Region', always 'Q4 Margin Jumped +34% After Cutting 3 SKUs'). |
| **Gate 2 · Capacity & Direct Labeling** | `series_cap_and_direct_labels` | <= 4 distinct data series/colors per chart; label lines/bars directly on the canvas (eliminating eye-bounce to external legends, Mayer Split-Attention d=1.12); align comparisons on a common horizontal/vertical baseline. |
| **Gate 3 · Habituation Reset & Anomaly Callout** | `grey_carrier_and_anomaly_rupture` | Prevent visual scan fatigue across multi-panel infographics by alternating 1 macro trend chart with 1 single-number/icon micro-callout card (V1/V4 rupture) anchored strictly to the causal takeaway. |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `semantic_color_and_dark_is_more` | Keep context/baseline series in harmonious desaturated grey/slate carrier (#64748B) and apply 1 high-chroma opponent impulse color (dE*ab >= 45) ONLY to the target anomaly/winner; obey Schoenlein (2022) Direct Semantic Association + Dark-is-More on light backgrounds / Hotspot-is-More on dark backgrounds (avoids 180-320ms RT penalty). |
| **Gate 5 · Coping Potential & Peak-End Synthesis** | `bottom_right_takeaway_box` | Terminate the Z-to-F visual scanpath at Bottom-Right with a 1-sentence Causal Synthesis & Action Box (Kahneman End anchor). |

### 9. Slide Decks, Pitch Decks & Keynotes (`slide_deck`)
**Primary Empirical Sources:** Mayer 2009; Cowan 2001; Duarte 2010; Lakatos 2019; Reagan 2016; Kahneman 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **Gate 1 · Pre-Attentive Entry (Assertion Headline)** | `assertion_evidence_headline` | Every slide top-left headline is a complete <= 9-word causal assertion (44-56pt, >= 3:1 ratio over labels) that states the takeaway in <1.5s. |
| **Gate 2 · Capacity & Zero-Bullet Law** | `zero_bullets_and_3_chunks` | Zero multi-line bullet paragraphs (eliminates Mayer Redundancy Trap -28% recall); strictly <= 3 visual chunks per slide (1 Assertion Headline + 1 Visual Diagram/Chart + 1 Giant Metric Callout at 72-96pt). |
| **Gate 3 · Habituation Reset & Sparkline Cadence** | `sparkline_and_black_slide_rupture` | Oscillate every 2-3 slides between 'What Is' (current friction/pain) and 'What Could Be' (resolved future state, Duarte Sparkline / Reagan -SV 4); every 5-6 slides insert 1 Pure Black / Single-Number Pattern-Interrupt Slide (V1 subtraction) + pre-announce transitions verbally 2s before clicking (V3). |
| **Gate 4 · Dual-Mode Color Carrier vs. Impulse** | `slide_color_script_and_morph` | Use dark slate carrier (#0F172A) with sharp 0-2px crimson/amber borders (#EF4444) on 'What Is' problem slides, shifting to restorative emerald/cyan (#10B981/#38BDF8) with 16-20px curved cards (Bar & Neta 2006) on 'What Could Be' solution slides. |
| **Gate 5 · Coping Potential & Peak-End Decision Slide** | `peak_demo_and_end_decision_table` | Place the undeniable live proof / 10x artifact at 75% deck position (Peak P*), and leave the final slide (End Q5) on screen during Q&A as a 3-row Concrete Decision & Next-Step Contract (never a blank 'Thank You / Questions?' slide). |



---

## Bilingual (English & Vietnamese) Lexical & Hook Engineering Reference (v9.0)

When auditing or authoring copy, hooks, scripts, or storyboards in **English (`EN`)** or **Vietnamese (`VI`)**, apply these cross-lingually validated lexical triggers and anti-sludge guardrails (implemented in `scripts/hook_scorer.py`, `scripts/narrative_arc_scorer.py`, and the live Unified 6-Domain Studio v10.0 at `https://attention-architecture.art.3cxo.work/`):

### 1. Bilingual Hook Archetypes & FMEA Guardrails (`0.3–15 s` Gate 2)

| Hook Mechanism / Hazard | Empirical Lift / Penalty | English (`EN`) Lexical Triggers | Vietnamese (`VI`) Lexical Triggers |
| :--- | :--- | :--- | :--- |
| **`H01` · Forward-Referencing Demonstrative (Deferred Noun)** | `d = +0.100` (`+6.5%` CTR, $p < 10^{-40}$) | `This`, `These`, `Here is why`, `One simple...` (before naming the subject) | `Thứ này`, `Điều này`, `Cách này`, `Chỉ 1...`, `Đây là lý do` |
| **`H02` · 2-Clause Counterfactual / Stage-Magic Pivot** | `+11.2%` CTR (`Upworthy` `45,246` A/B pairs) | `[Familiar Belief] + But / Actually / Instead / Turns out [Violation]` | `[Niềm tin quen thuộc] + Nhưng / Thực ra / Ngược lại / Thay vì / Hóa ra [Sự thật ngược lại]` |
| **`H06` · Concrete Specific Number / Odd Digit** | `+8.4%` CTR (`Schindler & Kirby 1997`) | Exact integer/decimal (`3 reasons`, `14.6:1`, `$49.87`, `73%`) | Số lẻ cụ thể (`3 cơ chế`, `555 nm`, `14.6:1`, `81.8%`, `trong 3 giây`) |
| **`H09` · Epistemic Challenge / Fault-Finding** | `+19.6%` retention (`P17–P21` + `Upworthy`) | `Spot the mistake`, `Most people get this wrong`, `Can you find...` | `90% người làm sai`, `Bạn có nhận ra lỗi sai`, `Đừng bao giờ...` |
| **`FMEA-01` · Yes/No Question Trap (`NL1` Rhetorical Overload)** | `-12.8%` CTR; `+29.8%` Boredom if $>15$ questions without grounding | Opening with `Do you...?`, `Are you...?`, `Did you know...?` (triggers Betteridge's Law `"No"` dismissal) | Mở đầu bằng `Bạn có biết...?`, `Có phải...?`, `Bạn đã từng...?` (khán giả tự trả lời *"Không"* rồi lướt qua) |
| **`FMEA-02` · Premature Noun Spoiler (Zero Curiosity Gap)** | `-18.3%` CTR (`Loewenstein 1994`) | Naming the full mechanism/conclusion in the first 3 words | Tiết lộ toàn bộ đáp án/kết luận ngay trong 3 từ đầu tiên |
| **`FMEA-03` · Shouting ALL-CAPS / Alarm Fatigue** | `-14.2%` CTR (`Brehm Reactance`) | `>= 3` ALL-CAPS words or `!!` / `?!` punctuation spam | Viết HOA toàn bộ `>= 3` từ hoặc lạm dụng `!!!` / `???` gây kháng cự tâm lý |
| **`FMEA-04` · Sub-Lexical / Ultra-Short Starvation** | `-29.4%` CTR | `< 8` words (`< 40` chars) with zero scene context | Câu quá cụt `< 8` từ, thiếu bối cảnh con người và xung đột nhận thức |

### 2. Bilingual 5-Quintile Narrative & 6-Flavor Discourse Markers (`>15 s` Gate 3)

| Narrative Dimension (`Boyd 2020`; `Reagan 2016`) | Empirical Effect (`2,465` TED Talks) | English (`EN`) Discourse Markers | Vietnamese (`VI`) Discourse Markers |
| :--- | :--- | :--- | :--- |
| **Concrete Human Grounding (`Q1` Required)** | `r = +0.149` Interest; `-8.2%` Confusion | `I`, `she`, `he`, `mother`, `patient`, `hand`, `eyes`, `walked`, `saw`, `felt` | `tôi`, `cô ấy`, `anh ấy`, `bệnh nhân`, `người mẹ`, `đôi mắt`, `bàn tay`, `nhìn thấy`, `bước vào` |
| **Episodic Story Hook (`Q1` Required)** | `+4.40z` Inspiring; `+3.37z` Funny | `years ago`, `one morning`, `when I was`, `remember when`, `in 1998` | `năm đó`, `một buổi sáng`, `khi tôi còn`, `hãy tưởng tượng`, `câu chuyện bắt đầu` |
| **Cognitive Tension (`Q2–Q3` Peak)** | `r = +0.187` Fascinating (when paired with `Q1` grounding) | `because`, `why`, `paradox`, `however`, `contradiction`, `question`, `mystery` | `tại sao`, `nghịch lý`, `mâu thuẫn`, `tuy nhiên`, `bí ẩn`, `nguyên nhân gốc rễ` |
| **Hope & Agency Lift (`Q4–Q5` Required)** | `+1.47z` Inspiring; prevents `NL4` Flat Negative Ending (`+21.9%` Boredom) | `can`, `together`, `build`, `future`, `solve`, `transform`, `possible` | `chúng ta có thể`, `giải pháp`, `cùng nhau`, `thay đổi`, `tương lai`, `hành động ngay` |
| **Abstract Academic Sludge (`Eliminate in Q1`)** | `+19.6%` Boredom/Confusion (`NL2` Monotonous Sludge) | `furthermore`, `consequently`, `methodology`, `framework`, `conceptualize`, `paradigm` | `hơn thế nữa`, `về mặt phương pháp luận`, `khung lý thuyết trừu tượng`, `hệ hình`, `tiền đề nhận thức` |

---

## Live Unified 6-Domain Interactive Studio (v10.0) & Executable CLI Verification Suite

- **Live Unified 6-Domain Studio v10.0 (Bilingual VI/EN · 34 Primary PDFs · 13 Interactive Labs):**
  - **Public URL:** <https://attention-architecture.art.3cxo.work/>
  - **13 Interactive Browser Labs:**
    1. *Demo 01 (`#pipeline`):* 3-Gate Neuro-Cognitive Pipeline Inspector (`0–300 ms`, `0.3–15 s`, `>15 s`).
    2. *Demo 02 (`#lab-yellow`):* `555 nm` Photopic Luminance & Von Restorff Isolation Simulator (`4 backgrounds × 3 clutter states`).
    3. *Demo 03A (`#lab-paradox`):* Cross-Media Paradox Hook & Endowed Progress Bar (`0%` raw vs. `20%` endowed).
    4. *Demo 03B (`#lab-paradox`):* Conditional Peak–End Memory Calculator (`Kahneman et al. 1993`, `P34`: Improver `81.8%` vs. Non-Improver `45.5%`).
    5. *Demo 04 (`#ab-hook-lab`):* Live A/B Hook Scorer & 12-Archetype / 4-FMEA Diagnostic (`VI` + `EN` + Upworthy experiments).
    6. *Demo 05 (`#lab-7media`):* 7-Medium Blueprint & Visual Engineering Studio.
    7. *Demo 06A (`#lab-wave2`):* Cleveland & McGill (`1984`) Chart Perception & Subitizing Simulator (`Aligned Bar 1.00×` vs. `Rainbow Bar` vs. `Pie 2.60×`).
    8. *Demo 06B (`#lab-wave2`):* Reading Span (`55–68 CPL`), Cowan `4±1` Chunking & Numeric Disfluency Simulator.
    9. *Demo 07 (`#lab-eastasia`):* East Asian Information Architecture Simulator (`1px Bento Grid`, `Kishōtentetsu 起承転結`, `9:16 Danmaku Safe Zone`).
    10. *Demo 08 (`#lab-audio`):* Web Audio API Acoustic MMN Synthesizer (`0.8–1.5s` silence drop) & Video Cut / WPM LC4MP Overload Calculator.
    11. *Demo 09 (`#lab-color-layout`):* 7-Channel Spectral Color Inspector & 8-Layout Eye-Tracking Scanpath Simulator (with Good vs. Bad Layout toggle).
    12. *Demo 10 (`#lab-wave5-papers`):* Computational Aesthetics, `GRIDS` Alignment & `UMSI` 3-Peak Heatmap Simulator (`P01–P16`).
    13. *Demo 11–13 (`#lab-wave6-appraisal`, `#lab-wave7`, `#lab-wave8`):* 34-Paper Forensic Appraisal Explorer (`P01–P34`), 6-Surface Storyboard & Live 5-Quintile Narrative Scorer (`P17–P26`), and Wave-8 CIELAB Dual-Mode Color Physics + 5-Vector Rupture Generator + 9-Kind Invariant Audit Matrix (`P27–P34`).
- **Executable CLI Verification Engines (`~/workspace/research/261107-attention-information-architecture/scripts/`):**
  - `python3 scripts/hook_scorer.py --compare "<Hook A>" "<Hook B>"` — 12-Archetype + Empirical Bayes hook comparator (`68.30%` held-out accuracy on `6,782` Upworthy A/B pairs).
  - `python3 scripts/narrative_arc_scorer.py --text "<Script>"` — 5-Quintile narrative arc, rhythm, and 6-Attention-Flavor scorer (`71.47%` clear-pair holdout accuracy on `495` TED Talks).
  - `python3 scripts/first_principles_engine.py --color-carrier "#0F172A" "#1E293B" "#334155" "#1E293B" "#0F172A" --impulse "#FFD600" --impulse-bg "#0F172A" --impulse-area 4.5` — CIELAB Dual-Mode Color Physics (`Schloss & Palmer 2011`; `Ou et al. 2004/2010`), 5-Vector Pattern-Rupture generator (`Harp & Mayer 1998`), and 9-Kind Deliverable Gate Auditor (`72.0%` clear-pair holdout accuracy).

## References

- **`schloss-palmer-2011`:** Karen B. Schloss & Stephen E. Palmer (2011), *"Aesthetic response to color combinations: preference, harmony, and similarity"*, Attention, Perception, & Psychophysics, 73(2), 551-571.
- **`harp-mayer-1998`:** Shannon F. Harp & Richard E. Mayer (1998), *"How Seductive Details Do Their Damage: A Theory of Cognitive Interest in Science Learning"*, Journal of Educational Psychology, 90(3), 414-434.
- **`kahneman-1993`:** Daniel Kahneman, Barbara L. Fredrickson, Charles A. Schreiber, & Donald A. Redelmeier (1993), *"When More Pain Is Preferred to Less: Adding a Better End"*, Psychological Science, 4(6), 401-405.
- **`putkonen-2025`:** Aini Putkonen et al. (2025), *"Understanding visual search in graphical user interfaces"*, Int. J. Human-Computer Studies, 199, 103483.
- **`fosco-2020`:** Camilo Fosco et al. (2020), *"Predicting Visual Importance Across Graphic Design Types"*, ACM UIST, 249-260.

#### 3.10 The 3-Specimen Visual Proof Pattern (Dark OLED vs. Daylight Print vs. Anti-Pattern Mockup)
- **Never explain a color, layout, or hook rule with prose alone:** Every interactive reference tab or design specification must pair its psychophysical mechanism with **concrete visual UI/Video specimens**:
  1. **Specimen 1 — Dark OLED Studio (`#0B0F19` surface):** Live UI/Subtitle mockup showing the exact hex (`#FFD600` on `#070A12`, `19.56:1`) and `≤5%` Von Restorff area cap.
  2. **Specimen 2 — Daylight Editorial Print (`#FFFFFF` / `#FAF8F5` surface):** Live UI mockup showing how the color shifts to darkened high-contrast ink (`#92400E` on `#FEF3C7`, `7.4:1 AAA`) to prevent photopic washout.
  3. **Specimen 3 — Failure Mode / Anti-Pattern (`❌ Bẫy Thất Bại`):** Live visual demonstration of the exact perceptual failure (`#FFD600` on `#FFFFFF` = `1.07:1` blindness, red-on-blue chromostereopsis, pure `#000000`/`#FFFFFF` halation, or F-pattern wall of text).
- **Unified Dark Container Polarity for Embedded Simulators:** Never wrap dark-calibrated interactive canvases (`#080B11` heatmaps, scanpath SVGs, or data-viz stages) inside a light-cream parent section with global dark-text CSS overrides (`color: #0F172A !important`). Keep multi-lab simulator containers in a unified dark architectural blueprint palette (`#0B101E` / `#0F172A`) and demonstrate Daylight Editorial Paper inside dedicated self-contained specimen cards.

---

# Domain VI — Cognitive Biases, Choice Architecture, Ecological Rationality & Debiasing (`Wave 9 · P35–P50`)

When designing pricing/conversion flows, persuasive storytelling, or engineering/business decision rubrics, enforce **Audit Gates 19–22** (grounded in `P35–P50`, `Many Labs 1–4`, `DellaVigna & Linos 2022` $N = 23.5\text{M}$, and `Gigerenzer 1995/2011`):

| Gate | Quantitative Pass/Fail Rule & Hard Boundary Condition | Empirical Proof (`P35–P50`) |
| :--- | :--- | :--- |
| **Gate 19 · Structural Choice Architecture & Numeric-Only Decoys** | 1. **Endorsed & Endowed Defaults:** Pre-select the recommended tier/setting with an explicit domain rationale (**Endorsement $b=0.32$**, **Endowment $b=0.31$**; physical Ease $b=-0.05$ is null, `Jachimowicz 2019 P43`, $d = 0.68, +27.2\text{ pp}$). Pure copy/email nudges yield only $+1.4\text{ pp}$ at scale (`DellaVigna & Linos 2022 P42`). Never pre-check silent auto-renewal (`Decree No. 778 Art. 10`).<br>2. **Value-Deconstruction Anchoring:** Itemize standalone component values before revealing bundle pricing (`88VIP`: **¥536 $\to$ ¥88/yr**; `Klein 2014 P35` $d = 1.62\text{–}2.42$; precision $d = 0.41\text{–}0.58$).<br>3. **Numeric-Only Decoy Law:** Deploy Asymmetric Dominance decoys ($+9\text{–}14\text{ pp}$) **only in 3–4 column alignable numeric tables**; never place decoys on visual photo grids or menus where the effect collapses to **$d = 0.00$** (`Frederick et al. 2014 P45`, $N > 14,000$).<br>4. **Stage-Gated Choice Overload & 100% IKEA Onboarding:** Cap Stage-3 buying tables at $\le 3\text{–}4$ tiers $\times \le 5$ aligned rows (`Chernev 2015 P46` $d = -0.62$). Trigger Loss Aversion ($\lambda = 1.81$, `Brown 2024 P44`) via Reverse Trials or `不回本退差` rebate guarantees, and include a **1-click sample-data fallback** on `<90 s` co-creation onboarding so $100\%$ finish (avoiding the **$-60\%$ incomplete-build collapse** in `Norton 2012 P47` Study 3). | `P35`, `P39–P47` |
| **Gate 20 · Persuasion Sequencing ($N=1$ Separation & Verbatim Truth)** | 1. **Temporal Separation of $N=1$ Story vs. Statistics:** Anchor emotional beats on **1 named protagonist ($N = 1$, $+108\%$ action)**, and **never mix macro statistics into the emotional climax** (`-40%` analytical empathy suppression, `Small, Loewenstein, & Slovic 2007`; `van Laer 2014 P49` $r = .41$). Put System 2 stats in `Q2/Q3` and keep `Peak Q4 / End Q5` purely human.<br>2. **Verbatim Thesis Repetition:** Repeat the core 5–8w thesis **word-for-word** at `Q1`, `Q3`, and `Q5` (**verbatim $d = 0.53$ vs. gist paraphrase $d = 0.21$**, `Dechêne 2010 P50`).<br>3. **75/25 Competent Pratfall & Anti-Boomerang Norms:** Establish $\ge 75\%$ competence proof *before* admitting 1 honest boundary condition (`Aronson 1966`; `Ein-Gar 2012`), and pair peer comparisons with **injunctive approval badges** (`Schultz 2007`) or **dynamic velocity norms** (`Sparkman & Walton 2017`, $d = 0.36$). | `P49`, `P50`, `Small 2007`, `Schultz 2007` |
| **Gate 21 · Ecological Rationality & Engineering Debiasing** | 1. **Natural Frequency Trees:** Express all alert precision, confusion matrices, and Bayesian risks as **unnormalized Natural Frequencies over a shared denominator** (`"9 of 108 alerts"`, $16\% \to 50\%$ accuracy, $\text{OR} = 7.58$, `Gigerenzer & Hoffrage 1995 P48`); **normalized `%` frequencies fail ($11.1\%$)**.<br>2. **Fast-and-Frugal Rubrics:** Score multi-attribute architecture/vendor choices using **2–3 Lexicographic Veto Gates (`Take-the-Best`, $71\%$) + Unit-Weight Tallying ($\{-1, 0, +1\}$, $69\%$)** rather than overfitted decimal weights (`Gigerenzer & Gaissmaier 2011 P49`).<br>3. **RCF, 3-Reason Pre-Mortem & Kill Tripwires:** Apply **Reference Class $P_{50}/P_{80}$ uplifts** (`Flyvbjerg 2023`, $>50\%$ MAPE cut), run **Silent 3-Reason Pre-Mortems** (hard cap at 3 reasons to avoid `Sanna 2002` 12-reason retrieval-disfluency backfire), lock **Zero-Base Kill Tripwires** before coding (`Sleesman 2012`), and aggregate forecasts via **Log-Odds Extremizing** (`Mellers 2014`). | `P48`, `P49`, `Flyvbjerg 2023`, `Sanna 2002`, `Mellers 2014` |
| **Gate 22 · Zero-Pseudoscience Hygiene** | Purge debunked/retracted claims from all designs and copy: **NO Ego Depletion** (`Hagger 2016 P38` $d = 0.04$), **NO Signing-at-the-Top for Honesty** (`Shu 2012` **Retracted**, `Kristal 2020` $d = 0.004$), **NO Subliminal/Money/Flag/Elderly Priming** (`Klein 2014 P35` $d = -0.02\text{–}0.03$), **NO Power Posing / Facial Feedback** (`Wagenmakers 2016` $d = 0.03$), **NO Unconscious Thought Theory** (`Nieuwenstein 2015` $g = -0.02$), and **NO Rhyme-as-Reason Truth Claims** (`De Keersmaecker 2021` $d = 0.02$). | `P35–P38`, `P40` |

---

## 1. The Replication-Crisis Filter: The 3-Tier Evidence Hierarchy

Before applying any behavioral economics or psychology principle to a UI, pricing page, video script, or engineering RFC, filter it through the **Empirical Replication Hierarchy**:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│        WAVE 9 EMPIRICAL REPLICATION HIERARCHY (50 PRIMARY PAPERS P01–P50)         │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  TIER 1: IRONCLAD STRUCTURAL & REPRESENTATIONAL LAWS (d = 0.50 to 2.42)           │
│   ├─ Numeric & Precision Anchoring (Klein 2014 P35: d = 1.62–2.42, 36/36 labs)    │
│   ├─ Natural Frequency Trees vs. % (Gigerenzer 1995 P48: 16% -> 50%, OR = 7.58)   │
│   ├─ Decision-Structure Defaults (Jachimowicz 2019 P43: d = 0.68, +27.2 pp)       │
│   ├─ IKEA Effect Co-Creation (Norton 2012 P47: +62.5% WTP, d = 0.67 if completed) │
│   ├─ Verbatim Illusory Truth (Dechêne 2010 P50: d = 0.53 verbatim vs 0.21 gist)   │
│   ├─ Narrative Transportation (van Laer 2014 P49: r = .41 attitude, d = 0.90)     │
│   └─ Reference Class Forecasting & 3-Reason Pre-Mortem (Flyvbjerg 2023; Sanna 02) │
│                                                                                   │
│  TIER 2: CONDITIONAL LAWS WITH HARD BOUNDARIES (Fails if Boundary Violated!)      │
│   ├─ Decoy / Asymmetric Dominance (P45): +9–14 pp in NUMERIC TABLES ONLY;         │
│   │  collapses to d = 0.00 on visual/experiential photo grids!                    │
│   ├─ Loss Aversion (P44: λ = 1.81): Requires ENDOWMENT or medium/high stakes;     │
│   │  vanishes (λ ≈ 1.00) for routine outlays < $10–$20!                           │
│   ├─ Choice Overload (P46): Main effect g = 0.02; triggers (d = -0.62) ONLY when  │
│   │  Complexity + Task Difficulty + Uncertainty + Buying Goal co-occur!           │
│   └─ Identifiable Victim (N = 1, +108%): Collapses at N = 2 (-23%) or when        │
│      combined in the same beat with macro statistics (-40%, Small et al. 2007)!   │
│                                                                                   │
│  TIER 3: DEBUNKED / RETRACTED / PSEUDOSCIENCE (d ≈ 0.00 — NEVER USE)              │
│   ├─ ✗ Ego Depletion / Glucose Willpower (Hagger 2016 P38: d = 0.04; Vohs d=0.06) │
│   ├─ ✗ Signing at Top of Form for Honesty (Shu et al. 2012 — RETRACTED, d=0.004)  │
│   ├─ ✗ Subliminal / Money / Flag / Elderly Social Priming (P35: d = -0.02–0.03)   │
│   ├─ ✗ Power Posing & Pencil-in-Mouth Facial Feedback (Wagenmakers 2016: d=0.03)  │
│   └─ ✗ Unconscious Thought Theory (g = -0.02) & Rhyme-as-Reason Truth (d = 0.02)  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Playbook A — Product UI, Web Conversion & Pricing Choice Architecture

### Rule A1 · Engineer Defaults via Endorsement & Endowment, Never Stealth Coercion (`P39–P43`)
- **Empirical Law:** In `Jachimowicz et al. (2019, P43)` ($k = 58, N = 73,675$), defaults shift selection by **$d = 0.68$ (`+27.24 pp`)**, and in `Mertens et al. (2022, P39)` ($k = 440$), **Decision Structure ($d = 0.55$; Defaults $d = 0.62$)** beats **Decision Information ($d = 0.38$)** and **Decision Assistance ($d = 0.31$)**. However, `P43` Table 2 proves defaults work via **Endorsement ($b = 0.32, p = .038$)** and **Endowment ($b = 0.31, p = .044$)**, whereas physical **Ease ($b = -0.05, p = .75$)** has zero effect.
- **Execution:**
  1. Pre-select the recommended tier or configuration and badge it with an explicit **Endorsement rationale** (`"Recommended for 3–10 person teams based on your repo size"`).
  2. Pre-populate the user's workspace with their actual imported domain/data so the default state carries immediate **Endowment**.
- **Anti-Backfire & Legal Gate (`Decree No. 778 Art. 10`):** Never pre-check silent recurring billing (`默认勾选自动续费`) or hide cancellation in 5-level menus. Under China's Consumer Protection Law Implementation Regulations (effective July 1, 2024) and EU/FTC dark-pattern rules, recurring billing requires explicit opt-in and a **prominent 5-day pre-deduction notice (`提前5日以显著方式提醒`)**.

### Rule A2 · Value-Deconstruction Anchoring & Scale-Granularity Precision (`P35`; `Janiszewski & Uy 2008`)
- **Empirical Law:** Numeric anchoring is the single largest replicated bias in psychology (`Klein et al. 2014, P35`: **$d = 1.62\text{–}2.42$**, $36/36$ labs), and precise anchors (`¥536`, `$1,428`) induce finer mental adjustment scales than round anchors (`¥500`, `$1,500`), reducing counter-adjustment by **$d = 0.41\text{–}0.58$** (`Janiszewski & Uy 2008`).
- **Execution:**
  1. **Sum-of-Parts Bundle Deconstruction (`锚定效应爆破`):** Before showing a bundle or Pro price, itemize the exact standalone value of every component (e.g., Taobao `88VIP`: Youku ¥198 + NetEase Music ¥188 + Ele.me ¥120 + Tmall Discount = **¥536 total value $\to$ ¥88/yr**).
  2. **Monthly-Equivalent Framing (`折算月均价`):** Display annual plans by their daily or monthly equivalent (`"$16.50/mo billed annually"` or `"仅 ¥0.24/天"`) next to the standalone monthly anchor (`"$25/mo"`).
  3. **B2C Charm vs. B2B Prestige:** Use left-digit `.99` / `.9` pricing (`¥19.9` vs `¥20.0`, $g = 0.21$) for consumer/self-serve impulse tiers, but use clean integers (`$2,000/yr`) for enterprise/high-trust tiers where `.99` signals discount quality.

### Rule A3 · The Numeric-Only Decoy Law & 4-Moderator Choice-Overload Gate (`P45`, `P46`)
- **Empirical Law:** `Frederick, Lee, & Baskin (2014, P45)` ($38$ studies, $N > 14,000$) proved that **Asymmetric Dominance (Decoy Effect)** shifts target choice by **$+9.2\text{ to }+14.0\text{ pp}$ ($d = 0.35\text{–}0.41$) ONLY when attributes are displayed as alignable numeric tables**, and collapses to **$d = 0.00$** on visual, pictorial, or experiential grids. Simultaneously, `Chernev, Böckenholt, & Goodman (2015, P46)` ($k = 99, N = 14,195$) proved that **Choice Overload ($d = -0.62$)** activates only when **Choice-Set Complexity, Task Difficulty, Preference Uncertainty, and Buying Goal** co-occur.
- **Execution:**
  1. **Pricing Tables (Stage 3 Buying Goal):** Present **$\le 3\text{–}4$ tiers** with **$\le 5$ horizontally aligned numeric rows** (`Seats`, `Credits/mo`, `Storage GB`, `SLA %`). Use either a **Compromise middle tier (`Simonson 1989`, $+10.2\text{ pp}$)** or an **Asymmetric Numeric Decoy** (e.g., Chinese VIP matrix: `连续包月 ¥25` vs. `普通月卡 ¥30` to drive recurring signups, or `Pro $49` vs. `Pro+ Decoy $59` to anchor value).
  2. **Visual Catalogs & Menus (Stage 1/2 Browsing Goal):** Never insert ugly or overpriced decoy cards into visual photo grids (`P45` $d = 0.00$). Allow rich browsing variety in Stage 1/2, but provide a **1-click "Top 3 Recommended for You" filter** to collapse complexity when the user transitions from Browsing to Buying (`P46`).

### Rule A4 · Endowment-First Reverse Trials, Loss-Rebate Guarantees & 100%-Complete IKEA Onboarding (`P44`, `P47`, `Imai 2021`)
- **Empirical Law:** Bias-corrected loss aversion is **$\lambda = 1.81$** (`Brown et al. 2024, P44`), but vanishes ($\lambda \approx 1.00$) for small routine purchases (`Gal & Rucker 2018`; `Yechiam 2019`) and pure loss-framed copy (`O'Keefe & Jensen 2007`, $r = 0.032$). Meanwhile, the **IKEA Effect (`Norton et al. 2012, P47`)** boosts WTP by **$+62.5\%$ ($d = 0.67$)** when users complete a creation task, **but collapses by $-60\%$ ($d = -0.72$, Study 3) if the task is left incomplete**, and **Effort Present Bias ($\beta = 0.88$, `Imai et al. 2021`)** causes users to abandon upfront friction at $t = 0$.
- **Execution:**
  1. **Zero-$t=0$-Friction + 3-Step IKEA Co-Creation (`<90 s`):** Let users generate an interactive artifact at $t = 0$ *before* registration ($\beta = 0.88$). Guide them through **3 simple customization steps** with a mandatory **1-click sample-data fallback** so $100\%$ of users complete the build (`P47`).
  2. **Reverse Trial + Endowed-Asset Ledger:** Grant 14 days of full Pro features upfront. At renewal/exit, display the user's specific accumulated assets (`"累计已省 ¥228"`, `"4 active workflows and 1,240 indexed records will be archived"`), or offer a **Zero-Risk Loss-Rebate Guarantee (`不回本退差`)** where any shortfall between membership cost and realized savings is auto-refunded.
  3. **Upfront Fee & Delivery Date Certainty (`Ellsberg 1961`; `Hsu 2005`):** Show exact arrival dates (`"Arrives Thu, Nov 12"`) and all-in pricing on the card to prevent amygdala-driven ambiguity aversion.

---

## 3. Playbook B — Video, Storytelling, Audio & Persuasion Architecture

### Rule B1 · Full Narrative Transportation (`P49`) + Self-Reference (`d = 0.65`) Beats Bare $N = 1$ Vignettes (`Maier 2023`; `Small 2007`)
- **Empirical Law:** While `Small, Loewenstein, & Slovic (2007)` found that a single named individual ($N = 1$) doubled donations (`+108%`) and that mixing macro statistics into the $N = 1$ story slashed action by **$-40\%$**, `Lee & Feeley (2016)` ($k = 41, N = 8,856$, $r = .050$) and the high-powered Registered Report by `Maier, Wong, & Feldman (2023)` ($N = 1,004$, $\eta^2_p = 0.00$) proved that **bare $N = 1$ name-dropping in a text vignette has zero effect**. What reliably replicates across $76$ studies ($N = 21,208$) is **full Narrative Transportation (`van Laer et al. 2014, P49`: $r = .41$ attitude, $r = -.18$ counterarguing suppression)** combined with **Self-Reference Encoding (`Symons & Johnson 1997`: $k = 129, d = 0.50\text{–}0.65$)**.
- **Execution:**
  1. Never rely on a token 1-sentence customer quote; build an **Imaginable Plot ($r = .26$) + Verisimilitude ($r = .23$) + 1 Identifiable Protagonist ($r = .17$)** (`P49`) paired with direct **2nd-person Self-Reference prompts (`"Your pipeline"`, $d = 0.65$)**.
  2. **Keep System 2 statistics temporally separated (`Q2/Q3`)** from the emotional climax (`Peak Q4 / End Q5`) so analytical calculation never interrupts narrative transportation.

### Rule B2 · Verbatim Thesis Repetition (`P50` Dechêne 2010) & Competent Pratfall Sequencing (`Aronson 1966`; `Ein-Gar 2012`)
- **Empirical Law:** In `Dechêne et al. (2010, P50)` ($k = 51$), **verbatim repetition ($d = 0.53$)** increases perceived truth **$2.5\times$ more than gist paraphrase ($d = 0.21, p < .01$)**, provided the repeated claim appears inside a heterogeneous stream of novel evidence ($d = 0.53$ vs. $-0.09$). In `Aronson et al. (1966)` and `Ein-Gar, Shiv, & Tormala (2012)`, disclosing a minor flaw (**Pratfall / Blemish Effect**) increases trust and product evaluation **only after** high competence/quality is established first (otherwise $d = -0.35$ backfire).
- **Execution:**
  1. Coin a **5-to-8 word Verbatim Thesis Formula** and repeat it **word-for-word** at `Q1` (Opening Hook), `Q3` (Midpoint Pivot), and `Q5` (Terminal Synthesis) — never paraphrase it with synonyms.
  2. **75/25 Competence-Before-Blemish Sequence:** Spend the first $75\%$ of the evaluation establishing undeniable technical proof and benchmark wins; then explicitly name **1 honest boundary condition** (`"When NOT to use this tool: if your dataset is < 500 rows, use SQLite instead"`). This disarms persuasion resistance (`Friestad & Wright 1994`) and spikes credibility.

### Rule B3 · Anti-Boomerang Social Proof: Injunctive Badges, Proximal Peers & Dynamic Trends (`Schultz 2007`; `Sparkman & Walton 2017`)
- **Empirical Law:** Raw descriptive norms (`"Average team deploys 2×/week"`) trigger a **$-8.6\%$ Boomerang Effect** among above-average performers (`Schultz et al. 2007`, $N = 290$) unless paired with an **injunctive approval cue** (`✓ Top 10%`). Generic global counters (`"280,000 sold"`) suffer rapid desensitization (`脱敏`) and skepticism when unverified (`Mathur et al. 2019`), whereas **proximal local norms (`Goldstein et al. 2008`, $+14.2\text{ pp}$)** and **dynamic trend norms (`Sparkman & Walton 2017`, $d = 0.36$)** preserve high trust.
- **Execution:**
  1. Pair every benchmark comparison with an **injunctive status badge** (`"✓ Healthy / Top Quartile"`) so high performers never regress toward the average.
  2. Replace generic aggregate boasts with **proximal peer proof** (`"Used by 14 engineering teams in your stack / 3 mutual connections"`).
  3. When current adoption of a new behavior is $<50\%$, never cite the low static percentage; report the **verified dynamic velocity** (`"Adoption among Rust teams grew +38% over the last 2 quarters"`).

---

## 4. Playbook C — Engineering, Architecture & Business Decision-Making Debiasing

Because **Myside Bias is independent of IQ ($r = -.05\text{ to }+.05$, `Stanovich et al. 2013`)**, high numeracy amplifies motivated rationalization by **$+25\text{ to }+45\text{ pp}$ (`Kahan et al. 2017`)**, and telling engineers to *"be objective"* has **zero effect ($F < 1$, `Lord et al. 1984`)**, enforce these **5 Structural Decision Gates** on every RFC, roadmap, incident review, and investment decision:

| Gate | Cognitive Bias Defeated | Structural Debiasing Protocol & Mathematical Rule | Empirical Proof & Effect Size |
| :--- | :--- | :--- | :--- |
| **Gate C1 · Reference Class Forecasting (RCF) & Modularity** | **Planning Fallacy & Fat-Tail Overruns** (`Buehler 1994`: only $29\text{–}37\%$ finish on time; `Flyvbjerg 2023`: IT fat tail $18\%$ at $+447\%$ overrun) | Anchor on $N \ge 15$ completed historical projects *before* bottom-up task estimation. Compute $E_{\text{RCF}}(q) = E_{\text{inside}} \times (1 + U_q)$ using $P_{50}$ for internal targets and $P_{80}$ for external SLAs. Decompose monolithic IT projects into independent modular releases. | Cuts schedule/cost MAPE by **$>50\%$** ($28\%\text{–}45\% \to 9\%\text{–}12\%$, `Flyvbjerg 2006, 2023`; `Batselier & Vanhoucke 2016`). |
| **Gate C2 · Natural Frequency Trees & Fast-and-Frugal Rubrics** | **Base-Rate Neglect & Multi-Attribute Overfitting** (`Casscells 1978`: $82\%$ MD failure; `Gigerenzer 1995 P48`, `2011 P49`) | Express all alert precision, A/B power, and failure rates as **Natural Frequencies over a fixed denominator** (`"Per 10,000 requests: 10 real faults (9 caught) + 99 false alarms = 9/108 [8.3%] true positive"`). Score architecture/vendor options via **2–3 Lexicographic Vetoes (`Take-the-Best`) + Unit-Weight Tallying ($\{-1, 0, +1\}$ across $\le 5$ criteria)**. | Lifts Bayesian accuracy from **$16\% \to 46\%\text{–}50\%$** (`P48`, meta $\text{OR} = 7.58$); `Take-the-Best` ($71\%$) & `Tallying` ($69\%$) beat Multiple Regression ($68\%$) out-of-sample (`P49`). |
| **Gate C3 · Silent 3-Reason Pre-Mortem & Consider-the-Opposite** | **Confirmation / Myside Bias & Retrieval-Fluency Backfire** (`Hart 2009` $d=0.36\text{–}0.54$; `Mitchell 1989`; `Sanna 2002`) | Before RFC approval, each reviewer silently writes **exact 3 reasons** why the deployment caused a P0 outage 6 months in the future (**NEVER ask for 10–12 reasons**, which triggers `Sanna 2002` retrieval-fluency backfire!). Apply **Methodological Inversion (`Lord 1984`)**: *"If this benchmark showed the opposite winner, would we accept this sample size?"* | Prospective Hindsight increases diagnostic failure discovery by **$+30\%$** (`Mitchell 1989`); Consider-the-Opposite eliminates polarization ($d \approx 0.95$, `Lord 1984`). |
| **Gate C4 · Zero-Base Kill Tripwires & Reviewer Separation** | **Sunk Cost Fallacy & Escalation of Commitment** (`Arkes & Blumer 1985`; `Klein 2014 P35` $d=0.80$; `Sleesman 2012` $N=31,086$) | Bind immutable quantitative **Kill Tripwires** (latency, error rate, engineering-weeks, adoption) in the RFC header before coding begins, and assign stage-gate continuation sign-off to a reviewer who did **not** sponsor the initial proposal (`Staw 1976`). | Eliminates ego-threat ($d = 0.77$) and personal-responsibility ($d = 0.63$) escalation (`Sleesman et al. 2012`). |
| **Gate C5 · Brier Calibration, Extremizing & Outcome-Blinded Review** | **Overprecision ($90\%$ CI captures $43\%$) & Outcome/Hindsight Bias** (`Moore & Healy 2008`; `Baron & Hershey 1988` $d=0.65\text{–}1.04$) | Replace verbal hedges ("likely", "medium risk") with independent **$1\%$-granularity probabilities**, aggregate via **Log-Odds Extremizing ($a \approx 1.6$)**, track **Brier Scores**, and score incident/bet decision quality **before unblinding outcome severity**. | CHAMPS training cuts Brier error **$-10\%\text{–}14\%$**, Teaming **$-10\%\text{–}23\%$**, Extremizing **$-15\%\text{–}25\%$** (`Mellers et al. 2014, 2015`). |

---

# Domain VII — Psycholinguistics, Sensorimotor Wording, Syntactic Surprisal & Mental Biases (`Wave 10 · P51–P74`)

When writing or auditing headlines, UI microcopy, video hooks, podcast scripts, support replies, or pricing frames, enforce **Audit Gates 23–26** (`docs/17-psycholinguistics-attention-wording-and-mental-biases.md`):

| Gate | Quantitative Pass/Fail Rule & Hard Boundary Condition | Empirical Proof (`P51–P74`) |
| :--- | :--- | :--- |
| **Gate 23 · Sensorimotor Concreteness & Active Listening** | 1. **Brysbaert Concreteness ($C \ge 3.5$):** Hero/hook/CTA nouns and verbs must refer to visually/haptically perceptible entities ($C \ge 3.5$ on 1–5 scale, `-40 to -80 ms` RT, `~2×` recall, `Clark & Paivio 1991 P51`; `Brysbaert 2014 P52`).<br>2. **Zero Bare Pro-Forms (Listening Signal):** Replace *"this issue / that item / our solution"* with specific concrete nouns (`"that grey cotton shirt to your doorstep"`), boosting CSAT `+8.9%` and **90-day spending `+13% to +30%` via Perceived Listening ($p=.017$, not fluency!)** (`Packard & Berger 2020 P53`).<br>3. **Action-Verb Truth:** Use **Level-1/2 Descriptive Action Verbs (`DAV/IAV`)** instead of abstract state verbs/adjectives ($\eta_p^2 = .08\text{–}.19$, `Hansen & Wänke 2010 P54`). | `P51–P54` |
| **Gate 24 · Click-vs.-Share Affective Polarity (Threat-to-Awe Pivot)** | 1. **Hook Arrest (`+2.3%` CTR/neg word):** Open cold headlines/hooks with **1–2 concrete threat/fault words** (`Robertson 2023 P31`).<br>2. **Payoff Virality (`+30–34%` share odds):** Immediately pivot in the subhead/body to **High-Arousal Awe (`+30%`), Righteous Anger (`+34%`, equal to `2.9 hrs` NYT #1), or Practical Utility (`+30%`)** (`Berger & Milkman 2012 P55`). **Never close on low-arousal Sadness (`-16%`)**. | `P31`, `P55` |
| **Gate 25 · Pronouns, Identity Nouns & Rhetorical Involvement** | 1. **First-Person `"I"` vs. `"We"` & `"You"`:** Specialist, founder, and support copy must use singular **`"I / Mình"`** (`5.19` vs `"We"` `4.01`, $F=24.81, p<.001$, via Empathy & Agency). Error states must contain **`0` accusatory `"You"` clauses** (`Packard et al. 2018 P56`).<br>2. **Identity Nouns & Refusal Modals:** Frame aspirational CTAs as **Identity Nouns** (*"Be an Early Builder"*, `+10.9 to +13.7 pp`, `Bryan 2011 P58`, unless early failure rate is high); use **`"I don't"`** for internal standards (`80%` vs `10%` 10-day persistence) and **`"I can't"`** for external SLA freezes (`Patrick & Hagtvedt 2012 P57`).<br>3. **Rhetorical Question Crossover:** Use rhetorical questions **only** on low-involvement cold hooks (`+0.61` vs `+0.04`); **ban them (`0%`) on high-involvement pricing, checkout, and docs pages** where they distract readers and **collapse persuasion by `-93%` (`+0.05` vs `+0.75`, $p<.01$)** (`Petty, Cacioppo, & Heesacker 1981 P64`). | `P56–P60`, `P64` |
| **Gate 26 · Syntactic Locality, PAD Threshold & Mental Accounting** | 1. **Locality & UID:** Keep Subject-to-Verb distance **$\le 5\text{ words}$ ($n \le 1$ intervening discourse referent)** with **0 center-embedded clauses** (`Gibson 1998 P63`), pre-verbal constraint (`-51 ms`, `Levy 2008 P61`), and explicit *that/because/rằng* before high-surprisal clauses ($\chi^2=263.0$, `Jaeger 2010 P62`).<br>2. **Mental Accounting, PAD & Zero-Price:** **Integrate checkout fees** into one price, **segregate `$0 FREE` bonuses/silver linings** (`Thaler 1985 P65`; `Prelec 1998 P66`; `Shampanier 2007 P68`), and restrict **Pennies-a-Day framing to $\le \$2.50/\text{day}$ (`~50k VND/ngày`)**—above `$4/day` (`$1,400/yr`), daily framing **backfires ($1.00$ vs $2.88, p<.05$, `Gourville 1998 P67`)**.<br>3. **IOED, Curse of Knowledge & Spotlight Shield:** Unseat entrenched prospects by asking **how their mechanism works step-by-step** ($\eta^2=.448$, `Rozenblit & Keil 2002 P71`); add **Private Sandbox by Default** microcopy to neutralize **`2×–6×` Spotlight anxiety** (`Gilovich 2000 P74`); never cite the Dunning-Kruger quartile artefact ($R^2_{\text{quad}}\approx .00$, `Gignac & Zajenkowski 2020 P72`). | `P61–P63`, `P65–P74` |
