# Agent Development Guide

## Table of Contents

1. [YAML Frontmatter Structure](#yaml-frontmatter-structure)
2. [Configuration Fields](#configuration-fields)
3. [Model Selection Guide](#model-selection-guide)
4. [Tool Selection Strategy](#tool-selection-strategy)
5. [System Prompt Design](#system-prompt-design)
6. [Built-in Subagents](#built-in-subagents)
7. [Advanced Features](#advanced-features)
8. [Agent Patterns](#agent-patterns)
9. [Optimization Checklist](#optimization-checklist)

## YAML Frontmatter Structure

```yaml
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked. Use PROACTIVELY for [triggers].\n\nExamples:\n<example>\nContext: [situation]\nuser: [request]\nassistant: [response]\n<commentary>[reasoning]</commentary>\n</example>
tools: tool1, tool2, tool3
model: sonnet
permissionMode: default
skills: skill1, skill2
---

Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach.
```

## Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier using lowercase letters and hyphens |
| `description` | Yes | Natural language description; single line with `\n` for newlines |
| `tools` | No | Comma-separated list; inherits all tools if omitted |
| `model` | No | Model alias (`sonnet`, `opus`, `haiku`) or `inherit` |
| `permissionMode` | No | Permission handling mode |
| `skills` | No | Comma-separated list of skill names to auto-load |

### name

- Lowercase with hyphens only
- Descriptive and unique
- Examples: `codebase-explorer`, `code-reviewer`, `debugger`

### description

- **MUST be a single line** - use `\n` for newlines (no quotes needed in YAML)
- Start with "Use this agent when..." followed by use cases
- Include "Use PROACTIVELY" for automatic delegation
- Include 2-3 inline `<example>` blocks
- Format: `<example>\nContext: ...\nuser: ...\nassistant: ...\n<commentary>...</commentary>\n</example>`
- Max ~300 words (examples add value)
- **Do NOT use YAML multiline syntax** (`>-`, `|`, `>`)

### tools

- Comma-separated list of allowed tools
- Omit to inherit all tools from main agent
- Common: `Grep, Glob, Read, Bash, Write, Edit`
- **Principle of least privilege**: Only grant necessary tools

### model

- `haiku`: Fast, cost-efficient (exploration, search)
- `sonnet`: Balanced (most use cases, default)
- `opus`: Complex reasoning (architecture, analysis)
- `inherit`: Match main conversation model

### permissionMode

| Mode | Behavior |
|------|----------|
| `default` | Standard permission handling |
| `acceptEdits` | Auto-accept file edits |
| `bypassPermissions` | Skip all permission checks |
| `plan` | Research-only, read-only mode |
| `ignore` | Ignore permission mode entirely |

### skills

- Comma-separated skill names to auto-load
- Skills activated when agent starts
- Example: `skills: pdf-processing, data-analysis`

## Model Selection Guide

### Choose Haiku when:
- Fast response required (< 3 seconds target)
- Simple, well-defined tasks
- Search and discovery operations
- Cost sensitivity critical

### Choose Sonnet when:
- Balanced performance needed
- Moderate complexity
- Most general-purpose tasks
- Default choice

### Choose Opus when:
- Complex reasoning required
- Architectural decisions
- Multi-step analysis
- Security audits

### Choose Inherit when:
- Agent should match main conversation capabilities
- Consistency with user's model choice

## Tool Selection Strategy

### Read-only Exploration
```
Grep, Glob, Read, Bash
```
Use for: Codebase analysis, file discovery, pattern matching

### Analysis without Search
```
Read, Bash
```
Use for: Code review, metrics collection, static analysis

### Code Modifications
```
Write, Edit, Bash
```
Use for: Feature implementation, refactoring, file creation

### Comprehensive
```
(omit tools field to inherit all)
```
Use for: Complex workflows, multi-phase operations

**Principle**: Start minimal, expand if needed.

## System Prompt Design

### Voice Guidelines

✅ **Use**: Imperative, infinitive, active voice
✅ **Examples**: "Find files...", "Analyze code...", "Execute searches..."

❌ **Avoid**: Second person, passive voice, filler words
❌ **Examples**: "You should find...", "Files can be found...", "Simply search..."

### XML Tag Usage

**Use XML tags for:**
- `<principles>` - Core design philosophy
- `<exploration_patterns>` - Grouped techniques
- `<format>` - Output structure
- `<error_handling>` - Recovery strategies
- `<constraints>` - Limitations and targets

**Keep in natural language:**
- Main mission statement
- High-level strategy
- Phase/step descriptions

### Prompt Optimization

**Progressive Disclosure:**
- Main agent file (<500 lines): Core strategy and common patterns
- Reference files: Comprehensive examples, language-specific patterns

**Compression Strategies:**
- Use code blocks instead of prose
- Consolidate repetitive examples
- Abbreviate patterns

## Built-in Subagents

### General-Purpose Subagent
- **Model**: Sonnet
- **Tools**: All tools
- **Purpose**: Complex research tasks, multi-step operations, code modifications
- **Use when**: Task requires both exploration and modification

### Plan Subagent
- **Model**: Sonnet
- **Tools**: Read, Glob, Grep, Bash
- **Purpose**: Research and gather information in plan mode
- **Automatic use**: When in plan mode and codebase research needed

### Explore Subagent
- **Model**: Haiku (fast, low-latency)
- **Mode**: Strictly read-only
- **Tools**: Glob, Grep, Read, Bash (read-only commands only)
- **Thoroughness levels**: `quick`, `medium`, `very thorough`
- **Use when**: Need to search/understand codebase without changes

## Advanced Features

### Resumable Subagents

Continue previous agent conversations with stored context:
- Each execution gets unique `agentId`
- Transcript stored in `agent-{agentId}.jsonl`
- Resume with previous `agentId` to continue with full context

```python
Task(
  subagent_type="code-reviewer",
  description="Continue review",
  prompt="Continue from previous context...",
  resume="agent-abc123"  # Previous agentId
)
```

### CLI-Defined Agents

Define agents at runtime via command line:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

### Chaining Subagents

```bash
> First use the code-analyzer subagent to find performance issues,
  then use the optimizer subagent to fix them
```

### Dynamic Selection

Claude intelligently selects agents based on:
- Task description matching
- Description field specificity
- Context relevance

## Agent Patterns

### File Discovery Agent

```yaml
---
name: file-finder
description: Locate files across codebase using name patterns, code structures, or feature relationships. Use PROACTIVELY when searching for files.
tools: Grep, Glob, Read, Bash
model: haiku
---
```

### Code Review Agent

```yaml
---
name: code-reviewer
description: Expert code review for quality, security, and maintainability. Use PROACTIVELY after writing or modifying code.\n\nExamples:\n<example>\nContext: User finished implementing auth endpoint\nuser: "I've implemented the auth endpoint"\nassistant: "I'll review the implementation for security and quality"\n<commentary>Proactive review after code changes</commentary>\n</example>
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

### Architecture Analyst

```yaml
---
name: architecture-analyst
description: Analyze system architecture, evaluate design patterns, and understand complex codebases. Use for architectural decisions.
tools: Grep, Glob, Read, Bash
model: opus
---
```

### Debugger Agent

```yaml
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use PROACTIVELY when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
model: sonnet
---
```

## Agent Locations

| Location | Scope | Priority |
|----------|-------|----------|
| `.claude/agents/` | Project | Highest |
| `~/.claude/agents/` | User (all projects) | Lower |
| Plugin `agents/` | Plugin-specific | Varies |
| `--agents` CLI flag | Session only | Medium |

## Invocation Methods

### Automatic Delegation
```
User: "Find all authentication files"
→ Claude invokes file-finder automatically based on description match
```

### Explicit Invocation
```
User: "Use the code-reviewer agent to check my changes"
→ Claude invokes code-reviewer explicitly
```

### Programmatic
```python
Task(
  subagent_type="codebase-explorer",
  description="Find payment processing files",
  prompt="Search for payment, transaction, checkout patterns",
  model="haiku"
)
```

## Optimization Checklist

- [ ] Reduce to <500 lines (move details to references)
- [ ] Remove second-person voice
- [ ] Add XML tags for structure
- [ ] Consolidate repetitive examples
- [ ] Use code blocks over prose
- [ ] Include "PROACTIVELY" in description
- [ ] Provide executable examples
- [ ] Add clear response format
- [ ] Include error recovery
- [ ] Specify performance targets
- [ ] Test with real scenarios
- [ ] Limit tools to necessary set

## Success Criteria

**Well-designed agent has:**
1. Clear, focused mission (single responsibility)
2. Appropriate model selection (cost/performance balance)
3. Minimal tool set (least privilege)
4. Concise prompt (<500 lines or references)
5. Executable examples (tested and working)
6. Clear response format
7. Error recovery strategies
8. Performance targets specified
9. "PROACTIVELY" trigger in description

## Performance Targets

| Model | Response Time | Token Usage |
|-------|---------------|-------------|
| Haiku | < 3 seconds | < 1000 tokens |
| Sonnet | < 10 seconds | < 5000 tokens |
| Opus | < 30 seconds | < 10000 tokens |
