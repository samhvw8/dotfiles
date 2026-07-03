// Shared image loader. Picks the right decoder by file extension and
// returns the same `{ width, height, data }` shape `pngjs` produces so
// every downstream module (PNG sampling, edge maps, Sobel, dominant-
// cluster detection, etc.) works unchanged regardless of source format.
//
// PNG is preferred — its lossless encoding doesn't introduce the
// chroma-subsampling and block artifacts that confuse pixel-cluster
// sampling. JPEG support exists for convenience (designers often
// export from Figma/Photoshop as JPEG) but the audit's tolerances
// were tuned against PNG inputs, so heavily-compressed JPEGs may
// trip a few extra false-positive clusters near sharp edges. When
// possible, re-export as PNG.
//
// Format detection: extension only. We don't sniff magic bytes
// because file extensions in design folders are reliable (users
// don't typically rename `.jpg` to `.png` or vice versa) and
// sniffing would require allocating + reading the first 16 bytes
// before deciding the decoder, which complicates the small-file
// fast path.

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import jpegJs from "jpeg-js";

const JPEG_EXTS = new Set([".jpg", ".jpeg"]);
const PNG_EXTS = new Set([".png"]);

export function readImage(filePath) {
	const resolved = path.resolve(filePath);
	const ext = path.extname(resolved).toLowerCase();
	const buf = fs.readFileSync(resolved);
	if (PNG_EXTS.has(ext)) {
		return PNG.sync.read(buf);
	}
	if (JPEG_EXTS.has(ext)) {
		// `useTArray: true` returns Uint8Array instead of a Node Buffer —
		// the same type pngjs emits, so the indexed-byte arithmetic in
		// downstream code (e.g. `data[idx], data[idx+1], data[idx+2]`)
		// behaves identically.
		const decoded = jpegJs.decode(buf, { useTArray: true });
		return {
			width: decoded.width,
			height: decoded.height,
			data: decoded.data,
		};
	}
	throw new Error(
		`Unsupported image format: ${ext} (file: ${filePath}). ` +
			`Supported: .png (preferred), .jpg, .jpeg.`
	);
}

export function isSupportedImageExt(ext) {
	const e = ext.toLowerCase();
	return PNG_EXTS.has(e) || JPEG_EXTS.has(e);
}

export const SUPPORTED_IMAGE_EXTS = [...PNG_EXTS, ...JPEG_EXTS];
