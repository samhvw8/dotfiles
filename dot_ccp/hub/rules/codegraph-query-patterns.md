# CodeGraph Query Patterns

Reference for constructing effective codegraph queries. Codegraph handles ALL code-related searches — grep is only for non-code text.

## Core Principle: Heavy-Think Query Construction

Before every codegraph query, STOP and think:

| Step | Question | Action |
|------|----------|--------|
| 1 | What am I actually looking for? | Name the concept, not a keyword |
| 2 | What synonyms exist? | Add 2-3 alternate terms |
| 3 | Is this one domain or many? | Split cross-domain into sub-queries |
| 4 | Am I being too narrow? | Broaden with related concepts |

**The #1 bug:** sending a single keyword when you need a concept cluster. `"credit"` misses; `"credit deduct balance refund tier"` finds everything.

## Pattern 1: Natural Language (Default)

Codegraph accepts full questions. Use them freely:

| Intent | Query |
|--------|-------|
| How auth works | `"how does authentication and session management work"` |
| Upload flow | `"how does file upload trigger transcription processing"` |
| Data model | `"credit balance tier subscription schema types"` |
| Webhook handling | `"webhook handler callback incoming event processing"` |

## Pattern 2: Topic Scan

| Intent | Codegraph query | Why not grep |
|--------|----------------|--------------|
| Billing domain | `"credit tier billing pricing payment"` | Grep matches `credit` in comments, `tier` in CSS |
| Auth system | `"authentication session token login oauth"` | Grep matches `token` in CSRF, `session` in storage |
| Upload flow | `"upload file attachment storage presigned"` | Grep misses `putObject`, `multipart` |
| Admin features | `"admin panel console management dashboard"` | Grep matches `admin` in seed data, env vars |

## Pattern 3: Call Graph

| Intent | Tool | Query |
|--------|------|-------|
| What calls X? | `callers("symbolName")` | Direct callers with source |
| What does X call? | `callees("symbolName")` | Full dependency tree |
| Blast radius | `impact("symbolName")` | Transitive dependents |
| End-to-end trace | `explore("startSymbol middleSymbol endSymbol")` | Name the flow endpoints |

## Pattern 4: Behavior Search

| Intent | Query |
|--------|-------|
| Find validation logic | `search("validate check constraint", kind="function")` |
| Find error handlers | `search("error handler catch fallback", kind="function")` |
| Find API routes | `search("endpoint route handler", kind="route")` |
| Find React/Svelte components | `search("dashboard settings modal", kind="component")` |

## Query Decomposition

| Signal | Action | Example |
|--------|--------|---------|
| Ambiguous terms | Split by meaning | `"ad reward"` separate from `"audio upload"` |
| Cross-domain | One query per domain | Auth: `"login session"` + Billing: `"credit tier"` |
| Too many results | Narrow with kind | `search("upload", kind="function")` |
| Too few results | Broaden with synonyms | `"save persist store write"` instead of `"save"` |
| Tightly coupled terms | One query is enough | `"credit deduct balance refund"` |

## The Grep Trap: Word Collision

| Term | Grep noise | Codegraph signal |
|------|-----------|-----------------|
| `ad` | `upload`, `loadAudio`, `addEventListener` | `AdReward`, `showAd` |
| `token` | CSRF, JWT parsing, tokenizer | `AuthToken`, `validateToken` |
| `type` | TypeScript keywords everywhere | `TranscriptType`, `PlanType` |
| `state` | `useState`, Redux, CSS state | `JobState`, `MachineState` |

## Quick Reference

```
# I need...                          -> Use...
anything about code                  -> codegraph (query, search, explore, callers, callees, impact)
literal text in non-code files       -> grep
exact error strings                  -> grep
file extension patterns              -> grep (or glob)
everything else about code           -> codegraph
```

## Related

- [codegraph.md](codegraph.md) — gate rule and usage
- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — delegate explore to subagents
