# Gem Detection

Gatherers collect raw data. The brain's job is to find **gems** — real practitioner insights buried under SEO noise. Gather is a small step; gem extraction is where research value lives.

## Gem Signals (keep — high weight in synthesis)

| Signal | What it looks like | Why it's a gem |
|--------|-------------------|----------------|
| **Specific numbers** | "120M tokens/week, $183" | Vague = SEO filler. Specifics = real experience |
| **Pain/failure** | "I thought it was free, then got a $170 bill in 6 hours" | SEO blogs only praise. Real users report pain |
| **Code/config** | Actual config snippets, error logs, CLI output | Proves hands-on usage, not rewrite |
| **Workarounds** | "Changed heartbeat from 30min to 2h to save tokens" | Implies deep usage + problem solving |
| **Contradiction** | "Official docs say X but in practice Y" | Gap between marketing and reality = highest value |
| **Author identity** | Commit history, real projects, known in community | Practitioner > content writer |
| **Discussion depth** | Comments with counterpoints, corrections, debate | Echo chamber = low value. Debate = signal |
| **Version-specific** | References exact versions, dates, changelogs | Timeless "guide" = SEO. Version-pinned = real |

## SEO Noise Signals (deprioritize — flag in REFLECT)

| Signal | What it looks like | Why it's noise |
|--------|-------------------|---------------|
| **Generic superlatives** | "Very powerful", "highly effective", "best solution" | No information content |
| **Listicle structure** | "Top 10 crawlers in 2026" with identical paragraph structure | Written for Google, not humans |
| **No downsides** | Everything is positive, no tradeoffs mentioned | Real tools have tradeoffs. No downsides = ad |
| **Keyword stuffing** | Title repeats search term 3+ times | SEO optimization, not content |
| **Stolen/rewritten** | Same facts as another source, slightly reworded | Content farm recycling |
| **Stock imagery** | Generic screenshots, diagrams with no project-specific detail | Filler, not documentation |
| **Undated** | No publish date, no version references | Evergreen SEO, not current knowledge |
| **Affiliate links** | "Use code X for 20% off", pricing comparison with referral links | Incentivized recommendation |

## Scoring (REFLECT uses this)

After gather, tag each finding:

```
GEM:  specific + painful + verifiable → keep, cite in synthesis
MEH:  partial signal, some specifics but also generic → use if no gem available
NOISE: SEO patterns, no specifics, no pain → drop from synthesis
```

Rule: **a synthesis built from NOISE is worse than saying "insufficient data."** Better to report 2 gems than 20 noise items.

## Gatherer Instructions (inject into agent prompts)

Add to every gatherer prompt:

```
When evaluating sources, tag each finding as GEM/MEH/NOISE:
- GEM: specific numbers, pain points, workarounds, code, contradictions
- NOISE: generic praise, listicles, no downsides, undated, affiliate
Prioritize GEM findings. Report NOISE count but don't expand on them.
```

## Related

- [overview](overview.md) — forager REFLECT/STEER methodology
- [methodology-map](methodology-map.md) — ACH falsification principle
