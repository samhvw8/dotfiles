setup_folder() {
    mkdir -p $HOME/.local/bin
    mkdir -p $HOME/.bin
    mkdir -p $HOME/bin
    mkdir -p $HOME/tmp
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

setup_dbus_wsl2() {
    sudo dbus-uuidgen --ensure
}

setup_font_linux() {
    mkdir -p $HOME/.fonts

    wget -O "$HOME/.fonts/FiraCode Nerd Font Mono.tff" https://git.io/JznfU &&
        fc-cache -f -v
}

setup_go() {
    asdf plugin-add golang https://github.com/kennyp/asdf-golang.git
    asdf install golang 1.18.1
    asdf global golang 1.18.1
}

setup_fzf() {
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf &&
        ~/.fzf/install
}

setup_bazel_linux() {

    sudo wget -O "/usr/local/bin/bazelisk" https://github.com/bazelbuild/bazelisk/releases/download/v1.10.1/bazelisk-linux-amd64 &&
        sudo chmod +x "/usr/local/bin/bazelisk" &&
        echo "#\!/usr/bin/env bash" | sudo tee -a /usr/local/bin/bazel &&
        echo 'export JAVA_HOME=$HOME/.sdkman/candidates/java/current' | sudo tee -a /usr/local/bin/bazel &&
        echo '/usr/local/bin/bazelisk "$@"' | sudo tee -a /usr/local/bin/bazel &&
        sudo chmod +x /usr/local/bin/bazel
}

setup_helm() {
    asdf plugin-add helm https://github.com/Antiarchitect/asdf-helm.git
    asdf install helm 2.15.1
    asdf install helm 3.8.0
    asdf global helm 3.8.0
}

setup_skaffold() {
    asdf plugin add skaffold https://github.com/nklmilojevic/asdf-skaffold.git
    asdf install skaffold 1.14.0
    asdf global skaffold 1.14.0
}

setup_kubectl() {
    asdf plugin add kubectl https://github.com/Banno/asdf-kubectl.git
    asdf install kubectl 1.21.6
    asdf global kubectl 1.21.6
}

setup_k9s() {
    curl -sS https://webinstall.dev/k9s | bash
}

setup_tpm() {
    git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
}

setup_nodejs() {
    asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
    asdf install nodejs lts-fermium
    asdf global nodejs lts-fermium
}

setup_sdkman() {
    curl -s "https://get.sdkman.io" | bash
}

setup_rust() {
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y &&
        cargo install --locked git-branchless
}

pip_install_dep() {
    pip install inquirer click pathlib pyyaml airspeed google-cloud-firestore
}

setup_krew() {
    asdf plugin add krew https://github.com/jimmidyson/asdf-krew.git
    asdf install krew 0.4.2
    asdf global krew 0.4.2
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

setup_minikube() {
    if [[ $(uname) == "Darwin" ]]; then
        brew install minikube
    else
        curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb &&
            sudo dpkg -i minikube_latest_amd64.deb
    fi
}

setup_asdf() {
    git clone https://github.com/asdf-vm/asdf.git ~/.asdf
    . $HOME/.asdf/asdf.sh
}

setup_direnv() {
    asdf plugin-add direnv
    asdf direnv setup --shell zsh --version latest
}

setup_gcloud() {
    asdf plugin add gcloud https://github.com/jthegedus/asdf-gcloud
    asdf install gcloud latest
    asdf global gcloud latest
}

set -x

if [[ $(uname) == "Darwin" ]]; then
    echo "Macos"

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval $(/opt/homebrew/bin/brew shellenv)
else
    echo "Linux"
    sudo apt update &&
        sudo apt-get install --yes tmux vim git zsh wget curl net-tools unzip zip python3-pip aptitude apt-transport-https gnupg ca-certificates curl software-properties-common build-essential terminator
fi

setup_folder

setup_dotbare

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
    setup_dbus_wsl2
    setup_font_linux
fi

setup_asdf

setup_go

setup_fzf

if [[ $(uname) == "Darwin" ]]; then
    :
else
    setup_bazel_linux
fi

setup_gcloud

setup_helm

setup_skaffold

setup_kubectl

setup_k9s

setup_tpm

setup_nodejs

setup_sdkman

setup_rust

pip_install_dep

setup_krew

setup_minikube

setup_direnv

if [[ $(uname) == "Darwin" ]]; then
    if [[ $(uname -m) == "arm64" ]]; then
        softwareupdate --install-rosetta --agree-to-license
    fi
else
    chsh -s $(which zsh) $USER
fi

zsh
