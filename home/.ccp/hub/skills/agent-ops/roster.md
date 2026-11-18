# Roster

The only file that names models. Briefs and skills name a role (`roles.md`, ## Roles); this table
turns the role into a launch command. Pass the harness as the first argument and the command as
`--command "<value>"` on `harness-ops spawn` or `harness-ops task new`.

| Role | Harness | `--command` | Notes |
|---|---|---|---|
| `director` | `claude` | None: the lead session itself | Claude Fable when the lead runs it. |
| `peer` | `claude` | None: leave `--command` out | Same model as the lead. If the lead runs another harness, use that harness with no `--command`. |
| `other-family` | `agy` | `agy --model gemini-4-hydrogen-medium` | Manager, opponent, blind reviewer. Planted-drift check 2026-11-15: all of Hydrogen medium (24 s), Hydrogen high (32 s), Carbon medium (49 s), Carbon high (152 s) marked the drift and the schema miss; Hydrogen medium is fastest. Use `-high` for a debate opponent. Without agy: `omp --model opencode-go/glm-5.3`. agy rules below. |
| `fast` | `agy` | `agy --model gemini-3.8-flash-medium` | Timing job 2026-11-15 (one run each, all passed the brief): Flash medium 16 s, Hydrogen low 19 s, Hydrogen medium 27 s, omp `glm-5.3-flash` 27 s, omp `deepseek-v4.1-flash` 55 s. Backup: `agy --model gemini-4-hydrogen-low`. Without agy: `omp --model opencode-go/glm-5.3-flash`. |
| `builder` | `claude` | `claude --model haiku` | Coding timing job 2026-11-18 (two runs each; pass = the hidden tests pass and only the named file changed; all passed): Claude Sonnet 36/38 s, Haiku 46/49 s, agy Flash medium 61/70 s, omp `glm-5.3-flash` 73/78 s, omp `deepseek-v4.1-flash` 337/275 s. Haiku is within 10 s of Sonnet at a twentieth of its price. On another quota: `agy --model gemini-3.8-flash-medium`. Without Claude or agy: `omp --model opencode-go/glm-5.3-flash`. |
| `brain` | `claude` | `claude --model opus --effort high` | Review job 2026-11-18 (two runs each, two diffs with planted bugs and drift): Opus high, Fable, Sonnet, Haiku, agy Hydrogen high and omp GLM-5.3 all found every planted defect, so the check does not separate them. Opus high (35–63 s) also found the deeper eviction flaw in both runs and ran the code to confirm; Fable (54–77 s) matched it, slower. For a second family, use `other-family`. |
| `open-panel` | `omp` | One member per model: `omp --model opencode-go/kimi-k3`, `omp --model opencode-go/glm-5.3`, `omp --model opencode-go/qwen4-max` | omp has no preset flag. These IDs come from the `deep` and `spread` presets under `modelPresets` in `~/.omp/agent/config.yml`. DeepSeek is skipped since 2026-11-18: on OpenCode Go one call per run waited 158–223 s for its first token. | |

## agy members

- **Prerequisite: agy members need `command(harness-ops)` in the `permissions.allow` list of
  `~/.gemini/antigravity-cli/settings.json`.** Check with
  `grep -F 'command(harness-ops)' ~/.gemini/antigravity-cli/settings.json` before using agy roles.
  With the rule, a member in auto mode runs each harness-ops call twice (it fails in the sandbox,
  then the retry outside it runs without review): slower, but no prompt. Without it, the auto-mode
  reviewer asks a person before every `harness-ops send` to a session agy did not start. Tested
  2026-11-15: a session-only `--settings` file does not apply `permissions.allow`, and
  `read_file`/`write_file` rules do not open the iTerm2 socket inside the sandbox; only the global
  rule works. Sam adds it (agy's "always allow ... persist" option writes it); never add it yourself.
  Without it, use a `claude` or `omp` member for the role and tell Sam.
- **Trusted folders.** agy trusts exact folders only (`trustedWorkspaces` in
  `~/.gemini/antigravity-cli/settings.json`). `/Users/samhv` is trusted; its subfolders are not.
  Start agy members with `--cwd ~` and give them absolute paths (board, brief, inputs, outputs).

## Roster check

When a model changes (a new release, a retired ID, an edited omp preset), update its line here,
then rerun two checks before the next live run:

1. **One planted-drift round:** a swarm round in which one worker's brief tells it to break one line
   of its card. The `other-family` manager must mark that draft `drifted`.
2. **One timing job:** the same small card on each `fast` candidate. The winner is the fastest one
   whose draft the manager marks `followed`. Write the result in the Notes column.
3. **For `builder` and `brain`:** the coding card and the review cards in
   `~/workspace/tools/thinking-skills/evals/roster-check/` (its README has the commands). `builder` is
   the cheapest candidate that passes the hidden tests in both runs at a speed close to the fastest;
   `brain` is the candidate that finds the planted defects, and goes deepest, in both runs.
