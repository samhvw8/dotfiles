/**
 * output-style — omp port of ~/.pi/agent/extensions/output-style.ts. Loads Claude
 * Code's active output style into omp's system prompt.
 *
 * One source of truth: the style named by `outputStyle` in ~/.claude/settings.json,
 * found by its frontmatter `name` in ~/.claude/output-styles/*.md (symlink into
 * ~/.ccp/hub/output-styles). Switch the style in Claude Code and omp follows.
 *
 * Read once per session so the text stays byte-stable for prompt caching.
 */
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SETTINGS = path.join(os.homedir(), ".claude", "settings.json");
const STYLES_DIR = path.join(os.homedir(), ".claude", "output-styles");

function loadStyle(): string | undefined {
	let name: string | undefined;
	try {
		name = JSON.parse(fs.readFileSync(SETTINGS, "utf8")).outputStyle;
	} catch (err) {
		console.error(`[output-style] can't read ${SETTINGS}: ${err}`);
		return undefined;
	}
	// Claude Code's built-in styles have no file; nothing to load.
	if (!name || name === "default") return undefined;

	let files: string[] = [];
	try {
		files = fs.readdirSync(STYLES_DIR).filter(f => f.endsWith(".md"));
	} catch {}
	for (const f of files) {
		const text = fs.readFileSync(path.join(STYLES_DIR, f), "utf8");
		const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
		const fmName = fm?.[1].match(/^name:\s*(.+?)\s*$/m)?.[1];
		if (fmName === name) {
			const body = text.slice(fm ? fm[0].length : 0).trim();
			return `<output_style name="${name}">\n${body}\n</output_style>`;
		}
	}
	console.error(`[output-style] outputStyle "${name}" not found in ${STYLES_DIR}`);
	return undefined;
}

export default function outputStyle(pi: ExtensionAPI) {
	let style: string | undefined;
	pi.on("session_start", () => {
		style = loadStyle();
	});
	pi.on("before_agent_start", async event => {
		style ??= loadStyle();
		if (style) return { systemPrompt: [...event.systemPrompt, style] };
	});
}
