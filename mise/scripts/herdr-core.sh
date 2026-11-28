#!/bin/bash

# =============================================================================
# herdr-core (hc) install or upgrade (`mise run herdr-core:install`)
# Not a mise tool: hc is a long-running core. Its own installer puts it at one
# stable path as a signed "Herdr Core.app" (macOS privacy grants stay with it),
# and `hc update` swaps the binary while running terminals keep running. A mise
# install would change the path on every version and could prune the folder a
# running core uses. There are no GitHub releases to track either.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

if command -v hc >/dev/null 2>&1 && [[ -x "$(command -v hc)" ]]; then
    log_info "Upgrading $(hc --version)"
    hc update
else
    installer=$(mktemp)
    trap 'rm -f "$installer"' EXIT
    # The installer checks the download's sha256 and, on macOS, Herdr's code signature.
    curl -fsSL https://releases.herdr.dev/core/install.sh -o "$installer"
    sh "$installer"
fi

hc --version
