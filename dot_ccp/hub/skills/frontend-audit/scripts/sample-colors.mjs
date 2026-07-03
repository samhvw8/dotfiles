#!/usr/bin/env node
/**
 * Sample dominant colors from named regions of a goal PNG and print the
 * top-N hex codes per region — so a design pass is grounded in real
 * color values, not eyeballed guesses.
 *
 * Why histogram clustering, not "darkest pixel":
 *   A swatch around "Delivery by …" contains pill-bg + white text +
 *   anti-aliased edges. A "darkest 1%" strategy returns the *darkest*
 *   red — i.e. the anti-aliased boundary pixels where pill-bg blends
 *   into the page bg — which is always darker / less saturated than
 *   the actual pill. Histogram clustering returns the true bg AND the
 *   true fg color for a region with text on a pill.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/sample-colors.mjs \
 *       <goal.png> [--regions=path] [--debug] [--top=N]
 *
 * Defaults:
 *   --regions: regions.json in the current working directory
 *   --top:     3 clusters per region
 *
 * Region file format (fractions of the image's width/height — same
 * descriptor works at any resolution):
 *   { "primary-cta": { "x": 0.08, "y": 0.49, "w": 0.10, "h": 0.04 } }
 */
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";
import { readImage } from "./_imageio.mjs";

const args = process.argv.slice(2);
const goalPath = args.find(a => !a.startsWith("--"));
const regionsArg = args.find(a => a.startsWith("--regions="));
const topArg = args.find(a => a.startsWith("--top="));
const debug = args.includes("--debug");
const topN = Math.max(1, parseInt(topArg?.split("=")[1] ?? "3", 10));

if (!goalPath || !fs.existsSync(goalPath)) {
	console.error(`Goal image not found: ${goalPath}`);
	console.error(
		`Usage: bun ~/.claude/skills/frontend-audit/scripts/sample-colors.mjs <goal.png> [--regions=path] [--debug] [--top=N]`
	);
	process.exit(1);
}

// Default the regions path to a sibling file next to the goal PNG:
//   design/<name>.png  →  design/<name>.regions.json
// This way each goal image gets its own region descriptors, and Claude
// (via the skill) generates the JSON from looking at the PNG.
const defaultRegionsPath = path.join(
	path.dirname(goalPath),
	`${path.basename(goalPath, path.extname(goalPath))}.regions.json`
);
const regionsPath = regionsArg?.split("=")[1] ?? defaultRegionsPath;

if (!fs.existsSync(regionsPath)) {
	console.error(`Regions file not found: ${regionsPath}`);
	console.error(
		`Generate it by Reading the goal PNG with the Read tool and writing\n` +
			`a sibling JSON with fractional region descriptors. See the skill's\n` +
			`SKILL.md for the convention and examples/.`
	);
	process.exit(1);
}

const regions = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
const png = readImage(goalPath);
const { width, height, data } = png;

function regionPixels({ x, y, w, h }) {
	const x0 = Math.max(0, Math.round(x * width));
	const y0 = Math.max(0, Math.round(y * height));
	const w0 = Math.max(1, Math.round(w * width));
	const h0 = Math.max(1, Math.round(h * height));
	const pixels = [];
	for (let yy = y0; yy < Math.min(height, y0 + h0); yy++) {
		for (let xx = x0; xx < Math.min(width, x0 + w0); xx++) {
			const idx = (yy * width + xx) << 2;
			pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
		}
	}
	return pixels;
}

const saturation = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b);

/**
 * Quantize pixels into 5-bit-per-channel buckets (32^3 = 32k buckets),
 * accumulate per-bucket centroids, then merge nearby buckets (Euclidean
 * distance ≤ MERGE_DIST in RGB space). Returns the top-N merged
 * clusters sorted by pixel count.
 */
function dominantClusters(pixels, k) {
	const QUANT = 3; // bits dropped per channel → 5-bit
	const MERGE_DIST = 18;

	const buckets = new Map();
	for (const [r, g, b] of pixels) {
		const key =
			((r >> QUANT) << 16) | ((g >> QUANT) << 8) | (b >> QUANT);
		let b_ = buckets.get(key);
		if (!b_) {
			b_ = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
			buckets.set(key, b_);
		}
		b_.count++;
		b_.rSum += r;
		b_.gSum += g;
		b_.bSum += b;
	}

	let clusters = [...buckets.values()].map(b => ({
		count: b.count,
		r: b.rSum / b.count,
		g: b.gSum / b.count,
		b: b.bSum / b.count,
	}));
	clusters.sort((a, b) => b.count - a.count);

	const merged = [];
	for (const c of clusters) {
		const target = merged.find(
			m => Math.hypot(m.r - c.r, m.g - c.g, m.b - c.b) <= MERGE_DIST
		);
		if (target) {
			const total = target.count + c.count;
			target.r = (target.r * target.count + c.r * c.count) / total;
			target.g = (target.g * target.count + c.g * c.count) / total;
			target.b = (target.b * target.count + c.b * c.count) / total;
			target.count = total;
		} else {
			merged.push({ ...c });
		}
	}

	merged.sort((a, b) => b.count - a.count);
	const total = pixels.length;
	return merged.slice(0, k).map(c => {
		const rgb = {
			r: Math.round(c.r),
			g: Math.round(c.g),
			b: Math.round(c.b),
		};
		return {
			...rgb,
			pct: (c.count / total) * 100,
			sat: saturation([rgb.r, rgb.g, rgb.b]),
		};
	});
}

const toHex = ({ r, g, b }) => {
	const h = v => v.toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
};

console.log(`\nGoal: ${path.relative(process.cwd(), goalPath)}`);
console.log(`Image: ${width} × ${height}`);
console.log(`Regions: ${path.relative(process.cwd(), regionsPath)}`);
console.log(`Strategy: dominant-cluster histogram (top ${topN} per region)\n`);

const debugDir = path.resolve(path.dirname(goalPath), "_debug");
if (debug && !fs.existsSync(debugDir))
	fs.mkdirSync(debugDir, { recursive: true });

function cropRegion({ x, y, w, h }) {
	const x0 = Math.max(0, Math.round(x * width));
	const y0 = Math.max(0, Math.round(y * height));
	const w0 = Math.min(width - x0, Math.max(1, Math.round(w * width)));
	const h0 = Math.min(height - y0, Math.max(1, Math.round(h * height)));
	const out = new PNG({ width: w0, height: h0 });
	for (let yy = 0; yy < h0; yy++) {
		for (let xx = 0; xx < w0; xx++) {
			const srcIdx = ((y0 + yy) * width + (x0 + xx)) << 2;
			const dstIdx = (yy * w0 + xx) << 2;
			out.data[dstIdx] = data[srcIdx];
			out.data[dstIdx + 1] = data[srcIdx + 1];
			out.data[dstIdx + 2] = data[srcIdx + 2];
			out.data[dstIdx + 3] = data[srcIdx + 3];
		}
	}
	return PNG.sync.write(out);
}

const HEADER =
	"Region".padEnd(28) +
	"Rank".padEnd(6) +
	"Hex".padEnd(10) +
	"RGB".padEnd(20) +
	"Area".padEnd(8) +
	"Sat";
console.log(HEADER);
console.log("-".repeat(HEADER.length + 6));

for (const [name, region] of Object.entries(regions)) {
	const pixels = regionPixels(region);
	const clusters = dominantClusters(pixels, topN);
	const x0 = Math.round(region.x * width);
	const y0 = Math.round(region.y * height);
	const w0 = Math.round(region.w * width);
	const h0 = Math.round(region.h * height);

	clusters.forEach((c, i) => {
		const label = i === 0 ? name : "";
		console.log(
			label.padEnd(28) +
				`#${i + 1}`.padEnd(6) +
				toHex(c).padEnd(10) +
				`rgb(${c.r},${c.g},${c.b})`.padEnd(20) +
				`${c.pct.toFixed(1)}%`.padEnd(8) +
				c.sat
		);
	});
	console.log(
		"  " + `@ ${x0},${y0}  ${w0}×${h0}`.padEnd(26) + "".padEnd(6) + "".padEnd(10) + "".padEnd(20) + ""
	);

	if (debug) {
		const out = path.join(debugDir, `${name}.png`);
		fs.writeFileSync(out, cropRegion(region));
	}
}

if (debug)
	console.log(
		`\nDebug crops written to: ${path.relative(process.cwd(), debugDir)}`
	);
