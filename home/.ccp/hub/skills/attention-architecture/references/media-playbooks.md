# Master reference index and cross-deliverable matrix

This file was the single 213 KB reference. It is now the index. Load one or two of the files below for the job; do not load them all. The workflow, the canonical thresholds and the 26 gates are in [../SKILL.md](../SKILL.md).

## Reference files

| File | Load it for |
|---|---|
| [hooks-and-wording.md](hooks-and-wording.md) | Hook codebook `H01–H12`, hazards `FMEA-01–FMEA-08`, 8 wording laws, formulas `F1–F10`, 24 Before/After specimens (EN/VI) |
| [web-and-product-ui.md](web-and-product-ui.md) | Landing pages, websites, product UI, dashboards, mobile apps, layout selection, clutter and alignment metrics |
| [video-and-motion.md](video-and-motion.md) | Short and long video, motion graphics, AV sync, rhythm, narrative arc `Q1–Q5`, attention flavors `F1–F6`, pattern ruptures `V1–V5` |
| [audio-podcast.md](audio-podcast.md) | Podcast and spoken-word scripts: silence, speech rate, signposting, cold opens |
| [color-and-luminance.md](color-and-luminance.md) | Accent and palette choice, dark or light polarity, CIELAB carrier and impulse, color scripting, shape morphology |
| [poster-slides-and-dataviz.md](poster-slides-and-dataviz.md) | Posters, thumbnails, comics and storyboards, slide decks, charts, infographics, East Asian grids |
| [choice-architecture-and-pricing.md](choice-architecture-and-pricing.md) | Pricing, checkout, paywall, onboarding, persuasion sequencing, mental accounting, decision debiasing |
| [evidence-caveats.md](evidence-caveats.md) | Evidence tiers, failed replications, `P01–P74` citation index, appraisal ledgers |
| [audit-gates.md](audit-gates.md) | Full text of the 3-stage pipeline and Gates 1–26 |

## 9-deliverable quick matrix

Each deliverable has a 5-row matrix (`E1–E5`, below) in its reference file. Gate numbers refer to the 26 gates in `SKILL.md`.

| # | Deliverable (`key`) | Reference file | Gates to run |
|---|---|---|---|
| 1 | Web UI/UX and scrollytelling (`web_ui`) | web-and-product-ui.md, hooks-and-wording.md | 1–9, 16–18, 23–26 |
| 2 | Mobile app UI/UX and user journey (`app_ui`) | web-and-product-ui.md | 1–6, 9, 16, 18, 23, 25, 26 |
| 3 | Long-form video (`long_video`) | video-and-motion.md, hooks-and-wording.md | 2, 7, 8, 11–18, 20, 23, 24 |
| 4 | Short-form video (`short_video`) | video-and-motion.md, hooks-and-wording.md | 2, 4, 7, 8, 11–15, 17, 18, 23, 24 |
| 5 | Poster, print and key visuals (`poster`) | poster-slides-and-dataviz.md, color-and-luminance.md | 1, 3, 4, 6, 7, 15, 16, 23 |
| 6 | Illustration, comics, webtoons and storyboards (`illustration`) | poster-slides-and-dataviz.md | 1, 4, 13–17 |
| 7 | Audio, podcasts and spoken-word (`audio`) | audio-podcast.md, hooks-and-wording.md | 7, 8, 11–14, 17, 18, 20, 23–25 |
| 8 | Infographic and data visualization (`infographic`) | poster-slides-and-dataviz.md, color-and-luminance.md | 1, 4–6, 9, 10, 16, 21 (natural frequencies only) |
| 9 | Slide decks, pitch decks and keynotes (`slide_deck`) | poster-slides-and-dataviz.md, hooks-and-wording.md | 1, 3, 4, 7–10, 13, 14, 18, 20 |

Pricing, checkout and paywall work adds [choice-architecture-and-pricing.md](choice-architecture-and-pricing.md) and Gates 19, 22, 25 and 26.

## The 5 universal equations (`E1–E5`) behind every deliverable matrix

Every media deliverable is governed by the **same 5 First-Principles Audit Equations**, parameterized by that medium's spatial-temporal constraints (`Schloss & Palmer, 2011`; `Harp & Mayer, 1998`; `Kahneman et al., 1993`; `Putkonen et al., 2025`; `Fosco et al., 2020`):

1. **E1 — Pre-Attentive Entry Derivative ($\partial S / \partial \text{Context}$ at $0\text{ to }200\text{ ms}$):** Does a single dominant spatial/acoustic focal point capture the initial orienting reflex without competition?
2. **E2 — Instantaneous Channel Capacity Bound ($C \le 4\pm 1$ chunks / grid axes / `CPL` / `WPM`):** Does density stay strictly inside human working-memory and foveal/phonological limits?
3. **E3 — Habituation Half-Life & Causal Pattern Rupture ($|\partial S_i / \partial t| > \theta \;\wedge\; \text{Diversion} = 0$):** Does the piece execute a state shift across one of the 5 Orthogonal Vectors (`V1..V5`) before habituation sets in, with 100% causal coupling?
4. **E4 — Dual-Mode Color/Timbral Carrier vs. Impulse Ratio ($\Delta E^*_{ab} \ge 45$ at $\le 5\text{ to }8\%$ budget):** Do ambient carrier states preserve harmony ($\Delta C < 18$, $\Delta L^* \approx 15\text{ to }25$) while reserving opponent contrast strictly for the Peak (`P*`) and CTA (`End`)?
5. **E5 — Coping Potential & Conditional Peak-End Closure (`Silvia` + `Kahneman 1993`):** Does complexity resolve into a felt improvement at the end (`Improvers = 81.8%` repeat choice) and a single frictionless action?

## Master quantitative benchmarks (18 laws)

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
| **Reading Perceptual Span & CPL** | `3–4` chars left, **`14–15` chars right** (`7–8` char word span); **`55–68` CPL** (`50–75` acceptable) | Rayner (1998, 2009), *Psychological Bulletin* |
| **Strategic Disfluency Switch** | CRT heuristic errors drop **`90% → 35%`** when slight friction activates System 2 (ACC) | Alter, Oppenheimer, Epley, & Eyre (2007), *JEP: General* |
| **Numeric Precision & Syllabic Length** | Precise numbers (`+38.4%`) anchor stronger than round (`+40%`); fewer spoken syllables feel smaller | Janiszewski & Uy (2008); Coulter, Choi, & Monroe (2012) |
| **Disrupt-Then-Reframe (DTR)** | **65% vs. 35%** compliance (`~1.85×` lift) | Davis & Knowles (1999), *JPSP* |
| **Dopaminergic Curiosity Halo** | **`+20% to +30%`** hippocampal memory recall for incidental items placed inside an open curiosity gap | Kang et al. (2009); Gruber, Gelman, & Ranganath (2014), *Neuron* |
| **Endowed Progress Effect** | **`34% vs. 19%`** completion (`+79%` lift) when `2/10` steps are pre-credited vs. `0/8` blank | Nunes & Dreze (2006), *Journal of Consumer Research* |
| **Peak–End Rule** | Remembered utility = average of **Peak intensity + Final 10 seconds** (duration neglect) | Kahneman, Fredrickson, Schreiber, & Redelmeier (1993) |
| **Multimedia Redundancy & Sync** | Verbatim text + speech hurts ($d = 0.72$); Temporal Contiguity (`±100 ms`) lifts transfer ($d = 1.31$) | Mayer (2009), *Multimedia Learning* |
| **Asymmetric AV Binding Window** | Perceptual window **`-40 ms` audio lead to `+160 ms` audio lag**; production tolerance: lead `<= 40 ms`, lag `<= 120 ms` (`Vatakis & Spence 2007`); sound governs timing (`Shams 2000`), vision space | Vroomen & Keetels (2010); Shams, Kamitani, & Shimojo (2000), *Nature* |
| **Auditory MMN & Speech Rate** | **`100–250 ms`** window after the deviance (peak `150–175 ms`); **`0.8–1.5 s`** silence drop; **`160–185 wpm`** ($\eta_p^2 = .51$) | Näätänen et al. (2007); Rodero (2016, 2021, 2023) |
