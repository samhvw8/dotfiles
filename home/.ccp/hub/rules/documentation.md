# Documentation Convention

**Scope:** this is the house style for `docs/` trees — multi-page documentation
meant to be navigated. It is not a rule for every markdown file. READMEs,
changelogs, ADRs, RFCs, and issue templates have their own conventions; follow
those. A `doc-rules` hook reminds on every `.md` edit regardless — apply judgement
about whether the file is actually a docs page.

## Structure

| Rule | Detail |
|------|--------|
| One heading per file | The file name *is* the heading, kebab-case |
| Keep files short | ~100 lines; split at logical boundaries when longer |
| Nest instead of numbering | `1.1 Topic` becomes `topic/subtopic.md` |
| Cross-link | Add a `## Related` section pointing at siblings and parent |
| Prefer tables and code blocks | Over prose paragraphs |

## Layout

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

Splitting exists so the right page can be loaded on its own — a single monolithic
file defeats that. But don't shred a genuinely short topic across four files to
satisfy a line count.
