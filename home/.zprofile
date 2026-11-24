# Keep only the first occurrence of each PATH entry.
typeset -U path PATH

export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin

# The Homebrew prefix first, so mise's shims land ahead of its python3/kubectl.
# mise installs brew packages there; Homebrew itself is not installed.
if [[ $(uname) == "Darwin" ]]; then
    export HOMEBREW_PREFIX=/opt/homebrew
    path=(/opt/homebrew/bin /opt/homebrew/sbin $path)
    fpath=(/opt/homebrew/share/zsh/site-functions $fpath)
fi

# Inside ~/.dotfiles, mise would also load mise/config.toml as a project config,
# which outranks ~/.config/mise/config.local.toml and undoes machine-local tool
# overrides (such as the ccline fork build). Load it only as the global config.
# mise reads this setting only from the environment, not from a config file.
export MISE_IGNORED_CONFIG_PATHS="$HOME/.dotfiles/mise"

if [ -f "$HOME/.local/bin/mise" ]; then
    eval "$($HOME/.local/bin/mise activate zsh --shims)"
fi
