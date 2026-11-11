#!/usr/bin/env python3
"""Measured gates on a rendered video, for an agent that cannot watch it.

Decodes VIDEO through ffmpeg to small RGB frames and prints gates R0-R5, each
PASS / FAIL / NOTE with the measured number. Quote the numbers; do not
paraphrase them into "looks good".

Exit code: 0 when no gate FAILs, 1 when a gate FAILs (with --strict also when a
gate is a NOTE), 2 on bad usage or missing tools.

Python 3 standard library only; needs ffmpeg and ffprobe on PATH.
"""

import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
from fractions import Fraction
from operator import add, mul, sub

# --- analysis constants (all printed into --json under "thresholds") ---------
LONG_SIDE, SHORT_SIDE = 160, 90  # analysis frame; swapped for portrait video
BLOCK = 10                       # flash grid block edge in analysis pixels
FLAT_VAR = 4e-6                  # luminance variance below this = flat frame
FLAT_RUN_MAX = 3                 # R1: longer flat runs fail
STILL_DIFF = 0.0006              # mean |RGB diff| (0..1) at or below = unchanged
DUP_DIFF = 0.0001                # R5: diff to previous frame at or below = duplicate
DUP_RATIO = 0.15                 # R5: ... or below this share of the nearby peak diff
END_HOLD_MIN = 0.6               # R2: shorter end hold = "ends mid-motion"
STATIC_MIN = 1.0                 # R4: unchanged stretches longer than this
DURATION_TOL = 0.1               # R0: seconds
AUDIO_SILENT_DB = -60.0          # R0: mean volume at or below = silent
AUDIO_TAIL_MAX = 0.5             # R0: seconds of silent tail allowed
FLASH_LUM_DELTA = 0.10           # R3: relative-luminance change of one transition
FLASH_DARK_MAX = 0.80            # R3: darker state must be below this
RED_DELTA = 20.0                 # R3: change in (R-G-B)*320
RED_RATIO = 0.80                 # R3: R/(R+G+B) of the saturated-red state
FLASH_MAX_PER_SEC = 3            # R3: more flashes than this in 1 s
FLASH_AREA_FAIL = 0.25           # R3: fraction of the frame flashing together
FLASH_AREA_NOTE = 0.03           # R3: about 25% of a 10-degree field (WCAG area)
CADENCE_MAX_PERIOD = 6           # R5: longest repeating hold pattern searched
CADENCE_MIN_HOLDS = 8            # R5: picture changes needed to call a pattern

WR, WG, WB = 0.2126, 0.7152, 0.0722

NOT_CHECKED = [
    "text contrast",
    "safe margins",
    "clipped, overlapping or off-screen text",
    "audio-visual sync",
    "empty frames that are not flat (a gradient or texture with no content)",
]


def _linear(value):
    c = value / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


LUT_R = [WR * _linear(v) for v in range(256)]
LUT_G = [WG * _linear(v) for v in range(256)]
LUT_B = [WB * _linear(v) for v in range(256)]


class Unreadable(Exception):
    """The file exists but cannot be measured; reported as an R0 FAIL."""


# --- ffmpeg / ffprobe --------------------------------------------------------

def probe(path):
    """Return stream facts from ffprobe, or raise Unreadable."""
    proc = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json",
         "-show_format", "-show_streams", path],
        capture_output=True, text=True)
    if proc.returncode != 0:
        raise Unreadable("ffprobe cannot read the file: " + _tail(proc.stderr))
    data = json.loads(proc.stdout)
    streams = data.get("streams", [])
    video = [s for s in streams if s.get("codec_type") == "video"
             and not s.get("disposition", {}).get("attached_pic")]
    if not video:
        raise Unreadable("no video stream in the file")
    v = video[0]
    avg, nominal = _rate(v.get("avg_frame_rate")), _rate(v.get("r_frame_rate"))
    fps = avg or nominal
    if not fps:
        raise Unreadable("ffprobe reports no frame rate for the video stream")
    container = data.get("format", {}).get("duration")
    return {
        "width": int(v["width"]),
        "height": int(v["height"]),
        "codec": v.get("codec_name"),
        "fps": fps,
        "variable_frame_rate": bool(avg and nominal and abs(avg - nominal) / nominal > 0.01),
        "nominal_fps": nominal,
        "container_seconds": float(container) if container is not None else None,
        "audio_streams": sum(1 for s in streams if s.get("codec_type") == "audio"),
    }


def _rate(text):
    if not text or text.endswith("/0") or text in ("0", "0/1"):
        return None
    value = Fraction(text)
    return value if value > 0 else None


def _tail(text, lines=3):
    kept = [line for line in text.strip().splitlines() if line.strip()]
    return " | ".join(kept[-lines:]) if kept else "(no message)"


def read_frames(path, width, height):
    """Yield raw rgb24 frames, one per decoded frame (no duplication or dropping)."""
    size = width * height * 3
    for sync in (["-fps_mode", "passthrough"], ["-vsync", "passthrough"]):
        cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-map", "0:v:0",
               "-vf", "scale=%d:%d:flags=area" % (width, height),
               "-pix_fmt", "rgb24", *sync, "-f", "rawvideo", "-"]
        with tempfile.TemporaryFile() as errors:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=errors)
            count = 0
            try:
                while True:
                    frame = proc.stdout.read(size)
                    if not frame:
                        break
                    if len(frame) != size:
                        raise Unreadable("ffmpeg returned a partial frame (%d of %d bytes)"
                                         % (len(frame), size))
                    count += 1
                    yield frame
            finally:
                proc.stdout.close()
                code = proc.wait()
            errors.seek(0)
            message = errors.read().decode("utf-8", "replace")
        if code == 0:
            return
        # Older ffmpeg (< 5.1) does not know -fps_mode; retry once with -vsync.
        if count == 0 and sync[0] == "-fps_mode" and "fps_mode" in message:
            continue
        raise Unreadable("ffmpeg failed while decoding (exit %d): %s" % (code, _tail(message)))


def measure_audio(path):
    """Mean volume, end time and trailing silence of the first audio stream."""
    proc = subprocess.run(
        ["ffmpeg", "-nostdin", "-hide_banner", "-nostats", "-i", path,
         "-map", "0:a:0", "-af",
         "volumedetect,silencedetect=noise=%gdB:d=0.1" % AUDIO_SILENT_DB,
         "-f", "null", "-", "-progress", "pipe:1"],
        capture_output=True, text=True)
    if proc.returncode != 0:
        raise Unreadable("ffmpeg failed while decoding audio: " + _tail(proc.stderr))
    mean = re.search(r"mean_volume:\s*(-?inf|-?[\d.]+) dB", proc.stderr)
    peak = re.search(r"max_volume:\s*(-?inf|-?[\d.]+) dB", proc.stderr)
    ends = re.findall(r"^out_time_us=(\d+)", proc.stdout, re.M)
    if not mean or not ends:
        raise Unreadable("could not parse ffmpeg audio measurements (volumedetect / progress)")
    audio_end = int(ends[-1]) / 1e6
    starts = [float(x) for x in re.findall(r"silence_start:\s*(-?[\d.]+)", proc.stderr)]
    stops = [float(x) for x in re.findall(r"silence_end:\s*(-?[\d.]+)", proc.stderr)]
    sound_end = audio_end
    if starts and (len(stops) < len(starts) or stops[-1] >= audio_end - 0.05):
        sound_end = max(0.0, starts[-1])  # silence runs to the end of the stream
    return {
        "mean_volume_db": float(mean.group(1)),
        "max_volume_db": float(peak.group(1)) if peak else None,
        "audio_end_seconds": audio_end,
        "sound_end_seconds": sound_end,
    }


# --- per-frame measurement ---------------------------------------------------

def _block_sums(values, width, height):
    """Sum a per-pixel list over BLOCK x BLOCK cells, row-major."""
    out = []
    for top in range(0, height, BLOCK):
        base = top * width
        column = values[base:base + width]
        for k in range(1, BLOCK):
            start = base + k * width
            column = map(add, column, values[start:start + width])
        column = list(column)
        out.extend(sum(column[x:x + BLOCK]) for x in range(0, width, BLOCK))
    return out


def _byte_diff(a, b):
    if a == b:
        return 0.0
    return sum(map(abs, map(sub, a, b))) / (len(a) * 255.0)


def measure_video(path, width, height):
    """Decode the file and return per-frame and per-block series."""
    pixels = width * height
    cell = float(BLOCK * BLOCK)
    lum_mean, lum_var, diff, still = [], [], [], []
    block_lum, block_red, block_ratio = [], [], []
    prev = anchor = None
    for frame in read_frames(path, width, height):
        r = list(map(LUT_R.__getitem__, frame[0::3]))
        g = list(map(LUT_G.__getitem__, frame[1::3]))
        b = list(map(LUT_B.__getitem__, frame[2::3]))
        lum = list(map(add, map(add, r, g), b))
        mean = sum(lum) / pixels
        lum_mean.append(mean)
        lum_var.append(max(0.0, sum(map(mul, lum, lum)) / pixels - mean * mean))

        if prev is None:
            diff.append(0.0)
            still.append(False)
            anchor = frame
        else:
            d_prev = _byte_diff(frame, prev)
            # "Unchanged" is measured against the first frame of the current hold,
            # so a slow drift adds up and ends the hold instead of hiding in it.
            d_anchor = d_prev if anchor is prev else _byte_diff(frame, anchor)
            unchanged = d_anchor <= STILL_DIFF
            diff.append(d_prev)
            still.append(unchanged)
            if not unchanged:
                anchor = frame
        prev = frame

        lums, reds, ratios = [], [], []
        for sr, sg, sb in zip(_block_sums(r, width, height),
                              _block_sums(g, width, height),
                              _block_sums(b, width, height)):
            lums.append((sr + sg + sb) / cell)
            red, green, blue = sr / WR / cell, sg / WG / cell, sb / WB / cell
            total = red + green + blue
            reds.append(max(0.0, red - green - blue) * 320.0)
            ratios.append(red / total if total > 0 else 0.0)
        block_lum.append(lums)
        block_red.append(reds)
        block_ratio.append(ratios)

    return {
        "lum_mean": lum_mean, "lum_var": lum_var, "diff": diff, "still": still,
        "block_lum": list(zip(*block_lum)),
        "block_red": list(zip(*block_red)),
        "block_ratio": list(zip(*block_ratio)),
    }


def runs_of(flags):
    """Return (start, length) for each run of true values."""
    out, start = [], None
    for i, flag in enumerate(flags):
        if flag and start is None:
            start = i
        elif not flag and start is not None:
            out.append((start, i - start))
            start = None
    if start is not None:
        out.append((start, len(flags) - start))
    return out


def holds_of(still):
    """Return (first_frame, length) for each picture and the frames that repeat it."""
    out = []
    for i, unchanged in enumerate(still):
        if unchanged and out:
            out[-1][1] += 1
        else:
            out.append([i, 1])
    return [(a, n) for a, n in out]


# --- gates -------------------------------------------------------------------

class Gate:
    def __init__(self, code, title):
        self.code, self.title = code, title
        self.lines = []  # (status or None, text)
        self.data = {}

    def add(self, status, text):
        self.lines.append((status, text))

    @property
    def status(self):
        found = {s for s, _ in self.lines}
        for level in ("FAIL", "NOTE", "PASS"):
            if level in found:
                return level
        raise AssertionError("gate %s has no measured line" % self.code)


def secs(frames, fps):
    return float(frames / fps)


def gate_r0(info, m, audio, args):
    g = Gate("R0", "render exists")
    fps, n = info["fps"], len(m["lum_mean"])
    video_s = secs(n, fps)
    g.data.update(frames=n, video_seconds=video_s, container_seconds=info["container_seconds"])
    g.add("PASS", "decodes: %d frames, %.3f s of video at %.3f fps" % (n, video_s, float(fps)))
    if info["variable_frame_rate"]:
        g.add("NOTE", "variable frame rate (average %.3f fps, nominal %.3f fps): "
                      "all times below are approximate"
              % (float(fps), float(info["nominal_fps"])))

    container = info["container_seconds"]
    container_text = "%.3f s" % container if container is not None else "unknown"
    if args.expect_seconds is None:
        g.add(None, "duration: video %.3f s, container %s (not checked: no --expect-seconds)"
              % (video_s, container_text))
    else:
        want = args.expect_seconds
        off = [abs(video_s - want)]
        if container is not None:
            off.append(abs(container - want))
        ok = max(off) <= DURATION_TOL + 1e-9
        g.add("PASS" if ok else "FAIL",
              "duration: video %.3f s, container %s, expected %.3f s (tolerance %.1f s)"
              % (video_s, container_text, want, DURATION_TOL))

    flat = sum(1 for v in m["lum_var"] if v < FLAT_VAR)
    g.data.update(flat_frames=flat, luminance_min=min(m["lum_mean"]),
                  luminance_max=max(m["lum_mean"]))
    g.add("FAIL" if flat == n else "PASS",
          "picture: %d of %d frames are flat; mean luminance %.3f to %.3f"
          % (flat, n, min(m["lum_mean"]), max(m["lum_mean"])))

    peak = max(m["diff"])
    at = m["diff"].index(peak)
    g.data.update(max_frame_diff=peak, max_frame_diff_seconds=secs(at, fps))
    g.add("PASS" if peak > STILL_DIFF else "FAIL",
          "motion: largest frame-to-frame difference %.4f at %.3f s (noise floor %.4f)"
          % (peak, secs(at, fps), STILL_DIFF))

    if not args.expect_audio:
        g.add(None, "audio: %d audio stream(s) (not checked: no --expect-audio)"
              % info["audio_streams"])
    elif audio is None:
        g.add("FAIL", "audio: no audio stream in the file")
    else:
        g.data["audio"] = audio
        loud = audio["mean_volume_db"] > AUDIO_SILENT_DB
        g.add("PASS" if loud else "FAIL",
              "audio level: mean %.1f dB (silent at or below %.0f dB)"
              % (audio["mean_volume_db"], AUDIO_SILENT_DB))
        tail = max(0.0, video_s - audio["sound_end_seconds"])
        g.data["audio_silent_tail_seconds"] = tail
        g.add("PASS" if tail <= AUDIO_TAIL_MAX else "FAIL",
              "audio cover: sound ends at %.3f s, video at %.3f s, silent tail %.3f s (max %.1f s)"
              % (audio["sound_end_seconds"], video_s, tail, AUDIO_TAIL_MAX))
    return g


def gate_r1(info, m):
    g = Gate("R1", "no empty frame")
    fps, n = info["fps"], len(m["lum_var"])
    runs = runs_of([v < FLAT_VAR for v in m["lum_var"]])
    g.data["flat_runs"] = [{"start_seconds": secs(a, fps), "start_frame": a, "frames": length}
                           for a, length in runs]
    for start, length in runs:
        where = "flat run at %.3f s (frame %d), %d frame(s)" % (secs(start, fps), start, length)
        if length == n:
            g.add("FAIL", where + ": every frame is flat")
        elif start == 0:
            g.add("NOTE", where + ": leading run, so the first frame / poster is empty")
        elif length > FLAT_RUN_MAX:
            g.add("FAIL", where)
    short = sum(1 for a, length in runs if a != 0 and length <= FLAT_RUN_MAX)
    bad = sum(1 for a, length in runs if a != 0 and length > FLAT_RUN_MAX)
    g.add("FAIL" if bad else "PASS",
          "%d flat run(s) longer than %d frames after the start; %d shorter run(s); "
          "flat = luminance variance below %g" % (bad, FLAT_RUN_MAX, short, FLAT_VAR))
    return g


def end_hold_frames(still):
    last_change = max((i for i, unchanged in enumerate(still) if not unchanged), default=0)
    return len(still) - last_change


def gate_r2(info, m, args):
    g = Gate("R2", "end hold")
    hold = end_hold_frames(m["still"])
    hold_s = secs(hold, info["fps"])
    g.data.update(end_hold_seconds=hold_s, end_hold_frames=hold)
    text = "last picture is held %.3f s (%d frames)" % (hold_s, hold)
    if hold_s > args.end_hold_max + 1e-9:
        g.add("FAIL", "%s, longer than the %.2f s maximum" % (text, args.end_hold_max))
    elif hold_s < END_HOLD_MIN:
        g.add("NOTE", "%s: ends mid-motion (under %.1f s)" % (text, END_HOLD_MIN))
    else:
        g.add("PASS", "%s, within %.1f to %.2f s" % (text, END_HOLD_MIN, args.end_hold_max))
    return g


def find_transitions(values, threshold, qualifies):
    """Frames where the series has moved >= threshold away from its last extreme.

    qualifies(dark_index, bright_index) decides whether the change counts.
    Consecutive entries are opposing changes; two of them make one flash.
    """
    out = []
    direction = 0
    lo = hi = 0
    for i in range(1, len(values)):
        v = values[i]
        if direction <= 0 and v < values[lo]:
            lo = i
        if direction >= 0 and v > values[hi]:
            hi = i
        if direction <= 0 and v - values[lo] >= threshold and qualifies(lo, i):
            out.append(i)
            direction, hi = 1, i
        elif direction >= 0 and values[hi] - v >= threshold and qualifies(i, hi):
            out.append(i)
            direction, lo = -1, i
    return out


def flash_load(per_block, frames, window):
    """Return (most transitions one block makes in a window, blocks over the limit per window start)."""
    need = 2 * FLASH_MAX_PER_SEC + 1  # transitions that make "more than 3 flashes"
    over = [0] * frames
    worst = 0
    for times in per_block:
        j = 0
        for i, t in enumerate(times):
            while t - times[j] >= window:
                j += 1
            worst = max(worst, i - j + 1)
        marks = [0] * (frames + 1)
        for i in range(len(times) - need + 1):
            last = times[i + need - 1]
            if last - times[i] < window:
                marks[max(0, last - window + 1)] += 1
                marks[times[i] + 1] -= 1
        depth = 0
        for s in range(frames):
            depth += marks[s]
            if depth > 0:
                over[s] += 1
    return worst, over


def gate_r3(info, m):
    g = Gate("R3", "flash rate (photosensitivity screen)")
    fps = info["fps"]
    frames = len(m["lum_mean"])
    window = max(1, round(fps))
    blocks = len(m["block_lum"])

    def screen(name, per_block):
        worst, over = flash_load(per_block, frames, window)
        area = max(over) / blocks
        at = secs(over.index(max(over)), fps)
        g.data[name] = {"max_flashes_per_second_in_a_block": worst / 2,
                        "max_area_fraction_over_limit": area,
                        "worst_window_start_seconds": at if area > 0 else None}
        text = ("%s: at most %.1f flashes in 1 s in any block; %.1f%% of the frame exceeds "
                "%d flashes/s at once (fail above %.0f%%)"
                % (name, worst / 2, area * 100, FLASH_MAX_PER_SEC, FLASH_AREA_FAIL * 100))
        if area > FLASH_AREA_FAIL:
            g.add("FAIL", "%s; worst 1 s window starts at %.3f s" % (text, at))
        elif area > FLASH_AREA_NOTE:
            g.add("NOTE", "%s; worst 1 s window starts at %.3f s. WCAG limits flashing to about "
                          "25%% of a 10-degree field (roughly %.0f%% of a screen), so a local "
                          "flash this size can still be unsafe"
                  % (text, at, FLASH_AREA_NOTE * 100))
        else:
            g.add("PASS", text)

    screen("general flash", [
        find_transitions(series, FLASH_LUM_DELTA,
                         lambda dark, bright, s=series: s[dark] < FLASH_DARK_MAX)
        for series in m["block_lum"]])
    screen("red flash", [
        find_transitions(series, RED_DELTA,
                         lambda dark, bright, q=ratio: q[bright] >= RED_RATIO)
        for series, ratio in zip(m["block_red"], m["block_ratio"])])
    g.add(None, "This is a screen that approximates WCAG 2.3.1 on a %dx%d grid of a small frame. "
                "It is not a Harding / PSE certification."
          % (info["grid"][0], info["grid"][1]))
    return g


def gate_r4(info, m):
    g = Gate("R4", "static stretches")
    fps, frames = info["fps"], len(m["still"])
    found = [(a, n) for a, n in holds_of(m["still"])
             if secs(n, fps) > STATIC_MIN and a + n < frames]
    g.data["static_stretches"] = [{"start_seconds": secs(a, fps), "start_frame": a,
                                   "seconds": secs(n, fps), "frames": n} for a, n in found]
    for a, n in found:
        g.add("NOTE", "unchanged for %.3f s (%d frames) from %.3f s (frame %d)"
              % (secs(n, fps), n, secs(a, fps), a))
    if not found:
        g.add("PASS", "no unchanged stretch longer than %.1f s before the end hold" % STATIC_MIN)
    return g


def find_cadence(holds, max_hold, min_frames):
    """Find the repeating hold pattern that covers the most frames (at least min_frames), or None."""
    best = None
    for period in range(1, CADENCE_MAX_PERIOD + 1):
        start = 0
        for i in range(period, len(holds) + 1):
            matches = (i < len(holds) and holds[i] == holds[i - period]
                       and holds[i] <= max_hold and holds[i - period] <= max_hold)
            if matches:
                continue
            chunk = holds[start:i]
            start = i - period + 1
            pattern = chunk[:period]
            if len(chunk) < max(CADENCE_MIN_HOLDS, 3 * period) or max(pattern) < 2:
                continue
            covered = sum(chunk)
            if covered < min_frames:
                continue
            # A longer period must explain clearly more frames to replace a shorter one.
            if best is None or covered > best["frames"] * 1.25:
                best = {"pattern": pattern, "frames": covered, "holds": len(chunk),
                        "first_hold": start + period - 1 - len(chunk)}
    return best


def gate_r5(info, m):
    g = Gate("R5", "cadence")
    fps = info["fps"]
    max_hold = max(1, int(fps / 4))  # a hold of 0.25 s or more is a pause, not motion
    # A lossy encode repeats a frame only approximately, so a duplicate is a frame
    # that barely differs in absolute terms or next to the picture changes around it.
    # The lower of the two sides is used so one scene cut does not drown its neighbours.
    diff = m["diff"]
    dup = [False]
    for i in range(1, len(diff)):
        sides = [max(part) for part in (diff[max(1, i - max_hold):i], diff[i + 1:i + 1 + max_hold])
                 if part]
        nearby = min(sides) if sides else 0.0
        dup.append(diff[i] <= max(DUP_DIFF, DUP_RATIO * nearby))
    holds = holds_of(dup)
    lengths = [n for _, n in holds]
    moving = [n for n in lengths if n <= max_hold]
    g.data.update(picture_changes_in_motion=len(moving), motion_frames=sum(moving),
                  duplicate_frames_in_motion=sum(moving) - len(moving))
    if len(moving) < CADENCE_MIN_HOLDS:
        g.add("NOTE", "not measured: only %d picture change(s) in motion, need %d"
              % (len(moving), CADENCE_MIN_HOLDS))
        return g
    found = find_cadence(lengths, max_hold, float(fps) / 2)
    if not found:
        g.add("PASS", "no repeating duplicate-frame pattern; %d of %d motion frames repeat "
                      "the previous frame" % (sum(moving) - len(moving), sum(moving)))
        return g
    pattern = found["pattern"]
    effective = float(fps) * len(pattern) / sum(pattern)
    start_frame = holds[max(0, found["first_hold"])][0]
    g.data["pattern"] = {"holds": pattern, "effective_fps": effective,
                         "seconds": secs(found["frames"], fps),
                         "start_seconds": secs(start_frame, fps)}
    label = "-".join(str(n) for n in pattern * (2 if len(pattern) > 1 else 4))
    span = "for %.3f s from %.3f s" % (secs(found["frames"], fps), secs(start_frame, fps))
    if len(set(pattern)) == 1:
        g.add("NOTE", "every picture is held %d frames (%s) %s: motion runs at %.3f fps inside "
                      "a %.3f fps file. Fine when stepped on purpose; otherwise a frame-rate "
                      "mismatch" % (pattern[0], label, span, effective, float(fps)))
    else:
        g.add("NOTE", "uneven hold pattern %s %s: motion runs at about %.3f fps inside a %.3f "
                      "fps file, which shows as judder (posterize or frame-rate mismatch)"
              % (label, span, effective, float(fps)))
    return g


# --- report ------------------------------------------------------------------

def unmeasured(reason):
    gates = []
    for code, title in (("R1", "no empty frame"), ("R2", "end hold"),
                        ("R3", "flash rate (photosensitivity screen)"),
                        ("R4", "static stretches"), ("R5", "cadence")):
        g = Gate(code, title)
        g.add("NOTE", "not measured: " + reason)
        gates.append(g)
    return gates


def analyse(args):
    """Return (header line, gates, extra json)."""
    try:
        info = probe(args.video)
    except Unreadable as problem:
        g = Gate("R0", "render exists")
        g.add("FAIL", str(problem))
        return "no readable video stream", [g] + unmeasured("no video decoded"), {}

    portrait = info["height"] > info["width"]
    width, height = (SHORT_SIDE, LONG_SIDE) if portrait else (LONG_SIDE, SHORT_SIDE)
    info["grid"] = (width // BLOCK, height // BLOCK)
    header = ("%dx%d %s, %.3f fps; analysed at %dx%d"
              % (info["width"], info["height"], info["codec"], float(info["fps"]), width, height))
    extra = {"video": {"width": info["width"], "height": info["height"], "codec": info["codec"],
                       "fps": float(info["fps"]), "analysis_size": [width, height],
                       "flash_grid": list(info["grid"])}}
    try:
        m = measure_video(args.video, width, height)
        if not m["lum_mean"]:
            raise Unreadable("ffmpeg decoded 0 frames")
        audio = None
        if args.expect_audio and info["audio_streams"]:
            audio = measure_audio(args.video)
    except Unreadable as problem:
        g = Gate("R0", "render exists")
        g.add("FAIL", str(problem))
        return header, [g] + unmeasured("no video decoded"), extra

    gates = [gate_r0(info, m, audio, args), gate_r1(info, m), gate_r2(info, m, args),
             gate_r3(info, m), gate_r4(info, m), gate_r5(info, m)]
    extra["frames"] = {"luminance_mean": [round(v, 5) for v in m["lum_mean"]],
                       "luminance_variance": [round(v, 8) for v in m["lum_var"]],
                       "diff_to_previous": [round(v, 6) for v in m["diff"]]}
    return header, gates, extra


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Measured gates (R0-R5) on a rendered video. Prints numbers to quote; "
                    "exit 1 when any gate FAILs.")
    parser.add_argument("video", metavar="VIDEO", help="rendered video file")
    parser.add_argument("--expect-seconds", type=float, metavar="S",
                        help="R0 fails unless the duration is within %.1f s of S" % DURATION_TOL)
    parser.add_argument("--expect-audio", action="store_true",
                        help="R0 fails unless an audible audio stream covers the video")
    parser.add_argument("--end-hold-max", type=float, default=1.4, metavar="S",
                        help="R2 fails when the last picture is held longer (default 1.4)")
    parser.add_argument("--json", metavar="PATH", help="also write every number to PATH")
    parser.add_argument("--strict", action="store_true", help="exit 1 on a NOTE as well")
    args = parser.parse_args(argv)

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            parser.error("%s is not on PATH" % tool)
    if not os.path.isfile(args.video):
        parser.error("no such file: %s" % args.video)

    header, gates, extra = analyse(args)

    print("check_render %s" % args.video)
    print("  %s" % header)
    for g in gates:
        print("%s %s: %s" % (g.code, g.title, g.status))
        for status, text in g.lines:
            print("   %-4s  %s" % (status or "-", text))

    by_status = {level: [g.code for g in gates if g.status == level]
                 for level in ("FAIL", "NOTE", "PASS")}
    failed = bool(by_status["FAIL"]) or (args.strict and bool(by_status["NOTE"]))
    verdict = "FAIL" if failed else "OK"
    parts = ["%s %s" % (level, " ".join(codes)) for level, codes in by_status.items() if codes]
    strict = " (strict: NOTE counts as failure)" if args.strict else ""
    summary = "SUMMARY %s%s: %s" % (verdict, strict, "; ".join(parts))
    print(summary)
    print("NOT CHECKED (needs eyes on frame sheets): " + "; ".join(NOT_CHECKED) + ".")

    if args.json:
        thresholds = {name.lower(): value for name, value in globals().items()
                      if name.isupper() and isinstance(value, (int, float))}
        report = {
            "file": os.path.abspath(args.video),
            "summary": summary,
            "exit_code": 1 if failed else 0,
            "gates": [{"id": g.code, "title": g.title, "status": g.status,
                       "lines": [{"status": s, "text": t} for s, t in g.lines],
                       "data": g.data} for g in gates],
            "thresholds": thresholds,
            "not_checked": NOT_CHECKED,
        }
        report.update(extra)
        with open(args.json, "w", encoding="utf-8") as handle:
            json.dump(report, handle, indent=1)
            handle.write("\n")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
