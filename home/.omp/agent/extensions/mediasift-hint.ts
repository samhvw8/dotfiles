/**
 * mediasift-hint — omp port of the Claude Code UserPromptSubmit hook in
 * ~/.ccp/hub/hooks/mediasift-hint. When a prompt names a video/audio file or a
 * YouTube/Vimeo link, tells the agent to run `mediasift see` (and whether a card
 * is already cached).
 *
 * Delegates to the hub hook script so path resolution and card-cache checks stay
 * in one place; a fast regex prefilter avoids spawning a subprocess on prompts
 * that cannot contain media.
 */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SCRIPT = path.join(os.homedir(), ".ccp/profiles/default/hooks/mediasift-hint/scripts/mediasift-hint.sh");
const SETTINGS = path.join(os.homedir(), ".claude", "settings.json");
const MEDIA_RE =
	/\.(?:mp4|mov|mkv|webm|avi|m4v|mp3|m4a|wav|flac|ogg|opus|aac)(?=[\s,;:)\]?!.'"]|$)|https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/|vimeo\.com\/\d)/i;

function syncMediasiftEnv() {
	if (process.env.MEDIASIFT_ON) return;
	try {
		const target = JSON.parse(fs.readFileSync(SETTINGS, "utf8"))?.env?.MEDIASIFT_ON;
		if (typeof target === "string" && target.trim()) {
			process.env.MEDIASIFT_ON = target.trim();
		}
	} catch {}
}

export default function mediasiftHint(pi: ExtensionAPI) {
	syncMediasiftEnv();
	pi.on("session_start", async () => {
		syncMediasiftEnv();
	});
	if (!fs.existsSync(SCRIPT)) return;
	pi.on("before_agent_start", async (event, ctx) => {
		const prompt = event.prompt ?? "";
		if (!MEDIA_RE.test(prompt)) return;

		const run = spawnSync("bash", [SCRIPT], {
			input: JSON.stringify({ prompt, cwd: ctx.cwd }),
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

		return {
			systemPrompt: [...event.systemPrompt, `<mediasift_hint>\n${context}\n</mediasift_hint>`],
		};
	});
}
