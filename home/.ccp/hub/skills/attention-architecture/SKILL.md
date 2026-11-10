---
name: attention-architecture
description: "Evidence-based rules and a 26-gate pre-flight audit for content that must win and hold attention: hooks and headlines, landing and pricing pages, product UI copy and layout, video and podcast scripts, thumbnails and posters, comics and storyboards, slides and infographics. Use when writing or reviewing one of these, when the user asks why content does not hold attention, to audit or compare hooks, to make a page or script more engaging, or to check a persuasion or pricing claim against the replication record. Not for visual styling or component code (impeccable, frontend-design), and not for chart construction or chart colors (dataviz)."
---

# Attention & Information Architecture

Capture attention in `<300 ms`, turn it into curiosity in `0.3–15 s`, and organize information so it is kept after `15 s`. Detail is in `references/`. Load only the files the router names.

## Workflow (5 steps)

1. **Classify the deliverable and route.** Read the 1–2 reference files its router row names, not the others.
2. **Set the primary point, the target action and the boundary conditions.** One thesis in 5–8 words. One action. Audience (cold or high-involvement), language, medium limits, price level.
3. **Apply the medium-specific layout, rhythm and wording formulas** from the routed files. Take numbers from the thresholds below. Hook IDs (`H01–H12`, `FMEA-01–08`) are defined in [hooks-and-wording.md](references/hooks-and-wording.md).
4. **Run the gates the router lists.** Measure each sub-check. Do not estimate a tool-dependent metric.
5. **Output the deliverable and an audit table:**

```
| Gate | Measured value | Pass / Fail / Not measurable from text |
|---|---|---|
| 12c | AV sync | Not measurable from text |
```

Fix every `Fail`, or state why it stays. A value you set as a production spec (a radius, a caption zone) is `Pass (as specified)`. A sub-check with no object in the deliverable (no progress bar, no peer comparison) is `Pass (not applicable)`.

## Deliverable router

| Task | Read | Gates to run |
|---|---|---|
| Landing page, website, product UI, dashboard, app | [web-and-product-ui.md](references/web-and-product-ui.md) + [hooks-and-wording.md](references/hooks-and-wording.md) | 1–9, 16–18, 23–26 |
| Pricing, checkout, paywall, onboarding | [choice-architecture-and-pricing.md](references/choice-architecture-and-pricing.md) + [web-and-product-ui.md](references/web-and-product-ui.md) | 1, 3, 4, 9, 19, 22, 25, 26 |
| Short or long video, B-roll, motion graphics | [video-and-motion.md](references/video-and-motion.md) + [hooks-and-wording.md](references/hooks-and-wording.md) | 2, 7, 8, 11–18, 20, 23, 24 |
| Podcast or audio script | [audio-podcast.md](references/audio-podcast.md) + [hooks-and-wording.md](references/hooks-and-wording.md) | 7, 8, 11a, 12–14, 17, 18, 20, 23–25 |
| Poster, thumbnail, comic, storyboard | [poster-slides-and-dataviz.md](references/poster-slides-and-dataviz.md) + [color-and-luminance.md](references/color-and-luminance.md) | 1, 3, 4, 6, 7, 13b, 15, 16, 23 |
| Slide deck, chart, infographic | [poster-slides-and-dataviz.md](references/poster-slides-and-dataviz.md) (+ [color-and-luminance.md](references/color-and-luminance.md) for scales) | 1, 4, 5, 9, 10, 14, 18, 21a |
| Hooks, headlines, CTAs, copywriting | [hooks-and-wording.md](references/hooks-and-wording.md) | 7, 8, 9b, 9c, 22–26 |
| Palette, theme, color script | [color-and-luminance.md](references/color-and-luminance.md) | 1, 5, 16 |
| Decision rubric, forecast, engineering RFC | [choice-architecture-and-pricing.md](references/choice-architecture-and-pricing.md) (Playbook C) | 21, 22 |
| "Is this effect real?", a `P` citation | [evidence-caveats.md](references/evidence-caveats.md) | 22 |

Also: [audit-gates.md](references/audit-gates.md) (full gate text; read it only when a short gate is not enough), [media-playbooks.md](references/media-playbooks.md) (index, 9-deliverable matrix). Hook scorer: `python3 ~/workspace/research/261107-attention-information-architecture/scripts/hook_scorer.py --compare "<A>" "<B>"`.

## Canonical thresholds

One value per quantity. If a reference file differs, this table wins.

| Quantity | Value |
|---|---|
| Line width | `55–68 CPL`; `50–75 CPL` is acceptable on responsive viewports |
| Speech rate | `160–185 wpm`; up to `190 wpm` only for high-familiarity hooks; `<= 150 wpm` causes mind-wandering; `> 210 wpm` collapses the phonological loop |
| Slide headline | Assertion of `<= 9` words; `<= 14` words is the absolute maximum, on two lines |
| Pie chart error | `1.95–2.6x` the error of an aligned bar chart (Cleveland & McGill 1984; Heer & Bostock 2010) |
| AV sync | J-cut: audio leads the cut by `120–150 ms` (pre-orienting). Inside one synchronous event: audio never leads video by `> 40 ms` and never lags by `> 120 ms` (Vatakis & Spence 2007). Impact SFX land `0..+40 ms` after the frame |
| Greeting at video start | A generic greeting adds `+37%` early bounce (cutting it reduces bounce by `-37%`) |
| Auditory MMN window | `100–250 ms` after the deviance, peak `150–175 ms` (Näätänen et al. 2007) |
| Pure red `#FF0000` | `4.00:1` on white (fails WCAG `4.5:1` body text); `5.25:1` on black (passes, but causes chromostereopsis next to pure blue `#0000FF`) |
| Accent budget | `85–90%` of the frame neutral; accent `<= 10%`, yellow or orange `<= 5%`; exactly 1 focal target |
| Questions | Never end a hook or headline with `?` (`FMEA-01`). A rhetorical question is allowed only in body copy for a cold, low-involvement audience. Never on pricing, checkout or docs |
| Peak position | The climax sits at `75–85%` of the runtime. The end resolves within `5–10 s` after it, with no housekeeping tail |
| Pattern rupture interval | Long video and speech: every `15–25 s`. Short-form (`<= 60 s`): a shot change about every `3 s` and at least 2 thesis-coupled ruptures. Web: every 2 scroll viewports |
| Loss aversion | `λ = 1.81` only for owned or endowed trials, high stakes or threat hooks; `λ ≈ 1.00` for routine low-ticket purchases |
| Pennies-a-day framing | Only at `<= $2.50/day` (about 50k VND); it backfires above `$4/day` |

## Evidence tiers

- **Tier 1, use freely:** precise numeric anchoring, natural frequencies, endorsed defaults, IKEA effect (completed builds only), verbatim repetition, narrative transportation, concreteness.
- **Tier 2, use only inside the boundary:** decoy (Gate 19c), loss aversion (thresholds), choice overload (only with complexity, difficulty, uncertainty and a buying goal together), identifiable victim (Gate 20a), rhetorical questions (thresholds), identity nouns (Gate 25b).
- **Tier 3, never use:** ego depletion, signing at the top for honesty (retracted), subliminal, money or flag priming, power posing, facial feedback, unconscious thought theory, rhyme-as-reason, red or blue backgrounds that "raise accuracy or creativity" (Mehta & Zhu 2009; failed replication, Steele 2014), a bare `N = 1` name-drop in text, the Dunning-Kruger quartile chart.

## The 26-gate pre-flight audit

Run the gates the router lists. Report each sub-check (`12a`, `12b`) on its own row. The `E1–E5` rows in a reference file are that medium's worked form of these gates, not extra gates.

**Tool-dependent metrics** (`UMSI`, `Subband Entropy`, `CIELAB DeltaE/DeltaH`, `LUFS`, Brysbaert norms, gaze shares): measure with a script or tool when rendering media; for text/code-only tasks, use the proxy rule or report `not measurable from text` — never fabricate a pass.

### Stage 1 (0–300 ms Sensory Arrest)

| Gate | Check | How to measure |
|---|---|---|
| 1 | **Luminance and isolation.** 1a: `85–90%` of the frame is neutral and exactly 1 target carries the accent. 1b: accent contrast `>= 14.6:1` (`#FFD600` on `#0F172A`, or dark ink `#0B0E14` in a `#FFD600` fill); zero yellow text or icons on white (`1.07:1`) | Count accent targets; compute WCAG ratio from hex |
| 2 | **Motion onset.** Zero infinite loops or blinking; one onset per beat, `150–300 ms`, decelerating ease | Read the CSS or motion spec |
| 3 | **Entry point.** 3a: the primary entry anchor is top-left or center-left. 3b: zero critical proof or CTA in a right rail or a banner-shaped block | Read the layout |
| 4 | **Subitizing.** 4a: thumbnail or poster `<= 3` objects (`1–4` items are read at a glance). 4b: each row, nav or tier set has `3–4` items. 4c: a Bento cell has `<= 3` metrics; a screen has `<= 4` font sizes | Count |
| 5 | **Data color scales.** Monotonic lightness; darker means more on a light theme, brighter means more on a dark theme; zero rainbow maps; `Delta L* >= 45` across the scale | Direction: read. `Delta L*`: tool |
| 6 | **Alignment and clutter.** 6a: `<= 4` shared alignment axes per viewport. 6b: whitespace `>= 35–45%`. 6c: `<= 3` visual importance peaks | 6a count; 6b, 6c (`UMSI`): tool. 6c proxy: count display-size text blocks and accent elements |

### Stage 2 (0.3–15 s Epistemic Hook)

| Gate | Check | How to measure |
|---|---|---|
| 7 | **Hook archetypes and hazards.** 7a: the hook uses a 2-clause belief violation (`H07`, with `H06`) or a deferred demonstrative (`H01`), `2–4` archetypes, `12–18` words. 7b: no `?` at the end (`FMEA-01`), no `!` or ALL-CAPS (`FMEA-02`), not `<8` words (`FMEA-03`). 7c: every paradox has a human (`H04`) or a concrete artifact (`H09`) (`FMEA-04`), and clause 1 does not give the answer away (`FMEA-05`) | Count words; name each ID; or run `hook_scorer.py` |
| 8 | **Curiosity halo.** The brand, product or core mechanism is named after the paradox opens and before it resolves; a disruption is followed at once by a value reframe | Mark positions |
| 9 | **Reading.** 9a: line width `55–68 CPL`. 9b: the first `2–3` words (`~11` chars; 4 CJK chars) of each heading or bullet carry the diagnostic noun or number. 9c: key metrics are exact, not round | 9a: CSS `max-width` or count; 9b, 9c: read |
| 10 | **Charts and slides.** 10a: aligned bar or dot charts, not pies; 1 highlighted series; labels on the marks. 10b: each slide headline is an assertion of `<= 9` words; zero multi-line bullets | Read; count words |
| 11 | **First 3 seconds.** 11a: video or audio starts in motion or in the paradox at `0.0 s`; zero greeting or logo intro. 11b: faces and captions stay in `Y 25–72%`, `X 10–85%` (vertical video) | 11a: read; 11b: needs the frame |
| 12 | **Voice and sync.** 12a: speech rate `160–185 wpm`. 12b: one silence of `0.8–1.5 s` before the thesis at the climax. 12c: AV sync inside the canonical window | 12a: words ÷ minutes; 12b: marked in script; 12c: tool |

### Stage 3 (> 15 s Structural Retention & Choice Architecture)

| Gate | Check | How to measure |
|---|---|---|
| 13 | **Rhythm and sequence.** 13a: about `60%` medium clauses (`12–20` words) and `25%` short punches (`<7` words); no run-ons. 13b: scenes or panels run Establisher → Initial → Prolongation → Peak → Release, with no paraphrase filler before the Peak | Count; label each scene |
| 14 | **Narrative arc.** 14a: `Q1` (`0–20%`) opens with a concrete human and an episodic story hook. 14b: zero abstract academic wording in `Q1` and no barrage of ungrounded questions. 14c: the open question builds through `Q2–Q3`; the climax follows the Peak position threshold | Label |
| 15 | **Flavor and shape.** 15a: one primary attention flavor: `F1` Epistemic Curiosity, `F2` High-Arousal Awe, `F3` Indignation, `F4` Elevation, `F5` Social Warmth & Levity. `F6` Boredom, Overload & Backfire is a failure state, never a target. 15b: curved `12–24px` containers for approach; sharp `0–2px` corners on `<= 15%` of the area, for conflict or alerts | Name the flavor; read the radii |
| 16 | **Color carrier and impulse.** 16a: `92–95%` of the area stays on a smooth carrier (`Delta H* <= 45°`, `Delta L* <= 15` across `Q1→Q5`). 16b: an impulse (`Delta E*ab >= 45`, `Delta L* >= 40`) on `<= 5–8%` of the area, only at the peak and the primary CTA | Tool. Proxy: 1 accent hue, inside the accent budget, only at peak and CTA |
| 17 | **Pattern ruptures.** 17a: a thesis-coupled rupture at the canonical interval: `V1` Subtraction, `V2` Abstraction Jump, `V3` Cross-Modal Pre-Echo, `V4` Topology Rupture, `V5` Agency Flip. 17b: zero seductive details or tangential B-roll | Timestamp each rupture and its link to the thesis |
| 18 | **Peak–end.** 18a: progress bars start at `20–25%`. 18b: the end resolves (`Q5` better than `Q3`), the climax is at the canonical position, and the piece closes with one concrete action and no housekeeping tail | Read |
| 19 | **Choice architecture.** 19a: the recommended tier is pre-selected with a stated reason; no silent pre-checked auto-renewal. 19b: component values are itemized before the bundle price. 19c: a decoy appears only in a `3–4` column alignable numeric table. 19d: the buying table has `<= 3–4` tiers and `<= 5` aligned rows. 19e: a loss frame (reverse trial, rebate guarantee) appears only inside the Loss aversion boundary. 19f: co-creation onboarding takes `<90 s` with a 1-click sample-data fallback | Read the page |
| 20 | **Persuasion sequence.** 20a: the emotional beat follows 1 protagonist told as a concrete sensory story, and no aggregate statistic shares that beat; statistics go in `Q2–Q3`. A bare name-drop does not pass (`d = 0.02`). 20b: the thesis is repeated word for word at `Q1`, `Q3`, `Q5`; in a piece under `60 s`, twice (middle and climax), never inside the hook (`FMEA-05`). 20c: an admitted limit comes only in the last `25%` of the piece, after the proof; peer comparisons carry an approval badge or a trend | Mark the beats |
| 21 | **Decision rubrics and risk numbers only.** 21a: risks and alert precision as natural frequencies over one denominator (`9 of 108`). 21b: `2–3` veto gates plus unit-weight tallying, not decimal weights. 21c: reference-class uplift, a silent 3-reason pre-mortem, kill tripwires set before the work | Read |
| 22 | **Zero pseudoscience.** No Tier 3 claim in the design or the copy | Search for each Tier 3 item |
| 23 | **Concreteness.** 23a: hero, hook and CTA nouns and verbs name things a person can see or touch (Brysbaert `C >= 3.5`). 23b: zero bare pro-forms ("this issue", "our solution"); a demonstrative with a concrete noun ("this chart") passes. 23c: descriptive action verbs, not state verbs | 23a: tool. Proxy: see-or-touch test per word |
| 24 | **Click, then share.** 24a: a cold hook has `1–2` concrete threat or fault words. 24b: the payoff pivots to awe, righteous anger or practical use; it never closes on low-arousal sadness | Read |
| 25 | **Pronouns and questions.** 25a: specialist, founder and support copy says "I", not "we"; error states have zero accusatory "you". 25b: aspirational CTAs use an identity noun, unless early failure is likely; "I don't" for own standards, "I can't" for outside limits. 25c: the Questions threshold | Read |
| 26 | **Syntax and mental accounting.** 26a: subject to verb `<= 5` words, zero center-embedded clauses, an explicit "that" or "because" before a surprising clause. 26b: fees integrated into one price; free bonuses listed apart; daily-price framing inside the canonical limit. 26c: "private by default" microcopy where users fear exposure | Count words; read the price block |
