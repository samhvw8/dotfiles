#!/usr/bin/env python3
"""
Run microsoft/OmniParser-v2.0 on a goal PNG and emit a structured list
of UI element detections (bboxes + labels + type tags) as JSON to stdout.

OmniParser-v2.0 = YOLOv8 (icon_detect, AGPL) + Florence-2-base (icon_caption,
MIT) + easyocr (Apache-2.0). The YOLO is fine-tuned on UI screenshots,
which is the ingredient stock Florence-2 lacks — it actually finds the
buttons, pills, cards, and icons that are the regions we want to author.

Output contract (one JSON object on stdout):
  {
    "image":    {"width": int, "height": int, "path": str},
    "model":    "microsoft/OmniParser-v2.0",
    "elements": [
      {
        "bbox":          [x1, y1, x2, y2],   # absolute pixels
        "label":         "Order #4000257714" | "button" | "shopping cart icon",
        "type":          "text" | "icon",     # text = OCR; icon = YOLO+Florence
        "interactivity": bool,                 # OmniParser's clickability heuristic
      },
      ...
    ]
  }

Progress and errors go to stderr so the Node wrapper can stream them
without polluting the JSON channel.

Usage:
  python3 _omniparser.py --image=<path> [--bbox-threshold=0.05]
                                        [--iou-threshold=0.7]

Implementation note: instead of reimplementing OmniParser's pipeline,
we download its HF repo (which ships handler.py + model weights) and
instantiate the EndpointHandler directly. That is ~20 lines of glue
versus ~300 lines of reimplemented YOLO+Florence+OCR+overlap-removal
logic, and it tracks any future upstream fixes for free.
"""
import argparse
import json
import os
import sys
import time

os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
# Silence ultralytics' progress chatter — it'd land in our JSON channel.
os.environ.setdefault("YOLO_VERBOSE", "False")


def log(msg: str) -> None:
    print(f"[omniparser] {msg}", file=sys.stderr, flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to the goal PNG")
    parser.add_argument(
        "--bbox-threshold",
        type=float,
        default=0.05,
        help="YOLO confidence floor (default 0.05; lower = more detections)",
    )
    parser.add_argument(
        "--iou-threshold",
        type=float,
        default=0.7,
        help="NMS IoU threshold (default 0.7; lower = more aggressive overlap removal)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not os.path.exists(args.image):
        log(f"image not found: {args.image}")
        return 2

    log("loading dependencies (transformers / torch / ultralytics / easyocr / supervision / huggingface_hub)…")
    t0 = time.time()
    try:
        from huggingface_hub import snapshot_download
        from PIL import Image  # noqa: F401  (handler imports too; surface failure here)
    except ImportError as e:
        log(f"missing python dep: {e}. Re-run via bootstrap-regions.mjs to install.")
        return 3
    log(f"  ok ({time.time() - t0:.1f}s)")

    log("downloading / locating OmniParser-v2.0 (cached after first run)…")
    t0 = time.time()
    repo_dir = snapshot_download(repo_id="microsoft/OmniParser-v2.0")
    log(f"  repo at: {repo_dir}  ({time.time() - t0:.1f}s)")

    # Make handler.py importable. The HF repo ships it at the root.
    sys.path.insert(0, repo_dir)
    log("instantiating EndpointHandler (loads YOLOv8 + Florence-2 captioner + easyocr; first run downloads ~500MB)…")
    t0 = time.time()
    try:
        from handler import EndpointHandler  # type: ignore
    except Exception as e:
        log(f"failed to import handler.py from {repo_dir}: {e}")
        return 4
    handler = EndpointHandler(model_dir=repo_dir)
    log(f"  ready ({time.time() - t0:.1f}s)")

    log(f"opening {args.image}")
    image = Image.open(args.image).convert("RGB")
    W, H = image.size
    log(f"  size: {W}×{H}")

    log(f"running detection (bbox_threshold={args.bbox_threshold}, iou_threshold={args.iou_threshold})…")
    t0 = time.time()
    # Two upstream quirks worked around here:
    #  1. transformers.image_utils.load_image (which the handler calls)
    #     wants a plain absolute file path — NOT file:// URIs.
    #  2. handler.get_som_labeled_img defaults imgsz to a dict
    #     ({"h": ..., "w": ...}) when image_size is None, which
    #     ultralytics 8.3.70 rejects. Passing image_size explicitly
    #     forces the list branch ([h, w]) which ultralytics accepts.
    result = handler({
        "inputs": {
            "image": os.path.abspath(args.image),
            "image_size": {"h": image.height, "w": image.width},
            "bbox_threshold": args.bbox_threshold,
            "iou_threshold": args.iou_threshold,
        }
    })
    log(f"  done ({time.time() - t0:.1f}s)")

    elements = []
    for det in result.get("bboxes", []):
        bbox = det.get("bbox") or []
        if len(bbox) != 4:
            continue
        # OmniParser returns NORMALIZED coords (0..1). Convert to absolute.
        x1, y1, x2, y2 = (float(c) for c in bbox)
        if x2 <= x1 or y2 <= y1:
            continue
        elements.append({
            "bbox": [x1 * W, y1 * H, x2 * W, y2 * H],
            "label": (det.get("content") or "").strip(),
            "type": det.get("type", "icon"),
            "interactivity": bool(det.get("interactivity", False)),
        })

    log(f"detected {len(elements)} elements (text + icon)")

    out = {
        "image": {
            "width": W,
            "height": H,
            "path": os.path.abspath(args.image),
        },
        "model": "microsoft/OmniParser-v2.0",
        "elements": elements,
    }
    json.dump(out, sys.stdout)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
