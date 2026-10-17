/**
 * cost-remind — omp port of the Claude Code UserPromptSubmit hook in
 * ~/.ccp/hub/hooks/cost-remind. Keeps the AGENTS.md cost rule next to each
 * decision. One plain sentence: numbered gates here get recited back as ceremony.
 *
 * Appended to the system prompt instead of each prompt: the text never changes, so
 * it stays byte-stable for prompt caching and never piles up in history.
 */
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const NOTE = `Plans that add anything end with a "Runs:" line. Build effort is never a reason.`;

export default function costRemind(pi: ExtensionAPI) {
	pi.on("before_agent_start", async event => ({ systemPrompt: [...event.systemPrompt, NOTE] }));
}
