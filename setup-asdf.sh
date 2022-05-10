set -x;

mkdir -p ~/workspace

cd ~/workspace

git clone https://github.com/danhper/asdf-exec.git

cd asdf-exec

go build

cp asdf-exec $HOME/.asdf/bin/private

sed -i.bak -e 's|exec $(asdf_dir)/bin/asdf exec|exec $(asdf_dir)/bin/private/asdf-exec|' $HOME/.asdf/lib/commands/reshim.bash && \
rm ~/.asdf/shims/* && \
asdf reshim