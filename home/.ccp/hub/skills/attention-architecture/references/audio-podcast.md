# Audio and podcast

Load for a podcast script, a voice-over or any spoken-word audio. Canonical thresholds, the hook IDs and the 26 gates are defined in [../SKILL.md](../SKILL.md). If a number here differs, `SKILL.md` wins.

## Quick rules: podcasts and spoken-word audio

- **Acoustic MMN Silence Drop (`Näätänen 2007`):** Cut the music bed and hold **`0.8–1.5 s` of dead air** before dropping into a lower vocal register for the core thesis.
- **`160–185 wpm` Prosody (`Rodero 2016`) & Externalized Anchors:** Pace speech at `160–185 wpm` (`η²p = .51`; up to `190 wpm` only for high-familiarity hooks), pre-announce `3` chunks, and pair with clickable `MM:SS` Shownotes (`Xiaoyuzhou FM 2024`).

## Podcast and audio storytelling playbook

- **Acoustic MMN Silence Drop (`Näätänen 2007`):** Cut the music bed + hold **`0.8–1.5 s` dead silence** + drop vocal pitch before the core thesis.
- **`160–185 wpm` Prosody (`Rodero 2016`):** Keep speech at `160–185 wpm` (`η²p = .51`; up to `190 wpm` only for high-familiarity hooks), pre-announce `3` chunks, and provide clickable `MM:SS` Shownotes (`Xiaoyuzhou FM 2024`).

## Empirical audio and podcast rules (prosody, silence, signposting, cold opens)

### Overview

Unlike web pages (where the eye can skim headings) or video (where visual B-roll anchors context), podcast audio is **strictly linear, 1D temporal, and ephemeral**. Listeners hold only a 2–4 second echoic memory buffer and a $4 \pm 1$ chunk working-memory limit. Therefore, audio attention capture relies on **Auditory Mismatch Negativity (MMN)** and **prosodic variation**, while audio information organization relies on **explicit verbal signposting** and **mental imagery activation**.[^rodero-2023][^naatanen-2007]

### Empirical Audio & Podcast Rules

| Dimension | Empirical Evidence | Podcast Implementation |
|-----------|--------------------|------------------------|
| **Acoustic Salience & Strategic Silence** | Näätänen et al. (2007): The auditory cortex fires a Mismatch Negativity (MMN) response within 100–250 ms whenever an established acoustic rhythm is broken—including a sudden **pause/silence** or drop to a quiet, intimate register.[^naatanen-2007] | Before delivering a thesis statement or counter-intuitive insight, insert a **0.8–1.5 s acoustic pause** and drop vocal pitch/volume rather than shouting. |
| **Prosody & Speaking Style** | Rodero & Cores-Sarría (2023); Rodero & Larrea (2021): A **narrative, conversational prosody** with moderate pitch variation and keyword emphasis outperforms repetitive "announcer" cadence on heart-rate orienting response, sustained attention, and recall.[^rodero-2023][^rodero-2021] | Avoid monotonous reading or repetitive news-anchor intonation; vary pitch contour on semantically critical nouns and verbs. |
| **Speech Rate & Cognitive Density** | Rodero's psychophysiological studies show optimal comprehension and recall occur around **160–185 words per minute (wpm)** (Rodero measured the optimum near 170–190; this skill uses 160–185); exceeding ~210 wpm during dense conceptual passages degrades memory encoding. | Slow down to 150–170 wpm when introducing a core framework or paradox; speed up to 185–200 wpm during energetic storytelling or familiar examples. |
| **Cold Open Paradox (0–30 s)** | Listeners decide whether to stay within the first 30–60 seconds. Starting with housekeeping ("Welcome to episode 54, how was your weekend?") provides zero information scent. | Start **in medias res** with a 15–30 second cold open stating the central paradox, a high-tension narrative moment, or a surprising empirical claim *before* any theme music. |
| **Linear Signposting & Rule of 3** | Without visual headings, listeners lose their place in the hierarchy if transitions are implicit. | Use explicit verbal roadmaps (*"There are three mechanisms behind this. First…"*), and "reset the room" every 7–10 minutes by summarizing where the argument stands. |

## Deliverable matrix: audio, podcasts and spoken-word storytelling (`audio`)

**Primary Empirical Sources:** Näätänen 2007 (MMN); Rodero 2016, 2023; Lakatos 2019; Provost; Zacks 2007; TED N=2,465 Proof

| Gate | Quantitative Metric Key | First-Principles Pass/Fail Threshold & Rule |
| :--- | :--- | :--- |
| **E1 · Pre-Attentive Entry (0-35s Cold Open)** | `in_medias_res_cold_open` | Zero throat-clearing or housekeeping before 0:35 (NL3 Loophole: +19.1% Boredom penalty); drop straight into a concrete sensory scene or 2-clause paradox before any theme music. |
| **E2 · Capacity & Prosodic Speed Window** | `wpm_and_signposting` | Maintain 160-185 WPM (Rodero 2016, eta_p^2=.51; >210 WPM collapses working memory, <150 WPM triggers mind-wandering); pre-announce structural chunks ('There are 3 mechanisms — First...') and cap episodes at <= 4 timestamped chapters. |
| **E3 · Habituation Reset & Acoustic Rupture** | `silence_mmn_and_provost_cadence` | Trigger auditory Mismatch Negativity (MMN, 100-250ms) via a 0.8-1.5s complete silence pause + 150 WPM pitch drop before every core thesis; alternate 10-22w setup sentences with <=7w staccato punches (balanced_rhythm z=+9.9; ban >32w run-ons z=-7.8); teleport between Abstract Law and Concrete Human Story every 3-4 minutes. |
| **E4 · Dual-Mode Timbral Carrier vs. Impulse** | `timbral_bed_vs_acoustic_impulse` | Audio equivalent of Dual-Mode Color: keep background music/ambience low, warm, and spectrally notches-out around 1-4 kHz vocal formants (Carrier), and use sudden bed-muting (0 dB vacuum) or a single diegetic sound proof as the Peak Impulse. |
| **E5 · Coping Potential & Peak-End Closure** | `kahneman_audio_peak_end` | Resolve the opening tension loop in Q4 (Peak P*) and close Q5 with a Concrete Human Callback + Collective 'We/Our' Action Step (+5.5z Persuasive/Inspiring lift). |

## Related

- Rhythm and neural entrainment (`1.5–2 Hz`), sentence cadence: video-and-motion.md and hooks-and-wording.md.
- Audio-visual sync for video podcasts: video-and-motion.md.
- Before/After specimens 13–18 (podcast transitions and signposts): hooks-and-wording.md.

## Sources

[^rodero-2023]: Emma Rodero & Lucía Cores-Sarría (2023), *Best Prosody for News: A Psychophysiological Study Comparing a Broadcast to a Narrative Speaking Style*, Communication Research, 50(2), 171–194.
[^rodero-2021]: Emma Rodero & Olatz Larrea (2021), *Do Not Sound Like an Announcer: The Emphasis Strategy in Audio Commercials*, Psychology & Marketing, 38(9), 1599–1611.
[^naatanen-2007]: Risto Näätänen et al. (2007), *The Mismatch Negativity (MMN) in Basic Research of Central Auditory Processing: A Review*, Clinical Neurophysiology, 118(12), 2544–2590.
