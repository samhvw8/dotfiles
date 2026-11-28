#!/bin/bash
# codegraph-remind — PreToolUse hook (Grep|Bash)
# Steers symbol/identifier searches toward codegraph_explore when the target
# repo has a .codegraph/ index. Non-blocking (always exits 0).
#
# Input: JSON on stdin (tool_name, tool_input, cwd).
# Output: stdout JSON with hookSpecificOutput.additionalContext only when
#   1. Target dir / cwd is inside a repo with .codegraph/ (excluding $HOME).
#   2. Tool is Grep/grep or Bash/bash invoking rg/grep (not `codegraph explore`).
#   3. Pattern looks like a code symbol/identifier or code declaration.

set -u

input=$(cat)
[ -z "$input" ] && exit 0

command -v jq >/dev/null 2>&1 || exit 0

tool_name=""
cwd=""
pattern=""
target_path=""
command_str=""

{
  IFS= read -r -d '' tool_name || true
  IFS= read -r -d '' cwd || true
  IFS= read -r -d '' pattern || true
  IFS= read -r -d '' target_path || true
  IFS= read -r -d '' command_str || true
} < <(printf '%s' "$input" | jq -j '
  (.tool_name // ""), "\u0000",
  (.cwd // ""), "\u0000",
  (.tool_input.pattern // ""), "\u0000",
  (.tool_input.path // ""), "\u0000",
  (.tool_input.command // ""), "\u0000"
' 2>/dev/null)

case "$tool_name" in
  Grep|grep|Bash|bash) ;;
  *) exit 0 ;;
esac

[ -z "$cwd" ] && cwd="$PWD"

# Resolve target directory for .codegraph/ lookup.
check_dir="$cwd"
if [ -n "$target_path" ]; then
  candidate="$target_path"
  case "$candidate" in
    /*) ;;
    *) candidate="$cwd/$candidate" ;;
  esac
  if [ -d "$candidate" ]; then
    check_dir="$candidate"
  elif [ -e "$candidate" ]; then
    check_dir="${candidate%/*}"
    [ -z "$check_dir" ] && check_dir="/"
  fi
fi

# Walk up from check_dir looking for .codegraph/.
# $HOME/.codegraph is codegraph's global state dir, never a project index.
indexed=""
d="${check_dir%/}"
[ -z "$d" ] && d="/"
while [ -n "$d" ] && [ "$d" != "/" ]; do
  if [ "$d" != "$HOME" ] && [ -d "$d/.codegraph" ]; then
    indexed="yes"
    break
  fi
  next="${d%/*}"
  [ -z "$next" ] && next="/"
  [ "$next" = "$d" ] && break
  d="$next"
done

[ -z "$indexed" ] && exit 0

# Extract search pattern from Bash command invoking rg/grep.
extract_bash_pattern() {
  local cmd="$1"

  # Never fire on `codegraph explore`.
  local cg_re='(^|[;&|[:space:]])codegraph[[:space:]]+explore([[:space:]]|$)'
  if [[ "$cmd" =~ $cg_re ]]; then
    return 1
  fi

  # Must invoke rg, grep, egrep, or fgrep as a command token.
  local grep_re='(^|[;&|[:space:]])(rg|grep|egrep|fgrep)([[:space:]]|$)'
  if ! [[ "$cmd" =~ $grep_re ]]; then
    return 1
  fi

  # Slice from the matched grep/rg command onward.
  local rest="${cmd#*"${BASH_REMATCH[0]}"}"
  local tok=""
  local skip_next=0
  local take_next=0
  local after_ddash=0
  local dq_re='^"([^"]*)"(.*)$'
  local sq_re="^'([^']*)'(.*)$"
  local bare_re='^([^[:space:]]+)(.*)$'

  while [ -n "$rest" ]; do
    # Trim leading whitespace
    rest="${rest#"${rest%%[![:space:]]*}"}"
    [ -z "$rest" ] && break

    # Stop at shell command separators / redirections
    case "$rest" in
      "&&"*|"||"*|";"*|"|"*|">"*|"<"* ) break ;;
    esac

    if [[ "$rest" =~ $dq_re ]]; then
      tok="${BASH_REMATCH[1]}"
      rest="${BASH_REMATCH[2]}"
    elif [[ "$rest" =~ $sq_re ]]; then
      tok="${BASH_REMATCH[1]}"
      rest="${BASH_REMATCH[2]}"
    elif [[ "$rest" =~ $bare_re ]]; then
      tok="${BASH_REMATCH[1]}"
      rest="${BASH_REMATCH[2]}"
    else
      break
    fi

    if [ "$take_next" -eq 1 ]; then
      printf '%s' "$tok"
      return 0
    fi
    if [ "$skip_next" -eq 1 ]; then
      skip_next=0
      continue
    fi
    if [ "$after_ddash" -eq 1 ]; then
      printf '%s' "$tok"
      return 0
    fi

    case "$tok" in
      --)
        after_ddash=1
        ;;
      -e|--regexp)
        take_next=1
        ;;
      --regexp=*)
        printf '%s' "${tok#--regexp=}"
        return 0
        ;;
      -g|--glob|--iglob|-t|--type|-T|--type-not|-A|-B|-C|-m|--max-count|--max-depth|-f|--file|--include|--exclude|--exclude-dir|-j|--threads|--color|--sort|-d)
        skip_next=1
        ;;
      -*)
        ;;
      *)
        printf '%s' "$tok"
        return 0
        ;;
    esac
  done

  return 1
}

search_pat=""
case "$tool_name" in
  Grep|grep)
    search_pat="$pattern"
    ;;
  Bash|bash)
    search_pat=$(extract_bash_pattern "$command_str") || exit 0
    ;;
esac

[ -z "$search_pat" ] && exit 0

# Decide whether search_pat looks like a code symbol/identifier or declaration.
is_symbol_pattern() {
  local p="$1"
  [ -z "$p" ] && return 1

  # Skip URLs
  case "$p" in
    *"://"* ) return 1 ;;
  esac

  # Strip optional regex anchors / word boundaries
  local s="$p"
  s="${s#^}"
  s="${s#\\b}"
  s="${s#\\<}"
  s="${s%\$}"
  s="${s%\\b}"
  s="${s%\\>}"

  # 1. Code declaration prefixes (e.g. "func Foo", "def bar", "class Baz",
  #    "type Qux", "interface X", "struct Y")
  local decl_re='^[[:space:]]*(pub[[:space:]]+|export[[:space:]]+|async[[:space:]]+)?(func|function|def|class|type|interface|struct|enum|trait|impl|fn)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*'
  if [[ "$s" =~ $decl_re ]]; then
    return 0
  fi

  # 2. Reject spaces, file paths, config keys, and log/sentence punctuation
  case "$s" in
    *[[:space:]]*|*"/"*|*"."*|"-"*|*"-"*|*";"*|*"!"*|*"?"*|*","*|*"="*|*"@"*|*"#"* )
      return 1
      ;;
    *":"* )
      # Allow C++/Rust qualified symbol (Foo::bar)
      local scoped_re='^[A-Za-z_][A-Za-z0-9_]*::[A-Za-z_][A-Za-z0-9_]*$'
      if [[ "$s" =~ $scoped_re ]]; then
        return 0
      fi
      return 1
      ;;
  esac

  # Strip trailing call paren if present (e.g. handleRequest( or handleRequest\()
  s="${s%\\(}"
  s="${s%\(}"
  [ -z "$s" ] && return 1

  # 3. camelCase (starts lowercase, has at least one uppercase letter)
  local camel_re='^[a-z][a-z0-9]*[A-Z][A-Za-z0-9]*$'
  if [[ "$s" =~ $camel_re ]]; then
    return 0
  fi

  # 4. PascalCase (starts uppercase, has at least one lowercase letter)
  local pascal_re='^[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*$'
  if [[ "$s" =~ $pascal_re ]]; then
    return 0
  fi

  # 5. snake_case (lowercase segments joined by _; excludes ALL_CAPS env vars)
  local snake_re='^_?[a-z][a-z0-9]*(_[a-z0-9]+)+$'
  if [[ "$s" =~ $snake_re ]]; then
    return 0
  fi

  return 1
}

if is_symbol_pattern "$search_pat"; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"Repo has .codegraph/ — use codegraph_explore for symbol/call-graph questions before grepping."}}\n'
fi

exit 0
