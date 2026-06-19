# Codebase Query Patterns

Reference for constructing effective `codebase` MCP (codebase-memory-mcp) queries. Codebase handles ALL code-related searches — grep is only for non-code text.

## Core Principle: Heavy-Think Query Construction

Before every query, STOP and think:

| Step | Question | Action |
|------|----------|--------|
| 1 | What am I actually looking for? | Name the concept, not a keyword |
| 2 | What synonyms exist? | Add 2-3 alternate terms |
| 3 | One domain or many? | Split cross-domain into sub-queries |
| 4 | Too narrow? | Broaden with related concepts |

**The #1 bug:** sending a single keyword when you need a concept cluster.

## Pattern 1: Symbol Search (`search_graph`)

| Intent | Args |
|--------|------|
| Find handlers | `{"name_pattern": ".*Handler.*", "label": "Function"}` |
| Find a class | `{"name_pattern": "UserService", "label": "Class"}` |
| Scope to a file | `{"file_pattern": ".*/auth/.*", "label": "Function"}` |
| High-fan-in nodes | `{"label": "Function", "min_degree": 5}` |

## Pattern 2: Call Graph (`trace_path`)

| Intent | Args |
|--------|------|
| What calls X? | `{"function_name": "deductCredits", "direction": "in"}` |
| What does X call? | `{"function_name": "deductCredits", "direction": "out"}` |
| Both, deeper | `{"function_name": "Search", "direction": "both", "depth": 3}` |

## Pattern 3: Cypher (`query_graph`)

Read-only openCypher subset: MATCH, OPTIONAL MATCH, WHERE, WITH, RETURN, ORDER BY, SKIP, LIMIT, DISTINCT, UNWIND, UNION. Operators `=`,`<>`,`<`,`>`,`IN`,`CONTAINS`,`STARTS WITH`,`=~`. Aggregates count/sum/avg/min/max/collect.

| Intent | Query |
|--------|-------|
| Dead code | `MATCH (f:Function) WHERE NOT EXISTS { (f)<-[:CALLS]-() } RETURN f.name` |
| Top callees | `MATCH (f:Function) RETURN f.name LIMIT 5` |

## Pattern 4: Architecture & Behavior

| Intent | Tool |
|--------|------|
| Codebase overview | `get_architecture {"aspects": ["all"]}` |
| Read a function's source | `get_code_snippet {"qualified_name": "pkg.Type.Method"}` |
| Grep-like over indexed files | `search_code {"query": "validate"}` |
| Diff risk / impacted symbols | `detect_changes` |
| Persist architectural insight | `manage_adr {"mode": "store"}` |

## Query Decomposition

| Signal | Action |
|--------|--------|
| Ambiguous terms | Split by meaning into separate `search_graph` calls |
| Cross-domain | One query per domain |
| Too many results | Narrow with `label` / `file_pattern` |
| Too few results | Broaden the `name_pattern` regex / add synonyms |

## The Grep Trap: Word Collision

| Term | Grep noise | Codebase signal |
|------|-----------|-----------------|
| `ad` | `upload`, `loadAudio` | `AdReward`, `showAd` |
| `token` | CSRF, JWT parsing | `AuthToken`, `validateToken` |
| `state` | `useState`, CSS | `JobState`, `MachineState` |

## Quick Reference

```
# I need...                       -> Use...
anything about code               -> codebase (search_graph, trace_path, query_graph, get_architecture)
function source by name           -> codebase get_code_snippet
grep-like over indexed files      -> codebase search_code
literal text in non-code files    -> grep
exact error strings / globs       -> grep
```

## Related

- [codebase.md](codebase.md) — gate rule and usage
- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — delegate explore to subagents
