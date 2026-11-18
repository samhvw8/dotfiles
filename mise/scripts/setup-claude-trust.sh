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
# ~/.ccp/profiles/*/.claude.json and ~/.ccp/accounts/*/.claude.json. A new
# profile or account gets it on the next full bootstrap, or run this script.
#
# A file that cannot be updated (bad JSON, failed write) is reported and
# skipped, the other files are still done, and the script then exits 1 so the
# failure is not silent. A dangling link or a config folder that reads
# .config.json instead is only reported.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

log_warn() {
    echo -e "\033[0;33m[WARN]\033[0m $1" >&2
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Sets the key in one real file. Returns 1, without writing, when the file is
# not a JSON object whose "projects" is an object or missing.
trust_home_in() {
    local config="$1"
    local tmp

    if ! jq -e '(type == "object") and ((.projects | type) as $t | $t == "object" or $t == "null")' "$config" >/dev/null 2>&1; then
        log_warn "$config is not a Claude state file jq can update (bad JSON or odd shape); skipped"
        return 1
    fi
    if jq -e --arg home "$HOME" '.projects[$home].hasTrustDialogAccepted == true' "$config" >/dev/null 2>&1; then
        log_info "Claude home-folder trust already set in $config, skipping"
        return 0
    fi

    # The file holds the auth token: mktemp creates the copy as 0600 and in the
    # same directory, so mv replaces the file atomically and keeps it private.
    tmp="$(mktemp "$config.XXXXXX")"
    trap 'rm -f "$tmp"' EXIT
    if ! jq --arg home "$HOME" '.projects[$home].hasTrustDialogAccepted = true' "$config" >"$tmp"; then
        rm -f "$tmp"
        trap - EXIT
        log_warn "could not update $config; skipped"
        return 1
    fi
    if ! mv "$tmp" "$config"; then
        rm -f "$tmp"
        trap - EXIT
        log_warn "could not replace $config; skipped"
        return 1
    fi
    trap - EXIT
    log_success "Claude home-folder trust set in $config"
}

setup_claude_trust() {
    local entry real dir failed=0 found=0 seen=$'\n'

    if ! command_exists claude; then
        log_info "Claude CLI not installed, skipping home-folder trust"
        return 0
    fi

    shopt -s nullglob
    for entry in "$HOME/.claude.json" "$HOME"/.ccp/profiles/*/.claude.json "$HOME"/.ccp/accounts/*/.claude.json; do
        [[ -e "$entry" || -L "$entry" ]] || continue
        # Write through a link to its target, so the link stays a link.
        if [[ -L "$entry" ]]; then
            if ! real="$(readlink -f "$entry")" || [[ ! -f "$real" ]]; then
                log_warn "$entry is a link to a missing file; skipped"
                continue
            fi
        else
            real="$entry"
        fi
        found=1

        # Claude Code 2.1.326+ reads a non-empty .config.json in the config
        # folder instead of .claude.json, so a key set here would do nothing.
        # Checked per entry, before the dedupe, since two links to one file
        # can sit in config folders that differ.
        dir="$(dirname "$entry")"
        [[ "$entry" == "$HOME/.claude.json" ]] && dir="$HOME/.claude"
        if [[ -s "$dir/.config.json" ]]; then
            log_warn "$dir/.config.json is not empty, so Claude Code ignores $entry; trust not set"
            continue
        fi

        case "$seen" in *$'\n'"$real"$'\n'*) continue ;; esac
        seen+="$real"$'\n'
        trust_home_in "$real" || failed=1
    done

    if [[ "$found" == 0 ]]; then
        log_info "No Claude state file yet; run claude once, then re-run mise bootstrap"
    fi
    return "$failed"
}

setup_claude_trust
