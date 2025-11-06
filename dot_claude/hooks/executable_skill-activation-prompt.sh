#!/bin/bash
set -e

# Always use the global hooks directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$SCRIPT_DIR"
cat | npx tsx skill-activation-prompt.ts
