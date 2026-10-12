---
type: Decision
title: "mise replaces Homebrew"
description: "Why macOS packages and apps are installed by mise's own brew and brew-cask managers, and why zerobrew and nanobrew were rejected."
tags: [decision, mise, homebrew, macos, packages]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-10-08T15:00:00Z }
stale_after: 2027-04-08
sources:
  - id: conf
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
  - id: mise-brew
    resource: https://github.com/jdx/mise/blob/main/docs/bootstrap/packages/brew.md
    title: mise docs, Homebrew formulae (brew)
  - id: mise-cask
    resource: https://github.com/jdx/mise/blob/main/docs/bootstrap/packages/brew-cask.md
    title: mise docs, Homebrew casks (brew-cask)
  - id: zerobrew
    resource: https://github.com/zerobrewhq/zerobrew
    title: zerobrew (v0.4.0, read 2026-10-08)
  - id: nanobrew
    resource: https://github.com/justrach/nanobrew
    title: nanobrew (v0.1.212, read 2026-10-08)
---

# Context (2026-10-08)

The goal was a faster Homebrew. Two fast clients were evaluated first:

| | Formulae | Casks | Notes |
|---|---|---|---|
| zerobrew 0.4.0 | homebrew-core only | only casks with a `binary` artifact; `migrate` skips casks and tap formulae[^zerobrew] | its README advises running it alongside Homebrew |
| nanobrew 0.1.212 | yes, taps too | top 100 natively, the rest fall back to Homebrew; no upgrades for dmg or pkg casks[^nanobrew] | skips `com.apple.quarantine` (no Gatekeeper check), telemetry on by default |

Both would add a second package list (a Brewfile) and a bootstrap hook, and
neither removes Homebrew for every cask on this machine.

mise was already a native Homebrew client: `[bootstrap.packages]` installed the
`brew:` and `brew-cask:` entries without running `brew`.[^mise-brew]

# Decision

mise is the only macOS package manager. Homebrew is not installed.[^conf]

* Formulae and casks are `brew:` and `brew-cask:` entries in
  `mise/conf.d/dotfiles.toml`. mise installs them into the standard
  `/opt/homebrew` prefix, creating it with sudo on a new machine.
* `.zprofile` and `.profile` put `/opt/homebrew/bin` on `PATH` with static
  lines; there is no `brew shellenv`.
* `[bootstrap.brew] adopt = true`, so an app already in `/Applications` is
  taken over instead of replaced.

# Consequences

* Upgrades: `mise bootstrap packages upgrade`. Self-updating apps are left to
  their own updater.[^mise-cask]
* A cask that Homebrew installed stays Homebrew-owned: mise counts it as
  installed but never upgrades it.[^mise-cask] To hand one over, remove its
  `Caskroom/<cask>` folder and run `mise bootstrap packages apply brew-cask:<cask>`.
  Adoption fails when the app differs from the cask's current version; then
  move the app away and let mise install it.
* Replacing an app bundle can drop its macOS privacy permissions
  (Accessibility, Full Disk Access, Screen Recording).
* pkg casks and casks that link into `/usr/local/bin` (macfuse,
  docker-desktop) need sudo with a terminal.
* Revisit when zerobrew or nanobrew installs every cask natively and keeps
  Gatekeeper; until then neither saves a running cost.

[^conf]: Shared dotfiles config
[^mise-brew]: mise docs, Homebrew formulae (brew)
[^mise-cask]: mise docs, Homebrew casks (brew-cask)
[^zerobrew]: zerobrew (v0.4.0, read 2026-10-08)
[^nanobrew]: nanobrew (v0.1.212, read 2026-10-08)
