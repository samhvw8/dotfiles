# Control Panel

The signals the loop tracks each iteration and the **REASONING brain** reads to decide continue/stop and what to EXPAND. Maps to the user's stop questions.

## Signals

| Signal (user's words) | What it watches | Drives decision |
|---|---|---|
| *đủ số link chưa?* | quality links per topic vs threshold | continue / stop this topic |
| *đủ số topic chưa?* | topics / hypotheses still open | expand topics? |
| *nguồn trung đủ chưa?* | elite ZH sources count | add a ZH wave? |
| *nguồn anh đủ chưa?* | elite EN sources count | add an EN wave? |
| *cần diễn đàn / web mới?* | source diversity (all from same 2 sites?) | add forums |
| *cần crawl sâu web này?* | one URL yielding many leads | crawl deeper that site |
| *còn ra info mới không?* | new findings ÷ tokens (marginal return) | **anti-too-deep brake** — stop on decline |
| *còn mâu thuẫn không?* | unresolved contradictions / still-open hypotheses | keep loop alive → needs critique |

## Per-language sufficiency

Each language tracked independently so knowledge is not faked by one dominant language:

```
perLang[lang] = { sources: N, elite_sources: M, topics_covered: K/total }
```

The REASONING brain flags a language under-covered when `elite_sources < min_per_lang` (default 2).

## Marginal-return is the robust brake

`newInfoPerToken` works **without** a budget target (uses `budget.spent()` deltas, always real). It is the primary stop signal; the absolute budget ceiling is a secondary SCRAM. See [control-rod](control-rod.md).

## Related
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [control-rod](control-rod.md)
- [phase-zero-planning](phase-zero-planning.md)
- [overview](overview.md)
