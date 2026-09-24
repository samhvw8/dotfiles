#!/bin/bash

# =============================================================================
# Migrate a machine from the old chezmoi setup of this repository to mise.
#
# Run it from the chezmoi source directory's own git, without merging anything:
#   git -C ~/.local/share/chezmoi fetch origin
#   bash <(git -C ~/.local/share/chezmoi show origin/master:migrate-from-chezmoi.sh) --dry-run
#   bash <(git -C ~/.local/share/chezmoi show origin/master:migrate-from-chezmoi.sh) --keep-local
#
# Steps: back up the chezmoi repository and every file it manages, find files
# edited on this machine that differ from the repository, reuse chezmoi's
# answers (git identity, minimal install), run setup.sh, then move the chezmoi
# directories aside so `chezmoi apply` can no longer overwrite the links.
# =============================================================================

set -euo pipefail

REPO_URL="https://github.com/samhvw8/dotfiles.git"
DOTFILES_DIR="$HOME/.dotfiles"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.dotfiles-backup-$TIMESTAMP"

DRY_RUN=false
KEEP_LOCAL=false

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[0;33m[WARN]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_usage() {
    cat <<'USAGE'
Usage: migrate-from-chezmoi.sh [--dry-run] [--keep-local]
  -n, --dry-run     Report what differs and what would happen; change nothing
  -k, --keep-local  Merge this machine's edits into ~/.dotfiles (uncommitted) for review
  -h, --help        Show this help
USAGE
    exit 0
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--dry-run) DRY_RUN=true; shift ;;
        -k|--keep-local) KEEP_LOCAL=true; shift ;;
        -h|--help) print_usage ;;
        *) log_error "Unknown option: $1"; exit 1 ;;
    esac
done

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# chezmoi was a mise tool in the old setup; fall back to running it via mise.
chezmoi_cmd() {
    if command_exists chezmoi; then
        chezmoi "$@"
    else
        mise exec chezmoi@latest -- chezmoi "$@"
    fi
}

# -----------------------------------------------------------------------------
# Inspect the old setup
# -----------------------------------------------------------------------------

export PATH="$HOME/.local/bin:$PATH"

SRC="$HOME/.local/share/chezmoi"
if [[ ! -d "$SRC/.git" ]]; then
    if [[ -L "$HOME/.config/mise/config.toml" && "$(readlink "$HOME/.config/mise/config.toml")" == "$DOTFILES_DIR/"* ]]; then
        log_success "This machine is already migrated to mise dotfiles."
        exit 0
    fi
    log_error "No chezmoi source directory at $SRC; nothing to migrate. For a new machine run setup.sh."
    exit 1
fi

GIT_NAME="$(chezmoi_cmd execute-template '{{ .name }}' 2>/dev/null || true)"
GIT_EMAIL="$(chezmoi_cmd execute-template '{{ .email }}' 2>/dev/null || true)"
MINIMAL="$(chezmoi_cmd execute-template '{{ .minimal | default false }}' 2>/dev/null || echo false)"
[[ "$MINIMAL" == "true" ]] || MINIMAL=false

# Clone the new repository from the same remote the chezmoi repository uses.
REPO_URL="$(git -C "$SRC" remote get-url origin 2>/dev/null || echo "$REPO_URL")"
# The last commit this machine shared with the remote. After `git fetch`, @{u}
# already points at the new layout, so compare against this instead.
BASE="$(git -C "$SRC" merge-base HEAD '@{u}' 2>/dev/null || true)"
if [[ -n "$BASE" ]]; then
    UNPUSHED="$(git -C "$SRC" rev-list --count "$BASE..HEAD")"
else
    UNPUSHED="unknown"
fi
STASHES="$(git -C "$SRC" stash list 2>/dev/null | wc -l | tr -d ' ')"

log_info "chezmoi source: $SRC (unpushed commits: $UNPUSHED, stashes: $STASHES)"
log_info "git identity: ${GIT_NAME:-<none>} <${GIT_EMAIL:-none}>, minimal install: $MINIMAL"

# The new repository, to compare against. A dry run clones into a temp dir.
REPO="$DOTFILES_DIR"
if [[ ! -d "$DOTFILES_DIR/.git" ]]; then
    if $DRY_RUN; then
        REPO="$(mktemp -d)/dotfiles"
        git clone -q "$REPO_URL" "$REPO"
    else
        log_info "Cloning $REPO_URL into $DOTFILES_DIR..."
        git clone -q "$REPO_URL" "$DOTFILES_DIR"
    fi
fi

# -----------------------------------------------------------------------------
# Find files edited on this machine
# -----------------------------------------------------------------------------

# Where a chezmoi-managed path lives in the new repository ("" = handled elsewhere).
repo_path_for() {
    case "$1" in
        .gitconfig|.claude|README.md|setup.sh|Brewfile.setup|bak.chezmoiexternal.toml) echo "" ;;
        .config/mise/config.toml|.config/mise/minimal.config.toml) echo "" ;;
        .config/mise/config.toml.setup|.config/mise/config.toml.setup.minimal) echo "" ;;
        .zshrc) if [[ "$MINIMAL" == "true" ]]; then echo "home/.zshrc_minimal"; else echo "home/.zshrc"; fi ;;
        *) echo "home/$1" ;;
    esac
}

same_content() {
    local live=$1 repo=$2
    if [[ -L "$live" ]]; then
        [[ "$(readlink "$live")" == "$repo" ]] && return 0
        [[ -L "$repo" && "$(readlink "$live")" == "$(readlink "$repo")" ]] && return 0
        return 1
    fi
    [[ -f "$repo" && ! -L "$repo" ]] && cmp -s "$live" "$repo"
}

# Files this machine changed that may not be in the repository: edited after the
# last `chezmoi apply` (first status column), or changed in the chezmoi repo
# but never pushed. Files that merely lag behind the repository are left out.
changed_targets() {
    chezmoi_cmd status 2>/dev/null | awk 'substr($0, 1, 1) != " " { print substr($0, 4) }'
    if [[ -n "$BASE" ]]; then
        git -C "$SRC" diff --name-only "$BASE" | while IFS= read -r f; do
            chezmoi_cmd target-path "$SRC/$f" 2>/dev/null | sed "s|^$HOME/||"
        done
    else
        log_warn "chezmoi repository has no upstream; comparing every managed file" >&2
        chezmoi_cmd managed --include=files,symlinks --path-style=relative
    fi
}

DRIFT=()
while IFS= read -r rel; do
    rp="$(repo_path_for "$rel")"
    [[ -n "$rp" ]] || continue
    live="$HOME/$rel"
    [[ -e "$live" || -L "$live" ]] || continue
    same_content "$live" "$REPO/$rp" && continue
    DRIFT+=("$rel|$rp")
done < <(changed_targets | sort -u)

# mise tools added on this machine with `mise use -g`.
tool_keys() {
    awk '/^\[tools\]/{f=1; next} /^\[/{f=0} f && /=/{sub(/[ \t]*=.*/, ""); print}' "$1" 2>/dev/null | sort -u
}
LIVE_MISE="$HOME/.config/mise/config.toml"
REPO_MISE="$REPO/mise/config.toml"
[[ "$MINIMAL" == "true" ]] && REPO_MISE="$REPO/mise/minimal.toml"
EXTRA_TOOLS=()
if [[ -f "$LIVE_MISE" && ! -L "$LIVE_MISE" ]]; then
    # chezmoi is dropped on purpose, so it is not reported.
    while IFS= read -r t; do EXTRA_TOOLS+=("$t"); done < <(comm -23 <(tool_keys "$LIVE_MISE") <(tool_keys "$REPO_MISE") | grep -v '^chezmoi$')
fi

if [[ ${#DRIFT[@]} -eq 0 ]]; then
    log_info "No managed file differs from the repository."
else
    log_warn "${#DRIFT[@]} file(s) on this machine differ from the repository:"
    for d in ${DRIFT[@]+"${DRIFT[@]}"}; do echo "    ~/${d%%|*}"; done
fi
if [[ ${#EXTRA_TOOLS[@]} -gt 0 ]]; then
    log_warn "mise tools on this machine that the repository does not list: ${EXTRA_TOOLS[*]-}"
    log_info "They will be kept in ~/.config/mise/config.local.toml, which stays on this machine."
fi

if $DRY_RUN; then
    log_info "Dry run: nothing changed. Run without --dry-run to migrate."
    exit 0
fi

# -----------------------------------------------------------------------------
# Back up
# -----------------------------------------------------------------------------

mkdir -p "$BACKUP_DIR" && chmod 700 "$BACKUP_DIR"
git -C "$SRC" bundle create -q "$BACKUP_DIR/chezmoi-repo.bundle" --all
( cd "$HOME" && chezmoi_cmd managed --include=files,symlinks --path-style=relative > "$BACKUP_DIR/managed-files.txt"
  tar -czf "$BACKUP_DIR/live-files.tar.gz" --no-recursion -T "$BACKUP_DIR/managed-files.txt" 2>/dev/null || true
  if [[ -f .gitconfig ]]; then cp -p .gitconfig "$BACKUP_DIR/gitconfig"; fi
  if [[ -d .config/mise ]]; then tar -czf "$BACKUP_DIR/config-mise.tar.gz" .config/mise; fi )
for d in ${DRIFT[@]+"${DRIFT[@]}"}; do
    rel="${d%%|*}"
    mkdir -p "$BACKUP_DIR/differs/$(dirname "$rel")"
    cp -a "$HOME/$rel" "$BACKUP_DIR/differs/$rel"
done
log_success "Backed up the chezmoi repository and live files to $BACKUP_DIR (keep it private: it may hold API keys)"

# Apply this machine's edits on top of the repository's file with a three-way
# merge: base = the file as last pushed to the chezmoi repo, so changes made
# elsewhere since then are kept. Without a base the machine's file is copied.
keep_local_file() {
    local rel=$1 rp=$2 base src_path merged rc=0
    local live="$HOME/$rel" dest="$DOTFILES_DIR/$rp"
    base="$(mktemp)"; merged="$(mktemp)"
    src_path="$(chezmoi_cmd source-path "$live" 2>/dev/null || true)"
    if [[ -n "$BASE" && -n "$src_path" && -f "$dest" && ! -L "$live" && ! -L "$dest" ]] \
        && git -C "$SRC" show "$BASE:${src_path#"$SRC"/}" > "$base" 2>/dev/null; then
        git merge-file -p -L repository -L chezmoi-pushed -L this-machine "$dest" "$base" "$live" > "$merged" || rc=$?
        if (( rc == 0 )); then
            cat "$merged" > "$dest"
        else
            # The file goes live as a link, so conflict markers must not land in it.
            cp "$merged" "$BACKUP_DIR/differs/$rel.merged"
            log_warn "$HOME/$rel conflicts with the repository; kept the repository version. Merge by hand from $BACKUP_DIR/differs/$rel.merged"
        fi
    else
        mkdir -p "$(dirname "$dest")"
        cp -a "$live" "$dest"
    fi
    rm -f "$base" "$merged"
}

if $KEEP_LOCAL; then
    for d in ${DRIFT[@]+"${DRIFT[@]}"}; do
        keep_local_file "${d%%|*}" "${d#*|}"
    done
    [[ ${#DRIFT[@]} -gt 0 ]] && log_info "Merged this machine's edits into $DOTFILES_DIR; review with: git -C $DOTFILES_DIR diff"
fi

# -----------------------------------------------------------------------------
# Tools only this machine had: once ~/.config/mise/config.toml links to the
# repository they would drop off PATH, so keep them in config.local.toml, which
# stays on this machine. Each line is copied as is, version options included.
# -----------------------------------------------------------------------------

keep_extra_tools() {
    local local_cfg="$HOME/.config/mise/config.local.toml" lines
    lines="$(KEYS="$(printf '%s\n' "${EXTRA_TOOLS[@]}")" awk '
        BEGIN { n = split(ENVIRON["KEYS"], k, "\n"); for (i = 1; i <= n; i++) want[k[i]] = 1 }
        /^\[tools\]/ { f = 1; next }
        /^\[/ { f = 0 }
        f && /=/ { key = $0; sub(/[ \t]*=.*/, "", key); if (key in want) print }' "$LIVE_MISE")"
    [[ -n "$lines" ]] || return 0
    mkdir -p "$(dirname "$local_cfg")"
    if grep -q '^\[tools\]' "$local_cfg" 2>/dev/null; then
        LINES="$lines" awk '{ print } /^\[tools\]/ && !done { print ENVIRON["LINES"]; done = 1 }' "$local_cfg" > "$local_cfg.tmp"
        mv "$local_cfg.tmp" "$local_cfg"
    else
        printf '\n# Tools only this machine uses (kept by migrate-from-chezmoi.sh)\n[tools]\n%s\n' "$lines" >> "$local_cfg"
    fi
    log_success "Kept this machine's own tools in $local_cfg: ${EXTRA_TOOLS[*]-}"
}

if [[ ${#EXTRA_TOOLS[@]} -gt 0 ]]; then
    keep_extra_tools
fi

# -----------------------------------------------------------------------------
# ~/.gitconfig: chezmoi merged plain [user] and [include] entries into it; mise
# manages the same values as marked blocks, so remove the chezmoi copies.
# -----------------------------------------------------------------------------

if [[ -f "$HOME/.gitconfig" ]] && ! grep -q '>>> mise:identity >>>' "$HOME/.gitconfig"; then
    git config --file "$HOME/.gitconfig" --unset-all user.name 2>/dev/null || true
    git config --file "$HOME/.gitconfig" --unset-all user.email 2>/dev/null || true
    git config --file "$HOME/.gitconfig" --unset-all include.path '^~/\.base\.gitconfig$' 2>/dev/null || true
fi

# -----------------------------------------------------------------------------
# Set up with mise
# -----------------------------------------------------------------------------

setup_args=()
[[ "$MINIMAL" == "true" ]] && setup_args+=(--minimal)
export DOTFILES_GIT_NAME="$GIT_NAME" DOTFILES_GIT_EMAIL="$GIT_EMAIL"
if ! bash "$DOTFILES_DIR/setup.sh" ${setup_args[@]+"${setup_args[@]}"}; then
    if [[ -f "$BACKUP_DIR/gitconfig" ]]; then
        cp -p "$BACKUP_DIR/gitconfig" "$HOME/.gitconfig"
    fi
    log_error "setup.sh failed; restored ~/.gitconfig and left chezmoi in place. Fix the error and run this script again."
    exit 1
fi

# -----------------------------------------------------------------------------
# Retire chezmoi without deleting anything
# -----------------------------------------------------------------------------

mv "$SRC" "$SRC.migrated-$TIMESTAMP"
[[ -d "$HOME/.config/chezmoi" ]] && mv "$HOME/.config/chezmoi" "$HOME/.config/chezmoi.migrated-$TIMESTAMP"
log_success "Moved the chezmoi source and config aside (*.migrated-$TIMESTAMP)."

if mise dot status --missing >/dev/null 2>&1; then
    log_success "Migration complete: every dotfile is linked."
else
    log_warn "mise dot status reports files that are not applied; run: mise dot status"
fi

echo
[[ "$UNPUSHED" != "0" ]] && log_warn "The chezmoi repository had $UNPUSHED unpushed commit(s); they are in $BACKUP_DIR/chezmoi-repo.bundle."
if [[ ${#DRIFT[@]} -gt 0 ]] && ! $KEEP_LOCAL; then
    log_info "This machine's differing files are in $BACKUP_DIR/differs/. Compare with:"
    log_info "  diff -ru $BACKUP_DIR/differs $DOTFILES_DIR/home"
    log_info "To keep one: copy it over the link target in $DOTFILES_DIR/home, then: mise run dot:save"
fi
if [[ ${#EXTRA_TOOLS[@]} -gt 0 ]]; then
    log_info "Tools only this machine had are in ~/.config/mise/config.local.toml; move one to the repository with: mise use -g <tool>"
fi
log_info "Remove chezmoi later with: rm -rf $SRC.migrated-$TIMESTAMP ~/.config/chezmoi.migrated-$TIMESTAMP"
