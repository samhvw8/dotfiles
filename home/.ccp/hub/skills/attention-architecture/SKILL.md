---
name: attention-architecture
description: "Guides writing and reviewing content that must win and hold attention: hooks and headlines, landing and pricing pages, product UI copy and layout, video and podcast scripts, thumbnails and posters, comics and storyboards, slides. Gives a diagnose-first workflow, evidence-graded rules, accessibility and honest-selling floors and platform specs, for English and Vietnamese. Use when writing or reviewing one of these, when the user asks why content does not hold attention or why a page bounces, to audit or compare hooks, to make a page or script more engaging, or to check whether a persuasion, pricing or psychology claim holds up. Not for visual styling or component code (impeccable, frontend-design), and not for chart construction or chart colors (dataviz)."
---

# Attention & Information Architecture

Win the first glance, turn it into a reason to stay, and organize the rest so it is kept. Load only the reference files the router names.

## The reply

The grades, tiers, checks and IDs below are working material. The user sees finished work and a few findings they can act on.

- **Ship finished work.** Write the real words: the full script as it will be read, the complete page block with every tier filled in and its own button, the hooks as they will be said and shown. Use `[brackets]` only for a fact only the user has (a real count, price, name, date), and list those once at the end as things to confirm before publishing. A skeleton of stage directions or a table of placeholders is not a deliverable.
- **Never invent facts:** no made-up statistics, testimonials or story details. When the copy needs a product claim the user did not state, write it and flag it once as an assumption.
- **Follow the order of the request.** Asked to write: the deliverable first, then short reasons. Asked to review or audit: the ranked findings first, then the rewrite. Say each problem once. No closing checklist and no list of what passed, unless the user asks for one.
- **Rank findings by harm to the user's goal.** First what blocks people (a dead link, unreadable text, a charge the buyer did not choose). Then what loses the most people earliest (a slow opening, a headline that does not match the ad, the best material buried). Then polish. A false or debunked claim is always reported, ranked by what it costs. Drop a finding that changes nothing they ship. A rule's grade never sets the rank.
- **Write each finding as:** what is wrong (a quote or a measured value), why it loses this audience, and the fix.
- **Show no scaffolding.** No grade letters or tier names, no gate, pattern or paper IDs, no "this skill", and no sentence that reports rule compliance ("all three are declarative, with no caps").
- **Cite a source only when it changes the decision and the user can check it:** a standard (the WCAG criterion) or a named study when the user's own content repeats a claim that failed replication. Do not quote research percentages to justify a creative choice, least of all across a language or medium gap. Reason from this audience and this platform.
- **State uncertainty once, in plain words, where it matters.** A pick made by reasoning and not by data: say so, and give the cheapest test (what to vary, which metric, about how much traffic). A fact you recall from memory that the user would publish: tell them to verify it first. Skip caveats about evidence quality when the advice stays the same either way.
- **Production specs** (hex, milliseconds, pixels, safe-zone numbers) only when the user gave code or a design, or asked for production detail. Otherwise one plain sentence ("keep captions clear of the app's buttons").
- **Vietnamese.** Write as a native creator would, not as a translation of an English formula. Count length and time in syllables (`tiếng`); a user's "từ/phút" almost always means syllables per minute. Mixing `mình`, `các bạn` and `chúng ta` is normal in speech; do not flag it.

## Workflow

1. **Route.** Read the files the router row names.
2. **Find the real problem first.** Check the cheap explanations before the copy: something broken, traffic source and intent mismatch, load speed, the mobile first screen. Ask for the data that would decide it, and still deliver on what you can see. Do the arithmetic the user's own numbers allow (runtime from script length and their speaking rate, contrast from hex, A/B sample size from their conversion rate). When a result contradicts what the user believes, tell them.
3. **Look at the whole picture.** One primary point and one target action. The audience's pain and the payoff they get: sell the benefit, not only a tour of features. The one or two objections this audience will raise, answered inside the piece. Constraints outside the content: whether a sponsor or ad fits the topic and what its contract fixes, the promise that brought the visitor, which plan earns the revenue.
4. **Write or fix the deliverable** with the routed rules and the defaults below. When asked for several options, make them differ in kind, pick one, and say what its weak point is and how the piece covers it.
5. **Run the checks that fit the medium, silently, and fix what fails.** A floor miss that is visible in the user's material (contrast, flashing, a pre-ticked box, a false claim) is always fixed and reported. Leave out floor items the material does not show (loudness, sync, transcripts) unless the user wants a production handoff.

## Evidence grades

Each rule carries a grade that says how hard to lean on it.

- **S**: a written standard (WCAG 2.2, ITU, platform spec). A floor.
- **A**: a replicated or meta-analytic finding. Default.
- **B**: one study or a narrow sample (one platform, language or era). Use inside its boundary; outside it, a hunch to test.
- **H**: a practitioner heuristic with no controlled test. A starting value; never call it research.

Numbers in a rule are defaults, not cliffs; only `S` numbers are pass/fail lines. Most evidence is English and Western, and no wording pattern has a Vietnamese test. Never justify a style rule with a brain-mechanism name (dopamine, amygdala, MMN). The user's own analytics and A/B results beat every default.

## Router

| Task | Read |
|---|---|
| Landing page, website, product UI, dashboard, app screen | [web-and-product-ui.md] + [hooks-and-wording.md] |
| Pricing, checkout, paywall, subscription, onboarding | [choice-architecture-and-pricing.md] + [web-and-product-ui.md] |
| Short or long video, B-roll, motion graphics | [video-and-motion.md] + [hooks-and-wording.md] |
| Podcast or audio script (video podcast: add video-and-motion.md) | [audio-podcast.md] + [hooks-and-wording.md] |
| Poster, thumbnail, cover, comic, storyboard | [posters-slides-and-color.md] |
| Slide deck, infographic | [posters-slides-and-color.md]; charts: the `dataviz` skill |
| Hooks, headlines, CTAs, email subject lines, copy | [hooks-and-wording.md] |
| English headlines or subject lines for a feed or inbox; comparing two headlines | add [headline-patterns.md] |
| "Is this effect real?", a psychology or persuasion claim | [evidence-caveats.md] |

When a task matches two rows, read both. Read [platform-specs.md] only when you need a platform or standard number (WCAG criteria, Core Web Vitals, loudness, sync, caption norms, chapters, 9:16 safe zones).

## Defaults

One value per quantity; reference files cite this table. Pricing defaults (daily-price and loss framing) live in choice-architecture-and-pricing.md, and platform numbers (sync, loudness, safe zones) in platform-specs.md.

| Quantity | Default | Grade and source |
|---|---|---|
| Text contrast | Body `>= 4.5:1`; large text and UI components `>= 3:1` | S: WCAG 2.2 SC 1.4.3, 1.4.11 |
| Accent | One saturated hue, on the single focal target and the primary CTA only. Ink on an accent fill `>= 7:1` | H (one accent); S (contrast) |
| Worked contrast values | `#FFD600` on `#0F172A` = 12.6:1. `#0B0E14` on `#FFD600` = 13.7:1. `#FFD600` with white = 1.41:1 either way, so never pair yellow with white. `#FF0000` on white = 4.00:1 (fails body text) | Computed, WCAG 2.x |
| Motion | One onset per beat, `150–300 ms`, ease-out. No auto-playing motion over 5 s without pause. At most 3 flashes per second. Honor `prefers-reduced-motion` | H (duration); S: WCAG 2.2.2, 2.3.1 |
| Speech rate and timing | Time scripts at the speaker's own rate; never ask a speaker to change a natural pace to meet a number. With no rate given: English narration about `160–190 wpm`; Vietnamese read aloud without pauses runs about `5.2` syllables per second, so plan narration slower and have the user time one read-through | B: Rodero 2016 (Spanish radio news; keep this caveat to yourself); B: Pellegrino, Coupé & Marsico 2011 |
| Hook form | A statement by default. A question earns its place only when the audience cannot answer it at once and the piece answers it. No `!`, no ALL CAPS | H; B within English feed headlines (headline-patterns.md) |
| Payoff position | The main payoff lands in the last third. The end comes soon after, with one concrete action and no housekeeping tail | H for the position; A that the peak and the end dominate memory (Kahneman 1993) |
| Pattern change | Long form: change something meaningful (topic, visual mode, speaker, example) about every `15–45 s` as a starting value. Short form: vary shot length, no fixed beat | H |

## Evidence tiers

Tier 1 (use freely) and Tier 2 (use inside a stated boundary): see [evidence-caveats.md] before you lean on a famous effect.

**Tier 3: never use as a claim or a rationale, and tell the user when their content does.** ego depletion (Hagger 2016 multi-lab replication: d ≈ 0.04); signing at the top for honesty (retracted); money, flag or elderly priming; power posing; pen-in-mouth facial feedback; unconscious thought theory; rhyme-as-reason; color raising accuracy or creativity (Steele 2014 failed replication); disfluent fonts improving thinking (Meyer 2015 null); identity nouns raising behavior (Gerber 2016 null, n = 4,468); the identifiable-victim effect and "statistics kill sympathy" (Maier 2023 null); fixed cultural scanpath differences.

## Checks (internal)

Your own pass over the deliverable: first glance (G1–G4), hook (G5–G9), holding attention (G10–G18). The IDs let reference files point here and never appear in a reply.

| ID | Check |
|---|---|
| G1 | **One focal target** carries the accent; the rest stay neutral (H) |
| G2 | **Contrast floor.** Compute every text and UI pair from hex against the defaults (S). Ink on an accent fill `>= 7:1` (H). Never yellow with white. A light accent fill on a light page is a weak button even with dark ink: add a dark border (H) |
| G3 | **Motion and flashes.** Motion default met; no infinite decorative animation (S/H) |
| G4 | **Entry and grouping.** Headline, proof and primary CTA sit in the main column, never in an ad-like right rail or banner block (A: banner blindness). Items come in groups of about 4 (B). No sticky bar or overlay hides the CTA; touch targets `>= 24 px` (S: WCAG 2.4.11, 2.5.8) |
| G5 | **Hook.** A specific promise naming a concrete person, thing, number or outcome for this audience, in the hook-form default, that fits its window when timed at the speaker's rate. For a product you can demonstrate, the product working is the hook. The piece pays off what the hook promises (H) |
| G6 | **Open on the subject.** Video and audio start on the problem, the result or the action in motion. Greeting, logo, sponsor and subscribe ask come after the hook (H). Housekeeping before the content belongs here, not in G10 |
| G7 | **Front-loading and line length.** The first 2–3 words of each heading, bullet and CTA carry the key noun or number (B: F-pattern scanning). Body lines run `45–75` characters (B: Dyson 2004 review) |
| G8 | **Wording.** Hook, hero and CTA name outcomes and things a person can see or touch; no bare pro-forms ("our solution"); plain words over inflated ones (A). Error messages never blame the user (H). Subject close to its verb, no nested clauses (A) |
| G9 | **Slides and charts.** Slide headlines are full-sentence assertions of at most 2 lines (B: Garner & Alley 2013). Position-based charts with direct labels for comparison (A) |
| G10 | **No seductive details.** Off-point material inside the body (tangents, decorative B-roll, side anecdotes) comes after the payoff or not at all (A) |
| G11 | **Rhythm.** Sentence length varies (H). Meaningful change at the pattern-change default (H). No fast cutting under dense explanation (B: Lang's LC4MP) |
| G12 | **Payoff and end.** The open question builds; payoff and ending follow the payoff-position default (H; A for peak-end) |
| G13 | **Words and pictures.** Narration and its visual appear together (A). No on-screen paragraph that repeats the narration, captions excepted (A). Closed captions for video and a transcript for audio-only content (S). The hook reads with sound off and with sound on |
| G14 | **Story and numbers.** The emotional beat follows one concrete person or scene (A). Every statistic is real and has a nameable source; risks as natural frequencies over one denominator (A) |
| G15 | **Voice and sound.** Timing computed at the speaker's rate. One deliberate pause before the key line (H). AV sync and loudness need a tool (S) |
| G16 | **Honest choice structure.** 3–4 plans at most for one audience, on aligned rows, each with its own button (B). One plan recommended with a true reason (A). One all-in price, and the billing period matches the price shown (A) |
| G17 | **Honest-selling floor.** No pre-ticked box for recurring billing or paid add-ons. Renewal and trial conversion disclosed before payment, with consent. Cancelling is as easy as signing up. Reference prices, discounts, urgency, scarcity and social-proof counts are true. Detail: choice-architecture-and-pricing.md. A floor in every market, argued from trust |
| G18 | **Evidence hygiene.** No Tier 3 claim as a claim or rationale, in the content or in your own reasons. Tier 2 claims stay inside their boundary. No number without a source |

[audio-podcast.md]: references/audio-podcast.md
[choice-architecture-and-pricing.md]: references/choice-architecture-and-pricing.md
[evidence-caveats.md]: references/evidence-caveats.md
[headline-patterns.md]: references/headline-patterns.md
[hooks-and-wording.md]: references/hooks-and-wording.md
[platform-specs.md]: references/platform-specs.md
[posters-slides-and-color.md]: references/posters-slides-and-color.md
[video-and-motion.md]: references/video-and-motion.md
[web-and-product-ui.md]: references/web-and-product-ui.md
