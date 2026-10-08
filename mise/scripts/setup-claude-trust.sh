#!/bin/bash

# =============================================================================
# Claude Home-Folder Trust
# Runs after tools are installed, on every full `mise bootstrap`
#
# Claude Code never saves trust for the home folder: accepting the dialog in ~
# lasts one session. Its trust check still reads
# projects[<home>].hasTrustDialogAccepted from ~/.claude.json, so setting the
# key by hand lets new sessions in ~ (agent-team teammates included) start
# without the dialog. Non-git folders under ~ inherit the trust; a git repo
# stops the parent walk at its own root, so cloned repos still ask.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

setup_claude_trust() {
    local config="$HOME/.claude.json"
    local tmp

    if ! command_exists claude; then
        log_info "Claude CLI not installed, skipping home-folder trust"
        return 0
    fi
    if [[ ! -f "$config" ]]; then
        log_info "$config does not exist yet; run claude once, then re-run mise bootstrap"
        return 0
    fi
    if jq -e --arg home "$HOME" '.projects[$home].hasTrustDialogAccepted == true' "$config" >/dev/null; then
        log_info "Claude home-folder trust already set, skipping"
        return 0
    fi

    # The file holds the auth token: mktemp creates the copy as 0600 and in the
    # same directory, so mv replaces the file atomically and keeps it private.
    tmp="$(mktemp "$config.XXXXXX")"
    trap 'rm -f "$tmp"' EXIT
    jq --arg home "$HOME" '.projects[$home].hasTrustDialogAccepted = true' "$config" >"$tmp"
    mv "$tmp" "$config"
    trap - EXIT
    log_success "Claude home-folder trust set in $config"
}

setup_claude_trust
