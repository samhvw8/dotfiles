---
name: skill-developer
description: Skill system infrastructure manager. Create/modify skills, configure skill-rules.json, design trigger patterns, debug activation, implement hooks (UserPromptSubmit/PreToolUse). Scope: meta-level operations only - NOT domain content (UI/backend/workflows). Covers: YAML frontmatter, keyword/intent patterns, enforcement levels, progressive disclosure, 500-line rule, Anthropic best practices.
---

# Skill Developer Guide

## Purpose

Comprehensive guide for creating and managing skills in Claude Code with auto-activation system, following Anthropic's official best practices including the 500-line rule and progressive disclosure pattern.

## When to Use This Skill

Automatically activates when you mention:
- Creating or adding skills
- Improving, enhancing, or optimizing skills
- Refactoring or upgrading skills
- Modifying skill triggers or rules
- Understanding how skill activation works
- Debugging skill activation issues
- Working with skill-rules.json
- Hook system mechanics
- Claude Code best practices
- Progressive disclosure
- YAML frontmatter
- 500-line rule
- Keyword weights or scoring
- Confidence levels
- Shorthands, synonyms, abbreviations
- Adding trigger patterns

## Context Awareness: What This Skill Covers

### ✅ This Skill is FOR (Meta-Level)

**Skill System Management:**
- Creating/modifying `.claude/skills/` directory contents
- Editing `skill-rules.json` configuration
- Writing/updating `SKILL.md` files
- Designing trigger patterns (keywords, intent patterns)
- Understanding hook mechanisms (UserPromptSubmit, PreToolUse)
- Skill activation and debugging
- Progressive disclosure patterns
- Anthropic best practices (500-line rule, etc.)

**Keywords That Trigger This Skill:**
- "skill triggers", "skill activation", "skill keywords"
- "intent patterns", "promptTriggers", "enforcement levels"
- "skill-rules.json", "SKILL.md", "skill frontmatter"
- "UserPromptSubmit", "PreToolUse", "hook system"
- "progressive disclosure", "500-line rule"
- "skill metadata", "trigger conditions"
- "keyword weight", "pattern weight", "scoring", "match score"
- "confidence level", "diminishing returns", "priority multiplier"
- "shorthand", "synonym", "abbreviation", "alias"

### ❌ This Skill is NOT FOR (Domain-Specific Content)

**UI/Frontend Development:**
- Use `ui-design-system` skill for: TailwindCSS, Radix UI, shadcn/ui, design tokens, OKLCH colors, component libraries

**Backend Development:**
- Use other skills for: API design, database patterns, server architecture

**Documentation Discovery:**
- Use `docs-seeker` skill for: Finding llms.txt, searching documentation, library references

**Git Workflows:**
- Use `git-workflow` skill for: Commits, branches, atomic commits, PR creation

**Other Domain Skills:**
- Each domain skill covers its specific topic (Docker, PostgreSQL, Cloudflare, etc.)

### 🎯 Clear Distinction Examples

| User Query | Correct Skill | Why |
|------------|---------------|-----|
| "How do skill triggers work?" | ✅ skill-developer | Meta-level: about skill system |
| "Add keywords to ui-design-system" | ✅ skill-developer | Modifying skill configuration |
| "What are design tokens?" | ❌ ui-design-system | Domain content, not skill system |
| "How to use OKLCH colors?" | ❌ ui-design-system | UI/frontend topic |
| "Create a new skill for Docker" | ✅ skill-developer | Creating skill infrastructure |
| "How to containerize app?" | ❌ docker skill | Domain content |
| "Update skill-rules.json keywords" | ✅ skill-developer | Skill system configuration |
| "What are naming conventions for design tokens?" | ❌ ui-design-system | UI design content |

### 🔍 Context-Aware Trigger Strategy

**Trigger When:**
- User explicitly mentions "skill" + system terms (triggers, keywords, rules, activation)
- User is working on `.claude/skills/` directory
- User asks about hook mechanisms or skill architecture
- User wants to create/modify/debug skills

**Don't Trigger When:**
- User asks domain-specific questions (even if they're about design systems, tokens, etc.)
- Generic terms like "naming conventions" without "skill" context
- Backend/frontend development questions
- General coding questions

**Key Principle:** This skill is **meta-level** (about skills themselves), not **domain-level** (about UI, backend, etc.)

---

## System Overview

### Two-Hook Architecture

**1. UserPromptSubmit Hook** (Proactive Suggestions)
- **File**: `.claude/hooks/skill-activation-prompt.ts`
- **Trigger**: BEFORE Claude sees user's prompt
- **Purpose**: Suggest relevant skills based on keywords + intent patterns
- **Method**: Injects formatted reminder as context (stdout → Claude's input)
- **Use Cases**: Topic-based skills, implicit work detection

### Configuration File

**Location**: `.claude/skills/skill-rules.json`

Defines:
- All skills and their trigger conditions
- Enforcement levels (block, suggest, warn)
- File path patterns (glob)
- Content detection patterns (regex)
- Skip conditions (session tracking, file markers, env vars)

---

## Skill Types

### 1. Guardrail Skills

**Purpose:** Enforce critical best practices that prevent errors

**Characteristics:**
- Type: `"guardrail"`
- Enforcement: `"block"`
- Priority: `"critical"` or `"high"`
- Block file edits until skill used
- Prevent common mistakes (column names, critical errors)
- Session-aware (don't repeat nag in same session)

**Examples:**
- `database-verification` - Verify table/column names before Prisma queries
- `frontend-dev-guidelines` - Enforce React/TypeScript patterns

**When to Use:**
- Mistakes that cause runtime errors
- Data integrity concerns
- Critical compatibility issues

### 2. Domain Skills

**Purpose:** Provide comprehensive guidance for specific areas

**Characteristics:**
- Type: `"domain"`
- Enforcement: `"suggest"`
- Priority: `"high"` or `"medium"`
- Advisory, not mandatory
- Topic or domain-specific
- Comprehensive documentation

**Examples:**
- `backend-dev-guidelines` - Node.js/Express/TypeScript patterns
- `frontend-dev-guidelines` - React/TypeScript best practices
- `error-tracking` - Sentry integration guidance

**When to Use:**
- Complex systems requiring deep knowledge
- Best practices documentation
- Architectural patterns
- How-to guides

---

## Quick Start: Creating a New Skill

### Step 1: Create Skill File

**Location:** `.claude/skills/{skill-name}/SKILL.md`

**Template:**
```markdown
---
name: my-new-skill
description: Brief description including keywords for discoverability. Mention topics, file types, and use cases.
---

# My New Skill

## Purpose
What this skill helps with

## When to Use
Specific scenarios and conditions

## Key Information
The actual guidance, documentation, patterns, examples
```

**YAML Frontmatter fields:**
- `name` (required): Skill identifier
- `description` (required): Brief description for discoverability (max 1024 chars)
- `license` (optional): License reference

**⚠️ IMPORTANT:** Triggers are NOT defined in YAML frontmatter. Configure triggers in `skill-rules.json`.

**Best Practices:**
- ✅ **Name**: Lowercase, hyphens, gerund form (verb + -ing) preferred
- ✅ **Description**: Include keywords for discoverability (max 1024 chars)
- ✅ **Content**: Under 500 lines - use reference files for details
- ✅ **Examples**: Real code examples
- ✅ **Structure**: Clear headings, lists, code blocks

### Step 2: Add to skill-rules.json (REQUIRED for activation)

**RECOMMENDED: Use the jq-based CRUD script for faster operations:**

```bash
# Create new skill entry
./scripts/skill-rules-crud.sh create-minimal my-skill "Description here" high

# Add keywords
./scripts/skill-rules-crud.sh add-keyword my-skill "keyword1"
./scripts/skill-rules-crud.sh add-keyword my-skill "specific-term" 5.0  # with weight

# Add intent patterns
./scripts/skill-rules-crud.sh add-pattern my-skill "(create|add).*?something"
./scripts/skill-rules-crud.sh add-pattern my-skill "pattern-here" 4.0  # with weight
```

See [SKILL_RULES_REFERENCE.md](SKILL_RULES_REFERENCE.md) for complete schema.

**Manual JSON Template (alternative):**
```json
{
  "my-new-skill": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "medium",
    "promptTriggers": {
      "keywords": ["keyword1", "keyword2"],
      "intentPatterns": ["(create|add).*?something"]
    }
  }
}
```

### Step 3: Test Triggers

**Test UserPromptSubmit:**
```bash
echo '{"session_id":"test","prompt":"your test prompt"}' | \
  npx tsx .claude/hooks/skill-activation-prompt.ts
```

**Test PreToolUse:**
```bash
cat <<'EOF' | npx tsx .claude/hooks/skill-verification-guard.ts
{"session_id":"test","tool_name":"Edit","tool_input":{"file_path":"test.ts"}}
EOF
```

### Step 4: Refine Patterns

Based on testing:
- Add missing keywords
- Refine intent patterns to reduce false positives
- Adjust file path patterns
- Test content patterns against actual files

### Step 5: Follow Anthropic Best Practices

✅ Keep SKILL.md under 500 lines
✅ Use progressive disclosure with reference files
✅ Add table of contents to reference files > 100 lines
✅ Write detailed description with trigger keywords
✅ Test with 3+ real scenarios before documenting
✅ Iterate based on actual usage

---

## Scoring System (v2.0)

Keywords/patterns have weights; score determines enforcement level:

| Confidence | Score | Enforcement |
|------------|-------|-------------|
| 🔴 critical | ≥12 | REQUIRED |
| 🟠 high | ≥8 | RECOMMENDED |
| 🟡 medium | ≥4 | SUGGESTED |
| 🟢 low | ≥2 | OPTIONAL |

**Key concepts:**
- **Weighted keywords**: `{"value": "k8s", "weight": 5.0}` or auto-calculated
- **Diminishing returns**: Multiple matches contribute less each
- **Priority multiplier**: critical=4x, high=3x, medium=2x, low=1x

See [SCORING.md](SCORING.md) for complete formula, examples, and configuration.

---

## Enforcement Levels

### BLOCK (Critical Guardrails)

- Physically prevents Edit/Write tool execution
- Exit code 2 from hook, stderr → Claude
- Claude sees message and must use skill to proceed
- **Use For**: Critical mistakes, data integrity, security issues

**Example:** Database column name verification

### SUGGEST (Recommended)

- Reminder injected before Claude sees prompt
- Claude is aware of relevant skills
- Not enforced, just advisory
- **Use For**: Domain guidance, best practices, how-to guides

**Example:** Frontend development guidelines

### WARN (Optional)

- Low priority suggestions
- Advisory only, minimal enforcement
- **Use For**: Nice-to-have suggestions, informational reminders

**Rarely used** - most skills are either BLOCK or SUGGEST.

---

## Skip Conditions & User Control

### 1. Session Tracking

**Purpose:** Don't nag repeatedly in same session

**How it works:**
- First edit → Hook blocks, updates session state
- Second edit (same session) → Hook allows
- Different session → Blocks again

**State File:** `.claude/hooks/state/skills-used-{session_id}.json`

### 2. File Markers

**Purpose:** Permanent skip for verified files

**Marker:** `// @skip-validation`

**Usage:**
```typescript
// @skip-validation
import { PrismaService } from './prisma';
// This file has been manually verified
```

**NOTE:** Use sparingly - defeats the purpose if overused

### 3. Environment Variables

**Purpose:** Emergency disable, temporary override

**Global disable:**
```bash
export SKIP_SKILL_GUARDRAILS=true  # Disables ALL PreToolUse blocks
```

**Skill-specific:**
```bash
export SKIP_DB_VERIFICATION=true
export SKIP_ERROR_REMINDER=true
```

---

## Enhancing Existing Skills

**When to Enhance:** >500 lines, poor structure, second-person voice, vague examples

**Key Principles:**
1. Move details to reference files (progressive disclosure)
2. Use imperative voice ("Process files..." not "You should...")
3. Organize resources: `scripts/`, `references/`, `assets/`
4. Target <500 lines in SKILL.md

**Quick Checklist:**
- [ ] Kebab-case naming, description 30-60 words
- [ ] Imperative voice, no "you should/can/will"
- [ ] <500 lines, reference files for details
- [ ] No duplication, unused files deleted

---

## Testing Checklist

- [ ] SKILL.md created with frontmatter, <500 lines
- [ ] Entry added to `skill-rules.json` (validate: `jq . skill-rules.json`)
- [ ] Keywords/patterns tested with real prompts
- [ ] No false positives/negatives, performance <200ms

---

## skill-rules-crud.sh Quick Reference

**Location:** `scripts/skill-rules-crud.sh`

Fast jq-based CRUD operations for skill-rules.json. Use instead of manual JSON editing.

| Command | Usage | Description |
|---------|-------|-------------|
| `list` | `./scripts/skill-rules-crud.sh list` | List all skill names |
| `get` | `./scripts/skill-rules-crud.sh get docker` | Get full skill config |
| `get-keywords` | `./scripts/skill-rules-crud.sh get-keywords docker` | List keywords |
| `create-minimal` | `./scripts/skill-rules-crud.sh create-minimal name "desc" high` | Create new skill |
| `add-keyword` | `./scripts/skill-rules-crud.sh add-keyword skill "kw" [weight]` | Add keyword |
| `add-pattern` | `./scripts/skill-rules-crud.sh add-pattern skill "regex" [weight]` | Add pattern |
| `remove-keyword` | `./scripts/skill-rules-crud.sh remove-keyword skill "kw"` | Remove keyword |
| `remove-pattern` | `./scripts/skill-rules-crud.sh remove-pattern skill "regex"` | Remove pattern |
| `update-priority` | `./scripts/skill-rules-crud.sh update-priority skill critical` | Set priority |
| `update-enforcement` | `./scripts/skill-rules-crud.sh update-enforcement skill block` | Set enforcement |
| `delete` | `./scripts/skill-rules-crud.sh delete skill-name` | Delete skill |
| `search` | `./scripts/skill-rules-crud.sh search "term"` | Search all skills |
| `validate` | `./scripts/skill-rules-crud.sh validate` | Validate JSON |
| `stats` | `./scripts/skill-rules-crud.sh stats` | Show statistics |
| `backup` | `./scripts/skill-rules-crud.sh backup` | Create backup |

---

## Reference Files

| File | Content |
|------|---------|
| [scripts/skill-rules-crud.sh](scripts/skill-rules-crud.sh) | jq-based CRUD for skill-rules.json |
| [SCORING.md](SCORING.md) | Weight formulas, confidence levels, examples |
| [TRIGGER_TYPES.md](TRIGGER_TYPES.md) | Keywords, intents, file paths, content patterns |

---

## Quick Reference Summary

### Create New Skill (5 Steps)

1. Create `.claude/skills/{name}/SKILL.md` with frontmatter
2. Add entry to `.claude/skills/skill-rules.json`
3. Test with `npx tsx` commands
4. Refine patterns based on testing
5. Keep SKILL.md under 500 lines

### Trigger Types

- **Keywords**: Explicit topic mentions (string or `{value, weight}`)
- **Intent**: Implicit action detection (1.2x weight bonus)
- **File Paths**: Location-based activation
- **Content**: Technology-specific detection

See [TRIGGER_TYPES.md](TRIGGER_TYPES.md) for complete details.

### Scoring (v2.0)

See [SCORING.md](SCORING.md) for weighted keywords, confidence levels, and formulas.

### Enforcement

- **BLOCK**: Exit code 2, critical only
- **SUGGEST**: Inject context, most common
- **WARN**: Advisory, rarely used

### Skip Conditions

- **Session tracking**: Automatic (prevents repeated nags)
- **File markers**: `// @skip-validation` (permanent skip)
- **Env vars**: `SKIP_SKILL_GUARDRAILS` (emergency disable)

### Anthropic Best Practices

✅ **500-line rule**: Keep SKILL.md under 500 lines
✅ **Progressive disclosure**: Use reference files for details
✅ **Table of contents**: Add to reference files > 100 lines
✅ **One level deep**: Don't nest references deeply
✅ **Rich descriptions**: Include all trigger keywords (max 1024 chars)
✅ **Test first**: Build 3+ evaluations before extensive documentation
✅ **Gerund naming**: Prefer verb + -ing (e.g., "processing-pdfs")

### Troubleshoot

Test hooks manually:
```bash
# UserPromptSubmit
echo '{"prompt":"test"}' | npx tsx .claude/hooks/skill-activation-prompt.ts

# PreToolUse
cat <<'EOF' | npx tsx .claude/hooks/skill-verification-guard.ts
{"tool_name":"Edit","tool_input":{"file_path":"test.ts"}}
EOF
```

---

## Related Files

**Configuration:**
- `.claude/skills/skill-rules.json` - Master configuration
- `.claude/hooks/state/` - Session tracking
- `.claude/settings.json` - Hook registration

**Hooks:**
- `.claude/hooks/skill-activation-prompt.ts` - UserPromptSubmit
- `.claude/hooks/error-handling-reminder.ts` - Stop event (gentle reminders)

**All Skills:**
- `.claude/skills/*/SKILL.md` - Skill content files

---

**Skill Status**: COMPLETE ✅ | **Line Count**: <500 ✅ | **Progressive Disclosure**: Reference files ✅
