---
description: Show available plan templates and their usage
argument-hint: [template-type]
---

Show available plan templates.

**Template Type**: ${1:list all templates}

Available templates:
1. **Generic Project** - Universal template for any project type
2. **Business Project** - For product launches, campaigns, initiatives
3. **Personal Goal** - For career, learning, lifestyle goals
4. **Software Implementation** - For technical development (use /impl-plan)

Template locations:
- Generic: .claude/skills/project-planner/templates/generic-plan-template.md
- Business: .claude/skills/project-planner/templates/business-plan-template.md
- Personal: .claude/skills/project-planner/templates/personal-goal-template.md
- Implementation: .claude/skills/implementation-planner/templates/plan-template.md

Requested template: $1

Actions:
1. List available templates with descriptions
2. If specific template requested, show its structure and sections
3. Provide guidance on when to use each template
4. Show example usage with /plan or /impl-plan commands

Please show the plan template information.
