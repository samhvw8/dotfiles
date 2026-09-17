#!/usr/bin/env node
/**
 * Side-by-side composite of two PNGs (typically goal vs current snap)
 * so a design iteration's diff is a single image you can scan in one
 * glance — without trying to keep two screenshots in your head.
 *
 * Usage:
 *   bun ~/.claude/skills/frontend-audit/scripts/diff.mjs \
 *       <goal.png> <current.png> [--out=<path>]
 *                                [--label-a=Goal] [--label-b=Current]
 *                                [--y=<y0>,<y1>] [--max-w=<px>]
 *
 *   --y=y0,y1     Crop both inputs to a vertical band (fractions 0..1
 *                 of each source's height) BEFORE compositing. Use for
 *                 zoom diffs of header / card / footer. Catches details
 *                 (1-2px lines, font-weight shifts) that disappear in a
 *                 full-page diff once it's downscaled for display.
 *   --max-w=px    Cap the per-pane width. Default = max(goalW, currW) so
 *                 no detail is lost to downscaling. Lower it only when
 *                 you intentionally want a smaller composite.
 *
 * The output PNG is the two inputs scaled to the same width and
 * stacked horizontally with a red gutter divider.
 *
 * Not pixel-perfect overlay diff — overlay diffs are brittle when the
 * two sources have different scales. Side-by-side reads faster.
 */
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith("--"));
const goalPath = positional[0];
const currPath = positional[1];
const outArg = args.find(a => a.startsWith("--out="));
const labelAArg = args.find(a => a.startsWith("--label-a="));
const labelBArg = args.find(a => a.startsWith("--label-b="));
const yArg = args.find(a => a.startsWith("--y="));
const maxWArg = args.find(a => a.startsWith("--max-w="));

if (!goalPath || !currPath) {
	console.error(
		"Usage: bun ~/.claude/skills/frontend-audit/scripts/diff.mjs <goal.png> <current.png> [--out=path]"
	);
	process.exit(1);
}
if (!fs.existsSync(goalPath) || !fs.existsSync(currPath)) {
	console.error("One of the input PNGs does not exist.");
	process.exit(1);
}

const out = outArg?.split("=")[1] ?? "design/_debug/diff.png";
const labelA = labelAArg?.split("=")[1] ?? "Goal";
const labelB = labelBArg?.split("=")[1] ?? "Current";
const maxW = maxWArg ? parseInt(maxWArg.split("=")[1], 10) : Infinity;

let yBand = null;
if (yArg) {
	const [y0, y1] = yArg
		.split("=")[1]
		.split(",")
		.map(s => parseFloat(s));
	if (
		!Number.isFinite(y0) ||
		!Number.isFinite(y1) ||
		y0 < 0 ||
		y1 > 1 ||
		y0 >= y1
	) {
		console.error(
			`Bad --y=${yArg.split("=")[1]} — expected two fractions 0..1, e.g. --y=0,0.25`
		);
		process.exit(1);
	}
	yBand = [y0, y1];
}

const goalRaw = PNG.sync.read(fs.readFileSync(goalPath));
const currRaw = PNG.sync.read(fs.readFileSync(currPath));

function cropBand(src, [y0, y1]) {
	const top = Math.floor(src.height * y0);
	const bottom = Math.ceil(src.height * y1);
	const cropH = bottom - top;
	const dst = new PNG({ width: src.width, height: cropH });
	for (let y = 0; y < cropH; y++) {
		const srcRow = (top + y) * src.width;
		const dstRow = y * src.width;
		for (let x = 0; x < src.width; x++) {
			const si = (srcRow + x) << 2;
			const di = (dstRow + x) << 2;
			dst.data[di] = src.data[si];
			dst.data[di + 1] = src.data[si + 1];
			dst.data[di + 2] = src.data[si + 2];
			dst.data[di + 3] = src.data[si + 3];
		}
	}
	return dst;
}

const goal = yBand ? cropBand(goalRaw, yBand) : goalRaw;
const curr = yBand ? cropBand(currRaw, yBand) : currRaw;

const TARGET_W = Math.min(maxW, Math.max(goal.width, curr.width));
const GUTTER = 16;
const LABEL_H = 28;

function resize(src, targetW) {
	const ratio = targetW / src.width;
	const targetH = Math.round(src.height * ratio);
	const dst = new PNG({ width: targetW, height: targetH });
	for (let y = 0; y < targetH; y++) {
		const srcY = Math.min(src.height - 1, Math.floor(y / ratio));
		for (let x = 0; x < targetW; x++) {
			const srcX = Math.min(src.width - 1, Math.floor(x / ratio));
			const si = (srcY * src.width + srcX) << 2;
			const di = (y * targetW + x) << 2;
			dst.data[di] = src.data[si];
			dst.data[di + 1] = src.data[si + 1];
			dst.data[di + 2] = src.data[si + 2];
			dst.data[di + 3] = 255;
		}
	}
	return dst;
}

const goalR = resize(goal, TARGET_W);
const currR = resize(curr, TARGET_W);

const compositeW = TARGET_W * 2 + GUTTER;
const compositeH = Math.max(goalR.height, currR.height) + LABEL_H;
const composite = new PNG({ width: compositeW, height: compositeH });

// Cream bg so labels read
for (let i = 0; i < composite.data.length; i += 4) {
	composite.data[i] = 245;
	composite.data[i + 1] = 240;
	composite.data[i + 2] = 235;
	composite.data[i + 3] = 255;
}

function blit(src, dx, dy) {
	for (let y = 0; y < src.height; y++) {
		const cy = dy + y;
		if (cy < 0 || cy >= composite.height) continue;
		for (let x = 0; x < src.width; x++) {
			const cx = dx + x;
			if (cx < 0 || cx >= composite.width) continue;
			const si = (y * src.width + x) << 2;
			const ci = (cy * composite.width + cx) << 2;
			composite.data[ci] = src.data[si];
			composite.data[ci + 1] = src.data[si + 1];
			composite.data[ci + 2] = src.data[si + 2];
			composite.data[ci + 3] = 255;
		}
	}
}

blit(goalR, 0, LABEL_H);
blit(currR, TARGET_W + GUTTER, LABEL_H);

// Red gutter divider
const divX = TARGET_W + GUTTER / 2;
for (let y = LABEL_H; y < compositeH; y++) {
	const ci = (y * compositeW + divX) << 2;
	composite.data[ci] = 209;
	composite.data[ci + 1] = 18;
	composite.data[ci + 2] = 18;
	composite.data[ci + 3] = 255;
}

const outDir = path.dirname(path.resolve(out));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, PNG.sync.write(composite));
const bandLabel = yBand ? ` (y=${yBand[0]}-${yBand[1]} band)` : "";
console.log(
	`wrote ${out}${bandLabel} — ${labelA}: ${goalRaw.width}×${goalRaw.height}, ${labelB}: ${currRaw.width}×${currRaw.height}`
);
console.log("");
console.log(
	`NEXT STEP (mandatory): Read ${out} with the Read tool. Compare ${labelA}`
);
console.log(
	`(left) to ${labelB} (right) — scan for positional drift, missing elements,`
);
console.log(
	`color shifts, AND fine decorative details (hairlines, divider rules, font`
);
console.log(
	`weights, small icons). Don't report the iteration done before reading this.`
);
