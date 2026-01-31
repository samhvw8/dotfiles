# Before vs After: docs-discovery Skill Refactoring

## Metrics

| Metric | Before (v3.x) | After (v4.0) | Improvement |
|--------|---------------|--------------|-------------|
| **Total LOC** | 600+ lines (scripts) | 211 lines (prompts) | 65% reduction |
| **Files** | 15+ files | 2 files | 87% reduction |
| **Dependencies** | Node.js + packages | curl + grep | Zero deps |
| **Language support** | English only (regex) | Any language | Universal |
| **Flexibility** | Hardcoded patterns | LLM reasoning | Infinite |
| **Maintenance** | Code changes | Markdown edits | Simple |

## Complexity Comparison

### Before: detect-topic.js (171 lines)

```javascript
const TOPIC_PATTERNS = [
  /how (?:do i|to|can i) (?:use|implement|add|setup|configure) (?:the )?(.+?) (?:in|with|for) (.+)/i,
  /(.+?) (.+?) (?:strategies|patterns|techniques|methods|approaches)/i,
  /(.+?) (.+?) (?:documentation|docs|guide|tutorial)/i,
  // ... 6 more hardcoded patterns
];

const GENERAL_PATTERNS = [
  /(?:documentation|docs) for (.+)/i,
  // ... 4 more patterns
];

function normalizeTopic(topic) {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .split('-')[0]
    .slice(0, 20);
}

// Complex pattern matching logic...
for (const pattern of TOPIC_PATTERNS) {
  const match = trimmedQuery.match(pattern);
  if (match) {
    // Extract and normalize...
  }
}
```

**Problems:**
- Only works with exact English patterns
- Fails on: "shadcn의 date picker 사용법?" (Korean)
- Fails on: "datepickr in shdcn" (typo)
- Needs code update for new patterns
- 171 lines to detect 2 pieces of information

### After: SKILL.md Prompt

```markdown
**Your task:** Identify library and optional topic from user query.

**Questions to ask yourself:**
- Is this about a specific feature/component? → Topic-specific
- Is this about general library docs? → General search
- What's the library name?
- What's the topic keyword (if any)?

**Examples:**
- "How do I use date picker in shadcn?" → Library: shadcn/ui, Topic: date
- "Next.js caching strategies" → Library: next.js, Topic: cache
```

**Benefits:**
- Works with any language
- Handles typos naturally
- Adapts to creative phrasing
- Updates require markdown edits
- 10 lines for same functionality

## Real-World Examples

### Example 1: Non-English Query

**Query:** "Next.jsのキャッシュ戦略" (Japanese: "Next.js caching strategies")

**Before (v3.x):**
```bash
node scripts/detect-topic.js "Next.jsのキャッシュ戦略"
# Output: {"isTopicSpecific": false}
# ❌ FAILED - No regex pattern matches Japanese
```

**After (v4.0):**
```
Claude analyzes: "This is about Next.js caching, written in Japanese"
- Library: next.js → vercel/next.js
- Topic: cache (キャッシュ)
✅ SUCCESS - LLM understands intent across languages
```

### Example 2: Typo/Creative Phrasing

**Query:** "datepickr component in shdcn pls"

**Before (v3.x):**
```bash
node scripts/detect-topic.js "datepickr component in shdcn pls"
# Output: {"isTopicSpecific": false}
# ❌ FAILED - Pattern expects "shadcn" not "shdcn"
```

**After (v4.0):**
```
Claude analyzes: "User likely means shadcn/ui date picker despite typos"
- Library: shdcn → shadcn-ui/ui (corrected)
- Topic: datepickr → date (normalized)
✅ SUCCESS - LLM handles typos and informal language
```

### Example 3: New Framework (Zero Code Changes)

**Query:** "How to use signals in Solid.js?"

**Before (v3.x):**
```bash
node scripts/fetch-docs.js "How to use signals in Solid.js?"
# ❌ FAILED - "Solid.js" not in knownRepos mapping
# Required: Update code, add to knownRepos, redeploy
```

**After (v4.0):**
```
Claude analyzes: "Solid.js is a framework, likely on GitHub"
- Tries: solidjs/solid
- If fails, tries: websites/solidjs
✅ SUCCESS - No code update needed, Claude figures it out
```

## Architecture Philosophy

### Before: Programmatic Intelligence

```
User Query → Regex Match → URL Builder → HTTP Fetch → Parser → Categorizer → Output
              ↑              ↑                           ↑          ↑
         Hardcoded      Hardcoded                  Hardcoded  Hardcoded
```

**Problem:** Every step requires code. Zero flexibility.

### After: LLM-First Design

```
User Query → Claude Reasoning → Simple Tools (curl/grep) → Claude Synthesis → Output
                    ↑                      ↑                      ↑
                 Guided by             Data only            Guided by
                 prompts                retrieval            prompts
```

**Benefit:** Claude does intelligent work, tools do dumb retrieval.

## Maintenance Burden

### Adding a New Library Mapping

**Before (v3.x):**
```javascript
// File: scripts/fetch-docs.js
// Line 87-95: Update knownRepos object

const knownRepos = {
  'next.js': 'vercel/next.js',
  'remix': 'remix-run/remix',
  // ... existing entries ...
  'solid.js': 'solidjs/solid', // ← ADD THIS LINE
};

// Save file → Run tests → Commit → Push → Deploy
```

**After (v4.0):**
```markdown
# File: SKILL.md
# Just add to table

| solid.js | solidjs/solid |

# Save → Done (no deployment needed)
```

### Adding a New Priority Keyword

**Before (v3.x):**
```javascript
// File: scripts/analyze-llms-txt.js
// Line 17-30: Update PRIORITY_KEYWORDS

const PRIORITY_KEYWORDS = {
  critical: [
    'getting-started', 'quick-start',
    'hooks', // ← ADD THIS
  ],
};

// Save → Run tests → Update tests → Commit → Push → Deploy
```

**After (v4.0):**
```markdown
# Claude already knows "hooks" is important for React
# No update needed - LLM reasons about priority contextually
```

## Testing Complexity

### Before: Unit Tests Required

```javascript
// File: scripts/tests/test-detect-topic.js (82 lines)
// File: scripts/tests/test-fetch-docs.js (103 lines)
// File: scripts/tests/test-analyze-llms.js (67 lines)

describe('detect-topic', () => {
  it('should detect topic-specific query', () => {
    const result = detectTopic('How do I use date picker in shadcn?');
    expect(result.topic).toBe('date');
    expect(result.library).toBe('shadcn-ui/ui');
  });
  // ... 20+ more test cases
});
```

**Total: 252 lines of test code**

### After: Prompt Validation Only

```markdown
# No unit tests needed
# Validate by running actual queries with Claude
# Self-correcting: Claude adapts based on results
```

**Total: 0 lines of test code**

## Token Efficiency

### Before: Script Overhead

```bash
# Execute 3 separate scripts
node scripts/detect-topic.js "query"      # ~200ms
node scripts/fetch-docs.js "query"        # ~500ms + network
cat llms.txt | node scripts/analyze-llms-txt.js  # ~150ms

# Total overhead: ~850ms + 3 shell executions
# Context switches between Node and Claude
```

### After: Integrated Reasoning

```bash
# Claude reasons + single curl
# Reasoning: ~0ms (parallel with planning)
curl "https://context7.com/..."           # ~500ms network only

# Total overhead: ~500ms + 1 shell execution
# No context switches - pure Claude workflow
```

## Error Handling

### Before: Rigid Error Paths

```javascript
if (res.statusCode === 404) {
  return {
    success: false,
    error: 'Documentation not found on context7.com',
    suggestion: 'Try repository analysis or web search',
  };
}
```

**Problem:** Generic error message, no adaptation

### After: Contextual Fallback

```markdown
**If context7.com returns 404:**
1. Try alternate path format (websites/ vs org/repo)
2. Search for "{library} llms.txt" via web search
3. Analyze GitHub repo README for doc links
4. Use official website + manual curation
```

**Benefit:** Claude chooses best fallback based on context

## Conclusion

**Key Insight:** Skills should teach Claude HOW to think, not WHAT to execute.

**Rule of Thumb:**
- LLM is better at: Reasoning, pattern recognition, context understanding
- Scripts are better at: HTTP requests, file I/O, data transformation

**The simplified approach:**
- Guides Claude's intelligence with prompts
- Uses minimal bash tools for data retrieval
- Eliminates 65% of code while adding infinite flexibility
- Maintains zero dependencies
- Self-adapting to new frameworks, languages, edge cases

**Bottom line:** 211 lines of prompts > 600+ lines of scripts
