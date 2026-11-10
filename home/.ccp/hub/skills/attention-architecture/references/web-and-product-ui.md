# Web and product UI

Load for a landing page, website, product UI, dashboard or mobile app. Canonical thresholds, the hook IDs and the 26 gates are defined in [../SKILL.md](../SKILL.md). If a number here differs, `SKILL.md` wins.

## Quick rules: websites and landing pages

- **50ms Prototypicality + Top-Left Entry (`Still 2018`):** Keep navigation canonical, constrain body text to **`55–68` CPL** (`50–75` acceptable on responsive viewports), and place the Disrupt-Then-Reframe headline + precise metric in the top-left/center-left viewport (`80%` left-half gaze).
- **1 Isolated CTA + Layer-Cake `4±1` Bands:** Isolate 1 primary `#FFD600`-on-dark (or black-ink-on-`#FFD600`-fill) CTA; organize below-the-fold into `3–4` card rows with front-loaded `11-character` headings; never use right-rail callouts (`0.8%` gaze, `Pernice 2018`).

## Quick rules: product UI and dashboards

- **Subitized `3–4` Clusters & `1px` Bento Cells (`Palmer 1992`):** Cap primary nav and KPI rows to `3–4` items; for high-density dashboards (or CJK interfaces), enclose every module in a `1px` Bento border holding `≤3` internal values.
- **Endowed Progress Onboarding (`Nunes & Dreze 2006`):** Initialize multi-step progress bars at **`20–25%` ("Step 1 of 4 complete ✓")** to trigger Goal-Gradient acceleration (`34%` vs `19%` completion).
- **Duration Thresholds & Anti-Misclick Hierarchy:** Keep micro-feedback `<100 ms` and layout transitions `150–300 ms`; cap typography to `≤4` levels; use `#121212` + `87%` white (`#E2E8F0`) in dark mode; never style "Cancel / Log Out" as the brightest Von Restorff outlier.

## Website and landing page playbook

- **0–50 ms:** Canonical grid + low above-the-fold visual clutter + `50–75` CPL line width.
- **Top-Left Entry (`39 px` error):** Disrupt-Then-Reframe headline + precise metric (`+38.4%`) in the top-left/center-left zone (`80%` left-half gaze).
- **1 Isolated CTA:** `#FFD600` on dark (`#0F172A`, `14.6:1`) or black ink inside `#FFD600` fill on light.
- **Layer-Cake `4±1` Bands:** `3–4` cards per horizontal band; front-load the first `2–3` words (`~11` characters) of every heading; zero right-rail callouts.

## UI/UX product and dashboard playbook

- **Subitized `3–4` KPI Clusters & `1px` Bento Cells:** `3–4` top-level nav items or KPI cards; enclose high-density modules in `1px` Bento borders holding `≤3` internal metrics each (`Palmer 1992` Common Region).
- **Endowed Progress Onboarding (`Nunes & Dreze 2006`):** Start multi-step wizards at `20–25%` progress ("Step 1 of 4 complete ✓").
- **Animation Timing & Dark-Mode Halation:** Micro-feedback `<100 ms`, layout transitions `150–300 ms` (`cubic-bezier(0.22, 1, 0.36, 1)`); `#121212` surface with `87%` white (`#E2E8F0`); never style "Cancel / Log Out" as the brightest Von Restorff outlier.

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

## Web scanning and layout evidence (eye-tracking)

### Overview

Web pages are **2D spatial, self-paced environments** where human attention operates in two regimes: (1) **pre-attentive holistic gist processing** in the first $17\text{–}500\text{ ms}$, and (2) **top-down spatial foraging** after $500\text{ ms}$.[^lindgaard-2006][^tuch-2012] Users form stable aesthetic and credibility judgments within **50 milliseconds** ($r = .947, p < .001$ between $50\text{ ms}$ and $500\text{ ms}$ exposures), driven by **visual complexity** ($\eta_p^2 = .520$) and **layout prototypicality** ($\eta_p^2 = .552$).[^lindgaard-2006][^tuch-2012] During scanning, **80% of all fixations fall on the left half of the screen** (**94% on SERPs**), while **57% of viewing time occurs above the fold** and **74% within the first two screenfuls**.[^nng-horizontal-2017][^nng-scrolling-2018]

### Empirical Scanning & Layout Rules

| Pattern / Rule | Empirical Finding | Web Design Implementation |
|----------------|-------------------|---------------------------|
| **50 ms First Impression & Prototypicality** | Lindgaard et al. (2006) & Tuch et al. (2012): Low visual complexity + high layout prototypicality maximize immediate visceral appeal in 17–50 ms.[^lindgaard-2006][^tuch-2012] | Keep above-the-fold layout structurally familiar while placing the pattern interrupt in the *headline copy or hero focal object*, not by breaking navigation conventions. |
| **Position & Contrast Beat Raw Size** | Still (2018) empirically tested Faraday's (2000) visual hierarchy model using eye-tracking and found entry points are predicted in the **exact opposite order** of classical intuition: **Position ($M = 39.14\text{ px}$ error)**, **Text Style ($M = 81.44\text{ px}$)**, and **Local Color Contrast ($M = 96.89\text{ px}$)** significantly outperform **Images ($M = 172.62\text{ px}$)** and **Size ($M = 326.61\text{ px}$)**.[^still-2018] | Place critical hooks at the top-left reading entry point with high local chromatic/luminance contrast rather than relying on oversized banners in peripheral zones. |
| **F-Pattern vs. Layer-Cake Scanning** | Unstructured walls of text force an F-shaped fixation heatmap where the bottom-right is ignored; clear subheadings and bullet groups shift eye fixations to the **Layer-Cake** or **Lawn-Mower** pattern.[^nng-scrolling-2018] | Break copy into scannable horizontal bands with high-scent subheadings (front-loading the main noun/verb in the first 2–3 words / ~11 characters). |
| **Yellow & The "Dark Yellow Problem"** | Pure yellow (`#FFFF00`) has a relative luminance of $L = 0.9278$ (summing L-cone $0.2126$ + M-cone $0.7152$). Against black ($L = 0$), yellow achieves a **$19.56:1$** WCAG contrast ratio; against white ($L = 1.0$), it collapses to **$1.07:1$** ("The Dark Yellow Problem"). | Use yellow as an **isolated focal accent on dark surfaces** or with dark-ink typography (`#111111` text on `#FFD600` button). Never put white text on yellow or yellow text on white. |
| **Banner Blindness & The Hot-Potato Effect** | Burke et al. (2005): Users fixate on banner-styled boxes in only **11.7% of trials** with **0% net recognition memory** ($20.1\%$ hit vs. $20.2\%$ false alarm), yet flashing banners slow visual search by **75% ($+4.3\text{ s}$)** and raise NASA-TLX workload ($p < .001$).[^burke-2005] Pernice (2018): A single unwanted fixation on an ad-like element triggers the **Hot-Potato phenomenon**, dropping right-rail fixations to **0.8% of total gaze** ($33\times$ penalty).[^pernice-2018] | Integrate key callouts into the primary reading column using typographic scale and whitespace; never style critical CTAs as right-rail boxes or multi-colored ad banners. |

## UI/UX product and dashboard design (extended)

### 4. UI / UX Product & Dashboard Design (`Thiết kế UI/UX · App · SaaS`)

In product interfaces, users arrive with **top-down task goals** (`Corbetta & Shulman, 2002`). Unnecessary bottom-up salience acts as hostile noise (`Burke et al., 2005`: flashing/colorful banners slow visual search by **+75%**):[^burke-2005]

1. **Cowan $4 \pm 1$ Navigation & KPI Grouping:**
   - Cap top-level navigation items, bottom tab bars, and KPI summary cards at **3 to 5 items**. Use progressive disclosure (drawers, "More" menus, drill-down views) for secondary controls.
2. **4-Level Typographic Ceiling:**
   - Restrict any single screen to **$\le 4$ distinct font-size/weight hierarchy levels** (Page Title, Section Header, Body/Value, Caption/Label).
3. **Anti-Misclick Von Restorff Alignment:**
   - Never style "Cancel", "Reset", or "Log Out" as the sole high-contrast chromatic button on a neutral screen. Reserve `#FFD600` / `#FF5500` / primary brand fill for the **single primary forward action**, and keep destructive actions neutral until a confirmation dialog opens.
4. **Dark-Mode Halation Prevention:**
   - Use `#121212` or `#0F172A` surface with **$87\%$ white (`#E2E8F0`)** text for long-session dashboards so high-contrast white text does not bloom on OLED displays.

## Layout selector: 8 empirical layouts

1. **Layer-Cake (`H2/H3` Horizontal Bands + `3-4` Cards/Row):** Default for text-heavy landing pages and documentation (`+27%-47%` task usability). Front-load the diagnostic word in the **first `11` characters (`2-3` words)** of every heading.
2. **Z-Pattern & Gutenberg Diagram:** **Top-Left (`Primary Optical Area`, `39 px` error)** -> **Top-Right (`Strong Fallow`)** -> **Center Diagonal** -> **Bottom-Right (`Terminal CTA`)**; skips **Bottom-Left (`Weak Fallow Dead Zone`)**. Use **only** when viewport text is `<40` words (hero splash, posters, thumbnails, slide titles, modal dialogs).
3. **Lawn-Mower (`Boustrophedon`) Comparison Matrix:** Row 1 Left->Right, drop down on right edge, Row 2 Right->Left. Use for compact spec/pricing comparison matrices; **avoid wide alternating `Text/Image` marketing rows** (`-28%` reading completion when the left text spine breaks).
4. **Single-Column Narrative Tunnel (`55–68 cpl`):** Completed **`15.4 seconds` faster** than 2-column forms (`CXL Eye-Tracking`). Mandatory for forms, checkouts, and long-form articles.
5. **Asymmetric Sticky Split-Screen (`38/62` Ratio):** Left scrolling verbal steps (`80%` left-half fixation bias) + Right `position: sticky` live visual canvas eliminates split-attention (**Cohen's $d = 1.12$**, `Mayer 2009`).
6. **Fitts Perimeter & Mobile Thumb-Zone Arc (`Hoober N=1,333`):** `49%` one-handed mobile grip (`75%` thumb touch). Place primary mobile CTAs in the **Bottom-Center Natural Arc (`Y = 70%-95%`)**; banish destructive/rare actions to Top-Left/Top-Right stretch corners (`+400-600 ms` lag).
7. **Masonry Waterfall vs. Uniform Row Grid:** Use **Masonry (`Xiaohongshu/Pinterest`)** for visual discovery feeds (`+22%` scroll depth via unclosed Zeigarnik bottom card edges); use **Uniform Row-Aligned Grids** when users compare prices/specs (`Masonry slows comparison by +35%-50%`).
8. **3-Tier Inverted Pyramid & `1px` Bento Grid:** Dashboards: **Tier 1 (`15%` H)** `3-4` Subitizable KPI cards -> **Tier 2 (`50%` H)** `1-2` Cleveland-McGill aligned charts -> **Tier 3 (`35%` H)** granular table. High-density/CJK portals: use **`1px` bordered Bento cells (`<=3` items/cell)** to cut search time by **`3.05x`** (`Baughan 2021 CHI`).

## Eight spatial layout and grid architectures (when each wins and fails)

| Layout Architecture | Eye-Tracking Scanpath & Cognitive Mechanism | Empirical Metric / Benchmark | Best Use Cases | Failure Mode / When It Backfires |
|---|---|---|---|---|
| **1. Layer-Cake (`H2/H3` Horizontal Bands)** | Parallel top-down skimming of bold subheadings + **`3–4` cards/row** (`Subitizing limit`) | **`+27% to +47%` task usability** vs. unchunked prose (`NN/g`) | Text-heavy landing pages, documentation, feature comparisons | Fails if headings are generic (*"Overview"*) instead of front-loaded (`first 11 chars`). |
| **2. Z-Pattern & Gutenberg Diagram** | **Top-Left (Primary Optical Area)** $\to$ **Top-Right (Strong Fallow)** $\to$ **Center Diagonal** $\to$ **Bottom-Right (Terminal Action Area)**; skips **Bottom-Left (Weak Fallow Zone)** | Top-left captures **`39 px`** lowest fixation error (`Still 2018`); Bottom-Right is optimal modal/card terminal CTA | Low-text (`<40` words) hero sections, posters, thumbnails, slide title cards, modal dialogs | Collapses on text-heavy pages (`>100` words), causing zig-zag oculomotor fatigue. |
| **3. Lawn-Mower (`Boustrophedon`) Comparison Grid** | Row 1 Left $\to$ Right, drop straight down on right edge, Row 2 Right $\to$ Left (`Enders / NN/g`) | Minimizes return-sweep saccade distance in structured comparison matrices | Spec comparison tables, pricing matrices, tightly coupled `2-column` grids | **Alternating `Text/Image` Marketing Trap:** When image/text rows alternate with wide gaps, users lose the left text spine (`-28%` reading completion). |
| **4. Single-Column Narrative Tunnel** | Pure vertical ballistic scroll along a **`55–68 cpl` (`50–75` char acceptable)** spine with `≥25%` lateral whitespace | Completed **`15.4 seconds` faster** than 2-column forms (`CXL Eye-Tracking`) | Checkout/onboarding forms, long-form articles, case studies, mobile feeds | Wastes horizontal screen real estate on wide `1440p+` analytic dashboards. |
| **5. Asymmetric Sticky Split-Screen (`38/62` Ratio)** | Left pane (`38%–45%` width, where **`80%` of fixations** land) scrolls verbal steps; Right pane (`55%–62%`, `sticky`) morphs visual canvas in place | Eliminates split-attention effect (**Cohen's $d = 1.12$**, `Mayer 2009`) | SaaS product tours (Stripe/Linear style), interactive explainers, code-plus-preview docs | Fails on mobile `<768px` unless collapsed into a sticky top canvas + scrolling bottom sheet. |
| **6. Fitts Perimeter & Mobile Thumb-Zone Arc** | Desktop screen edges have **infinite width ($W \to \infty$)** (`Fitts 1954`); Mobile **`49%` one-handed / `75%` thumb touch** (`Hoober 2016`) | Top-corner mobile reach adds **`+400–600 ms`** latency vs. Bottom-Center Natural Arc | Mobile apps, bottom-sheet checkouts, short-video overlays, desktop IDE/NLE toolbars | Putting primary mobile CTAs or frequent tab switches in the Top-Left/Top-Right stretch corners. |
| **7. Masonry Waterfall vs. Uniform Row Grid** | Staggered card heights create an **unclosed Zeigarnik edge** at the bottom of the viewport | **`+22%` scroll depth** in visual discovery (`Xiaohongshu / Pinterest`), but **`+35%–50%` slower** spec comparison | **Masonry:** Visual discovery, moodboards, UGC feeds.<br>**Uniform Grid:** E-commerce price/spec comparison. | Using Masonry when users must compare prices, ratings, or technical attributes across a row. |
| **8. 3-Tier Inverted Pyramid & Bento Grid (`1px` Cells)** | **Tier 1 (`15%` H):** `3–4` Subitizable KPIs $\to$ **Tier 2 (`50%` H):** `1–2` Aligned Charts $\to$ **Tier 3 (`35%` H):** Table; or `1px` bordered Bento cells (`≤3` items/cell) | Cuts East Asian / high-density visual search penalty by **`3.05×`** (`18.6s → 6.1s`, `Baughan 2021 CHI`) | Executive dashboards, multi-feature Bento showcases, CJK/high-density portals | Putting the granular data table at the top of a dashboard or exceeding `3` data points per Bento cell. |

## Computable layout rules: alignment, clutter, visual importance

- **The $\le 4$ Shared Alignment-Axis Rule (`Dayama & Oulasvirta 2020 CHI — GRIDS MILP`):** Every card, heading, button, and visual container in a viewport must snap to **at most `3-4` shared vertical $X$-axes**. Minimizing distinct alignment lines increases perceived layout order by **`+34%`**.
- **Subband Entropy & Edge Congestion Guard (`Miniukovich & De Angeli 2015 CHI`):**
  - Keep background surfaces flat or low-frequency (`gradient ΔL < 8%`); high subband entropy correlates **$r = +0.68$** with perceived clutter and **`r = -0.49`** with `50 ms` beauty.
  - Maintain **`>=8-12 px` minimum clearance** between non-collinear borders, icons, and text baselines to prevent **foveal edge congestion (`4 px` crowding radius, $r = +0.61$ complexity)**.
  - Keep **open background whitespace at `40%-55%`** of viewport area and cap **dominant color clusters (`>2%` area) at `<=3-4`**.
- **UMSI Typography-First Law for Graphic Layouts (`Bylinskii et al. 2017 UIST`; `Fosco et al. 2020 UIST`):** Unlike natural photos (where faces/objects dominate), on designed layouts (webpages, posters, slides, infographics), **Large High-Contrast Display Typography (`Headline / Giant Number`) captures `42%-58%` of total initial fixation mass**, followed by human faces/eyes (`2nd`) and isolated Von Restorff callout badges (`3rd`).

## Eight computable layout and aesthetic metrics

Full-text inspection of **Miniukovich & De Angeli (2015, *ACM CHI*)** and **Dayama, Todi, Saarelainen, & Oulasvirta (2020, *ACM CHI*)** yields exact mathematical metrics that predict whether a layout feels "clean and effortless" or "cluttered and amateurish" within **`50 ms`**:

| Computable Metric | Mathematical Definition / Mechanism | Empirical Correlation with Perceived Clutter / Aesthetics | Concrete Engineering Threshold |
|---|---|---|---|
| **1. Subband Entropy ($SE$) & Feature Congestion ($FC$)** | Shannon entropy of steerable pyramid luminance/chrominance wavelet coefficients (`Rosenholtz 2007`) | **$r = +0.68$** with perceived visual clutter; **`r = -0.49`** with `50 ms` beauty | Keep background surfaces flat or low-frequency (`gradient ΔL < 8%`); never place text over high-frequency photographic textures without a `≥70%` opacity scrim. |
| **2. Edge Congestion ($EC$)** | Ratio of contour edge pixels within a **`4-pixel` foveal crowding radius** of another non-collinear edge | **`r = +0.61`** with visual complexity ($p < 0.001$) | Maintain **`≥8–12 px` minimum padding** between borders, icons, and text baselines; never stack double borders (`border + box-shadow + outline`). |
| **3. Grid Alignment Line Count ($G_{\text{lines}}$)** | Total number of distinct vertical ($X$) and horizontal ($Y$) alignment axes across all layout boxes (`MILP objective` in `GRIDS`) | Minimizing distinct alignment axes increases perceived layout order by **`+34%`** | **The $\le 4$ Axis Rule:** Every card, heading, button, and image on a viewport must snap to **at most `3–4` shared vertical $X$-axes**. |
| **4. Bilateral Vertical Symmetry ($S_V$)** | Mirror balance of visual mass across the vertical centerline (vs. horizontal top-bottom symmetry $S_H$) | Vertical symmetry significantly predicts beauty ($p < 0.01$); horizontal symmetry has **zero effect** | Balance visual weight left-to-right (or use a deliberate **`38/62` Golden Ratio offset** balanced by high-contrast typography on the narrower left pane). |
| **5. White Space Fraction ($W_f$)** | Proportion of viewport pixels belonging to uniform background canvas | Optimal aesthetic & search zone sits at **`40%–55%` whitespace** (`<25%` triggers crowding; `>75%` feels empty) | Reserve **`≥40%` of the viewport** as open background canvas (`60%` surface rule in the `60-30-10` budget). |
| **6. Dominant Color Cluster Count ($C_{\text{dom}}$)** | Number of distinct HSV/CIELAB color clusters occupying `>2%` of viewport area | Layouts with **`>4` dominant color clusters** suffer a sharp drop in `50 ms` aesthetic rating ($p < 0.001$) | Strictly cap distinct UI hues at **`2–3` (`1` brand/structural hue + `1` opponent CTA accent + semantic status only when active)**. |

## Unified visual importance (UMSI) across 5 layout classes

In **Bylinskii et al. (2017, *ACM UIST*)** and **Fosco et al. (2020, *ACM UIST*)**, eye-tracking and BubbleView maps across **Webpages, Mobile UIs, Posters, Ads, and Infographics** prove that **graphic layouts obey a different attention law than natural photographs**:
1. **The Typography-First Reversal:** In natural scenes, faces and bright objects dominate; in **designed layouts (posters, slides, landing pages, infographics)**, **Large High-Contrast Display Typography (`Headline / Title / Giant Number`) captures `42%–58%` of total initial fixation mass**, outranking background photography!
2. **Spatial Bias Shifts by Layout Class (`Fosco et al. 2020`):**
   - **Posters & Thumbnails:** Strong **Top-Center + Center-Face** two-pole attractor.
   - **Webpages:** Strong **Top-Left (`Primary Optical Area`) + Left-Spine** bias (`80%` left-half fixation share).
   - **Mobile UIs:** Strong **Upper-Middle Hero + Bottom-Center CTA** bimodal split.
   - **Data Visualizations & Infographics (`Bylinskii 2017`):** **Title (`Top-Left`)** $\to$ **Annotated Callout / Outlier Peak (`Von Restorff`)** $\to$ **Legend/Axes last** (unannotated chart bars receive `<12%` of gaze!).

## UI motion durations and easing

### 2. Motion Choreography & UI Duration Psychophysics (Chang & Ungar, 1993)

Motion in UI/UX and Motion Graphics must respect cortical velocity and duration thresholds:
1. **Perceptual Duration Bands:**
   - **`0–100 ms` (Instantaneous):** Perceived as direct physical causation (button press, hover state, toggle). Any delay `>100 ms` breaks the illusion of direct manipulation.
   - **`150–300 ms` (Spatial Orientation Transition):** Optimal window for drawer slides, modal morphs, and slide transitions. Gives the dorsal stream enough frames to track object identity (`what went where`) without making the user wait.
   - **`>400–500 ms` (Perceived Blocker):** Crossing `400 ms` causes the eyes to arrive at the destination *before* the animation finishes, triggering impatience and cognitive friction.
2. **Biological Easing Physics (`cubic-bezier`):**
   - In the physical world, objects have mass and friction; **nothing starts and stops at constant linear velocity (`linear`)**. Linear UI or motion-graphic movement triggers peripheral anomaly detection because it violates Newtonian expectations.
   - **Rule:** Entering elements must use **fast onset + smooth deceleration (`cubic-bezier(0.22, 1, 0.36, 1)` / ease-out)** so **Motion Onset** captures attention immediately in frame 1–3, then settles gently into place.

## Deliverable matrix: Web UI/UX and scrollytelling (`web_ui`)

**Primary Empirical Sources:** Tuch 2012; Still 2018; Dayama 2020 (GRIDS); Segel & Heer 2010; Schloss & Palmer 2011; Kahneman 1993

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry (0-200ms)** | `top_left_anchor_and_50ms_complexity` | Primary paradox/value headline in Top-Left Optical Zone (39px min error, Still 2018); low visual clutter + high layout prototypicality in first 50ms (Tuch 2012, eta_p^2=.552). |
| **E2 · Capacity & Grid Alignment** | `grid_lines_and_cpl` | <= 4 shared alignment axes per viewport (GRIDS MILP, +34% order); <= 3 data points per Bento card with 1px #1E293B border; body copy locked to 55-68 CPL. |
| **E3 · Habituation Reset & Pattern Rupture** | `scroll_rhythm_fermata` | Every 2 dense Bento/grid viewports, insert 1 Full-Bleed Fermata or Interactive Sandbox (V1/V2/V5 rupture) with 100% causal alignment (0 decorative stock B-roll/parallax diversion). |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `color_carrier_and_cta_pop` | 60-30-10 allocation; carrier surfaces transition smoothly (dH* <= 45 deg); single CTA/Peak impulse swatch achieves dE*ab >= 45 & WCAG >= 7:1 while occupying <= 5-8% of viewport. |
| **E5 · Coping Potential & Peak-End Closure** | `martini_glass_and_final_summary` | Martini Glass scrollytelling: 3-5 author-driven setup steps -> interactive filter/comparison (93% Segel & Heer norm) -> mandatory Final Summary + 1-Click CTA Card (the rare 11% Peak-End anchor). |

## Deliverable matrix: Mobile app UI/UX and user journey (`app_ui`)

**Primary Empirical Sources:** Putkonen 2025; Hoober 2016; Fitts 1954; Fosco 2020 (UMSI); Nunes & Dreze 2006; Bar & Neta 2006

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry (0-200ms)** | `mobile_umsi_hierarchy` | Text occupies 32% more visual importance on mobile than desktop (Fosco 2020): 1 dominant status/action header (>= 2.5:1 size ratio) with instant cue-target semantic match (+1.40s search penalty if text-only without icon/color cue, Putkonen 2025). |
| **E2 · Capacity & Thumb Ergonomics** | `element_cap_and_thumb_zone` | <= 3 cards/items visible per scroll fold (+20 ms search cost per added element, Putkonen 2025); primary interactive CTA locked in Bottom-Center/Right thumb arc (48x48px min target); destructive actions isolated in Top-Left. |
| **E3 · Habituation Reset & Journey Pacing** | `step_rupture_and_haptic_pre_echo` | Break multi-step flows every <= 3 screens with an interactive preview or micro-reward state (V2/V3 haptic + 80ms visual pre-echo); zero unanchored decorative modals. |
| **E4 · Dual-Mode Color Carrier vs. Impulse** | `dark_surface_and_single_impulse` | Dark mode uses desaturated slate (#0F172A/#1E293B, 87% white text) to prevent halation; exactly 1 high-dE*ab (>= 45) impulse pill button per screen (<= 6% screen area). |
| **E5 · Coping Potential & Peak-End Closure** | `endowed_progress_and_peak_end` | Pre-fill onboarding/journey progress bars at 20-25% (Endowed Progress, Nunes & Dreze 2006); curved 16-24px container morphology (Bar & Neta 2006, 67.2% preference) + celebratory Peak-End completion receipt. |

## Sources

[^nng-scrolling-2018]: Therese Fessenden (2018), *Scrolling and Attention*, Nielsen Norman Group.
[^nng-horizontal-2017]: Therese Fessenden (2017), *Horizontal Attention Leans Left*, Nielsen Norman Group.
[^lindgaard-2006]: Gitte Lindgaard et al. (2006), *Attention Web Designers: You Have 50 Milliseconds to Make a Good First Impression!*, Behaviour & Information Technology, 25(2), 115–126.
[^tuch-2012]: Alexandre N. Tuch et al. (2012), *The Role of Visual Complexity and Prototypicality Regarding First Impression of Websites*, International Journal of Human-Computer Studies, 70(11), 794–811.
[^still-2018]: Jeremiah D. Still (2018), *Web Page Visual Hierarchy: Examining Faraday's Guidelines for Entry Points*, Computers in Human Behavior.
[^burke-2005]: Moira Burke et al. (2005), *High-Cost Banner Blindness: Ads Increase Perceived Workload, Hinder Visual Search, and Are Forgotten*, ACM TOCHI, 12(4), 423–445.
[^pernice-2018]: Kara Pernice (2018), *Banner Blindness Revisited: Users Dodge Ads on Mobile and Desktop*, Nielsen Norman Group.
