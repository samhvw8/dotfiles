#!/usr/bin/env node
/**
 * Auto-generate a regions.json sidecar for a goal PNG.
 *
 * Two modes, picked in this order of preference:
 *
 *   1. OmniParser (default)
 *      microsoft/OmniParser-v2.0 — YOLOv8 UI-icon detector + Florence-2
 *      captioner + easyocr. Returns 20–80 detections per UI screenshot
 *      with semantic labels ("Order #4000257090", "View all orders",
 *      "shopping cart icon"). Quality: very good.
 *
 *      Cost: requires Python 3.10+, a ~3GB venv (transformers, torch,
 *      ultralytics, easyocr, supervision, opencv, timm, einops,
 *      huggingface_hub, accelerate), and a one-time ~600MB model
 *      download. Runtime ~6s/image on MPS, ~15–30s on CPU.
 *
 *      License: icon_detect (YOLOv8 weights) is AGPL. Caption + OCR
 *      models are MIT/Apache-2.0. AGPL exposure is bounded — this
 *      script runs at design time and writes a JSON file, never
 *      touching product code paths.
 *
 *   2. Programmatic (--programmatic, or auto-fallback when OmniParser
 *      can't run)
 *      Pure JavaScript using _structural.mjs primitives: Sobel + dilate
 *      + connected-component labelling. Returns the largest N edge-
 *      blob bounding boxes with grid-position-derived generic names
 *      ("shape-top-left-1", "shape-mid-2"). No semantic labels.
 *
 *      Cost: zero — uses the same pngjs already in your project's
 *      node_modules. Runtime <1s.
 *
 *      Quality: covers the layout structurally but the names are
 *      generic. The assistant can read the goal PNG and rename them,
 *      which is still faster than authoring bboxes from scratch.
 *
 *   3. Manual (last resort, no flag)
 *      If OmniParser fails AND --programmatic isn't passed, this
 *      script exits with a clear message describing both fallbacks
 *      and pointing the user (or the assistant) at the SKILL.md Step 0
 *      flow for hand-authoring regions.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/bootstrap-regions.mjs \
 *       --image=design/<name>.png [--force] [--programmatic]
 *       [--max-regions=30]
 *       [--bbox-threshold=0.05] [--iou-threshold=0.7]   # OmniParser
 *       [--edge-threshold=60] [--min-blob-area=500]     # programmatic
 *
 *   --force            Overwrite an existing <name>.regions.json.
 *                      Default skips with a warning so accidental
 *                      re-runs don't stomp hand-tuned regions.
 *   --programmatic     Skip OmniParser entirely and use the JS-only
 *                      Sobel + CCL path. Fast, zero deps, generic names.
 *   --max-regions      Cap the number of regions written (sorted by
 *                      area). Default 30.
 *   --bbox-threshold   OmniParser YOLO confidence floor. Default 0.05.
 *   --iou-threshold    OmniParser overlap-removal IoU. Default 0.7.
 *   --edge-threshold   Programmatic Sobel cutoff. Default 60.
 *   --min-blob-area    Programmatic min blob area in pixels. Default 500.
 *
 * Caveats (both modes):
 *   - Design-time only. Don't wire into the iteration loop.
 *   - Generated regions don't have `selector` fields. Add them by hand
 *     for any region that maps to a clickable element (button, pill,
 *     badge); audit.mjs's fill/radius/border checks need them for
 *     live computed-style sampling.
 *   - Both modes detect ELEMENTS / SHAPES, not page LAYOUT — you'll
 *     usually still want to author 3–5 container regions (card-bg,
 *     panel, decorative-strip) by hand on top of the auto-generated set.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { readImage } from "./_imageio.mjs";
import {
	buildEdgeMap,
	connectedComponents,
} from "./_structural.mjs";

// ────────────────────────────────────────────────────────────────────────────
// Auto sub-region detection
//
// After the primary bootstrap pass writes its regions, walk each one and
// look for strong internal vertical/horizontal seams — long edge runs
// inside the region that indicate the rect covers a multi-bg layout
// (badge-column-plus-content row, leading accent strip on a card, etc).
// When a seam is detected, emit sub-regions (<parent>.col-0/col-1 for
// a vertical seam, <parent>.row-0/row-1 for horizontal) so audit.mjs's
// per-region fill check can inspect each side of the seam independently.
//
// The parent region is preserved — its compound-bg check still fires
// over the whole rect, and the sub-regions add property-level coverage.
// ────────────────────────────────────────────────────────────────────────────

function detectInternalSeams(edge, W, H, frac) {
	// Project edges onto each axis within the region rect. A "seam"
	// candidate is a row/column whose edge density runs near-uninterrupted
	// across most of the perpendicular dimension AND stands well above
	// the median edge density in the rect (it's a divider, not text/icon
	// background noise).
	const x0 = Math.max(0, Math.round(frac.x * W));
	const y0 = Math.max(0, Math.round(frac.y * H));
	const w = Math.max(1, Math.min(W - x0, Math.round(frac.w * W)));
	const h = Math.max(1, Math.min(H - y0, Math.round(frac.h * H)));

	// Only meaningful on regions large enough to have internal structure.
	if (w < 80 || h < 40) return { vertical: [], horizontal: [] };

	const colSum = new Uint32Array(w);
	const rowSum = new Uint32Array(h);
	for (let yy = 0; yy < h; yy++) {
		for (let xx = 0; xx < w; xx++) {
			if (edge[(y0 + yy) * W + (x0 + xx)]) {
				colSum[xx]++;
				rowSum[yy]++;
			}
		}
	}
	// A seam column must have edge pixels along most of the column height.
	const COL_RUN_MIN = Math.round(h * 0.5);
	const ROW_RUN_MIN = Math.round(w * 0.5);

	const colMedian = median(colSum);
	const rowMedian = median(rowSum);
	// Signal-to-noise: peak must be >= 3× median (filters text rows and
	// icon clusters which produce localized edge density but not a full
	// uninterrupted line).
	const COL_PEAK_MIN = Math.max(COL_RUN_MIN, colMedian * 3);
	const ROW_PEAK_MIN = Math.max(ROW_RUN_MIN, rowMedian * 3);

	// Suppress runs near the edge of the region (those are the region's
	// own outline, not internal seams) and dedupe adjacent peaks within
	// a margin so a 2-3px line doesn't generate three seam candidates.
	const verticals = pickPeaks(colSum, COL_PEAK_MIN, Math.max(8, Math.round(w * 0.05)));
	const horizontals = pickPeaks(rowSum, ROW_PEAK_MIN, Math.max(8, Math.round(h * 0.05)));

	return {
		vertical: verticals.map(x => x / w), // fractional within region
		horizontal: horizontals.map(y => y / h),
	};
}

function median(arr) {
	const sorted = [...arr].sort((a, b) => a - b);
	return sorted[sorted.length >> 1] ?? 0;
}

function pickPeaks(values, threshold, edgeMargin) {
	const peaks = [];
	const n = values.length;
	for (let i = edgeMargin; i < n - edgeMargin; i++) {
		if (values[i] < threshold) continue;
		// Suppress points adjacent to a stronger one already picked
		const last = peaks[peaks.length - 1];
		if (last != null && i - last < edgeMargin) {
			if (values[i] > values[last]) peaks[peaks.length - 1] = i;
			continue;
		}
		peaks.push(i);
	}
	return peaks;
}

function augmentWithSubRegions(regions, imagePng) {
	// Mutates `regions` in place, adding `<parent>.col-N` / `<parent>.row-N`
	// sub-regions where seams are detected. Limits: at most one
	// vertical and one horizontal split per parent (the most prominent
	// seam each direction). This keeps the regions file readable —
	// over-splitting on text-block edges is the most common failure mode.
	const { edge } = buildEdgeMap(imagePng, 60);
	const W = imagePng.width;
	const H = imagePng.height;
	const seamed = [];
	const additions = {};
	for (const [name, frac] of Object.entries(regions)) {
		if (name.startsWith("_") || name === "page-bg") continue;
		const seams = detectInternalSeams(edge, W, H, frac);
		if (seams.vertical.length === 0 && seams.horizontal.length === 0) continue;
		// Pick the strongest one of each (closest to mid is often the seam,
		// but we already filtered by absolute strength — just take the first).
		const vSplit = seams.vertical[0];
		const hSplit = seams.horizontal[0];
		if (vSplit != null) {
			const splitX = frac.x + frac.w * vSplit;
			additions[`${name}.col-0`] = {
				x: round4(frac.x),
				y: round4(frac.y),
				w: round4(splitX - frac.x),
				h: round4(frac.h),
				_autoSubRegion: true,
				_parent: name,
			};
			additions[`${name}.col-1`] = {
				x: round4(splitX),
				y: round4(frac.y),
				w: round4(frac.x + frac.w - splitX),
				h: round4(frac.h),
				_autoSubRegion: true,
				_parent: name,
			};
			seamed.push(`${name} ⊥ x=${(vSplit * 100).toFixed(0)}%`);
		}
		if (hSplit != null) {
			const splitY = frac.y + frac.h * hSplit;
			additions[`${name}.row-0`] = {
				x: round4(frac.x),
				y: round4(frac.y),
				w: round4(frac.w),
				h: round4(splitY - frac.y),
				_autoSubRegion: true,
				_parent: name,
			};
			additions[`${name}.row-1`] = {
				x: round4(frac.x),
				y: round4(splitY),
				w: round4(frac.w),
				h: round4(frac.y + frac.h - splitY),
				_autoSubRegion: true,
				_parent: name,
			};
			seamed.push(`${name} ⊥ y=${(hSplit * 100).toFixed(0)}%`);
		}
	}
	Object.assign(regions, additions);
	return seamed;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_ROOT = path.resolve(__dirname, "..");
const VENV_DIR = path.join(SKILL_ROOT, ".venv");
const VENV_PY = path.join(VENV_DIR, "bin", "python3");
const VENV_PIP = path.join(VENV_DIR, "bin", "pip");
const HELPER_PY = path.join(__dirname, "_omniparser.py");

// OmniParser's full dep stack. transformers is pinned because Florence-2's
// vendored config (used by OmniParser's icon_caption) breaks on >= 4.50.
const OMNIPARSER_DEPS = [
	"transformers==4.49.0",
	"torch",
	"Pillow",
	"timm",
	"einops",
	"accelerate",
	"huggingface_hub",
	"easyocr",
	"ultralytics==8.3.70",
	"supervision==0.18.0",
	"opencv-python",
	"opencv-python-headless",
];
const OMNIPARSER_MARKER_PKG = "ultralytics"; // pip-checked to detect installed-state

// ────────────────────────────────────────────────────────────────────────────
// CLI parsing
// ────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const argMap = Object.fromEntries(
	args
		.filter(a => a.startsWith("--"))
		.map(a => {
			const [k, ...v] = a.replace(/^--/, "").split("=");
			return [k, v.length ? v.join("=") : true];
		})
);

// `--setup-only` lets the skill provision OmniParser eagerly during
// first-time bootstrap (right after the user runs /frontend-audit) so
// the dependency install isn't deferred to the first PNG. Reuses the
// ensureOmniParserVenv path below; no PNG required.
if (argMap["setup-only"] === true) {
	const sysPy = detectSystemPython();
	if (!sysPy) {
		console.error(
			"[setup] no system python3 found. Install Python 3.10+ first " +
				"(macOS: `brew install python@3.12`; Debian/Ubuntu: " +
				"`sudo apt install python3.12 python3.12-venv`; Fedora: " +
				"`sudo dnf install python3.12`; Windows: " +
				"https://www.python.org/downloads/). Then re-run with --setup-only."
		);
		process.exit(3);
	}
	console.error(`[setup] system python: ${sysPy}`);
	const result = ensureOmniParserVenv();
	if (!result.ok) {
		console.error(
			`[setup] failed: ${result.reason}${result.detail ? ` — ${result.detail}` : ""}`
		);
		process.exit(4);
	}
	console.error("[setup] OmniParser venv ready. Drop a PNG into design/ and re-run /frontend-audit.");
	process.exit(0);
}

const imagePath = argMap.image;
if (!imagePath || !fs.existsSync(imagePath)) {
	console.error("Missing or invalid --image=<png>");
	console.error(
		`Example: bun ${path.relative(process.cwd(), __filename)} --image=design/dashboard.png`
	);
	console.error(
		`Setup-only mode (provisions OmniParser venv without a PNG):`
	);
	console.error(
		`  bun ${path.relative(process.cwd(), __filename)} --setup-only`
	);
	process.exit(2);
}

const force = !!argMap.force;
const requestProgrammatic = !!argMap.programmatic;
const maxRegions = parseInt(argMap["max-regions"] ?? "30", 10);

const stem = path.basename(imagePath, path.extname(imagePath));
const regionsPath = path.join(path.dirname(imagePath), `${stem}.regions.json`);

if (fs.existsSync(regionsPath) && !force) {
	console.error(
		`Regions file already exists: ${regionsPath}\n` +
			`Pass --force to overwrite, or delete the file first.`
	);
	process.exit(2);
}

// ────────────────────────────────────────────────────────────────────────────
// OmniParser path: venv setup + helper invocation
// ────────────────────────────────────────────────────────────────────────────

function detectSystemPython() {
	for (const candidate of ["python3", "python3.12", "python3.11", "python3.10"]) {
		const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
		if (probe.status === 0) return candidate;
	}
	return null;
}

function pipHas(pkgName) {
	const probe = spawnSync(VENV_PIP, ["show", pkgName], { encoding: "utf8" });
	return probe.status === 0;
}

function ensureOmniParserVenv() {
	const haveVenv = fs.existsSync(VENV_PY);
	if (haveVenv && pipHas(OMNIPARSER_MARKER_PKG)) return { ok: true };
	if (!haveVenv) {
		const sysPy = detectSystemPython();
		if (!sysPy) {
			return {
				ok: false,
				reason: "no-python",
				detail: "No system python3 found.",
			};
		}
		console.error(
			`[bootstrap] creating venv at ${path.relative(os.homedir(), VENV_DIR)} ` +
				`(one-time, ~3GB after deps install)…`
		);
		const create = spawnSync(sysPy, ["-m", "venv", VENV_DIR], { stdio: "inherit" });
		if (create.status !== 0) {
			return { ok: false, reason: "venv-create-failed" };
		}
	}
	console.error(
		`[bootstrap] installing omniparser deps (this is the slow part — ~3GB)…`
	);
	const install = spawnSync(
		VENV_PIP,
		["install", "--quiet", "--upgrade", "pip", ...OMNIPARSER_DEPS],
		{ stdio: "inherit" }
	);
	if (install.status !== 0) {
		return {
			ok: false,
			reason: "pip-install-failed",
			detail: `pip exited ${install.status}; venv left at ${VENV_DIR}`,
		};
	}
	console.error("[bootstrap] venv ready.");
	return { ok: true };
}

function runOmniParser() {
	const setup = ensureOmniParserVenv();
	if (!setup.ok) return { ok: false, ...setup };

	const helperArgs = ["-u", HELPER_PY, `--image=${path.resolve(imagePath)}`];
	if (argMap["bbox-threshold"]) {
		helperArgs.push(`--bbox-threshold=${argMap["bbox-threshold"]}`);
	}
	if (argMap["iou-threshold"]) {
		helperArgs.push(`--iou-threshold=${argMap["iou-threshold"]}`);
	}
	const result = spawnSync(VENV_PY, helperArgs, {
		encoding: "utf8",
		maxBuffer: 32 * 1024 * 1024,
	});
	if (result.stderr) process.stderr.write(result.stderr);
	if (result.status !== 0) {
		return {
			ok: false,
			reason: "helper-failed",
			detail: `_omniparser.py exited ${result.status}`,
		};
	}
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch (e) {
		return {
			ok: false,
			reason: "helper-bad-json",
			detail: result.stdout.slice(0, 400),
		};
	}
	return { ok: true, parsed, source: "omniparser" };
}

// ────────────────────────────────────────────────────────────────────────────
// Programmatic path: Sobel + CCL via _structural.mjs
// ────────────────────────────────────────────────────────────────────────────

function runProgrammatic() {
	const edgeThreshold = parseInt(argMap["edge-threshold"] ?? "60", 10);
	const minBlobArea = parseInt(argMap["min-blob-area"] ?? "500", 10);

	console.error(
		`[programmatic] reading ${path.relative(process.cwd(), imagePath)} (Sobel + CCL, no Python required)…`
	);
	const png = readImage(imagePath);
	const W = png.width;
	const H = png.height;
	const totalArea = W * H;
	const { edge } = buildEdgeMap(png, edgeThreshold);
	const allBlobs = connectedComponents(edge, W, H);
	// Filter: drop tiny noise, drop the whole-canvas blob (the page-bg
	// outline that hugs every edge of the canvas).
	const blobs = allBlobs.filter(
		b => b.area >= minBlobArea && b.area < totalArea * 0.5
	);
	console.error(
		`[programmatic] found ${allBlobs.length} blobs total; ${blobs.length} after filter (min-area=${minBlobArea}px²)`
	);

	const elements = blobs.map(b => ({
		bbox: [b.x, b.y, b.x + b.w, b.y + b.h],
		// Grid-position label so a human reading the file can locate the
		// region without rendering it. Centroid in fractions, mapped to
		// a 3×3 grid.
		label: gridLabel(b.cx / W, b.cy / H, b.w, b.h),
		type: "shape",
		interactivity: false,
	}));

	return {
		ok: true,
		source: "programmatic",
		parsed: {
			image: { width: W, height: H, path: path.resolve(imagePath) },
			model: "structural-ccl",
			elements,
		},
	};
}

function gridLabel(cxFrac, cyFrac, w, h) {
	const col = cxFrac < 0.34 ? "left" : cxFrac < 0.67 ? "center" : "right";
	const row = cyFrac < 0.34 ? "top" : cyFrac < 0.67 ? "mid" : "bottom";
	return `shape ${row}-${col} ${Math.round(w)}×${Math.round(h)}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Decide which path to take
// ────────────────────────────────────────────────────────────────────────────

let pipeline;
if (requestProgrammatic) {
	pipeline = runProgrammatic();
} else {
	pipeline = runOmniParser();
	if (!pipeline.ok) {
		console.error("");
		console.error(`[bootstrap-regions] OmniParser path failed: ${pipeline.reason}`);
		if (pipeline.detail) console.error(`  detail: ${pipeline.detail}`);
		console.error("");
		console.error("Three ways forward:");
		console.error("  1. Re-run with --programmatic to use the JS-only Sobel+CCL path.");
		console.error("     Fast, zero deps, generic region names — easy to rename later.");
		console.error("  2. Fix the Python install issue and re-run (most common: missing");
		console.error("     system Python, or torch/easyocr install errors visible above).");
		console.error("  3. Skip the bootstrap entirely — author regions by hand following");
		console.error("     SKILL.md Step 0 (the assistant Reads the PNG and writes coords).");
		process.exit(1);
	}
}

// ────────────────────────────────────────────────────────────────────────────
// Convert elements → regions.json
// ────────────────────────────────────────────────────────────────────────────

function kebab(label, type) {
	if (!label) {
		if (type === "text") return "text-region";
		if (type === "icon") return "icon-region";
		return "shape-region";
	}
	let cleaned = label.toLowerCase().replace(/^(a|an|the)\s+/, "");
	if (type === "text") {
		cleaned = cleaned.split(/\s+/).slice(0, 5).join(" ");
	}
	cleaned = cleaned.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	if (cleaned) return cleaned;
	if (type === "text") return "text-region";
	if (type === "icon") return "icon-region";
	return "shape-region";
}

function uniqueName(base, used) {
	if (!used.has(base)) {
		used.add(base);
		return base;
	}
	let i = 2;
	while (used.has(`${base}-${i}`)) i++;
	const name = `${base}-${i}`;
	used.add(name);
	return name;
}

function round4(n) {
	return Math.round(n * 10000) / 10000;
}

const parsed = pipeline.parsed;
const W = parsed.image.width;
const H = parsed.image.height;
const PAD_FRAC_X = 0.005;
const PAD_FRAC_Y = 0.005;

const sortedElements = parsed.elements
	.map(el => {
		const [x1, y1, x2, y2] = el.bbox;
		return { ...el, area: (x2 - x1) * (y2 - y1) };
	})
	.sort((a, b) => b.area - a.area)
	.slice(0, maxRegions);

const usedNames = new Set();
const regions = {};
regions["page-bg"] = { x: 0.02, y: 0.02, w: 0.02, h: 0.02 };
usedNames.add("page-bg");

for (const el of sortedElements) {
	const [x1, y1, x2, y2] = el.bbox;
	const name = uniqueName(kebab(el.label, el.type), usedNames);
	const fx = Math.max(0, x1 / W - PAD_FRAC_X);
	const fy = Math.max(0, y1 / H - PAD_FRAC_Y);
	const fw = Math.min(1 - fx, (x2 - x1) / W + PAD_FRAC_X * 2);
	const fh = Math.min(1 - fy, (y2 - y1) / H + PAD_FRAC_Y * 2);
	const entry = {
		x: round4(fx),
		y: round4(fy),
		w: round4(fw),
		h: round4(fh),
		_label: el.label,
		_type: el.type,
	};
	if (el.interactivity) entry._needsSelector = true;
	regions[name] = entry;
}

// ────────────────────────────────────────────────────────────────────────────
// Auto sub-region pass — detect internal seams (vertical/horizontal
// edge runs) inside each region and emit `<name>.col-N` / `<name>.row-N`
// children. Parent regions are preserved so audit.mjs still has both
// whole-region (compound-bg) and per-sub-region (single-fill) coverage.
// ────────────────────────────────────────────────────────────────────────────

const seamPng = readImage(parsed.image.path ?? imagePath);
const seamedRegions = augmentWithSubRegions(regions, seamPng);

// ────────────────────────────────────────────────────────────────────────────
// Write the file
// ────────────────────────────────────────────────────────────────────────────

const meta = {
	sourceImage: path.basename(imagePath),
	source: `${pipeline.source}-bootstrap`,
	model: parsed.model,
	generatedAt: new Date().toISOString(),
	imageDims: { width: W, height: H },
};
if (seamedRegions.length > 0) {
	meta.autoSubRegions = seamedRegions;
}
const out = { _meta: meta, ...regions };

fs.mkdirSync(path.dirname(regionsPath), { recursive: true });
fs.writeFileSync(regionsPath, JSON.stringify(out, null, "\t") + "\n");

console.error("");
console.log(
	`Wrote ${path.relative(process.cwd(), regionsPath)} ` +
		`(${Object.keys(regions).length} regions from ${parsed.elements.length} ` +
		`${pipeline.source} detections; capped at --max-regions=${maxRegions}).`
);
console.log("");
console.log("NEXT STEPS:");
if (pipeline.source === "omniparser") {
	console.log("  1. Read the goal PNG and skim the regions file. OmniParser's");
	console.log("     labels are usually good; rename any vague ones (e.g.");
	console.log("     'icon-region') to something semantic.");
} else {
	console.log("  1. Read the goal PNG and rename each `shape-*` region to");
	console.log("     something semantic (e.g. 'card-1-bg', 'status-pill'). The");
	console.log("     programmatic path can't label what each shape IS — only that");
	console.log("     it's there.");
}
console.log("  2. For every region carrying `_needsSelector: true` (or any region");
console.log("     that maps to a clickable element), add a `selector` field — a");
console.log("     CSS selector matching the live element. Without selectors,");
console.log("     audit.mjs falls back to PNG sampling and loses fidelity.");
console.log("  3. Verify with sample-colors.mjs --debug crops:");
console.log(
	`       bun ~/.claude/skills/frontend-audit/scripts/sample-colors.mjs ${path.relative(
		process.cwd(),
		imagePath
	)} --debug`
);
console.log("  4. Stamp the hash so discover.mjs knows the regions match this PNG:");
console.log(
	"       bun ~/.claude/skills/frontend-audit/scripts/discover.mjs --stamp"
);
