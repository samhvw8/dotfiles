# Control Panel

The coverage gauges the GAUGE step updates each iteration and the CONTROL agent reads. Maps directly to the user's stop questions.

## Gauges

| Gauge (user's words) | Signal it watches | Drives decision |
|---|---|---|
| *đủ số link chưa?* | quality links per sub-question vs threshold | continue / stop this topic |
| *đủ số topic chưa?* | sub-questions still at "gap" | expand topics? |
| *nguồn trung đủ chưa?* | elite ZH sources count | add a ZH wave? |
| *nguồn anh đủ chưa?* | elite EN sources count | add an EN wave? |
| *cần diễn đàn / web mới?* | source diversity (all from same 2 sites?) | add forums |
| *cần crawl sâu web này?* | one URL yielding many leads | crawl deeper that site |
| *còn ra info mới không?* | new findings ÷ tokens (marginal return) | **anti-too-deep brake** — stop on decline |
| *còn mâu thuẫn không?* | unresolved contradictions | keep loop alive → needs critique |

## Per-language sufficiency

Each language tracked independently so coverage is not faked by one dominant language:

```
coverage[lang] = { sources: N, elite_sources: M, sub_q_covered: K/total }
```

The CONTROL agent flags a language as under-covered when `elite_sources < min_per_lang` (default 2).

## Marginal-return is the robust brake

`newInfoPerToken` works **without** a budget target (uses `budget.spent()` deltas, always real). It is the primary stop signal; the absolute budget ceiling is a secondary SCRAM. See [control-rod](control-rod.md).

## Related
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [control-rod](control-rod.md)
- [phase-zero-planning](phase-zero-planning.md)
- [overview](overview.md)
