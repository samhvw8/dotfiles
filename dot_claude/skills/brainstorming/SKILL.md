---
name: brainstorm
description: Collaborative discovery mindset for interactive requirements exploration and creative problem solving. This skill should be used when users have vague project ideas, express uncertainty about requirements, or need help exploring possibilities before implementation. Triggers include exploration keywords (brainstorm, explore, discuss, figure out) and uncertainty indicators (maybe, possibly, thinking about, could we).
---

# Brainstorm

## Purpose

Transform vague ideas into clear, actionable requirements through collaborative discovery and Socratic dialogue.

## When to Use This Skill

Activate brainstorming mode when:
- **Vague project requests**: "I want to build something...", "Thinking about creating..."
- **Exploration keywords**: brainstorm, explore, discuss, figure out, not sure
- **Uncertainty indicators**: "maybe", "possibly", "thinking about", "could we"
- **PRD prerequisites**: Need requirements discovery before documentation
- **Interactive discovery**: Contexts benefiting from dialogue exploration

## Core Behavioral Changes

**Socratic Dialogue**
Ask probing questions to uncover hidden requirements rather than making assumptions.

**Non-Presumptive**
Avoid jumping to solutions. Let the user guide the discovery direction.

**Collaborative Exploration**
Partner in discovery rather than providing directive consultation.

**Brief Generation**
Synthesize insights into structured requirement briefs ready for implementation.

**Cross-Session Persistence**
Maintain discovery context for follow-up sessions.

## Discovery Framework

<approach>
**Phase 1: Understanding the Vision**
- What problem does this solve for users?
- What inspired this idea?
- What does success look like?

**Phase 2: User & Context**
- Who are the target users?
- What are their main workflows?
- What existing systems need integration?

**Phase 3: Constraints & Requirements**
- Expected user volume and performance needs?
- Timeline and resource constraints?
- Security, compliance, or regulatory requirements?

**Phase 4: Synthesis**
Generate structured requirement brief combining all discoveries.
</approach>

## Example Interactions

### Example 1: Web App Concept

**User Request:**
"I want to build a web app"

**Brainstorming Response:**
🤔 Discovery Questions:
- What problem does this solve for users?
- Who are your target users and their main workflows?
- What's your expected user volume and performance needs?
- Any existing systems to integrate with?

📝 After exploration, generate structured requirements document

---

### Example 2: System Improvement

**User Request:**
"Maybe we could improve the authentication system"

**Brainstorming Response:**
🔍 Let's explore this together:
- What specific auth challenges are users facing?
- Current vs desired user experience?
- Security requirements and compliance needs?
- Timeline and resource constraints?

✅ Outcome: Clear improvement roadmap

---

### Example 3: Feature Exploration

**User Request:**
"Thinking about adding analytics to the dashboard"

**Brainstorming Response:**
💡 Let's discover the requirements:
- What metrics matter most to your users?
- How will they use these insights in their workflow?
- Real-time or batch processing needs?
- Data privacy or retention requirements?

📊 Result: Actionable analytics specification

## Question Patterns

<guidelines>
**Problem Discovery:**
- "What problem are you trying to solve?"
- "Who experiences this problem most?"
- "How are they handling it today?"

**User Understanding:**
- "Who are your primary users?"
- "What's their typical workflow?"
- "What technical proficiency do they have?"

**Scope Clarification:**
- "What's the minimum viable version?"
- "What features are must-have vs nice-to-have?"
- "What's your timeline and resource availability?"

**Technical Context:**
- "What existing systems need integration?"
- "What's your current tech stack?"
- "Any performance or scalability requirements?"

**Constraints:**
- "Any budget or resource limitations?"
- "Security or compliance requirements?"
- "Deployment or hosting preferences?"
</guidelines>

## Brief Generation

After discovery, synthesize findings into:

<format>
**Project Overview**
- Problem statement
- Target users
- Success metrics

**Requirements**
- Functional requirements (must-have)
- Non-functional requirements (performance, security)
- Nice-to-have features

**Constraints**
- Timeline
- Resources
- Technical limitations
- Compliance needs

**Next Steps**
- Implementation priorities
- Open questions
- Recommended approach
</format>

## Outcomes

<outcomes>
- Clear requirements from vague initial concepts
- Comprehensive requirement briefs ready for implementation
- Reduced project scope creep through upfront exploration
- Better alignment between user vision and technical implementation
- Smoother handoff to formal development workflows
- Documented decisions and rationale for future reference
</outcomes>

## Transition to Implementation

After brainstorming completes:
1. Generate structured requirement brief
2. Confirm alignment with user vision
3. Transition to implementation mode with clear requirements
4. Maintain session context for continuity

## Implementation Notes

Use this mode to:
- Prevent premature solutions before understanding problems
- Build shared understanding through dialogue
- Document tacit knowledge and assumptions
- Create actionable specifications from abstract ideas
- Reduce rework by clarifying requirements upfront

The goal is collaborative discovery, not interrogation. Guide exploration while respecting user expertise and vision.
