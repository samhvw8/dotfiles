# Headline patterns (English feed headlines)

Load only to write or compare English headlines, titles or subject lines that compete in a feed or inbox. General hook and wording rules are in [hooks-and-wording.md](hooks-and-wording.md).

## Scope: read this first

- **One source.** Everything here comes from the Upworthy archive of randomized headline A/B tests (English social news, US, 2013–15). Win rates are the share of head-to-head tests a pattern won in the held-out half. Grade `B`.
- **It does not transfer.** No data exists for video hooks, spoken lines, product pages, B2B, or any language other than English. For those, write from [hooks-and-wording.md](hooks-and-wording.md) and do not mention these patterns or numbers.
- **The numbers stay internal.** Use them to choose between drafts. In a reply, give the reason in plain words ("it names a person and a moment"). Quote a win rate only when the user asks for the data, and then name the archive and its limits.
- **The user's own A/B data beats every number here.**

## Patterns

Combine 2–3 in one declarative headline. Default recipe: a concrete person or artifact plus a deferred referent or a time pivot.

| Pattern | Example | Holdout result |
|---|---|---|
| **Time or cause pivot** ("When…", "Until…", "The first time…") | *"It looked like a normal checkout, until users reached step 2."* | Strongest: won 68% |
| **Deferred referent.** Point at a concrete thing before naming it ("Here's what happened when…") | *"He asked for a refund 10 times. Here's what the bank did next."* | Won 63% |
| **A thing you can inspect** (video, photo, chart, letter, map) | *"This 1 chart shows where viewers quit in the first 3 seconds."* | Won 60% |
| **Small specific number** (1–4 items, "first") | *"Why 1 coffee shop made ordering harder on purpose"* | Won 58% |
| **A human doing something** (a role, "he", "she") | *"A nurse timed every alarm on her ward for one week."* | Won 57%. Matches half of all headlines: a base, not a differentiator |
| **Specific negative outcome** ("mistake", "wrong", "lost") | *"The mistake that cost one shop 3 months of orders"* | Won 57%. Outcome words, not fear words |
| **Extreme comparison** ("the biggest", "the only") | *"The single biggest slowdown in React rendering"* | Won 57%. The claim must be true |
| **Conversational opener** ("So…", "Look…") | *"So we ran 6,782 headline tests. Here is what won."* | Won 57% |
| **Awe or outrage word** ("brilliant", "outrageous") | *"A brilliant 4-line fix that ended 12 hours of downtime"* | Won 56%; rare in the data |
| **Against the crowd** ("what everyone gets wrong") | *"What most teams get wrong about heatmaps"* | Weak: 54% |
| **Two-clause setup and twist** | *"Baby blankets are great, as long as they stay off the baby."* | Weak: 53% |
| **Contrast pivot** ("but", "actually", "turns out") | — | Did not replicate: 52%, and 50% when matched for length. Use only with a person or an artifact |

## Hazards

| Hazard | In the data | Fix |
|---|---|---|
| Headline ends with `?` | Question variants won 31% of pairs. Counter-evidence: Lai & Farbrot 2014 found self-referencing questions helped | Rewrite as a statement ("Why X did Y") |
| `!` or ALL-CAPS words | Won 31% | Remove them; let a concrete word carry the urgency |
| Very short headline (under about 8 English words) | Won 24% | Add the person, the thing or the stakes. Thumbnail text and hero headlines are a different job; no length rule applies to them |
| Abstract paradox: "but" or "actually" with no person or artifact | See contrast pivot | Attach a person or an artifact |
| Bait and switch | Forward-reference is the defining device of news clickbait (Blom & Hansen 2015, 100,000 Danish headlines); overuse costs trust (practitioner view) | Deliver the promised thing in the first beat after the click |

Word-level findings from the same archive (Robertson et al. 2023, a registered report): each extra negative word raised click rate about 2.3%; sadness words raised it, fear words lowered it, anger had no effect. For sharing, not clicks, high-arousal emotion helps and low-arousal sadness hurts (Berger & Milkman 2012, NYT most-emailed articles, 2008).

## Hook scorer

`python3 ~/workspace/research/261107-attention-information-architecture/scripts/hook_scorer.py --compare "<A>" "<B>"` compares two English headlines. It picks the Upworthy A/B winner 68% of the time, but a vocabulary-only model scores 67.5% and the 12 patterns alone 61%, so its verdict mostly reflects Upworthy word choice. Use it as a tie-breaker for English social-feed headlines only, and do not report its score to the user.
