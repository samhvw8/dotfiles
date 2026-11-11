"""Tests for check_render.py and motion_math.py.

Run from the skill folder:
    python3 -m unittest discover -s scripts/tests

The check_render tests build small synthetic clips with ffmpeg lavfi in a
temporary directory, so ffmpeg and ffprobe must be on PATH.
"""

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPTS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECK_RENDER = os.path.join(SCRIPTS, "check_render.py")
MOTION_MATH = os.path.join(SCRIPTS, "motion_math.py")

SIZE = "s=320x180"
ENCODE = ["-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p"]


def run(script, *args):
    return subprocess.run([sys.executable, script, *args], capture_output=True, text=True)


def math_json(*args):
    proc = run(MOTION_MATH, *args, "--json")
    if proc.returncode != 0:
        raise AssertionError("motion_math %s failed: %s" % (args, proc.stderr))
    return json.loads(proc.stdout)


class CheckRenderTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        for tool in ("ffmpeg", "ffprobe"):
            if not shutil.which(tool):
                raise RuntimeError("%s is not on PATH; these tests cannot run without it" % tool)
        cls.tmp = tempfile.mkdtemp(prefix="check_render_test_")
        cls.reports = {}

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp)

    def clip(self, name, video, audio=None, extra=()):
        """Encode a lavfi video graph (and optional lavfi audio source) to an mp4."""
        path = os.path.join(self.tmp, name + ".mp4")
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", video]
        if audio:
            cmd += ["-f", "lavfi", "-i", audio, "-c:a", "aac"]
        cmd += ENCODE + list(extra) + [path]
        subprocess.run(cmd, check=True)
        return path

    def check(self, path, *args):
        """Run check_render and return (exit code, gates by id, stdout)."""
        report = os.path.join(self.tmp, "report.json")
        if os.path.exists(report):
            os.remove(report)
        proc = run(CHECK_RENDER, path, "--json", report, *args)
        self.assertIn(proc.returncode, (0, 1), proc.stderr)
        with open(report, encoding="utf-8") as handle:
            data = json.load(handle)
        self.assertEqual(data["exit_code"], proc.returncode)
        return proc.returncode, {g["id"]: g for g in data["gates"]}, proc.stdout

    def statuses(self, gates):
        return {code: gate["status"] for code, gate in gates.items()}

    # (a) a normal moving clip with audio and an end hold passes R0-R3
    def test_normal_clip_passes(self):
        path = self.clip("normal",
                         "testsrc2=%s:r=30:d=3,tpad=stop_mode=clone:stop_duration=1" % SIZE,
                         audio="sine=f=440:d=4")
        code, gates, out = self.check(path, "--expect-audio", "--expect-seconds", "4")
        status = self.statuses(gates)
        for gate in ("R0", "R1", "R2", "R3"):
            self.assertEqual(status[gate], "PASS", out)
        self.assertEqual(code, 0, out)
        self.assertEqual(gates["R0"]["data"]["frames"], 120)
        self.assertGreater(gates["R0"]["data"]["audio"]["mean_volume_db"], -60)
        self.assertIn("SUMMARY OK", out)
        self.assertIn("NOT CHECKED", out)
        self.assertIn("text contrast", out)
        self.assertIn("not a Harding / PSE certification", out)

    # (b) a 10-frame black gap in the middle fails R1
    def test_black_gap_fails_r1(self):
        path = self.clip("gap", "testsrc2=%s:r=30:d=3,"
                                "drawbox=c=black:t=fill:enable='between(n,40,49)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R1"]["status"], "FAIL", out)
        self.assertEqual(code, 1)
        runs = gates["R1"]["data"]["flat_runs"]
        self.assertEqual([(r["start_frame"], r["frames"]) for r in runs], [(40, 10)])
        self.assertAlmostEqual(runs[0]["start_seconds"], 40 / 30, places=3)
        self.assertEqual(gates["R0"]["status"], "PASS", out)

    def test_leading_black_is_a_note(self):
        path = self.clip("lead", "testsrc2=%s:r=30:d=2,"
                                 "drawbox=c=black:t=fill:enable='lt(n,6)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R1"]["status"], "NOTE", out)
        self.assertEqual(gates["R1"]["data"]["flat_runs"][0]["frames"], 6)

    # (c) a clip whose last 3 s are a frozen frame fails R2
    def test_frozen_tail_fails_r2(self):
        path = self.clip("frozen",
                         "testsrc2=%s:r=30:d=2,tpad=stop_mode=clone:stop_duration=3" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R2"]["status"], "FAIL", out)
        self.assertEqual(code, 1)
        # 91 frames show the frozen picture. The encoder keeps refining it for a few
        # frames, so the measured hold may start slightly late, never early.
        hold = gates["R2"]["data"]["end_hold_frames"]
        self.assertLessEqual(hold, 91)
        self.assertGreaterEqual(hold, 81)

    def test_end_hold_limit_is_an_option(self):
        path = self.clip("frozen2",
                         "testsrc2=%s:r=30:d=2,tpad=stop_mode=clone:stop_duration=3" % SIZE)
        code, gates, out = self.check(path, "--end-hold-max", "3.5")
        self.assertEqual(gates["R2"]["status"], "PASS", out)

    def test_moving_to_the_last_frame_is_a_note(self):
        path = self.clip("moving", "testsrc2=%s:r=30:d=2" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R2"]["status"], "NOTE", out)
        self.assertIn("ends mid-motion", out)
        self.assertEqual(code, 0)
        strict_code, _, strict_out = self.check(path, "--strict")
        self.assertEqual(strict_code, 1, strict_out)

    # (d) full-frame black/white alternating every frame fails R3
    def test_strobe_fails_r3(self):
        path = self.clip("strobe", "color=c=black:%s:r=30:d=3,"
                                   "drawbox=c=white:t=fill:enable='mod(n,2)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R3"]["status"], "FAIL", out)
        self.assertEqual(code, 1)
        general = gates["R3"]["data"]["general flash"]
        self.assertGreater(general["max_area_fraction_over_limit"], 0.99)
        self.assertGreater(general["max_flashes_per_second_in_a_block"], 10)

    def test_slow_blink_passes_r3(self):
        # 2 flashes per second: under the 3 per second limit.
        path = self.clip("blink", "color=c=black:%s:r=30:d=3,"
                                  "drawbox=c=white:t=fill:enable='lt(mod(n,15),7)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R3"]["status"], "PASS", out)
        self.assertEqual(gates["R3"]["data"]["general flash"]
                         ["max_flashes_per_second_in_a_block"], 2.0)

    def test_red_strobe_fails_red_flash(self):
        path = self.clip("red", "color=c=black:%s:r=30:d=3,"
                                "drawbox=c=red:t=fill:enable='mod(n,2)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R3"]["status"], "FAIL", out)
        self.assertGreater(gates["R3"]["data"]["red flash"]["max_area_fraction_over_limit"], 0.99)

    def test_white_strobe_is_not_a_red_flash(self):
        path = self.clip("strobe_w", "color=c=black:%s:r=30:d=2,"
                                     "drawbox=c=white:t=fill:enable='mod(n,2)'" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R3"]["data"]["red flash"]["max_area_fraction_over_limit"], 0.0)

    # (e) a silent clip with --expect-audio fails R0
    def test_no_audio_stream_fails_r0_when_audio_expected(self):
        path = self.clip("mute", "testsrc2=%s:r=30:d=2" % SIZE)
        code, gates, out = self.check(path, "--expect-audio")
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        self.assertIn("no audio stream", out)
        self.assertEqual(code, 1)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R0"]["status"], "PASS", out)

    def test_silent_audio_stream_fails_r0_when_audio_expected(self):
        path = self.clip("silent", "testsrc2=%s:r=30:d=2" % SIZE,
                         audio="anullsrc=r=44100:cl=mono", extra=["-shortest"])
        code, gates, out = self.check(path, "--expect-audio")
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        self.assertLessEqual(gates["R0"]["data"]["audio"]["mean_volume_db"], -60)
        self.assertEqual(code, 1)

    def test_audio_that_stops_early_fails_r0(self):
        path = self.clip("short_audio", "testsrc2=%s:r=30:d=4" % SIZE, audio="sine=f=440:d=2")
        code, gates, out = self.check(path, "--expect-audio")
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        self.assertAlmostEqual(gates["R0"]["data"]["audio_silent_tail_seconds"], 2.0, delta=0.15)

    def test_audio_with_a_silent_tail_fails_r0(self):
        # The audio stream runs the full 4 s but its last 2 s are digital silence.
        path = self.clip("quiet_tail", "testsrc2=%s:r=30:d=4" % SIZE,
                         audio="sine=f=440:d=4,volume=enable='gte(t,2)':volume=0")
        code, gates, out = self.check(path, "--expect-audio")
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        self.assertAlmostEqual(gates["R0"]["data"]["audio_silent_tail_seconds"], 2.0, delta=0.15)

    def test_wrong_duration_fails_r0(self):
        path = self.clip("dur", "testsrc2=%s:r=30:d=2" % SIZE)
        code, gates, out = self.check(path, "--expect-seconds", "3")
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        code, gates, out = self.check(path, "--expect-seconds", "2.05")
        self.assertEqual(gates["R0"]["status"], "PASS", out)

    def test_blank_static_clip_fails_r0(self):
        path = self.clip("blank", "color=c=black:%s:r=30:d=2" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        self.assertEqual(gates["R0"]["data"]["flat_frames"], 60)
        self.assertEqual(gates["R1"]["status"], "FAIL", out)
        self.assertEqual(gates["R5"]["status"], "NOTE", out)  # not measured, never PASS
        self.assertIn("not measured", out)

    def test_static_stretch_is_listed_in_r4(self):
        graph = ("testsrc2=%s:r=30:d=1,tpad=stop_mode=clone:stop_duration=2[a];"
                 "testsrc2=%s:r=30:d=1[b];[a][b]concat=n=2:v=1:a=0" % (SIZE, SIZE))
        path = self.clip("pause", graph)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R4"]["status"], "NOTE", out)
        stretches = gates["R4"]["data"]["static_stretches"]
        self.assertEqual(len(stretches), 1)
        self.assertAlmostEqual(stretches[0]["seconds"], 2.0, delta=0.35)
        self.assertAlmostEqual(stretches[0]["start_seconds"], 1.0, delta=0.35)
        self.assertEqual(code, 0)

    # (f) 24 fps re-timed into 60 fps without interpolation triggers the R5 note
    def test_24_in_60_triggers_r5(self):
        path = self.clip("pulldown", "testsrc2=%s:r=24:d=3,fps=60" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R5"]["status"], "NOTE", out)
        pattern = gates["R5"]["data"]["pattern"]
        self.assertEqual(sorted(pattern["holds"]), [2, 3])
        self.assertAlmostEqual(pattern["effective_fps"], 24.0, places=3)
        self.assertGreater(pattern["seconds"], 2.5)
        self.assertEqual(code, 0)

    def test_doubled_frames_trigger_r5(self):
        path = self.clip("doubled", "testsrc2=%s:r=15:d=3,fps=30" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R5"]["status"], "NOTE", out)
        self.assertEqual(gates["R5"]["data"]["pattern"]["holds"], [2])

    def test_native_cadence_passes_r5(self):
        path = self.clip("native", "testsrc2=%s:r=60:d=2" % SIZE)
        code, gates, out = self.check(path)
        self.assertEqual(gates["R5"]["status"], "PASS", out)

    def test_portrait_video_is_analysed_upright(self):
        path = self.clip("portrait", "testsrc2=s=180x320:r=30:d=1")
        report = os.path.join(self.tmp, "portrait.json")
        run(CHECK_RENDER, path, "--json", report)
        with open(report, encoding="utf-8") as handle:
            data = json.load(handle)
        self.assertEqual(data["video"]["analysis_size"], [90, 160])
        self.assertEqual(len(data["frames"]["luminance_mean"]), 30)

    def test_file_that_is_not_a_video_fails_r0_and_measures_nothing(self):
        path = os.path.join(self.tmp, "garbage.mp4")
        with open(path, "w", encoding="utf-8") as handle:
            handle.write("this is not a video\n")
        code, gates, out = self.check(path)
        self.assertEqual(code, 1)
        self.assertEqual(gates["R0"]["status"], "FAIL", out)
        for gate in ("R1", "R2", "R3", "R4", "R5"):
            self.assertEqual(gates[gate]["status"], "NOTE", out)
        self.assertNotIn("PASS", out)

    def test_truncated_video_never_passes(self):
        good = self.clip("whole", "testsrc2=%s:r=30:d=2" % SIZE,
                         extra=["-f", "matroska"])
        cut = os.path.join(self.tmp, "cut.mkv")
        with open(good, "rb") as src, open(cut, "wb") as dst:
            dst.write(src.read()[:3000])
        proc = run(CHECK_RENDER, cut, "--expect-seconds", "2")
        self.assertEqual(proc.returncode, 1, proc.stdout + proc.stderr)
        self.assertIn("R0 render exists: FAIL", proc.stdout)

    def test_missing_file_is_a_usage_error(self):
        proc = run(CHECK_RENDER, os.path.join(self.tmp, "nope.mp4"))
        self.assertEqual(proc.returncode, 2)
        self.assertIn("no such file", proc.stderr)
        self.assertEqual(proc.stdout, "")

    def test_help(self):
        proc = run(CHECK_RENDER, "--help")
        self.assertEqual(proc.returncode, 0)
        for option in ("--expect-seconds", "--expect-audio", "--end-hold-max", "--json", "--strict"):
            self.assertIn(option, proc.stdout)


class MotionMathTest(unittest.TestCase):
    def test_spring_from_response(self):
        n = math_json("spring", "--response", "0.45", "--zeta", "0.65")
        self.assertAlmostEqual(n["stiffness"], 195.0, delta=0.05)
        self.assertAlmostEqual(n["damping"], 18.15, delta=0.005)
        self.assertAlmostEqual(n["overshoot_percent"], 6.81, delta=0.005)
        self.assertEqual(n["regime"], "underdamped")

    def test_spring_overshoot_zeta_06(self):
        n = math_json("spring", "--response", "0.5", "--zeta", "0.6")
        self.assertAlmostEqual(n["overshoot_percent"], 9.48, delta=0.005)
        # First peak of an underdamped step is half a damped period: pi / (omega * sqrt(1 - z^2)).
        self.assertAlmostEqual(n["first_peak_seconds"], 0.5 / 2 / 0.8, places=6)

    def test_spring_round_trip(self):
        a = math_json("spring", "--response", "0.45", "--zeta", "0.65", "--mass", "2")
        b = math_json("spring", "--stiffness", str(a["stiffness"]),
                      "--damping", str(a["damping"]), "--mass", "2")
        self.assertAlmostEqual(b["response"], 0.45, places=9)
        self.assertAlmostEqual(b["zeta"], 0.65, places=9)
        self.assertAlmostEqual(b["settle_seconds"], a["settle_seconds"], places=6)

    def test_spring_settle_is_the_last_crossing_of_half_a_percent(self):
        import math
        n = math_json("spring", "--response", "0.45", "--zeta", "0.65")
        omega, zeta = 2 * math.pi / 0.45, 0.65
        damped = omega * math.sqrt(1 - zeta ** 2)

        def offset(t):
            return abs(math.exp(-zeta * omega * t)
                       * (math.cos(damped * t) + zeta * omega / damped * math.sin(damped * t)))
        settle = n["settle_seconds"]
        self.assertAlmostEqual(offset(settle), 0.005, places=6)
        self.assertGreater(offset(settle - 1e-4), 0.005)
        for k in range(1, 4000):
            self.assertLessEqual(offset(settle + k * 0.001), 0.005 + 1e-12)

    def test_spring_critical_and_overdamped(self):
        import math
        n = math_json("spring", "--response", "0.5", "--zeta", "1")
        self.assertEqual(n["regime"], "critically damped")
        self.assertEqual(n["overshoot_percent"], 0.0)
        self.assertIsNone(n["first_peak_seconds"])
        omega, t = 2 * math.pi / 0.5, n["settle_seconds"]
        self.assertAlmostEqual((1 + omega * t) * math.exp(-omega * t), 0.005, places=6)

        over = math_json("spring", "--response", "0.5", "--zeta", "1.5")
        self.assertEqual(over["regime"], "overdamped")
        self.assertGreater(over["settle_seconds"], n["settle_seconds"])
        self.assertEqual(over["note"], "Remotion treats ζ ≥ 1 as critically damped")
        text = run(MOTION_MATH, "spring", "--response", "0.5", "--zeta", "1.5").stdout
        self.assertIn("Remotion treats ζ ≥ 1 as critically damped", text)
        self.assertNotIn("Remotion", run(MOTION_MATH, "spring", "--response", "0.5",
                                         "--zeta", "1").stdout)

    def test_spring_initial_velocity(self):
        rest = math_json("spring", "--response", "0.5", "--zeta", "1")
        pushed = math_json("spring", "--response", "0.5", "--zeta", "1", "--v0", "40")
        self.assertEqual(rest["overshoot_percent"], 0.0)
        self.assertGreater(pushed["overshoot_percent"], 1.0)
        self.assertIsNotNone(pushed["first_peak_seconds"])

    def test_spring_settle_frames(self):
        n = math_json("spring", "--response", "0.45", "--zeta", "0.65", "--fps", "30")
        self.assertEqual(n["settle_frames"], 15)
        self.assertLessEqual(n["settle_seconds"] * 30, 15)
        self.assertGreater(n["settle_seconds"] * 30, 14)

    def test_spring_rejects_mixed_or_missing_inputs(self):
        for args in (["--zeta", "0.5"], ["--response", "0.4", "--damping", "3"], [],
                     ["--response", "0", "--zeta", "0.5"]):
            proc = run(MOTION_MATH, "spring", *args)
            self.assertEqual(proc.returncode, 2, args)

    def test_bezier_speed_ratios(self):
        self.assertAlmostEqual(
            math_json("bezier", "0.333", "0", "0.667", "1")["peak_speed_over_average"],
            1.50, delta=0.005)
        self.assertAlmostEqual(
            math_json("bezier", "0.8", "0", "0.2", "1")["peak_speed_over_average"],
            5.0, delta=0.005)

    def test_bezier_overshoot(self):
        n = math_json("bezier", "0.34", "1.56", "0.64", "1")
        self.assertGreaterEqual(n["overshoot_percent"], 9.7)
        self.assertLessEqual(n["overshoot_percent"], 10.0)
        self.assertEqual(n["undershoot_percent"], 0.0)

    def test_bezier_linear_and_symmetry(self):
        n = math_json("bezier", "0.25", "0.25", "0.75", "0.75")
        self.assertAlmostEqual(n["peak_speed_over_average"], 1.0, places=6)
        self.assertAlmostEqual(n["travel_at_time"]["25%"], 0.25, places=6)
        n = math_json("bezier", "0.8", "0", "0.2", "1")
        self.assertAlmostEqual(n["travel_at_time"]["50%"], 0.5, places=6)
        self.assertAlmostEqual(n["peak_speed_at_time_fraction"], 0.5, places=3)

    def test_bezier_influence(self):
        n = math_json("bezier", "--influence", "33.3", "66.7")
        for got, want in zip(n["cubic_bezier"], [0.333, 0.0, 0.333, 1.0]):
            self.assertAlmostEqual(got, want, places=9)
        text = run(MOTION_MATH, "bezier", "--influence", "80", "80").stdout
        self.assertIn("(0.8, 0, 0.2, 1)", text)
        self.assertIn("exact only for 1D temporal properties", text)

    def test_bezier_rejects_bad_input(self):
        for args in (["0.1", "0.2"], ["1.2", "0", "0.5", "1"], [],
                     ["0.1", "0", "0.2", "1", "--influence", "30", "30"]):
            self.assertEqual(run(MOTION_MATH, "bezier", *args).returncode, 2, args)

    def test_beats(self):
        n = math_json("beats", "--bpm", "128", "--fps", "30", "--count", "32")
        self.assertEqual(n["beats"][32]["frame"], 450)
        self.assertEqual(n["beats"][32]["naive_frame"], 448)
        self.assertEqual(n["naive_drift_frames"], -2)
        self.assertEqual(n["beats"][0]["frame"], 0)
        self.assertEqual(len(n["beats"]), 33)

    def test_posterize(self):
        def steps(fps):
            return [s["fps"] for s in math_json("posterize", "--fps", fps)["exact_steps"]]
        self.assertEqual(steps("30")[:4], [15, 10, 6, 5])
        self.assertEqual(steps("60")[:4], [30, 20, 15, 12])
        self.assertEqual(steps("24")[:3], [12, 8, 6])
        self.assertNotIn(12, steps("30"))

        no = math_json("posterize", "--fps", "30", "--target", "12")["target"]
        self.assertFalse(no["exact"])
        self.assertEqual(no["hold_cadence"], [2, 3])
        self.assertIn("target 12 fps in 30 fps: no",
                      run(MOTION_MATH, "posterize", "--fps", "30", "--target", "12").stdout)
        yes = math_json("posterize", "--fps", "24", "--target", "8")["target"]
        self.assertTrue(yes["exact"])
        self.assertEqual(yes["hold_cadence"], [3])

    def test_fov(self):
        n = math_json("fov", "--focal", "24", "--width", "1920")
        self.assertAlmostEqual(n["zoom_px"], 1280.0, places=6)
        self.assertAlmostEqual(n["horizontal_fov_degrees"], 73.7, delta=0.05)
        n = math_json("fov", "--focal", "50", "--width", "1920", "--sensor", "25")
        self.assertAlmostEqual(n["zoom_px"], 3840.0, places=6)

    def test_frames(self):
        n = math_json("frames", "--ms", "200", "500", "--fps", "30")
        self.assertEqual([c["frames"] for c in n["conversions"]], [6, 15])
        n = math_json("frames", "--ms", "150", "--fps", "24")
        self.assertEqual(n["conversions"][0]["frames"], 4)
        self.assertAlmostEqual(n["conversions"][0]["exact_frames"], 3.6)
        self.assertAlmostEqual(n["conversions"][0]["actual_ms"], 166.6667, places=3)
        n = math_json("frames", "--frames", "12", "--fps", "60")
        self.assertAlmostEqual(n["conversions"][0]["ms"], 200.0)
        self.assertEqual(run(MOTION_MATH, "frames", "--fps", "30").returncode, 2)

    def test_help_for_every_subcommand(self):
        self.assertEqual(run(MOTION_MATH, "--help").returncode, 0)
        for name in ("spring", "bezier", "beats", "posterize", "fov", "frames"):
            proc = run(MOTION_MATH, name, "--help")
            self.assertEqual(proc.returncode, 0, name)
            self.assertIn("--json", proc.stdout)


if __name__ == "__main__":
    unittest.main()
