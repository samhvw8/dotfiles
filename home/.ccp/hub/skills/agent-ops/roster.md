# Roster

The only file that names models. Briefs and skills name a role (`roles.md`); this table turns the
role into a launch command. Pass the harness as the first argument and the command as
`--command "<value>"` on `harness-ops spawn` or `harness-ops task new`. Why each model won, and the
test runs behind it: `roster-evidence.md` (read it only for a roster check).

| Role | Harness | `--command` | Fallback (other quota, then no agy) |
|---|---|---|---|
| `director` | the lead session | None: never launched | — |
| `peer` | `claude` | None: leave `--command` out (the lead's model). If the lead runs another harness, use that harness. | — |
| `other-family` | `agy` | `agy --model gemini-4-hydrogen-medium` (`-high` for a debate opponent) | `omp --model opencode-go/glm-5.3` |
| `fast` | `agy` | `agy --model gemini-3.8-flash-medium` | `claude --model haiku`, `agy --model gemini-4-hydrogen-low`, then `omp --model opencode-go/glm-5.3-flash` |
| `builder` | `agy` | `agy --model gemini-4-neon-medium` | `claude --model opus`. Floor (never lower): `claude --model sonnet` or `agy --model gemini-4-hydrogen-medium`. No Haiku, Flash or omp flash models. |
| `brain` | `claude` | `claude --model opus --effort high` | `agy --model gemini-4-neon-high` (other quota). For a second family, use `other-family` |
| `advisor` | `claude` | `claude --model opus --effort medium` | `agy --model gemini-4-neon-medium` |
| `deep` | `claude` | `claude --model fable --effort low` (`--effort medium` for the hardest calls) | `agy --model gemini-4-carbon-low` (or `-medium`) |
| `open-panel` | `omp` | One member per model: `omp --model opencode-go/kimi-k3`, `omp --model opencode-go/glm-5.3`, `omp --model opencode-go/qwen4-max` | — |

The superagent receptionist is the session that runs superagent mode, in any harness, and is never
launched (`superagent.md`).

## agy members

- **Prerequisite: `command(harness-ops)` in the `permissions.allow` list of
  `~/.gemini/antigravity-cli/settings.json`.** Check it before you use an agy role:
  `grep -F 'command(harness-ops)' ~/.gemini/antigravity-cli/settings.json`. Without it, agy's
  auto-mode reviewer asks a person before every `harness-ops send`: use a `claude` or `omp` member
  for the role and tell the user. The user adds the rule (agy's "always allow ... persist" option);
  never add it yourself. With it, each harness-ops call runs twice (it fails in the sandbox, then the
  retry runs outside it): slower, but no prompt.
- **Trusted folders.** agy trusts exact folders only (`trustedWorkspaces` in the same file): your
  home folder, not its subfolders. Start agy members with `--cwd ~` and give them absolute paths
  (board, brief, inputs, outputs).

## Roster check

When a model changes (a new release, a retired ID, an edited omp preset), update its row here, run
the checks in `roster-evidence.md`, and log the result there.
