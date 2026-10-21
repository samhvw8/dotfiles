/**
 * okf-stop — omp port of the Claude Code Stop hook in ~/.ccp/hub/hooks/okf-stop.
 * Catches work that changed a repo with an `.okf/` bundle without touching the
 * bundle since its latest bundle change, and asks for one more turn to update it.
 *
 * Runs the hub script itself, so the change detection has one source of truth.
 * The script reads a Claude Code transcript for the session start time and the
 * paths tool calls touched, and each tool call's start/result window; this keeps a
 * minimal one in that shape.
 *
 * omp's session_stop is Claude Code's Stop hook: main session only, and a
 * `{ decision: "block", reason }` result keeps the agent working.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SCRIPT = path.join(os.homedir(), ".ccp/profiles/default/hooks/okf-stop/scripts/okf-stop.sh");

export default function okfStop(pi: ExtensionAPI) {
	if (!fs.existsSync(SCRIPT)) return;

	let session = "";
	let transcript = "";
	const append = (line: unknown) => {
		try {
			fs.appendFileSync(transcript, `${JSON.stringify(line)}\n`);
		} catch {
			/* a lost path only narrows the check; never block the tool */
		}
	};

	pi.on("session_start", async () => {
		session = `omp-${randomUUID()}`;
		transcript = path.join(os.tmpdir(), `okf-stop-${session}.jsonl`);
		append({ timestamp: new Date().toISOString() });
	});

	pi.on("tool_call", async event => {
		if (!transcript) return;
		const { path: p, file_path, command, async: bg, run_in_background } = (event.input ?? {}) as Record<string, unknown>;
		append({
			type: "assistant",
			timestamp: new Date().toISOString(),
			message: {
				content: [
					{
						type: "tool_use",
						id: event.toolCallId,
						input: { path: p, file_path, command, run_in_background: Boolean(bg || run_in_background) },
					},
				],
			},
		});
	});

	pi.on("tool_result", async event => {
		if (!transcript) return;
		append({
			type: "user",
			timestamp: new Date().toISOString(),
			message: { content: [{ type: "tool_result", tool_use_id: event.toolCallId }] },
		});
	});

	pi.on("session_stop", async (event, ctx) => {
		if (!session) return;
		const run = spawnSync("bash", [SCRIPT], {
			input: JSON.stringify({
				stop_hook_active: Boolean(event.stop_hook_active),
				session_id: session,
				transcript_path: transcript,
				cwd: ctx.cwd,
			}),
			encoding: "utf8",
			timeout: 10_000,
		});
		let reason: string | undefined;
		try {
			const out = JSON.parse(run.stdout || "{}");
			if (out.decision === "block") reason = out.reason;
		} catch {
			return;
		}
		if (!reason) return;
		// The script records what it reported per repo, so it blocks again only for newer changes.
		return { decision: "block" as const, reason };
	});

	pi.on("session_shutdown", async () => {
		if (transcript) fs.rmSync(transcript, { force: true });
	});
}
