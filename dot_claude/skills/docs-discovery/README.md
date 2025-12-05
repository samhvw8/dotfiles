# Documentation Discovery Skill

**Version 4.0** - Simplified, LLM-first approach

## What Changed

### Before (v3.x)
- 600+ lines of Node.js scripts for pattern matching
- Hardcoded regex for English queries only
- Programmatic URL construction
- Complex categorization logic
- Zero flexibility for creative queries

### After (v4.0)
- Simple prompts guide Claude's natural reasoning
- Works with any language, handles typos, creative phrasing
- Uses basic curl/grep for data retrieval
- Claude does intelligent categorization
- Fully adaptable and maintainable

## Key Principles

1. **Skills provide PROMPTS, not scripts** - Guide Claude's intelligence, don't replace it
2. **LLM for reasoning, bash for data** - Use Claude for analysis, curl/grep for retrieval
3. **Flexibility over rigidity** - Adapt to any query style, not just hardcoded patterns
4. **Maintainability** - Update URL patterns in markdown, not code

## Usage

See `SKILL.md` for complete documentation.

**Quick example:**
```
User: "How do I use date picker in shadcn?"

Claude analyzes:
- Library: shadcn/ui → shadcn-ui/ui
- Topic: date

Claude fetches:
curl "https://context7.com/shadcn-ui/ui/llms.txt?topic=date"

Claude processes results and presents documentation
```

## Migration Notes

If you were using the old scripts:
- `detect-topic.js` → Claude analyzes queries naturally
- `fetch-docs.js` → Use curl commands from SKILL.md
- `analyze-llms-txt.js` → Claude reasons about URL priorities

Old scripts archived in `archive/` directory for reference.
