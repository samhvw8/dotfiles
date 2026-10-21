---
name: ship
description: "Finishes a piece of work in one pass, in the order the user names: run the project's checks, update the OKF bundle, commit, merge to main, push, deploy or release, then verify it is live and fix what the change broke. Use when the user chains finishing steps (\"update okf then commit and push\", \"deploy then test, fix if needed\", \"merge to main then deploy\", \"ship it\", \"push to prod, I'm going to sleep\") or asks whether the latest work reached production. For commit messages and splitting alone, use git-workflow."
---

# Ship

Take finished work from the working tree to verified production in one pass, so the
user doesn't have to name each step or ask afterwards whether it happened.

## Scope

Run the steps the user named, in their order. "Ship", "release" or "push to prod"
means all of them. Running the checks and verifying the deploy are always part of the
job, even when not named: they are read-only, and a deploy nobody checked is not done.
Add no other steps. The request is the approval for the steps it names. Don't ask
again between them; stop only at a failure or a hazard listed below.

## Find the project's own commands first

Read, in this order: the project's `AGENTS.md`/`CLAUDE.md`, its `.okf/` bundle (look
for a deploy, release or ops concept), `mise tasks`, then `package.json` scripts or a
`Makefile`. Use the commands the project documents (`mise run check`, `mise run deploy`,
`mise run release`) rather than guessing raw ones; the task often carries steps you
would miss (migrations, a version bump, a binary refresh). If no deploy command is
documented and the user asked to deploy, say so and stop before deploying. Don't
invent one.

## Steps

1. **Check.** Run the project's check or test task. On failure, fix it when this
   work caused it, then rerun. Never commit or deploy over red checks.
2. **OKF.** If the repo has `.okf/`, load the `okf` skill. Update the concepts the
   change affects and `log.md`, then run the validator. A change that touches nothing
   the bundle describes gets a one-line log entry or none; say which.
3. **Commit.** Follow `git-workflow`: atomic commits by concern, conventional
   messages, no attribution lines.
4. **Merge** (when asked, or when "ship" and the work is on a branch). Merge into
   `main` (fast-forward when possible). If the repo uses pull requests (a protected
   `main`, a PR template, or the project says so), open a PR instead of merging, and
   say so.
5. **Push.** A plain `git push`. Pull with rebase first if the remote moved.
6. **Deploy or release** with the project's task. Run it in the background when it is
   long, and report its milestones.
7. **Verify live.** Check what users would hit, with a real request: the URL's status
   and a marker of the new version (a version string, a changed page, the new
   endpoint), the service's logs for the first errors after the deploy (`journalctl -u`
   on 3cxo, `wrangler tail` for Workers, the platform's logs), and the local binary when
   the project installs a CLI the user runs. Use `bsk` for pages that need the
   signed-in browser.
8. **Fix forward** when verification fails because of this change: fix, rerun checks,
   commit, push, redeploy, verify again. If the failure is not from this change, or
   two fix rounds don't clear it, stop and report with the real output.
9. **Infra note.** If the deploy changed a server, service, domain or Cloudflare
   resource, update the matching concept in `~/workspace/infra/.okf` (the workspace
   `CLAUDE.md` maps each one).

## Hazards: stop and ask

- A force push, a history rewrite of a pushed branch, or `--no-verify`.
- A deploy target the project doesn't document, or one marked production when the
  user only said "deploy" in a project with several environments.
- A database migration that drops or rewrites data.
- Secrets in the diff (keys, tokens, `.env`). Unstage them and say so.

## Report

End with one table, one row per step: what ran, and the evidence (check summary, OKF
validator result, commit SHAs and subjects, push range, deploy output line, the live
check's URL and status or version). Then a single line: what is left, or "nothing
left". Write `skipped: <why>` for a step you did not run.
