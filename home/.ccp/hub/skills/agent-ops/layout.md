# agent-ops: where a new agent opens

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Where a new agent opens

An agent whose job is unrelated to your current project (another repo or tool, such as fixing termctl while
you run a speech experiment) opens in its own tab: pass `--where tab`. Sam keeps one tab per project.

Otherwise leave `--where` out. Its default, `auto`, puts the agent where Sam looks for it:

- A split in your tab, whatever folder the agent works in, up to 12 panes. The largest pane is cut
  along its long side and the panes are resized evenly, so the tab fills as a grid.
- Your tab full: a split in a tab of an agent you started, then a new tab right after yours.

Set `--cwd` to the folder the agent will work in; it no longer changes where the agent opens. Pass
`--where tab|split|window` (on `spawn`, `task new` and `task review`) only when Sam asks for a layout, or
`--where tab` for unrelated work (above).

To regroup agents that are already open, use `move`, `pull`, `swap` or `arrange`. Never close and
respawn them for this: a move keeps the program, its PID, label and task. Regroup only when Sam asks.
A busy agent may be moved; your own pane may not. A tab is `self`, `tab-of:<pane>`, or the TAB ID from
`ls` (not a position). tmux, iTerm2 (3.7+) and Rex do all four; Rex moves only inside one Rex
session. Herdr refuses with exit 1 and changes nothing.
