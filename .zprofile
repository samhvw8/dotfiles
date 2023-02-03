alias dotbare="$HOME/.dotbare/dotbare"
export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
if [[ $(uname) == "Darwin" ]]; then
    eval $(/opt/homebrew/bin/brew shellenv)
else
    :
fi

if [ -f "$HOME/.zshrc" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.zshrc"
fi

# Added by Toolbox App
export PATH="$PATH:/home/samhv/.local/share/JetBrains/Toolbox/scripts"

