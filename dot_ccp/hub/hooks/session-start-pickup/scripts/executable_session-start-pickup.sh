#!/bin/bash
# Session start pickup — reads pending session-end markers
# Tells Claude to save session summaries from previous sessions that ended
# before memory could be saved

PENDING_DIR="$HOME/.ccp/profiles/default/hooks/memory-recall/pending"

if [ ! -d "$PENDING_DIR" ] || [ -z "$(ls -A "$PENDING_DIR" 2>/dev/null)" ]; then
  exit 0
fi

# Collect pending sessions
PENDING_COUNT=$(ls "$PENDING_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')

if [ "$PENDING_COUNT" -gt 0 ]; then
  cat <<EOF
<pending_session_saves count="$PENDING_COUNT">
Previous session(s) ended before memory could be saved.
Use mcp__agentmemory__memory_save to record a brief session summary:
- type: "workflow"
- concepts: "session-summary, session-end"
- content: summarize what was accomplished (check transcript if available)

Then these pending markers will be cleaned up automatically.
</pending_session_saves>
EOF

  # Clean up pending files (they've been reported)
  rm -f "$PENDING_DIR"/*.json 2>/dev/null
fi
