# Streaming Verify

Verification runs as a consumer on the findings stream, not a barriered phase. Each finding is checked the moment it lands — user's *"không cần chờ chạy xong."*

## Pipeline shape

```js
pipeline(tasks,
  gatherWorker,    // emits Finding[] per task   (model: sonnet)
  normalize,       // raw → canonical Finding
  streamingVerify  // per-finding, the moment it lands (model: sonnet)
)
```

Finding A can be at `verify` while B is still being `gather`ed — no barrier.

## Per-finding checks (all local — never need "all findings")

| Check | Method | Verdict |
|---|---|---|
| Liveness | URL resolves / not 404 | dead → refuted |
| Tier | source priority (elite>github>official>blog>farm) | farm-only → weak |
| Claim-evidence | does quoted evidence support the claim? | unsupported → weak |
| Diagnosticity (ACH) | does it discriminate between answers? | non-diagnostic → tag, no coverage credit |
| Recency | last-commit / date | stale → flag |

## Critique (phản biện) rides the stream

A **Critic** agent tries to *refute* load-bearing claims as they verify. Unresolved contradictions keep the loop alive (a control-panel gauge). Contradiction detection is keyed by `sub_q_id` — compare a new finding only against verified ones on the same sub-question, not all (near-streaming, O(sub-q) not O(all)).

## Priority window (not FIFO)

A stream can't be fully ordered without a barrier, but a small buffer (~20) re-sorts by importance before verifying, so when budget dies mid-stream the **contested, single-source, load-bearing** claims are the ones verified — not trivia. Sort on content-derived score only (deterministic; no `Date.now`/`Math.random`).

## Under budget pressure

| Rule | Effect |
|---|---|
| Verify has its own fenced reserve | not stolen from synthesis |
| Corroborated multi-source findings skip verify | free importance win |
| Exhausted mid-stream → mark `unverified`, don't drop | synthesis cites with caveat |
| Synthesis discloses coverage | "187 findings, 40 verified" — honest |

## Why stream (the real reason)

Not latency (reports are read async) — **feedback**: a refuted finding lowers a sub-question's coverage *before* CONTROL runs, so the brain steers on accurate state in the same generation.

## Related
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [control-panel](control-panel.md)
- [overview](overview.md)
