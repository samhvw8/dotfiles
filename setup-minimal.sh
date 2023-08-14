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
    
    
    export ZDOTDIR="${XDG_CONFIG_HOME}/zsh"
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

setup_go() {
    rtx plugin add golang
    rtx install golang 1.20.2
    rtx global golang 1.20.2
}

setup_fzf() {
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf &&
    ~/.fzf/install
}

setup_helm() {
    rtx plugin add helm
    rtx install helm 2.15.1
    rtx install helm 3.8.0
    rtx global helm 3.8.0
}

setup_kubectl() {
    rtx plugin add kubectl
    rtx install kubectl 1.21.6
    rtx global kubectl 1.21.6
}


setup_k9s() {
    rtx plugin add k9s
    rtx install k9s 0.26.3
    rtx global k9s 0.26.3
}

setup_nodejs() {
    rtx plugin add nodejs
    rtx install nodejs lts-fermium
    rtx global nodejs lts-fermium
}

setup_sdkman() {
    curl -s "https://get.sdkman.io" | bash
}

setup_rust() {
    rtx plugin add rust
    rtx install rust 1.66.1
    rtx global rust 1.66.1
}

setup_krew() {
    rtx plugin add krew
    rtx install krew 0.4.2
    rtx global krew 0.4.2
    kubectl krew install ctx
}

setup_miniconda() {
    if [[ $(uname) == "Darwin" ]]; then
        brew install miniconda
    else
        wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh &&
        bash ~/miniconda.sh -b -p $HOME/miniconda3
    fi
}

setup_rtx() {
    curl https://rtx.pub/install.sh | sh
}

setup_gcloud() {
    rtx plugin add gcloud
    rtx install gcloud 417.0.1
    rtx global gcloud 417.0.1
    gcloud components install gke-gcloud-auth-plugin
}

setup_debget() {
    curl -sL https://raw.githubusercontent.com/wimpysworld/deb-get/main/deb-get | sudo -E bash -s install deb-get
}

set -x

if [[ $(uname) == "Darwin" ]]; then
    echo "Macos"
    
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval $(/opt/homebrew/bin/brew shellenv)
else
    echo "Linux"
    sudo apt update
    sudo apt-get install --yes tmux vim git zsh wget curl net-tools unzip zip python3-pip aptitude apt-transport-https gnupg ca-certificates curl software-properties-common build-essential terminator
    setup_debget
fi

setup_folder

setup_dotbare

rm $HOME/.tool-versions
cp $HOME/.tool-versions.setup $HOME/.tool-versions

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

setup_rtx

setup_go

setup_fzf

setup_kubectl

setup_gcloud

setup_helm

setup_k9s

setup_nodejs

setup_sdkman

setup_rust

setup_krew

if [[ $(uname) == "Darwin" ]]; then
    if [[ $(uname -m) == "arm64" ]]; then
        softwareupdate --install-rosetta --agree-to-license
    fi
else
    chsh -s $(which zsh) $USER
fi

zsh
