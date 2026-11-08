---
name: attention-architecture
description: "Engineer and audit human attention capture and information organization across websites/landing pages, UI/UX interfaces, presentation slides, thumbnails/posters, vlogs/short videos, motion graphics, and podcasts using empirical neuroscience, reading/numerical psychophysics, data-viz salience, and eye-tracking laws (555nm luminance contrast, Von Restorff isolation, motion onset, paradox hooks, dopamine curiosity halo, subitizing, Cowan 4±1 chunking, asymmetric AV sync, and auditory MMN). Use when designing, scripting, restructuring, or critiquing any visual, interactive, video, or audio medium where capturing attention, maximizing retention, or preventing cognitive overload matters."
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

## 3. Pre-Flight 10-Gate Audit (Run Before Finishing Any Deliverable)

Score the design or script against these 10 gates and fix any failure before delivering:

1. **Von Restorff & 555nm Contrast:** Is `85–90%` of the frame neutral with **1** primary focal outlier (`#FFD600` on dark `≥14.6:1` or black ink on `#FFD600` fill), and zero yellow-on-white (`1.07:1`)?
2. **Motion Onset & Easing Discipline:** Are infinite CSS/motion loops eliminated in favor of single `150–300 ms` `cubic-bezier(0.22, 1, 0.36, 1)` motion onsets?
3. **50ms Gist & Anti-Banner-Blindness:** Is the primary hook at the top-left (`39 px` error), with zero critical content in right-hand sidebars (`0.8%` gaze) or ad-shaped boxes?
4. **Zero-Greeting 0–3s Opening:** Does the video/vlog/podcast/hero start mid-motion at `0.0s` without throat-clearing greetings (`+37%` bounce penalty)?
5. **Paradox Hook + Curiosity Halo:** Does `0.3–15s` pair a schema-incongruent paradox + precise number (`+38.4%`) with the brand/product placed *inside* the open curiosity window (`+20–30%` memory halo)?
6. **Subitizing (`≤3–4`) & Cowan `4±1` Chunking:** Are thumbnails capped to `≤3` objects, rows/tiers to `3–4` items, Bento cells to `≤3` internal metrics, and typography to `≤4` levels?
7. **Reading Span (`50–75` CPL) & `11-Char` Scent:** Is body copy constrained to `50–75` CPL with the first `2–3` words (`~11` chars / `4` CJK chars) of every heading front-loaded with concrete nouns/metrics?
8. **DataViz Accuracy & Dual-Channel Sync:** Do charts use aligned bars/dots or ISOTYPE icons instead of multi-slice pies, with direct labels and zero verbatim reading of slide bullets?
9. **Asymmetric AV Sync & Acoustic MMN:** Do sound effects fall `0 to +66 ms` *after* visual cuts (never `>40 ms` before), with a `0.8–1.5s` silence drop before the thesis and `170–190 wpm` speech?
10. **Endowed Progress & Peak–End Closure:** Do multi-step UI flows start at `20–25%` progress, and do videos/podcasts/decks end immediately on a `5–10s` synthesis peak without a housekeeping tail?



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

- **Executable CLI Scorer:** Run `python3 ~/workspace/research/261107-attention-information-architecture/scripts/hook_scorer.py --compare "<Hook A>" "<Hook B>"` to score and compare any two hooks with the locked Empirical Bayes + 12-Archetype model.


---

## 5. Full-Spectrum Color Selection Rules (Beyond Yellow)

- **Yellow (`~555 nm`, `#FFD600`):** Peak photopic luminance (`L+M`, `19.56:1` on black, `3.95x` Von Restorff recall at `<=5%` area). Use for 1 primary badge/CTA on dark `#0F172A` or video captions; **never** on white (`1.07:1`).
- **Red (`~620-700 nm`, `#FF4D4D` on dark / `#B91C1C` on white):** Strongest `N2pc` early attentional capture (`180-250 ms`); triggers **avoidance motivation & local vigilance (`+31%` detail/proofreading accuracy, `Mehta & Zhu 2009 Science`)**. Pure `#FF0000` is only `4.00:1` on both black and white (fails WCAG `4.5:1`!). **Cultural Guard:** In CN/TW/JP financial UI, **Red (`红涨`) = Gain (`+`)** and **Green (`绿跌`) = Loss (`-`)**.
- **Blue (`~450-490 nm`, `#38BDF8` on dark / `#2563EB` on white):** Triggers **approach motivation (`2x` creative outputs, `Mehta & Zhu 2009`)** and #1 **Brand Competence & Trust (`Labrecque & Milne 2012`)**. **Foveal S-Cone Rule (`Curcio 1991`):** Central `0.3°` fovea has **`0%` S-cones**; never put pure `#0000FF` text/thin lines on dark backgrounds (`1.28:1`, blurry) — shift to **Sky/Cyan-Blue (`#38BDF8`, `10.2:1`)**.
- **Green (`~520-560 nm`, `#10B981` on dark / `#047857` on white):** M-cone peak (`534 nm`); zero accommodation strain, **`+20%+` creative fluency (`Lichtenfeld 2012`)**, and Western `"Verified / Go / Safe"` signal. **Daltonism Guard:** `8%` of males are red-green colorblind; always pair Red/Green with icons (`✓/⚠` or `↑/↓`).
- **Orange (`~590-615 nm`, `#F97316` / `#FF5500`):** High `L+M` luminance + warm appetite salience **without** Red's error/danger anxiety. Best for e-commerce `"Add to Cart / Buy Now"` CTAs (`7.8:1` on `#0F172A`).
- **Purple / Violet (`#8B5CF6` / `#A855F7`):** Ecological rarity (`Palmer & Schloss 2010 PNAS`) signals **Luxury, Uniqueness, and AI/Synthetic Novelty** (`<=10%` accent; never use as a large background fill due to simultaneous red/blue chromatic aberration).
- **Display Polarity & `60-30-10` Budget:** Use **Light/Warm Paper (`#FAF8F5` / `#FFFFFF`)** for daylight dense reading (`+10%-18%` proofreading accuracy, `Buchner & Baumgartner 2007`); use **Dark Slate (`#0F172A`, `87%` white `#E2E8F0`)** for video, dashboards, and high-chroma hero hooks. Enforce **`60%` neutral surface, `30%` structural slate/blue, `<=10%` (`<=5%` for yellow/orange) focal accent**.

---

## 6. Spatial Layout Architecture Selector (8 Empirical Layouts)

1. **Layer-Cake (`H2/H3` Horizontal Bands + `3-4` Cards/Row):** Default for text-heavy landing pages and documentation (`+27%-47%` task usability). Front-load the diagnostic word in the **first `11` characters (`2-3` words)** of every heading.
2. **Z-Pattern & Gutenberg Diagram:** **Top-Left (`Primary Optical Area`, `39 px` error)** -> **Top-Right (`Strong Fallow`)** -> **Center Diagonal** -> **Bottom-Right (`Terminal CTA`)**; skips **Bottom-Left (`Weak Fallow Dead Zone`)**. Use **only** when viewport text is `<40` words (hero splash, posters, thumbnails, slide titles, modal dialogs).
3. **Lawn-Mower (`Boustrophedon`) Comparison Matrix:** Row 1 Left->Right, drop down on right edge, Row 2 Right->Left. Use for compact spec/pricing comparison matrices; **avoid wide alternating `Text/Image` marketing rows** (`-28%` reading completion when the left text spine breaks).
4. **Single-Column Narrative Tunnel (`60-65 cpl`):** Completed **`15.4 seconds` faster** than 2-column forms (`CXL Eye-Tracking`). Mandatory for forms, checkouts, and long-form articles.
5. **Asymmetric Sticky Split-Screen (`38/62` Ratio):** Left scrolling verbal steps (`80%` left-half fixation bias) + Right `position: sticky` live visual canvas eliminates split-attention (**Cohen's $d = 1.12$**, `Mayer 2009`).
6. **Fitts Perimeter & Mobile Thumb-Zone Arc (`Hoober N=1,333`):** `49%` one-handed mobile grip (`75%` thumb touch). Place primary mobile CTAs in the **Bottom-Center Natural Arc (`Y = 70%-95%`)**; banish destructive/rare actions to Top-Left/Top-Right stretch corners (`+400-600 ms` lag).
7. **Masonry Waterfall vs. Uniform Row Grid:** Use **Masonry (`Xiaohongshu/Pinterest`)** for visual discovery feeds (`+22%` scroll depth via unclosed Zeigarnik bottom card edges); use **Uniform Row-Aligned Grids** when users compare prices/specs (`Masonry slows comparison by +35%-50%`).
8. **3-Tier Inverted Pyramid & `1px` Bento Grid:** Dashboards: **Tier 1 (`15%` H)** `3-4` Subitizable KPI cards -> **Tier 2 (`50%` H)** `1-2` Cleveland-McGill aligned charts -> **Tier 3 (`35%` H)** granular table. High-density/CJK portals: use **`1px` bordered Bento cells (`<=3` items/cell)** to cut search time by **`3.05x`** (`Baughan 2021 CHI`).


---

## 7. Computable Layout Aesthetics, UMSI Visual Importance & CIELAB Scales (Wave 5 Full-Text Laws)

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
