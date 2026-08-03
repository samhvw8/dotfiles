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
| `mcp__parallax__web_search` | On par with WebSearch — needs `PARALLAX_SCRAPER_URL`/`_TOKEN`; falls back to WebSearch if unconfigured |
| `context7` MCP | Current library/framework docs. Prefer it over web search for API syntax |
| Chrome MCP | Screenshots: **save png, never base64** — base64 floods the context |
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
| [documentation.md](rules/documentation.md) | Structure for `docs/` trees |

## Self-maintenance

When a pattern proves out or a convention changes, propose the edit to the right
file and wait for my approval. Prefer deleting a stale rule to adding a new one.
