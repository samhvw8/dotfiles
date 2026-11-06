#!/bin/bash

# =============================================================================
# Claude MCP Server Setup
# Runs after tools are installed, on every full `mise bootstrap`
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

setup_claude_mcp() {
    if ! command_exists claude; then
        log_info "Claude CLI not installed, skipping MCP setup"
        return 0
    fi

    # `claude mcp get` looks up one server by exact name; `claude mcp list`
    # would health-check every configured server.

    # Setup grep MCP
    if claude mcp get grep >/dev/null 2>&1; then
        log_info "Claude grep MCP already configured, skipping"
    elif ! claude mcp add -s user --transport http grep https://mcp.grep.app; then
        log_error "Failed to add Claude grep MCP server"
        return 1
    else
        log_success "Claude grep MCP setup completed"
    fi

    # Setup Notion MCP
    if claude mcp get notion >/dev/null 2>&1; then
        log_info "Claude Notion MCP already configured, skipping"
    elif ! claude mcp add -s user --transport http notion https://mcp.notion.com/mcp; then
        log_error "Failed to add Claude Notion MCP server"
        return 1
    else
        log_success "Claude Notion MCP setup completed"
    fi

    # Setup REA MCP (npm:rea-agents, run from its mise shim)
    local rea_bin="$HOME/.local/share/mise/shims/rea-agents"
    local java_home="$HOME/.local/share/mise/installs/java/temurin-21"
    # Ghidra may live under mise/installs/ghidra or ~/.local/share/ghidra; use the newest one
    local ghidra
    ghidra=$(find "$HOME/.local/share/mise/installs/ghidra" "$HOME/.local/share/ghidra" -maxdepth 1 -type d -name 'ghidra_*_PUBLIC' 2>/dev/null | sort -V | tail -1 || true)

    if claude mcp get rea >/dev/null 2>&1; then
        log_info "Claude REA MCP already configured, skipping"
    elif [[ ! -x "$rea_bin" ]]; then
        log_info "rea-agents not installed by mise, skipping REA MCP setup"
    else
        local rea_env=(-e "JAVA_HOME=$java_home")
        [[ -n "$ghidra" ]] && rea_env+=(-e "GHIDRA_INSTALL_DIR=$ghidra")
        if ! claude mcp add rea -s user "${rea_env[@]}" -- "$rea_bin" mcp; then
            log_error "Failed to add Claude REA MCP server"
            return 1
        fi
        log_success "Claude REA MCP setup completed"
    fi

    # Keep REA MCP in sync in omp (~/.omp/agent/mcp.json) and agy (~/.gemini/config/mcp_config.json)
    if [[ -x "$rea_bin" ]] && command -v jq >/dev/null 2>&1; then
        local cfg tmp
        for cfg in "$HOME/.omp/agent/mcp.json" "$HOME/.gemini/config/mcp_config.json"; do
            [[ -f "$cfg" ]] || continue
            tmp=$(mktemp)
            if jq --arg cmd "$rea_bin" --arg jh "$java_home" --arg gh "$ghidra" '
                .mcpServers = (.mcpServers // {}) |
                .mcpServers.rea = (
                    (.mcpServers.rea // {})
                    | .command = $cmd
                    | .args = ["mcp"]
                    | .env = ({"JAVA_HOME": $jh} + (if $gh != "" then {"GHIDRA_INSTALL_DIR": $gh} else {} end))
                )
            ' "$cfg" > "$tmp" && mv "$tmp" "$cfg"; then
                log_info "Updated REA MCP in $cfg"
            else
                rm -f "$tmp"
            fi
        done
    fi

    # Setup Concat MCP (/Applications/Concat.app/Contents/MacOS/concat --mcp)
    local concat_bin="/Applications/Concat.app/Contents/MacOS/concat"
    if [[ -x "$concat_bin" ]]; then
        if claude mcp get concat >/dev/null 2>&1; then
            log_info "Claude Concat MCP already configured, skipping"
        else
            if claude mcp add concat -s user -- "$concat_bin" --mcp; then
                log_success "Claude Concat MCP setup completed"
            else
                log_error "Failed to add Claude Concat MCP server"
            fi
        fi
        if command -v jq >/dev/null 2>&1; then
            local cfg tmp
            for cfg in "$HOME/.omp/agent/mcp.json" "$HOME/.gemini/config/mcp_config.json"; do
                [[ -f "$cfg" ]] || continue
                tmp=$(mktemp)
                if jq --arg cmd "$concat_bin" '
                    .mcpServers = (.mcpServers // {}) |
                    .mcpServers.concat = (
                        (.mcpServers.concat // {"type": "stdio"})
                        | .command = $cmd
                        | .args = ["--mcp"]
                    )
                ' "$cfg" > "$tmp" && mv "$tmp" "$cfg"; then
                    log_info "Updated Concat MCP in $cfg"
                else
                    rm -f "$tmp"
                fi
            done
        fi
    fi

    # Setup Lark MCP (npm:@larksuiteoapi/lark-mcp, run from its mise shim)
    # Supports primary tenant ($HOME/creds/lark-app.json -> "lark") and additional
    # tenants ($HOME/creds/lark-app-<tenant>.json -> "lark-<tenant>").
    local lark_bin="$HOME/.local/share/mise/shims/lark-mcp"
    if [[ -x "$lark_bin" ]]; then
        local keytar_dir
        keytar_dir=$(find "$HOME/.local/share/mise/installs/npm-larksuiteoapi-lark-mcp" -type d -name keytar 2>/dev/null | head -1 || true)
        if [[ -n "$keytar_dir" && ! -f "$keytar_dir/build/Release/keytar.node" ]]; then
            (cd "$keytar_dir" && npm run install >/dev/null 2>&1) || true
        fi

        local cred_file srv_name suffix cfg tmp
        for cred_file in "$HOME/creds/lark-app.json" "$HOME/creds"/lark-app-*.json; do
            [[ -f "$cred_file" ]] || continue
            if [[ "$cred_file" == "$HOME/creds/lark-app.json" ]]; then
                srv_name="lark"
            else
                suffix="${cred_file#"$HOME/creds/lark-app-"}"
                suffix="${suffix%.json}"
                srv_name="lark-$suffix"
            fi

            if claude mcp get "$srv_name" >/dev/null 2>&1; then
                log_info "Claude $srv_name MCP already configured, skipping"
            elif claude mcp add "$srv_name" -s user -- "$lark_bin" mcp --config "$cred_file"; then
                log_success "Claude $srv_name MCP setup completed"
            else
                log_error "Failed to add Claude $srv_name MCP server"
            fi

            if command -v jq >/dev/null 2>&1; then
                for cfg in "$HOME/.omp/agent/mcp.json" "$HOME/.gemini/config/mcp_config.json"; do
                    [[ -f "$cfg" ]] || continue
                    tmp=$(mktemp)
                    if jq --arg srv "$srv_name" --arg cmd "$lark_bin" --arg cfile "$cred_file" '
                        .mcpServers = (.mcpServers // {}) |
                        .mcpServers[$srv] = (
                            (.mcpServers[$srv] // {"type": "stdio"})
                            | .command = $cmd
                            | .args = ["mcp", "--config", $cfile]
                        )
                    ' "$cfg" > "$tmp" && mv "$tmp" "$cfg"; then
                        log_info "Updated $srv_name MCP in $cfg"
                    else
                        rm -f "$tmp"
                    fi
                done
            fi
        done
    fi
}

setup_claude_mcp
