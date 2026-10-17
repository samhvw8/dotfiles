/**
 * codegraph-remind — omp port of the Claude Code UserPromptSubmit hook in
 * ~/.ccp/hub/hooks/codegraph-remind. Steers code questions toward the codegraph MCP.
 *
 * Unlike the Claude hook, the note is appended to this turn's system prompt rather
 * than injected as a message, so it never piles up in session history.
 *
 * Three branches, decided here (NOT by the model):
 *   1. binary present AND cwd indexed   -> explore-first gate
 *   2. binary present, code, no index   -> ask the user to run `codegraph init`
 *   3. no binary, OR no code            -> silent
 */
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const MISE_BIN = path.join(
	os.homedir(),
	".local/share/mise/installs/github-colbymchenry-codegraph/latest/bin/codegraph",
);

const CODE_EXTS =
	"py js jsx ts tsx mjs cjs go rs java kt kts c h cc cpp cxx hpp hh cs rb php swift scala sh bash zsh lua dart vue svelte m mm ex exs clj cljs erl hs ml fs sql gradle".split(
		" ",
	);

// Stops at the FIRST tracked source file found. Non-git dirs ($HOME, config dirs,
// scratch folders) aren't projects — never nag there.
const HAS_CODE_SCRIPT = `
git rev-parse --is-inside-work-tree >/dev/null 2>&1 &&
  git ls-files 2>/dev/null | grep -E -i -q -m1 '\\.(${CODE_EXTS.join("|")})$'
`;

function isExecutable(p: string): boolean {
	try {
		fs.accessSync(p, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}

function hasBinary(): boolean {
	const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
	return dirs.some(d => isExecutable(path.join(d, "codegraph"))) || isExecutable(MISE_BIN);
}

// Walk up from cwd looking for .codegraph/. $HOME/.codegraph is codegraph's GLOBAL
// state dir (telemetry, update-check), NOT a project index — it never counts.
function findIndexRoot(cwd: string): string | undefined {
	const home = os.homedir();
	for (let d = path.resolve(cwd); ; d = path.dirname(d)) {
		if (d !== home && fs.statSync(path.join(d, ".codegraph"), { throwIfNoEntry: false })?.isDirectory()) {
			return d;
		}
		if (path.dirname(d) === d) return undefined;
	}
}

const indexedNote = (root: string) => `<codegraph>

This workspace is indexed by the \`codegraph\` MCP (\`${root}/.codegraph/\` present, auto-synced on file changes). For questions about code — how something works, how X reaches Y, what calls what, or why the program produced a given log line or stack trace — use \`xd://mcp__codegraph_explore\` (write \`{"query": "<question>", "projectPath": "${root}"}\` to \`xd://mcp__codegraph_explore\`). It returns the relevant symbols' line-numbered source, the call paths between them, and a blast-radius summary, including dynamic-dispatch hops grep can't follow. Name the symbol or the flow endpoints in the query; pass \`projectPath\` for another indexed repo. Use grep for literal text (a string in a log, config key, README). Open a file directly when you are about to edit it.

</codegraph>`;

const notIndexedNote = `<codegraph>

This repo has code but no codegraph index (\`.codegraph/\` not found from cwd upward). If this turn involves understanding code structure and you have not already asked this session, ask the user whether to run \`codegraph init\` in the project root (a CLI step; it builds the graph once and auto-syncs after). If they agree, run it and use \`xd://mcp__codegraph_explore\` for code questions; if they decline or already declined, use grep/read.

</codegraph>`;

export default function codegraphRemind(pi: ExtensionAPI) {
	if (!hasBinary()) return;

	// The code probe is the slow part and a directory rarely gains its first source
	// file mid-session, so cache it. The index check stays live so a mid-session
	// `codegraph init` flips the gate on the next prompt.
	const hasCodeByCwd = new Map<string, boolean>();

	pi.on("before_agent_start", async (event, ctx) => {
		const root = findIndexRoot(ctx.cwd);
		if (root) return { systemPrompt: [...event.systemPrompt, indexedNote(root)] };

		// Headless runs (-p, rpc) can't answer "want me to index?" — stay silent.
		if (!ctx.hasUI) return;

		let hasCode = hasCodeByCwd.get(ctx.cwd);
		if (hasCode === undefined) {
			const res = await pi.exec("sh", ["-c", HAS_CODE_SCRIPT], { cwd: ctx.cwd, timeout: 3000 });
			hasCode = !res.killed && res.code === 0;
			hasCodeByCwd.set(ctx.cwd, hasCode);
		}
		if (!hasCode) return;

		return { systemPrompt: [...event.systemPrompt, notIndexedNote] };
	});
}
