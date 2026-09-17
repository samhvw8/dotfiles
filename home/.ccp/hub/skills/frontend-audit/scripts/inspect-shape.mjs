#!/usr/bin/env node
/**
 * Inspect non-color design tokens for each region of a goal PNG:
 *   - corner radius (per corner)
 *   - border (presence + color + confidence)
 *   - bg-mode (filled vs ghost vs edge-of-image)
 *   - drop shadow (per-side luma delta)
 *
 * The color sampler can't read these because they aren't pixel-color,
 * they're shape — but a goal mock still encodes them implicitly: a
 * rounded corner has bg-colored pixels eating into the corner of a
 * rect, a border has a thin ring with a different color than the
 * inner fill, and a shadow has a lightness gradient extending outward.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/inspect-shape.mjs \
 *       <goal.png> [--regions=path]
 *                  [--page-bg=#rrggbb]
 *                  [--region=<name>]
 *                  [--max-radius=32]
 *
 * Heuristics, not perfect — verify the strongest signal by eye on the
 * goal image. Common failure: a region tight to text has no real
 * "card edge" → radius reads as 0. Pad regions a few pixels in your
 * regions.json so the probes have flat fill to scan.
 */
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";
import { readImage } from "./_imageio.mjs";

const args = process.argv.slice(2);
const goalPath = args.find(a => !a.startsWith("--"));
const regionsArg = args.find(a => a.startsWith("--regions="));
const onlyRegion = args.find(a => a.startsWith("--region="))?.split("=")[1];
const pageBgArg = args.find(a => a.startsWith("--page-bg="))?.split("=")[1];
const maxRadiusArg = args.find(a => a.startsWith("--max-radius="));
const maxRadius = Math.max(2, parseInt(maxRadiusArg?.split("=")[1] ?? "32", 10));

if (!goalPath || !fs.existsSync(goalPath)) {
	console.error(`Goal image not found: ${goalPath}`);
	process.exit(1);
}

// Default the regions path to a sibling file next to the goal PNG:
//   design/<name>.png  →  design/<name>.regions.json
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

function hexToRgb(hex) {
	const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function pixel(x, y) {
	const idx = (y * width + x) << 2;
	return [data[idx], data[idx + 1], data[idx + 2]];
}

function dist(a, b) {
	return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

const luma = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

function regionFill(rect) {
	const cx = rect.x + Math.round(rect.w / 2);
	const cy = rect.y + Math.round(rect.h / 2);
	const samples = [];
	for (let dy = -2; dy <= 2; dy++)
		for (let dx = -2; dx <= 2; dx++)
			samples.push(pixel(cx + dx, cy + dy));
	const avg = samples
		.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0])
		.map(v => Math.round(v / samples.length));
	return avg;
}

/**
 * Walk the diagonal from each corner inward until the first pixel
 * matches the fill within MATCH_DIST. CSS border-radius r maps a
 * corner pixel to bg if it's within (1 - 1/√2)·r ≈ 0.293·r of the
 * rect corner; recovering r from the diagonal offset is k / 0.293.
 */
function cornerRadius(rect, fill, corner) {
	const MATCH_DIST = 22;
	const dirX = corner.includes("right") ? -1 : 1;
	const dirY = corner.includes("bottom") ? -1 : 1;
	const startX = corner.includes("right") ? rect.x + rect.w - 1 : rect.x;
	const startY = corner.includes("bottom") ? rect.y + rect.h - 1 : rect.y;
	for (let k = 0; k <= maxRadius; k++) {
		const px = startX + dirX * k;
		const py = startY + dirY * k;
		if (px < 0 || py < 0 || px >= width || py >= height) break;
		if (dist(pixel(px, py), fill) <= MATCH_DIST) {
			return Math.round(k / 0.293);
		}
	}
	return 0;
}

/**
 * Probe each edge two pixels inside the rect. Pixels that differ from
 * inner fill by more than EDGE_DIST are border-ring pixels; their
 * average is the border color and the fraction of off-edge samples is
 * the confidence. Probe 2px in because a 1px CSS border renders as
 * ~1-2 image pixels after browser AA; exactly at 0px-in we sample the
 * boundary AA which biases toward the page bg.
 */
function borderSignal(rect, fill) {
	const EDGE_DIST = 6;
	const PROBE_INSET = 2;
	const STRIDE_DIVISOR = 16;
	const samples = [];
	const stride = length => Math.max(1, Math.floor((length - 16) / STRIDE_DIVISOR));

	for (let xx = rect.x + 8; xx < rect.x + rect.w - 8; xx += stride(rect.w))
		samples.push(pixel(xx, rect.y + PROBE_INSET));
	for (let xx = rect.x + 8; xx < rect.x + rect.w - 8; xx += stride(rect.w))
		samples.push(pixel(xx, rect.y + rect.h - 1 - PROBE_INSET));
	for (let yy = rect.y + 8; yy < rect.y + rect.h - 8; yy += stride(rect.h))
		samples.push(pixel(rect.x + PROBE_INSET, yy));
	for (let yy = rect.y + 8; yy < rect.y + rect.h - 8; yy += stride(rect.h))
		samples.push(pixel(rect.x + rect.w - 1 - PROBE_INSET, yy));

	if (samples.length === 0) return { present: false };

	const offEdge = samples.filter(p => dist(p, fill) > EDGE_DIST);
	const confidence = offEdge.length / samples.length;
	if (confidence < 0.4) return { present: false, confidence };

	const avg = offEdge
		.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0])
		.map(v => Math.round(v / offEdge.length));

	return {
		present: true,
		color: avg,
		confidence,
		delta: Math.round(dist(avg, fill)),
	};
}

/**
 * Sample the area just OUTSIDE the rect (in the parent container) and
 * compare it to the inner fill. Catches the "ghost button" case — when
 * a button has no fill of its own and inherits the surrounding
 * container's color, the only visible bits are its border and text.
 * The border probe alone can't tell you whether the rect has its own
 * fill: both ghost and filled buttons can have borders.
 */
function fillVsContext(rect, fill) {
	const FILL_DELTA = 8;
	const STRIP = 6;
	const samples = [];

	const sampleStrip = (xStart, yStart, lenW, lenH) => {
		for (let yy = yStart; yy < yStart + lenH; yy++) {
			if (yy < 0 || yy >= height) continue;
			for (let xx = xStart; xx < xStart + lenW; xx++) {
				if (xx < 0 || xx >= width) continue;
				samples.push(pixel(xx, yy));
			}
		}
	};

	sampleStrip(rect.x, rect.y - STRIP, rect.w, STRIP);
	sampleStrip(rect.x, rect.y + rect.h, rect.w, STRIP);
	sampleStrip(rect.x - STRIP, rect.y, STRIP, rect.h);
	sampleStrip(rect.x + rect.w, rect.y, STRIP, rect.h);

	if (samples.length === 0) return { mode: "edge-of-image" };

	const avg = samples
		.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0])
		.map(v => Math.round(v / samples.length));

	const d = dist(avg, fill);
	return {
		contextColor: avg,
		delta: Math.round(d),
		mode: d > FILL_DELTA ? "filled" : "ghost",
	};
}

function shadowSignal(rect, pageBg) {
	const SHADOW_THRESH = 4;
	const STRIP = 6;
	const pbgL = luma(pageBg);

	const sampleStrip = (xStart, yStart, lenW, lenH) => {
		let sum = 0, count = 0;
		for (let yy = yStart; yy < yStart + lenH; yy++) {
			if (yy < 0 || yy >= height) continue;
			for (let xx = xStart; xx < xStart + lenW; xx++) {
				if (xx < 0 || xx >= width) continue;
				sum += luma(pixel(xx, yy));
				count++;
			}
		}
		return count ? sum / count : pbgL;
	};

	const below = sampleStrip(rect.x + 4, rect.y + rect.h + 1, rect.w - 8, STRIP);
	const right = sampleStrip(rect.x + rect.w + 1, rect.y + 4, STRIP, rect.h - 8);
	const belowDelta = pbgL - below;
	const rightDelta = pbgL - right;

	return {
		below: belowDelta.toFixed(1),
		right: rightDelta.toFixed(1),
		present: belowDelta >= SHADOW_THRESH || rightDelta >= SHADOW_THRESH,
	};
}

const pageBgRgb = pageBgArg
	? hexToRgb(pageBgArg)
	: regionFill({
			x: 4,
			y: 4,
			w: Math.min(20, width - 8),
			h: Math.min(20, height - 8),
		});

console.log(`\nGoal: ${path.relative(process.cwd(), goalPath)}`);
console.log(`Image: ${width} × ${height}`);
console.log(
	`Page bg: rgb(${pageBgRgb.join(",")}) ${pageBgArg ? "(from --page-bg)" : "(sampled from top-left)"}`
);
console.log(`Max radius probe: ${maxRadius}px\n`);

const HEADER =
	"Region".padEnd(26) +
	"Fill".padEnd(20) +
	"r-tl".padEnd(6) +
	"r-tr".padEnd(6) +
	"r-bl".padEnd(6) +
	"r-br".padEnd(6) +
	"bg-mode".padEnd(28) +
	"border".padEnd(28) +
	"shadow↓".padEnd(10) +
	"shadow→";
console.log(HEADER);
console.log("-".repeat(HEADER.length + 4));

const toHex = ([r, g, b]) => {
	const h = v => v.toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
};

for (const [name, frac] of Object.entries(regions)) {
	if (onlyRegion && name !== onlyRegion) continue;
	const rect = {
		x: Math.max(0, Math.round(frac.x * width)),
		y: Math.max(0, Math.round(frac.y * height)),
		w: Math.max(2, Math.round(frac.w * width)),
		h: Math.max(2, Math.round(frac.h * height)),
	};
	const fill = regionFill(rect);
	const rtl = cornerRadius(rect, fill, "top-left");
	const rtr = cornerRadius(rect, fill, "top-right");
	const rbl = cornerRadius(rect, fill, "bottom-left");
	const rbr = cornerRadius(rect, fill, "bottom-right");
	const border = borderSignal(rect, fill);
	const ctx = fillVsContext(rect, fill);
	const shadow = shadowSignal(rect, pageBgRgb);

	const borderStr = border.present
		? `${toHex(border.color)} (${Math.round(border.confidence * 100)}%, Δ${border.delta})`
		: "—";

	const bgModeStr =
		ctx.mode === "edge-of-image"
			? "—"
			: ctx.mode === "ghost"
				? `ghost (Δ${ctx.delta})`
				: `filled (Δ${ctx.delta} vs ${toHex(ctx.contextColor)})`;

	console.log(
		name.padEnd(26) +
			`rgb(${fill.join(",")})`.padEnd(20) +
			`${rtl}`.padEnd(6) +
			`${rtr}`.padEnd(6) +
			`${rbl}`.padEnd(6) +
			`${rbr}`.padEnd(6) +
			bgModeStr.padEnd(28) +
			borderStr.padEnd(28) +
			`${shadow.below}${shadow.present ? "*" : ""}`.padEnd(10) +
			shadow.right
	);
}

console.log(
	"\n* radius numbers are in goal-image pixels; map to Tailwind by dividing by the design's pixel-density factor (1× design → r=12 ≈ rounded-xl)."
);
console.log(
	"  bg-mode: 'ghost' = rect fill matches surrounding container within Δ≤8 (button should be transparent). 'filled' = fill differs from surrounding (button has its own bg)."
);
console.log(
	"  border: detected hex if ≥40% of edge samples differ from fill by Δ≥6 RGB. Hairline (`/15` opacity) reads as low confidence + small Δ; solid color reads ≥90% confidence."
);
console.log(
	"  shadow: page-bg luma minus strip-just-outside luma (negative ≈ no shadow). Threshold for '*' = 4."
);
