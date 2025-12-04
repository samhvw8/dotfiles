#!/bin/bash

# Agent Activation Hook for Claude Code
# Detects when to use specialized sub-agents based on user prompts

# Path to the TypeScript hook
HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS_HOOK="$HOOK_DIR/agent-activation-prompt.ts"

# Check if TypeScript hook exists
if [ ! -f "$TS_HOOK" ]; then
    echo "Error: agent-activation-prompt.ts not found at $TS_HOOK" >&2
    exit 0  # Exit successfully to not block workflow
fi

# Check if tsx is available (TypeScript executor)
if ! command -v tsx &> /dev/null; then
    # Try npx tsx
    if ! command -v npx &> /dev/null; then
        echo "Warning: tsx/npx not found. Install tsx globally: npm install -g tsx" >&2
        exit 0  # Exit successfully to not block workflow
    fi
    # Execute with npx tsx
    npx tsx "$TS_HOOK"
else
    # Execute with tsx directly
    tsx "$TS_HOOK"
fi
