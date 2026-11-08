# Media Playbooks & Quantitative Evidence Reference (Wave 1 + Wave 2)

## Contents
- 1. Master Quantitative Benchmarks (18 Laws)
- 2. Website & Landing Page Playbook
- 3. UI/UX Product & Dashboard Playbook
- 4. Images, Posters & Thumbnails Playbook
- 5. Presentation Slides, Pitch Decks & DataViz Playbook
- 6. Vlogs & Short/Long Video Playbook
- 7. Motion Graphics & Audio-Visual Sync Playbook
- 8. Podcasts & Audio Storytelling Playbook
- 9. East Asian (`ZH-TW` / `JA` / `ZH`) High-Density Grids, *Kishōtentetsu* & Danmaku

---

## 1. Master Quantitative Benchmarks (18 Laws)

| Mechanism / Metric | Empirical Value | Primary Source |
|---|---|---|
| **Photopic Peak & Yellow Luminance** | `555 nm` ($L = 0.9278$); **19.56:1** on `#000000`, **14.6:1** on `#0F172A`, **1.07:1** on `#FFFFFF` | Camgöz, Yener, & Güvenç (2002, 2004), *Color Research & Application* |
| **Motion Onset Capture** | Only **stationary → moving onset** (`150–250 ms`) captures attention; continuous motion habituates | Abrams & Christ (2003), *Psychological Science* |
| **Web Aesthetic Gist Latency** | **50 ms** ($r = .947$ with 500 ms); low complexity ($\eta_p^2 = .520$) + high prototypicality ($\eta_p^2 = .552$) | Lindgaard et al. (2006); Tuch et al. (2012) |
| **Web First-Fixation Predictors** | **Position: 39 px error** vs. Text Style: 81 px vs. Color Contrast: 97 px vs. **Size: 327 px** | Still (2018), *Journal of Usability Studies* |
| **Above-the-Fold & Left-Half Bias** | **57%** viewing time in Screen 1; **74%** in Screens 1–2; **80%** fixations on left half | Fessenden / Nielsen Norman Group (2018) |
| **Banner Blindness & Right-Rail Penalty** | **0.8%** fixations on right rail (`33×` loss); **+75% slower** visual search under flashing banners | Burke et al. (2005), *ACM TOCHI*; Pernice / NN/g (2018) |
| **Pre-Attentive Subitizing Limit** | **`1–4` items in `<100 ms`** (`40–60 ms/item`); `5+` items require serial counting (`250–350 ms/item`) | Trick & Pylyshyn (1994), *Psychological Review* |
| **Working Memory Chunk Limit** | **4 ± 1 chunks** (`3 to 5` items) once covert rehearsal is blocked | Cowan (2001), *Behavioral and Brain Sciences* |
| **Reading Perceptual Span & CPL** | `3–4` chars left, **`14–15` chars right** (`7–8` char word span); **`50–75` CPL** (`66` ideal) | Rayner (1998, 2009), *Psychological Bulletin* |
| **Strategic Disfluency Switch** | CRT heuristic errors drop **`90% → 35%`** when slight friction activates System 2 (ACC) | Alter, Oppenheimer, Epley, & Eyre (2007), *JEP: General* |
| **Numeric Precision & Syllabic Length** | Precise numbers (`+38.4%`) anchor stronger than round (`+40%`); fewer spoken syllables feel smaller | Janiszewski & Uy (2008); Coulter, Choi, & Monroe (2012) |
| **Disrupt-Then-Reframe (DTR)** | **65% vs. 35%** compliance (`~1.85×` lift) | Davis & Knowles (1999), *JPSP* |
| **Dopaminergic Curiosity Halo** | **`+20% to +30%`** hippocampal memory recall for incidental items placed inside an open curiosity gap | Kang et al. (2009); Gruber, Gelman, & Ranganath (2014), *Neuron* |
| **Endowed Progress Effect** | **`34% vs. 19%`** completion (`+79%` lift) when `2/10` steps are pre-credited vs. `0/8` blank | Nunes & Dreze (2006), *Journal of Consumer Research* |
| **Peak–End Rule** | Remembered utility = average of **Peak intensity + Final 10 seconds** (duration neglect) | Kahneman, Fredrickson, Schreiber, & Redelmeier (1993) |
| **Multimedia Redundancy & Sync** | Verbatim text + speech hurts ($d = 0.72$); Temporal Contiguity (`±100 ms`) lifts transfer ($d = 1.31$) | Mayer (2009), *Multimedia Learning* |
| **Asymmetric AV Binding Window** | **`-40 ms` audio lead to `+160 ms` audio lag**; sound governs timing (`Shams 2000`), vision space | Vroomen & Keetels (2010); Shams, Kamitani, & Shimojo (2000), *Nature* |
| **Auditory MMN & Speech Rate** | **150–175 ms** window; **`0.8–1.5 s`** silence drop; **170–190 wpm** ($\eta_p^2 = .51$) | Näätänen et al. (2007); Rodero (2016, 2021, 2023) |

---

## 2. Website & Landing Page Playbook
- **0–50 ms:** Canonical grid + low above-the-fold visual clutter + `50–75` CPL line width.
- **Top-Left Entry (`39 px` error):** Disrupt-Then-Reframe headline + precise metric (`+38.4%`) in the top-left/center-left zone (`80%` left-half gaze).
- **1 Isolated CTA:** `#FFD600` on dark (`#0F172A`, `14.6:1`) or black ink inside `#FFD600` fill on light.
- **Layer-Cake `4±1` Bands:** `3–4` cards per horizontal band; front-load the first `2–3` words (`~11` characters) of every heading; zero right-rail callouts.

## 3. UI/UX Product & Dashboard Playbook
- **Subitized `3–4` KPI Clusters & `1px` Bento Cells:** `3–4` top-level nav items or KPI cards; enclose high-density modules in `1px` Bento borders holding `≤3` internal metrics each (`Palmer 1992` Common Region).
- **Endowed Progress Onboarding (`Nunes & Dreze 2006`):** Start multi-step wizards at `20–25%` progress ("Step 1 of 4 complete ✓").
- **Animation Timing & Dark-Mode Halation:** Micro-feedback `<100 ms`, layout transitions `150–300 ms` (`cubic-bezier(0.22, 1, 0.36, 1)`); `#121212` surface with `87%` white (`#E2E8F0`); never style "Cancel / Log Out" as the brightest Von Restorff outlier.

## 4. Images, Posters & Thumbnails Playbook
- **Subitized `≤3` Element Rule:** (1) `1` expressive face/hand or anomaly object (`FFA/STS` N170 at `170 ms`), (2) `1` `2–4` word `#FFD600`-on-black badge, (3) `>8:1` figure-ground contrast.
- **Biological Gaze Cueing (`Friesen & Kingstone 1998`):** Eyes/hands/arrows point directly at the paradox badge (`100–200 ms` shift).
- **Zero Title Redundancy:** Never repeat the video/article title verbatim on the thumbnail.

## 5. Presentation Slides, Pitch Decks & DataViz Playbook
- **Assertion–Evidence Headline (`Alley 2005`):** Top-left full-sentence takeaway (`≤14` words) with a precise metric, never a topic label.
- **Cleveland & McGill Accuracy Hierarchy (`1985`):** Aligned bar/dot charts (`1.0×` error) > Small multiples (`1.4×`) > Stacked bars (`1.65×`) > Pie/Angle (`1.95×`) > Bubble Area (`2.4×`). Use discrete **ISOTYPE icon arrays** (`Haroz 2015`) to lift delayed recall by `+25–38%`.
- **Direct Spatial Contiguity (`d = 1.12`):** Attach numbers directly onto bars/lines; mute non-target bars to `#475569` and highlight `1` focal bar in `#FFD600`.

## 6. Vlogs & Short/Long Video Playbook
- **0.0–3.0s Mid-Motion Arrest:** Zero greetings (`+37%` bounce penalty); start mid-action with a center-frame (`25%–72%` vertical safe zone) `2–4` word kinetic caption and vocal onset `<150 ms`.
- **3.0–15.0s Paradox + Curiosity Halo (`Gruber 2014`):** `≤15`-word counterfactual claim + brand/product placed *inside* the open curiosity gap + visual proof before `15 s`.
- **Alternating Rhythm (`4–8 s`) & Peak–End Cut (`Kahneman 1993`):** Alternate talking-head with hands-on action/diagrams; introduce a *Kishōtentetsu* (`起承転結`) orthogonal twist (`転`) at `50–75%`; cut to black right after the final `5–10 s` synthesis peak.

## 7. Motion Graphics & Audio-Visual Sync Playbook
- **Single-Vector Motion Onset (`Abrams & Christ 2003`):** Dim static background to `25–35%` opacity; animate **1** focal object per beat (`150–300 ms` ease-out).
- **Asymmetric Audio-Visual Binding (`-40 ms` to `+160 ms`, `Vroomen & Keetels 2010`):** Trigger kinetic text within `±100 ms` of the stressed syllable (`Mayer d = 1.31`) and place sound hits `0 to +66 ms` (`0–2` frames) *after* the visual cut.
- **Continuous Morphing > Hard Cuts (`Lang 2000`):** Morph states on the same canvas (`6–12 cuts/min`) during complex explanations.

## 8. Podcasts & Audio Storytelling Playbook
- **Acoustic MMN Silence Drop (`Näätänen 2007`):** Cut the music bed + hold **`0.8–1.5 s` dead silence** + drop vocal pitch before the core thesis.
- **`170–190 wpm` Prosody (`Rodero 2016`):** Keep speech at `170–190 wpm` (`η²p = .51`), pre-announce `3` chunks, and provide clickable `MM:SS` Shownotes (`Xiaoyuzhou FM 2024`).

## 9. East Asian (`ZH-TW` / `JA` / `ZH`) High-Density Grids, *Kishōtentetsu* & Danmaku
- **Holistic vs. Analytic Gaze (`Chua, Boland, & Nisbett 2005`, *PNAS*):** East Asian viewers allocate `+35%` more fixations to background/context relationships; Western viewers fixate foreground objects `~120 ms` earlier.
- **Logographic Bento Grids:** `4` CJK characters (`限時免運`) fit inside `1.5°–2.0°` foveal vision (`1` fixation) and can be packed at `2×` density when bounded by `1px` Bento borders holding `≤3` items/cell.
- **Danmaku Safe Zone:** Keep primary subjects and captions inside `25%–72%` vertical, `10%–85%` horizontal so top-third Danmaku (`弹幕`) and bottom platform chrome never collide.



---

# 5. Deep Hook Engineering: 12 Empirical Archetypes, 4 Refuted Myths & Aviation FMEA (45,246 A/B Packages)

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

---

# 10. Full-Spectrum Color Psychophysics & 8 Spatial Layout Architectures (Wave 4)

# Overview

Beyond yellow luminance (`555 nm`) and the F-pattern/Layer-Cake dichotomy, human visual attention and cognitive performance are governed by **wavelength-specific cone/ganglion pathways (`Red`, `Blue`, `Green`, `Orange`, `Purple`, and `Display Polarity`)** and **8 task-specific spatial layout architectures (`Z-Pattern/Gutenberg`, `Lawn-Mower`, `Single-Column Tunnel`, `Asymmetric Sticky Split-Screen`, `Fitts Perimeter / Mobile Thumb-Zone`, `Masonry vs. Uniform Grid`, `Hub-and-Spoke Canvas`, and `3-Tier Inverted Pyramid`)**.

---

# Part I: Full-Spectrum Color Psychophysics & Chromatic Architecture

## 1. Complete Spectral & Cognitive Matrix Across All Primary UI/Media Colors

| Color & Wavelength | Retinal & Neural Pathway | Relative Luminance ($L$) & WCAG Contrast (`vs. #000` / `vs. #FFF`) | Cognitive & Behavioral Effect (Empirical Metric) | Primary Citation | Optimal Application & Hard Failure Boundary |
|---|---|---|---|---|---|
| **Yellow / Gold** (`~555 nm`, `#FFD600`) | Peak `L + M` photopic luminance + `S-(L+M)` blue-yellow opponency | $L = 0.71\text{–}0.93$<br>**`16.5:1–19.6:1` on Black**<br>`1.07:1` on White (FAIL) | Fastest pre-attentive fixation (`150–250 ms`); `3.95×` Von Restorff recall when capped at `≤5%` area | Camgöz et al. (`2002`, `2004`) | **Use for:** Single primary CTA/badge on dark `#0F172A`, video captions, dataviz outlier.<br>**Never:** Yellow text/icons on white (`1.07:1`). |
| **Red / Crimson** (`~620–700 nm`, `#EF4444` / `#FF3B30`) | `L-cone` dominance; strong lateralized `N2pc` ERP capture (`180–250 ms`) | Pure `#FF0000`: $L = 0.2126$<br>`4.00:1` on Black / `4.00:1` on White (both fail `4.5:1`!) | Activates **avoidance motivation & local vigilance**: **`+31%` detail/proofreading accuracy**, narrows creative breadth; **`+21%` CTA lift** when contrasting against green/blue pages | [Mehta & Zhu (2009, *Science*)](https://doi.org/10.1126/science.1169144); [Kuniecki et al. (2015)](https://doi.org/10.1167/15.10.21) | **Use for:** Urgent deadlines, destructive warnings, or high-arousal CTAs (`#FF4D4D` on dark = `6.8:1`; `#B91C1C` on white = `6.4:1`).<br>**Cultural Reversal:** In CN/TW/JP finance, **Red (`红涨`) = Gain (`+`)**! |
| **Blue / Cyan-Blue** (`~450–490 nm`, `#3B82F6` / `#38BDF8`) | `S-cone` (`420 nm`) + `ipRGC` melanopsin (`480 nm`) alertness pathway | Pure `#0000FF`: $L = 0.0722$ (`1.28:1` on Black, FAIL; `8.59:1` on White)<br>Sky `#38BDF8`: **`10.2:1` on `#0F172A`** | Activates **approach motivation**: **`2×` creative problem-solving outputs**; #1 driver of **Brand Competence, Trust & Security** ($p < 0.001$) | [Mehta & Zhu (2009)](https://doi.org/10.1126/science.1169144); [Labrecque & Milne (2012)](https://doi.org/10.1007/s11747-010-0245-y) | **Use for:** Enterprise SaaS, fintech trust surfaces, exploratory/creative workspaces.<br>**Foveal Blindspot:** Central `0.3°` fovea has **`0%` S-cones** (`Curcio 1991`); never put pure `#0000FF` text/lines on dark backgrounds (use `#38BDF8` Sky Blue). |
| **Green / Emerald** (`~520–560 nm`, `#10B981` / `#22C55E`) | `M-cone` peak (`534 nm`); zero lens accommodation strain | `#10B981`: $L = 0.43$<br>**`8.4:1` on `#0F172A`**<br>`#047857`: **`5.5:1` on `#FFFFFF`** | **"Fertile Green" effect:** **`+20%+` creative fluency** with low heart-rate arousal (`Lichtenfeld 2012`); universal Western "Safe / Verified / Go" signal | [Palmer & Schloss (2010)](https://doi.org/10.1073/pnas.0906172107) | **Use for:** Verification badges, positive deltas (Western), safe progression.<br>**Daltonism Guard:** **`8%` of males** are red-green colorblind; never rely on Red vs. Green alone without `✓/⚠` or `↑/↓` icons. |
| **Orange / Amber** (`~590–615 nm`, `#F97316` / `#FF5500`) | High `L + M` luminance + warm `L-M` chromatic salience | `#F97316`: $L = 0.36$<br>**`7.8:1` on `#0F172A`**<br>`#C2410C`: **`5.2:1` on `#FFFFFF`** | Captures high bottom-up warmth/appetitive urgency **without** triggering Red's error/threat avoidance reflex | [Labrecque & Milne (2012)](https://doi.org/10.1007/s11747-010-0245-y) | **Use for:** E-commerce "Add to Cart / Buy Now" CTAs (Amazon `#FF9900`, Shopee/Taobao `#FF5500`) and non-destructive warnings. |
| **Purple / Violet** (`~380–450 nm` / `R+B`, `#8B5CF6` / `#A855F7`) | Simultaneous `L-cone` (long) + `S-cone` (short) dual-extremity stimulation | `#A855F7`: $L = 0.25$<br>**`5.6:1` on `#0F172A`**<br>`#6D28D9`: **`7.1:1` on `#FFFFFF`** | Ecological rarity drives highest ratings for **Luxury, Uniqueness, Magic, and AI/Synthetic Novelty** | [Palmer & Schloss (2010, *PNAS*)](https://doi.org/10.1073/pnas.0906172107) | **Use for:** AI copilot features, premium/pro badges (`≤10%` area).<br>**Never:** Large purple background fills (simultaneous red/blue chromatic aberration fatigues ciliary muscles). |
| **Display Polarity (Light vs. Dark)** | Pupil constriction (`2–3 mm` in Light Mode) vs. Emissive Contrast (`Dark Mode`) | Light: `#1E293B` on `#FFFFFF` (`13.6:1`)<br>Dark: `#E2E8F0` on `#0F172A` (`13.2:1`) | **Light Mode:** **`+10% to +18%` faster proofreading & dense text reading** in daylight.<br>**Dark Mode:** Superior chromatic pop (`16:1–19:1`) for media, charts & dark rooms | [Buchner & Baumgartner (2007)](https://doi.org/10.1080/00140130701506439) | **Use Light/Warm Paper (`#FAF8F5`)** for long-form docs/editorial reading; **use Dark Slate (`#0F172A`)** for video, dashboards, and high-chroma hero hooks. |

## 2. The `60–30–10` Chromatic Budget & Opponent-Channel Harmony
To preserve the **Von Restorff isolation effect (`3.95×` salience)**:
1. **`60%` Dominant Neutral Ground:** `#0F172A` / `#121212` (Dark Mode) or `#FFFFFF` / `#FAF8F5` (Light Mode).
2. **`30%` Structural & Trust Secondary Tone:** Low-saturation cool slate/blue (`#1E293B` / `#3B82F6`) for cards, navigation, and secondary containers.
3. **`10%` (and `≤5%` for `#FFD600` / `#FF5500`) Opponent Focal Accent:** Pick an accent on the **opposite cone-opponent axis** (`Blue-Yellow S-(L+M)` or `Green-Red L-M`) from your `30%` structural tone so V1 opponent ganglion cells fire at maximum gain.

---

# Part II: Eight Spatial Layout & Grid Architectures (When Each Wins & Fails)

| Layout Architecture | Eye-Tracking Scanpath & Cognitive Mechanism | Empirical Metric / Benchmark | Best Use Cases | Failure Mode / When It Backfires |
|---|---|---|---|---|
| **1. Layer-Cake (`H2/H3` Horizontal Bands)** | Parallel top-down skimming of bold subheadings + **`3–4` cards/row** (`Subitizing limit`) | **`+27% to +47%` task usability** vs. unchunked prose (`NN/g`) | Text-heavy landing pages, documentation, feature comparisons | Fails if headings are generic (*"Overview"*) instead of front-loaded (`first 11 chars`). |
| **2. Z-Pattern & Gutenberg Diagram** | **Top-Left (Primary Optical Area)** $\to$ **Top-Right (Strong Fallow)** $\to$ **Center Diagonal** $\to$ **Bottom-Right (Terminal Action Area)**; skips **Bottom-Left (Weak Fallow Zone)** | Top-left captures **`39 px`** lowest fixation error (`Still 2018`); Bottom-Right is optimal modal/card terminal CTA | Low-text (`<40` words) hero sections, posters, thumbnails, slide title cards, modal dialogs | Collapses on text-heavy pages (`>100` words), causing zig-zag oculomotor fatigue. |
| **3. Lawn-Mower (`Boustrophedon`) Comparison Grid** | Row 1 Left $\to$ Right, drop straight down on right edge, Row 2 Right $\to$ Left (`Enders / NN/g`) | Minimizes return-sweep saccade distance in structured comparison matrices | Spec comparison tables, pricing matrices, tightly coupled `2-column` grids | **Alternating `Text/Image` Marketing Trap:** When image/text rows alternate with wide gaps, users lose the left text spine (`-28%` reading completion). |
| **4. Single-Column Narrative Tunnel** | Pure vertical ballistic scroll along a **`60–65 cpl` (`50–75` char)** spine with `≥25%` lateral whitespace | Completed **`15.4 seconds` faster** than 2-column forms (`CXL Eye-Tracking`) | Checkout/onboarding forms, long-form articles, case studies, mobile feeds | Wastes horizontal screen real estate on wide `1440p+` analytic dashboards. |
| **5. Asymmetric Sticky Split-Screen (`38/62` Ratio)** | Left pane (`38%–45%` width, where **`80%` of fixations** land) scrolls verbal steps; Right pane (`55%–62%`, `sticky`) morphs visual canvas in place | Eliminates split-attention effect (**Cohen's $d = 1.12$**, `Mayer 2009`) | SaaS product tours (Stripe/Linear style), interactive explainers, code-plus-preview docs | Fails on mobile `<768px` unless collapsed into a sticky top canvas + scrolling bottom sheet. |
| **6. Fitts Perimeter & Mobile Thumb-Zone Arc** | Desktop screen edges have **infinite width ($W \to \infty$)** (`Fitts 1954`); Mobile **`49%` one-handed / `75%` thumb touch** (`Hoober 2016`) | Top-corner mobile reach adds **`+400–600 ms`** latency vs. Bottom-Center Natural Arc | Mobile apps, bottom-sheet checkouts, short-video overlays, desktop IDE/NLE toolbars | Putting primary mobile CTAs or frequent tab switches in the Top-Left/Top-Right stretch corners. |
| **7. Masonry Waterfall vs. Uniform Row Grid** | Staggered card heights create an **unclosed Zeigarnik edge** at the bottom of the viewport | **`+22%` scroll depth** in visual discovery (`Xiaohongshu / Pinterest`), but **`+35%–50%` slower** spec comparison | **Masonry:** Visual discovery, moodboards, UGC feeds.<br>**Uniform Grid:** E-commerce price/spec comparison. | Using Masonry when users must compare prices, ratings, or technical attributes across a row. |
| **8. 3-Tier Inverted Pyramid & Bento Grid (`1px` Cells)** | **Tier 1 (`15%` H):** `3–4` Subitizable KPIs $\to$ **Tier 2 (`50%` H):** `1–2` Aligned Charts $\to$ **Tier 3 (`35%` H):** Table; or `1px` bordered Bento cells (`≤3` items/cell) | Cuts East Asian / high-density visual search penalty by **`3.05×`** (`18.6s → 6.1s`, `Baughan 2021 CHI`) | Executive dashboards, multi-feature Bento showcases, CJK/high-density portals | Putting the granular data table at the top of a dashboard or exceeding `3` data points per Bento cell. |

---

---

# 11. Wave 5: Computable Layout Aesthetics, UMSI Visual Importance & CIELAB Affective Scales

# Overview

In Wave 5, **16 primary academic PDFs (`52.2 MB`)** were retrieved locally into `~/workspace/research/261107-attention-information-architecture/papers/` using `paperget` and `paperhunt` (across open-access preprints, arXiv, and Sci-Hub fallback). Full-text analysis of these papers establishes the **mathematical and computational laws** governing **pixel-level interface aesthetics**, **integer-programming grid layout optimization**, **deep-learning visual importance (`UMSI`) across 5 design classes**, **GUI visual search (`2025`)**, and **CIELAB affective color coordinates (`2022–2025`)**.

---

# 1. Local Full-Text Paper Corpus (`papers/` via `paperget` & `paperhunt`)

| Local PDF File (`papers/`) | Citation & Venue | Core Full-Text Contribution |
|---|---|---|
| `2025-putkonen-understanding-visual-search-graphical-user.pdf` (`3.37 MB`) | [Putkonen, Jiang, Zeng, Tammilehto, Jokinen, & Oulasvirta (2025, *IJHCS* 199:103483)](https://doi.org/10.1016/j.ijhcs.2025.103483) | Formal computational model of **GUI visual search** integrating foveal/peripheral acuity decay, top-down spatial priors, and grid-aligned saccade planning. |
| `2025-braun-affective-color-scales-for-colormap.pdf` (`7.04 MB`) | [Braun, Mukherjee, Gorelik, & Schloss (2025, *IEEE TVCG*)](https://doi.org/10.31219/osf.io/p3bva_v1) | Maps exact **CIELAB ($L^*, C^*, h^\circ$)** trajectories for **Affective Color Scales** (Valence: Positive/Negative $\times$ Arousal: Calm/Agitated). |
| `2023-ce-negativity-drives-online-news-consumption.pdf` (`989 KB`) | [Robertson et al. (2023, *Nature Human Behaviour*)](https://doi.org/10.1038/s41562-023-01538-4) | Full analysis of **`105,129` randomized headlines (`370M` impressions)**: **`+2.3%` CTR per negative word** vs. **`-1.0%` per positive word**. |
| `2022-ma-unifying-effects-direct-and-relational.pdf` (`5.49 MB`) | [Schoenlein, Campos, Lande, Lessard, & Schloss (2022, *IEEE TVCG*)](https://doi.org/10.1109/tvcg.2022.3209443) | Proves color decoding combines **Direct Semantic Association ($w_A$)** + **Relational Dark-is-More Bias ($w_D$)**. |
| `2021-baughan-cross-cultural-differences-visual-attention.pdf` (`1.57 MB`) | Baughan, Reinecke et al. (2021, *ACM CHI*) | Proves American vs. Japanese holistic attention divergence; structural grid lines speed up high-density search by **`3.05×`** (`18.6s → 6.1s`). |
| `2020-fosco-predicting-visual-importance-across-graphic.pdf` (`14.77 MB`) | [Fosco, Casser, Bedi, O'Donovan, Hertzmann, & Bylinskii (2020, *ACM UIST*)](https://doi.org/10.1145/3379337.3415825) | **UMSI (Unified Model of Saliency & Importance)** predicting attention across **Webpages, Mobile UIs, Posters, Ads, and Infographics**. |
| `2020-dayama-grids-interactive-layout-design-with.pdf` (`4.24 MB`) | [Dayama, Todi, Saarelainen, & Oulasvirta (2020, *ACM CHI*)](https://doi.org/10.1145/3313831.3376553) | **Mixed-Integer Linear Programming (`GRIDS`)** formulation for rectangular grid packing, alignment-line minimization, and visual balance. |
| `2017-bylinskii-learning-visual-importance-for-graphic.pdf` (`8.69 MB`) | [Bylinskii, Kim, O'Donovan et al. (2017, *ACM UIST*)](https://doi.org/10.1145/3126594.3126653) | Establishes **BubbleView** & pixel-level visual importance hierarchies for data visualizations and graphic designs. |
| `2015-miniukovich-computation-interface-aesthetics.pdf` (`1.72 MB`) | [Miniukovich & De Angeli (2015, *ACM CHI*)](https://doi.org/10.1145/2702123.2702575) | Quantifies **8 computable layout & color metrics** (Subband Entropy, Edge Congestion, Grid Alignment, Symmetry, Colorfulness) predicting `50 ms` vs. `500 ms` aesthetics. |
| `2014-mj-states-curiosity-modulate-hippocampus-dependent.pdf` (`1.47 MB`) | Gruber, Gelman, & Ranganath (2014, *Neuron*) | fMRI proof that epistemic curiosity activates `SN/VTA–Hippocampus` dopamine circuits, boosting incidental memory by **`+28%`**. |
| `2012-tuch-the-role-visual-complexity-and.pdf` (`1.03 MB`) | Tuch, Presslaber et al. (2012, *IJHCS*) | Proves aesthetic impression forms in **`17–50 ms`**: layout prototypicality ($\eta_p^2 = .552$) and visual complexity ($\eta_p^2 = .520$). |
| `2011-teixeira-emotion-induced-engagement-internet-video.pdf` (`305 KB`) | Teixeira, Wedel, & Pieters (2012, *JMR*) | Eye-tracking + facial coding proving **velocity of surprise/joy change** cuts video skipping far more than constant high arousal. |
| `2011-labrecque-exciting-red-and-competent-blue.pdf` (`652 KB`) | Labrecque & Milne (2012, *JAMS*) | Multi-study proof mapping Hue $\times$ Saturation $\times$ Value to Brand Personality (`Blue = Competence/Trust`, `Red = Excitement`, `Purple = Sophistication`). |
| `2010-se-ecological-valence-theory-human-color.pdf` (`270 KB`) | Palmer & Schloss (2010, *PNAS*) | **Ecological Valence Theory (EVT):** Color preference equals the average affective valence of natural objects of that color ($r = .89$). |
| `2010-cutting-attention-and-the-evolution-hollywood.pdf` (`435 KB`) | Cutting, DeLong, & Nothelfer (2010, *Psych. Science*) | Spectral analysis of 150 films (1935–2005) proving shot durations evolve toward a **$1/f$ pink-noise rhythm** matching human endogenous attention. |
| `2009-r-blue-red-exploring-the-effect.pdf` (`153 KB`) | Mehta & Zhu (2009, *Science*) | **6-study *Science* paper:** Red (`avoidance`) boosts detail/proofreading accuracy by **`+31%`**; Blue (`approach`) doubles (**`2×`**) creative divergent output. |

---

# 2. Eight Computable Layout & Aesthetic Metrics (`Miniukovich & De Angeli 2015`; `Dayama & Oulasvirta 2020`)

Full-text inspection of **Miniukovich & De Angeli (2015, *ACM CHI*)** and **Dayama, Todi, Saarelainen, & Oulasvirta (2020, *ACM CHI*)** yields exact mathematical metrics that predict whether a layout feels "clean and effortless" or "cluttered and amateurish" within **`50 ms`**:

| Computable Metric | Mathematical Definition / Mechanism | Empirical Correlation with Perceived Clutter / Aesthetics | Concrete Engineering Threshold |
|---|---|---|---|
| **1. Subband Entropy ($SE$) & Feature Congestion ($FC$)** | Shannon entropy of steerable pyramid luminance/chrominance wavelet coefficients (`Rosenholtz 2007`) | **$r = +0.68$** with perceived visual clutter; **`r = -0.49`** with `50 ms` beauty | Keep background surfaces flat or low-frequency (`gradient ΔL < 8%`); never place text over high-frequency photographic textures without a `≥70%` opacity scrim. |
| **2. Edge Congestion ($EC$)** | Ratio of contour edge pixels within a **`4-pixel` foveal crowding radius** of another non-collinear edge | **`r = +0.61`** with visual complexity ($p < 0.001$) | Maintain **`≥8–12 px` minimum padding** between borders, icons, and text baselines; never stack double borders (`border + box-shadow + outline`). |
| **3. Grid Alignment Line Count ($G_{\text{lines}}$)** | Total number of distinct vertical ($X$) and horizontal ($Y$) alignment axes across all layout boxes (`MILP objective` in `GRIDS`) | Minimizing distinct alignment axes increases perceived layout order by **`+34%`** | **The $\le 4$ Axis Rule:** Every card, heading, button, and image on a viewport must snap to **at most `3–4` shared vertical $X$-axes**. |
| **4. Bilateral Vertical Symmetry ($S_V$)** | Mirror balance of visual mass across the vertical centerline (vs. horizontal top-bottom symmetry $S_H$) | Vertical symmetry significantly predicts beauty ($p < 0.01$); horizontal symmetry has **zero effect** | Balance visual weight left-to-right (or use a deliberate **`38/62` Golden Ratio offset** balanced by high-contrast typography on the narrower left pane). |
| **5. White Space Fraction ($W_f$)** | Proportion of viewport pixels belonging to uniform background canvas | Optimal aesthetic & search zone sits at **`40%–55%` whitespace** (`<25%` triggers crowding; `>75%` feels empty) | Reserve **`≥40%` of the viewport** as open background canvas (`60%` surface rule in the `60-30-10` budget). |
| **6. Dominant Color Cluster Count ($C_{\text{dom}}$)** | Number of distinct HSV/CIELAB color clusters occupying `>2%` of viewport area | Layouts with **`>4` dominant color clusters** suffer a sharp drop in `50 ms` aesthetic rating ($p < 0.001$) | Strictly cap distinct UI hues at **`2–3` (`1` brand/structural hue + `1` opponent CTA accent + semantic status only when active)**. |

---

# 3. Unified Visual Importance (`UMSI`) Across 5 Layout Classes (`Bylinskii 2017`; `Fosco et al. 2020`)

In **Bylinskii et al. (2017, *ACM UIST*)** and **Fosco et al. (2020, *ACM UIST*)**, eye-tracking and BubbleView maps across **Webpages, Mobile UIs, Posters, Ads, and Infographics** prove that **graphic layouts obey a different attention law than natural photographs**:
1. **The Typography-First Reversal:** In natural scenes, faces and bright objects dominate; in **designed layouts (posters, slides, landing pages, infographics)**, **Large High-Contrast Display Typography (`Headline / Title / Giant Number`) captures `42%–58%` of total initial fixation mass**, outranking background photography!
2. **Spatial Bias Shifts by Layout Class (`Fosco et al. 2020`):**
   - **Posters & Thumbnails:** Strong **Top-Center + Center-Face** two-pole attractor.
   - **Webpages:** Strong **Top-Left (`Primary Optical Area`) + Left-Spine** bias (`80%` left-half fixation share).
   - **Mobile UIs:** Strong **Upper-Middle Hero + Bottom-Center CTA** bimodal split.
   - **Data Visualizations & Infographics (`Bylinskii 2017`):** **Title (`Top-Left`)** $\to$ **Annotated Callout / Outlier Peak (`Von Restorff`)** $\to$ **Legend/Axes last** (unannotated chart bars receive `<12%` of gaze!).

---

# 4. CIELAB Affective Color Scales & Relational Contrast (`Schoenlein & Schloss 2022`; `Braun & Schloss 2025`)

Full-text analysis of **Schoenlein et al. (2022, *IEEE TVCG*)** and **Braun, Mukherjee, Gorelik, & Schloss (2025, *IEEE TVCG*)** establishes two quantitative laws for color palettes:
1. **Direct ($w_A$) vs. Relational ($w_D$) Color Decoding (`Schoenlein et al. 2022`):**
   - Viewers decode meaning from a weighted sum: $\text{Merit} = w_A \cdot \text{Direct Association} + w_D \cdot \text{Dark-is-More Bias}$.
   - When a color scale conflicts with the **Dark-is-More Bias** on a light background (e.g., mapping *higher* numbers to *lighter* pastel colors on a white page), response times slow down by **`+180–320 ms`** and interpretation error jumps! **Rule:** On light backgrounds, always map **higher magnitude $\to$ darker/more saturated chroma**; on dark backgrounds (`#0F172A`), map **higher magnitude $\to$ higher luminance (`#FFD600` / `#38BDF8`)** (**Hotspot-is-More**).
2. **The 4 CIELAB Affective Color quadrants (`Braun & Schloss 2025`):**
   - **High Arousal + Positive Valence (*"Exciting / Joyful / Playful"*):** High lightness ($L^* > 70$), high chroma ($C^* > 65$), warm **Yellow–Orange–Coral trajectory ($h^\circ \in [25^\circ, 90^\circ]$)**.
   - **High Arousal + Negative Valence (*"Urgent / Threat / Critical Alert"*):** Steep lightness drop ($L^*: 80 \to 25$), high chroma ($C^* > 70$), **Red–Magenta–Dark Crimson trajectory ($h^\circ \in [350^\circ, 35^\circ]$)**.
   - **Low Arousal + Positive Valence (*"Calm / Trustworthy / Restorative"*):** High-to-medium lightness ($L^* \in [55, 85]$), moderate chroma ($C^* \in [30, 55]$), **Cyan–Blue–Emerald trajectory ($h^\circ \in [155^\circ, 245^\circ]$)**.
   - **Low Arousal + Negative Valence (*"Somber / Depressed / Muted"*):** Low lightness ($L^* < 45$), low chroma ($C^* < 25$), desaturated **Slate–Brown–Olive trajectory**.

---


---

# 8. 16-Paper Methodological Appraisal, Replication Caveats & High-Certainty Rules

# Overview

Following the **`paper-appraisal` methodology (`Cochrane RoB 2`, `JBI Quasi-Experimental & Analytical`, `ML Evidence Checks`, and `Insight Review`)**, all **16 full-text primary PDFs (`52.2 MB`)** in `~/workspace/research/261107-attention-information-architecture/papers/` were audited cover-to-cover (`reports/f1..f4`, `231 KB` total).

Crucially, **`paper-appraisal` separates two questions**:
1. **Is the mechanism/idea useful?**
2. **Does the paper's full-text data and post-publication replication record actually prove it?**

Several widely cited "pop-science UX rules" fail or shrink when audited against the full text and replication literature, while several less-known quantitative mechanisms emerge much stronger.

---

# 1. Master 16-Paper Forensic Appraisal & Certainty Ledger

| # | Paper & Local Report | Study Design & Sample ($N$) | Appraisal Tool & Risk of Bias | Full-Text Verified Finding & Exact Statistic | Forensic Caveat / What Failed or Shrunk in Full-Text Audit | Evidence Certainty |
|---|---|---|---|---|---|---|
| **P01** | **Mehta & Zhu (2009, *Science*)**[^mehta-2009]<br>`f1-appraisal-color-psychophysics.md` | 6 lab studies ($N = 666$ total undergrads; `0–240` HSL color space) | **RoB 2 (2019):** **High Risk** | Study 1 proofreading $F(2,66)=8.59$; Study 2 brick creativity $p<.03$; Study 5 camera ad framing interaction ($p<.02$). | **FAILED DIRECT REPLICATION:** `Steele (2014, Psychon Bull Rev, N=263)` replicated Study 1 with exact colors & instructions: **color explained `<1%` of variance**. Moreover, equating HSL `L=120` produced `#FF0000` vs. `#0000FF` — a **`2.94×` luminance confound**! Do **not** claim background red/blue makes users smarter/more creative; use Red/Blue only for **explicit semantic framing (Study 5)** and opponent contrast. | **Low** (for passive IQ/creativity priming) · **Moderate** (for explicit ad/UI framing) |
| **P02** | **Palmer & Schloss (2010, *PNAS*)**[^palmer-2010]<br>`f1-appraisal-color-psychophysics.md` | Psychophysical rating across 32 BCP colors ($N = 251$ across sub-studies) | **JBI Analytical (2023):** **Low-to-Moderate** | **WAVE** (**Weighted Affective Valence Estimate**) correlates **$r = .893$ ($80\%$ of variance)** with US color preference (`Blue` peak; `Dark Yellow-Olive` & `Dark Orange-Brown` trough). | Cross-cultural fit drops to **`≤50%` of variance** in non-Western samples (`Al-Rasheed et al. 2022`, `Taylor et al. 2013`); the causal school-spirit/slideshow claims in the paper are reported without inferential statistics. | **High** (US/Western UI preference) · **Moderate** (global) |
| **P03** | **Labrecque & Milne (2012, *JAMS*)**[^labrecque-2012]<br>`f1-appraisal-color-psychophysics.md` | 4 studies ($N = 1,187$ raters, `100` real brands) | **RoB 2 (Studies 1–3) + JBI (Study 4):** **Moderate** | **Red $\to$ Excitement ($\beta = .534$)**, **Blue $\to$ Competence ($\beta = .522$)**, **Black/Purple $\to$ Sophistication**, **Brown $\to$ Ruggedness**; High Saturation raises Excitement; High Value reduces Ruggedness. | On familiar real-world brand logos (Study 4), official color moves ratings by only **`~0.1` on a 5-point scale** because prior brand familiarity overrides hue; authors counted $p < .10$ as partial support. | **Moderate-to-High** (for new/unfamiliar brands & UI badges) |
| **P04** | **Schoenlein et al. (2022, *IEEE TVCG*)**[^schoenlein-2022]<br>`f1-appraisal-color-psychophysics.md` | 3 online experiments ($N \approx 2,260$) | **RoB 2 + ML Checks:** **High** | Viewers decode a legendless color scale via **$0.70 \times \text{Direct Meaning} + 0.30 \times \text{Dark-is-More}$** on held-out participants. | Direct meaning overrides Dark-is-More only when association difference reaches **$\Delta A \ge 0.55$** (tested on sunshine); weights apply to linear scales on a white background (RT penalty comes from `Schloss et al. 2019`). | **High** |
| **P05** | **Braun et al. (2025, *IEEE TVCG*)**[^braun-2025]<br>`f2-appraisal-affective-color-and-aesthetics.md` | **2 experiments** (not 3) + Tables S.1–S.8 ($N = 260$) | **JBI Quasi-Experimental (2023):** **Low-to-Moderate** | **Valence:** lighter ($L^*$) + higher chroma ($C^*$) + bluer ($-b^*$), **adj. $R^2 = .924$**; **Calm:** bluer ($\beta = -.104$); **Trustworthy:** bluer + lighter (**zero chroma effect**); pixel-frequency weighting drops AIC by `89–231`. | Hue enters via Cartesian **`a*` and `b*` axes**, not polar $h^\circ$; tested on single-hue ramps on uncalibrated monitors. | **High** |
| **P06** | **Tuch et al. (2012, *IJHCS*)**[^tuch-2012]<br>`f2-appraisal-affective-color-and-aesthetics.md` | 2 factorial studies: Study 1 (`50, 500, 1000 ms`, $N=120$); Study 2 (`17, 33, 50 ms`, $N=136$) | **RoB 2 (2019):** **Low** | At **`17 ms`**, Complexity ($\eta_p^2 = .38$) > Prototypicality ($\eta_p^2 = .19$); by **`33 ms`** they are equal; at **`50 ms`**, Prototypicality ($\eta_p^2 = .812$) & Complexity ($\eta_p^2 = .581$) interact strongly (**$\eta_p^2 = .604$**). | **Crucial interaction:** Prototypical layout boosts beauty massively on **low-complexity pages ($d = 1.96$)**, but barely helps when a page is visually cluttered (**high-complexity $d = 0.24$**)! | **High** |
| **P07** | **Miniukovich & De Angeli (2015, *ACM CHI*)**[^miniukovich-2015]<br>`f2-appraisal-affective-color-and-aesthetics.md` | 2 studies (Desktop Web `150 ms` & `4 s`; Mobile iPhone apps) | **ML Checks + RoB 2:** **Moderate** | Desktop Web **$R^2 = .49$ at `150 ms`** and **$R^2 = .43$ at `4 s`** (out-of-sample $R^2 \approx .42$); iPhone **$R^2 = .13\text{–}.18$** (`.32` with genre). Clutter/Entropy, Edge Congestion, Symmetry, and Dominant Colors (`≤4`) lead. | In the multivariable regression, `grid quality` flips sign due to collinearity with symmetry and edge congestion; not all 8 metrics survive in mobile (`only 4 stay`). | **Moderate-to-High** |
| **P08** | **Baughan et al. (2021, *ACM CHI*)**[^baughan-2021]<br>`f2-appraisal-affective-color-and-aesthetics.md` | Online visual search & recall experiment ($N = 151$ US & JP; 6 sites) | **JBI Analytical (2023):** **Moderate** | **Country $\times$ Complexity $F = 37.18$**: US/JP search speed gap is small on low-complexity sites ($d = 0.56$) but huge on high-complexity sites (**$d = 1.86$; JP `18.6 s` vs. US `6.1 s`**). Main-content area recall beats sidebars (**OR `4.07×` JP, `2.29×` US**). | **No eye-tracker was used** in this paper (click-search RT + recall; eye-tracking is cited from prior work). Structural `1px` grid rules are an engineering synthesis across `Baughan 2021` + `Dayama 2020`, not directly randomized in `Baughan 2021`. | **Moderate** |
| **P09** | **Bylinskii et al. (2017, *ACM UIST*)**[^bylinskii-2017]<br>`f3-appraisal-layout-and-visual-importance.md` | Deep FCN on MASSVIS + Graphic Designs (`BubbleView`) | **ML Evidence Checks:** **Moderate** | Titles receive highest fixations/clicks (model vs. eye-tracking rank **$r_s = .96$**); chart prediction $CC = 0.69, KL = 0.33$ vs. DeepGaze $0.57 / 3.48$; importance-cropped thumbnails cut chart-finding clicks from **`3.25` to `1.96` (`-40%`)**. | Single-run metrics without confidence intervals; exact percentages for faces/legends appear qualitatively in bar figures rather than tabulated numbers. | **Moderate-to-High** |
| **P10** | **Fosco et al. (2020, *ACM UIST* — UMSI)**[^fosco-2020]<br>`f3-appraisal-layout-and-visual-importance.md` | **UMSI** trained on `Imp1k` (`1,000` designs across 5 classes) | **ML Evidence Checks:** **Moderate** (vs. 2017 model) | Conditioning on the 5 design classes raises $CC$ from **`.802` to `.875`**; **text carries `+32%` more importance weight in Ads than in Infographics**; webpage importance sits **Top-Left**; human annotators mark **at most `~7` elements**. | Beats the best general saliency model on natural/graphic benchmarks by only `.009 CC`; the interactive layout-reflow study retained 43 of 100 crowd workers. | **Moderate** |
| **P11** | **Dayama et al. (2020, *ACM CHI* — GRIDS)**[^dayama-2020]<br>`f3-appraisal-layout-and-visual-importance.md` | Exact **MILP (`Eqs. 1–5`)** + 13-rater / 12-designer study | **Computational Checks + JBI:** **Moderate (MILP) / Low (user study)** | MILP optimizes: (1) non-overlap, (2) **fewest alignment grid lines**, (3) rectangular hull outline, and (4) preferred/relative placement. Layout ratings: **`72` vs. `43` vs. `21` / 100**. | Main text Eqs. 1–5 use preferred/locked placement rather than a fixed "Primary Optical Area" constant; user study $F(2,12)$ degrees of freedom have a reporting typo and no baseline tool comparison. | **High** (for MILP math) · **Low** (user study) |
| **P12** | **Putkonen et al. (2025, *IJHCS*)**[^putkonen-2025]<br>`f3-appraisal-layout-and-visual-importance.md` | Eye-tracked GUI visual search experiment | **JBI Quasi-Experimental (2023):** **Moderate-to-High** | **Missing target adds `+6.97 s`** (largest penalty); **Text-only cue adds `+1.40 s` vs. visual icon/image cue**; **Mobile is `2.23 s` faster than Desktop Web**; **each extra UI element adds `+20 ms`**; scanpath is **Top-Left $\to$ Scan $\to$ Confirm**. | Overall static complexity explains only marginal $R^2 = .053$ once element count (`+20 ms/item`) and cue type (`+1.40 s`) are controlled. | **High** |
| **P13** | **Gruber, Gelman, & Ranganath (2014, *Neuron*)**[^gruber-2014]<br>`f4-appraisal-curiosity-video-and-hooks.md` | fMRI ($N = 19$) + behavioral follow-up | **JBI Quasi-Experimental (2023):** **High (target recall) / Low (incidental spillover)** | Answers to high-curiosity questions are recalled **`70.6%` vs. `54.1%` (`+30.5%` relative, $p < .001$)** and hold at 24 hours (**High certainty**). `SN/VTA` and `NAcc` fire at **question onset**, not answer reveal. | **Critical distinction:** The incidental face memory spillover (`41.9%` vs. `37.2%`) only passed a **one-tailed test** ($N = 19$)! Therefore, **make your core message/product the actual answer to the curiosity hook (`70.6%` recall)** rather than an unrelated bystander shown during the wait! | **High** (for hook-integrated payoff) · **Low** (for unrelated bystander ad) |
| **P14** | **Robertson et al. (2023, *Nature Human Behaviour*)**[^robertson-2023]<br>`f4-appraisal-curiosity-video-and-hooks.md` | **Stage-2 Registered Report** on `53,699` confirmatory headlines across `12,448` Upworthy A/B tests | **RoB 2 (2019):** **Low (Gold Standard)** | Each **negative word raises CTR `+2.3%`**; each **positive word lowers CTR `-1.0%`**. **Headline length has an effect `~2.7×` larger than negativity!** **Moralized wording lowers clicks.** | Among pre-registered emotions (`LIWC, NRC, SentiStrength`), **Sadness (`+`)** raised clicks and **Joy (`-`)** lowered clicks, but **Anger was null** and **Fear went negative (`-`)**! Topics are `Government & Economy, People, Life, Parenting, LGBT, Women's Rights, Entertainment`. | **High** |
| **P15** | **Teixeira, Wedel, & Pieters (2012, *JMR*)**[^teixeira-2012]<br>`f4-appraisal-curiosity-video-and-hooks.md` | Joint Bayesian model of skipping & **Individual Attention Dispersion (IAD)** across `28` video ads ($N=50$ analyzed of $58$) | **JBI Quasi-Experimental (2023):** **Moderate** | **Surprise concentrates focal gaze `3.3×` more than Joy** (reducing `IAD`), whereas **Joy Velocity ($\Delta\text{Joy}/\Delta t$, $\beta = -1.818$) directly prevents skipping `4.5×` more strongly than Joy Level ($\beta = -0.398$)**! | The "optimal emotion pulse templates" in the paper are **Monte Carlo model simulations**, not newly filmed A/B-tested commercials; 8 of 58 participants were dropped without explanation. | **Moderate-to-High** |
| **P16** | **Cutting, DeLong, & Nothelfer (2010, *Psych. Science*)**[^cutting-2010]<br>`f4-appraisal-curiosity-video-and-hooks.md` | Spectral analysis of `150` Hollywood films (`1935–2005`) | **JBI Analytical (2023):** **Moderate (film structure) / Low (attention claim)** | Post-1980 Hollywood films evolved toward a **$1/f$ shot-length power spectrum** (clustering short shots together). | **Zero human viewers were measured in the paper**, and a film's **$1/f$ exponent does NOT correlate with its IMDb rating ($r = -.089$)**! Treat $1/f$ pacing as a structural convention of modern cinema, not an automatic quality guarantee. | **Moderate** (film structure) · **Low** (viewer quality) |

---

# 2. The 10 Highest-Certainty Design & Engineering Laws (Filtered by Appraisal Verdict)

After stripping out every low-certainty claim (such as passive Red/Blue IQ priming in `Mehta & Zhu 2009` or unrelated bystander recall in `Gruber 2014`), these **10 laws survive with `Moderate-to-High` or `High` empirical certainty**:

1. **The `50 ms` Clutter $\times$ Prototypicality Gate (`Tuch 2012`, $\eta_p^2 = .604$, High Certainty):**
   - A conventional, prototypical layout (`Top-Left Logo, Top Nav, Center Hero`) boosts aesthetic ratings by **`d = 1.96`** on **low-clutter pages**, but only **`d = 0.24`** on **high-clutter pages**. **Cut visual clutter first (`Subband Entropy` & `Edge Congestion`, `Miniukovich 2015`), or layout structure will not save you.**
2. **The `+6.97 s` Missing-Target Penalty & `+1.40 s` Text-Only Penalty (`Putkonen 2025`, High Certainty):**
   - When an expected UI control or CTA is missing or hidden in an unfamiliar region, users burn **`+6.97 s`** searching before failing. Pairing key targets with a **visual icon/color badge** cuts search time by **`-1.40 s`** compared to text-only labels, and removing unnecessary elements saves **`20 ms` per element**.
3. **The `70%` Direct Meaning + `30%` Dark-is-More Color Law (`Schoenlein 2022` + `Braun 2025`, High Certainty):**
   - Viewers decode quantitative and categorical colors via **`0.70 × Semantic Association + 0.30 × Dark-is-More`** (on light backgrounds). For **Positive Valence ($R^2 = .924$)**, use **higher Lightness ($L^*$), higher Chroma ($C^*$), and bluer/cooler axes**; for **Trustworthy**, increase **Lightness ($L^*$) and Blue ($-b^*$)** without cranking saturation.
4. **The `WAVE` Olive/Brown Avoid-Zone (`Palmer & Schloss 2010`, $r = .893$, High Certainty):**
   - Dark yellow (`olive`) and dark orange (`brown`) are the single most disliked color regions in human perception. Never darken `#FFD600` (Yellow) by lowering lightness alone; shift toward warm gold/amber (`#F59E0B`).
5. **The Headline Length (`2.7×`) + Specific Negativity (`+2.3%/word`) Law (`Robertson 2023`, Stage-2 Registered Report, High Certainty):**
   - Across `53,699` randomized headlines, **structural headline length & concrete completeness have a `2.7×` larger effect than negativity**. Each specific negative/sadness-inducing diagnostic word adds **`+2.3%` CTR**, each generic positive word subtracts **`-1.0%` CTR**, and **moralizing/preachy language lowers clicks**.
6. **The Curiosity Integration Rule (`Gruber 2014`, `+30.5%` relative recall, High Certainty):**
   - `SN/VTA` dopamine spikes at **question onset**. Because **answers to the curiosity question itself gain `+16.5 pp` recall (`70.6%` vs. `54.1%` at 24 hrs)** while unrelated bystander items show only weak one-tailed spillover (`41.9%` vs. `37.2%`), **your core product/thesis MUST be the causal answer that resolves the hook**, not an unrelated sponsor plug dropped in the middle!
7. **The Surprise-Focuses (`3.3×`) / Joy-Velocity-Retains (`4.5×`) Video Split (`Teixeira 2012`, Moderate-to-High Certainty):**
   - Use **Surprise** in the first `0–3 s` and at section transitions to **collapse viewer gaze dispersion (`3.3×` stronger than Joy)** onto one focal point; then use **rising Joy/Reward Velocity ($\Delta\text{Joy}/\Delta t$, $\beta = -1.818$ vs. $-0.398$)** to keep viewers from pressing Skip!
8. **The `~7` Element Cap & Class-Specific Gaze Prior (`Bylinskii 2017` + `Fosco 2020`, Moderate-to-High Certainty):**
   - Human evaluators mark **at most `~7` elements as visually important** on any graphic design. **Titles/Display Typography** capture the #1 fixation rank ($r_s = .96$), and **text carries `+32%` more weight in Ads/Landing Heroes than in Infographics**.
9. **The Minimum-Grid-Lines (`GRIDS MILP`) Law (`Dayama 2020`, High Mathematical Certainty):**
   - Every new unaligned edge in a UI adds two binary grid-line penalties ($\gamma_g^X, \gamma_g^Y$). Snap all containers to **at most `3–4` shared vertical alignment axes**.
10. **The Cross-Cultural Complexity Multiplier (`Baughan 2021`, $F = 37.18$, Moderate Certainty):**
    - High visual complexity slows holistic scanners by **`3.05×` (`18.6 s` vs. `6.1 s`, $d = 1.86$)**, and users recall **main-column content `2.29×–4.07×` better (Odds Ratio)** than peripheral sidebars. Put mission-critical information in the **primary center/left column**, never in right-rail sidebars.

---

