/**
 * okf-docs — omp port of the Claude Code SessionStart hook in
 * ~/.ccp/hub/hooks/okf-docs. Project documentation is OKF (Open Knowledge Format).
 *
 * Carries NO OKF rules on purpose: the `okf` skill and the spec it bundles are the
 * single source of truth, so this can't drift from the spec. It only decides which
 * pointer the model gets:
 *   1. .okf/ found from cwd up to the git root -> bundle path + its root index.md
 *   2. git repo without a bundle               -> write docs as OKF via the skill
 *   3. outside a git repo, or skill missing    -> silent (nothing to document)
 *
 * Built once per session (the index is a session-start snapshot) and appended to each
 * turn's system prompt, so the text stays byte-stable for prompt caching and never
 * piles up in history.
 */
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const SKILLS_DIR = path.join(os.homedir(), ".omp/agent/skills");
const MAX_INDEX_LINES = 60;

const isDir = (p: string) => fs.statSync(p, { throwIfNoEntry: false })?.isDirectory() ?? false;

function gitRoot(start: string): string | undefined {
	for (let d = start; ; d = path.dirname(d)) {
		if (fs.existsSync(path.join(d, ".git"))) return d;
		if (path.dirname(d) === d) return undefined;
	}
}

// Walk up from cwd to the git root; outside a repo only cwd itself counts, so a
// personal ~/.okf never poses as project documentation.
function findBundle(start: string, root: string): string | undefined {
	for (let d = start; ; d = path.dirname(d)) {
		if (isDir(path.join(d, ".okf"))) return path.join(d, ".okf");
		if (d === root || path.dirname(d) === d) return undefined;
	}
}

function indexSnapshot(bundle: string): string {
	const index = path.join(bundle, "index.md");
	let text: string;
	try {
		text = fs.readFileSync(index, "utf8");
	} catch {
		return "(No index.md at the bundle root.)";
	}
	const lines = text.replace(/\n$/, "").split("\n");
	const head = lines.slice(0, MAX_INDEX_LINES).join("\n");
	const more = lines.length - MAX_INDEX_LINES;
	return `--- ${index} ---\n${head}${more > 0 ? `\n[... ${more} more lines, read the file for the rest]` : ""}`;
}

// omp doesn't expand Claude Code's ${CLAUDE_SKILL_DIR}; the OKF skills use it for
// their scripts, and skill:// can't express their `../validate` sibling paths.
const skillDirLine = `- In the okf, validate, visualize and backfill skills, \`\${CLAUDE_SKILL_DIR}\` means \`${SKILLS_DIR}/<skill-name>\`. omp doesn't expand it: substitute the absolute path yourself.`;

function buildNote(cwd: string): string | undefined {
	let start = path.resolve(cwd);
	try {
		start = fs.realpathSync(start);
	} catch {}
	const root = gitRoot(start);
	const bundle = findBundle(start, root ?? start);
	if (bundle) {
		return `<okf_docs>
This project's knowledge lives in an OKF (Open Knowledge Format) bundle: \`${bundle}\`
- Before reading, writing or restructuring it, read \`skill://okf\` and follow it. The skill carries the spec: work from it, not from memory of OKF.
- Treat the bundle as the project's documentation: consult it when it bears on the task, and update it in the same change as the code it describes.
${skillDirLine}
${indexSnapshot(bundle)}
</okf_docs>`;
	}
	if (!root) return undefined;
	return `<okf_docs>
Documentation convention: project knowledge is written as OKF (Open Knowledge Format) bundles. None exists here yet.
- When the task calls for documentation, read \`skill://okf\` first and follow it. The skill carries the spec: don't write OKF from memory.
- READMEs, changelogs and agent config (AGENTS.md, CLAUDE.md, SKILL.md, rules) keep their own conventions.
${skillDirLine}
</okf_docs>`;
}

export default function okfDocs(pi: ExtensionAPI) {
	if (!isDir(path.join(SKILLS_DIR, "okf"))) return;

	let note: string | null | undefined;
	let noteCwd: string | undefined;
	pi.on("session_start", () => {
		note = undefined;
	});
	pi.on("before_agent_start", async (event, ctx) => {
		if (note === undefined || noteCwd !== ctx.cwd) {
			note = buildNote(ctx.cwd) ?? null;
			noteCwd = ctx.cwd;
		}
		if (!note) return;
		return { systemPrompt: [...event.systemPrompt, note] };
	});
}
