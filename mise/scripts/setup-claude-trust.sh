#!/bin/bash

# =============================================================================
# Claude Home-Folder Trust
# Runs after tools are installed, on every full `mise bootstrap`
#
# Claude Code never saves trust for the home folder: accepting the dialog in ~
# lasts one session. Its trust check still reads
# projects[<home>].hasTrustDialogAccepted from the config folder's .claude.json,
# so setting the key by hand lets new sessions in ~ (agent-team teammates
# included) start without the dialog. Non-git folders under ~ inherit the
# trust; a git repo stops the parent walk at its own root, so cloned repos
# still ask.
#
# Each ccp profile or account run through CLAUDE_CONFIG_DIR keeps its own
# .claude.json, so the key is set in ~/.claude.json and in every
# ~/.ccp/profiles/*/.claude.json and ~/.ccp/accounts/*/.claude.json.
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

trust_home_in() {
    local config="$1"
    local tmp

    if jq -e --arg home "$HOME" '.projects[$home].hasTrustDialogAccepted == true' "$config" >/dev/null; then
        log_info "Claude home-folder trust already set in $config, skipping"
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

setup_claude_trust() {
    local config

    if ! command_exists claude; then
        log_info "Claude CLI not installed, skipping home-folder trust"
        return 0
    fi
    if [[ ! -f "$HOME/.claude.json" ]]; then
        log_info "$HOME/.claude.json does not exist yet; run claude once, then re-run mise bootstrap"
    fi

    shopt -s nullglob
    for config in "$HOME/.claude.json" "$HOME"/.ccp/profiles/*/.claude.json "$HOME"/.ccp/accounts/*/.claude.json; do
        # A link points at another config file that the loop reaches itself.
        if [[ -f "$config" && ! -L "$config" ]]; then
            trust_home_in "$config"
        fi
    done
}

setup_claude_trust
