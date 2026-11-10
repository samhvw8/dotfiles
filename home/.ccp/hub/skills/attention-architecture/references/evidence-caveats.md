# Evidence caveats

Load when a claim needs its evidence strength, when you cite a paper by `P` number, or before you build a rule on a famous effect. Canonical thresholds, the hook IDs and the 26 gates are defined in [../SKILL.md](../SKILL.md). If a number here differs, `SKILL.md` wins.

## The replication-crisis filter: 3-tier evidence hierarchy

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
│   ├─ Narrative Transportation (van Laer 2014 P49b: r = .41 attitude, d = 0.90)    │
│   └─ Reference Class Forecasting & 3-Reason Pre-Mortem (Flyvbjerg 2023; Sanna 02) │
│  TIER 2: CONDITIONAL LAWS WITH HARD BOUNDARIES (Fails if Boundary Violated!)      │
│   ├─ Decoy / Asymmetric Dominance (P45): +9–14 pp in NUMERIC TABLES ONLY;         │
│   │  collapses to d = 0.00 on visual/experiential photo grids!                    │
│   ├─ Loss Aversion (P44: λ = 1.81): Requires ENDOWMENT or medium/high stakes;     │
│   │  vanishes (λ ≈ 1.00) for routine outlays < $10–$20!                           │
│   ├─ Choice Overload (P46): Main effect g = 0.02; triggers (d = -0.62) ONLY when  │
│   │  Complexity + Task Difficulty + Uncertainty + Buying Goal co-occur!           │
│   └─ Identifiable Victim (N = 1, +108%): Collapses at N = 2 (-23%) or when        │
│      combined in the same beat with macro statistics (-40%, Small et al. 2007)!   │
│  TIER 3: DEBUNKED / RETRACTED / PSEUDOSCIENCE (d ≈ 0.00 — NEVER USE)              │
│   ├─ ✗ Ego Depletion / Glucose Willpower (Hagger 2016 P38: d = 0.04; Vohs d=0.06) │
│   ├─ ✗ Signing at Top of Form for Honesty (Shu et al. 2012 — RETRACTED, d=0.004)  │
│   ├─ ✗ Subliminal / Money / Flag / Elderly Social Priming (P35: d = -0.02–0.03)   │
│   ├─ ✗ Power Posing & Pencil-in-Mouth Facial Feedback (Wagenmakers 2016: d=0.03)  │
│   └─ ✗ Unconscious Thought Theory (g = -0.02) & Rhyme-as-Reason Truth (d = 0.02)  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Also Tier 3 (found in the full-text audit):**

- **Red or blue background priming** (`Mehta & Zhu 2009`, `P01`): failed direct replication (`Steele 2014`, `N = 263`, color explained `<1%` of variance; `2.94×` luminance confound). Use red and blue for explicit semantic framing and contrast only.
- **Bare `N = 1` name-drop in a text vignette:** null effect (`d = 0.02`, `Maier 2023`). The identifiable-victim effect needs a concrete sensory story that is not paired with aggregate statistics.
- **Dunning-Kruger quartile chart** (`P72`): a statistical artefact ($R^2_{\text{quad}} \approx .00$).

## Citation index `P01–P74` (one ID, one paper)

The full ledger with risk-of-bias verdicts is in the research repository: `~/workspace/research/261107-attention-information-architecture/.okf/mechanisms/paper-appraisal-ledger.md`. Appendices A–C below hold `P01–P34`.

Two labels had two meanings in earlier versions of this skill. They are now fixed:

- `P31` is only Harp & Mayer (1998). Robertson et al. (2023) is `P14`.
- `P49` covered two papers. `P49a` is Gigerenzer & Gaissmaier (2011). `P49b` is van Laer et al. (2014).

Older text in this skill sometimes puts a different `P` number next to an author and year (for example in the audit gates written before the ledger was renumbered). When the number and the author disagree, trust the author and year, then find the ID in this table.

| ID | Paper |
|---|---|
| `P01` | Mehta & Zhu (2009, *Science*) |
| `P02` | Palmer & Schloss (2010, *PNAS*) |
| `P03` | Labrecque & Milne (2012, *JAMS*) |
| `P04` | Schoenlein et al. (2022, *IEEE TVCG*) |
| `P05` | Braun et al. (2025, *IEEE TVCG*) |
| `P06` | Tuch et al. (2012, *IJHCS*) |
| `P07` | Miniukovich & De Angeli (2015, *ACM CHI*) |
| `P08` | Baughan et al. (2021, *ACM CHI*) |
| `P09` | Bylinskii et al. (2017, *ACM UIST*) |
| `P10` | Fosco et al. (2020, *ACM UIST* — UMSI) |
| `P11` | Dayama et al. (2020, *ACM CHI* — GRIDS) |
| `P12` | Putkonen et al. (2025, *IJHCS*) |
| `P13` | Gruber, Gelman, & Ranganath (2014, *Neuron*) |
| `P14` | Robertson et al. (2023, *Nature Human Behaviour*) |
| `P15` | Teixeira, Wedel, & Pieters (2012, *JMR*) |
| `P16` | Cutting, DeLong, & Nothelfer (2010, *Psych. Science*) |
| `P17` | Cohn (2013, *Cognitive Science*) |
| `P18` | Reagan, Mitchell, Kiley, Danforth, & Dodds (2016, *EPJ Data Science* / arXiv v3) |
| `P19` | Boyd, Blackburn, & Pennebaker (2020, *Science Advances*) |
| `P20` | Zacks, Speer, Swallow, Braver, & Reynolds (2007, *Psychological Bulletin*) |
| `P21` | Zwaan, Langston, & Graesser (1995, *Psychological Science*) |
| `P22` | Segel & Heer (2010, *IEEE TVCG*) |
| `P23` | Silvia (2008, *Current Directions in Psych. Science*) |
| `P24` | Hidi & Renninger (2006, *Educational Psychologist*) |
| `P25` | Lakatos, Gross, & Thut (2019, *Current Biology*) |
| `P26` | Bar & Neta (2006, *Psychological Science*) |
| `P27` | Schloss & Palmer (2011, *Attention, Perception, & Psychophysics*) |
| `P28` | Ou, Luo, Woodcock, & Wright (2004, *Color Res. Appl.* Part II) |
| `P29` | Wilms & Oberfeld (2018 / online 2017, *Psychological Research*) |
| `P30` | Palmer, Schloss, & Sammartino (2013, *Annual Review of Psychology*) |
| `P31` | Harp & Mayer (1998, *Journal of Educational Psychology*) |
| `P32` | Ou, Luo, Sun, Hu, Chen et al. (2010/2012, *Color Res. Appl.*) |
| `P33` | Vroomen & Keetels (2010, *Attention, Perception, & Psychophysics*) |
| `P34` | Kahneman, Fredrickson, Schreiber, & Redelmeier (1993, *Psychological Science*) |
| `P35` | Klein et al. (2014, *Social Psychology*) |
| `P36` | Camerer et al. (2016, *Science*) |
| `P37` | Camerer et al. (2018, *Nature Human Behaviour*) |
| `P38` | Hagger et al. (2016, *Perspectives on Psych. Science*) |
| `P39` | Mertens, Herberz, Hahnel, & Brosch (2022, *PNAS*) |
| `P40` | Maier, Bartoš, Stanley, Shanks, Harris, & Wagenmakers (2022, *PNAS*) |
| `P41` | Szaszi, Higney, Charlton, Gelman et al. (2022, *PNAS*) |
| `P42` | DellaVigna & Linos (2022, *Econometrica*) |
| `P43` | Jachimowicz, Duncan, Weber, & Johnson (2019, *Behavioural Public Policy*) |
| `P44` | Brown, Imai, Vieider, & Camerer (2024, *Journal of Economic Literature*) |
| `P45` | Frederick, Lee, & Baskin (2014, *Journal of Marketing Research*) |
| `P46` | Chernev, Böckenholt, & Goodman (2015, *Journal of Consumer Psychology*) |
| `P47` | Norton, Mochon, & Ariely (2012, *Journal of Consumer Psychology*) |
| `P48` | Gigerenzer & Hoffrage (1995, *Psychological Review*) |
| `P49a` | Gigerenzer & Gaissmaier (2011, *Annu. Rev. Psychol.*) |
| `P49b` | van Laer et al. (2014, *JCR*) |
| `P50` | Dechêne, Stahl, Hansen, & Wänke (2010, *PSPR*) |
| `P51` | Clark & Paivio (1991, *Educ. Psychol. Rev.*) |
| `P52` | Brysbaert, Warriner, & Kuperman (2014, *Behav. Res. Methods*) |
| `P53` | Packard & Berger (2020/2021, *J. Consumer Research*) |
| `P54` | Hansen & Wänke (2010, *PSPB*) |
| `P55` | Berger & Milkman (2012, *J. Marketing Research*) |
| `P56` | Packard, Moore, & McFerran (2018, *J. Marketing Research*) |
| `P57` | Patrick & Hagtvedt (2012, *J. Consumer Research*) |
| `P58` | Bryan, Walton, Rogers, & Dweck (2011, *PNAS*) |
| `P59` | Carpenter (2013, *Communication Studies*) |
| `P60` | Fillon, Strauch, & Feldman (2023, *Meta-Psychology*) |
| `P61` | Levy (2008, *Cognition*) |
| `P62` | Jaeger (2010, *Cognitive Psychology*) |
| `P63` | Gibson (1998, *Cognition*) |
| `P64` | Petty, Cacioppo, & Heesacker (1981, *JPSP*) |
| `P65` | Thaler (1985, *Marketing Science*) |
| `P66` | Prelec & Loewenstein (1998, *Marketing Science*) |
| `P67` | Gourville (1998, *J. Consumer Research*) |
| `P68` | Shampanier, Mazar, & Ariely (2007, *Marketing Science*) |
| `P69` | Slovic, Finucane, Peters, & MacGregor (2007, *EJOR*) |
| `P70` | Loewenstein, Weber, Hsee, & Welch (2001, *Psychol. Bulletin*) |
| `P71` | Rozenblit & Keil (2002, *Cognitive Science*) |
| `P72` | Gignac & Zajenkowski (2020, *Intelligence*) |
| `P73` | Camerer, Loewenstein, & Weber (1989, *J. Political Economy*) |
| `P74` | Gilovich, Medvec, & Savitsky (2000, *JPSP*) |


## The 10 highest-certainty design and engineering laws

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

## Appendix A: forensic appraisal ledger `P01–P16`

### Overview

Following the **`paper-appraisal` methodology (`Cochrane RoB 2`, `JBI Quasi-Experimental & Analytical`, `ML Evidence Checks`, and `Insight Review`)**, all **16 full-text primary PDFs (`52.2 MB`)** in `~/workspace/research/261107-attention-information-architecture/papers/` were audited cover-to-cover (`reports/f1..f4`, `231 KB` total).

Crucially, **`paper-appraisal` separates two questions**:
1. **Is the mechanism/idea useful?**
2. **Does the paper's full-text data and post-publication replication record actually prove it?**

Several widely cited "pop-science UX rules" fail or shrink when audited against the full text and replication literature, while several less-known quantitative mechanisms emerge much stronger.

---

### 1. Master 34-Paper Forensic Appraisal & Certainty Ledger

| # | Paper & Local Report | Study Design & Sample ($N$) | Appraisal Tool & Risk of Bias | Full-Text Verified Finding & Exact Statistic | Forensic Caveat / What Failed or Shrunk in Full-Text Audit | Evidence Certainty |
|---|---|---|---|---|---|---|
| **P01** | **Mehta & Zhu (2009, *Science*)**<br>`f1-appraisal-color-psychophysics.md` | 6 lab studies ($N = 666$ total undergrads; `0–240` HSL color space) | **RoB 2 (2019):** **High Risk** | Study 1 proofreading $F(2,66)=8.59$; Study 2 brick creativity $p<.03$; Study 5 camera ad framing interaction ($p<.02$). | **FAILED DIRECT REPLICATION:** `Steele (2014, Psychon Bull Rev, N=263)` replicated Study 1 with exact colors & instructions: **color explained `<1%` of variance**. Moreover, equating HSL `L=120` produced `#FF0000` vs. `#0000FF` — a **`2.94×` luminance confound**! Do **not** claim background red/blue makes users smarter/more creative; use Red/Blue only for **explicit semantic framing (Study 5)** and opponent contrast. | **Low** (for passive IQ/creativity priming) · **Moderate** (for explicit ad/UI framing) |
| **P02** | **Palmer & Schloss (2010, *PNAS*)**<br>`f1-appraisal-color-psychophysics.md` | Psychophysical rating across 32 BCP colors ($N = 251$ across sub-studies) | **JBI Analytical (2023):** **Low-to-Moderate** | **WAVE** (**Weighted Affective Valence Estimate**) correlates **$r = .893$ ($80\%$ of variance)** with US color preference (`Blue` peak; `Dark Yellow-Olive` & `Dark Orange-Brown` trough). | Cross-cultural fit drops to **`≤50%` of variance** in non-Western samples (`Al-Rasheed et al. 2022`, `Taylor et al. 2013`); the causal school-spirit/slideshow claims in the paper are reported without inferential statistics. | **High** (US/Western UI preference) · **Moderate** (global) |
| **P03** | **Labrecque & Milne (2012, *JAMS*)**<br>`f1-appraisal-color-psychophysics.md` | 4 studies ($N = 1,187$ raters, `100` real brands) | **RoB 2 (Studies 1–3) + JBI (Study 4):** **Moderate** | **Red $\to$ Excitement ($\beta = .534$)**, **Blue $\to$ Competence ($\beta = .522$)**, **Black/Purple $\to$ Sophistication**, **Brown $\to$ Ruggedness**; High Saturation raises Excitement; High Value reduces Ruggedness. | On familiar real-world brand logos (Study 4), official color moves ratings by only **`~0.1` on a 5-point scale** because prior brand familiarity overrides hue; authors counted $p < .10$ as partial support. | **Moderate-to-High** (for new/unfamiliar brands & UI badges) |
| **P04** | **Schoenlein et al. (2022, *IEEE TVCG*)**<br>`f1-appraisal-color-psychophysics.md` | 3 online experiments ($N \approx 2,260$) | **RoB 2 + ML Checks:** **High** | Viewers decode a legendless color scale via **$0.70 \times \text{Direct Meaning} + 0.30 \times \text{Dark-is-More}$** on held-out participants. | Direct meaning overrides Dark-is-More only when association difference reaches **$\Delta A \ge 0.55$** (tested on sunshine); weights apply to linear scales on a white background (RT penalty comes from `Schloss et al. 2019`). | **High** |
| **P05** | **Braun et al. (2025, *IEEE TVCG*)**<br>`f2-appraisal-affective-color-and-aesthetics.md` | **2 experiments** (not 3) + Tables S.1–S.8 ($N = 260$) | **JBI Quasi-Experimental (2023):** **Low-to-Moderate** | **Valence:** lighter ($L^*$) + higher chroma ($C^*$) + bluer ($-b^*$), **adj. $R^2 = .924$**; **Calm:** bluer ($\beta = -.104$); **Trustworthy:** bluer + lighter (**zero chroma effect**); pixel-frequency weighting drops AIC by `89–231`. | Hue enters via Cartesian **`a*` and `b*` axes**, not polar $h^\circ$; tested on single-hue ramps on uncalibrated monitors. | **High** |
| **P06** | **Tuch et al. (2012, *IJHCS*)**<br>`f2-appraisal-affective-color-and-aesthetics.md` | 2 factorial studies: Study 1 (`50, 500, 1000 ms`, $N=120$); Study 2 (`17, 33, 50 ms`, $N=136$) | **RoB 2 (2019):** **Low** | At **`17 ms`**, Complexity ($\eta_p^2 = .38$) > Prototypicality ($\eta_p^2 = .19$); by **`33 ms`** they are equal; at **`50 ms`**, Prototypicality ($\eta_p^2 = .812$) & Complexity ($\eta_p^2 = .581$) interact strongly (**$\eta_p^2 = .604$**). | **Crucial interaction:** Prototypical layout boosts beauty massively on **low-complexity pages ($d = 1.96$)**, but barely helps when a page is visually cluttered (**high-complexity $d = 0.24$**)! | **High** |
| **P07** | **Miniukovich & De Angeli (2015, *ACM CHI*)**<br>`f2-appraisal-affective-color-and-aesthetics.md` | 2 studies (Desktop Web `150 ms` & `4 s`; Mobile iPhone apps) | **ML Checks + RoB 2:** **Moderate** | Desktop Web **$R^2 = .49$ at `150 ms`** and **$R^2 = .43$ at `4 s`** (out-of-sample $R^2 \approx .42$); iPhone **$R^2 = .13\text{–}.18$** (`.32` with genre). Clutter/Entropy, Edge Congestion, Symmetry, and Dominant Colors (`≤4`) lead. | In the multivariable regression, `grid quality` flips sign due to collinearity with symmetry and edge congestion; not all 8 metrics survive in mobile (`only 4 stay`). | **Moderate-to-High** |
| **P08** | **Baughan et al. (2021, *ACM CHI*)**<br>`f2-appraisal-affective-color-and-aesthetics.md` | Online visual search & recall experiment ($N = 151$ US & JP; 6 sites) | **JBI Analytical (2023):** **Moderate** | **Country $\times$ Complexity $F = 37.18$**: US/JP search speed gap is small on low-complexity sites ($d = 0.56$) but huge on high-complexity sites (**$d = 1.86$; JP `18.6 s` vs. US `6.1 s`**). Main-content area recall beats sidebars (**OR `4.07×` JP, `2.29×` US**). | **No eye-tracker was used** in this paper (click-search RT + recall; eye-tracking is cited from prior work). Structural `1px` grid rules are an engineering synthesis across `Baughan 2021` + `Dayama 2020`, not directly randomized in `Baughan 2021`. | **Moderate** |
| **P09** | **Bylinskii et al. (2017, *ACM UIST*)**<br>`f3-appraisal-layout-and-visual-importance.md` | Deep FCN on MASSVIS + Graphic Designs (`BubbleView`) | **ML Evidence Checks:** **Moderate** | Titles receive highest fixations/clicks (model vs. eye-tracking rank **$r_s = .96$**); chart prediction $CC = 0.69, KL = 0.33$ vs. DeepGaze $0.57 / 3.48$; importance-cropped thumbnails cut chart-finding clicks from **`3.25` to `1.96` (`-40%`)**. | Single-run metrics without confidence intervals; exact percentages for faces/legends appear qualitatively in bar figures rather than tabulated numbers. | **Moderate-to-High** |
| **P10** | **Fosco et al. (2020, *ACM UIST* — UMSI)**<br>`f3-appraisal-layout-and-visual-importance.md` | **UMSI** trained on `Imp1k` (`1,000` designs across 5 classes) | **ML Evidence Checks:** **Moderate** (vs. 2017 model) | Conditioning on the 5 design classes raises $CC$ from **`.802` to `.875`**; **text carries `+32%` more importance weight in Ads than in Infographics**; webpage importance sits **Top-Left**; human annotators mark **at most `~7` elements**. | Beats the best general saliency model on natural/graphic benchmarks by only `.009 CC`; the interactive layout-reflow study retained 43 of 100 crowd workers. | **Moderate** |
| **P11** | **Dayama et al. (2020, *ACM CHI* — GRIDS)**<br>`f3-appraisal-layout-and-visual-importance.md` | Exact **MILP (`Eqs. 1–5`)** + 13-rater / 12-designer study | **Computational Checks + JBI:** **Moderate (MILP) / Low (user study)** | MILP optimizes: (1) non-overlap, (2) **fewest alignment grid lines**, (3) rectangular hull outline, and (4) preferred/relative placement. Layout ratings: **`72` vs. `43` vs. `21` / 100**. | Main text Eqs. 1–5 use preferred/locked placement rather than a fixed "Primary Optical Area" constant; user study $F(2,12)$ degrees of freedom have a reporting typo and no baseline tool comparison. | **High** (for MILP math) · **Low** (user study) |
| **P12** | **Putkonen et al. (2025, *IJHCS*)**<br>`f3-appraisal-layout-and-visual-importance.md` | Eye-tracked GUI visual search experiment | **JBI Quasi-Experimental (2023):** **Moderate-to-High** | **Missing target adds `+6.97 s`** (largest penalty); **Text-only cue adds `+1.40 s` vs. visual icon/image cue**; **Mobile is `2.23 s` faster than Desktop Web**; **each extra UI element adds `+20 ms`**; scanpath is **Top-Left $\to$ Scan $\to$ Confirm**. | Overall static complexity explains only marginal $R^2 = .053$ once element count (`+20 ms/item`) and cue type (`+1.40 s`) are controlled. | **High** |
| **P13** | **Gruber, Gelman, & Ranganath (2014, *Neuron*)**<br>`f4-appraisal-curiosity-video-and-hooks.md` | fMRI ($N = 19$) + behavioral follow-up | **JBI Quasi-Experimental (2023):** **High (target recall) / Low (incidental spillover)** | Answers to high-curiosity questions are recalled **`70.6%` vs. `54.1%` (`+30.5%` relative, $p < .001$)** and hold at 24 hours (**High certainty**). `SN/VTA` and `NAcc` fire at **question onset**, not answer reveal. | **Critical distinction:** The incidental face memory spillover (`41.9%` vs. `37.2%`) only passed a **one-tailed test** ($N = 19$)! Therefore, **make your core message/product the actual answer to the curiosity hook (`70.6%` recall)** rather than an unrelated bystander shown during the wait! | **High** (for hook-integrated payoff) · **Low** (for unrelated bystander ad) |
| **P14** | **Robertson et al. (2023, *Nature Human Behaviour*)**<br>`f4-appraisal-curiosity-video-and-hooks.md` | **Stage-2 Registered Report** on `53,699` confirmatory headlines across `12,448` Upworthy A/B tests | **RoB 2 (2019):** **Low (Gold Standard)** | Each **negative word raises CTR `+2.3%`**; each **positive word lowers CTR `-1.0%`**. **Headline length has an effect `~2.7×` larger than negativity!** **Moralized wording lowers clicks.** | Among pre-registered emotions (`LIWC, NRC, SentiStrength`), **Sadness (`+`)** raised clicks and **Joy (`-`)** lowered clicks, but **Anger was null** and **Fear went negative (`-`)**! Topics are `Government & Economy, People, Life, Parenting, LGBT, Women's Rights, Entertainment`. | **High** |
| **P15** | **Teixeira, Wedel, & Pieters (2012, *JMR*)**<br>`f4-appraisal-curiosity-video-and-hooks.md` | Joint Bayesian model of skipping & **Individual Attention Dispersion (IAD)** across `28` video ads ($N=50$ analyzed of $58$) | **JBI Quasi-Experimental (2023):** **Moderate** | **Surprise concentrates focal gaze `3.3×` more than Joy** (reducing `IAD`), whereas **Joy Velocity ($\Delta\text{Joy}/\Delta t$, $\beta = -1.818$) directly prevents skipping `4.5×` more strongly than Joy Level ($\beta = -0.398$)**! | The "optimal emotion pulse templates" in the paper are **Monte Carlo model simulations**, not newly filmed A/B-tested commercials; 8 of 58 participants were dropped without explanation. | **Moderate-to-High** |
| **P16** | **Cutting, DeLong, & Nothelfer (2010, *Psych. Science*)**<br>`f4-appraisal-curiosity-video-and-hooks.md` | Spectral analysis of `150` Hollywood films (`1935–2005`) | **JBI Analytical (2023):** **Moderate (film structure) / Low (attention claim)** | Post-1980 Hollywood films evolved toward a **$1/f$ shot-length power spectrum** (clustering short shots together). | **Zero human viewers were measured in the paper**, and a film's **$1/f$ exponent does NOT correlate with its IMDb rating ($r = -.089$)**! Treat $1/f$ pacing as a structural convention of modern cinema, not an automatic quality guarantee. | **Moderate** (film structure) · **Low** (viewer quality) |

## Appendix B: forensic appraisal ledger `P17–P26`

Full-text `paper-appraisal` (`Cochrane RoB 2`, `JBI Analytical & Quasi-Experimental`, `ML Evidence Checks`, and `Insight Review`) executed across all 10 Wave-7 primary PDFs (`P17–P26`, bringing the local `papers/` corpus to **26 full-text PDFs, `~73 MB`**). Detailed per-paper ledgers with verbatim page quotes live in `reports/g1-appraisal-storytelling-and-storyboard.md` (`67 KB`) and `reports/g2-appraisal-interest-rhythm-and-form.md` (`61 KB`).

| ID & Citation | Report (`reports/g1, g2`) | Study Design & Sample (`N`) | Appraisal Tool & Verdict | Full-Text Verified Finding & Statistic | Forensic Audit Catch (What Failed or Differed in Full Text) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P17**<br>Cohn (2013, *Cognitive Science*) | `g1-appraisal-storytelling-and-storyboard.md` | Theoretical Cognitive Linguistics & Visual Narrative Grammar (`0` human subjects in this paper) | JBI Text/Opinion<br>**Moderate** (Grammar) / **Low** (In-Paper Empirical Data) | Sequential images form hierarchical constituents: **Establisher (`E`) $\to$ Initial (`I`) $\to$ Prolongation (`P`) $\to$ Peak (`P*`) $\to$ Release (`R`)** validated by Substitution, Deletion, Reordering, and Windowing tests; deleting all panels except `Peak` preserves core narrative paraphrase. | **No Human-Subjects Data in P17:** This 2013 article is a theoretical linguistics paper (cites `Cohn 2012` for ERP validation). Also, the 4 attentional framing labels (`Macro / Mono / Micro / Amorphic`) are in Cohn's companion framing taxonomy (cited here while panels are termed *"attention units"*). |
| **P18**<br>Reagan, Mitchell, Kiley, Danforth, & Dodds (2016, *EPJ Data Science* / arXiv v3) | `g1-appraisal-storytelling-and-storyboard.md` | Hedonometer Sentiment + SVD + Ward Clustering + SOM on **1,327 Project Gutenberg Books** (`81-page` Appendix audited) | JBI Analytical<br>**High** (6 Arc Shapes) / **Low** (In-Paper Download Ranking) | `85%+` of emotional trajectories are spanned by **6 basic shapes**: `Rags to Riches (+SV1)`, `Tragedy (-SV1)`, `Man in a Hole (+SV2)`, `Icarus (-SV2)`, `Cinderella (+SV3)`, `Oedipus (-SV3)`. | **Fig. 7 vs. Appendix Fig. S3 Audit:** Download medians carry no significance test, and in Appendix Fig. S3 `Icarus` drops below `Rags to Riches`. **Only `-SV 4` (Two Fall–Rise Oscillation Cycles: median `105.5` in Fig. 7 and `103.0` in Fig. S3) leads in BOTH tables** — which we then proved statistically on `1,970` TED Talks (`val_oscillation` cuts `Longwinded` $z = -5.74, p < 10^{-8}$ and boosts `Awe` $z = +9.5$)! |
| **P19**<br>Boyd, Blackburn, & Pennebaker (2020, *Science Advances*) | `g1-appraisal-storytelling-and-storyboard.md` | 5-Quintile `LIWC2015` Trajectory Analysis across **`~40,000` Traditional + `~20,000` Nontraditional Texts** | JBI Analytical<br>**High** (3 Normative Curves) / **Low** (Curve $\to$ Rating in Paper) | Establishes 3 normative 5-quintile curves ($Q_1 \dots Q_5$): **Staging** (articles + prepositions) peaks in $Q_1$ and decays to $Q_5$; **Plot Progression** (pronouns + auxiliary verbs) rises $Q_1 \to Q_5$; **Cognitive Tension** peaks in mid-arc $Q_2\text{–}Q_4$. | **COI & Rating Null in Paper:** Senior author Pennebaker co-owns commercial `LIWC2015`, and NYT count differs between Methods (`18,312`) and Results (`28,664`). Crucially, mere similarity to the average curve did *not* correlate with IMDb/Goodreads ratings in Boyd's paper — our `2,465` TED Talks model proves you must pair `Staging Decay` ($z=+4.4$) with **Concrete Human Grounding ($z=+6.67$)** and a **$Q_1$ Story Hook ($z=+15.9$)** to reach **`71.47%` holdout accuracy**! |
| **P20**<br>Zacks, Speer, Swallow, Braver, & Reynolds (2007, *Psychological Bulletin*) | `g1-appraisal-storytelling-and-storyboard.md` | Integrative Neurocognitive Review of fMRI, Eye-Tracking, and Behavioral Event Segmentation (**EST**) | JBI Review<br>**High** (Boundary Memory Boost) / **Moderate** (Dopamine Gate) | Viewers segment continuous streams at prediction-error spikes (**Event Boundaries**), evoking transient fMRI activation in **right posterior frontal cortex (`BA 6`), extrastriate cortex, and `MT+`**. **Frames and objects at event boundaries are remembered significantly better** than interior frames. | **Brain Region & Dopamine Check:** The paper reports `BA 6` and `MT+` (does not name `FEF`), and explicitly presents phasic dopamine/norepinephrine gating as a **theoretical hypothesis** rather than a measured neurotransmitter trace. |
| **P21**<br>Zwaan, Langston, & Graesser (1995, *Psychological Science*) | `g1-appraisal-storytelling-and-storyboard.md` | 2 Verb-Clustering Experiments (`N = 44`, `N = 68`) across 5 Situational Dimensions (**Vision OCR verified from scan**) | JBI Quasi-Experimental<br>**Moderate-to-High** (Spatial, Causal & Goal Indices) | Readers index narrative events across **5 situation-model dimensions**: **Spatiality**, **Causality**, **Intentionality (Goal)**, **Temporality**, and **Protagonist**. `Spatiality`, `Causality`, and `Intentionality` are significant across all 4 experimental conditions. | **Vision OCR Table 1–2 Audit:** Dependent variable is verb-clustering $\beta$ weights (not reading latency), and `Temporality` + `Protagonist` were non-significant in Experiment 2. The processing-cost scaling rule for multi-index shifts comes from `Speer, Zacks, & Reynolds (2006)` (cited in `P20`). |
| **P22**<br>Segel & Heer (2010, *IEEE TVCG*) | `g2-appraisal-interest-rhythm-and-form.md` | Taxonomic Audit of **58 Narrative Visualizations** across Journalism, Business & Research (**Fig. 7 hand-counted**) | JBI Analytical Taxonomy<br>**Moderate-to-High** (Matrix) / **Low** (No User Study) | Defines 7 genres and 3 scrollytelling structures: **Martini Glass**, **Interactive Slideshow**, and **Drill-Down Story**. Across all 58 rows of Fig. 7: **Filtering appears in `93%` (`54/58`)**, **Tacit Tutorials in `15%` (`9/58`)**, and **Final Summaries in only `11%` (`6/58`)**. | **Zero Human Participants:** Pure design taxonomy with no user-study metrics; always add the missing `11%` Final Summary synthesis card at the end of a Martini Glass scrollytelling flow to capture `Peak-End` memory. |
| **P23**<br>Silvia (2008, *Current Directions in Psych. Science*) | `g2-appraisal-interest-rhythm-and-form.md` | Appraisal-Theory Synthesis of Aesthetic, Poem, and Polygon Interest Studies | JBI Review<br>**Moderate** (Two-Appraisal Law) | Proves **Interest $
eq$ Enjoyment**: Interest requires **(1) High Novelty-Complexity** (*"new, unexpected, complex, hard to process, mysterious"*) AND **(2) High Coping Potential (Comprehensibility)**. Giving a comprehension hint for an abstract poem sharply lifts Interest; complex art maximizes Interest while simple art maximizes Enjoyment. | **Review-Format Caveat:** Summary review prints no raw $t/F$ test statistics in text and draws heavily from the author's own lab; however, our `1,970` TED Talks audit confirms that high complexity without concrete human scaffolding (`abstract_sludge_rate`) spikes Boredom/Confusing (`+3.4z`, `+19.6%` penalty). |
| **P24**<br>Hidi & Renninger (2006, *Educational Psychologist*) | `g2-appraisal-interest-rhythm-and-form.md` | Longitudinal Synthesis of **The Four-Phase Model of Interest Development** | JBI Review<br>**High** (Catch vs. Hold Separation) | Defines 4 sequential phases: **(1) Triggered Situational (`Catch`) $\to$ (2) Maintained Situational (`Hold`) $\to$ (3) Emerging Individual $\to$ (4) Well-Developed Individual Interest**. | **Catch $
eq$ Hold (`Mitchell 1993`, `Harackiewicz 2000, 2002`):** Longitudinal evidence proves that Phase-1 `Catch` triggers (incongruity, surprise, intensity) fail to predict Phase-2 `Hold` unless followed by **personal relevance and meaningful task involvement**. |
| **P25**<br>Lakatos, Gross, & Thut (2019, *Current Biology*) | `g2-appraisal-interest-rhythm-and-form.md` | Systems Neuroscience Synthesis of Auditory, Visual, Saccadic, and Motor **Neuronal Entrainment** | JBI Review<br>**High** (Attention Filter) / **Moderate** (Memory Parsing) | Entrainment aligns high-excitability cortical phases with stimulus beats across biological scales: **syllables `~5 Hz`**, **audio-motor coupling `~4.5 Hz`**, **visual saccades `3–5 Hz`**, **speech tracking `<10 Hz`**, **heartbeat `~1 Hz`**, **respiration `~0.25 Hz` (`4 s` cycle)**. | **Top-Down Gating & Non-Frequency-Specificity:** Explicitly states entrainment *"is not 'frequency specific'"* (no rigid Delta/Theta cutoff boxes) and proves that **top-down attention gates entrainment** — an ignored rhythm does not entrain sensory cortex. |
| **P26**<br>Bar & Neta (2006, *Psychological Science*) | `g2-appraisal-interest-rhythm-and-form.md` | Controlled **`84 ms` Tachistoscopic Forced-Choice Experiment (`N = 14`)** across Real Objects, Abstract Patterns & Letters | JBI Quasi-Experimental<br>**Moderate** ($d = 0.94$ on Objects; Small $N=14$) | At `84 ms` exposure, observers liked **curved real objects significantly more than sharp-angled objects (`67.2%` vs. `50.6%`, $t(13) = 3.53, p < 0.01, d = 0.94$)** and curved abstract patterns more than sharp ones (`37.9%` vs. `24.8%`, $t(13) = 2.56, p < 0.05$) with zero reaction-time fluency difference. | **2006 vs. 2007 fMRI Distinction:** The word `"amygdala"` does not appear in this 2006 behavioral paper (tested in their 2007 *Neuropsychologia* fMRI follow-up), $N=14$ is small, and the exploratory typography sub-check was confounded by stroke thickness. |

## Appendix C: forensic appraisal ledger `P27–P34`

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

- **`schloss-palmer-2011`:** Karen B. Schloss & Stephen E. Palmer (2011), *"Aesthetic response to color combinations: preference, harmony, and similarity"*, Attention, Perception, & Psychophysics, 73(2), 551-571.
- **`ou-2004`:** Li-Chen Ou, M. Ronnier Luo, Andree Woodcock, & Angela Wright (2004), *"A study of colour emotion and colour preference. Part II: Colour emotions for two-colour combinations"*, Color Research & Application, 29(4), 292-298.
- **`ou-2010`:** Li-Chen Ou, M. Ronnier Luo, Pei-Li Sun, Neng-Chung Hu, Hung-Shing Chen et al. (2010/2012), *"A cross-cultural comparison of colour emotion for two-colour combinations"*, Color Research & Application, 37(1), 23-43.
- **`wilms-2018`:** Lisa Wilms & Daniel Oberfeld (2018), *"Color and emotion: effects of hue, saturation, and brightness"*, Psychological Research, 82(5), 896-914.
- **`palmer-2013`:** Stephen E. Palmer, Karen B. Schloss, & Jonathan Sammartino (2013), *"Visual Aesthetics and Human Preference"*, Annual Review of Psychology, 64, 77-107.
- **`harp-mayer-1998`:** Shannon F. Harp & Richard E. Mayer (1998), *"How Seductive Details Do Their Damage: A Theory of Cognitive Interest in Science Learning"*, Journal of Educational Psychology, 90(3), 414-434.
- **`vroomen-2010`:** Jean Vroomen & Mirjam Keetels (2010), *"Perception of intersensory synchrony: A tutorial review"*, Attention, Perception, & Psychophysics, 72(4), 871-884.
- **`kahneman-1993`:** Daniel Kahneman, Barbara L. Fredrickson, Charles A. Schreiber, & Donald A. Redelmeier (1993), *"When More Pain Is Preferred to Less: Adding a Better End"*, Psychological Science, 4(6), 401-405.

## Appendix D: local full-text corpus and holdout validation

### Overview

In Wave 5, **16 primary academic PDFs (`52.2 MB`)** were retrieved locally into `~/workspace/research/261107-attention-information-architecture/papers/` using `paperget` and `paperhunt` (across open-access preprints, arXiv, and Sci-Hub fallback). Full-text analysis of these papers establishes the **mathematical and computational laws** governing **pixel-level interface aesthetics**, **integer-programming grid layout optimization**, **deep-learning visual importance (`UMSI`) across 5 design classes**, **GUI visual search (`2025`)**, and **CIELAB affective color coordinates (`2022–2025`)**.

---

### 1. Local Full-Text Paper Corpus (`papers/` via `paperget` & `paperhunt`)

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

Trained strictly on the **80% Exploratory Split (`1,970` talks, `4,864,386` ratings)** with weights locked (`SHA-256: e584bc7ddd3db1f77b0ed96e7815dbe033be2dbf8150dbe21c7c1cc28d8352fd`) before evaluating once on the **untouched 20% Holdout Split (`495` talks, `1,145,490` ratings)**:
- **Out-of-Sample Talk-Level Correlation:** **$r = +0.3364\ (t/z = +7.93, p = 2.14 \times 10^{-15})$**.
- **Pairwise Concordance (`Clear Pairs` $|\Delta y| \ge 0.10$, $N = 52,965$ holdout pairs):**
  - **Approach 1 (Surface Duration & Sentence Length Baseline):** `56.00%`
  - **Approach 2 (`Boyd + Reagan + Silvia + Lakatos + Cohn` 15 Pure Theory Mechanisms):** **`63.97%`**
  - **Approach 3 (Multi-Mechanism Narrative, Rhythm, Emotional Arc & Empirical Bayes Engine):** **`71.47%`** (`+21.47%` lift over 50% random baseline, $z = +98.82$, passing the `>= 64.0%` contract by **`+7.47%`**; **`71.88%`** on High-Contrast Pairs $|\Delta y| \ge 0.15$).

## Appendix E: live studio, CLI verification suite and references

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

- **`putkonen-2025`:** Aini Putkonen et al. (2025), *"Understanding visual search in graphical user interfaces"*, Int. J. Human-Computer Studies, 199, 103483.
- **`fosco-2020`:** Camilo Fosco et al. (2020), *"Predicting Visual Importance Across Graphic Design Types"*, ACM UIST, 249-260.

##### 3.10 The 3-Specimen Visual Proof Pattern (Dark OLED vs. Daylight Print vs. Anti-Pattern Mockup)
- **Never explain a color, layout, or hook rule with prose alone:** Every interactive reference tab or design specification must pair its psychophysical mechanism with **concrete visual UI/Video specimens**:
  1. **Specimen 1 — Dark OLED Studio (`#0B0F19` surface):** Live UI/Subtitle mockup showing the exact hex (`#FFD600` on `#070A12`, `19.56:1`) and `≤5%` Von Restorff area cap.
  2. **Specimen 2 — Daylight Editorial Print (`#FFFFFF` / `#FAF8F5` surface):** Live UI mockup showing how the color shifts to darkened high-contrast ink (`#92400E` on `#FEF3C7`, `7.4:1 AAA`) to prevent photopic washout.
  3. **Specimen 3 — Failure Mode / Anti-Pattern (`❌ Bẫy Thất Bại`):** Live visual demonstration of the exact perceptual failure (`#FFD600` on `#FFFFFF` = `1.07:1` blindness, red-on-blue chromostereopsis, pure `#000000`/`#FFFFFF` halation, or F-pattern wall of text).
- **Unified Dark Container Polarity for Embedded Simulators:** Never wrap dark-calibrated interactive canvases (`#080B11` heatmaps, scanpath SVGs, or data-viz stages) inside a light-cream parent section with global dark-text CSS overrides (`color: #0F172A !important`). Keep multi-lab simulator containers in a unified dark architectural blueprint palette (`#0B101E` / `#0F172A`) and demonstrate Daylight Editorial Paper inside dedicated self-contained specimen cards.
