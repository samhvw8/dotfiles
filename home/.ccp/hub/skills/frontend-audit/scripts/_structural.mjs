/**
 * Shared image-analysis primitives for frontend-audit's structural
 * checks. Imported by analyze.mjs (standalone diagnostic) and audit.mjs
 * (gate). Kept dependency-free aside from pngjs.
 *
 * The underscore prefix marks this file as an internal library — the
 * SKILL workflow doesn't reference it directly; users invoke the
 * scripts that consume it.
 */
import { PNG } from "pngjs";

// ────────────────────────────────────────────────────────────────────────────
// Pixel ops
// ────────────────────────────────────────────────────────────────────────────

export function toGrayscale(png) {
	// ITU-R BT.601 luma. Float32 for headroom in the Sobel pass.
	const { data } = png;
	const gray = new Float32Array(png.width * png.height);
	for (let i = 0, j = 0; i < data.length; i += 4, j++) {
		gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
	}
	return gray;
}

export function resizePng(src, targetW, targetH) {
	// Nearest-neighbour. Adequate for edge / luminance comparison; we are
	// not trying to preserve perceptual quality, only spatial alignment.
	if (src.width === targetW && src.height === targetH) return src;
	const dst = new PNG({ width: targetW, height: targetH });
	const xRatio = src.width / targetW;
	const yRatio = src.height / targetH;
	for (let y = 0; y < targetH; y++) {
		const sy = Math.min(src.height - 1, Math.floor(y * yRatio));
		for (let x = 0; x < targetW; x++) {
			const sx = Math.min(src.width - 1, Math.floor(x * xRatio));
			const si = (sy * src.width + sx) << 2;
			const di = (y * targetW + x) << 2;
			dst.data[di] = src.data[si];
			dst.data[di + 1] = src.data[si + 1];
			dst.data[di + 2] = src.data[si + 2];
			dst.data[di + 3] = 255;
		}
	}
	return dst;
}

export function sobel(gray, w, h) {
	// 3×3 Sobel. Skips the 1-pixel border (mag stays 0 there). Returns
	// Uint8 magnitude clipped to 0-255.
	const mag = new Uint8Array(w * h);
	for (let y = 1; y < h - 1; y++) {
		for (let x = 1; x < w - 1; x++) {
			const i = y * w + x;
			const tl = gray[i - w - 1];
			const tc = gray[i - w];
			const tr = gray[i - w + 1];
			const ml = gray[i - 1];
			const mr = gray[i + 1];
			const bl = gray[i + w - 1];
			const bc = gray[i + w];
			const br = gray[i + w + 1];
			const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
			const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
			const m = Math.hypot(gx, gy);
			mag[i] = m > 255 ? 255 : m;
		}
	}
	return mag;
}

export function thresholdBin(mag, t) {
	const bin = new Uint8Array(mag.length);
	for (let i = 0; i < mag.length; i++) bin[i] = mag[i] >= t ? 1 : 0;
	return bin;
}

export function dilate(bin, w, h, radius = 1) {
	// Box dilation, 4-connected per pass. Cheap; closes 1-px AA gaps and
	// absorbs sub-pixel registration drift between goal and resized
	// current.
	let src = bin;
	for (let r = 0; r < radius; r++) {
		const dst = new Uint8Array(w * h);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const i = y * w + x;
				if (src[i]) {
					dst[i] = 1;
					continue;
				}
				if (
					(x > 0 && src[i - 1]) ||
					(x < w - 1 && src[i + 1]) ||
					(y > 0 && src[i - w]) ||
					(y < h - 1 && src[i + w])
				) {
					dst[i] = 1;
				}
			}
		}
		src = dst;
	}
	return src;
}

export function buildEdgeMap(png, edgeThreshold = 60) {
	// Convenience: PNG → grayscale → Sobel → threshold → 1px dilation.
	// The single function audit.mjs and analyze.mjs both want at startup.
	const gray = toGrayscale(png);
	const mag = sobel(gray, png.width, png.height);
	const bin = thresholdBin(mag, edgeThreshold);
	const edge = dilate(bin, png.width, png.height, 1);
	return { gray, edge };
}

// ────────────────────────────────────────────────────────────────────────────
// Edge-IoU
// ────────────────────────────────────────────────────────────────────────────

export function edgeIouGlobal(a, b) {
	let inter = 0;
	let union = 0;
	for (let i = 0; i < a.length; i++) {
		const av = a[i];
		const bv = b[i];
		if (av || bv) union++;
		if (av && bv) inter++;
	}
	return union === 0 ? 1 : inter / union;
}

export function edgeIouRegion(a, b, w, h, frac) {
	const x0 = Math.max(0, Math.round(frac.x * w));
	const y0 = Math.max(0, Math.round(frac.y * h));
	const x1 = Math.min(w, Math.round((frac.x + frac.w) * w));
	const y1 = Math.min(h, Math.round((frac.y + frac.h) * h));
	let inter = 0;
	let union = 0;
	for (let y = y0; y < y1; y++) {
		for (let x = x0; x < x1; x++) {
			const i = y * w + x;
			const av = a[i];
			const bv = b[i];
			if (av || bv) union++;
			if (av && bv) inter++;
		}
	}
	return { iou: union === 0 ? 1 : inter / union, area: (x1 - x0) * (y1 - y0) };
}

export function edgeIouRegionShifted(
	goalEdge,
	currEdge,
	w,
	h,
	frac,
	maxShiftPxX,
	maxShiftPxY,
	centerSx = 0,
	centerSy = 0
) {
	// Same as edgeIouRegion but: extract goal's rect once, then slide
	// the SAME-SIZED rect across current within a ±maxShiftPx window
	// (centered at centerSx/centerSy, default 0) and return the BEST
	// IoU + the offset that produced it.
	//
	// Use case: when goal and current have different overall layout
	// proportions (e.g., the live render is ~17% shorter vertically
	// than the goal mock), the same fractional rect lands on different
	// content. Shift-search finds the closest matching position, so the
	// audit can distinguish "spatial drift" from "missing content".
	//
	// `centerSx/centerSy` lets a coarse-search outer pass refine its
	// approximate-best offset at full resolution by re-running with the
	// search window re-centered on its hit.
	const x0 = Math.max(0, Math.round(frac.x * w));
	const y0 = Math.max(0, Math.round(frac.y * h));
	const x1 = Math.min(w, Math.round((frac.x + frac.w) * w));
	const y1 = Math.min(h, Math.round((frac.y + frac.h) * h));
	const rectW = x1 - x0;
	const rectH = y1 - y0;
	if (rectW < 2 || rectH < 2) {
		return { iou: 1, dx: 0, dy: 0, originalIou: 1 };
	}

	const goalRect = new Uint8Array(rectW * rectH);
	let goalOnCount = 0;
	for (let dy = 0; dy < rectH; dy++) {
		const goalRow = (y0 + dy) * w + x0;
		const dstRow = dy * rectW;
		for (let dx = 0; dx < rectW; dx++) {
			const v = goalEdge[goalRow + dx];
			goalRect[dstRow + dx] = v;
			if (v) goalOnCount++;
		}
	}

	function iouAtOffset(sx, sy) {
		const cx0 = x0 + sx;
		const cy0 = y0 + sy;
		if (cx0 < 0 || cy0 < 0 || cx0 + rectW > w || cy0 + rectH > h) {
			return null;
		}
		let inter = 0;
		let currOn = 0;
		for (let dy = 0; dy < rectH; dy++) {
			const goalRow = dy * rectW;
			const currRow = (cy0 + dy) * w + cx0;
			for (let dx = 0; dx < rectW; dx++) {
				const cv = currEdge[currRow + dx];
				if (cv) currOn++;
				if (cv && goalRect[goalRow + dx]) inter++;
			}
		}
		const union = goalOnCount + currOn - inter;
		return union === 0 ? 1 : inter / union;
	}

	// Always evaluate (0,0) so callers get an `originalIou` they can
	// trust as the "no-shift" baseline.
	const originalIou = iouAtOffset(0, 0) ?? 0;
	let best = { iou: originalIou, dx: 0, dy: 0 };
	const sxLo = centerSx - maxShiftPxX;
	const sxHi = centerSx + maxShiftPxX;
	const syLo = centerSy - maxShiftPxY;
	const syHi = centerSy + maxShiftPxY;
	for (let sy = syLo; sy <= syHi; sy++) {
		for (let sx = sxLo; sx <= sxHi; sx++) {
			if (sx === 0 && sy === 0) continue;
			const iou = iouAtOffset(sx, sy);
			if (iou !== null && iou > best.iou) {
				best = { iou, dx: sx, dy: sy };
				if (iou >= 0.99) {
					return { ...best, originalIou };
				}
			}
		}
	}
	return { ...best, originalIou };
}

export function edgeIouRegionShiftedFast(
	goalEdgeFull,
	currEdgeFull,
	W,
	H,
	goalEdgeDown,
	currEdgeDown,
	dW,
	dH,
	factor,
	frac,
	maxShiftPxX,
	maxShiftPxY
) {
	// Coarse-then-fine: search at 1/factor resolution to find the
	// approximate-best offset (cheap), then refine at full res inside
	// a tiny window centered on the coarse hit (accurate).
	//
	// This is the same trick `reclassifyShiftedDown` uses for the
	// global blob shift filter — applied here per region. The reported
	// IoU is computed at full res so the threshold check uses an
	// accurate score, not a coarse approximation.
	if (factor <= 1) {
		return edgeIouRegionShifted(
			goalEdgeFull,
			currEdgeFull,
			W,
			H,
			frac,
			maxShiftPxX,
			maxShiftPxY
		);
	}
	// Phase 1 — coarse pass at 1/factor resolution. Fractional coords
	// don't need scaling; the bounds do.
	const coarseMaxX = Math.ceil(maxShiftPxX / factor);
	const coarseMaxY = Math.ceil(maxShiftPxY / factor);
	const coarse = edgeIouRegionShifted(
		goalEdgeDown,
		currEdgeDown,
		dW,
		dH,
		frac,
		coarseMaxX,
		coarseMaxY
	);
	// Translate coarse offset back to full-res pixels.
	const approxSx = coarse.dx * factor;
	const approxSy = coarse.dy * factor;
	// Phase 2 — fine refinement at full res, in a ±factor window
	// around the coarse hit. (factor*1 is enough — by construction the
	// true best is within ±factor px of any coarse-grid point.)
	const fine = edgeIouRegionShifted(
		goalEdgeFull,
		currEdgeFull,
		W,
		H,
		frac,
		factor,
		factor,
		approxSx,
		approxSy
	);
	// `fine.originalIou` == IoU at offset (0,0) which is the true
	// no-shift baseline; preserve it.
	return fine;
}

// ────────────────────────────────────────────────────────────────────────────
// Connected-component labelling (4-conn, two-pass with union-find)
// ────────────────────────────────────────────────────────────────────────────

export function connectedComponents(bin, w, h) {
	const labels = new Int32Array(w * h);
	const parent = [0]; // label 0 is "background"
	const find = x => {
		while (parent[x] !== x) {
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
		return x;
	};
	const union = (a, b) => {
		const ra = find(a);
		const rb = find(b);
		if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb);
	};
	let nextLabel = 1;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			if (!bin[i]) continue;
			const left = x > 0 ? labels[i - 1] : 0;
			const top = y > 0 ? labels[i - w] : 0;
			if (!left && !top) {
				parent[nextLabel] = nextLabel;
				labels[i] = nextLabel++;
			} else if (left && !top) {
				labels[i] = left;
			} else if (!left && top) {
				labels[i] = top;
			} else {
				labels[i] = Math.min(left, top);
				if (left !== top) union(left, top);
			}
		}
	}

	const stats = new Map();
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			if (!labels[i]) continue;
			const root = find(labels[i]);
			labels[i] = root;
			let s = stats.get(root);
			if (!s) {
				s = { area: 0, x0: x, y0: y, x1: x, y1: y, sx: 0, sy: 0 };
				stats.set(root, s);
			}
			s.area++;
			if (x < s.x0) s.x0 = x;
			if (y < s.y0) s.y0 = y;
			if (x > s.x1) s.x1 = x;
			if (y > s.y1) s.y1 = y;
			s.sx += x;
			s.sy += y;
		}
	}

	const blobs = [];
	for (const s of stats.values()) {
		blobs.push({
			area: s.area,
			x: s.x0,
			y: s.y0,
			w: s.x1 - s.x0 + 1,
			h: s.y1 - s.y0 + 1,
			cx: s.sx / s.area,
			cy: s.sy / s.area,
		});
	}
	return blobs;
}

export function bboxIou(a, b) {
	const ax1 = a.x + a.w;
	const ay1 = a.y + a.h;
	const bx1 = b.x + b.w;
	const by1 = b.y + b.h;
	const ix0 = Math.max(a.x, b.x);
	const iy0 = Math.max(a.y, b.y);
	const ix1 = Math.min(ax1, bx1);
	const iy1 = Math.min(ay1, by1);
	if (ix1 <= ix0 || iy1 <= iy0) return 0;
	const inter = (ix1 - ix0) * (iy1 - iy0);
	const union = a.w * a.h + b.w * b.h - inter;
	return inter / union;
}

export function matchBlobs(goalBlobs, currBlobs, threshold) {
	// Greedy: for each goal blob (largest first), pick the unmatched
	// current blob with the highest bbox-IoU above threshold.
	const goal = goalBlobs.slice().sort((a, b) => b.area - a.area);
	const used = new Set();
	const matched = [];
	const missing = [];
	for (const g of goal) {
		let best = null;
		let bestIou = threshold;
		for (let i = 0; i < currBlobs.length; i++) {
			if (used.has(i)) continue;
			const iou = bboxIou(g, currBlobs[i]);
			if (iou > bestIou) {
				bestIou = iou;
				best = i;
			}
		}
		if (best === null) {
			missing.push(g);
		} else {
			used.add(best);
			matched.push({ goal: g, cur: currBlobs[best], iou: bestIou });
		}
	}
	const extra = currBlobs.filter((_, i) => !used.has(i));
	return { matched, missing, extra };
}

// ────────────────────────────────────────────────────────────────────────────
// Template-match shift filter (binary cross-correlation, downsampled)
// Adapted from vzat/comparing_images: a candidate "missing" blob is
// suppressed if the same shape exists at a nearby offset in the other
// image — i.e., it moved, it didn't disappear.
// ────────────────────────────────────────────────────────────────────────────

export function downsampleBin(bin, w, h, factor) {
	if (factor <= 1) return { bin, w, h };
	const dw = Math.ceil(w / factor);
	const dh = Math.ceil(h / factor);
	const out = new Uint8Array(dw * dh);
	for (let y = 0; y < h; y++) {
		const dy = (y / factor) | 0;
		const rowOff = dy * dw;
		for (let x = 0; x < w; x++) {
			if (!bin[y * w + x]) continue;
			out[rowOff + ((x / factor) | 0)] = 1;
		}
	}
	return { bin: out, w: dw, h: dh };
}

export function extractTemplate(edgeMap, w, blob) {
	// Crop the edge bits inside this blob's bbox into a flat list of
	// "on" coordinates relative to the bbox top-left. Iterating the on-
	// list (instead of the dense w×h template) is the central
	// optimisation: a typical edge-map crop is <5% on, so the inner
	// search loop runs ~20× faster.
	const onPixels = [];
	for (let dy = 0; dy < blob.h; dy++) {
		const sy = blob.y + dy;
		for (let dx = 0; dx < blob.w; dx++) {
			const sx = blob.x + dx;
			if (edgeMap[sy * w + sx]) onPixels.push([dx, dy]);
		}
	}
	return { w: blob.w, h: blob.h, onPixels };
}

export function shiftSearch(template, edgeMap, w, h, anchor, maxShift) {
	if (template.onPixels.length === 0) return null;
	let best = { score: 0, dx: 0, dy: 0 };
	const tCount = template.onPixels.length;
	for (let dy = -maxShift; dy <= maxShift; dy++) {
		const y0 = anchor.y + dy;
		if (y0 < 0 || y0 + template.h > h) continue;
		for (let dx = -maxShift; dx <= maxShift; dx++) {
			const x0 = anchor.x + dx;
			if (x0 < 0 || x0 + template.w > w) continue;
			let hits = 0;
			for (let p = 0; p < tCount; p++) {
				const tx = template.onPixels[p][0];
				const ty = template.onPixels[p][1];
				if (edgeMap[(y0 + ty) * w + (x0 + tx)]) hits++;
			}
			const score = hits / tCount;
			if (score > best.score) {
				best = { score, dx, dy };
				if (score >= 0.99) return best;
			}
		}
	}
	return best;
}

function reclassifyShifted(missing, extra, sourceEdge, targetEdge, w, h, maxShift, threshold) {
	const stillMissing = [];
	const shifted = [];
	const consumedExtras = new Set();
	for (const b of missing) {
		if (b.w < 8 || b.h < 8) {
			stillMissing.push(b);
			continue;
		}
		const tpl = extractTemplate(sourceEdge, w, b);
		const result = shiftSearch(
			tpl,
			targetEdge,
			w,
			h,
			{ x: b.x, y: b.y },
			maxShift
		);
		if (!result || result.score < threshold) {
			stillMissing.push(b);
			continue;
		}
		const matchCx = b.x + result.dx + b.w / 2;
		const matchCy = b.y + result.dy + b.h / 2;
		let consumedIdx = -1;
		for (let i = 0; i < extra.length; i++) {
			if (consumedExtras.has(i)) continue;
			const e = extra[i];
			if (
				matchCx >= e.x &&
				matchCx <= e.x + e.w &&
				matchCy >= e.y &&
				matchCy <= e.y + e.h
			) {
				consumedIdx = i;
				break;
			}
		}
		if (consumedIdx >= 0) consumedExtras.add(consumedIdx);
		shifted.push({
			goal: b,
			score: result.score,
			dx: result.dx,
			dy: result.dy,
			pairedExtra: consumedIdx >= 0 ? extra[consumedIdx] : null,
		});
	}
	const stillExtra = extra.filter((_, i) => !consumedExtras.has(i));
	return { stillMissing, shifted, stillExtra };
}

export function reclassifyShiftedDown(
	missing,
	extra,
	sourceEdge,
	targetEdge,
	w,
	h,
	maxShiftPx,
	threshold,
	factor
) {
	if (factor <= 1) {
		return reclassifyShifted(
			missing,
			extra,
			sourceEdge,
			targetEdge,
			w,
			h,
			maxShiftPx,
			threshold
		);
	}
	const src = downsampleBin(sourceEdge, w, h, factor);
	const tgt = downsampleBin(targetEdge, w, h, factor);
	const scaledMissing = missing.map(b => ({
		...b,
		_orig: b,
		x: Math.floor(b.x / factor),
		y: Math.floor(b.y / factor),
		w: Math.max(1, Math.floor(b.w / factor)),
		h: Math.max(1, Math.floor(b.h / factor)),
	}));
	const scaledExtra = extra.map(b => ({
		...b,
		_orig: b,
		x: Math.floor(b.x / factor),
		y: Math.floor(b.y / factor),
		w: Math.max(1, Math.floor(b.w / factor)),
		h: Math.max(1, Math.floor(b.h / factor)),
	}));
	const result = reclassifyShifted(
		scaledMissing,
		scaledExtra,
		src.bin,
		tgt.bin,
		src.w,
		src.h,
		Math.ceil(maxShiftPx / factor),
		threshold
	);
	return {
		stillMissing: result.stillMissing.map(b => b._orig),
		stillExtra: result.stillExtra.map(b => b._orig),
		shifted: result.shifted.map(s => ({
			goal: s.goal._orig,
			score: s.score,
			dx: s.dx * factor,
			dy: s.dy * factor,
			pairedExtra: s.pairedExtra ? s.pairedExtra._orig : null,
		})),
	};
}

export function pickShiftFactor(W) {
	// Auto-pick downsample factor so the search runs at ~500px working
	// width. Empirically keeps runtime under 1.5s even on 1700×1000.
	return W >= 600 ? Math.max(2, Math.round(W / 500)) : 1;
}

// ────────────────────────────────────────────────────────────────────────────
// Grid luminance diff
// ────────────────────────────────────────────────────────────────────────────

export function gridDiff(grayA, grayB, w, h, cellsW, cellsH) {
	const cells = [];
	const cellW = w / cellsW;
	const cellH = h / cellsH;
	for (let cy = 0; cy < cellsH; cy++) {
		for (let cx = 0; cx < cellsW; cx++) {
			const x0 = Math.floor(cx * cellW);
			const y0 = Math.floor(cy * cellH);
			const x1 = Math.floor((cx + 1) * cellW);
			const y1 = Math.floor((cy + 1) * cellH);
			let sum = 0;
			let n = 0;
			for (let y = y0; y < y1; y++) {
				for (let x = x0; x < x1; x++) {
					const i = y * w + x;
					sum += Math.abs(grayA[i] - grayB[i]);
					n++;
				}
			}
			cells.push({
				cx,
				cy,
				x: x0,
				y: y0,
				w: x1 - x0,
				h: y1 - y0,
				delta: n > 0 ? sum / n : 0,
			});
		}
	}
	return cells;
}

// ────────────────────────────────────────────────────────────────────────────
// Region/cell overlap helpers (used by audit.mjs to suppress findings
// that fall inside an authored region — those are covered by per-region
// checks already)
// ────────────────────────────────────────────────────────────────────────────

export function bboxOverlapsAnyFracRegion(bbox, regions, w, h) {
	for (const frac of Object.values(regions)) {
		const rx0 = frac.x * w;
		const ry0 = frac.y * h;
		const rx1 = (frac.x + frac.w) * w;
		const ry1 = (frac.y + frac.h) * h;
		if (
			bbox.x < rx1 &&
			bbox.x + bbox.w > rx0 &&
			bbox.y < ry1 &&
			bbox.y + bbox.h > ry0
		) {
			return true;
		}
	}
	return false;
}
