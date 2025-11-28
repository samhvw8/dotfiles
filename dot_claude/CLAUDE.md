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
- **Specialized tasks**: Backend design, refactoring, security audits, testing strategy
- **Parallel execution**: Run multiple agents concurrently for independent tasks


## 🚨 Common Mistakes

❌ "I can do this manually" → ✅ **Skills/Sub-agents are specialized experts - ALWAYS prefer them**
❌ Skipping keyword extraction → ✅ **Extract keywords from EVERY request**
❌ Focusing on context instead of triggers → ✅ **Match trigger words and synonyms/close meaning words, not context**
❌ Running agents sequentially → ✅ **Launch multiple agents in parallel when tasks are independent**
❌ Using grep/glob directly for complex searches → ✅ **Use codebase-explorer sub-agent instead**
❌ Not using specialized agents → ✅ **Use python-expert for Python, backend-architect for APIs, etc.**
❌ Manual refactoring without agent → ✅ **Use refactoring-expert for SOLID principles and code quality**
❌ Manual security reviews → ✅ **Use security-engineer for OWASP audits and threat modeling**
❌ Debugging without systematic approach → ✅ **Use root-cause-analyst for hypothesis-driven investigation**

## MCP Tools Priority

- **context7**: Library/framework documentation (React, Next.js, Prisma, etc.)

---

# MISE
- mise is a polyglot tool version manager. It replaces tools like asdf, nvm, pyenv, rbenv, etc.
- mise allows you to switch sets of env vars in different project directories. It can replace direnv.
- mise is a task runner that can replace make, or npm scripts.

@PRINCIPLES.md

# MCP Documentation
@MCP_Context7.md
