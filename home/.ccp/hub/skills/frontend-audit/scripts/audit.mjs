#!/usr/bin/env node
/**
 * Mechanical PASS/FAIL audit of a live render against a goal mock.
 *
 * For each region declared in <goal>.regions.json, this script:
 *   1. Extracts fill / radius / border from the GOAL PNG (pixel analysis).
 *   2. Extracts fill / radius / border from the CURRENT element — using
 *      Playwright computed styles if the region carries a `selector`,
 *      otherwise falling back to pixel analysis on the current snap.
 *   3. Computes per-property deltas against fixed tolerances.
 *   4. Prints a PASS/FAIL table.
 *   5. Exits non-zero if any region fails.
 *
 * This script is the SKILL's hard gate — `frontend-audit` declares
 * "done" only when this exits 0. The skill does not allow visual
 * judgment to override the script's verdict.
 *
 * Tolerances (encoded here, not in prose):
 *   FILL_DELTA_MAX           16    RGB Euclidean distance between dominant fills
 *   RADIUS_DELTA_MAX         4     per-corner pixel diff
 *   BORDER_COLOR_DELTA       32    RGB distance when both sides have a border
 *   SIZE_DELTA_PCT           0.18  fractional w/h diff vs region rect (when live size is known)
 *   EDGE_IOU_MIN             0.40  per-region Sobel-edge IoU floor (best across shift window)
 *   EDGE_SHIFT_WINDOW_FRAC_X 0.08  per-region edge-IoU horizontal shift-search window (frac of W)
 *   EDGE_SHIFT_WINDOW_FRAC_Y 0.08  per-region edge-IoU vertical shift-search window (frac of H)
 *   MISSING_BLOB_MIN_AREA    1500  global blob inventory: area threshold for "missing in current"
 *   GRID_DELTA_MAX           80    global grid: per-cell mean luminance Δ ceiling (0–255)
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/audit.mjs \
 *       --goal=<goal.png> --current=<current.png> \
 *       [--regions=<path>] [--url=<path>] [--viewport=WxH] [--json] \
 *       [--no-structural-gate]
 *
 *   --no-structural-gate   Skip the edge-IoU per-region check and the
 *                          global blob/grid drift pass. Use only while
 *                          iterating on early WIP that isn't aligned
 *                          with the goal yet — the structural gate is
 *                          the script's main weapon against silent
 *                          regressions in unauthored areas.
 *
 * Element-binding convention:
 *   regions.json entries may carry EITHER `locator` or `selector`:
 *
 *     "ship-now-btn": { "x":..,"y":..,"w":..,"h":..,
 *                       "locator": { "role": "button", "name": "Ship now" } }
 *
 *     "ship-now-btn": { "x":..,"y":..,"w":..,"h":..,
 *                       "selector": "button.bg-primary" }
 *
 *   `locator` is preferred — it resolves via Playwright's accessibility
 *   tree / text engine and survives class refactors and framework-scoped
 *   style mangling. Generate locators automatically with `bind-selectors.mjs`.
 *   Supported locator shapes:
 *     { "testid": "..." }                  → page.getByTestId
 *     { "role": "...", "name": "..." }     → page.getByRole({ name, exact: true })
 *     { "text": "..." }                    → page.getByText(exact: true)
 *     { "css": "..." }                     → page.locator(css)  // structural, no classes
 *
 *   `selector` is the legacy path — raw CSS that breaks when classes
 *   change. Kept for backwards compatibility; the gate treats both the
 *   same once resolved.
 *
 *   When neither is present, the audit falls back to pixel sampling on
 *   the current snap at the region's fractional coordinates — only works
 *   if goal and current have matching aspect/framing.
 *
 * Environment:
 *   DEV_URL — base URL (default http://localhost:3000)
 */
import { PNG } from "pngjs";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { readImage } from "./_imageio.mjs";
import {
	buildEdgeMap,
	resizePng,
	edgeIouRegionShiftedFast,
	connectedComponents,
	matchBlobs,
	reclassifyShiftedDown,
	pickShiftFactor,
	downsampleBin,
	gridDiff,
	bboxOverlapsAnyFracRegion,
} from "./_structural.mjs";

// ────────────────────────────────────────────────────────────────────────────
// Tolerances — change with care; relaxing these silently weakens the gate.
// ────────────────────────────────────────────────────────────────────────────
const FILL_DELTA_MAX = 16;
const RADIUS_DELTA_MAX = 4;
const BORDER_COLOR_DELTA = 32;
const SIZE_DELTA_PCT = 0.18;
// Structural checks (edge-IoU per region + global blob/grid drift).
// Adapted from analyze.mjs; thresholds tuned against this project's
// goal/current pairs. Override with --no-structural-gate when iterating
// on heavy WIP that's not aligned yet.
const EDGE_IOU_MIN = 0.4;
const MISSING_BLOB_MIN_AREA = 1500;
const GRID_DELTA_MAX = 80;
const STRUCTURAL_EDGE_THRESHOLD = 60;
// Per-region edge-IoU is shift-tolerant: when goal and current have
// different overall layout proportions, the same fractional rect lands
// on different content. Search ±X% of image dimensions for the best-
// matching position, and PASS if found above EDGE_IOU_MIN at any offset.
// This lets the gate distinguish "spatial drift" (acceptable; the
// element is just at a different y) from "missing content" (real fail).
// Set to 0 to disable shift-tolerance and require pixel-perfect alignment.
const EDGE_SHIFT_WINDOW_FRAC_X = 0.08;
const EDGE_SHIFT_WINDOW_FRAC_Y = 0.08;

const args = process.argv.slice(2);
const argMap = Object.fromEntries(
	args
		.filter(a => a.startsWith("--"))
		.map(a => {
			const [k, ...v] = a.replace(/^--/, "").split("=");
			return [k, v.length ? v.join("=") : true];
		})
);

const goalPath = argMap.goal;
const currentPath = argMap.current;
const urlPath = argMap.url;
const emitJson = !!argMap.json;
const noStructural = !!argMap["no-structural-gate"];
const viewport = (argMap.viewport ?? "1297x1213").split("x").map(n => parseInt(n, 10));

if (!goalPath || !fs.existsSync(goalPath)) {
	console.error("Missing or invalid --goal=<png>");
	process.exit(2);
}
if (!currentPath || !fs.existsSync(currentPath)) {
	console.error("Missing or invalid --current=<png>");
	process.exit(2);
}

const defaultRegions = path.join(
	path.dirname(goalPath),
	`${path.basename(goalPath, path.extname(goalPath))}.regions.json`
);
const regionsPath = argMap.regions ?? defaultRegions;
if (!fs.existsSync(regionsPath)) {
	console.error(`Regions file not found: ${regionsPath}`);
	process.exit(2);
}
const allRegions = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
const regions = Object.fromEntries(
	Object.entries(allRegions).filter(([k]) => !k.startsWith("_"))
);

// ────────────────────────────────────────────────────────────────────────────
// PNG sampling primitives (shared with sample-colors.mjs / inspect-shape.mjs)
// ────────────────────────────────────────────────────────────────────────────

// Image reading is delegated to _imageio.mjs which routes PNG → pngjs,
// JPEG → jpeg-js (decoded to the same RGBA buffer shape). The function
// name stays `readPng` for blame continuity but it handles both formats.
function readPng(p) {
	return readImage(p);
}

function regionPixels(png, frac) {
	const { width, height, data } = png;
	const x0 = Math.max(0, Math.round(frac.x * width));
	const y0 = Math.max(0, Math.round(frac.y * height));
	const w0 = Math.max(1, Math.round(frac.w * width));
	const h0 = Math.max(1, Math.round(frac.h * height));
	const pixels = [];
	for (let yy = y0; yy < Math.min(height, y0 + h0); yy++) {
		for (let xx = x0; xx < Math.min(width, x0 + w0); xx++) {
			const idx = (yy * width + xx) << 2;
			pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
		}
	}
	return pixels;
}

function clusterPixels(pixels) {
	// Same 5-bit quantize + merge approach as sample-colors.mjs.
	// Returns the merged cluster list sorted by count descending, with
	// each entry carrying its pixel count so callers can compute area %.
	const QUANT = 3;
	const MERGE_DIST = 18;
	const buckets = new Map();
	for (const [r, g, b] of pixels) {
		const key = ((r >> QUANT) << 16) | ((g >> QUANT) << 8) | (b >> QUANT);
		let bucket = buckets.get(key);
		if (!bucket) {
			bucket = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
			buckets.set(key, bucket);
		}
		bucket.count++;
		bucket.rSum += r;
		bucket.gSum += g;
		bucket.bSum += b;
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
	return merged;
}

function dominantFill(pixels) {
	const merged = clusterPixels(pixels);
	const top = merged[0];
	return top
		? { r: Math.round(top.r), g: Math.round(top.g), b: Math.round(top.b) }
		: { r: 0, g: 0, b: 0 };
}

function dominantClusters(pixels, maxN = 4) {
	// Returns up to maxN clusters with each entry's area fraction (0..1).
	// Used to detect compound backgrounds: a region whose goal-side
	// sampling has two or more significant clusters indicates the rect
	// covers multiple bg-color sub-elements (e.g. a row split into a
	// badge column and a content column). The single-fill dominant probe
	// can't represent that — it only sees the largest cluster.
	const total = Math.max(1, pixels.length);
	const merged = clusterPixels(pixels).slice(0, maxN);
	return merged.map(c => ({
		r: Math.round(c.r),
		g: Math.round(c.g),
		b: Math.round(c.b),
		area: c.count / total,
	}));
}

function detectCompoundBg(clusters, areaThreshold = 0.15, sepDist = 20) {
	// A region has a "compound" bg when its top clusters represent
	// distinct visual sub-regions, not anti-aliasing noise. Heuristic:
	//   - 2+ clusters each above areaThreshold (default 15%) of the rect
	//   - all pairs of significant clusters at least sepDist RGB apart
	// If both conditions hold, the region is compound and the per-cluster
	// match check applies; otherwise the single-fill dominant check
	// suffices.
	const significant = clusters.filter(c => c.area >= areaThreshold);
	if (significant.length < 2) return null;
	for (let i = 0; i < significant.length; i++) {
		for (let j = i + 1; j < significant.length; j++) {
			const d = Math.hypot(
				significant[i].r - significant[j].r,
				significant[i].g - significant[j].g,
				significant[i].b - significant[j].b
			);
			if (d < sepDist) return null;
		}
	}
	return significant;
}

function toHexCluster(c) {
	const hex = v =>
		Math.max(0, Math.min(255, Math.round(v)))
			.toString(16)
			.padStart(2, "0");
	return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
}

function regionRect(png, frac) {
	const { width, height } = png;
	return {
		x: Math.max(0, Math.round(frac.x * width)),
		y: Math.max(0, Math.round(frac.y * height)),
		w: Math.max(2, Math.round(frac.w * width)),
		h: Math.max(2, Math.round(frac.h * height)),
	};
}

function pixelAt(png, x, y) {
	const idx = (y * png.width + x) << 2;
	return [png.data[idx], png.data[idx + 1], png.data[idx + 2]];
}

function rgbDist(a, b) {
	return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function cornerRadius(png, rect, fill, corner, pageBg) {
	// Walk the diagonal from the rect's corner inward. At each step,
	// classify the pixel as "closer to fill" or "closer to page bg" by
	// RGB distance. The transition point is the corner radius.
	//
	// Why not "within MATCH_DIST of fill": for warm-toned designs where
	// the page bg is only ~18 RGB units from the card fill (e.g. cream
	// #f5f0eb vs white #fbfaf9), a static MATCH_DIST=22 misclassifies
	// the corner pixel — which is the page bg showing through the rounded
	// arc — as "fill," returning k=0 and declaring the corner sharp. The
	// pairwise comparison handles that case because even when fill and
	// page bg are close, the corner pixel is closer to one or the other.
	//
	// If fill and pageBg are essentially identical (both visually the
	// same tone, e.g. the rect happens to land on bg-only area), there
	// IS no transition — the function returns 0 honestly.
	const MAX = 32;
	const fillArr = [fill.r, fill.g, fill.b];
	const bgArr = pageBg ? [pageBg.r, pageBg.g, pageBg.b] : null;
	const dirX = corner.includes("right") ? -1 : 1;
	const dirY = corner.includes("bottom") ? -1 : 1;
	const startX = corner.includes("right") ? rect.x + rect.w - 1 : rect.x;
	const startY = corner.includes("bottom") ? rect.y + rect.h - 1 : rect.y;

	// Fast path: if no page bg is known, fall back to the legacy
	// threshold (covers calls that haven't been updated yet).
	if (!bgArr) {
		for (let k = 0; k <= MAX; k++) {
			const px = startX + dirX * k;
			const py = startY + dirY * k;
			if (px < 0 || py < 0 || px >= png.width || py >= png.height) break;
			const p = pixelAt(png, px, py);
			if (Math.hypot(p[0] - fillArr[0], p[1] - fillArr[1], p[2] - fillArr[2]) <= 22) {
				return Math.round(k / 0.293);
			}
		}
		return 0;
	}

	// If fill and page bg are within ~6 RGB units there is no usable
	// transition to find — bail honestly.
	if (Math.hypot(fillArr[0] - bgArr[0], fillArr[1] - bgArr[1], fillArr[2] - bgArr[2]) < 6) {
		return 0;
	}

	for (let k = 0; k <= MAX; k++) {
		const px = startX + dirX * k;
		const py = startY + dirY * k;
		if (px < 0 || py < 0 || px >= png.width || py >= png.height) break;
		const p = pixelAt(png, px, py);
		const distFill = Math.hypot(p[0] - fillArr[0], p[1] - fillArr[1], p[2] - fillArr[2]);
		const distBg = Math.hypot(p[0] - bgArr[0], p[1] - bgArr[1], p[2] - bgArr[2]);
		if (distFill < distBg) {
			return Math.round(k / 0.293);
		}
	}
	return 0;
}

function borderSignal(png, rect, fill) {
	// Probe at multiple insets and pick the strongest signal. A 1px CSS
	// border at 1× export lives at inset=1. The legacy probe at inset=2
	// missed it entirely (sampled interior fill). Sampling 1/2/3 and
	// taking the highest-confidence reading handles 1px borders, 2px
	// borders, and the boundary-AA buffer in one pass.
	const EDGE_DIST = 4;
	const fillArr = [fill.r, fill.g, fill.b];
	const stride = length => Math.max(1, Math.floor((length - 16) / 16));
	const sampleAt = (x, y) => {
		if (x < 0 || y < 0 || x >= png.width || y >= png.height) return null;
		return pixelAt(png, x, y);
	};

	const probeOneInset = inset => {
		const samples = [];
		for (let xx = rect.x + 8; xx < rect.x + rect.w - 8; xx += stride(rect.w)) {
			const top = sampleAt(xx, rect.y + inset);
			const bot = sampleAt(xx, rect.y + rect.h - 1 - inset);
			if (top) samples.push(top);
			if (bot) samples.push(bot);
		}
		for (let yy = rect.y + 8; yy < rect.y + rect.h - 8; yy += stride(rect.h)) {
			const left = sampleAt(rect.x + inset, yy);
			const right = sampleAt(rect.x + rect.w - 1 - inset, yy);
			if (left) samples.push(left);
			if (right) samples.push(right);
		}
		if (samples.length === 0) return null;
		const offEdge = samples.filter(
			p =>
				Math.hypot(p[0] - fillArr[0], p[1] - fillArr[1], p[2] - fillArr[2]) >
				EDGE_DIST
		);
		const confidence = offEdge.length / samples.length;
		if (offEdge.length === 0) return { confidence: 0 };
		const avg = offEdge
			.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0])
			.map(v => Math.round(v / offEdge.length));
		return { confidence, color: { r: avg[0], g: avg[1], b: avg[2] } };
	};

	let best = null;
	for (const inset of [1, 2, 3]) {
		const probe = probeOneInset(inset);
		if (probe && (!best || probe.confidence > best.confidence)) best = probe;
	}
	if (!best || best.confidence < 0.4) {
		return { present: false, confidence: best?.confidence ?? 0 };
	}
	return {
		present: true,
		color: best.color,
		confidence: best.confidence,
	};
}

// ────────────────────────────────────────────────────────────────────────────
// Goal sampling — from PNG only.
// ────────────────────────────────────────────────────────────────────────────

function pageBgFromPng(png) {
	// Sample a small patch near the top-left of the canvas — by
	// convention the design's page background. Reading the top-left
	// (1% inset from the edge) avoids any 0-row anti-alias gradients
	// from the export.
	const pxs = regionPixels(png, { x: 0.01, y: 0.01, w: 0.02, h: 0.02 });
	return dominantFill(pxs);
}

function detectElementBounds(png, hintRect, fill, pageBg) {
	// Start from the hint rect's center and walk outward in each of
	// the 4 cardinal directions until a row/column flips from
	// "mostly fill" to "mostly page bg." That's the element edge in
	// that direction. Authored rects often sit INSIDE the element
	// (you can't pick the corner pixel by eye on a thumb), so the
	// element extends past the hint in all 4 directions. Walking
	// outward — not inward — finds the true bounds.
	const fillArr = [fill.r, fill.g, fill.b];
	const bgArr = [pageBg.r, pageBg.g, pageBg.b];
	// Fill and page bg too similar to distinguish — bail honestly.
	if (
		Math.hypot(
			fillArr[0] - bgArr[0],
			fillArr[1] - bgArr[1],
			fillArr[2] - bgArr[2]
		) < 6
	) {
		return hintRect;
	}
	// A strip is "inside the element" if it has very few page-bg pixels.
	// Using bg-presence (not fill-presence) is robust to text/icons
	// inside the element: a row with the card title has lots of dark
	// glyph pixels that aren't fill, but it doesn't have page bg pixels.
	// The card's TOP edge is the first row above where page bg appears.
	// Walk outward through the element body — which can contain text,
	// icons, faint borders, and AA artifacts — and only stop when a
	// row/column is *dominated* by page bg. Counting "bg-ish" pixels
	// permissively (tolerance 15) but requiring 60% saturation before
	// stopping handles a busy card body without over- or under-shooting.
	const BG_TOLERANCE = 15;
	const BG_FRACTION_THRESHOLD = 0.6;
	const stripBgFraction = (samples) => {
		let bg = 0, total = 0;
		for (const p of samples) {
			if (!p) continue;
			total++;
			const db = Math.hypot(p[0] - bgArr[0], p[1] - bgArr[1], p[2] - bgArr[2]);
			if (db < BG_TOLERANCE) bg++;
		}
		return total > 0 ? bg / total : 1;
	};
	const insideRow = (y, x0, x1) => {
		const samples = [];
		for (let x = x0; x < x1; x++) {
			if (x >= 0 && x < png.width) samples.push(pixelAt(png, x, y));
		}
		return stripBgFraction(samples) < BG_FRACTION_THRESHOLD;
	};
	const insideCol = (x, y0, y1) => {
		const samples = [];
		for (let y = y0; y < y1; y++) {
			if (y >= 0 && y < png.height) samples.push(pixelAt(png, x, y));
		}
		return stripBgFraction(samples) < BG_FRACTION_THRESHOLD;
	};

	const cx = Math.round(hintRect.x + hintRect.w / 2);
	const cy = Math.round(hintRect.y + hintRect.h / 2);
	const MAX_SEARCH = 800;

	// Top edge.
	let top = cy;
	for (let y = cy; y >= Math.max(0, cy - MAX_SEARCH); y--) {
		if (insideRow(y, cx - 100, cx + 100)) top = y;
		else break;
	}
	// Bottom edge.
	let bottom = cy;
	for (let y = cy; y < Math.min(png.height, cy + MAX_SEARCH); y++) {
		if (insideRow(y, cx - 100, cx + 100)) bottom = y;
		else break;
	}
	// Left edge — sample inside the detected vertical range, inset a
	// bit from each end so we don't catch corner rounding as bg.
	const colY0 = top + 20;
	const colY1 = bottom - 20;
	let left = cx;
	for (let x = cx; x >= Math.max(0, cx - MAX_SEARCH); x--) {
		if (insideCol(x, colY0, colY1)) left = x;
		else break;
	}
	let right = cx;
	for (let x = cx; x < Math.min(png.width, cx + MAX_SEARCH); x++) {
		if (insideCol(x, colY0, colY1)) right = x;
		else break;
	}

	const w = right - left + 1;
	const h = bottom - top + 1;
	// Sanity: if the detected rect is degenerate, fall back to hint.
	if (w < 4 || h < 4) return hintRect;
	return { x: left, y: top, w, h };
}

function goalSample(goalPng, frac, pageBg) {
	const pixels = regionPixels(goalPng, frac);
	const hintRect = regionRect(goalPng, frac);
	const probeFill = dominantFill(pixels);
	const rect = detectElementBounds(goalPng, hintRect, probeFill, pageBg);
	const pillRadius = Math.round(Math.min(rect.w, rect.h) / 2);
	const clampR = px => (px > pillRadius ? pillRadius : px);

	// `expect` lets the assistant author the goal truth explicitly,
	// bypassing the heuristic probe. The probe is fragile when the
	// rect is misaligned with the element (a 4px offset swings corner
	// radius readings 4× off). Since the assistant can SEE the goal,
	// writing the values is more reliable than measuring them.
	//
	// Supported shapes:
	//   "expect": { "radius": 16 }
	//   "expect": { "radius": { "tl": 12, "tr": 12, "bl": 0, "br": 0 } }
	//   "expect": { "fill": "#ffffff" }
	//   "expect": { "border": true }                       (presence only)
	//   "expect": { "border": { "color": "#ece4d9" } }    (color too)
	//   "expect": { "border": false }                      (must be absent)
	const expect = frac.expect ?? null;

	let radius;
	if (expect && expect.radius != null) {
		const r = expect.radius;
		// Apply pill-clamp to the expect side too — so `expect.radius: 100`
		// on a small badge effectively means "pill" and matches the live
		// side's clamped value (e.g. 13 for a 26×26 badge). Without this
		// clamp the comparison fails purely on the magnitude mismatch.
		if (typeof r === "number") {
			const c = clampR(r);
			radius = { tl: c, tr: c, bl: c, br: c };
		} else {
			radius = {
				tl: clampR(r.tl ?? 0),
				tr: clampR(r.tr ?? 0),
				bl: clampR(r.bl ?? 0),
				br: clampR(r.br ?? 0),
			};
		}
	} else {
		radius = {
			tl: clampR(cornerRadius(goalPng, rect, probeFill, "top-left", pageBg)),
			tr: clampR(cornerRadius(goalPng, rect, probeFill, "top-right", pageBg)),
			bl: clampR(cornerRadius(goalPng, rect, probeFill, "bottom-left", pageBg)),
			br: clampR(cornerRadius(goalPng, rect, probeFill, "bottom-right", pageBg)),
		};
	}

	let fill;
	if (expect && expect.fill) {
		fill = hexToRgbObj(expect.fill) ?? probeFill;
	} else {
		fill = probeFill;
	}

	let border;
	if (expect && expect.border !== undefined) {
		if (expect.border === false) {
			border = { present: false, color: null };
		} else if (expect.border === true) {
			border = { present: true, color: null };
		} else if (typeof expect.border === "object") {
			border = {
				present: true,
				color: hexToRgbObj(expect.border.color) ?? null,
			};
		} else {
			border = borderSignal(goalPng, rect, fill);
		}
	} else {
		border = borderSignal(goalPng, rect, fill);
	}

	// Cluster signature for compound-bg detection: the top-N color
	// clusters within the region, each with its area fraction. The
	// per-region check uses this to detect when the goal has multiple
	// distinct bg colors (a row split into a badge column and a content
	// column, a card with a leading accent strip, etc.) — cases the
	// single-fill dominant probe collapses into one value.
	const clusters = dominantClusters(pixels);

	return {
		fill,
		radius,
		border,
		clusters,
		sizePx: { w: rect.w, h: rect.h },
		probeFill, // expose so the table shows the probe alongside the expect
	};
}

function hexToRgbObj(hex) {
	if (typeof hex !== "string") return null;
	const m = hex.replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (!m) return null;
	const full = m[1].length === 3 ? m[1].split("").map(c => c + c).join("") : m[1];
	const n = parseInt(full, 16);
	return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
}

// ────────────────────────────────────────────────────────────────────────────
// Current sampling — Playwright when selector is available, PNG otherwise.
// ────────────────────────────────────────────────────────────────────────────

function parseCssColor(s) {
	if (!s) return null;
	const cleaned = s.trim();
	const rgbMatch = cleaned.match(/rgba?\(([^)]+)\)/);
	if (rgbMatch) {
		const parts = rgbMatch[1].split(",").map(p => parseFloat(p.trim()));
		return { r: Math.round(parts[0]), g: Math.round(parts[1]), b: Math.round(parts[2]), a: parts[3] ?? 1 };
	}
	const hexMatch = cleaned.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hexMatch) {
		const h = hexMatch[1];
		const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
		const n = parseInt(full, 16);
		return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
	}
	// lab() — Playwright's computed color() emits CSS color-mix in modern syntax.
	// We don't try to decode it precisely; just signal "unknown" so the audit
	// falls back to PNG sampling for fill, while still trusting border presence.
	return null;
}

function parseRadiusFromCss(borderRadiusStr) {
	// Supports "12px" or "12px 16px" or "12px 16px 8px 4px".
	if (!borderRadiusStr) return { tl: 0, tr: 0, bl: 0, br: 0 };
	const tokens = borderRadiusStr
		.replace(/\(.*?\)/g, "")
		.split(/\s+/)
		.map(t => parseFloat(t))
		.filter(n => !isNaN(n));
	if (tokens.length === 0) return { tl: 0, tr: 0, bl: 0, br: 0 };
	const [a, b = a, c = a, d = b] = tokens;
	return { tl: a, tr: b, br: c, bl: d };
}

function parseBorderShorthand(borderStr) {
	// Returns { present: bool, widthPx: number, color: {r,g,b}|null }
	if (!borderStr || borderStr === "none") return { present: false, widthPx: 0, color: null };
	const widthMatch = borderStr.match(/(\d+(?:\.\d+)?)px/);
	const widthPx = widthMatch ? parseFloat(widthMatch[1]) : 0;
	const colorPart = borderStr.replace(/^\d+(?:\.\d+)?px\s+\w+\s+/, "");
	const color = parseCssColor(colorPart);
	return { present: widthPx > 0, widthPx, color };
}

function resolvePlaywrightLocator(page, loc) {
	// Map a locator descriptor (from regions.json) to a Playwright locator.
	// Returns null if the shape is unrecognized — caller treats that as an
	// error so the gate fails loudly rather than silently skipping.
	if (loc.testid) return page.getByTestId(loc.testid);
	if (loc.role && loc.name) {
		return page.getByRole(loc.role, { name: loc.name, exact: true });
	}
	if (loc.text) return page.getByText(loc.text, { exact: true });
	if (loc.css) return page.locator(loc.css);
	return null;
}

function describeLocator(loc) {
	if (!loc) return "<empty>";
	if (loc.testid) return `testid="${loc.testid}"`;
	if (loc.role && loc.name) return `role="${loc.role}" name="${loc.name}"`;
	if (loc.text) return `text="${loc.text}"`;
	if (loc.css) return `css="${loc.css}"`;
	return JSON.stringify(loc);
}

async function liveSamples(page, regions) {
	// Resolution happens in two passes:
	//   1. For each region with a `locator` or `selector`, use Playwright's
	//      locator API server-side to find the matching DOM node, then tag
	//      that node with a unique `data-fe-region` attribute. Errors at
	//      this stage (zero matches, multiple matches, unrecognized locator
	//      shape) are captured per-region so the audit can surface them as
	//      gate-blocking FAILs rather than silent SKIPs.
	//   2. A single `page.evaluate` reads computed styles for every tagged
	//      node in one round-trip — keeps the existing batched pattern.
	const errors = {};
	for (const [name, frac] of Object.entries(regions)) {
		if (!frac.locator && !frac.selector) continue;
		let locator;
		let describe;
		if (frac.locator) {
			locator = resolvePlaywrightLocator(page, frac.locator);
			describe = describeLocator(frac.locator);
			if (!locator) {
				errors[name] = `unrecognized locator shape: ${describe}`;
				continue;
			}
		} else {
			locator = page.locator(frac.selector);
			describe = `selector="${frac.selector}"`;
		}
		try {
			const count = await locator.count();
			if (count === 0) {
				errors[name] = `${frac.locator ? "locator" : "selector"} did not match: ${describe}`;
				continue;
			}
			if (count > 1) {
				// Multiple matches is ambiguous — use the first but flag it.
				// A unique anchor is the whole point; the assistant should
				// tighten the locator. Don't fail outright (legacy selectors
				// can be ambiguous on purpose), just take .first().
			}
			await locator.first().evaluate((el, regionName) => {
				el.setAttribute("data-fe-region", regionName);
			}, name);
		} catch (e) {
			errors[name] = `${frac.locator ? "locator" : "selector"} resolution error: ${e.message}`;
		}
	}

	const probe = await page.evaluate(regionList => {
		const out = {};
		for (const [name, frac] of regionList) {
			if (!frac.locator && !frac.selector) {
				out[name] = null;
				continue;
			}
			const el = document.querySelector(`[data-fe-region="${name}"]`);
			if (!el) {
				// The pre-pass either errored or didn't tag; downstream
				// uses the `errors` map to surface the reason.
				out[name] = null;
				continue;
			}
			const cs = getComputedStyle(el);
			const rect = el.getBoundingClientRect();
			out[name] = {
				backgroundColor: cs.backgroundColor,
				borderTopWidth: cs.borderTopWidth,
				borderTopColor: cs.borderTopColor,
				borderTopStyle: cs.borderTopStyle,
				borderRadius: cs.borderRadius,
				borderTopLeftRadius: cs.borderTopLeftRadius,
				borderTopRightRadius: cs.borderTopRightRadius,
				borderBottomLeftRadius: cs.borderBottomLeftRadius,
				borderBottomRightRadius: cs.borderBottomRightRadius,
				width: rect.width,
				height: rect.height,
			};
		}
		return out;
	}, Object.entries(regions));

	// Merge resolution errors into the probe map so callers see them.
	for (const [name, msg] of Object.entries(errors)) {
		probe[name] = { error: msg };
	}
	return probe;
}

function liveSampleFromComputed(cs) {
	const fill = parseCssColor(cs.backgroundColor) ?? { r: 0, g: 0, b: 0, a: 0 };
	// Per-corner pixel radii (already in px). `rounded-full` resolves to
	// a huge integer (e.g. 33554400px) — clamp anything bigger than the
	// element's short side to `pillRadius` so the comparison against a
	// goal-detected ~min(w,h)/2 doesn't blow up.
	const w = cs.width || 0;
	const h = cs.height || 0;
	const pillRadius = Math.round(Math.min(w, h) / 2);
	const clampR = px => (px > 1000 ? pillRadius : px);
	const radius = {
		tl: clampR(parseFloat(cs.borderTopLeftRadius) || 0),
		tr: clampR(parseFloat(cs.borderTopRightRadius) || 0),
		bl: clampR(parseFloat(cs.borderBottomLeftRadius) || 0),
		br: clampR(parseFloat(cs.borderBottomRightRadius) || 0),
	};
	const widthPx = parseFloat(cs.borderTopWidth) || 0;
	const borderColor = parseCssColor(cs.borderTopColor);
	const borderStyle = cs.borderTopStyle ?? "none";
	// A border-color with effective alpha below 0.08 reads visually as
	// "no border" — Tailwind's `border-charcoal/8` etc. shouldn't fail a
	// region whose goal has no visible border at the PNG level. The
	// border-color delta check still runs for explicitly bordered
	// regions, this just decides presence.
	const present =
		widthPx > 0 &&
		borderStyle !== "none" &&
		(borderColor?.a ?? 1) > 0.08;
	return {
		fill,
		radius,
		border: { present, widthPx, color: borderColor ?? null },
		sizePx: { w, h },
	};
}

// ────────────────────────────────────────────────────────────────────────────
// Comparison + verdict
// ────────────────────────────────────────────────────────────────────────────

function judgeRegion(goal, cur, frac, goalDims, edgeIou) {
	// Per-region opt-in checks. Default skips `size` because the goal rect
	// is a probe area sized for sampling, not the actual element bounds,
	// so comparing to live width/height produces predictable noise. A
	// region that genuinely wants size enforcement should declare it via
	// `"checks": ["fill", "radius", "border", "size"]`.
	//
	// `edge-iou` is added to the default set when --no-structural-gate
	// isn't set; opt-out per region by authoring `"checks"` without it.
	const defaults = ["fill", "radius", "border", "compound-bg"];
	if (edgeIou !== undefined) defaults.push("edge-iou");
	const enabled = new Set(frac.checks ?? defaults);
	const failures = [];
	const fillDelta = Math.round(rgbDist(goal.fill, cur.fill));
	if (enabled.has("fill") && fillDelta > FILL_DELTA_MAX) {
		failures.push(`fill Δ${fillDelta} > ${FILL_DELTA_MAX} (goal ${toHex(goal.fill)}, cur ${toHex(cur.fill)})`);
	}
	// Compound-bg check: when the goal's pixel sampling shows 2+
	// significant clusters separated by >20 RGB (a row split into
	// a badge column and a content column, a card with a leading
	// accent strip, etc.), the current side must show matching
	// clusters too. The single-fill dominant probe can't represent
	// this: it collapses two bgs into one dominant value, so the
	// `fill` check passes even when a structural sub-region is
	// missing. Disable per region with `"checks": [...]` omitting
	// "compound-bg" — useful when the goal rect intentionally
	// straddles a foreground+background boundary you don't care
	// about (e.g. a region covering an entire card including its
	// background canvas).
	if (enabled.has("compound-bg") && goal.clusters && cur.clusters) {
		// Rect-alignment guard: compound-bg only runs when the cur
		// fractional rect actually lands on the element of interest.
		// When goal and snap have different framing (full-page goal vs
		// element-cropped snap), the same fractional coords point at
		// different content and the cluster comparison is garbage. The
		// reliable signal: if cur.fill (computed bg from getComputedStyle
		// when live, dominant pixel when snap) doesn't appear in
		// cur.clusters above 8% area, the snap rect is mis-aligned —
		// skip rather than report a false positive.
		const rectAligned = cur.clusters.some(
			c =>
				Math.hypot(
					cur.fill.r - c.r,
					cur.fill.g - c.g,
					cur.fill.b - c.b
				) <= FILL_DELTA_MAX + 8 && c.area >= 0.08
		);
		const goalCompound = rectAligned ? detectCompoundBg(goal.clusters) : null;
		if (goalCompound) {
			const missing = goalCompound.filter(gc => {
				return !cur.clusters.some(
					cc =>
						Math.hypot(gc.r - cc.r, gc.g - cc.g, gc.b - cc.b) <=
							FILL_DELTA_MAX + 8 && cc.area >= 0.08
				);
			});
			if (missing.length > 0) {
				const missingStr = missing
					.map(
						m => `${(m.area * 100).toFixed(0)}% ${toHexCluster(m)}`
					)
					.join(" + ");
				const expectedStr = goalCompound
					.map(
						c => `${(c.area * 100).toFixed(0)}% ${toHexCluster(c)}`
					)
					.join(" + ");
				const actualStr = cur.clusters
					.slice(0, 3)
					.map(
						c => `${(c.area * 100).toFixed(0)}% ${toHexCluster(c)}`
					)
					.join(" + ");
				failures.push(
					`compound bg missing sub-region(s): ${missingStr} ` +
						`(goal: ${expectedStr}; cur: ${actualStr})`
				);
			}
		}
	}
	const rDiff = {
		tl: Math.abs(goal.radius.tl - cur.radius.tl),
		tr: Math.abs(goal.radius.tr - cur.radius.tr),
		bl: Math.abs(goal.radius.bl - cur.radius.bl),
		br: Math.abs(goal.radius.br - cur.radius.br),
	};
	const worstR = Math.max(rDiff.tl, rDiff.tr, rDiff.bl, rDiff.br);
	// Pill harmony: when both sides look pill-shaped, absolute pixel
	// deltas don't matter — what matters is "both pill" or "one pill,
	// one not." Use the live element's short side as the reference
	// threshold for BOTH sides; the goal-side rect is heuristic (auto-
	// detect may over-extend into surrounding container space) and
	// using it as the threshold breaks the harmony check on small pills.
	const liveShort = Math.min(cur.sizePx?.w ?? 1, cur.sizePx?.h ?? 1);
	const pillThresh = liveShort * 0.4;
	const curIsPill =
		cur.radius.tl >= pillThresh &&
		cur.radius.tr >= pillThresh &&
		cur.radius.bl >= pillThresh &&
		cur.radius.br >= pillThresh;
	const goalIsPill =
		goal.radius.tl >= pillThresh &&
		goal.radius.tr >= pillThresh &&
		goal.radius.bl >= pillThresh &&
		goal.radius.br >= pillThresh;
	const radiusFails = enabled.has("radius") && worstR > RADIUS_DELTA_MAX && !(curIsPill && goalIsPill);
	if (radiusFails) {
		failures.push(
			`radius Δ tl=${rDiff.tl} tr=${rDiff.tr} bl=${rDiff.bl} br=${rDiff.br} ` +
				`(goal ${goal.radius.tl}/${goal.radius.tr}/${goal.radius.bl}/${goal.radius.br}, ` +
				`cur ${cur.radius.tl}/${cur.radius.tr}/${cur.radius.bl}/${cur.radius.br})`
		);
	}
	if (enabled.has("border")) {
		if (goal.border.present !== cur.border.present) {
			failures.push(
				`border presence mismatch (goal=${goal.border.present ? "yes" : "no"}, cur=${cur.border.present ? "yes" : "no"})`
			);
		} else if (goal.border.present && cur.border.present && cur.border.color) {
			const bd = Math.round(rgbDist(goal.border.color, cur.border.color));
			if (bd > BORDER_COLOR_DELTA) {
				failures.push(
					`border color Δ${bd} > ${BORDER_COLOR_DELTA} (goal ${toHex(goal.border.color)}, cur ${toHex(cur.border.color)})`
				);
			}
		}
	}
	if (enabled.has("size") && cur.source === "live" && goalDims && cur.sizePx?.w > 0) {
		const goalW = goal.sizePx.w * (cur.viewportW / goalDims.width);
		const goalH = goal.sizePx.h * (cur.viewportH / goalDims.height);
		const dw = Math.abs(cur.sizePx.w - goalW) / Math.max(goalW, 1);
		const dh = Math.abs(cur.sizePx.h - goalH) / Math.max(goalH, 1);
		if (dw > SIZE_DELTA_PCT || dh > SIZE_DELTA_PCT) {
			failures.push(
				`size Δ ${(dw * 100).toFixed(0)}%w / ${(dh * 100).toFixed(0)}%h ` +
					`(expected ~${goalW.toFixed(0)}×${goalH.toFixed(0)}, got ${cur.sizePx.w.toFixed(0)}×${cur.sizePx.h.toFixed(0)})`
			);
		}
	}
	if (enabled.has("edge-iou") && edgeIou !== undefined) {
		// Edge-IoU compares edge presence between the goal rect and a
		// shift-search-best-matching rect on the resized current snap.
		// PASSES if a high-IoU position is found within the shift
		// window — this lets the gate ignore spatial drift caused by
		// layout-proportion mismatches between goal and current, while
		// still catching genuinely missing content.
		const bestIou = edgeIou.iou;
		const origIou = edgeIou.originalIou;
		const shifted = Math.abs(edgeIou.dx) > 0 || Math.abs(edgeIou.dy) > 0;
		if (bestIou < EDGE_IOU_MIN) {
			const shiftNote = shifted
				? ` (best after ±shift search; orig=${origIou.toFixed(2)} at ` +
					`offset (${edgeIou.dx >= 0 ? "+" : ""}${edgeIou.dx},` +
					`${edgeIou.dy >= 0 ? "+" : ""}${edgeIou.dy}))`
				: "";
			failures.push(
				`edge-iou ${bestIou.toFixed(2)} < ${EDGE_IOU_MIN}${shiftNote} ` +
					`(structural mismatch — divider/border/text in this rect ` +
					`differs between goal and current)`
			);
		}
	}
	return { failures, fillDelta, rDiff, worstR, edgeIou };
}

function toHex(c) {
	if (!c) return "—";
	const h = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
	return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

function writeEdgeDiffPng(goalEdge, currEdge, W, H, frac, outPath) {
	// Generate a visual diff of edge maps for one region rect:
	//   red    = goal-only edges (present in goal, absent in current)
	//   blue   = current-only edges (present in current, absent in goal)
	//   purple = overlap (present in both — these are the edges that
	//            DO line up; visualizing them helps confirm the rect
	//            is aimed at the right element)
	//   light cream bg
	// The output makes "structural mismatch" failures actionable: a
	// glance at the PNG shows exactly which edges are missing/extra,
	// which translates directly to UI work (a missing vertical line
	// = a missing column seam; a missing horizontal line = a missing
	// divider; etc.).
	const x0 = Math.max(0, Math.round(frac.x * W));
	const y0 = Math.max(0, Math.round(frac.y * H));
	const w = Math.max(1, Math.min(W - x0, Math.round(frac.w * W)));
	const h = Math.max(1, Math.min(H - y0, Math.round(frac.h * H)));
	const out = new PNG({ width: w, height: h });
	for (let yy = 0; yy < h; yy++) {
		for (let xx = 0; xx < w; xx++) {
			const srcIdx = (y0 + yy) * W + (x0 + xx);
			const dstIdx = (yy * w + xx) << 2;
			const g = goalEdge[srcIdx] ? 1 : 0;
			const c = currEdge[srcIdx] ? 1 : 0;
			let r = 0xf5,
				gC = 0xf0,
				b = 0xe8; // soft cream bg
			if (g && c) {
				r = 0x9d;
				gC = 0x37;
				b = 0xc8; // purple
			} else if (g) {
				r = 0xc8;
				gC = 0x2b;
				b = 0x2b; // red — goal only
			} else if (c) {
				r = 0x2b;
				gC = 0x6c;
				b = 0xc8; // blue — current only
			}
			out.data[dstIdx] = r;
			out.data[dstIdx + 1] = gC;
			out.data[dstIdx + 2] = b;
			out.data[dstIdx + 3] = 0xff;
		}
	}
	fs.writeFileSync(outPath, PNG.sync.write(out));
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

const goalPng = readPng(goalPath);
const currentPngRaw = readPng(currentPath);
const currentPng = currentPngRaw;
const goalPageBg = pageBgFromPng(goalPng);
const currentPageBg = pageBgFromPng(currentPng);

// Structural pass: build edge maps and grid-diff against the goal once.
// The current PNG is resized to goal dimensions for spatial alignment —
// nearest-neighbour is fine because the edge/luma comparisons only care
// about presence, not perceptual quality.
const W = goalPng.width;
const H = goalPng.height;
let edgeIouByRegion = null;
let structuralFindings = null;
// Edge maps are computed inside the structural pass but referenced
// later by the per-region edge-diff PNG writer (called from the
// failure loop). Hoisted so the writer can crop the same arrays.
let goalEdgeMap = null;
let currEdgeMap = null;
if (!noStructural) {
	const currentResized = resizePng(currentPngRaw, W, H);
	const { gray: goalGray, edge: goalEdge } = buildEdgeMap(
		goalPng,
		STRUCTURAL_EDGE_THRESHOLD
	);
	const { gray: currGray, edge: currEdge } = buildEdgeMap(
		currentResized,
		STRUCTURAL_EDGE_THRESHOLD
	);
	goalEdgeMap = goalEdge;
	currEdgeMap = currEdge;
	edgeIouByRegion = {};
	const maxShiftX = Math.round(W * EDGE_SHIFT_WINDOW_FRAC_X);
	const maxShiftY = Math.round(H * EDGE_SHIFT_WINDOW_FRAC_Y);
	// Pre-downsample both edge maps once so each region's coarse
	// search reuses them. Same factor heuristic the global blob shift
	// filter uses (~500px working width).
	const shiftFactor = pickShiftFactor(W);
	const goalDown = downsampleBin(goalEdge, W, H, shiftFactor);
	const currDown = downsampleBin(currEdge, W, H, shiftFactor);
	for (const [name, frac] of Object.entries(regions)) {
		const result = edgeIouRegionShiftedFast(
			goalEdge,
			currEdge,
			W,
			H,
			goalDown.bin,
			currDown.bin,
			goalDown.w,
			goalDown.h,
			shiftFactor,
			frac,
			maxShiftX,
			maxShiftY
		);
		edgeIouByRegion[name] = result;
	}
	// Global blob inventory + shift filter — flags structural drift in
	// areas the user didn't author a region for.
	const goalBlobs = connectedComponents(goalEdge, W, H).filter(
		b => b.area >= 200
	);
	const currBlobs = connectedComponents(currEdge, W, H).filter(
		b => b.area >= 200
	);
	const blobMatch = matchBlobs(goalBlobs, currBlobs, 0.3);
	const maxShiftPx = Math.round(Math.hypot(W, H) * 0.15);
	const shiftPass = reclassifyShiftedDown(
		blobMatch.missing,
		blobMatch.extra,
		goalEdge,
		currEdge,
		W,
		H,
		maxShiftPx,
		0.5,
		pickShiftFactor(W)
	);
	// Only blobs (a) still missing, (b) above MIN_AREA, (c) outside any
	// authored region count as gate failures. Inside-region drift is
	// already covered by per-region edge-IoU.
	const driftBlobs = shiftPass.stillMissing
		.filter(b => b.area >= MISSING_BLOB_MIN_AREA)
		.filter(b => !bboxOverlapsAnyFracRegion(b, regions, W, H));
	const cells = gridDiff(goalGray, currGray, W, H, 32, 32);
	const driftCells = cells
		.filter(c => c.delta >= GRID_DELTA_MAX)
		.filter(c => !bboxOverlapsAnyFracRegion(c, regions, W, H))
		.sort((a, b) => b.delta - a.delta)
		.slice(0, 10);
	structuralFindings = { driftBlobs, driftCells };
}

let liveProbe = null;
let viewportSize = null;
const hasLiveBindings = Object.values(regions).some(
	r => r.selector || r.locator
);
if (hasLiveBindings) {
	if (!urlPath) {
		console.error(
			"regions.json declares locators/selectors but --url=<path> was not provided. " +
				"Pass the dev path so the audit can inspect live computed styles."
		);
		process.exit(2);
	}
	const baseUrl = process.env.DEV_URL ?? "http://localhost:3000";
	const fullUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : "/" + urlPath}`;
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: viewport[0], height: viewport[1] },
	});
	const page = await context.newPage();
	await page.goto(fullUrl, { waitUntil: "networkidle" });
	await page.waitForTimeout(1200);
	liveProbe = await liveSamples(page, regions);
	viewportSize = { w: viewport[0], h: viewport[1] };
	await browser.close();
}

const results = {};
for (const [name, frac] of Object.entries(regions)) {
	const goal = goalSample(goalPng, frac, goalPageBg);
	const probe = liveProbe?.[name];

	let cur;
	if (probe && !probe.error) {
		const live = liveSampleFromComputed(probe);
		cur = {
			...live,
			source: "live",
			viewportW: viewportSize.w,
			viewportH: viewportSize.h,
		};
	} else if (probe?.error) {
		cur = { error: probe.error };
	} else {
		const pixels = regionPixels(currentPng, frac);
		const rect = regionRect(currentPng, frac);
		const fill = dominantFill(pixels);
		cur = {
			fill,
			radius: {
				tl: cornerRadius(currentPng, rect, fill, "top-left", currentPageBg),
				tr: cornerRadius(currentPng, rect, fill, "top-right", currentPageBg),
				bl: cornerRadius(currentPng, rect, fill, "bottom-left", currentPageBg),
				br: cornerRadius(currentPng, rect, fill, "bottom-right", currentPageBg),
			},
			border: borderSignal(currentPng, rect, fill),
			sizePx: { w: rect.w, h: rect.h },
			source: "snap",
		};
	}

	// Compound-bg cluster signature for the current side is ALWAYS
	// sampled from the snap PNG, regardless of whether the live probe
	// produced computed styles. `getComputedStyle` only gives one
	// `background-color`; it can't tell us that a row visually contains
	// two distinct bg sub-regions. PNG cluster sampling is the only way
	// to spot compound bgs on the current side.
	if (!cur.error) {
		cur.clusters = dominantClusters(regionPixels(currentPng, frac));
	}

	if (cur.error) {
		results[name] = { status: "ERROR", reason: cur.error };
		continue;
	}

	const judgment = judgeRegion(
		goal,
		cur,
		frac,
		goalPng,
		edgeIouByRegion ? edgeIouByRegion[name] : undefined
	);
	// SKIP status: when --url is provided and the region has no binding,
	// the current side falls back to PNG-sampling at the same fractional
	// coords on the snap. If the snap and goal have different aspect ratio
	// or framing (the common case when the live element is in a narrower
	// container than the goal canvas), those fractional coords land on
	// the wrong pixels and produce false PASSes or FAILs. Mark these as
	// SKIP so the gate doesn't depend on them, but still print so the
	// author can decide whether to upgrade them with locators.
	const skipped = cur.source === "snap" && hasLiveBindings;
	let status;
	if (judgment.failures.length === 0) {
		status = skipped ? "SKIP" : "PASS";
	} else {
		status = skipped ? "SKIP" : "FAIL";
	}
	results[name] = { status, goal, cur, judgment };
}

const passes = Object.values(results).filter(r => r.status === "PASS").length;
const fails = Object.values(results).filter(r => r.status === "FAIL").length;
const errors = Object.values(results).filter(r => r.status === "ERROR").length;
const skips = Object.values(results).filter(r => r.status === "SKIP").length;

if (emitJson) {
	console.log(JSON.stringify({ results, passes, fails, errors }, null, 2));
	process.exit(fails + errors > 0 ? 1 : 0);
}

const HEADER =
	"Region".padEnd(32) +
	"ΔFill".padEnd(8) +
	"r-goal".padEnd(14) +
	"r-cur".padEnd(14) +
	"Δr".padEnd(6) +
	"Border".padEnd(14) +
	"E-IoU".padEnd(8) +
	"Source".padEnd(8) +
	"Verdict";
console.log(`\nAudit: goal=${path.relative(process.cwd(), goalPath)}`);
console.log(`       current=${path.relative(process.cwd(), currentPath)}`);
console.log(`       regions=${path.relative(process.cwd(), regionsPath)}`);
if (urlPath) console.log(`       url=${urlPath} (live computed styles)`);
const tolLine =
	`Tolerances: fill Δ≤${FILL_DELTA_MAX}, radius Δ≤${RADIUS_DELTA_MAX}px, ` +
	`border color Δ≤${BORDER_COLOR_DELTA}` +
	(noStructural ? " (structural gate disabled)" : `, edge-IoU ≥${EDGE_IOU_MIN}`);
console.log(tolLine + "\n");
console.log(HEADER);
console.log("-".repeat(HEADER.length + 6));

for (const [name, r] of Object.entries(results)) {
	if (r.status === "ERROR") {
		console.log(name.padEnd(32) + "  —  " + r.reason);
		continue;
	}
	const goalR = `${r.goal.radius.tl}/${r.goal.radius.tr}/${r.goal.radius.bl}/${r.goal.radius.br}`;
	const curR = `${r.cur.radius.tl.toFixed(0)}/${r.cur.radius.tr.toFixed(0)}/${r.cur.radius.bl.toFixed(0)}/${r.cur.radius.br.toFixed(0)}`;
	const borderStr =
		r.goal.border.present === r.cur.border.present
			? r.goal.border.present
				? "both"
				: "neither"
			: `goal=${r.goal.border.present ? "y" : "n"}/cur=${r.cur.border.present ? "y" : "n"}`;
	let iouStr;
	if (r.judgment.edgeIou === undefined) {
		iouStr = "—";
	} else {
		const e = r.judgment.edgeIou;
		const shifted = Math.abs(e.dx) > 0 || Math.abs(e.dy) > 0;
		// `*` after the IoU means "best found via shift; orig was lower".
		// e.g. 0.71* = 0.71 IoU at a non-zero offset.
		iouStr = shifted ? `${e.iou.toFixed(2)}*` : e.iou.toFixed(2);
	}
	console.log(
		name.padEnd(32) +
			String(r.judgment.fillDelta).padEnd(8) +
			goalR.padEnd(14) +
			curR.padEnd(14) +
			String(r.judgment.worstR).padEnd(6) +
			borderStr.padEnd(14) +
			iouStr.padEnd(8) +
			r.cur.source.padEnd(8) +
			r.status
	);
}

// Global structural pass — flags drift in unauthored areas.
let structuralFails = 0;
if (structuralFindings) {
	const { driftBlobs, driftCells } = structuralFindings;
	structuralFails = driftBlobs.length + driftCells.length;
	if (structuralFails > 0) {
		console.log(`\nStructural drift (outside authored regions):`);
		if (driftBlobs.length > 0) {
			console.log(
				`  Missing blobs ≥${MISSING_BLOB_MIN_AREA}px²: ${driftBlobs.length}  ` +
					`(present in goal, absent in current at any nearby offset)`
			);
			for (const b of driftBlobs.slice(0, 8)) {
				console.log(
					`    bbox=(${b.x},${b.y}, ${b.w}×${b.h})  area=${b.area}px²`
				);
			}
			if (driftBlobs.length > 8) {
				console.log(`    … and ${driftBlobs.length - 8} more`);
			}
		}
		if (driftCells.length > 0) {
			console.log(
				`  Grid cells with luminance Δ ≥${GRID_DELTA_MAX}: ${driftCells.length}  ` +
					`(top ${Math.min(driftCells.length, 10)} shown)`
			);
			for (const c of driftCells) {
				console.log(
					`    bbox=(${c.x},${c.y}, ${c.w}×${c.h})  Δ=${c.delta.toFixed(1)}`
				);
			}
		}
		console.log(
			`  Tip: if these are intentional (e.g., copy changes the user requested), ` +
				`add a region in regions.json so the per-region check covers it; ` +
				`or pass --no-structural-gate to skip this section.`
		);
	}
}

if (fails > 0 || errors > 0 || structuralFails > 0) {
	// Errors block the gate just like fails (an unresolved locator is a
	// regression, not "we'll figure it out next time"). Lead the verdict
	// with a clear "BLOCKED" headline so a glance can't misread "0 FAIL"
	// as a pass when there are unresolved regions — that ambiguity is
	// how silent regressions slip past the gate.
	const blocking = fails + errors + structuralFails;
	const parts = [];
	if (fails > 0) parts.push(`${fails} FAIL`);
	if (errors > 0) parts.push(`${errors} ERROR (unresolved binding)`);
	if (structuralFails > 0) parts.push(`${structuralFails} STRUCTURAL drift`);
	console.log(`\nGATE BLOCKED — ${blocking} issue(s): ${parts.join(", ")}`);
	console.log(`(${passes} PASS, ${skips} SKIP)\n`);
	// Generate per-region edge-diff PNGs for any region whose edge-IoU
	// flagged. Written alongside the current snap so they're easy to
	// find. Failure messages reference the PNG path so a human can
	// open it directly. (Best-effort — silently skipped if structural
	// pass was disabled or the writer throws.)
	const edgeDiffPaths = {};
	if (goalEdgeMap && currEdgeMap) {
		const debugDir = path.join(path.dirname(currentPath));
		try {
			fs.mkdirSync(debugDir, { recursive: true });
		} catch {}
		for (const [name, r] of Object.entries(results)) {
			if (r.status !== "FAIL") continue;
			const hasEdgeFailure = r.judgment.failures.some(f =>
				f.startsWith("edge-iou")
			);
			if (!hasEdgeFailure) continue;
			const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
			const diffPath = path.join(debugDir, `edge-diff-${safeName}.png`);
			try {
				writeEdgeDiffPng(
					goalEdgeMap,
					currEdgeMap,
					W,
					H,
					regions[name],
					diffPath
				);
				edgeDiffPaths[name] = diffPath;
			} catch {
				// Don't let visualization failures mask the actual gate failure.
			}
		}
	}

	console.log("Failure details:");
	for (const [name, r] of Object.entries(results)) {
		if (r.status !== "FAIL") continue;
		console.log(`  ${name}:`);
		for (const f of r.judgment.failures) console.log(`    - ${f}`);
		if (edgeDiffPaths[name]) {
			console.log(
				`    → edge diff: ${path.relative(process.cwd(), edgeDiffPaths[name])}  ` +
					`(red = goal-only, blue = current-only, purple = overlap)`
			);
		}
	}
	if (errors > 0) {
		console.log("\nUnresolved bindings (count as gate failures):");
		for (const [name, r] of Object.entries(results)) {
			if (r.status !== "ERROR") continue;
			console.log(`  ${name}: ${r.reason}`);
		}
		console.log(
			"  Tip: run `bun .../scripts/bind-selectors.mjs --regions=<file> --url=<path>` " +
				"to rebind these to live elements automatically."
		);
	}
	if (skips > 0) {
		console.log(
			`\nNote: ${skips} region(s) marked SKIP — they have no locator and ` +
				`fell back to PNG sampling on the current snap, which is unreliable ` +
				`when goal and current frames differ. Add a locator (or run ` +
				`bind-selectors.mjs with --include-rect) to elevate them into the gate.`
		);
	}
	console.log(
		"\nGate: this audit must exit 0 before the iteration can be declared done."
	);
	process.exit(1);
} else {
	const struct = noStructural
		? " (structural gate disabled)"
		: " (structural gate clean)";
	console.log(`\nAll ${passes} regions PASS (${skips} SKIP)${struct}.`);
	process.exit(0);
}
