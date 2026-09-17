# Output Templates

Standard output formats for presenting CLAUDE.md files to users.

## When Generating New CLAUDE.md

### Presentation format

1. Display the generated CLAUDE.md content in a code block
2. Explain customizations based on codebase analysis
3. Highlight key decisions (why X over Y)
4. Suggest optional additions
5. Provide installation instructions

### Example Output

```
I've analyzed your Next.js project and generated a CLAUDE.md optimized for your stack:

[Show CLAUDE.md content]

Key customizations:
- Added app router-specific file organization
- Included your Prettier/ESLint config patterns
- Detected Playwright tests, added E2E workflow guidance
- Configured context7 for React/Next.js official docs

Optional additions (if needed later):
- Deployment workflow for Vercel
- Database migration process (saw Prisma, but no clear migration docs)
- Storybook component documentation process

Save to: .claude/CLAUDE.md (or project root)

Next step: Try Claude Code on a small task and iterate based on effectiveness.
```

## When Optimizing Existing CLAUDE.md

### Presentation format

1. Summarize issues found
2. Show before/after comparison for key sections
3. Present optimized full version
4. Quantify improvements (token savings, clarity gains)
5. Suggest iteration approach

### Example Output

```
Analysis of your current CLAUDE.md:

Issues identified:
- 847 tokens (could be reduced to ~350)
- Generic advice duplicating README
- Auto-loading entire src/ directory (high token cost)
- Missing workflow routing for common tasks

Token optimization example:

Before (127 tokens):
[Show verbose section]

After (38 tokens):
[Show concise version]

Savings: 70% reduction, same guidance

[Show full optimized CLAUDE.md]

Improvements:
- Token count: 847 → 362 (57% reduction)
- On-demand context loading (saves ~200 tokens per request)
- Added workflow routing for bug fixes, features, tests
- Removed generic content duplicated in README

Suggested iteration:
1. Use this version for 3-5 Claude Code sessions
2. Note any missing context (add to on-demand loading)
3. Remove sections that never get referenced
4. Consider custom slash commands if patterns emerge
```

## Philosophy Statement

Always remind users:

```
Philosophy:
- CLAUDE.md is a living document, not permanent documentation
- Start minimal, add based on actual friction points
- Remove guidance that doesn't improve Claude's output
- Measure effectiveness: fewer clarifying questions = better CLAUDE.md

When in doubt:
- Prefer concise over comprehensive
- Prefer specific over generic
- Prefer examples over explanations
- Prefer on-demand over auto-loading

Remember:
- User has global principles in ~/.claude/PRINCIPLES.md
- User has MCP documentation in ~/.claude/MCP_*.md
- Project CLAUDE.md should not duplicate these
- Focus exclusively on project-specific patterns and requirements
```
