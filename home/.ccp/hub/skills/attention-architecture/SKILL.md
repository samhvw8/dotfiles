---
name: attention-architecture
description: "Engineer and audit human attention capture and information organization across websites/landing pages, UI/UX interfaces, presentation slides, thumbnails/posters, vlogs/short videos, motion graphics, and podcasts using empirical neuroscience and eye-tracking rules (555nm yellow-on-dark contrast, Von Restorff isolation, paradox/Disrupt-Then-Reframe hooks, Cowan 4±1 chunking, front-loaded information scent, Mayer dual-channel contiguity, and auditory MMN silence). Use when designing, structuring, scripting hooks, or reviewing any visual, web, UI, slide, video, or audio artifact that must win attention and maximize retention."
---

# Attention & Information Architecture

Apply the three-stage neuro-cognitive pipeline whenever you design, write, layout, or review an artifact that competes for human attention. Canonical cross-project pattern: `~/workspace/knowledge/patterns/attention-and-information-architecture.md`. Full research corpus: `~/workspace/research/261107-attention-information-architecture/REPORT.md`.

## The 3-Stage Pipeline

Every medium passes through three sequential biological gates (`Corbetta & Shulman, 2002`):

| Gate | Window | Mechanism | Core Engineering Rule |
|------|--------|-----------|-----------------------|
| **1. Sensory Arrest** | `0–300 ms` | Ventral Network + V1/A1 42-map center-surround contrast (`Itti & Koch, 2001`) + `Von Restorff (1933)` | Keep 85–90% of the canvas/audio field neutral; isolate **strictly 1 focal element** using peak photopic luminance (`#FFD600` yellow at 555nm on `#0F172A`/`#000000` dark = `14.6:1–19.56:1` contrast), Frame-1 motion onset, or a `0.8–1.5 s` acoustic silence (`Näätänen, 2007`). |
| **2. Epistemic Hook** | `0.3–15 s` | Dorsal Network + ACC Schema Incongruity (`Meyer et al., 1997`) + Information Gap (`Loewenstein, 1994`) + DTR (`Davis & Knowles, 1999`) | Convert fleeting sensory arrest into volitional focus before it decays (1–3s). Pair a **familiar belief** with a **quantified counter-fact / paradox** in $\le 15$ words, then reframe the value/stakes within 5–15s (`65% vs. 35%` compliance lift). |
| **3. Structural Fluency** | `>15 s` | Working Memory `4 ± 1` (`Cowan, 2001`) + Information Scent (`Pirolli & Card, 1999`) + Dual-Channel Load (`Sweller, 1988`; `Mayer, 2009`) | Cap groups at **3–4 chunks** (`4 ± 1`, never 7±2), front-load concrete nouns/numbers in the **first 2–3 words (~11 chars)** of every heading, sync visuals within `±100 ms` of speech, and chain **Zeigarnik open loops**. |

---

## Core Moves & Why They Work

### 1. Color & Luminance Isolation (Why Yellow Works — and Where It Fails)
- **Why:** Human photopic vision sums L-cones (`0.2126`) and M-cones (`0.7152`), peaking at **555 nm (greenish-yellow)**. Pure yellow (`#FFD600` / `#FFFF00`, relative luminance `L = 0.9278`) on a dark surface (`#0F172A` / `#111111`) triggers both the **Intensity channel (`14.6:1–19.56:1`)** and the **Blue–Yellow opponent channel**, winning involuntary first fixation faster than any other hue (`Camgöz et al., 2002, 2004`).
- **Move:** Use high-luminance yellow (`#FFD600` fill with `#111111` ink, or `#FFD600` badge on dark) or vermilion (`#FF5500`) for **at most 1 primary CTA or focal anchor per viewport/frame**.
- **Hazards to avoid:**
  - **The Dark Yellow Problem:** Never place yellow text/icons on a white background (`1.07:1` luminance contrast — invisible to peripheral magnocellular detectors). On light backgrounds, put `#111111` black ink inside a `#FFD600` fill with a dark border, or shift to warm amber (`#B45309` on `#FFFBEB`, `5.4:1`).
  - **Von Restorff Clutter:** Highlighting 4+ badges destroys background homogeneity (`Von Restorff, 1933`) and splits gaze.
  - **Destructive Outlier Trap:** Never style "Cancel", "Delete", or "Log Out" as the sole chromatic outlier on a neutral screen; it hijacks bottom-up saccades and causes reflexive mis-clicks.

### 2. The 3-Step Paradox Hook (`Anchor → Disrupt → Reframe`)
- **Why:** Curiosity (`Loewenstein, 1994`) is zero when the audience knows nothing about a topic, and peaks when subjective certainty drops toward `p = 0.5` right next to a rule they *thought* they knew.
- **Move:**
  1. **Anchor (0–2s):** Invoke a familiar rule or intuition.
  2. **Disrupt (2–6s):** Break it with a specific, quantified contradiction ($\le 15$ words).
  3. **Reframe (6–15s):** Prove the anomaly is real and resolvable (`Berlyne's inverted-U curve`) and state what the audience gains by staying.

---

## Medium-Specific Playbooks

Read [references/media-playbooks.md](references/media-playbooks.md) for deep metrics and failure modes across all 7 surfaces. Quick rules by medium:

| Medium | Gate 1: Sensory Arrest (`0–300 ms`) | Gate 2: Epistemic Hook (`0.3–15 s`) | Gate 3: Organization & Fluency (`>15 s`) |
|--------|-------------------------------------|-------------------------------------|------------------------------------------|
| **Website / Landing Page** | Keep layout prototypical (`50 ms` gist, `Lindgaard 2006`); 1 isolated CTA (`#FFD600` on dark or `#111111` ink on `#FFD600`). | Place paradox headline in **top-left entry zone** (`Still 2018`: `39px` error vs `327px` for size); **57%** time is above the fold. | Use **Layer-Cake bands** of **3–4 cards** (`4±1`); front-load **2–3 words (~11 chars)** per heading; **never** put key proofs in right-rail boxes (`0.8%` gaze, `33×` Hot-Potato penalty). |
| **UI / UX & Dashboards** | Suppress decorative chrome (`Burke 2005`: flashy banners slow visual search by `+75%`); `#121212` dark surface with `87%` white text to prevent halation. | Highlight only actionable anomalies or primary forward task step; neutral ghost styling for "Cancel/Log Out". | Cap nav bars, tabs, and KPI rows at **3–5 items** (`Cowan 4±1` + Hick's Law); cap typography at **$\le 4$ hierarchy levels** per viewport. |
| **Images / Thumbnails / Posters** | Strict **3-chunk cap**: (1) expressive face/object, (2) `2–4 word` `#FFD600`-on-black badge, (3) blurred/high-contrast background (`>8:1`). | Use **biological gaze cueing** (`Friesen & Kingstone 1998`): point subject's eyes/arrow at the paradox object or badge. | **Anti-Redundancy (`Mayer d=0.72`):** Never copy the video/article title verbatim onto the thumbnail; image shows the anomaly, title names the stakes. |
| **Slides & Pitch Decks** | Mute baseline chart bars to gray (`#475569`); highlight **only the 1 target series** in `#FFD600` or `#FF5500` (`Signaling d=0.46`). | **Assertion–Evidence (`Alley 2005`):** Top-left headline is a **full-sentence conclusion/paradox** ($\le 14$ words), never a topic label. | **Kill bullet walls (`Mayer Redundancy d=0.72`):** Never read multi-line bullets aloud; pair speech with **1 visual diagram** and direct on-chart labels (`Spatial Contiguity d=1.12`). |
| **Vlogs & Creator Video** | Start Frame 1 mid-motion with `<150 ms` audio onset; **zero creator greetings** (greetings raise 3s swipe bounce by `+37%`, `Douyin 2025`). | Deliver a $\le 15$-word counterfactual claim (`反常识`, `+20–22%` completion) + visual proof of stakes before second 15 (`Teixeira 2012`). | Visual reset every `4–8s` (alternating talking-head + B-roll/diagrams lifts retention `+15–20%`, `Guo 2014`); plant Question B *before* closing Question A (**Cascading Zeigarnik Loops**). |
| **Motion Graphics** | **Single-Vector Motion:** Animate **strictly 1 focal group per beat** so the V1/MT Winner-Take-All peak never scatters. | Trigger kinetic keyword pops within **`±100 ms`** of the spoken syllable (`Temporal Contiguity d=1.31`). | **Inverse Pacing Law (`Lang LC4MP 2000`):** Fast cuts (`1.5–3s`) for simple b-roll; slow progressive morphs (`6–12s`, `<12 cuts/min`) during dense explanations. |
| **Podcast & Audio** | **"Silence Is the Yellow of Audio":** Cut music bed + insert **`0.8–1.5 s` dead air** + drop vocal pitch before core thesis (fires MMN in `100–250 ms`). | **Narrative shows:** *in medias res* cold open (`0–35s`). **Conversational shows:** skip fake trailer screaming to keep vocal authenticity (`具身本真性`). | Speak at **`170–190 wpm`** (`Rodero 2016`, $\eta_p^2=.51$; collapse `>210 wpm`), stress `1–2 words/sentence`, pre-announce chunk counts (*"3 reasons…"*), and add clickable `MM:SS` Shownotes. |

---

## Pre-Flight Audit Workflow

Before finishing any landing page, UI screen, slide deck, thumbnail, video script, or podcast outline, score it against these 8 gates and fix any miss:

1. **Single Chromatic Outlier:** Is 85–90% of the canvas neutral with 1 primary focal accent (`>=14.6:1` for yellow-on-dark; zero yellow-on-white; zero highlighted destructive buttons)?
2. **Entry-Point Geometry:** Is the primary claim/hook in the top-left entry zone (`39px` error) and inside the main column (never trapped in a right-rail box)?
3. **Zero Greeting Friction:** Does the video, audio, or hero start in-motion at `t = 0` without throat-clearing greetings?
4. **Paradox + Reframe:** Does the hook collide a familiar belief with a concrete counter-fact ($\le 15$ words) and ground the stakes within 10–15s?
5. **Cowan `4 ± 1` Limit:** Are all card rows, nav bars, slide points, and verbal lists capped at 3–4 chunks (and $\le 4$ typographic hierarchy levels)?
6. **Front-Loaded Scent:** Do the first 2–3 words (~11 chars) of every heading, bullet, and chapter carry the highest-scent noun or number?
7. **Dual-Channel Contiguity:** Are spoken words paired with diagrams or 2–4 word kinetic anchors (never verbatim paragraphs read aloud), with cut rates slowed (`<12–16/min`) during dense explanations?
8. **Acoustic & Loop Continuity:** Do audio/video scripts include a `0.8–1.5s` silence interrupt before the thesis, `170–190 wpm` pacing, and cascading Zeigarnik loops across transitions?
