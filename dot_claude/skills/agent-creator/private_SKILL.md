---
name: agent-creator
description: Create and optimize Claude Code sub-agents following Anthropic best practices. Design agent YAML metadata, system prompts, tool selection, and model configuration. Apply prompt engineering principles for concise, efficient agents. Triggers on "create agent", "optimize agent", "design sub-agent", "agent metadata", "agent prompt engineering".
---

# Agent Creator

Design production-ready Claude Code sub-agents following Anthropic's official best practices.

## Core Principles

<principles>
- **Simplicity**: Use direct tool calls, avoid complex abstractions
- **Transparency**: Show reasoning and planning steps explicitly
- **Conciseness**: Target <500 lines, use progressive disclosure
- **Efficiency**: Optimize for token usage and response time
- **Focus**: Single, clear responsibility per agent
</principles>

## Agent Structure

### Required YAML Frontmatter

```yaml
---
name: agent-name-lowercase-hyphens
description: Use this agent when you need to [primary use case]. This includes [secondary use cases].\n\nExamples:\n<example>\nContext: [situation].\nuser: [request]\nassistant: [response]\n<commentary>[reasoning]</commentary>\n</example>\n\n<example>\nContext: [another situation].\nuser: [request]\nassistant: [response]\n<commentary>[reasoning]</commentary>\n</example>
tools: Grep, Glob, Read, Bash  # Comma-separated, limit to necessary only
model: haiku  # or sonnet, opus, inherit
---
```

<metadata_fields>

**name** (required)
- Lowercase with hyphens
- Descriptive and unique
- Examples: `codebase-explorer`, `code-reviewer`, `debugger`

**description** (required)
- **MUST be a single line** - use `\n` for newlines (no quotes needed)
- Start with "Use this agent when..." followed by use cases
- Include 2-3 inline `<example>` blocks with Context, user, assistant, commentary
- Format: `<example>\nContext: ...\nuser: ...\nassistant: ...\n<commentary>...</commentary>\n</example>`
- Each example shows: situation → user request → assistant response → reasoning
- Max ~300 words for efficiency (examples add value)
- **Do NOT use YAML multiline syntax** (`>-`, `|`, `>`) - these cause parsing issues

**tools** (optional)
- Comma-separated list of allowed tools
- Omit to inherit all tools from main thread
- Limit to necessary tools only (principle of least privilege)
- Common: `Grep, Glob, Read, Bash, Write, Edit`

**model** (optional)
- `haiku`: Fast, cost-efficient (exploration, search)
- `sonnet`: Balanced (most use cases)
- `opus`: Complex reasoning (architecture, analysis)
- `inherit`: Match main conversation model
- Omit to use default subagent model

</metadata_fields>

## System Prompt Design

### Structure Pattern

```markdown
# Agent Name

Brief mission statement (1-2 sentences).

## Core Strategy

### 1. Phase/Step Name
High-level approach

**Specific Technique:**
```bash
# Concrete example command
```

### 2. Next Phase
Continuation...

<section_name>
Grouped related patterns/examples using XML tags
</section_name>

## Response Format

<format>
Expected output structure
</format>

## Error Handling

<error_handling>
Recovery strategies
</error_handling>

## Constraints

<constraints>
Performance targets, limitations
</constraints>
```

### Voice Guidelines

✅ **Use**: Imperative, infinitive, active voice
✅ **Examples**: "Find files...", "Analyze code...", "Execute searches..."

❌ **Avoid**: Second person, passive voice, filler words
❌ **Examples**: "You should find...", "Files can be found...", "Simply search..."

### XML Tag Usage

**Use XML tags for:**
- `<principles>` - Core design philosophy
- `<exploration_patterns>` - Grouped techniques
- `<language_patterns>` - Language-specific examples
- `<format>` - Output structure
- `<error_handling>` - Recovery strategies
- `<constraints>` - Limitations and targets
- `<scoring>` - Ranking algorithms

**Keep in natural language:**
- Main mission statement
- High-level strategy
- Phase/step descriptions

## Model Selection Guide

<model_selection>

**Choose Haiku when:**
- Fast response required (< 3 seconds target)
- Simple, well-defined tasks
- Search and discovery operations
- Cost sensitivity critical
- Examples: file finding, code search, pattern matching

**Choose Sonnet when:**
- Balanced performance needed
- Moderate complexity
- Most general-purpose tasks
- Good default choice
- Examples: code review, refactoring, feature implementation

**Choose Opus when:**
- Complex reasoning required
- Architectural decisions
- Multi-step analysis
- Quality over speed
- Examples: system design, security analysis, debugging complex issues

**Choose Inherit when:**
- Agent should match main conversation capabilities
- Consistency with user's model choice
- No specific model requirements

</model_selection>

## Tool Selection Strategy

<tool_strategy>

**Grep, Glob, Read, Bash** (Read-only exploration)
- Codebase analysis
- File discovery
- Pattern matching
- No modifications needed

**Read, Bash** (Analysis without search)
- Code review
- Metrics collection
- Static analysis

**Write, Edit, Bash** (Code modifications)
- Feature implementation
- Refactoring
- File creation/updates

**All tools** (Comprehensive)
- Complex workflows
- Multi-phase operations
- When uncertain about needs

**Principle**: Start minimal, expand if needed. Overly restrictive tools cause failures.

</tool_strategy>

## Prompt Optimization Techniques

### 1. Progressive Disclosure

**Main agent file (<500 lines):**
- Core strategy and common patterns
- Reference detailed documentation

**Reference files (when needed):**
- Comprehensive examples
- Language-specific patterns
- Advanced techniques

### 2. Compression Strategies

**Abbreviate repetitive patterns:**
```bash
# Before: results1.txt, results2.txt, results3.txt
# After: r1.txt, r2.txt, r3.txt
```

**Use code blocks instead of prose:**
```bash
# Good: Direct executable example
rg "pattern" --type ts -C 3

# Avoid: "You can search for patterns using ripgrep with the -C flag..."
```

**Consolidate examples:**
- Show pattern once with variations
- Use comments for alternatives
- Group related techniques

### 3. XML Structure Benefits

```markdown
<exploration_patterns>

**Pattern 1:** Project Overview
```bash
cat package.json | head -20
rg "main\(" -l
```

**Pattern 2:** Dependency Analysis
```bash
rg "^import" --type ts -o | sort -u
```

</exploration_patterns>
```

**Benefits:**
- Logical grouping reduces redundancy
- Clear section boundaries
- Easy to reference specific patterns

### 4. Response Format Templates

Provide clear, copy-paste examples:

```markdown
<format>

**Success Response:**
```
Found 5 files:

HIGH: src/auth/service.ts:42 - Exact match
MEDIUM: src/api/auth.ts - Name match
```

**Error Response:**
```
No results found. Try:
- Broader search terms
- Check file types
- Expand directory scope
```

</format>
```

## Testing Checklist

<testing>

**Before finalizing agent:**
- [ ] YAML frontmatter valid (name, description, tools, model)
- [ ] Description includes trigger phrases
- [ ] System prompt < 500 lines (or references for details)
- [ ] Model choice appropriate for task complexity
- [ ] Tools limited to necessary set
- [ ] Examples are executable and tested
- [ ] Error handling strategies included
- [ ] Performance targets specified
- [ ] Response format clearly defined
- [ ] No second-person voice ("you should...")
- [ ] XML tags used for structure, not main content

**Test the agent:**
```bash
# Invoke with Task tool
Task(
  subagent_type="agent-name",
  description="Test task",
  prompt="Detailed test prompt",
  model="haiku"  # optional override
)
```

</testing>

## Common Patterns

### File Discovery Agent

```yaml
---
name: file-finder
description: Use this agent when you need to quickly locate files across a codebase. This includes finding files by name patterns, searching for specific code structures, or discovering related files for a feature.\n\nExamples:\n<example>\nContext: User needs to find all authentication-related files.\nuser: Find all files related to authentication\nassistant: I'll use the file-finder agent to locate authentication files across the codebase.\n<commentary>The user needs file discovery, so use file-finder to search with multiple strategies in parallel.</commentary>\n</example>\n\n<example>\nContext: User wants to locate configuration files.\nuser: Where are the database config files?\nassistant: Let me use the file-finder agent to search for database configuration files.\n<commentary>Configuration file lookup requires pattern matching, so use file-finder.</commentary>\n</example>
tools: Grep, Glob, Read, Bash
model: haiku
---

# File Finder

Find files through keyword extraction and progressive search.

## Strategy

1. Extract 2-5 keywords
2. Parallel ripgrep searches
3. Fuzzy match with fzf
4. Rank by relevance

<format>
HIGH: path/file.ts:42 - Exact match
MEDIUM: path/file2.ts - Name match
</format>
```

### Code Review Agent

```yaml
---
name: code-reviewer
description: Use this agent when you need comprehensive code review and quality assessment. This includes reviewing new implementations, checking for security vulnerabilities, evaluating code quality, or assessing technical debt.\n\nExamples:\n<example>\nContext: User has implemented a new feature.\nuser: I've finished the payment integration\nassistant: I'll use the code-reviewer agent to review the payment integration for quality and security.\n<commentary>New code needs review, so use code-reviewer for comprehensive assessment.</commentary>\n</example>\n\n<example>\nContext: User wants security audit.\nuser: Check my API endpoints for security issues\nassistant: Let me use the code-reviewer agent to audit the API security.\n<commentary>Security review requires code-reviewer's vulnerability detection capabilities.</commentary>\n</example>
tools: Grep, Read, Bash
model: sonnet
---

# Code Reviewer

Analyze code for quality, security, and maintainability issues.

## Review Areas

1. **Security**: SQL injection, XSS, hardcoded secrets
2. **Quality**: Code smells, complexity, duplication
3. **Best Practices**: Framework patterns, naming conventions

<format>
**Critical Issues:**
- file.ts:42: SQL injection risk

**Suggestions:**
- file.ts:89: Consider extracting function
</format>
```

### Architecture Analyst

```yaml
---
name: architecture-analyst
description: Use this agent when you need to analyze system architecture, evaluate design patterns, or understand complex codebases at a high level. This includes architectural reviews, dependency analysis, and design decision evaluation.\n\nExamples:\n<example>\nContext: User wants to understand codebase structure.\nuser: How is the authentication system architected?\nassistant: I'll use the architecture-analyst agent to analyze the authentication system design.\n<commentary>Architectural understanding requires high-level analysis, so use architecture-analyst.</commentary>\n</example>\n\n<example>\nContext: User considering major refactoring.\nuser: Should we migrate to microservices?\nassistant: Let me use the architecture-analyst to evaluate the current architecture and migration implications.\n<commentary>Architectural decisions require opus-level reasoning, so use architecture-analyst.</commentary>\n</example>
tools: Grep, Glob, Read, Bash
model: opus
---

# Architecture Analyst

Analyze high-level architecture, patterns, and design decisions.

## Analysis Dimensions

1. **Structure**: Module organization, dependencies
2. **Patterns**: Design patterns, architectural styles
3. **Quality**: Coupling, cohesion, complexity

<format>
**Architecture Overview:**
- Pattern: Layered architecture
- Dependencies: [dependency graph]
- Concerns: [identified issues]
</format>
```

## Agent Locations

<locations>

**Project-level**: `.claude/agents/`
- Scope: Current project only
- Priority: Highest (overrides user-level)
- Use for: Project-specific workflows

**User-level**: `~/.claude/agents/`
- Scope: All projects
- Priority: Lower
- Use for: General-purpose agents

**Plugin-provided**: Plugin `agents/` directory
- Scope: All projects using plugin
- Priority: Lowest

</locations>

## Invocation Methods

<invocation>

**Automatic Delegation:**
Claude matches task to agent description:
```
User: "Find all authentication files"
→ Claude invokes file-finder automatically
```

**Explicit Invocation:**
User mentions agent by name:
```
User: "Use the code-reviewer agent to check my changes"
→ Claude invokes code-reviewer explicitly
```

**Programmatic:**
Using Task tool:
```
Task(
  subagent_type="codebase-explorer",
  description="Find payment processing files",
  prompt="Search for payment, transaction, checkout patterns",
  model="haiku"
)
```

</invocation>

## Optimization Checklist

When optimizing existing agents:

- [ ] Reduce to <500 lines (move details to references)
- [ ] Remove second-person voice
- [ ] Add XML tags for structure
- [ ] Consolidate repetitive examples
- [ ] Use code blocks over prose
- [ ] Provide executable examples
- [ ] Add clear response format
- [ ] Include error recovery
- [ ] Specify performance targets
- [ ] Test with real scenarios

## Resources

**Official Documentation:**
- https://code.claude.com/docs/en/sub-agents
- https://www.anthropic.com/research/building-effective-agents
- https://www.anthropic.com/engineering/claude-code-best-practices

**Reference Files:**
- [AGENT_EXAMPLES.md](references/AGENT_EXAMPLES.md) - Complete agent templates
- [OPTIMIZATION_GUIDE.md](references/OPTIMIZATION_GUIDE.md) - Detailed optimization strategies
- [TESTING_GUIDE.md](references/TESTING_GUIDE.md) - Testing and validation procedures

## Success Criteria

**Well-designed agent has:**
1. Clear, focused mission (single responsibility)
2. Appropriate model selection (cost/performance balance)
3. Minimal tool set (least privilege)
4. Concise prompt (<500 lines or references)
5. Executable examples (tested and working)
6. Clear response format (user knows what to expect)
7. Error recovery (handles edge cases gracefully)
8. Performance targets (speed, token usage specified)
