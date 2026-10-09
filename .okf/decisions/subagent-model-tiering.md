---
type: Decision
title: "Subagent model tiering: where Haiku 5.5 fits"
description: "Which subagent jobs run on Haiku 5.5, Sonnet 5.5 or Opus 5.5, based on 30 days of session usage and an A/B test of the gatherer agent; tracks the rollout."
tags: [decision, claude-code, subagents, models, cost, haiku]
status: draft
generated: { by: claude-code/claude-opus-5-5, at: 2026-10-09T23:30:00Z }
stale_after: 2027-01-09
sources:
  - id: usage
    resource: ~/.claude/projects/**/*.jsonl
    title: Claude Code session transcripts, 2026-09-09 to 2026-10-09 (1,997 files)
  - id: cc-subagents
    resource: https://code.claude.com/docs/en/sub-agents
    title: Claude Code docs, Create custom subagents (Choose a model)
  - id: cc-models
    resource: https://code.claude.com/docs/en/model-config
    title: Claude Code docs, Model configuration (aliases, version history)
  - id: pricing
    resource: claude-api skill, Current Models table (cached 2026-10-06)
    title: Anthropic API model pricing
  - id: ab2
    resource: ~/workspace/research/261009-haiku-gatherer-ab-r2/
    title: Gatherer A/B round 2 (second topic, CJK Haiku at effort high)
  - id: ab3
    resource: ~/workspace/research/261009-haiku-gatherer-ab-r3/
    title: Gatherer A/B round 3 (Cloudflare Workers; Haiku at effort high in all languages)
  - id: ab5
    resource: ~/workspace/research/261009-haiku-gatherer-ab-r5/
    title: Gatherer A/B rounds 4–5 and five-round summary
  - id: knowledge
    resource: ~/workspace/knowledge/topics/ai-agents/small-models-as-subagent-workers.md
    title: Small models as subagent workers (cross-project synthesis)
  - id: squad
    resource: ~/workspace/research/261009-squad-v2/result.md
    title: Gather squad v2.1 vs v1, Keycloak, 2 blind pairs
  - id: squad-r6
    resource: ~/workspace/research/261009-squad-r6/result.md
    title: Lead coverage-pass A/B, Grafana LGTM, 2 blind pairs
  - id: ab
    resource: ~/workspace/research/261009-haiku-gatherer-ab/
    title: Gatherer A/B test, Sonnet 5.5 vs Haiku 5.5
---

# Context (2026-10-09)

Haiku 5.5 costs $0.10 / $0.50 per million input/output tokens (prompts up to
100K; $0.50 / $2.50 above). That is 20× cheaper than Sonnet 5.5 ($2 / $10) and
40× cheaper than Opus 5.5 ($4 / $20).[^pricing]

Usage over the 30 days before this decision:[^usage]

| Where | Runs | Input tokens | Output tokens | Model |
|---|---|---|---|---|
| Main sessions | — | ~26.3B | ~101M | Opus 5.5 / Opus 5 / Fable 5.1 |
| `general-purpose` subagents | 1,121 | 7.7B | 25.0M | mostly Opus 5.5 (inherited; 722 spawns had no `model`) |
| `gatherer` subagents | 253 | 2.6B | 6.8M | mostly Sonnet (`lead-researcher` passes `model: "sonnet"`) |
| Haiku, any version | — | 0.13B | 0.5M | Haiku 4.5 only |

# Facts that shape the change

- The `haiku` alias resolves to Haiku 5.5 on the Anthropic API since Claude
  Code v2.1.293.[^cc-models] The Haiku 4.5 runs above came from older
  versions. Keep the alias; do not pin `claude-haiku-5-5`.
- Model resolution order: per-invocation `model` parameter, then the agent's
  `model` frontmatter, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the main
  model.[^cc-subagents] So `gatherer.md` frontmatter alone changes nothing
  while `lead-researcher` passes `model: "sonnet"`.

# Decision (rolled out 2026-10-09; gatherer row revised twice the same day: recall, then speed)

| Job | Model |
|---|---|
| `gatherer`, every language | A squad per assignment: uncapped Sonnet lead + Haiku `effort: high` code, social and docs slices with call caps + a Haiku opener on their unopened leads (see [gather-squad](#gather-squad); spec in `lead-researcher/references/gather-squad.md`) |
| Mechanical batch work (transcribe, translate, re-source, bulk OKF writing from given input) | Haiku |
| `Explore`, `scout`, `docs-manager`, `journal-writer`, `claude-code-guide` | Haiku |
| Cross-checkers, streaming verifiers | Sonnet |
| Main session, REASONING brain, synthesis, judges, arena/council, perf profiling | Opus (or Fable) |

# A/B test

Same prompt, 1 sub-topic × 3 languages (EN, ZH, ZH-TW), run once on `sonnet`
and once on `haiku`. Results: [ab-result](#ab-result).[^ab]

## ab-result

Run 2026-10-09, n = 1 per cell; one blind Opus judge per language pair,
each fetching 5 load-bearing claims per report.[^ab]

| Pair | Est. API $ (Sonnet / Haiku) | Judge total (Sonnet / Haiku) | Winner |
|---|---|---|---|
| EN | 0.84 / 0.06 | 43 / 41 of 50 | Sonnet, slight |
| ZH | 0.78 / 0.04 | 49 / 41 of 60 | Sonnet, clear |
| ZH-TW | 0.56 / 0.05 | 49 / 39 of 60 | Sonnet, clear |

- Haiku costs ~14× less per run, writes ~2× the output tokens and can take
  up to 1.7× the wall time.
- Haiku invented no sources: 14 of 15 checked claims were supported, 1 partial.
- English: near parity. Non-English: Haiku falls back to English and
  Simplified Chinese sources (ZH-TW language score 3/10) and misses the
  native forums (iThome, PTT, linux.do) that Sonnet reached. It also
  over-tags GEMs.

Result: Haiku for English gatherers, Sonnet for non-English gatherers.

## ab-round-2

Run 2026-10-09 on a second topic (self-hosted LLM inference serving).
EN at default effort; the ZH and ZH-TW Haiku arms at `effort: high`. Both arms
used the new invariant-keyword rule.[^ab2]

| Pair | Est. API $ (Sonnet / Haiku) | Judge total (Sonnet / Haiku) | Winner |
|---|---|---|---|
| EN | 1.14 / 0.02 | 39 / 41 of 50 | Sonnet, slight |
| ZH | 1.04 / 0.04 (high) | 49 / 39 of 60 | Sonnet, clear |
| ZH-TW | 0.69 / 0.05 (high) | 49 / 49 of 60 | Haiku, slight |

- 33 of 33 spot checks were supported across both arms.
- EN Haiku stopped early (26 tool calls vs 56) and lost on coverage, but
  scored higher on source quality and tag honesty.
- ZH: higher effort did not fix language. Haiku's gems leaned on English
  GitHub, Juejin and Bilibili (language 5/10 vs 8).
- ZH-TW: higher effort closed the round-1 gap (39 → 49 of 60).

Two-round verdict: keep the split. Haiku for English, Sonnet for every
other language. ZH-TW on Haiku high needs a third run before switching.

## ab-round-3

Run 2026-10-09 on a third topic (Cloudflare Workers in production). Haiku at
`effort: high` in all three languages.[^ab3]

| Pair | Est. API $ (Sonnet / Haiku high) | Judge total (Sonnet / Haiku) | Winner |
|---|---|---|---|
| EN | 0.67 / 0.06 | 39 / 40 of 50 | Haiku, clear (25 vs 10 unique gems) |
| ZH | 0.84 / 0.06 | 50 / 42 of 60 | Sonnet, slight |
| ZH-TW | 0.71 / 0.05 | 49 / 37 of 60 | Sonnet, slight |

- EN: effort high fixed the early stop (68 tool calls vs 23–49 at default),
  at ~2.3× Sonnet's wall time.
- ZH and ZH-TW: language scores of 5 and 4. Haiku still padded with English
  docs and zh-CN sources.
- Haiku tags official-doc restatements as GEM in every round of this test.

Three-round verdict: English gatherers on Haiku at `effort: high`; every
other language on Sonnet.

## ab-rounds-4-5

Rounds 4 (home NAS and backup) and 5 (indie SaaS monetization), off the
cloud/AI topics, Haiku at `effort: high`, with a prompt line that tags
vendor-doc restatements as MEH in both arms.[^ab5]

| Round | EN | ZH | ZH-TW | Cost S / H |
|---|---|---|---|---|
| 4 | Sonnet slight (41/35) | Sonnet slight (49/49) | Haiku slight (46 vs 48) | $2.48 / $0.16 |
| 5 | Haiku clear (42/37) | Sonnet clear (50/41) | Haiku slight (42 vs 45) | $2.20 / $0.16 |

Five-round verdict, Haiku at high effort:

| Language | Mean total S / H | Wins S–H | Decision |
|---|---|---|---|
| EN | 39.0 / 39.0 of 50 | 1–2 | Haiku at `effort: high` |
| ZH | 49.5 / 42.8 of 60 | 4–0 | Sonnet |
| ZH-TW | 47.8 / 43.5 of 60 | 1–3, all slight | Sonnet by default; Haiku high is a cost option |

No invented sources in 30 reports. The MEH tagging line raised Haiku's
tag-honesty mean from 5.3 (round 3) to 7.2 (rounds 4–5).

## recall-over-cost

The owner set the research objective: miss no knowledge; speed and cost are
secondary. The five-round verdict above ranked arms by judge total and cost,
which is the wrong target for that objective. Unique gems (gems the judge
found in one report and not the other) show that each arm misses what the
other finds:

| Pair (Haiku high) | Unique gems Sonnet / Haiku |
|---|---|
| EN r3 / r4 / r5 | 10 / 25 · 12 / 13 · 6 / 17 |
| ZH r3 / r4 / r5 | 11 / 10 · 9 / 11 · 22 / 11 |
| ZH-TW r3 / r4 / r5 | 8 / 10 · 13 / 16 · 4 / 7 |

Any single-model choice drops 4–25 gems per assignment. Running both arms
keeps them for about $0.05 extra per assignment (about +7% over Sonnet alone).
Wall time is the slower arm, Haiku, at 1.5–3× Sonnet.

Caveats: Haiku over-tags GEM, so some of its unique gems are vendor
restatements (fixed in part by tracking item 14). Not tested: whether a second
Sonnet run finds as many extra gems as the Haiku twin. Part of the gain may
come from a second sample, not from model diversity.

## gather-squad

The owner then set speed as the second objective, after recall. The dual
Sonnet + Haiku arm doubled wall time, so it was replaced by a squad split by
source (`lead-researcher/references/gather-squad.md`). Each change was tested
in blind A/B rounds on new topics:

| Round | Change tested | Result |
|---|---|---|
| r1–r4 (mesh VPN, Bun, Postgres on K8s, Home Assistant) | strict tags, lead cap, opener, code reserve | strict tags cut inflation 60%→14%; lead cap lost 8–10 gems (rejected); opener +21% gems; code reserve 5→13 new gems |
| Validation 2 (Keycloak), 2 pairs | full v2.1 squad vs v1 squad | v2.1 won both clearly: 77 vs 54 and 68 vs 48 unique gems; v2.1 leads alone weaker (17 vs 26 searches)[^squad] |
| r6 (Grafana LGTM), 2 pairs | lead COVERAGE PASS stop rule | won both clearly: 26 vs 17 and 35 vs 20 unique gems; +75–110 s lead time[^squad-r6] |

Open cost: v2.1 wall time was 400–600 s against 340 s for v1, because the
code slice (5 reserved opens) and then the opener run longer than the lead.
Reddit through Parallax returned HTTP 429 for every social slice, so social
coverage is close to zero until access is fixed.

# Tracking

| # | Item | Status |
|---|---|---|
| 1 | Run gatherer A/B, record cost and quality | done 2026-10-09 |
| 2 | `lead-researcher`: gatherer model by language, EN → `haiku`, others stay `sonnet` (SKILL.md Model Tiering, `GATHER_MODEL` map in the workflow examples, Phase 3, `team-research.md`, `atomic-components.md`, `streaming-verify.md`) | done 2026-10-09 |
| 3 | `agents/gatherer.md`: leave `model` unset; the per-call model from `lead-researcher` decides | decided |
| 4 | Round 2 on a second topic (self-hosted LLM inference serving): EN Sonnet vs Haiku; ZH and ZH-TW Sonnet vs Haiku at `effort: high` | done 2026-10-09: split confirmed |
| 5 | `delegation-protocol.md`: mechanical batch jobs (transcribe, translate, re-source) pass `model: "haiku"` | open |
| 6 | User-level `Explore` agent with `model: haiku` (the built-in inherits the main model, so 7 recent runs used Opus)[^cc-subagents] | open |
| 7 | Spawn gatherers as plain subagents, never with `name`: named spawns became teammates and 4 of 6 could not answer the shutdown request | done: `lead-researcher` Phase 3 says so |
| 9 | `deep-gather`: on literal-match platforms (GitHub, X, Reddit, forum search) anchor queries on invariant keywords (names, flags, error strings); the language assignment picks which posts to find, not which tokens to translate. User's rule, added 2026-10-09; round 2 is the first run with it, in both arms | done |
| 8 | Re-measure 30 days after rollout: gatherer tokens by model, research quality complaints. Output tokens read 0 in subagent transcripts (claude-code #100154), so measure input and cache, or use headless runs | open |
| 10 | Inline venue: plain subagents refuse to write report files, so `lead-researcher` must save each gatherer's hand-back to its report path; `gatherer.md` still says the agent saves it | open, proposed |
| 11 | `deep-gather`: linux.do HTML shows only an anti-AI banner; append `.json` to the topic URL for the post body | open, proposed |
| 12 | Round 3: Haiku at `effort: high` in EN, ZH and ZH-TW on a third topic (Cloudflare Workers) | done 2026-10-09: EN Haiku won clearly; ZH and ZH-TW stay on Sonnet |
| 13 | `lead-researcher`: Haiku gatherers pass `effort: "high"`; Workflow `agent()` accepts `effort` (workflow-authoring reference) | done 2026-10-09 inside item 16 |
| 14 | `deep-gather` tagging: a restatement of official docs or pricing is MEH unless it contradicts a practitioner report or another doc | open, proposed; tested as a prompt line in rounds 4–5, Haiku tag honesty 5.3 → 7.2 |
| 15 | ZH-TW gatherer: keep Sonnet or move to Haiku high (judges 3–1 for Haiku, mean totals 47.8 vs 43.5 for Sonnet) | superseded by item 16 |
| 16 | Recall first: every gatherer assignment runs on both Sonnet and Haiku high (`GATHER_ARMS` in `lead-researcher` SKILL.md, Phase 3, `team-research.md`, `atomic-components.md`, `streaming-verify.md`) | superseded by item 19 |
| 17 | Test Sonnet ×2 vs Sonnet + Haiku high on one topic, to separate model diversity from a second sample | dropped with item 16 |
| 18 | Speed test (owner wants speed second, recall first): split each job by source across Sonnet + 3 Haiku slices. Uncapped split was slower (EN 490s vs 340s, ZH 400s vs 358s) but found far more (EN 90 vs 33 gems); 15-call-capped slices took 57–116s. Proposed: 1 uncapped Sonnet whole-job + 3 capped Haiku slices in parallel. Results: `~/workspace/research/261009-split-speed-test/result.md` | tested; design awaits owner → done as item 19 |
| 19 | Gather squad v2.2 in `lead-researcher` (`SQUAD` in SKILL.md, `references/gather-squad.md`): lead + code/social/docs slices + opener, strict tags, PARALLEL line | done 2026-10-09 |
| 20 | Lead COVERAGE PASS stop rule; only the code slice runs `gh search` (30/min shared quota) | done 2026-10-09 |
| 21 | Speed: code slice + opener is the critical path (r7: code 366 s + opener ≈ 500 s; coverage-pass lead 230–270 s). Untested candidate: start the opener on social + docs leads when they return, and leave code leads to the code slice's reserve phase. Results: `~/workspace/research/261009-squad-r7/result.md` | open |
| 22 | Reddit via Parallax returned HTTP 429/HTML for a whole session. Fallback: `lead-researcher/scripts/reddit-read.sh` reads threads and subreddit searches through the owner's logged-in browser (`bsk`); social slice 0 → 6 gems | done 2026-10-09 |
| 23 | Code slice: exact `gh search issues --repo` form and Discussions search via `gh api graphql` (22 of 54 calls had failed on quoting); 10 → 39 self-tagged gems, 270 → 366 s | done 2026-10-09 |

[^pricing]: Anthropic API list prices, first-party.
[^usage]: Aggregated from `message.usage` in assistant turns; subagent type from `subagents/*.meta.json`.
[^cc-models]: Model aliases table and version history, v2.1.293 row.
[^cc-subagents]: "Choose a model" section.
[^ab]: Reports in `sonnet/` and `haiku/`; costs, judge scores and blind key in `result.md`.
[^ab2]: `~/workspace/research/261009-haiku-gatherer-ab-r2/result.md`.
[^squad]: `~/workspace/research/261009-squad-v2/result.md`.
[^squad-r6]: `~/workspace/research/261009-squad-r6/result.md`.
[^ab3]: `~/workspace/research/261009-haiku-gatherer-ab-r3/result.md`.
[^ab5]: `~/workspace/research/261009-haiku-gatherer-ab-r5/result.md` (rounds 4–5 and the five-round summary).
