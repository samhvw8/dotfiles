alias dotbare="$HOME/.dotbare/dotbare"
export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
if [[ $(uname) == "Darwin" ]]; then
    eval $(/opt/homebrew/bin/brew shellenv)
else
    :
fi

if [[ "$TERM_PROGRAM" == "vscode" ]]; then
    if [ -f "$HOME/.local/bin/mise" ]; then 
        eval "$($HOME/.local/bin/mise activate zsh)"
    fi
else
    if [ -f "$HOME/.local/bin/mise" ]; then 
        eval "$($HOME/.local/bin/mise activate zsh)"
    fi
fi



if [ -f "$HOME/.zshrc" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.zshrc"
fi

# Added by Toolbox App
export PATH="$PATH:$HOME/.local/share/JetBrains/Toolbox/scripts"


# Added by OrbStack: command-line tools and integration
source ~/.orbstack/shell/init.zsh 2>/dev/null || :



