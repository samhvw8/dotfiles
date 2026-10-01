#!/bin/bash

# =============================================================================
# Scaffold or update ~/.config/mise/config.local.toml (mise run dot:local).
#
# Missing: copy mise/config.local.example.toml there (mode 600). Present: add
# every [env] key from the example that the file lacks, commented out, into its
# [env] table. Values are never changed. Then list the keys still to fill in.
# Bash only, so setup.sh can run it before any tool is installed.
# =============================================================================

set -euo pipefail

DOTFILES_DIR="${DOTFILES_DIR:-$HOME/.dotfiles}"
EXAMPLE="$DOTFILES_DIR/mise/config.local.example.toml"
LOCAL="${MISE_CONFIG_DIR:-$HOME/.config/mise}/config.local.toml"

# Every KEY = line in the example, commented or not.
example_keys() {
    sed -nE 's/^#?[[:space:]]*([A-Z][A-Z0-9_]*)[[:space:]]*=.*/\1/p' "$EXAMPLE"
}

key_state() {
    if grep -qE "^[[:space:]]*$1[[:space:]]*=" "$LOCAL"; then
        echo set
    elif grep -qE "^#[[:space:]]*$1[[:space:]]*=" "$LOCAL"; then
        echo pending
    else
        echo absent
    fi
}

if [ ! -f "$EXAMPLE" ]; then
    echo "error: $EXAMPLE not found" >&2
    exit 1
fi

created=false
if [ ! -f "$LOCAL" ]; then
    mkdir -p "$(dirname "$LOCAL")"
    (umask 077 && cp "$EXAMPLE" "$LOCAL")
    created=true
    echo "Created $LOCAL from the template."
fi

# Add the keys the local file lacks, as the example writes them, commented.
added=()
lines=""
for key in $(example_keys); do
    if [ "$(key_state "$key")" = absent ]; then
        line="$(grep -m1 -E "^#?[[:space:]]*$key[[:space:]]*=" "$EXAMPLE" | sed -E 's/^#?[[:space:]]*/# /')"
        lines="$lines$line"$'\n'
        added+=("$key")
    fi
done
if [ ${#added[@]} -gt 0 ]; then
    tmp="$(mktemp "$LOCAL.XXXXXX")"
    if grep -qE '^\[env\][[:space:]]*$' "$LOCAL"; then
        # Right under the [env] header, so the keys never land in another table.
        LINES="$lines" awk '{ print } /^\[env\][[:space:]]*$/ && !done { printf "%s", ENVIRON["LINES"]; done = 1 }' \
            "$LOCAL" >"$tmp"
    else
        { cat "$LOCAL"; printf '\n[env]\n%s' "$lines"; } >"$tmp"
    fi
    chmod 600 "$tmp"
    mv "$tmp" "$LOCAL"
    echo "Added ${#added[@]} key(s) from the template, commented out: ${added[*]}"
fi

pending=()
set_n=0
for key in $(example_keys); do
    case "$(key_state "$key")" in
        set) set_n=$((set_n + 1)) ;;
        *) pending+=("$key") ;;
    esac
done

if [ ${#pending[@]} -eq 0 ]; then
    echo "$LOCAL: all ${set_n} template keys are set."
    exit 0
fi
echo ""
echo "Fill these in: open $LOCAL, uncomment each line this machine needs and set its value."
for key in "${pending[@]}"; do
    echo "  - $key"
done
if $created; then
    echo "setup.sh adds the git identity ([vars]) itself. Keys this machine does not use can stay commented."
fi
