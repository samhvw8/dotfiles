# Poster, thumbnail, comic, slides and dataviz

Load for a poster, thumbnail, key visual, comic or storyboard, slide deck, chart or infographic. Canonical thresholds, the hook IDs and the 26 gates are defined in [../SKILL.md](../SKILL.md). If a number here differs, `SKILL.md` wins.

## Quick rules: images, posters and video thumbnails

- **3-Element Subitized Cap:** Maximum `3` visual objects: (1) `1` expressive face/hand or anomaly object (`FFA/STS` N170 at `170 ms`), (2) `1` **`2–4` word badge** (`#FFD600` on black), and (3) `>8:1` figure-ground separation.
- **Biological Gaze Cueing (`Friesen & Kingstone 1998`):** Direct the subject's eyes, hands, or arrows straight at the paradox badge (`100–200 ms` reflexive gaze shift).
- **Complementary Framing:** The thumbnail shows the visual anomaly (`3` words); the title explains the mechanism. Never duplicate the title on the image.

## Quick rules: presentation slides and pitch decks

- **Assertion–Evidence Architecture (`Alley & Neeley 2005`):** Make the top-left headline (`39 px` first-fixation anchor) a **full-sentence conclusion (`≤9` words; `≤14` absolute maximum across two lines)** with a precise number (`+38.4%`), never a topic label (*"Q3 Metrics"*).
- **Cleveland & McGill Chart Accuracy (`1985`) + ISOTYPE (`Haroz 2015`):** Use aligned bar/dot charts (`1.0×` error) or discrete ISOTYPE icon arrays (`+25–38%` memory recall) over pie/bubble charts (`1.95–2.6×` error). Mute secondary bars to `#475569` and highlight **1** focal bar in `#FFD600`.
- **Direct Spatial Contiguity (`d = 1.12`):** Place data labels directly onto bars/lines; delete detached legends and bullet walls.

## Images, posters and thumbnails playbook

- **Subitized `≤3` Element Rule:** (1) `1` expressive face/hand or anomaly object (`FFA/STS` N170 at `170 ms`), (2) `1` `2–4` word `#FFD600`-on-black badge, (3) `>8:1` figure-ground contrast.
- **Biological Gaze Cueing (`Friesen & Kingstone 1998`):** Eyes/hands/arrows point directly at the paradox badge (`100–200 ms` shift).
- **Zero Title Redundancy:** Never repeat the video/article title verbatim on the thumbnail.

## Presentation slides, pitch decks and dataviz playbook

- **Assertion–Evidence Headline (`Alley 2005`):** Top-left full-sentence takeaway (`≤9` words; `≤14` absolute maximum across two lines) with a precise metric, never a topic label.
- **Cleveland & McGill Accuracy Hierarchy (`1985`):** Aligned bar/dot charts (`1.0×` error) > Small multiples (`1.4×`) > Stacked bars (`1.65×`) > Pie/Angle (`1.95×`) > Bubble Area (`2.4×`). Use discrete **ISOTYPE icon arrays** (`Haroz 2015`) to lift delayed recall by `+25–38%`.
- **Direct Spatial Contiguity (`d = 1.12`):** Attach numbers directly onto bars/lines; mute non-target bars to `#475569` and highlight `1` focal bar in `#FFD600`.

## Images, posters and thumbnails (extended)

### 1. Images, Posters & Thumbnails (`Ảnh · Poster · Thumbnail`)

A thumbnail or social image competes inside a high-density feed grid and is judged in a **$17\text{–}50\text{ ms}$ pre-attentive gist window**:

1. **The 3-Chunk Visual Cap (Below Cowan's $4 \pm 1$):**
   - Limit any thumbnail or poster to **at most 3 distinct visual chunks**:
     1. **One expressive face or anomalous focal object** (occupying $30\text{–}45\%$ of frame height).
     2. **One 2–4 word kinetic/contrast badge** (`#FFD600` yellow or `#FFFFFF` white on `#0B0E14` black pill/stroke).
     3. **One clean figure-ground background** (blurred or darkened so local luminance contrast on the subject exceeds $8:1$).
2. **Reflexive Gaze Cueing (`Friesen & Kingstone, 1998`):**
   - Neurons in the Superior Temporal Sulcus (STS) and Fusiform Face Area (FFA) trigger an automatic spatial saccade in the direction another face is looking within **$100\text{–}200\text{ ms}$**.[^friesen-1998]
   - Never have a portrait subject look off the outer edge of the frame; orient the subject's eyes or pointing gesture directly at the **paradox object or the 2–4 word badge**.
3. **Complementary Hook (Anti-Redundancy):**
   - Never copy the video or article title verbatim onto the thumbnail (`Mayer, 2009`, Redundancy Principle $d = 0.72$). The thumbnail states the **visual anomaly / 3-word paradox** (*"3 Steps = +38%?"*); the title states the **mechanism and stakes**.

## Slides, pitch decks and keynotes (extended)

### 2. Slides, Pitch Decks & Keynotes (`Slide · Thuyết trình`)

Live or recorded slide presentations fail when the slide competes with the speaker's voice inside **Baddeley's Phonological Loop**:

1. **Eliminate Bullet Walls (`Mayer, 2009`, Redundancy $d = 0.72$):**
   - When a slide displays multi-line bullet sentences while a presenter speaks, working memory splits between reading and listening, lowering retention below audio-only.
2. **Assertion–Evidence Slide Architecture (`Alley & Neeley, 2005`):**
   - **Top-Left Headline = Full-Sentence Assertion ($\le 14$ words):** State the *takeaway or paradox*, never a vague topic label (write *"Zero-copy edge caching cuts p99 latency by 42% at 1/3 the memory cost"*, not *"Caching Benchmark Results"*).[^alley-2005]
   - **Body = Visual Evidence:** Replace bullets with **1 annotated diagram, chart, or 3-column comparison** ($4 \pm 1$ chunk limit).
3. **Direct Spatial Contiguity ($d = 1.12$) & Pre-Attentive Highlight ($d = 0.46$):**
   - Delete detached chart legends; place labels directly on the bars or lines.
   - Mute all baseline/comparison bars to neutral gray (`#475569`) and apply high-luminance `#FFD600` yellow or `#FF5500` vermilion **only to the 1 target data series**.

## Data visualization hierarchy (Cleveland & McGill) and ISOTYPE

### 1. Pre-Attentive Data Visualization Hierarchy (Cleveland & McGill, 1984/1985; Franconeri et al., 2021)

Humans do not decode all visual chart encodings with equal accuracy or speed. Cleveland & McGill (1984, 1985) and Heer & Bostock (2010) measured log absolute estimation error across visual channels:[^cleveland-1985][^franconeri-2021]

| Rank | Visual Encoding Channel | Estimation Error (Relative) | Pre-Attentive Speed | Best Media Use / Rule |
|---|---|---|---|---|
| **1 (Best)** | **Position along a common aligned scale** (Dot plot, horizontal/vertical bar chart) | `1.00×` (Baseline lowest error) | `<200 ms` | Default for all KPI comparisons on Slides, Web, and UI Dashboards |
| **2** | **Position on identical non-aligned scales** (Small multiples) | `~1.40×` | `<350 ms` | Ideal for comparing `3–4` parallel cohorts without spaghetti line clutter |
| **3** | **Length** (Unaligned bars, stacked bar segments) | `~1.65×` | `~400 ms` | Only the bottom-aligned segment of a stacked bar is read at Rank 1 accuracy! |
| **4** | **Angle / Slope** (Pie charts, radar charts) | `~1.95×` | `>600 ms` | Never use Pie/Donut charts for `>2–3` categories; humans misjudge acute vs. obtuse wedges |
| **5** | **Area** (Bubble charts, treemaps) | `~2.40×` | `>800 ms` | Perceived via Stevens' Power Law ($\psi = k \cdot A^{0.7}$), systematically underestimating large bubbles |
| **6 (Worst)** | **Color Saturation / Luminance Shading** (Heatmaps, choropleths) | `~3.10×` | Qualitative only | Use color contrast to **highlight 1 outlier** (Von Restorff), never to encode exact ratios |

##### ISOTYPE Pictographs & Working Memory (Haroz, Kosara, & Franconeri, 2015)
Replacing abstract bars with **discrete subitizable icon arrays (ISOTYPE)** does not slow down reading when icons are simple silhouettes, and increases **delayed recall of the statistic by `+25% to +38%`** while doubling voluntary gaze engagement on posters, slides, and infographics.[^haroz-2015]

## Visual narrative grammar for comics and storyboards (`E-I-P-R`)

### 2. Visual Narrative Grammar (`Cohn, 2013`) & Event Segmentation (`Zacks, 2007`; `Zwaan, 1995`)

#### 2.1 The 5 Narrative Constituents & Diagnostic Constituency Tests (`Cohn, 2013`)
Across storyboards, comics, short reels, and UI scrollytelling, visual sequences follow a hierarchical constituent grammar rather than flat panel-to-panel transitions :
1. **Establisher (`E`):** Sets up the spatial/interpersonal relationship passively without burning the climax.
2. **Initial (`I`):** Launches the preparatory action or tension hook (`In Medias Res` destabilization).
3. **Prolongation (`P`):** Extends the trajectory, suspense, or medial delay before the climax.
4. **Peak (`P*`):** The culmination of the event or cognitive breakthrough (maximum visual salience and emotional intensity).
5. **Release (`R`):** The aftermath, resolution, or cognitive consolidation beat (`breath` after the peak).

- **Forensic Audit Note (`Cohn, 2013`):** `Cohn (2013)` proves structure via three **category diagnostics** (`Substitution`, `Deletion`, `Reordering`) and three **constituent diagnostics** (`Windowing`, `Deletion`, `Reordering`), showing that deleting every panel except the **Peak (`P*`)** paraphrases the whole sequence. Note that `Cohn (2013)` is a theoretical linguistics paper (calling panels *"attention units"* while citing Cohn's companion framing work for `Macro / Mono / Micro / Amorphic` attentional framing categories).
- **Spatial-Temporal Rhythm Law (`[INFERENCE]` applied from McCloud 1993 & Cohn 2013):** Narrow, tightly packed frames (`Micro -> Micro -> Mono`) accelerate perceived time (**Staccato Urgency**), whereas wide, full-bleed frames (`100% viewport` or wide gutter) decelerate perceived time (**Fermata / Breath**).

## East Asian high-density grids, Kishōtentetsu and Danmaku (quick rules)

- **Holistic vs. Analytic Gaze (`Chua, Boland, & Nisbett 2005`, *PNAS*):** East Asian viewers allocate `+35%` more fixations to background/context relationships; Western viewers fixate foreground objects `~120 ms` earlier.
- **Logographic Bento Grids:** `4` CJK characters (`限時免運`) fit inside `1.5°–2.0°` foveal vision (`1` fixation) and can be packed at `2×` density when bounded by `1px` Bento borders holding `≤3` items/cell.
- **Danmaku Safe Zone:** Keep primary subjects and captions inside `25%–72%` vertical, `10%–85%` horizontal so top-third Danmaku (`弹幕`) and bottom platform chrome never collide.

## East Asian holistic attention, Bento grids, Kishōtentetsu and Danmaku (extended)

### Overview

Cross-cultural cognitive science and East Asian (`ZH-TW`, `JA`, `ZH`) design practice reveal that attention allocation and information density are shaped by **Holistic vs. Analytic Scene Perception**, **Logographic `5-Character` Perceptual Spans**, **Kishōtentetsu (`起承転結` / `起承轉合`) Double-Loop Twists**, and **Danmaku (`弹幕` / `コメント`) Co-Attention Safe Zones**.

---

### 1. Holistic vs. Analytic Eye-Tracking (`118 ms` Focal Gap & `3.05×` Search Penalty)

1. **Foreground vs. Background Fixation Allocation ([Chua, Boland, & Nisbett, 2005, *PNAS*](https://doi.org/10.1073/pnas.0506162102)):**[^chua-2005]
   - North American viewers fixate the foreground focal object **`118 ms` faster** than East Asian viewers ($t(43) = 2.41, p < 0.02$), with their first saccade landing on the focal object **`42.8%` vs. `26.7%`** of the time.
   - Cultural divergence begins at **`420 ms` post-onset**: East Asian viewers make significantly more background fixations ($F(1,43) = 9.50, p < 0.005$) and suffer recognition drops when familiar focal objects are placed on new backgrounds.
2. **"5"-Shape vs. "0"-Shape Webpage Scanpaths & The `3.05×` Complexity Penalty:**
   - Western viewers scan webpages sequentially along a **"5"-shaped center-to-periphery trajectory**, whereas East Asian viewers execute **"0"-shaped circular peripheral pre-scans** before narrowing in ([Dong & Lee, 2008](https://www.ijdesign.org/index.php/IJDesign/article/view/267/163)).
   - On cluttered high-complexity layouts lacking clear grid boundaries, Japanese users' holistic peripheral scanning causes targeted visual search to take **`3.05×` longer** than US users (**`18.6 s` vs. `6.1 s`**, $t = 10.12, p < 0.0001$, Cohen's $d = 1.86$; [Baughan et al., 2021, *ACM CHI*](https://dl.acm.org/doi/10.1145/3411764.3445519)).[^baughan-2021]

---

### 2. CJK Logographic Foveal Compression & `1px` Bento Grid Architecture

1. **The `5-Character` Asymmetric Perceptual Span ([Inhoff & Liu, 1998](https://pubmed.ncbi.nlm.nih.gov/9483822/)):**[^inhoff-1998]
   - Moving-window eye-tracking in Traditional (`ZH-TW`) and Simplified (`ZH`) Chinese proves an asymmetric perceptual span of **`1` character left and `3–4` characters right (`5` characters total)**, with mean forward saccades of **`2.0–2.5` characters** (`~218 ms` fixation duration).
   - Because `2–4` CJK characters (`限時免運`, `效能翻倍`) pack the semantic density of `12–20` English letters inside a single `~2°` foveal fixation, CJK badges are decoded with **zero horizontal reading saccades**.
   - **Portal Headline Cap:** Yahoo! Japan enforces a **`13.5–15.5` character** headline row limit (`~5–6` saccades max per row).
2. **Compensating for Zero Uppercase/Italics via `1px` Bento Grids (`簡報藝術烘焙坊`):**
   - Because CJK fonts (`7,000–16,000+` glyphs) lack uppercase/lowercase contrast and native italics, high-density Japanese/Taiwanese UI and slide systems replace linear text flow with **`1px`-bordered 2D Bento cells** (Palmer's 1992 Common Region law) and **3-tier weight contrast**:
     1. **Tier 1 (Focal Outlier):** Solid color pill badge (`#FFD600` or `#FF5500` fill) with dark/white bold text (`2–4` chars).
     2. **Tier 2 (Structural Subhead):** Chromatic or bold `13–15` char headline.
     3. **Tier 3 (Context Detail):** Muted `#666666` / `#94A3B8` metadata (`≤3` data points per Bento cell).

---

### 3. *Kishōtentetsu* (`起承転結` / `起承轉合`) — Skippable Media Adaptations

Classical *Kishōtentetsu* builds engagement through an orthogonal perspective shift at Act 3 (`転` *Ten*, `~20%` runtime) rather than hostility. However, because classical `承` (*Shō*) spans `50–60%` of runtime, modern Japanese and Taiwanese creators use two high-retention adaptations for skippable video, podcasts, and pitch decks:

1. **Payoff-First Inversion (`結 → 起 → 承 → 転`):** Flash the surprising `3-second` synthesis outcome (`結`) at `0.0s`, step back into the familiar anchor (`起`) and mechanism (`承`), and deliver the orthogonal twist (`転`) at `65%` duration.
2. **Early-Twist Double Loop (`起 → 転₁ → 承₁ → 転₂ → 承₂ → 結`):** Fire the first micro-twist (`転₁`) within the first `10–15 seconds` to lock top-down curiosity, then alternate evidence (`承`) with a deeper mid-roll orthogonal twist (`転₂`).

---

### 4. Danmaku (`弹幕` / `コメント`) Eye-Tracking & 3-Band 1080p Safe Zones

High-speed EyeLink 1000 tracking ($1000\text{ Hz}, N = 87$; [BMC Psychiatry, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10360313/)) on Danmaku video viewing reveals:[^danmaku-2023]
- Viewers allocate **`15.65%` of total fixation time** and **`18.42%` of all fixations** (rising to **`46.66%`** in heavy users) to the **top `25%` (`1/4`) screen Danmaku zone**.
- **3-Band `1080p` Framing Specification:**
  - **Top Band (`Y = 0–270px`, Top `25%`):** Keep unobstructed for scrolling Danmaku overlays (`高能预警` crowd pre-cuing).
  - **Action & Eye-Line Band (`Y = 380–540px`, Center):** Position speaker eyes and hands here (`~4°–6°` short vertical saccade from Danmaku).
  - **Subtitle Band (`Y = 918–1080px` on `16:9`, or `Y = 60%–72%` on `9:16` vertical):** Lock burned-in kinetic captions here with a `3–4px` dark stroke so neither top Danmaku nor bottom platform chrome occludes them.

## Deliverable matrix: poster, print and key visuals (`poster`)

**Primary Empirical Sources:** Fosco 2020 (UMSI); Bylinskii 2017; Palmer, Schloss, & Sammartino 2013; Schloss & Palmer 2011; Still 2018

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry (0-200ms)** | `umsi_two_pole_attractor` | UMSI Poster Law (Fosco 2020): Top-Center/Left Giant Display Typography + Center Human Face/Subject capture 42%-58% of initial fixation mass within 200ms; headline-to-body size ratio >= 3:1. |
| **E2 · Capacity & Grid Simplicity** | `dominant_colors_and_chunks` | <= 3 dominant color clusters (>2% area each; Miniukovich 2015 r=+0.61 clutter penalty above 3); <= 3 distinct information groups (Hook Headline, Hero Visual, Terminal Event/CTA Block). |
| **E3 · Habituation Reset & Visual Friction** | `contour_and_scale_contrast` | Create a single intentional topology break (V4: giant cropped glyph overlapping a photorealistic subject, or Bar & Neta sharp angular warning frame inside a curved layout) tied 100% to the poster's core message. |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `harmonic_background_vs_focal_pop` | Background + secondary elements form a Schloss & Palmer (2011) harmonious pair (dH* <= 40 deg or monochrome carrier), while the single focal badge/CTA fires an opponent impulse (dE*ab >= 50, <= 5% area). |
| **E5 · Coping Potential & Terminal Scan Resolution** | `gaze_vector_to_cta` | Subject's eye gaze or structural leading lines point directly into the Bottom-Right Terminal Action Zone; zero competing badges along the outer border (prevents Banner Blindness -75% gaze loss). |

## Deliverable matrix: illustration, comics, webtoons and storyboards (`illustration`)

**Primary Empirical Sources:** Cohn 2013 (VNG); Zwaan 1995; Zacks 2007; Bar & Neta 2006; Palmer, Schloss, & Sammartino 2013; McCloud 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry & Inward Bias** | `establisher_and_inward_framing` | Open every scene with an Establisher (E) + Initial (I) panel where characters/vectors face INWARD toward the center/next panel (Palmer et al. 2013 Aesthetic Inward Bias) and silhouette reads cleanly in <100ms. |
| **E2 · Capacity & Balloon/Panel Density** | `balloon_words_and_panel_cap` | <= 18 words (2-3 short lines) per speech balloon to preserve the 3-5 Hz saccadic rhythm; <= 4-6 panels per page (or 1-2 panels per mobile Webtoon viewport). |
| **E3 · Habituation Reset & Framing Rhythm** | `cohn_framing_and_gutter_pacing` | Alternate Cohn's 4 attentional planes (Macro -> Mono -> Micro -> Amorphic) and panel widths: 3 narrow staccato panels (Prolongation tension) -> 1 borderless Full-Bleed Splash Panel (Peak P*) with vertical gutter expansion on Webtoon. |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `panel_color_script_and_focal_value` | Lock each scene to a cohesive 2-color harmonic mood carrier (Ou et al. 2004 Warm/Cool & Heavy/Light), reserving maximum luminance/chroma contrast (dE*ab >= 45) strictly for the Peak action hand/face/object in each panel. |
| **E5 · Coping Potential & Situation Continuity** | `zwaan_5_index_and_shape_morphology` | Preserve >= 3 of Zwaan's 5 situation indices (Space, Causality, Goal, Time, Protagonist) across every gutter transition; match Bar & Neta (2006) contour morphology (curved 67.2% preference for safe/warm beats vs. sharp V-angles for threat/conflict). |

## Deliverable matrix: infographic and data visualization (`infographic`)

**Primary Empirical Sources:** Bylinskii 2017; Fosco 2020; Schoenlein 2022; Braun & Schloss 2025; Cleveland & McGill 1984

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry & Top-Left Conclusion** | `conclusion_title_and_z_to_f_path` | Titles & large callout numbers capture 3.25x more fixations than chart bodies (Bylinskii 2017, r_s=.968): state the quantitative conclusion directly in the Top-Left title (never 'Sales by Region', always 'Q4 Margin Jumped +34% After Cutting 3 SKUs'). |
| **E2 · Capacity & Direct Labeling** | `series_cap_and_direct_labels` | <= 4 distinct data series/colors per chart; label lines/bars directly on the canvas (eliminating eye-bounce to external legends, Mayer Split-Attention d=1.12); align comparisons on a common horizontal/vertical baseline. |
| **E3 · Habituation Reset & Anomaly Callout** | `grey_carrier_and_anomaly_rupture` | Prevent visual scan fatigue across multi-panel infographics by alternating 1 macro trend chart with 1 single-number/icon micro-callout card (V1/V4 rupture) anchored strictly to the causal takeaway. |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `semantic_color_and_dark_is_more` | Keep context/baseline series in harmonious desaturated grey/slate carrier (#64748B) and apply 1 high-chroma opponent impulse color (dE*ab >= 45) ONLY to the target anomaly/winner; obey Schoenlein (2022) Direct Semantic Association + Dark-is-More on light backgrounds / Hotspot-is-More on dark backgrounds (avoids 180-320ms RT penalty). |
| **E5 · Coping Potential & Peak-End Synthesis** | `bottom_right_takeaway_box` | Terminate the Z-to-F visual scanpath at Bottom-Right with a 1-sentence Causal Synthesis & Action Box (Kahneman End anchor). |

## Deliverable matrix: slide decks, pitch decks and keynotes (`slide_deck`)

**Primary Empirical Sources:** Mayer 2009; Cowan 2001; Duarte 2010; Lakatos 2019; Reagan 2016; Kahneman 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry (Assertion Headline)** | `assertion_evidence_headline` | Every slide top-left headline is a complete <= 9-word causal assertion (44-56pt, >= 3:1 ratio over labels) that states the takeaway in <1.5s. |
| **E2 · Capacity & Zero-Bullet Law** | `zero_bullets_and_3_chunks` | Zero multi-line bullet paragraphs (eliminates Mayer Redundancy Trap -28% recall); strictly <= 3 visual chunks per slide (1 Assertion Headline + 1 Visual Diagram/Chart + 1 Giant Metric Callout at 72-96pt). |
| **E3 · Habituation Reset & Sparkline Cadence** | `sparkline_and_black_slide_rupture` | Oscillate every 2-3 slides between 'What Is' (current friction/pain) and 'What Could Be' (resolved future state, Duarte Sparkline / Reagan -SV 4); every 5-6 slides insert 1 Pure Black / Single-Number Pattern-Interrupt Slide (V1 subtraction) + pre-announce transitions verbally 2s before clicking (V3). |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `slide_color_script_and_morph` | Use dark slate carrier (#0F172A) with sharp 0-2px crimson/amber borders (#EF4444) on 'What Is' problem slides, shifting to restorative emerald/cyan (#10B981/#38BDF8) with 16-20px curved cards (Bar & Neta 2006) on 'What Could Be' solution slides. |
| **E5 · Coping Potential & Peak-End Decision Slide** | `peak_demo_and_end_decision_table` | Place the undeniable live proof / 10x artifact at 75% deck position (Peak P*), and leave the final slide (End Q5) on screen during Q&A as a 3-row Concrete Decision & Next-Step Contract (never a blank 'Thank You / Questions?' slide). |

## Sources

[^cleveland-1985]: William S. Cleveland & Robert McGill (1985), *"Graphical Perception and Graphical Methods for Analyzing Scientific Data"*, Science, 229(4716), 828–833.
[^franconeri-2021]: Steven L. Franconeri, Lace M. Padilla, Priti Shah, Jeffrey M. Zacks, & Jessica Hullman (2021), *"The Science of Visual Data Communication: What Works"*, Psychological Science in the Public Interest, 22(3), 110–161.
[^haroz-2015]: Steve Haroz, Robert Kosara, & Steven L. Franconeri (2015), *"ISOTYPE Visualization: Working Memory, Performance, and Engagement with Pictographs"*, ACM CHI, 1191–1200.
[^shams-2000]: Ladan Shams, Yukiyasu Kamitani, & Shinsuke Shimojo (2000), *"What You See Is What You Hear"*, Nature, 408(6814), 788.
[^vroomen-2010]: Jean Vroomen & Mirjam Keetels (2010), *"Perception of Intersensory Synchrony: A Tutorial Review"*, Attention, Perception, & Psychophysics, 72(4), 871–884.
[^chua-2005]: Hannah Faye Chua, Julie E. Boland, & Richard E. Nisbett (2005), *"Cultural Variation in Eye Movements During Scene Perception"*, PNAS, 102(35), 12629–12633.
[^baughan-2021]: Amanda Baughan, Nigini Oliveira, Tal August, & Naomi Yamashita (2021), *"Do Cross-Cultural Differences in Visual Attention Patterns Affect Search Efficiency on Websites?"*, ACM CHI, Article 364.
[^inhoff-1998]: Albrecht Werner Inhoff & Weimin Liu (1998), *"The Perceptual Span During Reading of Chinese Text"*, Perception & Psychophysics, 60(8), 1436–1447.
[^danmaku-2023]: EyeLink 1000 Danmaku Fixation Study (2023), BMC Psychiatry, PMC10360313.
