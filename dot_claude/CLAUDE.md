Always respond in English

Don't assume, ask me to clarify

# Decision Framework: Before Taking Action

Before executing any task, follow this systematic evaluation process:

<pre_action_checklist>
1. **Understand the Request**
   - What is the user actually asking for?
   - Are there ambiguities that need clarification?
   - What is the expected outcome?

2. **Check Available Skills** (use `/skills` to list)
   - Does a specialized skill exist for this task?
   - Skills to consider:
     - `mise-expert`: Tool management, task runners, environment setup
     - `brainstorming`: Exploratory discussions, requirement gathering
     - `planning-methodology`: Implementation planning, architecture design
     - `prompt-enhancer`: Improving prompts and instructions
     - `skill-creator`: Creating new skills
     - `introspection`: Meta-analysis and reasoning patterns
   - If yes → Invoke the skill for specialized handling

3. **Check Available MCP Functions**
   - Can an MCP server solve this more efficiently?
   - MCP tools to consider:
     - `context7`: Library documentation, framework patterns, API references
     - `magic`: UI component generation, design systems
     - `chrome-mcp-server`: Browser automation, web scraping, testing
   - If yes → Use the appropriate MCP function

4. **Evaluate Native Capabilities**
   - Can this be solved with standard tools (Read, Write, Edit, Bash, Grep, Glob)?
   - Is this a simple task that doesn't require specialized handling?
   - Would native tools be more efficient than invoking a skill/MCP?

5. **Choose the Best Approach**
   - Specialized Skill: Complex domain-specific tasks
   - MCP Function: External data or specialized operations
   - Native Tools: Direct file operations, code editing, searches
   - Combination: Complex tasks may need multiple approaches
</pre_action_checklist>

<decision_examples>
**Example 1: "Install Node.js for my project"**
- ✓ Check skills → `mise-expert` handles tool installation
- Action: Invoke `mise-expert` skill

**Example 2: "Create a login form component"**
- ✓ Check MCP → `magic` generates UI components
- Action: Use `mcp__magic__21st_magic_component_builder`

**Example 3: "How does React useEffect work?"**
- ✓ Check MCP → `context7` provides official React docs
- Action: Use `mcp__context7__get-library-docs`

**Example 4: "Fix this typo in README.md"**
- ✓ Simple edit, no skill/MCP needed
- Action: Use Edit tool directly

**Example 5: "Setup development environment for Python/Node project"**
- ✓ Check skills → `mise-expert` handles polyglot environments
- Action: Invoke `mise-expert` skill
</decision_examples>

# MISE
- mise is a polyglot tool version manager. It replaces tools like asdf, nvm, pyenv, rbenv, etc.
- mise allows you to switch sets of env vars in different project directories. It can replace direnv.
- mise is a task runner that can replace make, or npm scripts.

@PRINCIPLES.md

# MCP Documentation
@MCP_Context7.md
@MCP_Magic.md
@MCP_Playwright.md
