# Platform specs

Numbers set by a standard or a platform, not by research. They change, so every row has its source and check date. Re-check any row older than 6 months before you rely on it, and update the date. All rows are grade `S` except where a row says otherwise.

Checked 2026-11-10 unless the row says otherwise.

## Accessibility: WCAG 2.2 (W3C Recommendation)

Source: https://www.w3.org/TR/WCAG22/ (fetched 2026-11-10).

| SC | Level | Requirement | Gate |
|---|---|---|---|
| 1.2.1 Audio-only (Prerecorded) | A | A text alternative (transcript) for prerecorded audio-only content, such as a podcast episode page | G13 |
| 1.2.2 Captions (Prerecorded) | A | Captions for all prerecorded audio in synchronized media (video) | G13 |
| 1.4.1 Use of Color | A | Color is never the only way to convey information, state or an action (pair it with text, an icon or a pattern) | G1, G2 |
| 1.4.3 Contrast (Minimum) | AA | Text `>= 4.5:1`; large-scale text `>= 3:1` | G2 |
| 1.4.6 Contrast (Enhanced) | AAA | Text `>= 7:1`; large-scale text `>= 4.5:1`. The skill's ink-on-accent `>= 7:1` uses this level | G2 |
| 1.4.10 Reflow | AA | No two-direction scrolling at 320 CSS px width (vertical content). Fixed-width bars and HUDs must not hide text | G4 |
| 1.4.11 Non-text Contrast | AA | Visual information needed to identify UI components and states, and graphics needed to understand content, `>= 3:1` against adjacent colors. A button identified by its text label needs no boundary under this criterion; a pale fill on a pale page is still a weak button (H) | G2 |
| 2.2.2 Pause, Stop, Hide | A | Moving, blinking or scrolling content that starts automatically, lasts over 5 s and runs beside other content has a pause, stop or hide control | G3 |
| 2.3.1 Three Flashes or Below Threshold | A | Nothing flashes more than 3 times in any 1 s, unless below the general and red flash thresholds. Applies to video montages and "beat flashes" too | G3 |
| 2.3.3 Animation from Interactions | AAA | Motion triggered by interaction can be turned off. In CSS, honor `prefers-reduced-motion` | G3 |
| 2.4.11 Focus Not Obscured (Minimum) | AA | A focused component is never fully hidden by author content (sticky headers, cookie bars, chat widgets) | G4 |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets `>= 24 × 24` CSS px, or spaced so a 24 px circle on each does not overlap another. Platform guidance is larger (Apple 44 pt, Material 48 dp); use those for primary mobile actions | G4 |

## Web performance: Core Web Vitals

Source: https://web.dev/articles/vitals (fetched 2026-11-10).

| Metric | Good | Note |
|---|---|---|
| LCP (Largest Contentful Paint) | `<= 2.5 s` | Measure at the 75th percentile of page loads, mobile and desktop apart |
| INP (Interaction to Next Paint) | `<= 200 ms` | Same |
| CLS (Cumulative Layout Shift) | `<= 0.1` | Same. Never change box geometry during scroll |

A slow LCP on mobile is a common cause of a high bounce rate that copy changes cannot fix. Check it before rewriting a hero.

## Vertical video (9:16, 1080 × 1920)

| Platform | Keep text, faces and logos out of | Source and status |
|---|---|---|
| Meta Reels and Stories (ads) | The edges (top, bottom, sides). With disclaimers on Reels ads, keep the bottom 40% clear. Exact margins are shown only as an overlay in Ads Manager | https://www.facebook.com/business/help/980593475366490 (fetched 2026-11-10). No pixel values published in text |
| YouTube Shorts | Top about 288 px (15%), bottom about 672 px (35%), left about 48 px, right about 192 px | Commonly cited reading of Google's vertical-ad reference image (for example https://clipzi.app/en/blog/shorts-tiktok-reels-safe-zones). **Not verified** against an official text source |
| TikTok in-feed | Top about 130–240 px, bottom about 480–660 px, right about 140–300 px (like/comment/share rail) | Third-party readings of TikTok's downloadable safe-zone files disagree (for example https://makelocalads.com/safe-zone-checker, https://www.ezugc.ai/blog/tiktok-safe-zones-guide). Official files: TikTok Ads Manager help, "auction in-feed ads". **Not verified** |

**Cross-platform default (H):** keep hook text, faces and the key object in the middle of the frame, clear of the top strip, the bottom third and the right-hand button rail. Put burned-in captions just below the center, not at the bottom of the frame. For exact margins, tell the user to check the platform's own safe-zone overlay in its ads manager or editor; do not give the unverified pixel values above as a spec.

| Item | Value | Source |
|---|---|---|
| YouTube Shorts maximum length | 3 minutes | https://support.google.com/youtube/answer/15424877 (fetched 2026-11-10) |

## Captions and subtitles

Source: Netflix English (USA) Timed Text Style Guide, https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide (fetched 2026-11-10). Other languages have their own Netflix guide; check the one for the target language (Vietnamese included) before using these numbers.

| Item | Value |
|---|---|
| Characters per line | `<= 42` |
| Lines | `<= 2`; keep to one line when it fits; break after punctuation or before a conjunction or preposition |
| Reading speed | Adults `<= 20` characters per second; children `<= 17` |

Burned-in social captions follow a looser house style (often 1–4 words at a time). Closed captions for accessibility follow the table above.

## Audio loudness

| Platform | Target | Source |
|---|---|---|
| Apple Podcasts | `-16 LKFS ± 1 dB`, true peak `<= -1 dBFS`, measured per ITU-R BS.1770 | https://podcasters.apple.com/support/893-audio-requirements (fetched 2026-11-10) |
| Spotify | Normalizes playback to `-14 LUFS` integrated (Quiet -19, Loud -11 for Premium). Master at `-14 LUFS`, true peak `<= -1 dBTP`; if louder than -14, keep true peak `<= -2 dBTP` | https://support.spotify.com/us/artists/article/loudness-normalization/ (fetched 2026-11-10; written for music, applies to all tracks) |
| YouTube | About `-14 LUFS` playback normalization | **Not verified**: not documented by YouTube in text |

**Default for a podcast master:** `-16 LUFS ± 1`, true peak `<= -1 dBTP`. Keep room tone under pauses; digital silence sounds like a dropout.

## YouTube chapters

Source: https://support.google.com/youtube/answer/9884579 (fetched 2026-11-10).

- The first timestamp is `00:00`.
- At least 3 timestamps, in ascending order.
- Each chapter is at least 10 s long.

No rule caps the number of chapters.

## Audio-video sync

| Standard | Limit (sound early / sound late, relative to picture) | Source |
|---|---|---|
| ITU-R BT.1359-1 detectability threshold | `+45 ms` / `-125 ms` | https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.1359-1-199811-I!!PDF-E.pdf (fetched 2026-11-10) |
| ITU-R BT.1359-1 acceptability threshold | `+90 ms` / `-185 ms` | Same |
| EBU R37 end-to-end | `+40 ms` / `-60 ms` | https://tech.ebu.ch/docs/r/r037.pdf. Fetched text gives the per-stage limit (5 ms early, 15 ms late); the end-to-end values come from secondary sources. **Partly verified** |

Default: stay inside the ITU detectability threshold (audio early `<= 45 ms`, late `<= 125 ms`); beyond the acceptability threshold it is a defect. A J-cut, where the next scene's sound starts before the picture cut, is an editing choice and is not limited by these numbers.
