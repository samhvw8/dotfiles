# Delivery: flash safety, safe areas, export, loudness, licences

Labels: **[M]** math, **[S]** named source, **[H]** practitioner heuristic. The standards below are quoted from memory of the published text and were not re-fetched when this file was written; check the standard itself before a broadcast or legal delivery.

## 1. Flash safety (photosensitive epilepsy)

Fast, large changes in brightness can trigger seizures. This is a harm limit, not a style choice.

- **[S] WCAG 2.3.1 (Three Flashes or Below Threshold):** content does not flash more than three times in any one-second period, unless the flash is below the general-flash and red-flash thresholds.
  - A *general flash* is a pair of opposing changes in relative luminance of 10% or more of the maximum, where the darker state is below 0.80.
  - A *red flash* is any pair of opposing transitions that involve a saturated red.
  - The thresholds apply when the flashing area is larger than about 25% of a 10-degree field of view. A full-frame flash always counts.
- **[S] Broadcast:** Ofcom and ITU-R BT.1702 use similar limits and test with a Harding analyser. A broadcaster can reject a file on this test.
- `scripts/check_render.py` gate R3 screens for this. It is a screen, not a certificate.

In practice:

- A single 1–2 frame flash cut is one flash. Use at most one per second, and prefer a short luminance bloom on part of the frame over a full-frame white.
- Strobing on a beat grid faster than 3 Hz (above 180 BPM on every beat, or 90 BPM on every half beat) over a large area is over the limit. Flash a small element, or change hue and scale without a large luminance swing.
- Avoid large saturated-red flashes entirely.
- High-contrast moving stripes and tight checker patterns can also provoke; do not fill the frame with them.

For web and app UI, honour `prefers-reduced-motion`: keep opacity and colour changes, remove large travel, parallax and zoom.

## 2. Safe areas

- **[S] SMPTE ST 2046-1 (16:9):** title-safe area is the central 90% of width and height; action-safe is the central 93%. On 1920×1080 that is a 96 px side margin and a 54 px top and bottom margin for text.
- **[H] Captions:** when subtitles are burned in or expected, keep callouts out of the bottom 15% of the frame.
- **[H] Vertical social video (9:16):** the platform draws its own buttons and captions over the right edge and the bottom. The zones change with app versions, so check the platform's current safe-zone template. Without one, keep text out of the top 10%, the bottom 20% and the right 15%.
- **[S] Vertical type sizes (Remotion `remotion-create/video-layout.md`):** for 1080-wide video, keep text 80 px from the sides and 100 px from top and bottom, headline at least 84 px, supporting text at least 44 px. These values are for 1080×1920, not for 1920×1080.

## 3. Export and colour

Browser frames are sRGB, full range. Video players expect BT.709, limited range. A file with no colour tags or the wrong range plays washed out or too dark.

```bash
# [H] Default H.264 delivery from an image sequence or a lossless intermediate
ffmpeg -framerate 30 -i frames/%05d.png -i mix.wav \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:v libx264 -crf 16 -preset slow -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 out.mp4
```

- **Check the result on a real player**, not only in the browser: compare one flat brand-colour frame against the source hex.
- **[H] 4:2:0 chroma subsampling** halves colour resolution. Thin saturated strokes and small coloured text on a coloured ground smear. Keep such strokes at least 2 px at delivery size, or carry the detail in luminance (light on dark), not in hue.
- **[H] Banding** shows on slow dark gradients at 8 bits. Add a little film grain or dither over the gradient, or deliver 10-bit where the platform accepts it.
- **[H] Thin moving detail** (1 px hairlines, fine grids) shimmers. Thicken it, add motion blur, or render at 2× and scale down.
- **[H] Platform re-encode:** social platforms compress again. Deliver at a high bitrate (CRF 14–18) so the second encode has clean input.
- Keep one frame rate through the whole pipeline. Mixing 30 and 29.97 drifts by 1.8 frames per minute **[M]**.

## 4. Loudness

- **[S] Streaming and social:** platforms normalise to about -14 LUFS integrated; keep true peak at or below -1 dBTP.
- **[S] Broadcast:** EBU R128 targets -23 LUFS; ATSC A/85 targets -24 LKFS.
- **[H] Mix balance:** voice is the loudest element. Music under voice sits about 15–20 dB lower; sound effects sit between them. Duck the music when the voice starts instead of keeping it low for the whole film.
- Measure with `ffmpeg -i out.mp4 -af loudnorm=print_format=summary -f null -`.

## 5. Licences

- **[S] GSAP** and its plugins (SplitText, MorphSVG, Flip and others) are free of charge under the GSAP Standard License. It is not an open-source licence, and it forbids use in a no-code visual animation builder that competes with Webflow. Check it before you ship GSAP inside a tool, as opposed to inside a video or a site.
- Fonts, music and sound effects need a licence that covers video and the delivery platform. Name the source of each in the delivery note.
