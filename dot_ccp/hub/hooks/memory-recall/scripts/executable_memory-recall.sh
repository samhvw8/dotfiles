#!/bin/bash
# Memory recall hook — UserPromptSubmit
# Reads user prompt from stdin JSON, injects memory recall instructions
# Input: JSON on stdin with session_id, transcript_path, cwd, etc.
# Output: stdout text injected as Claude context

cat <<'EOF'
<memory_recall_protocol mandatory="true">

Before responding to this prompt, you MUST:

1. **Recall relevant memory** — Use `mcp__agentmemory__memory_recall` with a query derived from the user's prompt (extract key topics, file names, concepts). Set `token_budget: 2000` to avoid context bloat.

2. **Smart search if recall is sparse** — If recall returns <2 results, also try `mcp__agentmemory__memory_smart_search` with broader keywords.

3. **Apply recalled context silently** — Use past decisions, preferences, and patterns to inform your response. Do NOT narrate what you recalled unless the user asks.

4. **Skip recall ONLY when:**
   - User says "don't check memory" or equivalent
   - Prompt is a simple yes/no or single-word answer
   - You already recalled memory this turn

Token budget: 2000 max for recall results. Prefer compact format.

</memory_recall_protocol>
EOF
