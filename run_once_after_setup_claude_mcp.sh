#!/bin/bash

# =============================================================================
# Claude MCP Server Setup
# Runs once after install_dependencies.sh
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

    # Setup grep MCP
    if claude mcp list 2>/dev/null | grep -q "grep"; then
        log_info "Claude grep MCP already configured, skipping"
    elif ! claude mcp add -s user --transport http grep https://mcp.grep.app; then
        log_error "Failed to add Claude grep MCP server"
        return 1
    else
        log_success "Claude grep MCP setup completed"
    fi

    # Setup Notion MCP
    if claude mcp list 2>/dev/null | grep -q "notion"; then
        log_info "Claude Notion MCP already configured, skipping"
    elif ! claude mcp add -s user --transport http notion https://mcp.notion.com/mcp; then
        log_error "Failed to add Claude Notion MCP server"
        return 1
    else
        log_success "Claude Notion MCP setup completed"
    fi
}

setup_claude_mcp
