/**
 * codegraph-remind — omp adapter for the Claude Code PreToolUse hook in
 * ~/.ccp/hub/hooks/codegraph-remind.
 *
 * Hooks `tool_execution_start` on `grep` / `bash` and delegates to the hub
 * script as the single source of truth. Non-blocking: any reminder is steered
 * via `pi.sendMessage(..., { deliverAs: "steer" })` and failures are swallowed.
 */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SCRIPT = path.join(
	os.homedir(),
	".ccp/profiles/default/hooks/codegraph-remind/scripts/codegraph-remind.sh",
);

const TOOL_MAP: Record<string, string> = {
	grep: "Grep",
	bash: "Bash",
};

export default function codegraphRemind(pi: ExtensionAPI) {
	if (!fs.existsSync(SCRIPT)) return;

	pi.on("tool_execution_start", async (event, ctx) => {
		const mapped = TOOL_MAP[event.toolName];
		if (!mapped) return;

		const run = spawnSync("bash", [SCRIPT], {
			input: JSON.stringify({
				tool_name: mapped,
				tool_input: (event.args ?? {}) as Record<string, unknown>,
				cwd: ctx.cwd,
			}),
			encoding: "utf8",
			timeout: 5_000,
		});
		if (run.status !== 0 || !run.stdout) return;

		let context: string | undefined;
		try {
			context = JSON.parse(run.stdout)?.hookSpecificOutput?.additionalContext;
		} catch {
			return;
		}
		if (!context) return;

		try {
			pi.sendMessage(context, { deliverAs: "steer" });
		} catch {
			/* never block tool execution */
		}
	});
}
