#!/usr/bin/env node
/**
 * Programmatic structural-difference analysis between a goal PNG and a
 * current snap. Designed to surface what visual-judgment misses at thumb
 * size: missing dividers, missing card outlines, blob-count drift, and
 * localized luminance shifts.
 *
 * Three checks, all numeric and printed as text — no PNG eyeballing
 * required:
 *
 *   1. EDGE-IoU
 *      Sobel both images, threshold, dilate by 1px to absorb AA
 *      jitter, then compute Intersection-over-Union of the binary edge
 *      maps. Global score plus per-region scores when a sibling
 *      regions.json exists. Catches "the hairline divider is gone" and
 *      "the card has lost its border" — the kind of single-pixel-wide
 *      structural change that disappears when the diff PNG is rendered
 *      at thumb size.
 *
 *   2. BLOB INVENTORY
 *      Connected-component labelling on the dilated edge map. Each
 *      blob is one rough "shape group" (a card outline, a button, a
 *      text run). Match goal-blobs to current-blobs greedily by bbox
 *      IoU. Reports: matched count, missing-in-current count and
 *      bboxes, extra-in-current count and bboxes, average size delta
 *      on matched blobs. Catches "the goal has 5 buttons, current has
 *      4" — a structural failure that audit.mjs can't see when no
 *      region was authored for the missing button.
 *
 *   3. GRID LUMINANCE DIFF
 *      Tile both images into a coarse N×N grid, compute mean absolute
 *      luminance difference per cell, sort, print the top-K cells
 *      with (x, y, w, h) and Δ. Localizes drift that pixel-diff PNGs
 *      bury in noise: a 6% luminance shift across a card region tells
 *      you the bg color is off; a 20% shift in one cell tells you a
 *      decoration is mispositioned.
 *
 * The goal and current need not be the same dimensions; current is
 * resized (nearest-neighbour) to match goal before any comparison.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/analyze.mjs \
 *       --goal=<goal.png> --current=<current.png> \
 *       [--regions=<regions.json>] [--debug]
 *       [--edge-threshold=60] [--grid=32x32] [--top-k=10]
 *       [--min-blob=200] [--blob-iou=0.3]
 *
 *   --regions=<path>     Defaults to <goal-stem>.regions.json. If found,
 *                        prints per-region edge-IoU.
 *   --debug              Writes diagnostic PNGs to <current-dir>/_analyze-*.png:
 *                          edge-goal.png        white edges on black
 *                          edge-cur.png         white edges on black
 *                          edge-overlay.png     red=goal-only, cyan=cur-only,
 *                                               white=both
 *                          grid.png             heatmap of per-cell luma Δ
 *                          blobs-goal.png       goal w/ blob bboxes overlaid
 *                          blobs-cur.png        current w/ blob bboxes overlaid
 *   --edge-threshold=N   Sobel magnitude cutoff (0-255). Lower → more edges
 *                        (text + AA noise included); higher → only strong
 *                        outlines. Default 60.
 *   --grid=WxH           Grid resolution for the luminance diff. Default 32x32.
 *   --top-k=N            How many worst grid cells to print. Default 10.
 *   --min-blob=N         Drop blobs smaller than N pixels (after dilation).
 *                        Default 200 — filters out individual glyphs.
 *   --blob-iou=F         Bbox-IoU threshold for matching goal/current blobs.
 *                        Default 0.3.
 *   --shift-threshold=F  Template-match score (0..1) above which an unmatched
 *                        goal blob is reclassified from "missing" to "shifted".
 *                        Default 0.5 — adapted from vzat/comparing_images'
 *                        template-match-as-false-positive-filter idea: a blob
 *                        that exists in the other image at any nearby offset
 *                        is moved, not gone.
 *   --shift-window=F     Max search shift as fraction of image diagonal.
 *                        Default 0.15 — prevents pathological cross-image
 *                        matches (a button blob "found" in the opposite corner).
 *
 * Exit code: always 0. This script is a diagnostic, not a gate. Wire it
 * into audit.mjs once the metrics are tuned to your project.
 */
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";
import { readImage } from "./_imageio.mjs";
import {
	buildEdgeMap,
	resizePng,
	edgeIouGlobal,
	edgeIouRegion,
	connectedComponents,
	matchBlobs,
	reclassifyShiftedDown,
	pickShiftFactor,
	gridDiff,
} from "./_structural.mjs";

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
const currPath = argMap.current;
if (!goalPath || !fs.existsSync(goalPath)) {
	console.error("Missing or invalid --goal=<png>");
	process.exit(2);
}
if (!currPath || !fs.existsSync(currPath)) {
	console.error("Missing or invalid --current=<png>");
	process.exit(2);
}

const debug = !!argMap.debug;
const edgeThreshold = parseInt(argMap["edge-threshold"] ?? "60", 10);
const [gridW, gridH] = (argMap.grid ?? "32x32")
	.split("x")
	.map(n => parseInt(n, 10));
const topK = parseInt(argMap["top-k"] ?? "10", 10);
const minBlob = parseInt(argMap["min-blob"] ?? "200", 10);
const blobIouThresh = parseFloat(argMap["blob-iou"] ?? "0.3");
const shiftThresh = parseFloat(argMap["shift-threshold"] ?? "0.5");
const shiftWindowFrac = parseFloat(argMap["shift-window"] ?? "0.15");

const defaultRegions = path.join(
	path.dirname(goalPath),
	`${path.basename(goalPath, path.extname(goalPath))}.regions.json`
);
const regionsPath = argMap.regions ?? defaultRegions;
const regions = fs.existsSync(regionsPath)
	? Object.fromEntries(
			Object.entries(
				JSON.parse(fs.readFileSync(regionsPath, "utf8"))
			).filter(([k]) => !k.startsWith("_"))
		)
	: null;

// ────────────────────────────────────────────────────────────────────────────
// Image primitives
// ────────────────────────────────────────────────────────────────────────────

function readPng(p) {
	return readImage(p);
}

// Image-analysis primitives (toGrayscale / sobel / dilate / IoU /
// CCL / shift-search / gridDiff) live in ./_structural.mjs and are
// imported above. Only PNG I/O and debug-overlay writers are kept
// local to this script — they're analyze.mjs-specific.

// ────────────────────────────────────────────────────────────────────────────
// Debug PNG writers
// ────────────────────────────────────────────────────────────────────────────

function writeBinAsPng(bin, w, h, outPath, color = [255, 255, 255]) {
	const png = new PNG({ width: w, height: h });
	for (let i = 0; i < bin.length; i++) {
		const di = i << 2;
		const v = bin[i] ? 1 : 0;
		png.data[di] = v ? color[0] : 0;
		png.data[di + 1] = v ? color[1] : 0;
		png.data[di + 2] = v ? color[2] : 0;
		png.data[di + 3] = 255;
	}
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, PNG.sync.write(png));
}

function writeEdgeOverlay(goalBin, curBin, w, h, outPath) {
	// Red = present in goal only (regression: thing was there, now gone).
	// Cyan = present in current only (false addition).
	// White = present in both (matched edge).
	const png = new PNG({ width: w, height: h });
	for (let i = 0; i < goalBin.length; i++) {
		const di = i << 2;
		const g = goalBin[i];
		const c = curBin[i];
		if (g && c) {
			png.data[di] = 255;
			png.data[di + 1] = 255;
			png.data[di + 2] = 255;
		} else if (g) {
			png.data[di] = 255;
			png.data[di + 1] = 40;
			png.data[di + 2] = 40;
		} else if (c) {
			png.data[di] = 40;
			png.data[di + 1] = 220;
			png.data[di + 2] = 220;
		} else {
			png.data[di] = 12;
			png.data[di + 1] = 12;
			png.data[di + 2] = 16;
		}
		png.data[di + 3] = 255;
	}
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, PNG.sync.write(png));
}

function writeGridHeatmap(cells, w, h, cellsW, cellsH, outPath) {
	const png = new PNG({ width: w, height: h });
	const maxDelta = Math.max(1, ...cells.map(c => c.delta));
	for (const c of cells) {
		const norm = c.delta / maxDelta; // 0..1
		// Cool→hot: black → red → yellow → white.
		const r = Math.round(Math.min(255, norm * 510));
		const g = Math.round(Math.max(0, Math.min(255, (norm - 0.5) * 510)));
		const b = Math.round(Math.max(0, Math.min(255, (norm - 0.85) * 1700)));
		for (let y = c.y; y < c.y + c.h; y++) {
			for (let x = c.x; x < c.x + c.w; x++) {
				const di = (y * w + x) << 2;
				png.data[di] = r;
				png.data[di + 1] = g;
				png.data[di + 2] = b;
				png.data[di + 3] = 255;
			}
		}
	}
	// Faint grid lines so cell boundaries are visible.
	const stepX = w / cellsW;
	const stepY = h / cellsH;
	for (let cy = 0; cy <= cellsH; cy++) {
		const yy = Math.min(h - 1, Math.round(cy * stepY));
		for (let x = 0; x < w; x++) {
			const di = (yy * w + x) << 2;
			png.data[di] = Math.min(255, png.data[di] + 30);
			png.data[di + 1] = Math.min(255, png.data[di + 1] + 30);
			png.data[di + 2] = Math.min(255, png.data[di + 2] + 30);
		}
	}
	for (let cx = 0; cx <= cellsW; cx++) {
		const xx = Math.min(w - 1, Math.round(cx * stepX));
		for (let y = 0; y < h; y++) {
			const di = (y * w + xx) << 2;
			png.data[di] = Math.min(255, png.data[di] + 30);
			png.data[di + 1] = Math.min(255, png.data[di + 1] + 30);
			png.data[di + 2] = Math.min(255, png.data[di + 2] + 30);
		}
	}
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, PNG.sync.write(png));
}

function writeBlobsOverlay(srcPng, blobs, outPath, color) {
	const png = new PNG({ width: srcPng.width, height: srcPng.height });
	png.data.set(srcPng.data);
	const drawHLine = (x0, x1, y) => {
		if (y < 0 || y >= png.height) return;
		for (let x = Math.max(0, x0); x < Math.min(png.width, x1); x++) {
			const di = (y * png.width + x) << 2;
			png.data[di] = color[0];
			png.data[di + 1] = color[1];
			png.data[di + 2] = color[2];
			png.data[di + 3] = 255;
		}
	};
	const drawVLine = (x, y0, y1) => {
		if (x < 0 || x >= png.width) return;
		for (let y = Math.max(0, y0); y < Math.min(png.height, y1); y++) {
			const di = (y * png.width + x) << 2;
			png.data[di] = color[0];
			png.data[di + 1] = color[1];
			png.data[di + 2] = color[2];
			png.data[di + 3] = 255;
		}
	};
	for (const b of blobs) {
		drawHLine(b.x, b.x + b.w, b.y);
		drawHLine(b.x, b.x + b.w, b.y + b.h - 1);
		drawVLine(b.x, b.y, b.y + b.h);
		drawVLine(b.x + b.w - 1, b.y, b.y + b.h);
	}
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, PNG.sync.write(png));
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

const goalPngRaw = readPng(goalPath);
const currPngRaw = readPng(currPath);
const W = goalPngRaw.width;
const H = goalPngRaw.height;
const goalPng = goalPngRaw;
const currPng = resizePng(currPngRaw, W, H);

const { gray: goalGray, edge: goalEdge } = buildEdgeMap(goalPng, edgeThreshold);
const { gray: currGray, edge: currEdge } = buildEdgeMap(currPng, edgeThreshold);

const goalBlobs = connectedComponents(goalEdge, W, H).filter(
	b => b.area >= minBlob
);
const currBlobs = connectedComponents(currEdge, W, H).filter(
	b => b.area >= minBlob
);
const blobMatch = matchBlobs(goalBlobs, currBlobs, blobIouThresh);

const maxShiftPx = Math.round(Math.hypot(W, H) * shiftWindowFrac);
const shiftFactor = pickShiftFactor(W);
const shiftPass = reclassifyShiftedDown(
	blobMatch.missing,
	blobMatch.extra,
	goalEdge,
	currEdge,
	W,
	H,
	maxShiftPx,
	shiftThresh,
	shiftFactor
);
blobMatch.missing = shiftPass.stillMissing;
blobMatch.extra = shiftPass.stillExtra;
blobMatch.shifted = shiftPass.shifted;

const cells = gridDiff(goalGray, currGray, W, H, gridW, gridH);
cells.sort((a, b) => b.delta - a.delta);

const globalIou = edgeIouGlobal(goalEdge, currEdge);

// ────────────────────────────────────────────────────────────────────────────
// Report
// ────────────────────────────────────────────────────────────────────────────

const rel = p => path.relative(process.cwd(), p);
console.log(`\nanalyze: goal=${rel(goalPath)} (${W}×${H})`);
console.log(`         current=${rel(currPath)} (${currPngRaw.width}×${currPngRaw.height}, resized to ${W}×${H})`);
if (regions) console.log(`         regions=${rel(regionsPath)}`);
console.log(
	`         params: edge-threshold=${edgeThreshold}, grid=${gridW}×${gridH}, top-k=${topK}, min-blob=${minBlob}, blob-iou=${blobIouThresh}`
);

console.log(`\n[1] Edge-IoU`);
console.log(`    Global: ${globalIou.toFixed(3)}  (1.000 = identical edges, 0.000 = nothing in common)`);

if (regions) {
	const perRegion = Object.entries(regions).map(([name, frac]) => ({
		name,
		...edgeIouRegion(goalEdge, currEdge, W, H, frac),
	}));
	perRegion.sort((a, b) => a.iou - b.iou);
	console.log(`    Per region (worst first):`);
	for (const r of perRegion) {
		const flag = r.iou < 0.4 ? "  ⚑" : r.iou < 0.6 ? "  ·" : "";
		console.log(
			`      ${r.name.padEnd(32)} iou=${r.iou.toFixed(3)}  area=${r.area}px²${flag}`
		);
	}
}

console.log(`\n[2] Blob inventory  (4-connected CCL on dilated edge map, min-area ${minBlob}px²)`);
console.log(`    Goal blobs:    ${goalBlobs.length}`);
console.log(`    Current blobs: ${currBlobs.length}`);
console.log(`    Matched:       ${blobMatch.matched.length}  (bbox-IoU ≥ ${blobIouThresh})`);
console.log(
	`    Shifted:       ${blobMatch.shifted.length}  ` +
		`(template-match ≥ ${shiftThresh} within ±${maxShiftPx}px, ` +
		`searched at 1/${shiftFactor}× resolution)`
);
console.log(`    Missing in current: ${blobMatch.missing.length}`);
console.log(`    Extra in current:   ${blobMatch.extra.length}`);

if (blobMatch.shifted.length > 0) {
	console.log(`    Shifted (top 8 by area):`);
	const top = blobMatch.shifted
		.slice()
		.sort((a, b) => b.goal.area - a.goal.area)
		.slice(0, 8);
	for (const s of top) {
		const dist = Math.round(Math.hypot(s.dx, s.dy));
		console.log(
			`      bbox=(${s.goal.x},${s.goal.y}, ${s.goal.w}×${s.goal.h})  ` +
				`shifted Δ=(${s.dx >= 0 ? "+" : ""}${s.dx},${s.dy >= 0 ? "+" : ""}${s.dy})  ` +
				`dist=${dist}px  score=${s.score.toFixed(2)}`
		);
	}
}
if (blobMatch.missing.length > 0) {
	console.log(`    Missing (top 8 by area):`);
	const top = blobMatch.missing.slice().sort((a, b) => b.area - a.area).slice(0, 8);
	for (const b of top) {
		console.log(
			`      bbox=(${b.x},${b.y}, ${b.w}×${b.h})  area=${b.area}px²`
		);
	}
}
if (blobMatch.extra.length > 0) {
	console.log(`    Extra (top 8 by area):`);
	const top = blobMatch.extra.slice().sort((a, b) => b.area - a.area).slice(0, 8);
	for (const b of top) {
		console.log(
			`      bbox=(${b.x},${b.y}, ${b.w}×${b.h})  area=${b.area}px²`
		);
	}
}
if (blobMatch.matched.length > 0) {
	const sizeDeltas = blobMatch.matched.map(m => {
		const dw = (m.cur.w - m.goal.w) / m.goal.w;
		const dh = (m.cur.h - m.goal.h) / m.goal.h;
		return Math.max(Math.abs(dw), Math.abs(dh));
	});
	const meanSize = sizeDeltas.reduce((a, x) => a + x, 0) / sizeDeltas.length;
	const worstSize = Math.max(...sizeDeltas);
	console.log(
		`    Matched-blob size delta: mean ${(meanSize * 100).toFixed(1)}%, worst ${(worstSize * 100).toFixed(1)}%`
	);
}

console.log(`\n[3] Grid luminance Δ  (top-${topK} cells by mean abs diff, scale 0-255)`);
const meanDelta = cells.reduce((a, c) => a + c.delta, 0) / cells.length;
console.log(`    Mean across all ${gridW * gridH} cells: ${meanDelta.toFixed(2)}`);
for (let i = 0; i < Math.min(topK, cells.length); i++) {
	const c = cells[i];
	console.log(
		`      cell(${String(c.cx).padStart(2)},${String(c.cy).padStart(2)})  ` +
			`bbox=(${c.x},${c.y}, ${c.w}×${c.h})  Δ=${c.delta.toFixed(1)}`
	);
}

if (debug) {
	const debugDir = path.join(path.dirname(currPath));
	const stem = path.basename(currPath, path.extname(currPath));
	const prefix = `_analyze-${stem}-`;
	writeBinAsPng(goalEdge, W, H, path.join(debugDir, `${prefix}edge-goal.png`));
	writeBinAsPng(currEdge, W, H, path.join(debugDir, `${prefix}edge-cur.png`));
	writeEdgeOverlay(goalEdge, currEdge, W, H, path.join(debugDir, `${prefix}edge-overlay.png`));
	writeGridHeatmap(cells, W, H, gridW, gridH, path.join(debugDir, `${prefix}grid.png`));
	writeBlobsOverlay(goalPng, goalBlobs, path.join(debugDir, `${prefix}blobs-goal.png`), [255, 80, 80]);
	writeBlobsOverlay(currPng, currBlobs, path.join(debugDir, `${prefix}blobs-cur.png`), [80, 220, 220]);
	console.log(`\nDebug PNGs written to ${rel(debugDir)}/${prefix}*.png`);
	console.log(`  edge-overlay.png:  red=goal-only, cyan=current-only, white=both`);
	console.log(`  grid.png:          luminance-Δ heatmap (black=match, white=worst)`);
	console.log(`  blobs-{goal,cur}:  detected blob bboxes overlaid on the source`);
}

console.log("");
process.exit(0);
