#!/bin/bash

# =============================================================================
# Claude Code profile link (full install, mise bootstrap post-tools hook)
# ccp owns ~/.claude: `ccp use -g <profile>` repoints it, so mise does not
# manage it. This only creates the link when ~/.claude does not exist yet.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

if [[ -e "$HOME/.claude" || -L "$HOME/.claude" ]]; then
    if [[ ! -L "$HOME/.claude" ]]; then
        log_info "$HOME/.claude is an existing directory; left as is. Run 'ccp init' to move it into ccp."
    fi
    exit 0
fi

if ! command -v ccp >/dev/null 2>&1; then
    log_info "ccp not installed, skipping ~/.claude setup"
    exit 0
fi

ccp use -g default
