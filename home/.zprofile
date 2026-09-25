# Keep only the first occurrence of each PATH entry.
typeset -U path PATH

export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin

# brew first, so mise's shims land ahead of Homebrew's python3/kubectl.
if [[ $(uname) == "Darwin" ]]; then
    eval $(/opt/homebrew/bin/brew shellenv)
fi

if [ -f "$HOME/.local/bin/mise" ]; then
    eval "$($HOME/.local/bin/mise activate zsh --shims)"
fi
