#!/usr/bin/env node
/**
 * Snap a screenshot of a section on the live dev server. Pairs with
 * `diff.mjs` so a design iteration can be validated visually — sample
 * colors and shape inspector tell you the goal's tokens, this script
 * + diff tell you whether your render matches.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/snap.mjs <url-path> \
 *       --selector="<css>" [--out=<path>] [--viewport=1600x1200]
 *                          [--wait=1200] [--goal=<png>]
 *
 *   --goal=<png>   Path to the goal mock PNG. When provided, the script
 *                  automatically runs the side-by-side diff after the
 *                  snap and tells you to Read the DIFF (not the snap).
 *                  This is the only way to catch structural drift —
 *                  reading the snap alone is the known failure mode.
 *
 * Environment:
 *   DEV_URL — base URL for the dev server (default http://localhost:3000)
 *
 * The `--selector` must resolve to exactly one element. Playwright's
 * CSS-extension `:has-text("…")` scopes by text content; use a plain
 * selector to scope by class/id.
 *
 * After this script writes the snap, READ THE DIFF with the Read tool
 * before reporting the iteration done. The snap alone is not enough —
 * you need to see goal-vs-current side by side, which is what the diff
 * provides. See SKILL.md.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2);
const urlPath = args.find(a => !a.startsWith("--")) ?? "/";
const selectorArg = args.find(a => a.startsWith("--selector="));
const outArg = args.find(a => a.startsWith("--out="));
const viewportArg = args.find(a => a.startsWith("--viewport="));
const waitArg = args.find(a => a.startsWith("--wait="));
const goalArg = args.find(a => a.startsWith("--goal="));

if (!selectorArg) {
	console.error("Missing --selector=<css>");
	console.error(
		`Example: bun ~/.claude/skills/frontend-audit/scripts/snap.mjs /dashboard --selector='section:has-text("Welcome back!")' --goal=design/dashboard-home.png`
	);
	process.exit(1);
}

const selector = selectorArg.split("=").slice(1).join("=");
const out = outArg?.split("=")[1] ?? "design/_debug/snap.png";
const viewport = viewportArg?.split("=")[1] ?? "1600x1200";
const waitMs = parseInt(waitArg?.split("=")[1] ?? "1200", 10);
const goalPath = goalArg?.split("=").slice(1).join("=");
const [vw, vh] = viewport.split("x").map(n => parseInt(n, 10));

const baseUrl = process.env.DEV_URL ?? "http://localhost:3000";
const fullUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : "/" + urlPath}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: vw, height: vh } });
const page = await context.newPage();
await page.goto(fullUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(waitMs);

const handle = await page.$(selector);
if (!handle) {
	console.error(`Selector matched 0 elements: ${selector}`);
	await browser.close();
	process.exit(1);
}

await handle.screenshot({ path: out });
console.log(`wrote ${out} (viewport ${vw}×${vh}, selector "${selector}")`);
await browser.close();

if (goalPath) {
	if (!fs.existsSync(goalPath)) {
		console.error("");
		console.error(`--goal=${goalPath} does not exist. Snap written, but diff skipped.`);
		console.error(`Run diff.mjs manually once the goal path is correct.`);
		process.exit(1);
	}
	const outDir = path.dirname(out);
	const diffScript = new URL("./diff.mjs", import.meta.url).pathname;

	// Generate the full diff AND three band zooms (header / mid / footer).
	// Band zooms catch fine details — 1-2px decorative rules, font-weight
	// shifts, small icon presence — that get crushed when a full-page diff
	// is displayed at thumb size.
	const variants = [
		{ name: "diff.png", args: [] },
		{ name: "diff-zoom-header.png", args: ["--y=0,0.25"] },
		{ name: "diff-zoom-mid.png", args: ["--y=0.25,0.7"] },
		{ name: "diff-zoom-footer.png", args: ["--y=0.7,1"] },
	];
	const written = [];
	for (const { name, args: extra } of variants) {
		const outPath = path.join(outDir, name);
		const result = spawnSync(
			"bun",
			[diffScript, goalPath, out, `--out=${outPath}`, ...extra],
			{ stdio: ["ignore", "pipe", "inherit"] }
		);
		if (result.status !== 0) {
			console.error(`diff.mjs failed for ${name} — snap is still at ${out}`);
			process.exit(result.status ?? 1);
		}
		written.push(outPath);
	}
	console.log(`wrote ${written.length} diff variants:`);
	for (const p of written) console.log(`  ${p}`);
	console.log("");
	console.log(`NEXT STEP (mandatory): Read EACH of the diff PNGs above with the`);
	console.log(`Read tool. The full diff catches structure; the zoom bands catch`);
	console.log(`fine details (decorative rules, font weight, small icons). Reading`);
	console.log(`only the full diff at thumb size is the documented failure mode —`);
	console.log(`1-2px elements vanish at that scale. Read all four. Then compare`);
	console.log(`goal (LEFT) to current (RIGHT) and only claim 1:1 if every band`);
	console.log(`matches.`);
} else {
	console.log("");
	console.log(`NEXT STEP (mandatory): re-run with --goal=<png> so a side-by-side`);
	console.log(`diff is generated. Reading the snap alone is the known failure`);
	console.log(`mode — you cannot reliably remember the goal's structure.`);
	console.log("");
	console.log(`  bun ~/.claude/skills/frontend-audit/scripts/snap.mjs ${urlPath} \\`);
	console.log(`      --selector='${selector}' --out=${out} \\`);
	console.log(`      --goal=<path-to-goal.png>`);
	console.log("");
	console.log(`If you really only need a bare snap (no goal exists yet), Read`);
	console.log(`${out} with the Read tool now.`);
}
