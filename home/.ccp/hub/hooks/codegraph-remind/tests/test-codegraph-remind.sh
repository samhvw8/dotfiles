#!/bin/bash
# Unit tests for codegraph-remind PreToolUse hook.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK="$SCRIPT_DIR/scripts/codegraph-remind.sh"

TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

NON_INDEXED="$TMP_ROOT/plain-repo"
INDEXED="$TMP_ROOT/indexed-repo"
INDEXED_SUB="$INDEXED/src/pkg"
mkdir -p "$NON_INDEXED" "$INDEXED/.codegraph" "$INDEXED_SUB"

PASS=0
FAIL=0

assert_silent() {
  local name="$1"
  local payload="$2"
  local out status
  set +e
  out=$(printf '%s' "$payload" | bash "$HOOK")
  status=$?
  set -e
  if [ "$status" -eq 0 ] && [ -z "$out" ]; then
    echo "PASS: $name"
    PASS=$((PASS + 1))
  else
    echo "FAIL: $name (status=$status, expected empty output, got: $out)"
    FAIL=$((FAIL + 1))
  fi
}

assert_fires() {
  local name="$1"
  local payload="$2"
  local out status event ctx
  set +e
  out=$(printf '%s' "$payload" | bash "$HOOK")
  status=$?
  set -e
  if [ "$status" -ne 0 ] || [ -z "$out" ]; then
    echo "FAIL: $name (status=$status, expected JSON output, got empty)"
    FAIL=$((FAIL + 1))
    return
  fi
  event=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.hookEventName // empty' 2>/dev/null || true)
  ctx=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.additionalContext // empty' 2>/dev/null || true)
  if [ "$event" = "PreToolUse" ] && [ "$ctx" = "Repo has .codegraph/ — use codegraph_explore for symbol/call-graph questions before grepping." ]; then
    echo "PASS: $name"
    PASS=$((PASS + 1))
  else
    echo "FAIL: $name (unexpected JSON: $out)"
    FAIL=$((FAIL + 1))
  fi
}

# 1. Non-indexed dir -> silent exit 0
assert_silent "non-indexed dir with Grep symbol" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$NON_INDEXED\",\"tool_input\":{\"pattern\":\"handleRequest\"}}"

# 2. Indexed dir + non-grep Bash (ls, git status) -> silent exit 0
assert_silent "indexed dir + Bash ls" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"ls -la\"}}"
assert_silent "indexed dir + Bash git status" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"git status\"}}"

# 3. Indexed dir + Grep on symbol (handleRequest / class Foo / snake_case) -> fires
assert_fires "indexed dir + Grep camelCase (handleRequest)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"handleRequest\"}}"
assert_fires "indexed dir + Grep declaration (class Foo)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"class Foo\"}}"
assert_fires "indexed subdir + Grep snake_case (validate_token)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED_SUB\",\"tool_input\":{\"pattern\":\"validate_token\"}}"
assert_fires "indexed dir + Grep declaration (func main)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"func main\"}}"

# 4. Indexed dir + Bash rg/grep on symbol -> fires
assert_fires "indexed dir + Bash rg \"validateToken\"" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"rg \\\"validateToken\\\"\"}}"
assert_fires "indexed dir + Bash grep -rn handleRequest src/" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"grep -rn handleRequest src/\"}}"
assert_fires "indexed dir + Bash rg -e \"class Foo\" ." \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"rg -e \\\"class Foo\\\" .\"}}"

# 5. Indexed dir + Grep on log phrase / config key / file path -> silent exit 0
assert_silent "indexed dir + Grep log phrase" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"failed to connect to database\"}}"
assert_silent "indexed dir + Grep config key (server.port)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"server.port\"}}"
assert_silent "indexed dir + Grep file path (src/auth/login.ts)" \
  "{\"tool_name\":\"Grep\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"pattern\":\"src/auth/login.ts\"}}"
assert_silent "indexed dir + Bash rg log phrase" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"rg \\\"failed to connect to database\\\"\"}}"

# 6. Indexed dir + Bash codegraph explore Foo -> silent exit 0
assert_silent "indexed dir + Bash codegraph explore Foo" \
  "{\"tool_name\":\"Bash\",\"cwd\":\"$INDEXED\",\"tool_input\":{\"command\":\"codegraph explore Foo\"}}"

echo "---"
echo "Passed: $PASS, Failed: $FAIL"
[ "$FAIL" -eq 0 ]
