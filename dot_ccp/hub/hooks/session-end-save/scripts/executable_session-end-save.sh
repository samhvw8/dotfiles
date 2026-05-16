#!/bin/bash
# Session end hook — SessionEnd event (async, fire-and-forget)
# Writes a pending memory marker for next session pickup
# Since MCP tools aren't available at session end, we write to a file

PENDING_DIR="$HOME/.ccp/profiles/default/hooks/memory-recall/pending"
mkdir -p "$PENDING_DIR"

# Read session info from stdin
SESSION_JSON=$(cat)
SESSION_ID=$(echo "$SESSION_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('session_id','unknown'))" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Write pending session end marker
cat > "$PENDING_DIR/session-$SESSION_ID.json" <<ENDJSON
{
  "session_id": "$SESSION_ID",
  "ended_at": "$TIMESTAMP",
  "status": "pending_save"
}
ENDJSON

# Output reminder (SessionEnd output may not reach Claude, but try)
cat <<'EOF'
<session_end_save>
Session ending. Save a session summary to agentmemory:
- Key accomplishments this session
- Unfinished work / next steps
- Important decisions or discoveries
Use type: "workflow" with concepts: "session-summary"
</session_end_save>
EOF
