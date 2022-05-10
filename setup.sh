setup_folder () {
    mkdir -p $HOME/.local/bin
    mkdir -p $HOME/.bin
    mkdir -p $HOME/bin 
    mkdir -p $HOME/tmp
}

setup_dotbare () {
    git clone https://github.com/kazhala/dotbare.git ~/.dotbare  
    export PATH=$PATH:$HOME/.dotbare 
    dotbare finit -u  https://github.com/samhvw8/dotfiles.git
    source ~/.profile 
}

setup_gitconfig () {
    echo '[include]' | tee -a ~/.gitconfig && \
    echo 'path = ~/.base.gitconfig' | tee -a ~/.gitconfig 
}

setup_dbus_wsl2 () {
    sudo dbus-uuidgen --ensure
}

setup_font_linux () {
    mkdir -p $HOME/.fonts 

    wget -O  "$HOME/.fonts/FiraCode Nerd Font Mono.tff" https://git.io/JznfU  && \

    fc-cache -f -v 
}

setup_go_linux () {
    wget -c https://dl.google.com/go/go1.18.1.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
}

setup_fzf () {
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && \

    ~/.fzf/install 
}

setup_bazel_linux () {

    sudo wget -O "/usr/local/bin/bazelisk" https://github.com/bazelbuild/bazelisk/releases/download/v1.10.1/bazelisk-linux-amd64 && \

    sudo chmod +x "/usr/local/bin/bazelisk"  && \
    
    echo  "#\!/usr/bin/env bash" | sudo tee -a /usr/local/bin/bazel && \

    echo 'export JAVA_HOME=$HOME/.sdkman/candidates/java/current' | sudo tee -a /usr/local/bin/bazel && \

    echo '/usr/local/bin/bazelisk "$@"' | sudo tee -a /usr/local/bin/bazel && \

    sudo chmod +x /usr/local/bin/bazel
}

setup_helm_linux () {
    wget -O "$HOME/tmp/helmenv.tar.gz" https://github.com/little-angry-clouds/kubernetes-binaries-managers/releases/download/0.3.1/helmenv-linux-amd64.tar.gz && \

    tar -xvf "$HOME/tmp/helmenv.tar.gz"  --directory $HOME/tmp && \

    chmod +x $HOME/tmp/helmenv-linux-amd64 && \

    chmod +x $HOME/tmp/helm-wrapper-linux-amd64 && \

    mv $HOME/tmp/helmenv-linux-amd64 $HOME/.local/bin/helmenv &&  \

    mv $HOME/tmp/helm-wrapper-linux-amd64 $HOME/.local/bin/helm &&  \

    helmenv install 2.15.1
    helmenv install 3.8.0
    helmenv use 2.15.1
}

setup_skaffold_linux () {
    curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/v1.14.0/skaffold-linux-amd64 && \ 
    chmod +x skaffold && \
    sudo mv skaffold /usr/local/bin
}

setup_kubectl_linux () {
    wget -O "$HOME/tmp/kbenv.tar.gz" https://github.com/little-angry-clouds/kubernetes-binaries-managers/releases/download/0.3.1/kbenv-linux-amd64.tar.gz && \
    tar -xvf "$HOME/tmp/kbenv.tar.gz"  --directory $HOME/tmp && \
    
    chmod +x $HOME/tmp/kbenv-linux-amd64  && \
    chmod +x $HOME/tmp/kubectl-wrapper-linux-amd64  && \

    mv $HOME/tmp/kbenv-linux-amd64 $HOME/.local/bin/kbenv && \
    mv $HOME/tmp/kubectl-wrapper-linux-amd64 $HOME/.local/bin/kubectl && \
    
    kbenv install 1.21.6 && \
    kbenv use 1.21.6 
}

setup_k9s () {
    curl -sS https://webinstall.dev/k9s | bash 
}

setup_tpm () {
    git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm 
}

setup_nvm () {
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash 
}

setup_sdkman () {
    curl -s "https://get.sdkman.io" | bash 
}

setup_rust () {
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y  && \
    cargo install --locked git-branchless 
}

pip_install_dep () {
    pip install inquirer click pathlib pyyaml airspeed google-cloud-firestore 
}

setup_krew_linux () {
    cd "$(mktemp -d)" && \
    OS="$(uname | tr '[:upper:]' '[:lower:]')" && \
    ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" && \
    KREW="krew-${OS}_${ARCH}" && \
    curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" && \
    tar zxvf "${KREW}.tar.gz" && \
    ./"${KREW}" install krew  && \
    kubectl krew install ctx 
}

setup_miniconda_linux () {

    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \

    bash ~/miniconda.sh -b -p $HOME/miniconda3 

}

setup_minikube_linux () {
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb && \

    sudo dpkg -i minikube_latest_amd64.deb 
}

if [[ `uname` == "Darwin" ]] 
then
    echo "Macos"
else
    echo "Linux"

    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list  && \

    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \

    set -x;

    setup_folder

    sudo apt update && \
    sudo apt-get install --yes tmux vim git zsh wget curl net-tools unzip zip python3-pip aptitude apt-transport-https gnupg google-cloud-sdk ca-certificates curl software-properties-common build-essential terminator  && \

    setup_dotbare

    setup_gitconfig

    setup_dbus_wsl2

    setup_font_linux

    setup_go_linux

    setup_fzf

    setup_bazel_linux

    setup_helm_linux

    setup_skaffold_linux

    setup_kubectl_linux

    setup_k9s

    setup_tpm

    setup_nvm

    setup_sdkman

    setup_rust

    pip_install_dep

    setup_krew_linux

    setup_minikube_linux

    setup_miniconda_linux
    
    chsh -s $(which zsh) $USER
fi
