# Integration Strategies

Guide for integrating CLAUDE.md with other tools and global configurations.

## Integration with Global CLAUDE.md

### User has ~/.claude/CLAUDE.md (global)

Contains:
- Universal principles (SOLID, DRY, YAGNI)
- MCP tool documentation
- Preferred communication style

### Project CLAUDE.md should

- Focus exclusively on project-specific guidance
- Reference global patterns: "Follow SOLID principles (see global CLAUDE.md)"
- Avoid duplicating MCP tool usage (already documented globally)
- Add project-specific MCP tool applications only

### Example Structure

```markdown
# MyProject - Development Guide

> Note: General software engineering principles are in your global CLAUDE.md.
> This guide focuses on project-specific patterns and requirements.

## Project Context
[Specific to this project only]

## Code Standards
[Only patterns unique to this codebase, not universal practices]
```

## Custom Slash Commands Integration

### When to suggest

- Project has >3 frequently repeated workflows
- Common task requires >5 manual steps
- Team follows specific process (e.g., PR checklist)

### Example suggestion

```
"Your project would benefit from custom slash commands:

Create .claude/commands/test-feature.md:
```
Run all tests for a feature area:
1. Run unit tests matching the feature name
2. Run related integration tests
3. Check test coverage report
4. If coverage <80%, identify untested code paths
```

Usage: `/test-feature authentication`

Would you like me to create these commands?"
```

## MCP Tool Configuration

### Detect opportunities

Check for:
- React/Vue/Angular imports → Suggest context7 for official docs
- UI component requests → Suggest magic MCP for 21st.dev patterns
- E2E test files → Suggest Playwright MCP for browser automation
- API documentation needs → Suggest context7 for OpenAPI/Swagger

### Add to CLAUDE.md

```markdown
## MCP Tools Configuration

### context7 (Official Documentation)
Use for:
- React hooks best practices: `/resolve react → /get-docs`
- Next.js routing patterns: `/resolve next.js → /get-docs`
- Prisma schema syntax: `/resolve prisma → /get-docs`

### magic (UI Component Generation)
Use for:
- New component requests: "create a searchable data table"
- Component refinement: "make this form more accessible"
- Design system patterns: "responsive card grid layout"

### Playwright (E2E Testing)
Use for:
- User flow validation: "test checkout process"
- Visual regression: "screenshot comparison on mobile"
- Accessibility audit: "check WCAG compliance"
```

## Maintenance Strategy

### Suggest to user after creation

```
Your CLAUDE.md is ready. Maintenance recommendations:

1. **Immediate (next 1-2 days)**
   - Use Claude Code on 3-5 real tasks
   - Note any missing context or unclear guidance
   - Verify commands work as documented

2. **Short-term (first 2 weeks)**
   - Add on-demand context for files frequently needed
   - Remove sections that never get referenced
   - Update if project patterns evolve

3. **Long-term (monthly)**
   - Review after major dependency updates
   - Prune outdated information
   - Add new conventions if patterns solidify

4. **Signs to update**
   - Framework upgrade (React 17→18, Next 12→14)
   - Architecture change (REST→GraphQL, monolith→microservices)
   - New team conventions adopted
   - Claude consistently missing context you expect it to have
```

## Success Metrics

### Effective CLAUDE.md indicators

- Claude Code requires fewer clarifying questions
- Code changes match project conventions on first try
- Test coverage maintained/improved consistently
- Commands work without "command not found" errors
- User rarely needs to provide missing context manually

### Ineffective CLAUDE.md indicators

- Claude frequently asks "what testing framework?"
- Generated code doesn't match existing style
- User repeatedly provides same context files
- CLAUDE.md contains info never referenced in practice

## Quality Standards

### Mandatory Elements

Every CLAUDE.md must include:
- ✓ Project context (tech stack, purpose)
- ✓ Common commands (dev, build, test)
- ✓ Code style conventions (if project has specific patterns)
- ✓ File organization overview
- ✓ Where to find key files (authentication, config, etc.)

### Prohibited Content

Never include:
- ✗ Generic software engineering principles (user has global PRINCIPLES.md)
- ✗ Framework tutorials (use context7 MCP instead)
- ✗ Extensive copy-paste from README
- ✗ Obvious best practices without project-specific application
- ✗ Auto-loading of large directories (>100 files)

## Implementation Checklist

Before presenting CLAUDE.md to user:

### Discovery Phase
- [ ] Explored project structure (directories, key files)
- [ ] Identified language, framework, testing setup
- [ ] Read package.json/Makefile/docker-compose for commands
- [ ] Checked for existing documentation to avoid duplication
- [ ] Detected code style patterns (naming, organization)

### Generation Phase
- [ ] Selected appropriate template (web/API/CLI/library)
- [ ] Customized based on actual codebase patterns
- [ ] Verified commands are accurate
- [ ] Used concise language (removed fluff)
- [ ] Structured with clear sections

### Optimization Phase (if improving existing)
- [ ] Identified token waste (generic advice, redundancy)
- [ ] Converted auto-loading to on-demand context
- [ ] Removed outdated or inaccurate information
- [ ] Condensed verbose sections
- [ ] Preserved all critical project-specific guidance

### Validation Phase
- [ ] Token count is reasonable for project complexity
- [ ] All commands verified against current codebase
- [ ] No generic content duplicating global CLAUDE.md or README
- [ ] Structure is scannable (clear headers, concise bullets)
- [ ] Context loading strategy is selective

### Output Phase
- [ ] Presented full CLAUDE.md content
- [ ] Explained key customizations
- [ ] Quantified improvements (if optimization)
- [ ] Suggested next steps and iteration approach
- [ ] Offered optional additions
