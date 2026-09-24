---
type: Playbook
title: "Switch zsh plugins and zi to the forks, or roll back"
description: "How the shell runs patched forks of fzf-tab, F-Sy-H, zsh-autosuggestions and zi, how to switch to them, roll back to upstream, and retire the forks once the PRs merge."
tags: [zsh, zi, forks, rollback]
status: draft
stale_after: 2026-12-31
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T09:00:00Z }
sources:
  - id: zshrc
    resource: https://github.com/samhvw8/dotfiles/blob/main/home/.zshrc
    title: .zshrc
  - id: oss-bundle
    resource: ~/workspace/oss/zsh/.okf/index.md
    title: zsh forks knowledge bundle (patches, tests, PR plan)
---

# What runs where

The patches themselves (what each commit does, how it was measured and
tested, upstream PR plan) are documented in the forks' own bundle.[^oss-bundle]

| Component | Upstream | Fork, branch | Source clone | Loaded from |
|-----------|----------|--------------|--------------|-------------|
| fzf-tab | Aloxaf/fzf-tab | samhvw8/fzf-tab, `perf` | `~/workspace/oss/zsh/fzf-tab` | zi: `ver"perf" samhvw8/fzf-tab` → `~/.zi/plugins/samhvw8---fzf-tab` |
| F-Sy-H | z-shell/F-Sy-H | samhvw8/F-Sy-H, `perf` | `~/workspace/oss/zsh/F-Sy-H` | zi: `ver"perf" samhvw8/F-Sy-H` → `~/.zi/plugins/samhvw8---F-Sy-H` |
| zsh-autosuggestions | zsh-users/zsh-autosuggestions | samhvw8/zsh-autosuggestions, `perf` | `~/workspace/oss/zsh/zsh-autosuggestions` | zi: `ver"perf" samhvw8/zsh-autosuggestions` |
| zi | z-shell/zi | samhvw8/zi, `perf` (based on upstream `next`) | `~/workspace/oss/zsh/zi` | `~/.zi/bin` checked out on local branch `perf` tracking remote `sam` |

The three plugins are switched in `.zshrc` (the block marked `TEMP`).[^zshrc]
zi is switched in its own git clone, because `.zshrc` only sources
`~/.zi/bin/zi.zsh`.

# Switch to the forks

Plugins: in `.zshrc`, load `samhvw8/<repo>` with `ver"perf"` (already the case).
Then `exec zsh`; zi clones the fork on first use.

zi:

```sh
git -C ~/.zi/bin remote add sam https://github.com/samhvw8/zi
git -C ~/.zi/bin fetch sam perf
git -C ~/.zi/bin switch -c perf --track sam/perf
zsh -fc 'zcompile ~/.zi/bin/zi.zsh'   # otherwise zsh ignores the stale .zwc
```

Pull new commits pushed to a fork: `zi update samhvw8/<repo>` for a plugin;
`git -C ~/.zi/bin pull && zsh -fc 'zcompile ~/.zi/bin/zi.zsh'` for zi.

# Roll back to upstream

Plugins: in the `TEMP` block of `.zshrc`, replace `ver"perf" samhvw8/fzf-tab`,
`ver"perf" samhvw8/F-Sy-H` and `ver"perf" samhvw8/zsh-autosuggestions` with
`Aloxaf/fzf-tab`, `z-shell/F-Sy-H` and `zsh-users/zsh-autosuggestions`, keeping
their other ices, then `exec zsh`. The upstream fzf-tab and
zsh-autosuggestions clones are still in `~/.zi/plugins`; F-Sy-H's is kept under
its old repository name, so use `z-shell/fast-syntax-highlighting` (GitHub
redirects it to F-Sy-H) to reuse that clone, or `z-shell/F-Sy-H` to clone
afresh. Keep
`ZSH_AUTOSUGGEST_STRATEGY=(history)`; it is useful without the fork too.

zi:

```sh
git -C ~/.zi/bin switch main
git -C ~/.zi/bin branch -D perf
git -C ~/.zi/bin remote remove sam
zsh -fc 'zcompile ~/.zi/bin/zi.zsh'
```

Whole shell config: `git -C ~/.dotfiles diff home/.zshrc` shows the change;
`git -C ~/.dotfiles checkout <commit> -- home/.zshrc` restores an earlier one.

# Caveats while on the forks

* `zi self-update` always fast-forwards `main` from `origin`. On the `perf`
  branch it reports nothing to do, and errors once upstream `main` moves past
  it. Rebase the fork's `perf` instead, or roll back first.
* `ZI[VERSION]` is empty until `zi version` runs (the zi patch computes it
  lazily).
* F-Sy-H keeps resolved command types until the next command runs, so a binary
  installed from another terminal shows as unknown until you press Enter.

# Retire the forks

After a PR merges upstream, roll that component back as above; once all are
upstream, delete the `TEMP` comment and this playbook's `draft` status.

[^zshrc]: .zshrc
[^oss-bundle]: zsh forks knowledge bundle (patches, tests, PR plan)
