# Update Log

## 2026-09-24
* **Update**: [Dotfile tasks](/tools/dot-tasks.md) covers the new `dot:cd`, `dot:status`, `dot:diff`, `dot:update`, `dot:rm` and `dot:destroy` tasks, with a chezmoi command map.
* **Update**: The default branch is now `main` (the old chezmoi-era `main` is kept as `backup/main-20250615`; `master` still exists). Repository links point at `main`, and [dotfile tasks](/tools/dot-tasks.md) and [everyday changes](/workflows/everyday-changes.md) cover the new `dot:pull` task.
* **Update**: Rewrote [shell setup](/tools/shell.md) and [zsh startup choices](/decisions/zsh-startup.md) for the plugin cleanup (annexes, OMZ, forgit, zsh-completions and you-should-use removed; completions generated per tool version) and the new startup measurements (0.247s to 0.177s).
* **Creation**: Added [Switch zsh plugins and zi to the forks, or roll back](/workflows/zsh-plugin-forks.md), covering the samhvw8 forks of fzf-tab, F-Sy-H, zsh-autosuggestions and zi.
* **Creation**: Wrote the Dotfiles bundle: [overview](/overview.md), architecture, workflows, decisions and tools concepts, derived from the repository files and the chezmoi-to-mise migration (2026-09-17 to 2026-09-24).
