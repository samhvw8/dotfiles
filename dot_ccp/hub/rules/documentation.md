# Documentation Convention

When creating or updating documentation files, follow this structure.

## File Structure

- **One heading per file** — each file's name IS the heading (kebab-case)
- **Max 100 lines per file** — split longer content into separate files
- **Nested folders for sub-sections** — `1.1 Topic` becomes `topic/subtopic.md`
- **Cross-link with markdown** — use relative links between related docs

## Naming

| Content | File |
|---------|------|
| Top-level topic | `docs/topic/overview.md` |
| Sub-topic | `docs/topic/subtopic.md` |
| Deep sub-section | `docs/topic/subtopic/detail.md` |

## Example

```
docs/
├── auth/
│   ├── overview.md          <- "# Auth System"
│   ├── sessions.md          <- "# Sessions"
│   └── oauth/
│       ├── overview.md      <- "# OAuth 2.1"
│       └── pkce.md          <- "# PKCE Flow"
└── api/
    ├── overview.md
    └── endpoints.md
```

## Rules

- NEVER create a single monolithic doc file
- ALWAYS split at logical section boundaries
- ALWAYS add `## Related` section with links to sibling/parent docs
- File names use kebab-case, no numbers (use folder nesting instead)
- Prefer tables and code blocks over prose paragraphs
