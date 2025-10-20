---
name: prompt-enhancer
description: Expert prompt engineering for transforming unclear or verbose prompts into concise, well-structured, effective prompts for AI agents and sub-agents. Use when user requests "improve this prompt", "enhance prompt", "optimize prompt", "make it better", "refine this", "rewrite prompt", or sends unclear/verbose/unstructured requests, or mentions prompt engineering, prompt optimization, or better AI results.
---

# Prompt Enhancer Skill

## Purpose

Transform user prompts into enhanced, production-ready versions that are concise, clean, and optimally structured for AI agents and sub-agents.

## When to Use This Skill

Use this skill when:
- User explicitly asks to improve, enhance, or optimize a prompt
- User sends an unclear, verbose, or poorly structured prompt
- User mentions they want better results from AI interactions
- User asks for help writing prompts for agents or automation
- User's request lacks clarity or proper structure

## Core Principles

1. **Conciseness**: Remove unnecessary words while preserving intent
2. **Structure**: Use clear formatting with multiple lines and logical sections
3. **XML Integration**: Mix natural text with XML tags for clarity and parsing
4. **Direct Mission**: Main task/quest/mission should NOT be wrapped in XML elements
5. **Clean Output**: Return ONLY the enhanced prompt - no meta-commentary

## Enhancement Process

### Input Analysis
- Identify the core objective
- Extract key requirements and constraints
- Detect ambiguities or missing information
- Recognize the intended agent or use case

### Task-Based Technique Selection (Optional)
Evaluate if the task would benefit from specific prompting techniques:

**Chain-of-Thought (CoT)**
- Use for: Complex reasoning, math problems, logical deduction, step-by-step analysis
- Implementation: Add instruction to "think step by step" or "show your reasoning"

**Chain-of-Draft**
- Use for: Writing tasks, content creation, iterative refinement
- Implementation: Request initial draft, then progressive improvements

**Few-Shot Learning**
- Use for: Pattern-based tasks, specific formatting, consistent outputs
- Implementation: Include 2-3 examples showing input-output pairs

**ReAct (Reasoning + Acting)**
- Use for: Tool use, multi-step tasks, decision-making processes
- Implementation: Combine reasoning traces with action steps

**Self-Consistency**
- Use for: Tasks needing verification, multiple valid approaches
- Implementation: Request multiple solutions, then synthesis

**Tree-of-Thoughts**
- Use for: Complex problem-solving, exploring alternatives
- Implementation: Ask to explore multiple paths before selecting best

**Role-Based Prompting**
- Use for: Domain-specific expertise, perspective-taking
- Implementation: Assign expert role (e.g., "Act as a senior engineer...")

**Least-to-Most Prompting**
- Use for: Breaking down complex problems into subproblems
- Implementation: Start with simpler versions, build up complexity

**Apply technique only if it materially improves the task outcome.**

### Structural Improvements
- Break complex requests into clear sections
- Use XML tags for: constraints, examples, context, format requirements
- Keep main mission/task as direct natural language
- Apply logical line breaks for readability

### Language Optimization
- Replace verbose phrases with concise alternatives
- Use active voice and direct instructions
- Eliminate redundancy and filler words
- Maintain specificity while reducing length

## XML Tag Usage Guidelines

**Use XML tags for:**
- `<constraints>` - Limitations and boundaries
- `<examples>` - Sample inputs/outputs
- `<context>` - Background information
- `<format>` - Output structure requirements
- `<requirements>` - Specific criteria to meet
- `<guidelines>` - Best practices to follow

**Do NOT use XML tags for:**
- The primary mission statement
- The main task description
- The core request or question

## Output Format

Return ONLY the enhanced prompt with:
- No conversational lead-in
- No explanations or commentary
- No placeholder text
- No quotation marks wrapping the prompt
- No meta-discussion about the enhancement

## Example Transformations

**Before:**
"I need you to help me write some code for a web app that will let users sign up and log in, and I want it to be secure and use modern best practices, and also it should have a nice UI, maybe you could suggest what framework to use?"

**After:**
Create a secure authentication system for a web application with user registration and login functionality.

<requirements>
- Implement modern security best practices
- Include password hashing and session management
- Design a clean, user-friendly interface
- Provide framework recommendation with rationale
</requirements>

<format>
- Code implementation
- Security considerations
- Framework justification
- UI/UX guidelines
</format>

---

**Before:**
"Can you analyze this data and tell me what's interesting about it and maybe make some charts or visualizations if that would help understand it better and also let me know if there are any trends or patterns?"

**After:**
Analyze the provided dataset and identify key insights, trends, and patterns.

<requirements>
- Highlight statistically significant findings
- Identify temporal trends and correlations
- Note any anomalies or outliers
</requirements>

<format>
- Executive summary of findings
- Data visualizations (charts/graphs as needed)
- Detailed pattern analysis
- Actionable recommendations
</format>

---

**Before:**
"I'm trying to figure out the best pricing strategy for my SaaS product and I'm not sure whether to go with monthly or annual billing or maybe tiered pricing?"

**After (with Chain-of-Thought technique applied):**
Determine the optimal pricing strategy for a SaaS product.

<context>
Consider: monthly vs. annual billing, tiered pricing models, market positioning
</context>

<approach>
Think step by step:
1. Analyze target customer segments and their payment preferences
2. Evaluate competitor pricing models in the space
3. Calculate unit economics for each pricing option
4. Assess cash flow implications
5. Consider customer lifetime value impact
</approach>

<requirements>
- Provide reasoning for each recommendation
- Include pros/cons analysis
- Suggest A/B testing approach if applicable
</requirements>

---

**Before:**
"Write a blog post about AI in healthcare that's engaging and informative"

**After (with Chain-of-Draft technique applied):**
Write an engaging and informative blog post about AI applications in healthcare.

<approach>
Use iterative drafting:
1. Create outline with key points and narrative arc
2. Draft introduction and conclusion
3. Develop body sections with examples
4. Refine for clarity, flow, and engagement
</approach>

<requirements>
- Target audience: healthcare professionals and tech enthusiasts
- Length: 1200-1500 words
- Include real-world examples and case studies
- Balance technical accuracy with accessibility
</requirements>

<format>
- Compelling headline
- Hook in first paragraph
- Clear section headers
- Actionable takeaways
</format>

## Quality Checklist

Before returning the enhanced prompt, verify:
- ✓ Main objective is clear and unambiguous
- ✓ XML tags are used appropriately (not for main mission)
- ✓ Structure uses multiple lines for readability
- ✓ Language is concise and direct
- ✓ No extraneous commentary included
- ✓ All key requirements preserved
- ✓ Actionable and complete

## Implementation Notes

When applying this skill:
1. Read the user's prompt completely
2. Identify enhancement opportunities
3. Apply structural and linguistic improvements
4. Output ONLY the enhanced version
5. Do not ask for clarification unless absolutely critical information is missing

The enhanced prompt should be immediately usable by the user without any modifications.
