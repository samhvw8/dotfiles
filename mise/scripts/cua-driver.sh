#!/bin/bash

# =============================================================================
# cua-driver install or upgrade (macOS, `mise run cua:install`)
# Not a mise tool: `cua-driver mcp` relaunches itself with
# `open -a CuaDriver`, so the app must live at /Applications/CuaDriver.app, and
# trycua/cua releases many products from one repo, so mise cannot resolve the
# latest driver version. The release's own installer handles both.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

if [[ "$(uname -s)" != "Darwin" ]]; then
    log_info "cua-driver setup is macOS-only here; skipping"
    exit 0
fi

if command -v cua-driver >/dev/null 2>&1; then
    log_info "Upgrading $(cua-driver --version)"
    cua-driver update --apply
else
    # Latest driver release. Every release here is flagged prerelease, so filter
    # by tag; nightly tags carry a "nightly-" prefix.
    tag=$(curl -fsSL "https://api.github.com/repos/trycua/cua/releases?per_page=100" \
        | jq -r '[.[] | select(.tag_name | startswith("cua-driver-rs-v"))][0].tag_name')
    if [[ -z "$tag" || "$tag" == "null" ]]; then
        echo "could not find a cua-driver-rs release on trycua/cua" >&2
        exit 1
    fi
    log_info "Installing cua-driver ${tag#cua-driver-rs-v}"
    installer=$(mktemp)
    trap 'rm -f "$installer"' EXIT
    curl -fsSL "https://github.com/trycua/cua/releases/download/$tag/_install-rust.sh" -o "$installer"
    CUA_DRIVER_RS_VERSION="${tag#cua-driver-rs-v}" CUA_DRIVER_RS_TELEMETRY_ENABLED=0 \
        /bin/bash "$installer" --no-modify-path
fi

cua-driver telemetry disable >/dev/null
cua-driver --version

if command -v claude >/dev/null 2>&1 && ! claude mcp get cua-computer-use >/dev/null 2>&1; then
    claude mcp add-json --scope user cua-computer-use \
        "{\"command\":\"$HOME/.local/bin/cua-driver\",\"args\":[\"mcp\"]}"
    log_info "Registered the cua-computer-use MCP server with Claude Code"
fi

cua-driver permissions status || true
log_info "If a permission is not granted, run: cua-driver permissions grant"
