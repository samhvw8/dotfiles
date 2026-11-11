#!/usr/bin/env python3
"""Motion-graphics calculator: compute constants instead of remembering them.

Subcommands: spring, bezier, beats, posterize, fov, frames. Each prints a
compact table, or JSON with --json. Python 3 standard library only.
"""

import argparse
import json
import math
import sys
from fractions import Fraction

SETTLE_TOLERANCE = 0.005  # settle = last time the value is more than 0.5% from 1


def positive(text):
    """argparse type: a number > 0, also accepting a ratio such as 30000/1001."""
    try:
        value = Fraction(text)
    except (ValueError, ZeroDivisionError):
        raise argparse.ArgumentTypeError("not a number: %r" % text)
    if value <= 0:
        raise argparse.ArgumentTypeError("must be greater than 0: %r" % text)
    return value


def fmt(value, digits=4):
    """Format a number without trailing zeros."""
    if isinstance(value, float) and not math.isfinite(value):
        return str(value)
    text = "%.*f" % (digits, float(value))
    return text.rstrip("0").rstrip(".") if "." in text else text


def emit(args, rows, data, notes=()):
    """Print rows as an aligned table (or data as JSON)."""
    if args.json:
        print(json.dumps(data, indent=1))
        return
    widths = [max(len(str(row[i])) for row in rows if i < len(row))
              for i in range(max(len(row) for row in rows))]
    for row in rows:
        print("  ".join("%-*s" % (widths[i], cell) for i, cell in enumerate(row)).rstrip())
    for note in notes:
        print(note)


# --- spring ------------------------------------------------------------------

def spring_offset(omega, zeta, v0):
    """Return y(t) = x(t) - 1 for a unit step from x(0)=0 with velocity v0, and a decay rate."""
    if zeta < 1:
        damped = omega * math.sqrt(1 - zeta * zeta)
        c2 = (v0 - zeta * omega) / damped
        amplitude = math.hypot(1.0, c2)

        def y(t):
            return math.exp(-zeta * omega * t) * (-math.cos(damped * t) + c2 * math.sin(damped * t))
        return y, zeta * omega, amplitude
    if zeta == 1:
        c2 = v0 - omega

        def y(t):
            return (-1.0 + c2 * t) * math.exp(-omega * t)
        # (1 + |c2| t) e^(-wt) <= (1 + |c2|/w) e^(-wt/2) * const; halve the rate for the bound.
        return y, omega / 2, 1.0 + abs(c2) / omega
    root = math.sqrt(zeta * zeta - 1)
    r1, r2 = -omega * (zeta - root), -omega * (zeta + root)
    a = (v0 + r2) / (r1 - r2)
    b = -1.0 - a

    def y(t):
        return a * math.exp(r1 * t) + b * math.exp(r2 * t)
    return y, -r1, abs(a) + abs(b)


def refine_root(f, lo, hi):
    """Bisect for the sign change of f between lo and hi."""
    f_lo = f(lo)
    for _ in range(80):
        mid = (lo + hi) / 2
        if (f(mid) > 0) == (f_lo > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def spring_numbers(stiffness, damping, mass, v0):
    omega = math.sqrt(stiffness / mass)
    zeta = damping / (2 * math.sqrt(stiffness * mass))
    out = {
        "mass": mass, "stiffness": stiffness, "damping": damping,
        "response": 2 * math.pi / omega, "zeta": zeta, "v0": v0,
        "regime": "underdamped" if zeta < 1 else "critically damped" if zeta == 1 else "overdamped",
        "overshoot_percent": None, "first_peak_seconds": None, "settle_seconds": None,
    }
    if zeta <= 0:
        out["regime"] = "undamped (never settles)"
        out["overshoot_percent"] = 100.0 if v0 == 0 else None
        return out

    y, rate, amplitude = spring_offset(omega, zeta, v0)
    # After `horizon` the decaying envelope is under the tolerance for good.
    horizon = max(math.log(max(amplitude, 1.0) / SETTLE_TOLERANCE) / rate, 1e-9) * 1.05
    period = 2 * math.pi / (omega * math.sqrt(1 - zeta * zeta)) if zeta < 1 else horizon
    steps = int(min(2_000_000, max(20_000, 400 * horizon / period)))
    dt = horizon / steps
    samples = [y(i * dt) for i in range(steps + 1)]

    def slope(t):
        h = dt * 1e-3
        return y(t + h) - y(t - h)

    # First peak: the first local maximum of x after t=0.
    for i in range(1, steps):
        if samples[i] >= samples[i - 1] and samples[i] > samples[i + 1]:
            out["first_peak_seconds"] = refine_root(slope, (i - 1) * dt, (i + 1) * dt)
            break
    peak = max(samples)
    if out["first_peak_seconds"] is not None:
        peak = max(peak, y(out["first_peak_seconds"]))
    out["overshoot_percent"] = max(0.0, peak) * 100

    last = max((i for i in range(steps + 1) if abs(samples[i]) > SETTLE_TOLERANCE), default=None)
    if last is None:
        out["settle_seconds"] = 0.0
    elif last == steps:
        raise SystemExit("spring: settle time not found inside the search horizon")
    else:
        sign = 1.0 if samples[last] > 0 else -1.0
        out["settle_seconds"] = refine_root(
            lambda t: sign * y(t) - SETTLE_TOLERANCE, last * dt, (last + 1) * dt)
    return out


def cmd_spring(args, parser):
    by_response = args.response is not None or args.zeta is not None
    by_constants = args.stiffness is not None or args.damping is not None
    if by_response == by_constants:
        parser.error("give either --response and --zeta, or --stiffness and --damping")
    mass = float(args.mass)
    if by_response:
        if args.response is None or args.zeta is None:
            parser.error("--response and --zeta go together")
        if args.zeta < 0:
            parser.error("--zeta must be 0 or greater")
        response = float(args.response)
        stiffness = mass * (2 * math.pi / response) ** 2
        damping = 4 * math.pi * args.zeta * mass / response
    else:
        if args.stiffness is None or args.damping is None:
            parser.error("--stiffness and --damping go together")
        if args.damping < 0:
            parser.error("--damping must be 0 or greater")
        stiffness, damping = float(args.stiffness), args.damping

    n = spring_numbers(stiffness, damping, mass, args.v0)
    if by_response:
        n["zeta"], n["response"] = args.zeta, response  # exactly as typed
        if args.zeta == 1:
            n["regime"] = "critically damped"

    def or_none(value, digits, unit):
        return "none" if value is None else fmt(value, digits) + unit

    rows = [
        ("mass", fmt(n["mass"])),
        ("stiffness k", fmt(n["stiffness"], 3)),
        ("damping c", fmt(n["damping"], 3)),
        ("response", fmt(n["response"]) + " s"),
        ("zeta", fmt(n["zeta"])),
        ("regime", n["regime"]),
        ("peak overshoot", or_none(n["overshoot_percent"], 2, " %")),
        ("first peak", or_none(n["first_peak_seconds"], 4, " s")),
        ("settle (0.5%)", "never" if n["settle_seconds"] is None
         else fmt(n["settle_seconds"], 4) + " s"),
    ]
    if args.v0:
        rows.insert(5, ("v0", fmt(args.v0) + " travel/s"))
    if args.fps is not None:
        fps = float(args.fps)
        n["fps"] = fps
        n["settle_frames"] = (None if n["settle_seconds"] is None
                              else math.ceil(n["settle_seconds"] * fps - 1e-9))
        rows.append(("settle frames", "never" if n["settle_frames"] is None
                     else "%d at %s fps" % (n["settle_frames"], fmt(fps, 3))))
    notes = []
    if n["zeta"] > 1:
        notes.append("Remotion treats ζ ≥ 1 as critically damped")
        n["note"] = notes[0]
    emit(args, rows, n, notes)


# --- bezier ------------------------------------------------------------------

def bezier_numbers(x1, y1, x2, y2, steps=20000):
    def point(t, a, b):
        u = 1 - t
        return 3 * u * u * t * a + 3 * u * t * t * b + t ** 3

    def rate(t, a, b):
        u = 1 - t
        return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b)

    peak_speed, peak_at = 0.0, 0.0
    low = high = 0.0
    for i in range(steps + 1):
        t = i / steps
        y = point(t, y1, y2)
        low, high = min(low, y), max(high, y)
        dx, dy = rate(t, x1, x2), rate(t, y1, y2)
        speed = abs(dy) / dx if dx > 1e-12 else (math.inf if abs(dy) > 1e-12 else 0.0)
        if speed > peak_speed:
            peak_speed, peak_at = speed, point(t, x1, x2)

    def progress_at(time):
        lo, hi = 0.0, 1.0
        for _ in range(60):
            mid = (lo + hi) / 2
            if point(mid, x1, x2) < time:
                lo = mid
            else:
                hi = mid
        return point((lo + hi) / 2, y1, y2)

    return {
        "cubic_bezier": [x1, y1, x2, y2],
        "peak_speed_over_average": peak_speed,
        "peak_speed_at_time_fraction": peak_at,
        "overshoot_percent": max(0.0, high - 1) * 100,
        "undershoot_percent": max(0.0, -low) * 100,
        "travel_at_time": {"10%": progress_at(0.10), "25%": progress_at(0.25),
                           "50%": progress_at(0.50)},
    }


def cmd_bezier(args, parser):
    if (len(args.points) == 4) == (args.influence is not None) or len(args.points) not in (0, 4):
        parser.error("give either X1 Y1 X2 Y2 or --influence OUT IN")
    notes = []
    if args.influence is not None:
        out_pct, in_pct = args.influence
        if not (0 <= out_pct <= 100 and 0 <= in_pct <= 100):
            parser.error("--influence values are percentages from 0 to 100")
        x1, y1, x2, y2 = out_pct / 100, 0.0, 1 - in_pct / 100, 1.0
        notes.append("After Effects flat handles (speed 0 at both keys): outgoing influence %s%%, "
                     "incoming influence %s%%." % (fmt(out_pct), fmt(in_pct)))
        notes.append("This mapping is exact only for 1D temporal properties (opacity, rotation, "
                     "one separated dimension); a spatial path eases along its own speed graph.")
    else:
        x1, y1, x2, y2 = args.points
        if not (0 <= x1 <= 1 and 0 <= x2 <= 1):
            parser.error("X1 and X2 must be within 0..1 (CSS cubic-bezier rule)")
    n = bezier_numbers(x1, y1, x2, y2)
    if notes:
        n["notes"] = notes
    travel = n["travel_at_time"]
    rows = [
        ("cubic-bezier", "(%s)" % ", ".join(fmt(v) for v in (x1, y1, x2, y2))),
        ("peak / average speed", fmt(n["peak_speed_over_average"], 3)),
        ("peak speed at", fmt(n["peak_speed_at_time_fraction"] * 100, 1) + " % of the time"),
        ("max overshoot", fmt(n["overshoot_percent"], 2) + " %"),
        ("max undershoot", fmt(n["undershoot_percent"], 2) + " %"),
        ("travel at 10% time", fmt(travel["10%"] * 100, 1) + " %"),
        ("travel at 25% time", fmt(travel["25%"] * 100, 1) + " %"),
        ("travel at 50% time", fmt(travel["50%"] * 100, 1) + " %"),
    ]
    emit(args, rows, n, notes)


# --- beats -------------------------------------------------------------------

def nearest(value):
    """Round a Fraction half up, so ties never depend on float or banker's rounding."""
    return math.floor(value + Fraction(1, 2))


def cmd_beats(args, parser):
    interval = Fraction(60) * args.fps / args.bpm  # frames per beat, exact
    naive_step = nearest(interval)
    beats = []
    for n in range(args.count + 1):
        exact = n * interval
        beats.append({"beat": n, "seconds": float(Fraction(60 * n) / args.bpm),
                      "frame": nearest(exact), "naive_frame": n * naive_step})
    last = beats[-1]
    drift = last["naive_frame"] - last["frame"]
    data = {"bpm": float(args.bpm), "fps": float(args.fps),
            "frames_per_beat": float(interval), "naive_frames_per_beat": naive_step,
            "beats": beats, "naive_drift_frames": drift,
            "naive_drift_ms": float(drift * 1000 / args.fps)}
    rows = [("beat", "seconds", "frame", "naive")]
    rows += [(b["beat"], "%.3f" % b["seconds"], b["frame"], b["naive_frame"]) for b in beats]
    notes = [
        "frame = round(beat x 60 x fps / bpm); one beat = %s frames." % fmt(float(interval), 4),
        "Naive method (add %d frames per beat) is off by %+d frame(s) (%+.0f ms) at beat %d."
        % (naive_step, drift, data["naive_drift_ms"], args.count),
    ]
    emit(args, rows, data, notes)


# --- posterize ---------------------------------------------------------------

def cmd_posterize(args, parser):
    fps = args.fps
    # Any whole-frame hold is exact. List the ones that give a whole frame rate;
    # a fractional file rate (29.97) has none, so list its first holds instead.
    holds = [n for n in range(2, math.floor(fps) + 1) if (fps / n).denominator == 1]
    holds = holds or list(range(2, 9))
    exact = [{"hold_frames": n, "fps": float(fps / n)} for n in holds]
    data = {"fps": float(fps), "exact_steps": exact}
    rows = [("stepped fps", "hold")]
    rows += [(fmt(e["fps"], 3), "%d frames" % e["hold_frames"]) for e in exact]
    notes = ["Exact steps hold every picture a whole number of frames; other whole holds "
             "(fractional rates) are exact too, check one with --target."]
    if args.target is not None:
        ratio = fps / args.target
        ok = ratio.denominator == 1 and ratio >= 1
        data["target"] = {"fps": float(args.target), "exact": ok,
                          "frames_per_step": float(ratio)}
        if ok:
            data["target"]["hold_cadence"] = [int(ratio)]
            notes.append("target %s fps in %s fps: yes, hold every picture %d frame(s)."
                         % (fmt(args.target, 3), fmt(fps, 3), ratio))
        elif ratio < 1:
            notes.append("target %s fps in %s fps: no, the target is faster than the file."
                         % (fmt(args.target, 3), fmt(fps, 3)))
        else:
            steps = ratio.denominator
            cadence = [math.floor((k + 1) * ratio) - math.floor(k * ratio) for k in range(steps)]
            data["target"]["hold_cadence"] = cadence
            shown = cadence if steps <= 12 else cadence[:12]
            notes.append("target %s fps in %s fps: no, %s frames per step is not a whole number; "
                         "holds would run %s%s (judder)."
                         % (fmt(args.target, 3), fmt(fps, 3), fmt(float(ratio), 4),
                            "-".join(str(c) for c in shown), "" if steps <= 12 else "-..."))
    emit(args, rows, data, notes)


# --- fov ---------------------------------------------------------------------

def cmd_fov(args, parser):
    focal, width, sensor = float(args.focal), float(args.width), float(args.sensor)
    data = {"focal_mm": focal, "width_px": width, "sensor_mm": sensor,
            "zoom_px": width * focal / sensor,
            "horizontal_fov_degrees": math.degrees(2 * math.atan(sensor / 2 / focal))}
    rows = [
        ("focal length", fmt(focal) + " mm"),
        ("sensor width", fmt(sensor) + " mm"),
        ("comp width", fmt(width) + " px"),
        ("zoom", fmt(data["zoom_px"], 2) + " px"),
        ("horizontal FOV", fmt(data["horizontal_fov_degrees"], 2) + " deg"),
    ]
    emit(args, rows, data)


# --- frames ------------------------------------------------------------------

def cmd_frames(args, parser):
    if (args.ms is None) == (args.frames is None):
        parser.error("give either --ms or --frames")
    fps = args.fps
    data = {"fps": float(fps), "conversions": []}
    if args.ms is not None:
        rows = [("ms", "exact frames", "frames", "actual ms")]
        for ms in args.ms:
            exact = ms * fps / 1000
            whole = nearest(exact)
            actual = whole * 1000 / fps
            data["conversions"].append({"ms": float(ms), "exact_frames": float(exact),
                                        "frames": whole, "actual_ms": float(actual)})
            rows.append((fmt(ms, 3), fmt(float(exact), 3), whole, fmt(float(actual), 2)))
    else:
        ms = args.frames * 1000 / fps
        data["conversions"].append({"frames": float(args.frames), "ms": float(ms),
                                    "seconds": float(ms / 1000)})
        rows = [("frames", "ms", "seconds"),
                (fmt(args.frames, 3), fmt(float(ms), 2), fmt(float(ms / 1000), 4))]
    emit(args, rows, data, ["at %s fps (one frame = %s ms)" % (fmt(fps, 3), fmt(float(1000 / fps), 3))])


# --- command line ------------------------------------------------------------

def build_parser():
    parser = argparse.ArgumentParser(
        description="Motion-graphics calculator: springs, bezier easings, beat frames, "
                    "posterize steps, camera FOV and ms/frame conversion.")
    sub = parser.add_subparsers(dest="command", required=True, metavar="COMMAND")
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json", action="store_true", help="print JSON instead of a table")

    p = sub.add_parser("spring", parents=[common],
                       help="convert response/zeta and stiffness/damping; overshoot and settle time",
                       description="Spring from x=0 to 1. Give --response and --zeta, or "
                                   "--stiffness and --damping.")
    p.add_argument("--response", type=positive, metavar="R", help="undamped period in seconds")
    p.add_argument("--zeta", type=float, metavar="Z", help="damping ratio")
    p.add_argument("--stiffness", type=positive, metavar="K")
    p.add_argument("--damping", type=float, metavar="C")
    p.add_argument("--mass", type=positive, default=Fraction(1), metavar="M", help="default 1")
    p.add_argument("--v0", type=float, default=0.0,
                   help="initial velocity in travel distances per second (default 0)")
    p.add_argument("--fps", type=positive, metavar="N", help="also print the settle time in frames")
    p.set_defaults(run=cmd_spring)

    p = sub.add_parser("bezier", parents=[common],
                       help="speed ratio, overshoot and travel of a CSS cubic-bezier",
                       description="Sample cubic-bezier(X1, Y1, X2, Y2), or build it from "
                                   "After Effects influence percentages.")
    p.add_argument("points", nargs="*", type=float, metavar="X1 Y1 X2 Y2")
    p.add_argument("--influence", nargs=2, type=float, metavar=("OUT", "IN"),
                   help="After Effects outgoing and incoming influence in percent")
    p.set_defaults(run=cmd_bezier)

    p = sub.add_parser("beats", parents=[common], help="frame index of each beat, without drift")
    p.add_argument("--bpm", type=positive, required=True, metavar="B")
    p.add_argument("--fps", type=positive, required=True, metavar="F")
    p.add_argument("--count", type=int, default=16, metavar="N",
                   help="last beat to list (default 16)")
    p.set_defaults(run=cmd_beats)

    p = sub.add_parser("posterize", parents=[common],
                       help="stepped frame rates that divide the file frame rate exactly")
    p.add_argument("--fps", type=positive, required=True, metavar="F")
    p.add_argument("--target", type=positive, metavar="T",
                   help="say whether T fps is an exact step, and its hold cadence")
    p.set_defaults(run=cmd_posterize)

    p = sub.add_parser("fov", parents=[common], help="camera zoom in px and horizontal FOV")
    p.add_argument("--focal", type=positive, required=True, metavar="MM")
    p.add_argument("--width", type=positive, required=True, metavar="PX")
    p.add_argument("--sensor", type=positive, default=Fraction(36), metavar="MM",
                   help="sensor width (default 36)")
    p.set_defaults(run=cmd_fov)

    p = sub.add_parser("frames", parents=[common], help="convert milliseconds and frames")
    p.add_argument("--ms", nargs="+", type=positive, metavar="MS",
                   help="one or more durations, e.g. --ms 150 250")
    p.add_argument("--frames", type=positive, metavar="N")
    p.add_argument("--fps", type=positive, required=True, metavar="F")
    p.set_defaults(run=cmd_frames)
    return parser, sub


def main(argv=None):
    parser, sub = build_parser()
    args = parser.parse_args(argv)
    if args.command == "beats" and args.count < 1:
        parser.error("--count must be 1 or greater")
    args.run(args, sub.choices[args.command])
    return 0


if __name__ == "__main__":
    sys.exit(main())
