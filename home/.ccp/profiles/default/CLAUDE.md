# Sam's global instructions

Always respond in English.

## How I want you to work

Use judgement over ceremony. These files describe my setup and my preferences —
they are not a checklist to perform. When guidance here is wrong for the task in
front of you, say so and do the right thing.

Delegation is a tool, not an identity. A targeted tool call you can run inline is
cheaper and better than spawning an agent for it. Delegate when work is genuinely
parallel, needs a fresh context window, or would flood this one — not to look
thorough. When you do delegate, a one-shot subagent is the default; spawn a named
teammate only when something will message it again, live or in a later turn.
See [rules/delegation-protocol.md](rules/delegation-protocol.md).

**Precedence when guidance conflicts:** the harness system prompt wins, then this
conversation, then project CLAUDE.md, then this file. If the harness disables a
tool or forbids a behavior these files ask for, the harness is right — don't argue
with it, and don't route around it.

## What to optimise for

Development cost is the cheap one now — AI writes the code. Weigh a design by what
it costs *after* it ships, not by how much work it is to build.

| Cost | Weight |
|------|--------|
| Infra — $/mo, quota ceilings, metered dependencies | highest |
| Operational — what breaks, what pages me, what I have to watch | highest |
| Maintenance — surface that needs re-tuning as it grows | high |
| Development — writing it | lowest |

Prefer the architecture that removes a running cost, even when it costs more to
build. Never reject a design for being "a lot of work" — say what it costs to *run*
instead. Deleting a class of maintenance beats optimising it: a query you no longer
make needs no index, no cache and no measurement discipline.

The honest counter-case, which still applies: a design that adds permanent surface —
two sources of truth, a sync step, a new tuning knob — to save a cost I am not
actually paying is a maintenance *increase*. Check what the meter really reads
before arguing from it.

## When corrected: trace, don't agree

"You're right" is compliance. Tracing the cause is progress.

1. **Trace** — what actually caused it? Ambiguous skill wording, a missing bridge
   between phases, completion bias? Name the mechanism.
2. **Fix the source** — propose the edit to the skill, rule, or this file that
   would prevent the whole class of failure, not just this instance.
3. **Then execute.**

Don't over-apply this. A slip that changes nothing for me needs no autopsy.

## Tools worth knowing about

These are non-obvious or easy to forget. The rest of the toolbox speaks for itself.

| Tool | Why it's here |
|------|---------------|
| `codegraph` / `sem` MCP | Symbol-level code graph — one call replaces a grep+Read crawl. See [rules/codegraph.md](rules/codegraph.md) |
| `mcp__parallax__fetch_page` | Gets through Cloudflare/bot-protection and JS-rendered pages that WebFetch and curl can't. Reach for it when WebFetch fails |
| `mcp__parallax__web_search` | ~90-engine meta-search — needs `PARALLAX_SCRAPER_URL`/`_TOKEN`; falls back to WebSearch if unconfigured |
| Parallax `focus` | On every list-shaped Parallax call (search, subreddit, comments, threads, feeds, tweets) pass `focus` — the question in one line — to get only the items that bear on it. `kept 0 of N` means broaden the focus, not give up. `fetch_page`/`batch_fetch` take `query` instead |
| `context7` MCP | Current library/framework docs. Prefer it over web search for API syntax |
| `bsk` CLI (`browser-skill`) | All browser work — drives my real, logged-in Chrome in a separate Agent Window. Load the `browser-skill` skill first. On SPAs (GitHub etc.) run `bsk wait-for-navigation` after a click, before `observe`. Screenshots: `--out` a png, never inline. Update with `mise up github:Tencent/BrowserSkill && bsk daemon restart`, never `bsk update` |
| `gh` CLI | GitHub search. `gh search issues`/`prs` surface breakage and workarounds that repo search misses |

**Web search:** never put a year in the query — it biases toward stale results.
Filter by date only when I ask for a specific range.

## Research

`lead-researcher` is the entry point for real research — it decides agent count,
languages, and depth, then spawns `gatherer` agents. Don't spawn `gatherer`
directly. Default languages EN + ZH + ZH-TW unless I say otherwise.

Single-fact lookups ("what version is X", "is Y deprecated") are just a WebSearch.
Don't route those through an orchestrator.

## Environment

**Models** — Opus 5 `claude-opus-5`, Sonnet 5 `claude-sonnet-5`, Fable 5
`claude-fable-5`, Haiku 4.5 `claude-haiku-4-5-20251001`. The `[1m]` suffix selects
the 1M-context variant. `model: 'opus'` / `'sonnet'` in an agent spec resolves to
the 5-generation model.

**mise** — polyglot version manager; replaces asdf, nvm, pyenv, direnv, and make
(it runs tasks too). Project config lives in `mise.toml`.

**ccp** — my profile manager. Active profile is symlinked into `~/.claude`;
the real files live in `~/.ccp/hub/`. Edit the hub copy, not the symlink.

## Rules index

Loaded automatically, so keep them small. Add detail as a skill instead.

| File | Covers |
|------|--------|
| [delegation-protocol.md](rules/delegation-protocol.md) | When to delegate, teammates vs subagents, how to equip one |
| [codegraph.md](rules/codegraph.md) | Code navigation via graph tools |
| [se.md](rules/se.md) | Verifiable goals, decision framing |
| [cognitive-framework.md](rules/cognitive-framework.md) | Surfacing uncertainty; frameworks for hard calls |
| [surgical-changes.md](rules/surgical-changes.md) | Scope discipline when editing |
| [documentation.md](rules/documentation.md) | Docs are OKF bundles — the `okf` skill is the how |

## Self-maintenance

When a pattern proves out or a convention changes, propose the edit to the right
file and wait for my approval. Prefer deleting a stale rule to adding a new one.
