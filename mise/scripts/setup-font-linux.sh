#!/bin/bash

# =============================================================================
# FiraCode Nerd Font on Linux (full install, mise bootstrap post-tools hook)
# =============================================================================

set -euo pipefail

[[ "$(uname -s)" == "Linux" ]] || exit 0

font_path="$HOME/.fonts/FiraCode Nerd Font Mono.ttf"
[[ -f "$font_path" ]] && exit 0

mkdir -p "$HOME/.fonts"
wget -O "$font_path" https://github.com/ryanoasis/nerd-fonts/raw/refs/heads/master/patched-fonts/FiraCode/Regular/FiraCodeNerdFont-Regular.ttf
fc-cache -f -v
