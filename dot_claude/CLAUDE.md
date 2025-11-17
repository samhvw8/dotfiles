Always respond in English

Don't assume, ask me to clarify

# 🔥 CRITICAL: ALWAYS Check Skills & Sub-Agents FIRST Before Manual Work!

<workflow>
1. **Extract keywords** from user request
2. **Match keywords** against skill triggers (use `/skills` to list all 42 available skills)
3. **If match found** → Invoke skill IMMEDIATELY, do NOT proceed manually
4. **Check for sub-agent opportunities** → Complex searches, codebase exploration, multi-step analysis
5. **If no match** → Check MCP tools (context7, magic, chrome) → Native tools (Read, Write, Edit, Bash)
</workflow>

## 🚀 Sub-Agent Usage (CRITICAL)

**ALWAYS use sub-agents for:**
- **Codebase exploration**: "find X", "where is Y", "explore architecture", "trace dependencies"
- **Complex searches**: Multi-keyword searches, fuzzy matching, pattern discovery
- **Multi-step analysis**: Architecture review, dependency mapping, security audits
- **Parallel execution**: Run multiple agents concurrently for independent tasks

**Available Sub-Agents:**
- `codebase-explorer` (Haiku): Lightning-fast file finding, ripgrep/fzf, architecture mapping
- Custom agents in `.claude/agents/` or `~/.claude/agents/`

### 🔥 Parallel Sub-Agent Execution

**When to run agents in parallel:**
- Multiple independent searches (different keywords, different file types)
- Simultaneous codebase exploration (architecture + dependencies + patterns)
- Multi-language analysis (find patterns across TS, Python, Go files)
- Parallel component analysis (UI + logic + tests)

**Example - Parallel Invocation:**
```
Use Task tool to launch multiple agents in a SINGLE message:
- codebase-explorer: Find authentication logic
- codebase-explorer: Find database queries
- codebase-explorer: Map API endpoints
```

**Benefits:**
- ✅ Faster responses (concurrent execution)
- ✅ Comprehensive results (multiple perspectives)
- ✅ Efficient token usage (specialized agents)
- ✅ Better context (Haiku model for searches)

## 🚨 Common Mistakes

❌ "I can do this manually" → ✅ **Skills/Sub-agents are specialized experts - ALWAYS prefer them**
❌ Skipping keyword extraction → ✅ **Extract keywords from EVERY request**
❌ Focusing on context instead of triggers → ✅ **Match trigger words and synonyms/close meaning words, not context**
❌ Running agents sequentially → ✅ **Launch multiple agents in parallel when tasks are independent**
❌ Using grep/glob directly for complex searches → ✅ **Use codebase-explorer sub-agent instead**

## MCP Tools Priority

- **context7**: Library/framework documentation (React, Next.js, Prisma, etc.)
- **magic**: UI component generation, design systems
- **chrome**: Browser automation, web scraping, testing

---

# MISE
- mise is a polyglot tool version manager. It replaces tools like asdf, nvm, pyenv, rbenv, etc.
- mise allows you to switch sets of env vars in different project directories. It can replace direnv.
- mise is a task runner that can replace make, or npm scripts.

@PRINCIPLES.md

# MCP Documentation
@MCP_Context7.md
@MCP_Magic.md
@MCP_Playwright.md
