# Color and luminance

Load when you choose colors, an accent, a dark or light theme, a data color scale or a color script over time. Canonical thresholds, the hook IDs and the 26 gates are defined in [../SKILL.md](../SKILL.md). If a number here differs, `SKILL.md` wins.

## Stage 1 luminance rules (555 nm, yellow, isolation)

   - **Photopic Luminance (`555 nm`) & Color Opponency (`Itti & Koch 2001`; `Camgöz et al. 2004`):** Human photopic vision sums L-cones (`0.2126`) + M-cones (`0.7152`), peaking at `555 nm`. Pure yellow (`#FFD600`, $L = 0.9278$) achieves **19.56:1 contrast on black** (`14.6:1` on `#0F172A`) and fires both intensity and blue-yellow opponent channels.
   - **The Dark Yellow Rule:** Never place yellow text/icons directly on white (`1.07:1` contrast failure). On light backgrounds, put **dark ink (`#0B0E14`) inside a `#FFD600` fill with a dark border (`14.6:1`)**, or switch the accent to Vermilion (`#FF5500`).
   - **Von Restorff Isolation (`1933`) & Motion Onset (`Abrams & Christ 2003`):** Keep `85–90%` of the frame neutral and reserve the peak-contrast accent for **exactly 1 focal target**. Never use infinite looping animations (which habituate); trigger a **single stationary-to-moving Motion Onset (`150–250 ms`, `cubic-bezier(0.22, 1, 0.36, 1)`)**.

## Quick rules: 7-channel color selection

- **Yellow (`~555 nm`, `#FFD600`):** Peak photopic luminance (`L+M`, `19.56:1` on black, `3.95x` Von Restorff recall at `<=5%` area). Use for 1 primary badge/CTA on dark `#0F172A` or video captions; **never** on white (`1.07:1`).
- **Red (`~620-700 nm`, `#FF4D4D` on dark / `#B91C1C` on white):** Strongest `N2pc` early attentional capture (`180-250 ms`); triggers **avoidance motivation & local vigilance (`+31%` detail/proofreading accuracy, `Mehta & Zhu 2009 Science`)**. Pure `#FF0000` is `4.00:1` on white `#FFFFFF` (fails WCAG `4.5:1` for body text) and `5.25:1` on black `#000000` (passes luminance contrast, but causes chromostereopsis next to pure blue `#0000FF`). **Replication caveat:** `Steele 2014` (`N = 263`) repeated Study 1 and color explained `<1%` of variance. Do not claim that a red or blue background makes users more accurate or more creative. Use red and blue only for explicit semantic framing and contrast. **Cultural Guard:** In CN/TW/JP financial UI, **Red (`红涨`) = Gain (`+`)** and **Green (`绿跌`) = Loss (`-`)**.
- **Blue (`~450-490 nm`, `#38BDF8` on dark / `#2563EB` on white):** Triggers **approach motivation (`2x` creative outputs, `Mehta & Zhu 2009`; failed direct replication, see the red caveat)** and #1 **Brand Competence & Trust (`Labrecque & Milne 2012`)**. **Foveal S-Cone Rule (`Curcio 1991`):** Central `0.3°` fovea has **`0%` S-cones**; never put pure `#0000FF` text/thin lines on dark backgrounds (`1.28:1`, blurry) — shift to **Sky/Cyan-Blue (`#38BDF8`, `10.2:1`)**.
- **Green (`~520-560 nm`, `#10B981` on dark / `#047857` on white):** M-cone peak (`534 nm`); zero accommodation strain, **`+20%+` creative fluency (`Lichtenfeld 2012`)**, and Western `"Verified / Go / Safe"` signal. **Daltonism Guard:** `8%` of males are red-green colorblind; always pair Red/Green with icons (`✓/⚠` or `↑/↓`).
- **Orange (`~590-615 nm`, `#F97316` / `#FF5500`):** High `L+M` luminance + warm appetite salience **without** Red's error/danger anxiety. Best for e-commerce `"Add to Cart / Buy Now"` CTAs (`7.8:1` on `#0F172A`).
- **Purple / Violet (`#8B5CF6` / `#A855F7`):** Ecological rarity (`Palmer & Schloss 2010 PNAS`) signals **Luxury, Uniqueness, and AI/Synthetic Novelty** (`<=10%` accent; never use as a large background fill due to simultaneous red/blue chromatic aberration).
- **Display Polarity & `60-30-10` Budget:** Use **Light/Warm Paper (`#FAF8F5` / `#FFFFFF`)** for daylight dense reading (`+10%-18%` proofreading accuracy, `Buchner & Baumgartner 2007`); use **Dark Slate (`#0F172A`, `87%` white `#E2E8F0`)** for video, dashboards, and high-chroma hero hooks. Enforce **`60%` neutral surface, `30%` structural slate/blue, `<=10%` (`<=5%` for yellow/orange) focal accent**.

## Full-spectrum color psychophysics

**Caveat for every `Mehta & Zhu 2009` figure in this section (`+31%` detail accuracy, `2x` creativity):** the passive priming effect failed direct replication (`Steele 2014`, `N = 263`, color explained `<1%` of variance; the original had a `2.94×` luminance confound). Treat these as explicit semantic framing only. See [evidence-caveats.md](evidence-caveats.md), `P01`.

### Overview

Beyond yellow luminance (`555 nm`) and the F-pattern/Layer-Cake dichotomy, human visual attention and cognitive performance are governed by **wavelength-specific cone/ganglion pathways (`Red`, `Blue`, `Green`, `Orange`, `Purple`, and `Display Polarity`)** and **8 task-specific spatial layout architectures (`Z-Pattern/Gutenberg`, `Lawn-Mower`, `Single-Column Tunnel`, `Asymmetric Sticky Split-Screen`, `Fitts Perimeter / Mobile Thumb-Zone`, `Masonry vs. Uniform Grid`, `Hub-and-Spoke Canvas`, and `3-Tier Inverted Pyramid`)**.

---

### Part I: Full-Spectrum Color Psychophysics & Chromatic Architecture

#### 1. Complete Spectral & Cognitive Matrix Across All Primary UI/Media Colors

| Color & Wavelength | Retinal & Neural Pathway | Relative Luminance ($L$) & WCAG Contrast (`vs. #000` / `vs. #FFF`) | Cognitive & Behavioral Effect (Empirical Metric) | Primary Citation | Optimal Application & Hard Failure Boundary |
|---|---|---|---|---|---|
| **Yellow / Gold** (`~555 nm`, `#FFD600`) | Peak `L + M` photopic luminance + `S-(L+M)` blue-yellow opponency | $L = 0.71\text{–}0.93$<br>**`16.5:1–19.6:1` on Black**<br>`1.07:1` on White (FAIL) | Fastest pre-attentive fixation (`150–250 ms`); `3.95×` Von Restorff recall when capped at `≤5%` area | Camgöz et al. (`2002`, `2004`) | **Use for:** Single primary CTA/badge on dark `#0F172A`, video captions, dataviz outlier.<br>**Never:** Yellow text/icons on white (`1.07:1`). |
| **Red / Crimson** (`~620–700 nm`, `#EF4444` / `#FF3B30`) | `L-cone` dominance; strong lateralized `N2pc` ERP capture (`180–250 ms`) | Pure `#FF0000`: $L = 0.2126$<br>`5.25:1` on Black / `4.00:1` on White (white fails `4.5:1`) | Activates **avoidance motivation & local vigilance**: **`+31%` detail/proofreading accuracy**, narrows creative breadth; **`+21%` CTA lift** when contrasting against green/blue pages | [Mehta & Zhu (2009, *Science*)](https://doi.org/10.1126/science.1169144); [Kuniecki et al. (2015)](https://doi.org/10.1167/15.10.21) | **Use for:** Urgent deadlines, destructive warnings, or high-arousal CTAs (`#FF4D4D` on dark = `6.8:1`; `#B91C1C` on white = `6.4:1`).<br>**Cultural Reversal:** In CN/TW/JP finance, **Red (`红涨`) = Gain (`+`)**! |
| **Blue / Cyan-Blue** (`~450–490 nm`, `#3B82F6` / `#38BDF8`) | `S-cone` (`420 nm`) + `ipRGC` melanopsin (`480 nm`) alertness pathway | Pure `#0000FF`: $L = 0.0722$ (`1.28:1` on Black, FAIL; `8.59:1` on White)<br>Sky `#38BDF8`: **`10.2:1` on `#0F172A`** | Activates **approach motivation**: **`2×` creative problem-solving outputs**; #1 driver of **Brand Competence, Trust & Security** ($p < 0.001$) | [Mehta & Zhu (2009)](https://doi.org/10.1126/science.1169144); [Labrecque & Milne (2012)](https://doi.org/10.1007/s11747-010-0245-y) | **Use for:** Enterprise SaaS, fintech trust surfaces, exploratory/creative workspaces.<br>**Foveal Blindspot:** Central `0.3°` fovea has **`0%` S-cones** (`Curcio 1991`); never put pure `#0000FF` text/lines on dark backgrounds (use `#38BDF8` Sky Blue). |
| **Green / Emerald** (`~520–560 nm`, `#10B981` / `#22C55E`) | `M-cone` peak (`534 nm`); zero lens accommodation strain | `#10B981`: $L = 0.43$<br>**`8.4:1` on `#0F172A`**<br>`#047857`: **`5.5:1` on `#FFFFFF`** | **"Fertile Green" effect:** **`+20%+` creative fluency** with low heart-rate arousal (`Lichtenfeld 2012`); universal Western "Safe / Verified / Go" signal | [Palmer & Schloss (2010)](https://doi.org/10.1073/pnas.0906172107) | **Use for:** Verification badges, positive deltas (Western), safe progression.<br>**Daltonism Guard:** **`8%` of males** are red-green colorblind; never rely on Red vs. Green alone without `✓/⚠` or `↑/↓` icons. |
| **Orange / Amber** (`~590–615 nm`, `#F97316` / `#FF5500`) | High `L + M` luminance + warm `L-M` chromatic salience | `#F97316`: $L = 0.36$<br>**`7.8:1` on `#0F172A`**<br>`#C2410C`: **`5.2:1` on `#FFFFFF`** | Captures high bottom-up warmth/appetitive urgency **without** triggering Red's error/threat avoidance reflex | [Labrecque & Milne (2012)](https://doi.org/10.1007/s11747-010-0245-y) | **Use for:** E-commerce "Add to Cart / Buy Now" CTAs (Amazon `#FF9900`, Shopee/Taobao `#FF5500`) and non-destructive warnings. |
| **Purple / Violet** (`~380–450 nm` / `R+B`, `#8B5CF6` / `#A855F7`) | Simultaneous `L-cone` (long) + `S-cone` (short) dual-extremity stimulation | `#A855F7`: $L = 0.25$<br>**`5.6:1` on `#0F172A`**<br>`#6D28D9`: **`7.1:1` on `#FFFFFF`** | Ecological rarity drives highest ratings for **Luxury, Uniqueness, Magic, and AI/Synthetic Novelty** | [Palmer & Schloss (2010, *PNAS*)](https://doi.org/10.1073/pnas.0906172107) | **Use for:** AI copilot features, premium/pro badges (`≤10%` area).<br>**Never:** Large purple background fills (simultaneous red/blue chromatic aberration fatigues ciliary muscles). |
| **Display Polarity (Light vs. Dark)** | Pupil constriction (`2–3 mm` in Light Mode) vs. Emissive Contrast (`Dark Mode`) | Light: `#1E293B` on `#FFFFFF` (`13.6:1`)<br>Dark: `#E2E8F0` on `#0F172A` (`13.2:1`) | **Light Mode:** **`+10% to +18%` faster proofreading & dense text reading** in daylight.<br>**Dark Mode:** Superior chromatic pop (`16:1–19:1`) for media, charts & dark rooms | [Buchner & Baumgartner (2007)](https://doi.org/10.1080/00140130701506439) | **Use Light/Warm Paper (`#FAF8F5`)** for long-form docs/editorial reading; **use Dark Slate (`#0F172A`)** for video, dashboards, and high-chroma hero hooks. |

#### 2. The `60–30–10` Chromatic Budget & Opponent-Channel Harmony
To preserve the **Von Restorff isolation effect (`3.95×` salience)**:
1. **`60%` Dominant Neutral Ground:** `#0F172A` / `#121212` (Dark Mode) or `#FFFFFF` / `#FAF8F5` (Light Mode).
2. **`30%` Structural & Trust Secondary Tone:** Low-saturation cool slate/blue (`#1E293B` / `#3B82F6`) for cards, navigation, and secondary containers.
3. **`10%` (and `≤5%` for `#FFD600` / `#FF5500`) Opponent Focal Accent:** Pick an accent on the **opposite cone-opponent axis** (`Blue-Yellow S-(L+M)` or `Green-Red L-M`) from your `30%` structural tone so V1 opponent ganglion cells fire at maximum gain.

## Relational color law: dark-is-more and hotspot-is-more

- **Dark-is-More vs. Hotspot-is-More Relational Color Law (`Schoenlein & Schloss 2022 IEEE TVCG`; `Braun & Schloss 2025`):**
  - On **Light Mode (`#FFFFFF` / `#FAF8F5`)**, map **higher data magnitude -> darker/higher-chroma colors** (**Dark-is-More bias**; inverting this adds `+180-320 ms` decoding lag).
  - On **Dark Mode (`#0F172A`)**, map **higher data magnitude -> higher-luminance colors (`#FFD600` / `#38BDF8`)** (**Hotspot-is-More**).
  - **CIELAB Affective Quadrants (`Braun & Schloss 2025`):** High Arousal + Positive = `L* > 70, C* > 65, h° ∈ [25°, 90°]` (Yellow-Orange-Coral); High Arousal + Threat = steep `L*` drop + `C* > 70, h° ∈ [350°, 35°]` (Red-Crimson); Calm + Trustworthy = `L* ∈ [55, 85], C* ∈ [30, 55], h° ∈ [155°, 245°]` (Cyan-Blue-Emerald).

## CIELAB affective color scales and relational contrast

Full-text analysis of **Schoenlein et al. (2022, *IEEE TVCG*)** and **Braun, Mukherjee, Gorelik, & Schloss (2025, *IEEE TVCG*)** establishes two quantitative laws for color palettes:
1. **Direct ($w_A$) vs. Relational ($w_D$) Color Decoding (`Schoenlein et al. 2022`):**
   - Viewers decode meaning from a weighted sum: $\text{Merit} = w_A \cdot \text{Direct Association} + w_D \cdot \text{Dark-is-More Bias}$.
   - When a color scale conflicts with the **Dark-is-More Bias** on a light background (e.g., mapping *higher* numbers to *lighter* pastel colors on a white page), response times slow down by **`+180–320 ms`** and interpretation error jumps! **Rule:** On light backgrounds, always map **higher magnitude $\to$ darker/more saturated chroma**; on dark backgrounds (`#0F172A`), map **higher magnitude $\to$ higher luminance (`#FFD600` / `#38BDF8`)** (**Hotspot-is-More**).
2. **The 4 CIELAB Affective Color quadrants (`Braun & Schloss 2025`):**
   - **High Arousal + Positive Valence (*"Exciting / Joyful / Playful"*):** High lightness ($L^* > 70$), high chroma ($C^* > 65$), warm **Yellow–Orange–Coral trajectory ($h^\circ \in [25^\circ, 90^\circ]$)**.
   - **High Arousal + Negative Valence (*"Urgent / Threat / Critical Alert"*):** Steep lightness drop ($L^*: 80 \to 25$), high chroma ($C^* > 70$), **Red–Magenta–Dark Crimson trajectory ($h^\circ \in [350^\circ, 35^\circ]$)**.
   - **Low Arousal + Positive Valence (*"Calm / Trustworthy / Restorative"*):** High-to-medium lightness ($L^* \in [55, 85]$), moderate chroma ($C^* \in [30, 55]$), **Cyan–Blue–Emerald trajectory ($h^\circ \in [155^\circ, 245^\circ]$)**.
   - **Low Arousal + Negative Valence (*"Somber / Depressed / Muted"*):** Low lightness ($L^* < 45$), low chroma ($C^* < 25$), desaturated **Slate–Brown–Olive trajectory**.

## Shape morphology and temporal color scripting

### 5. Shape/Form Morphology (`Bar & Neta, 2006`) & Temporal Color Scripting (`Braun & Schloss, 2025`)

#### 5.1 Contour Curvature vs. Sharp Angularity (`Bar & Neta, 2006`)
- In controlled 84 ms exposures (`N = 14`) , human observers significantly preferred **curved contours over sharp-angled contours** for both real everyday objects (**`67.2%` vs. `50.6%` liking, $t(13) = 3.53, p < 0.01, Cohen's\ d = 0.94$**) and novel abstract patterns (**`37.9%` vs. `24.8%`, $t(13) = 2.56, p < 0.05$**), with zero reaction-time fluency difference. (`Bar & Neta, 2006` hypothesize a low-spatial-frequency threat mechanism, tested in their later 2007 fMRI work; note also that their exploratory letter-font check was confounded by stroke thickness).
- **Morphology Design Law:** Sharp V-angles, jagged polygons, and compressed diagonal grids signal **low-level threat / friction** (ideal ONLY for **Quintile 2/3 Crisis Beats**, destructive warnings, or **Flavor 3 Indignation/Alert**). Curved cards (`border-radius: 12–24px`), circular avatars, and open organic contours signal **safety, approachability, and trust** (ideal for **Quintile 1 Onboarding**, **Quintile 5 Resolution CTAs**, and **Flavor 4/5 Warmth & Elevation**).

#### 5.2 Temporal Color Scripting Across the 5 Quintiles
Synchronizing **Lightness ($L^*$), Chroma ($C^*$), and Hue ($h^\circ$)** (`Braun & Schloss, 2025`) with the 5-Quintile Narrative & Emotional Arc:
- **$Q_1$ (`0–20%` Establisher & Hook):** High-contrast focal pop (`#FFD600` Yellow or `#38BDF8` Cyan-Blue on `#0F172A` Dark Slate, $14.6:1$ contrast) to capture pre-attentive V1 salience while grounding the protagonist.
- **$Q_2$ (`20–40%` Complication & Tension Rise):** Desaturate chroma ($C^* < 30$) and lower lightness ($L^* \in [25, 45]$) into cool slate/charcoal (`#334155` / `#475569`) with tighter grid spacing to visually compress the frame.
- **$Q_3$ (`40–60%` Prolongation & Twist Pivot):** Sharp chromatic shift toward warm high-arousal alert (`#EF4444` Crimson or `#F97316` Orange-Amber, $h^\circ \in [25^\circ, 40^\circ]$) at the exact moment of the counterfactual twist or crisis peak.
- **$Q_4$ (`60–80%` Climax Peak & Breakthrough):** Maximum luminance expansion ($L^* > 80$, `#FFD600` Gold or `#A855F7` Electric Violet focal bloom) paired with full-bleed whitespace ($\ge 45\%\ W_{\text{FS}}$) to maximize awe and event-boundary memory encoding.
- **$Q_5$ (`80–100%` Release & Collective Action):** Settle into high-lightness, moderate-chroma restorative hues (`#10B981` Fertile Emerald or `#0EA5E9` Trust Sky-Blue) with rounded safe contours (`Bar & Neta, 2006`) for the terminal CTA.

## Dual-mode chromatic physics: continuous carrier and orthogonal impulse

Surface techniques (`B-roll`, `zoom cuts`, `yellow buttons`, `drop silence`) change across platforms and decay under audience habituation. What never changes are the **3 Invariant Neuro-Perceptual Laws** from which a creator can systematically invent new techniques across any medium.

### 1. Law I — Dual-Mode Chromatic Physics: Continuous Harmonic Carrier vs. Orthogonal Peak-End Impulse

The human visual-affective system processes multi-color combinations through **two opposing mathematical engines** (`Schloss & Palmer, 2011`; `Ou et al., 2004, 2010`; `Wilms & Oberfeld, 2018`; `Palmer, Schloss, & Sammartino, 2013`):

#### 1.1 Engine A: The Continuous Affective Carrier (Cyclical Emotion Modulation)
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

#### 1.2 Engine B: The Orthogonal Impulse Function (Peak-End Memory & CTA Trigger)
1. **Why Harmony Cannot Trigger Action (`Schloss & Palmer, 2011`):**
   - While harmony requires hue similarity, **Figural Preference (`pop / readability of a figure against ground`)** is driven by **lightness and chromatic contrast ($12.0\%$ independent variance)**!
2. **Conditional Peak-End Encoding (`Kahneman et al., 1993`, $N=32 + 37$):**
   - Retrospective evaluation and post-experience choice exhibit **Duration Neglect ($r = .16$)** and track **Peak + End intensity ($r = .80$)** — **but ONLY when the Ending delivers a felt improvement over the Peak tension (`Improvers`: `81.8%` chose to repeat vs. `45.5%` in `Non-Improvers`)**!
   - **Generative Impulse Rule:** Reserve **Complementary / Orthogonal Chromatic Contrast ($\Delta E^*_{ab} \ge 45$, $\Delta L^* \ge 35$, high $C^*$)** strictly for **(1) the Peak Climax (`P*`)** and **(2) the Restorative End / CTA Trigger (`Q5`)**, keeping its spatial/temporal footprint **strictly $\le 5\text{ to }8\%$** so `Von Restorff` isolation never habituates!
   - **How to Invent New Color Techniques (`Salience = Derivative`):** Because salience is $\partial \text{Color} / \partial \text{Carrier}$, you never need a cliched yellow/red button:
     - On a **High-Key Warm Cream Carrier ($L^*=94, C^*=12, h^\circ=75^\circ$)**, an **Obsidian-Indigo Impulse ($L^*=12, h^\circ=265^\circ$, $\Delta E^*_{ab} = 84$)** achieves massive Peak/CTA pop with luxury semantics.
     - On an **Achromatic Slate Carrier ($C^* < 6$)**, a **single saturated stroke ($C^* > 70$) of ANY hue** acts as an instant chromatic impulse.

---
