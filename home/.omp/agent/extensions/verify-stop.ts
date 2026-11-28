/**
 * verify-stop — omp port of the Claude Code Stop hook in ~/.ccp/hub/hooks/verify-stop.
 * Catches code or UI changes made during this session that were not followed by
 * a test/verify run (or a visual check for UI files), and blocks stop once per
 * change set.
 *
 * Delegates to the hub shell script so change detection and verification checks
 * have one source of truth.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SCRIPT_CANDIDATES = [
	path.join(os.homedir(), ".ccp/profiles/default/hooks/verify-stop/scripts/verify-stop.sh"),
	path.join(os.homedir(), ".dotfiles/home/.ccp/hub/hooks/verify-stop/scripts/verify-stop.sh"),
];

export default function verifyStop(pi: ExtensionAPI) {
	const script = SCRIPT_CANDIDATES.find(p => fs.existsSync(p));
	if (!script) return;

	let session = "";
	let transcript = "";
	let lastAssistantMessage = "";

	const append = (line: unknown) => {
		try {
			fs.appendFileSync(transcript, `${JSON.stringify(line)}\n`);
		} catch {
			/* a lost path only narrows the check; never block the tool */
		}
	};

	pi.on("session_start", async () => {
		session = `omp-${randomUUID()}`;
		transcript = path.join(os.tmpdir(), `verify-stop-${session}.jsonl`);
		lastAssistantMessage = "";
		append({ timestamp: new Date().toISOString() });
	});

	pi.on("tool_call", async event => {
		if (!transcript) return;
		const { path: p, file_path, command, code, async: bg, run_in_background } = (event.input ?? {}) as Record<
			string,
			unknown
		>;
		append({
			type: "assistant",
			timestamp: new Date().toISOString(),
			message: {
				content: [
					{
						type: "tool_use",
						id: event.toolCallId,
						name: event.toolName,
						input: {
							path: p,
							file_path,
							command,
							code,
							run_in_background: Boolean(bg || run_in_background),
						},
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

	pi.on("agent_end", async event => {
		try {
			const messages = (event as { messages?: Array<{ role?: string; content?: unknown }> }).messages;
			if (!Array.isArray(messages)) return;
			for (let i = messages.length - 1; i >= 0; i--) {
				const msg = messages[i];
				if (msg?.role !== "assistant") continue;
				const content = msg.content;
				const text =
					typeof content === "string"
						? content
						: Array.isArray(content)
							? content
									.filter((c): c is { type?: string; text?: string } => Boolean(c && typeof c === "object"))
									.filter(c => c.type === "text" && typeof c.text === "string")
									.map(c => c.text)
									.join("\n")
							: "";
				if (text) {
					lastAssistantMessage = text;
					break;
				}
			}
		} catch {
			/* ignore */
		}
	});

	pi.on("session_stop", async (event, ctx) => {
		if (!session) return;
		const run = spawnSync("bash", [script], {
			input: JSON.stringify({
				stop_hook_active: Boolean(event.stop_hook_active),
				session_id: session,
				transcript_path: transcript,
				cwd: ctx.cwd,
				last_assistant_message: lastAssistantMessage || undefined,
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
		return { decision: "block" as const, reason };
	});

	pi.on("session_shutdown", async () => {
		if (transcript) fs.rmSync(transcript, { force: true });
	});
}
