#!/usr/bin/env node
/**
 * Inspect computed styles of selected elements on the running dev server
 * and dump every design-token property (color, border, shadow, font,
 * etc.) so a design pass can be checked against a goal image one
 * property at a time — without per-iteration guessing.
 *
 * Pair this with `sample-colors.mjs` and `inspect-shape.mjs` (which
 * extract values from the goal PNG): the goal scripts tell you what
 * the design IS, this script tells you what the live render
 * PRODUCED. The diff between them is the work.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/check.mjs <url-path> \
 *       --selector='<css>' [--viewport=WxH]
 *
 * Environment:
 *   DEV_URL — base URL for the dev server (default http://localhost:3000)
 *
 * Output: one block per matched element with non-default values for
 *   color, font-family, font-size, font-weight, line-height,
 *   letter-spacing, text-transform, background-color, border,
 *   border-radius, box-shadow, padding, margin, width, height.
 */
import { chromium } from "playwright";

const PROPS_TEXT = [
	"color",
	"font-family",
	"font-size",
	"font-weight",
	"line-height",
	"letter-spacing",
	"text-transform",
];
const PROPS_BOX = [
	"background-color",
	"border",
	"border-radius",
	"box-shadow",
	"padding",
	"margin",
	"width",
	"height",
];

const args = process.argv.slice(2);
const urlPath = args.find(a => !a.startsWith("--")) ?? "/";
const selectorArg = args.find(a => a.startsWith("--selector="));
const viewportArg = args.find(a => a.startsWith("--viewport="));
const selector = selectorArg?.split("=").slice(1).join("=");
const [vw, vh] = (viewportArg?.split("=")[1] ?? "1920x1080")
	.split("x")
	.map(n => parseInt(n, 10));

if (!selector) {
	console.error("Missing --selector=<css>");
	console.error(
		"Example: bun ~/.claude/skills/frontend-audit/scripts/check.mjs /dashboard --selector='h2,h3,button'"
	);
	process.exit(1);
}

const baseUrl = process.env.DEV_URL ?? "http://localhost:3000";
const fullUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : "/" + urlPath}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: vw, height: vh } });
const page = await context.newPage();
await page.goto(fullUrl, { waitUntil: "networkidle" });

const report = await page.evaluate(
	({ selector, PROPS_TEXT, PROPS_BOX }) => {
		const nodes = Array.from(document.querySelectorAll(selector)).filter(
			n => {
				const rect = n.getBoundingClientRect();
				return rect.width > 0 && rect.height > 0;
			}
		);
		return nodes.slice(0, 60).map(n => {
			const cs = getComputedStyle(n);
			const out = {
				tag: n.tagName.toLowerCase(),
				cls: (n.getAttribute("class") || "").slice(0, 80),
				text: (n.textContent || "").trim().slice(0, 40),
			};
			for (const p of [...PROPS_TEXT, ...PROPS_BOX]) {
				const v = cs.getPropertyValue(p);
				if (v && v !== "none" && v !== "0px" && v !== "normal") {
					out[p] = v;
				}
			}
			return out;
		});
	},
	{ selector, PROPS_TEXT, PROPS_BOX }
);

await browser.close();

console.log(`\nDesign report for ${fullUrl}`);
console.log(`Selector: ${selector}`);
console.log(`Viewport: ${vw}×${vh}`);
console.log(`Matched ${report.length} element(s).\n`);

for (const el of report) {
	console.log(`<${el.tag}> ${el.text ? `"${el.text}"` : ""}`);
	if (el.cls) console.log(`  class: ${el.cls}`);
	for (const k of Object.keys(el)) {
		if (k === "tag" || k === "cls" || k === "text") continue;
		console.log(`  ${k.padEnd(18)} ${el[k]}`);
	}
	console.log();
}
