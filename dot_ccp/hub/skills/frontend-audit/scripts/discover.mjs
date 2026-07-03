#!/usr/bin/env node
/**
 * Walk the design directory recursively, hash each goal image, and
 * report whether its sibling regions file is in sync with the current
 * image content. Subfolders are supported for organization (e.g.
 * design/dashboard/foo.png, design/account/bar.png); _debug/ and dot-
 * prefixed dirs are skipped.
 *
 * Three states per PNG:
 *
 *   new          — no sibling regions file exists at all
 *   stale        — sibling regions file exists, but its _meta.sourceHash
 *                  doesn't match the current PNG's SHA-256
 *   up-to-date   — sibling regions file exists with matching hash
 *   unhashed     — sibling regions file exists but has no _meta block
 *                  (legacy / authored before this convention). Treated
 *                  as up-to-date but flagged so you can re-stamp if you
 *                  want hash enforcement
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/discover.mjs \
 *       [<design-dir>] [--stamp]
 *
 * Defaults:
 *   <design-dir>: ./design (or designDir from .frontend-audit.json)
 *   --stamp:     for any regions file that's `up-to-date` or `unhashed`,
 *                rewrite it with a fresh _meta block. Use after
 *                manually editing or backfilling. Stale regions are
 *                NOT auto-stamped — those need regeneration.
 *
 * Exit code: 0 for any successful report (the assistant parses the
 * printed table to decide next steps). Nonzero only on actual failure
 * (design dir missing, parse errors, etc.). "new" and "stale" PNGs
 * are not errors — they're work items.
 *
 * After regenerating the regions for a `new`/`stale` PNG, the
 * assistant should call this script with --stamp to write the hash.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const stamp = args.includes("--stamp");
const dirArg = args.find(a => !a.startsWith("--"));

let designDir = dirArg;
if (!designDir) {
	const configPath = path.resolve(process.cwd(), ".frontend-audit.json");
	if (fs.existsSync(configPath)) {
		try {
			const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
			designDir = cfg.designDir;
		} catch {
			// fall through to default
		}
	}
}
designDir = designDir ?? "design";

if (!fs.existsSync(designDir) || !fs.statSync(designDir).isDirectory()) {
	console.error(`Design directory not found: ${designDir}`);
	process.exit(1);
}

function sha256(filePath) {
	const buf = fs.readFileSync(filePath);
	return crypto.createHash("sha256").update(buf).digest("hex");
}

function regionsPathFor(pngPath) {
	const dir = path.dirname(pngPath);
	const stem = path.basename(pngPath, path.extname(pngPath));
	return path.join(dir, `${stem}.regions.json`);
}

const IMAGE_EXTS = [".png", ".jpg", ".jpeg"];

// Walk the design dir recursively so users can organize PNGs into
// subfolders (e.g. design/dashboard/foo.png, design/account/bar.png).
// _debug/ is skipped — it's the snap/diff scratch dir and never holds
// goal images. Other dotfile-prefixed dirs are skipped for the same
// reason (build/cache scratch).
function walkImages(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === "_debug" || entry.name.startsWith(".")) continue;
			out.push(...walkImages(full));
		} else if (
			entry.isFile() &&
			IMAGE_EXTS.includes(path.extname(entry.name).toLowerCase())
		) {
			out.push(full);
		}
	}
	return out;
}

const pngs = walkImages(designDir).sort();

if (pngs.length === 0) {
	console.log(`No images found in ${designDir}/ (looked for .png, .jpg, .jpeg)`);
	process.exit(0);
}

// PNG-leaning copy: prefer PNG, but JPEG is supported. JPEG's lossy
// compression introduces noise the audit reads as low-confidence
// cluster signatures near edges — re-export as PNG if precision matters.
const jpegCount = pngs.filter(p => p.toLowerCase().match(/\.jpe?g$/)).length;
console.log(`\nScanning ${designDir}/ — ${pngs.length} image(s)`);
if (jpegCount > 0) {
	console.log(
		`(${jpegCount} JPEG file(s) detected — PNG is preferred for lossless ` +
			`sampling; the audit still works on JPEG but tolerances were tuned ` +
			`against PNG inputs)\n`
	);
} else {
	console.log("");
}
// Image column shows the path relative to designDir so nested
// folders are obvious at a glance (e.g. "dashboard/recent-orders.png").
const relImages = pngs.map(p => path.relative(designDir, p));
const imageColWidth = Math.max(40, ...relImages.map(s => s.length + 2));
const HEADER =
	"Image".padEnd(imageColWidth) + "Status".padEnd(14) + "Regions file";
console.log(HEADER);
console.log("-".repeat(HEADER.length + 20));

let nonFreshCount = 0;
let stampedCount = 0;

for (let i = 0; i < pngs.length; i++) {
	const pngPath = pngs[i];
	const regionsPath = regionsPathFor(pngPath);
	const pngHash = sha256(pngPath);
	const pngName = path.basename(pngPath);
	const relPng = relImages[i];

	let status;
	let regions = null;

	if (!fs.existsSync(regionsPath)) {
		status = "new";
		nonFreshCount++;
	} else {
		try {
			regions = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
			const storedHash = regions._meta?.sourceHash;
			if (!storedHash) {
				status = "unhashed";
			} else if (storedHash === pngHash) {
				status = "up-to-date";
			} else {
				status = "stale";
				nonFreshCount++;
			}
		} catch (err) {
			console.error(`  parse error: ${regionsPath} — ${err.message}`);
			status = "stale";
			nonFreshCount++;
		}
	}

	if (stamp && (status === "up-to-date" || status === "unhashed")) {
		// Re-stamp _meta block on existing regions
		const meta = {
			sourceImage: pngName,
			sourceHash: pngHash,
			generatedAt: new Date().toISOString(),
		};
		const rest = { ...regions };
		delete rest._meta;
		const out = { _meta: meta, ...rest };
		fs.writeFileSync(regionsPath, JSON.stringify(out, null, 2) + "\n");
		status = `${status} → stamped`;
		stampedCount++;
	}

	console.log(
		relPng.padEnd(imageColWidth) +
			status.padEnd(14) +
			path.relative(process.cwd(), regionsPath)
	);
}

console.log("");
if (nonFreshCount > 0) {
	console.log(`${nonFreshCount} PNG(s) need region generation (new or stale).`);
	console.log(
		"For each: Read the PNG, identify ~10-25 components, write the regions\n" +
			"JSON (no _meta needed). Then run discover --stamp once to record\n" +
			"the hashes."
	);
} else if (stampedCount > 0) {
	console.log(`Stamped ${stampedCount} regions file(s) with the current hash.`);
} else {
	console.log("All PNGs are up-to-date.");
}

// Always exit 0 on successful inventory — the assistant parses the
// printed table to decide what to do. Non-fresh PNGs are work items,
// not errors, so we don't want the shell to surface a red "Error: Exit
// code N" on a normal report.
process.exit(0);
