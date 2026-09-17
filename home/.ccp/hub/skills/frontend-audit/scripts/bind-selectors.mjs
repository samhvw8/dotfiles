#!/usr/bin/env node
/**
 * Bind regions to stable Playwright locators by inspecting the LIVE DOM.
 *
 * Run after authoring the rects (Step 0 of the skill workflow) and before
 * the audit. For each region, this script finds the corresponding live
 * element and rewrites the region with a `locator` field describing it
 * via semantics (data-testid → ARIA role+name → text → CSS path),
 * not class names. The resulting locators survive class refactors,
 * Tailwind class renames, and framework-scoped style mangling
 * (Svelte `svelte-abc123`, CSS Modules hash suffixes, styled-components).
 *
 * Resolution priority per element:
 *   1. data-testid                       → { "testid": "..." }
 *   2. ARIA role + accessible name       → { "role": "...", "name": "..." }
 *   3. Visible text content              → { "text": "..." }
 *   4. Structural CSS path (no classes)  → { "css": "..." }
 *
 * Element discovery per region:
 *   1. If region has `selector`, resolve via CSS querySelector. This is
 *      the default — bind-selectors UPGRADES existing selectors into
 *      durable locators. Regions without a selector are left alone.
 *   2. With --include-rect, also attempt rect-based discovery for regions
 *      that have only x/y/w/h. WARNING: this is speculative when goal and
 *      live render have different aspect ratios — the same fractional
 *      coords land on different content. Review every binding from
 *      --include-rect before trusting the audit.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/bind-selectors.mjs \
 *       --regions=design/<name>.regions.json --url=<path> \
 *       [--viewport=WxH] [--dry-run] [--keep-selector] [--include-rect]
 *
 *   --dry-run         Print proposed locators without writing to disk.
 *   --keep-selector   Preserve the existing `selector` field alongside
 *                     `locator`. Default behavior strips `selector` once
 *                     a `locator` is bound — locators are the new contract.
 *   --include-rect    Also bind rect-only regions via elementsFromPoint
 *                     (speculative; off by default).
 *
 * Environment:
 *   DEV_URL — base URL (default http://localhost:3000)
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const argMap = Object.fromEntries(
	args
		.filter(a => a.startsWith("--"))
		.map(a => {
			const [k, ...v] = a.replace(/^--/, "").split("=");
			return [k, v.length ? v.join("=") : true];
		})
);

const regionsPath = argMap.regions;
const urlPath = argMap.url;
const dryRun = argMap["dry-run"] === true;
const keepSelector = argMap["keep-selector"] === true;
const includeRect = argMap["include-rect"] === true;
const [vw, vh] = (argMap.viewport ?? "1600x1200")
	.split("x")
	.map(n => parseInt(n, 10));

if (!regionsPath || !urlPath) {
	console.error("Usage: bun bind-selectors.mjs --regions=<path> --url=<dev-path>");
	console.error("Optional: --viewport=WxH --dry-run --keep-selector");
	process.exit(2);
}

if (!fs.existsSync(regionsPath)) {
	console.error(`Regions file not found: ${regionsPath}`);
	process.exit(2);
}

const raw = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
const { _meta, ...regions } = raw;

const baseUrl = process.env.DEV_URL ?? "http://localhost:3000";
const fullUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : "/" + urlPath}`;

console.log(`Binding locators against ${fullUrl} (viewport ${vw}×${vh})`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: vw, height: vh } });
const page = await context.newPage();
await page.goto(fullUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Inject the synthesizer helpers into the page context. They run inside
// the browser per element to compute role/name/text/css-path; doing this
// browser-side avoids round-tripping every accessibility-tree question.
await page.addInitScript(() => {
	window.__feBindHelpers = true;
});

// Helpers are evaluated against an element handle inside the page. Returns
// { testid?, role?, name?, text?, css? } — exactly one field describes the
// strongest available anchor, with css as the structural fallback.
async function synthesizeLocator(elHandle) {
	return elHandle.evaluate(el => {
		const TAG_TO_ROLE = {
			BUTTON: "button",
			A: "link",
			SELECT: "combobox",
			TEXTAREA: "textbox",
			H1: "heading",
			H2: "heading",
			H3: "heading",
			H4: "heading",
			H5: "heading",
			H6: "heading",
			NAV: "navigation",
			MAIN: "main",
			HEADER: "banner",
			FOOTER: "contentinfo",
			ARTICLE: "article",
			UL: "list",
			OL: "list",
			LI: "listitem",
			IMG: "img",
		};

		function elementRole(node) {
			const explicit = node.getAttribute && node.getAttribute("role");
			if (explicit) return explicit;
			const tag = node.tagName;
			if (tag === "INPUT") {
				const t = node.type;
				if (t === "button" || t === "submit" || t === "reset") return "button";
				if (t === "checkbox") return "checkbox";
				if (t === "radio") return "radio";
				if (["text", "email", "search", "tel", "url"].includes(t)) return "textbox";
				return null;
			}
			return TAG_TO_ROLE[tag] ?? null;
		}

		function visibleText(node) {
			return (node.textContent || "").replace(/\s+/g, " ").trim();
		}

		function accessibleName(node) {
			const al = node.getAttribute && node.getAttribute("aria-label");
			if (al && al.trim()) return al.trim();
			const lb = node.getAttribute && node.getAttribute("aria-labelledby");
			if (lb) {
				const ref = document.getElementById(lb);
				if (ref) {
					const t = visibleText(ref);
					if (t) return t;
				}
			}
			if (node.tagName === "IMG") {
				const alt = node.getAttribute("alt");
				if (alt) return alt.trim();
			}
			return visibleText(node);
		}

		function countByTestId(tid) {
			try {
				return document.querySelectorAll(`[data-testid="${CSS.escape(tid)}"]`).length;
			} catch {
				return 0;
			}
		}

		function countByRoleAndName(role, name) {
			let count = 0;
			const candidates = document.querySelectorAll("*");
			for (const node of candidates) {
				if (elementRole(node) === role && accessibleName(node) === name) {
					if (++count > 1) return count;
				}
			}
			return count;
		}

		function countByText(text) {
			// Limit to elements that can be Playwright-getByText targets cleanly
			let count = 0;
			const selector =
				"button, a, span, p, h1, h2, h3, h4, h5, h6, label, li, div";
			for (const node of document.querySelectorAll(selector)) {
				if (visibleText(node) === text) {
					if (++count > 1) return count;
				}
			}
			return count;
		}

		function cssPath(node) {
			// Tag + nth-of-type structural path. Classes are deliberately
			// excluded — they're the brittleness this skill is fighting.
			// We extend the path until it uniquely identifies the node
			// (rather than stopping at a fixed depth) because nested
			// repeated structures like sibling cards need deeper rooting
			// to disambiguate. Cap at 14 hops as a safety net.
			const MAX_HOPS = 14;
			const parts = [];
			let cur = node;
			while (
				cur &&
				cur.nodeType === Node.ELEMENT_NODE &&
				cur !== document.documentElement &&
				parts.length < MAX_HOPS
			) {
				const parent = cur.parentElement;
				if (!parent) break;
				const tag = cur.tagName.toLowerCase();
				const sameTag = Array.from(parent.children).filter(
					c => c.tagName === cur.tagName
				);
				const idx = sameTag.indexOf(cur) + 1;
				parts.unshift(
					sameTag.length > 1 ? `${tag}:nth-of-type(${idx})` : tag
				);
				// Check uniqueness as we extend the path upward — stop
				// the moment we have an unambiguous selector.
				try {
					const candidate = parts.join(" > ");
					if (document.querySelectorAll(candidate).length === 1) {
						return candidate;
					}
				} catch {
					// invalid intermediate selector — keep extending
				}
				cur = parent;
			}
			return parts.join(" > ");
		}

		// 1. Direct testid
		const tid = el.getAttribute("data-testid");
		if (tid && countByTestId(tid) === 1) return { testid: tid };

		// 2. Role + accessible name
		const role = elementRole(el);
		const name = accessibleName(el);
		if (role && name && name.length > 0 && name.length < 120) {
			if (countByRoleAndName(role, name) === 1) return { role, name };
		}

		// 3. Visible text
		if (name && name.length > 0 && name.length < 120) {
			if (countByText(name) === 1) return { text: name };
		}

		// 4. CSS path (structural)
		return { css: cssPath(el) };
	});
}

// Resolve a region to an element handle on the live page. Returns null
// if neither path (selector / rect-based elementsFromPoint) lands on
// anything bindable.
async function findElement(name, frac) {
	// Path A — explicit selector takes precedence so we can upgrade
	// existing selector-based regions in place.
	if (frac.selector) {
		try {
			const handle = await page.$(frac.selector);
			if (handle) return { handle, source: "selector" };
		} catch {
			// invalid selector — fall through
		}
	}

	// Path B — fractional rect → document-relative pixel center →
	// elementsFromPoint. Off by default; opt in with --include-rect.
	// Speculative because the goal PNG and live render may have
	// different aspect ratios, so the same fractional rect lands on
	// different content. Use only after eyeballing each binding.
	if (
		includeRect &&
		typeof frac.x === "number" &&
		typeof frac.y === "number" &&
		typeof frac.w === "number" &&
		typeof frac.h === "number"
	) {
		const handle = await page.evaluateHandle(rect => {
			const docW = Math.max(
				document.documentElement.scrollWidth,
				document.body?.scrollWidth ?? 0
			);
			const docH = Math.max(
				document.documentElement.scrollHeight,
				document.body?.scrollHeight ?? 0
			);
			const cx = (rect.x + rect.w / 2) * docW;
			const cy = (rect.y + rect.h / 2) * docH;
			// Scroll so the center is in the viewport, then call
			// elementsFromPoint with viewport-relative coords.
			const targetScrollY = Math.max(0, cy - window.innerHeight / 2);
			window.scrollTo(0, targetScrollY);
			const viewportX = cx;
			const viewportY = cy - window.scrollY;
			const stack = document.elementsFromPoint(viewportX, viewportY);
			// Filter out html/body — they're rarely meaningful anchors.
			// Prefer the most specific (deepest) element from the stack.
			const useful = stack.filter(
				n => n !== document.documentElement && n.tagName !== "BODY"
			);
			return useful[0] ?? null;
		}, { x: frac.x, y: frac.y, w: frac.w, h: frac.h });

		const el = handle.asElement();
		if (el) return { handle: el, source: "rect" };
	}

	return null;
}

// Verify the proposed locator resolves to exactly one element on the
// page. Returns true if it does. We rebuild the locator using Playwright's
// own API so this is the same machinery the audit will use.
async function verifyLocator(loc) {
	let plLoc;
	if (loc.testid) plLoc = page.getByTestId(loc.testid);
	else if (loc.role && loc.name)
		plLoc = page.getByRole(loc.role, { name: loc.name, exact: true });
	else if (loc.text) plLoc = page.getByText(loc.text, { exact: true });
	else if (loc.css) plLoc = page.locator(loc.css);
	else return false;
	try {
		const count = await plLoc.count();
		return count === 1;
	} catch {
		return false;
	}
}

const proposals = {};
const failures = [];

const skipped = [];
for (const [name, frac] of Object.entries(regions)) {
	// Skip if already has locator (idempotent re-runs)
	if (frac.locator) {
		proposals[name] = { kept: true, locator: frac.locator };
		continue;
	}
	// Rect-only regions are not bound unless --include-rect is passed.
	// They keep doing PNG-sampling in the audit, which is fine for
	// decorative regions (page-bg, leaves, etc.).
	if (!frac.selector && !includeRect) {
		skipped.push(name);
		continue;
	}
	const found = await findElement(name, frac);
	if (!found) {
		failures.push({ name, reason: "no element resolved" });
		continue;
	}
	const synthesized = await synthesizeLocator(found.handle);
	const ok = await verifyLocator(synthesized);
	if (!ok) {
		failures.push({
			name,
			reason: `synthesized locator failed uniqueness check: ${JSON.stringify(synthesized)}`,
		});
		continue;
	}
	proposals[name] = { locator: synthesized, source: found.source };
}

await browser.close();

// ────────────────────────────────────────────────────────────────────────────
// Report
// ────────────────────────────────────────────────────────────────────────────
console.log("\nProposed locators:");
const NAME_W = Math.max(20, ...Object.keys(regions).map(n => n.length)) + 2;
for (const [name, p] of Object.entries(proposals)) {
	const tag = p.kept ? "[KEEP]" : `[${(p.source ?? "new").toUpperCase()}]`;
	console.log(`  ${name.padEnd(NAME_W)} ${tag.padEnd(12)} ${JSON.stringify(p.locator)}`);
}
if (failures.length > 0) {
	console.log("\nUnbound regions:");
	for (const f of failures) {
		console.log(`  ${f.name.padEnd(NAME_W)} ${f.reason}`);
	}
}
if (skipped.length > 0) {
	console.log(
		`\nSkipped ${skipped.length} rect-only region(s) (no selector to upgrade).` +
			` Pass --include-rect to attempt rect-based discovery.`
	);
}

if (dryRun) {
	console.log(
		`\nDRY RUN — not writing. ${Object.keys(proposals).length} bound, ${failures.length} unbound.`
	);
	process.exit(failures.length > 0 ? 1 : 0);
}

// ────────────────────────────────────────────────────────────────────────────
// Write back
// ────────────────────────────────────────────────────────────────────────────
const updated = { ...(_meta ? { _meta } : {}) };
for (const [name, frac] of Object.entries(regions)) {
	const prop = proposals[name];
	const next = { ...frac };
	if (prop) {
		next.locator = prop.locator;
		if (!keepSelector) delete next.selector;
	}
	updated[name] = next;
}
fs.writeFileSync(regionsPath, JSON.stringify(updated, null, 2) + "\n");
console.log(
	`\nWrote ${Object.keys(proposals).length} locator(s) to ${path.relative(
		process.cwd(),
		regionsPath
	)}. ${failures.length} unbound.`
);
process.exit(failures.length > 0 ? 1 : 0);
