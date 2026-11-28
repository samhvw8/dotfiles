# Roster evidence

Why each `roster.md` row holds its model, and how to re-check a row. Read it only for a roster check.

## Results

| Role | Test | Result |
|---|---|---|
| `director` | — | Claude Fable when the lead runs it. |
| `other-family` | Planted-drift check, 2026-11-15 | Hydrogen medium (24 s), Hydrogen high (32 s), Carbon medium (49 s) and Carbon high (152 s) all marked the drift and the schema miss. Hydrogen medium is fastest. |
| `fast` | Timing job, 2026-11-15 (one run each, all passed the brief) | Flash medium 16 s, Hydrogen low 19 s, Hydrogen medium 27 s, omp `glm-5.3-flash` 27 s, omp `deepseek-v4.1-flash` 55 s. |
| `builder` | Coding job, 2026-11-18 (two runs each; pass = the hidden tests pass and only the named file changed; all passed) | Sonnet 36/38 s, Haiku 46/49 s, agy Flash medium 61/70 s, omp `glm-5.3-flash` 73/78 s, omp `deepseek-v4.1-flash` 337/275 s. Haiku is within 10 s of Sonnet at a twentieth of its price. |
| `brain` | Review job, 2026-11-18 (two runs each, two diffs with planted bugs and drift) | Opus high, Fable, Sonnet, Haiku, agy Hydrogen high and omp GLM-5.3 all found every planted defect, so the check does not separate them. Opus high (35–63 s) also found the deeper eviction flaw in both runs and ran the code to confirm. Fable (54–77 s) matched it, slower. |
| `advisor`, `deep` | Not tested yet | Chosen by tier: medium-effort strong model, and a heavy model for rare escalations. |
| `open-panel` | First-token wait, 2026-11-18 | DeepSeek skipped: on OpenCode Go one call per run waited 158–223 s for its first token. IDs come from the `deep` and `spread` presets under `modelPresets` in `~/.omp/agent/config.yml`; omp has no preset flag. |

Not tested on any role: Argon, and `gemini-pro-orchestrator-*`.

## Checks

Run these before the next live run after a model change, then add a row above:

1. **Planted-drift round:** a swarm round in which one worker's brief tells it to break one line of
   its card. The `other-family` manager must mark that draft `drifted`.
2. **Timing job:** the same small card on each `fast` candidate. The winner is the fastest one whose
   draft the manager marks `followed`.
3. **For `builder` and `brain`:** the coding card and the review cards in
   `~/workspace/tools/thinking-skills/evals/roster-check/` (its README has the commands). `builder`
   is the cheapest candidate that passes the hidden tests in both runs at a speed close to the fastest.
   `brain` is the candidate that finds the planted defects, and goes deepest, in both runs.
