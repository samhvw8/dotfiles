# Skills and Always-Loaded Files

Sources: Anthropic, *Skill authoring best practices* (platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), and Anthropic's `skill-creator` skill. Re-read the docs page when a rule here looks out of date.

## Contents
- How a skill loads
- Frontmatter
- The description
- The body
- Bundled files
- Evals and testing
- Always-loaded files (CLAUDE.md, rules, Project instructions)
- Checklist

## How a skill loads

Three levels, and each one costs tokens at a different time:
1. **Name + description:** in context in every session, for every installed skill (about 100 words each).
2. **SKILL.md body:** loaded when the skill triggers.
3. **Bundled files:** read or run only when needed. Scripts run without their code entering context.

So the description is paid for always, the body when used, and references almost never. Put detail where it is cheapest.

## Frontmatter

- `name`: at most 64 characters; lowercase letters, digits and hyphens; no leading, trailing or double hyphens; not the reserved words `anthropic` or `claude`. A gerund (`processing-pdfs`) or noun phrase (`pdf-processing`) reads well. Avoid vague names (`helper`, `utils`).
- `description`: at most 1,024 characters, not empty, no XML tags.
- Portable keys (Anthropic's validator, claude.ai and API uploads accept only these): `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`.
- Claude Code also reads its own keys (for example `argument-hint`, `disable-model-invocation`, `model`). They work in Claude Code but break a claude.ai or API upload. Use one only when the skill is Claude Code-only, and say so.

## The description

The description is how the model picks a skill out of 100 or more. It says **what the skill does and when to use it**, in third person, with the words users actually type (file types, verbs, tool names).

- Lead with what it does, then "Use when …" with concrete triggers.
- **Specific, not broad.** Claude tends to under-trigger skills, so name the cases where the user needs it but doesn't say its name ("even if they don't say 'dashboard'"). But trigger on the task, never on a whole domain: "Use when adding or changing a migration", not "Use when working with databases". A broad trigger loads the skill for work it doesn't help, and GPT-6 follows skill text so literally that a wrong load changes its behavior.
- **Short.** Every description is loaded in every session, and some harnesses cut descriptions short when many skills are installed. Keep it as short as the triggers allow (the hard limit is 1,024 characters), and spend the characters on triggers, not on what the body says.
- Name near-misses that belong to another skill when confusion is likely ("For X, use Y").
- No two descriptions should claim the same trigger. Check the other installed skills.
- All "when to use" information goes here, not in the body; the body is read only after the choice is made.

Good: `Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.`
Bad: `Helps with documents.`
Bad (too broad): `Create and validate Postgres schema migrations. Use when working with databases, queries, models, or persistence.`

## The body

- **Concise.** Assume the model knows general facts; challenge each paragraph: "does it need this, and does this justify its tokens?" Keep it under 500 lines. For a skill with several workflows, make SKILL.md a small router that says which reference serves which case.
- **Guidance, not an itinerary.** Long step-by-step recipes now hold strong models back. Keep exact steps for fragile operations only. A skill in a shared repo is read by other people's agents on other models, so don't tune it to one model's quirks.
- **Imperative, with reasons.** "Validate before writing, because a bad mapping corrupts the PDF." Reasons generalize; MUSTs don't. ALL-CAPS is a yellow flag.
- **No persona wrapper.** The running agent already has an identity. A skill is guidance it loads, so skip `<soul>`, identity and tension blocks. A one-line purpose statement is enough. Keep a domain's real tensions as plain guidance when they shape decisions.
- **Degrees of freedom.** High freedom (goals, heuristics) where many approaches work; medium (a template or pseudocode) where a pattern is preferred; low (an exact script, "run exactly this") where the operation is fragile.
- **Workflows** for multi-step tasks: numbered steps; for long ones, a checklist the model copies and ticks off.
- **Feedback loops:** run a validator, fix, repeat. The validator can be a script or a reference file to check against.
- **Templates and examples:** strict templates for parsed output, flexible ones elsewhere. Concrete input/output examples beat descriptions of style.
- **One default, with an escape hatch.** "Use pdfplumber; for scanned PDFs use pdf2image + pytesseract." Not a menu of five libraries.
- **One term per concept** throughout.
- **No time-sensitive text** ("before August 2025 …"). Put superseded methods in an "Old patterns" section.
- **MCP tools by full name** (`Server:tool_name`, or the harness's `mcp__server__tool` form).
- **Don't assume packages are installed**; say what to install.

## Bundled files

- `references/` for docs loaded on demand; `scripts/` for code that runs; `assets/` for files used in output.
- Link every reference **directly from SKILL.md** (one level deep). The model may only preview a file reached through another file.
- Give a reference over 100 lines a table of contents at the top.
- Name files by content (`form-validation-rules.md`, not `doc2.md`). Use forward slashes.
- Organize by domain or variant when a skill covers several (`references/aws.md`, `gcp.md`) so only the relevant one loads.
- Point to bundled files relative to the skill folder (`scripts/collect.sh`; in Claude Code, `${CLAUDE_SKILL_DIR}/scripts/collect.sh`), never a hardcoded install path: skills get installed in different places.
- Prefer a script for deterministic work. Say whether to **run** it or **read** it. Scripts handle their own errors and explain their constants.
- Plan, validate, execute: for batch or destructive changes, have the model write a plan file, check it with a script, then apply it.

## Evals and testing

- **Evals first.** Before writing much, run the model on 2–3 realistic tasks without the skill, note what it gets wrong, and write the skill to fix that.
- Save them as `evals/evals.json` (`skill_name`, and per eval: `id`, `prompt`, `expected_output`, `assertions`). The prompts should read like real user messages: casual, specific, with context.
- **Run with and without:** for a new skill, the baseline is no skill; for an update, a snapshot of the old version. Launch both in the same turn in subagents. Compare by assertions, and by a blind comparison when quality is subjective (skill-creator's `agents/comparator.md`).
- **Judge strength:** a script judges only what it measures directly (the validator passes, a bundled script's tests run). A keyword or count is a proxy, not a judge. Everything else goes to a blind LLM judge on the strongest model available; show each pair in both orders and count a verdict only when both agree, which also limits self-preference when judge and writer are the same model. Repeat samples (3 or more per arm) before calling a close result. Say which results came from which judge.
- **Validate:** run skill-creator's `scripts/quick_validate.py <skill-dir>` (from the skill-creator folder; needs `pyyaml`).
- **Read the transcripts**, not only the outputs: cut parts that make the model waste steps, and bundle a script when every run writes the same helper.
- **Test on every model** the skill will run on: Haiku may need more detail; Opus is hurt by over-explaining.
- **Triggering:** for skills used widely, test the description with should-trigger and near-miss should-not-trigger queries (skill-creator's `run_loop.py`, Claude Code only).

## Always-loaded files (CLAUDE.md, rules, Project instructions)

These load in every session, so every line costs tokens every turn.
- Keep only rules that change behavior and that the model would not follow by default. Delete stale rules.
- Each rule: one imperative line, plus the reason when it isn't obvious.
- Move detail into a skill or reference that loads on demand, and leave a pointer.
- **Point to docs by context.** "Use architecture.md for service boundaries, database.md for schema changes", not "read architecture.md, database.md and deployment.md before every edit". The second burns context on a typo fix.
- **Authorize safe routines.** Name a workflow that is safe to run without asking ("the local tests use disposable fixtures: run them, fix failures from the change, rerun"). Delete old "always ask" lines a newer model would take too seriously.
- **Two layers** when several models or harnesses read the repo (AGENTS.md for Codex, CLAUDE.md for Claude Code, GEMINI.md): project facts and hard limits in one shared file, and enforceable limits in hooks or deny rules, not prose; the behavior contract per model, in the file that model's harness reads.
- Project instructions on claude.ai have no file references: inline what the work needs, or put long material in project knowledge files.

## Checklist

- [ ] Name and description pass the validator; the description says what and when, triggers on the task not the domain, and stays short
- [ ] Only portable frontmatter keys, unless the skill is Claude Code-only by choice
- [ ] Body under 500 lines, imperative, reasons given, no persona wrapper
- [ ] Freedom matches fragility; fragile steps are exact or scripted
- [ ] References one level deep, with a table of contents when over 100 lines
- [ ] One term per concept; no time-sensitive text
- [ ] Evals written, run against a baseline, and the skill beat it
