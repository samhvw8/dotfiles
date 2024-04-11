setup_folder() {
    mkdir -p $HOME/.local/bin
    mkdir -p $HOME/.local/share
    mkdir -p $HOME/.local/state
    mkdir -p $HOME/.local/run
    mkdir -p $HOME/.bin
    mkdir -p $HOME/.config
    mkdir -p $HOME/bin
    mkdir -p $HOME/tmp
    chmod 0700 "${XDG_RUNTIME_DIR}"

    export XDG_CONFIG_HOME="${HOME}/.config"
    export XDG_CACHE_HOME="${HOME}/.cache"
    export XDG_DATA_HOME="${HOME}/.local/share"
    export XDG_STATE_HOME="${HOME}/.local/state"
    export XDG_RUNTIME_DIR="${HOME}/.local/run"

    export ZSH_DATA_DIR="${XDG_DATA_HOME}/zsh"
    export ZSH_CACHE_DIR="${XDG_CACHE_HOME}/zsh"
    export ZSH_COMPDUMP="${ZSH_CACHE_DIR}/zcompdump"

    mkdir -p "${ZSH_CACHE_DIR}"{,/completions}
    mkdir -p "${ZSH_DATA_DIR}"
}

setup_dotbare() {
    git clone https://github.com/kazhala/dotbare.git ~/.dotbare
    export PATH=$PATH:$HOME/.dotbare
    dotbare finit -u https://github.com/samhvw8/dotfiles.git
    source ~/.profile
}

setup_gitconfig() {
    echo '[include]' | tee -a ~/.gitconfig &&
        echo 'path = ~/.base.gitconfig' | tee -a ~/.gitconfig
}

setup_font_linux() {
    mkdir -p $HOME/.fonts
    wget -O "$HOME/.fonts/FiraCode Nerd Font Mono.tff" https://git.io/JznfU &&
        fc-cache -f -v
}

setup_fzf() {
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf &&
        ~/.fzf/install
}

setup_tpm() {
    git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
}

setup_miniconda() {
    if [[ $(uname) == "Darwin" ]]; then
        brew install miniconda
    else
        wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh &&
            bash ~/miniconda.sh -b -p $HOME/miniconda3
    fi
}

setup_mise() {
    curl https://mise.run | sh &&
        mise install
}

set -x

if [[ $(uname) == "Darwin" ]]; then
    echo "Macos"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval $(/opt/homebrew/bin/brew shellenv)
else
    echo "Linux"
fi

setup_folder

setup_dotbare

rm $HOME/.config/mise/config.toml
cp $HOME/.config/mise/config.toml.setup $HOME/.config/mise/config.toml
cp $HOME/.zshrc.setup $HOME/.zshrc

if [[ $(uname) == "Darwin" ]]; then
    brew bundle install
else
    :
fi

setup_miniconda

setup_gitconfig

if [[ $(uname) == "Darwin" ]]; then
    :
else
    setup_font_linux
fi

setup_mise

setup_fzf

setup_tpm

if [[ $(uname) == "Darwin" ]]; then
    if [[ $(uname -m) == "arm64" ]]; then
        softwareupdate --install-rosetta --agree-to-license
    fi
else
    chsh -s $(which zsh) $USER
fi
