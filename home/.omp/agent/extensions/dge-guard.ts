/**
 * dge-guard — carries the one part of the Claude session-start rulebook that omp
 * did not already have, and fires it on state instead of on schedule.
 *
 * Content comes from ~/.ccp/hub/hooks/session-start/scripts/session-start.sh
 * (`<dge_loop>`): commit to an action, spend at most a few reads on it, then
 * execute — plus the names for when that fails. Everything else in that heredoc
 * (skills 1% rule, agent decision tree, research protocol, sub-agent prompt
 * format) is already loaded into every omp session as AGENTS.md / rules/*.md, and
 * re-injecting it would be a second source of truth that drifts — which is exactly
 * how the Claude copy came to teach `RECOMMENDED SKILLS:` after the rule file had
 * moved to `SUGGESTED TOOLS` / `SUGGESTED SKILLS`. It is also 1,285 tokens,
 * re-injected on every resume.
 *
 * Silence is the common case: nothing is injected at session start, ever, and a
 * nudge costs ~60 tokens only when a run has actually spent the read budget.
 *
 * Three behaviours here were measured in a live `omp -p` session rather than
 * assumed, and each contradicts the obvious reading of the docs:
 *
 *   1. `turn_start` fires per agent *step*, not per user turn. Resetting the
 *      budget there (the first version of this file) capped it at one step's
 *      parallel batch and silently missed the stall it exists to catch — reads
 *      spread one per step across a run.
 *   2. `deliverAs: "aside"` did not reach the model. The nudge was accepted, no
 *      error was raised, and the model reported seeing nothing. `"steer"` lands.
 *   3. `session_stop` is the per-request reset (it fires when the main session
 *      settles); `input` did not fire in print mode.
 *
 * Known limitation, accepted: counters are per-process, and extension instances
 * are shared across the sessions in that process, so a subagent's reads count
 * against the same budget. The cost is a nudge arriving at a slightly wrong
 * moment. It can never block anything — see the send below.
 */
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

// Tools whose output informs a decision that was already committed to. Past the
// budget, the read *is* the decision — the stall the loop names.
const READ_TOOLS: Record<string, true> = {
	read: true,
	grep: true,
	glob: true,
	lsp: true,
	web_search: true,
	fetch_page: true,
	batch_fetch: true,
	map_site: true,
};

// MCP tools reach the model as a `write` to an `xd://` device path, not as their
// own tool name, so they are classified from that path — and never counted as a
// mutation, or one codegraph call would reset the budget it spends reads on.
const READ_DEVICE = /xd:\/\/(?:mcp__)?(?:codegraph|sem|parallax)_/;

// Producing something ends the budget and starts the next one.
const ACTION_TOOLS: Record<string, true> = {
	edit: true,
	write: true,
	ast_edit: true,
	apply_patch: true,
};

const BUDGET = 3;

type Kind = "read" | "action" | "neutral";

function classify(toolName: string, input: Record<string, unknown> | undefined): Kind {
	if (toolName === "write") {
		const p = typeof input?.path === "string" ? input.path : "";
		// proc:// writes (kill, stdin) steer a running job; they produce nothing.
		if (p.startsWith("proc://")) return "neutral";
		if (!p.startsWith("xd://")) return "action";
		return READ_DEVICE.test(p) ? "read" : "neutral";
	}
	if (READ_TOOLS[toolName]) return "read";
	if (ACTION_TOOLS[toolName]) return "action";
	// bash, task, todo, hub, eval, ask, debug and everything else: neither. A
	// shell command may read or may build, and guessing wrong either hides a stall
	// or invents one.
	return "neutral";
}

const note = (n: number) => `<dge_check reads="${n}">
${n} consecutive reads this turn, nothing produced yet. DGE: you committed to an action — execute it now.
Still reading? Say what the next read settles and what you do with it. Anti-patterns this catches: "one more file to be sure"; deciding X and quietly doing Y.
</dge_check>`;

export default function dgeGuard(pi: ExtensionAPI) {
	let reads = 0;
	// Latched until the run settles. The rule is "say why", not "obey" — nagging on
	// every further read would cost more than the stall it is watching for.
	let noted = false;

	const reset = () => {
		reads = 0;
		noted = false;
	};

	pi.on("session_start", reset);
	pi.on("session_stop", reset);

	pi.on("tool_call", async event => {
		const kind = classify(event.toolName, event.input);
		if (kind === "action") {
			reset();
			return;
		}
		if (kind !== "read") return;

		reads += 1;
		if (reads <= BUDGET || noted) return;
		noted = true;

		// A throw here fails the tool call closed, so the send is contained: this
		// extension may lose its nudge, it may never block work.
		try {
			pi.sendMessage(note(reads), { deliverAs: "steer" });
		} catch (err) {
			try {
				pi.logger?.warn?.(`dge-guard: could not deliver nudge: ${String(err)}`);
			} catch {
				/* logger shape is not guaranteed; the nudge is the only stake */
			}
		}
	});
}
