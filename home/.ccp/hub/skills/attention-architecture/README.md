# attention-architecture

A Claude Code skill for writing and reviewing content that must win and hold attention. This file is for maintainers; the agent loads `SKILL.md` and the reference files its router names.

| File | Holds |
|---|---|
| [SKILL.md](SKILL.md) | Reply rules, workflow, router, evidence grades, defaults, Tier 3 list, internal checks G1–G18 |
| [references/hooks-and-wording.md](references/hooks-and-wording.md) | Hook writing for any medium, wording rules, Vietnamese voice, before/after examples |
| [references/headline-patterns.md](references/headline-patterns.md) | Upworthy A/B patterns and hazards for English feed headlines; the hook scorer |
| [references/web-and-product-ui.md](references/web-and-product-ui.md) | Bounce diagnosis, scanning evidence, landing structure, layouts, product UI, motion, dark mode |
| [references/choice-architecture-and-pricing.md](references/choice-architecture-and-pricing.md) | Honest-selling floor, the pricing block, defaults, anchoring, tiers, trials, persuasion sequence |
| [references/video-and-motion.md](references/video-and-motion.md) | Short and long video, motion graphics, pattern changes, color script |
| [references/audio-podcast.md](references/audio-podcast.md) | Script timeline, podcast rules, the rewrite |
| [references/posters-slides-and-color.md](references/posters-slides-and-color.md) | Thumbnails, posters, comics, slides, color, computed contrast values |
| [references/platform-specs.md](references/platform-specs.md) | WCAG 2.2, Core Web Vitals, safe zones, captions, loudness, chapters, AV sync, each with source and check date |
| [references/evidence-caveats.md](references/evidence-caveats.md) | How to judge a claim, Tiers 1–3 with sources, citation index P01–P74 |

Maintenance rules: one quantity has one value (defaults live in `SKILL.md`; pricing defaults in the pricing file; platform numbers in `platform-specs.md`). `SKILL.md` stays under 15 KB. A reference over 100 lines keeps a table of contents. Every number has a named source or is marked as a heuristic. Research corpus and paper appraisals: `~/workspace/research/261107-attention-information-architecture/`.
