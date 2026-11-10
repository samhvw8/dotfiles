# Posters, thumbnails, comics, slides and color

Load for a poster, thumbnail, cover or key visual, a comic or storyboard, a slide deck or infographic, or a color choice inside one of these. Grades (`S`, `A`, `B`, `H`), the defaults and the gates are in [../SKILL.md](../SKILL.md). This file cites those defaults and does not restate them. Chart construction, chart colors and data color scales belong to the `dataviz` skill. Visual styling and component code belong to `impeccable`.

## Contents
- Thumbnails and covers
- Posters and key visuals
- Comics and storyboards
- Slides and infographics
- East Asian layouts, Kishōtentetsu and Danmaku
- Color
- Computed contrast values

## Thumbnails and covers

A thumbnail competes in a feed at small size, and the viewer judges it in a glance.

| Rule | Grade | Why and how |
|---|---|---|
| One subject plus at most 2 supporting elements (usually a short text badge and one object) | H | Few objects read at a glance. Count elements, not decorations. Figure-ground contrast is a requirement, not an element |
| A face with a clear expression, or one unusual object, as the subject | H | Faces and anomalies are strong attractors in practice. No controlled thumbnail study sets a size or count |
| The subject's eyes, hand or an arrow point at the text or the key object | A for gaze cueing (Friesen & Kingstone 1998); H for its use in thumbnails | People follow another person's gaze automatically. A subject looking off-frame sends the viewer off-frame |
| Text: about 4 words at most, large, ink on a solid fill or stroke | H | Check it at real feed size: shrink the image to about 160 px wide or view it on a phone |
| The thumbnail and the title complement each other. The image shows the result, object or anomaly; the title gives the context or stakes. Never repeat the title on the image | H (an analogy to Mayer's redundancy principle, which concerns narration and on-screen text) | Repetition wastes the second channel |
| Keep text and faces out of platform overlay areas (for example the YouTube duration badge at bottom right) | S/H | See [platform-specs.md](platform-specs.md) |
| The promise in the image is paid off in the content | H | A mismatch raises early exits and costs trust (G5) |

## Posters and key visuals

- **One entry point (H).** The largest face, object or headline is where the eye lands first. Size the hierarchy so there is no second competitor; a headline set at least 3× the body size is a common working ratio.
- **Lead the eye to the action (H).** A gaze, a hand or a leading line ends at the call to action or the key fact. Do not scatter badges along the border.
- **Readable at viewing distance (H).** Test the headline at the real distance or size (a poster from 3 m, a social image on a phone).
- **Contrast floor (S).** Apply G2 to all text, including small print over photos. Put text over a calm area or a solid panel.

## Comics and storyboards

| Rule | Grade | Why and how |
|---|---|---|
| Build each scene from roles: Establisher → Initial → Prolongation → Peak → Release (Cohn's visual narrative grammar) | H (Cohn 2013 is a theory paper, not an experiment on engagement) | Label each panel with its role. Remove filler panels that only paraphrase before the Peak. Deleting everything but the Peak should still summarize the scene |
| Signal a scene break when several of time, place, character, cause or goal change at once | B (Zwaan 1995; Zacks 2007 event segmentation) | Readers build a new situation model at these boundaries. Use a wide panel, a caption or a gutter change |
| Narrow, tight panels speed up felt time; wide or full-bleed panels slow it down | H (McCloud 1993; inference from Cohn) | Put the Peak in the widest panel. On a vertical webtoon, add space before and after it |
| Short balloons, about 2–3 lines; about 4–6 panels per page, 1–2 per phone screen in a webtoon | H | Long balloons hide the art and break reading rhythm |
| Characters and motion face into the page or toward the next panel | B (Palmer et al. 2013, inward bias in aesthetic preference) | Outward-facing subjects pull the eye off the page |
| Rounded shapes for calm and safe beats; sharp angles for conflict or alerts | H (Bar & Neta 2006: people liked curved everyday objects more, n = 14; it says nothing about panels or UI) | A style choice, not a law |

For pacing, payoff position and pattern changes across a storyboard, use G10–G12 and the defaults in SKILL.md.

## Slides and infographics

| Rule | Grade | Why and how |
|---|---|---|
| The headline is a full-sentence assertion of the takeaway, not a topic label ("Caching cut p99 latency by 42%", not "Benchmark results") | B (Alley; Garner & Alley 2013) | At most 2 lines (G9) |
| The body is visual evidence (one chart, diagram, photo or comparison), not a bullet wall | B | Supports the headline claim |
| Do not show paragraphs that the speaker reads aloud | A (Mayer: redundancy) | Reading and listening to the same words splits attention. Keep slide text to labels and the headline |
| Label data directly on the marks; remove detached legends | A (Mayer: spatial contiguity) | Eye travel between legend and chart costs attention |
| One idea per slide | H | Split a slide that needs two headlines |
| Position-based charts for comparison | A | See G9. Build charts with the `dataviz` skill |
| An infographic's title states the conclusion, and the key number is large | B (Bylinskii et al. 2017: titles and large text draw fixations in infographics; Borkin et al. 2016: titles aid recall) | "Q4 margin rose after we cut 3 products", not "Sales by region" |
| Alternate "what is" (the problem) and "what could be" (the result) in a persuasive deck | H (Duarte's sparkline) | Gives the deck a rhythm of tension and release |
| The last slide states the decision or the next step and stays up during Q&A, not "Thank you / Questions?" | H | The end is what people remember (peak-end) |

## East Asian layouts, Kishōtentetsu and Danmaku

**Replication caveat first.** Chua, Boland & Nisbett 2005 reported that East Asian viewers look at backgrounds more than Western viewers. Later eye-tracking studies (Rayner et al. 2007; Evans et al. 2009) did not replicate a stable cultural scanpath difference. Do not design a different reading path per culture.

- **CJK badges (B).** The Chinese reading span is about 1 character left and 3–4 right of fixation (Inhoff & Liu 1998). A 2–4 character badge (`限時免運`, `效能翻倍`) reads in about one fixation.
- **Dense grids (H).** East Asian portals and slides use dense layouts with thin borders or cells, few items per cell, and weight or color to mark one focal item per cell. This is a practitioner convention, with no controlled test. The default focal-target rule (G1) still applies per cell.
- **Portal headline length (H).** Japanese portals keep headlines at about 13–15 characters.
- **Kishōtentetsu for skippable media (H).** The classic form puts its twist (転) late, after a long development (承), which loses viewers who can skip. Two adaptations:
  1. *Payoff first:* show the surprising result (結) in the first seconds, go back to the setup (起) and the development (承), then give the twist (転) at about two thirds of the runtime.
  2. *Early twist, double loop:* a small twist in the first 10–15 s, evidence, then a deeper twist mid-piece, then the resolution.
- **Danmaku (Bilibili-style comments) (B).** In one eye-tracking study, viewers spent about 15% of fixation time on the comment band in the top quarter of the frame (BMC Psychiatry 2023, PMC10360313). Keep faces, key objects and key text out of the top quarter of a 16:9 frame on Danmaku platforms. Keep burned-in captions in the lower band with a dark stroke. For 9:16 video, follow the platform safe zones in [platform-specs.md](platform-specs.md).

## Color

The accent rule, the contrast floor and the worked contrast values for yellow are in SKILL.md (defaults, G1, G2). Color meaning is learned and depends on the audience. It does not change how accurate or creative people are (Tier 3).

| Rule | Grade | Why and how |
|---|---|---|
| Salience is relative to the surroundings. On a neutral or low-saturation ground, any one saturated hue stands out; the accent does not have to be yellow | H; B that saturated, bright colors are rated more attention-getting (Camgöz et al. 2004, self-report) | Choose the accent hue far from the structural color, then check its contrast |
| Never pair yellow with white, either as text or as a fill with white text | S | See the worked values. On a light background, use yellow only as a fill with dark ink |
| Bright orange (`#FF5500`) carries dark ink or large text only | S | White on it and it on white are 3.21:1: large text only. Dark ink `#0B0E14` on it is 6.03:1 |
| No pure blue (`#0000FF`) text or thin lines on a dark background | S | 2.08:1 on `#0F172A`. Use a light blue such as `#38BDF8` (8.33:1) |
| Do not put saturated pure red next to pure blue | B | The edge appears to vibrate (chromostereopsis). It is also low contrast (2.15:1) |
| Never carry meaning by color alone | S: WCAG 1.4.1 | About 8% of men of Northern European descent and about 4–5% of East Asian men have red-green color vision deficiency (A). Add an icon, a shape, a sign (`+`/`−`) or a label. Check the design in a deuteranopia simulator |
| Follow the market's color convention for gain and loss | H | Red = up in China, Taiwan and Korea. Japanese apps vary. Vietnamese stock boards use green for a rise, red for a fall, purple for the ceiling price, light blue for the floor price and yellow for the reference price. Western apps use green = up. Copy the local apps your users already know |
| Light backgrounds for dense reading; dark for video, media and dim rooms | A for the direction (positive polarity helps reading, Buchner & Baumgartner 2007); H for the dark-mode choice | On dark, use off-white text, not pure white on pure black, for long text |
| Lightness and saturation carry mood as much as hue. Light, saturated colors read positive and energetic; dark, desaturated colors read somber | B (Braun et al. 2025; Wilms & Oberfeld 2018: saturation drives rated arousal) | To calm a scene or screen, lower saturation first, not only the hue |
| Brand associations: blue reads competent, red exciting, purple sophisticated | B (Labrecque & Milne 2012, first exposure only) | An association, not a mechanism. The audience's own references override it |
| Carrier and impulse. Keep backgrounds and containers in one hue family. Step their lightness and saturation to follow the mood. Spend the one contrasting accent only at the peak and on the primary CTA | H, built on Schloss & Palmer 2011 (similar hues are rated harmonious, complementary pairs less so) and peak-end | A color script over time (video, comic, scrollytelling) follows the same arc: calm carrier, one impulse at the payoff |

## Computed contrast values

WCAG 2.x relative-luminance formula. Use these when you suggest an ink; compute any other pair.

| Pair | Ratio | Use |
|---|---|---|
| `#FFD600` on black | 14.87:1 | Badge text or fill |
| `#FFFFFF` on `#0B0E14` | 19.32:1 | Text |
| `#38BDF8` on `#0F172A` | 8.33:1 | Accent text on dark |
| `#10B981` on `#0F172A` | 7.04:1 | Positive state on dark |
| `#F97316` on `#0F172A` | 6.37:1 | Accent on dark |
| `#FF4D4D` on `#0F172A` | 5.46:1 | Alert text on dark |
| `#B91C1C` on white | 6.47:1 | Alert text on light |
| `#047857` on white | 5.48:1 | Positive text on light |
| `#2563EB` on white | 5.17:1 | Link or accent on light |
| `#C2410C` on white | 5.18:1 | Orange text on light |
| `#64748B` on white | 4.76:1 | Lightest grey that passes for small text |
| `#94A3B8` on white | 2.56:1 | Fails: do not use for metadata text |
