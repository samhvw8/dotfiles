---
name: video-typography
description: "Typography design decisions for HyperFrames videos — roles, hierarchy intent, pairing logic. Implementation values (px, letter-spacing em, CJK fallback chains, OpenType CSS) live in build agent territory."
category: visual-design
---

# Video Typography - Design-Judgment Layer

Video typography is different from web typography. There is no scrolling and no responsive reflow. Every text element must be readable at a glance inside a 1-5 second visibility window, and it must do emotional work. In good launch videos, text is rarely decoration; it is the emotional anchor of the scene.

**This file only covers plan-layer design judgment** - roles, hierarchy intent, pairing logic, and negative constraints. Specific values (font-size px, letter-spacing em, CJK fallback, `tabular-nums`, etc.) are build-agent territory when writing HTML/CSS and consulting `/hyperframes-core` plus `chunks/tokens.css`; plan does not copy them.

## Font Source

**Font families come from `chunks/tokens.css`** (`--font-display` / `--font-body` / `--font-mono` role tokens, already inlined into the Phase 3 dispatch `## Design chunks`). In the plan, name fonts by **use**: "display for hero headline", "body for supporting copy", "mono for eyebrow / metadata." **Do not** invent font names, and **do not** copy concrete font names into the plan - the build agent reads them from `chunks/tokens.css` (not design.html).

If a scene uses a **second font** for contrast (serif italic emphasis, mono labels), the plan must name that as a design decision. Homogeneous font pairing (two geometric sans faces) is not allowed - visual tension without hierarchy benefit.

## Type Scale (by role, not px)

Video type sizes are much larger than web type. Plan references by **role**; the build agent chooses concrete px from these ranges (calibrated from the archive and refined on the build side):

| Role               | Use                                   | Relative feel                               |
| ------------------ | ------------------------------------- | ------------------------------------------- |
| **Mega / climax**  | single-word hero, counter peak        | 50%+ of canvas height                       |
| **Hero / display** | main headline, scene core word        | 25-40% of canvas height                     |
| **Display**        | secondary title, section marker       | 10-20% of canvas height                     |
| **Heading**        | paragraph title                       | 5-10% of canvas height                      |
| **Body**           | supporting copy, captions             | minimum readable video scale                |
| **Eyebrow / UI**   | metadata, chapter mark, command panel | ~50-70% of body, often uppercase + tracking |
| **Data / counter** | standalone numeric statement          | huge range, from body to mega               |

Plan phrasing: "hero word uses display tier, eyebrow uses mono uppercase"; **do not** write "hero 220px" - concrete px is build work.

**Avoid adjacent role sizes too close together:** small jumps like 48 / 52 / 56 do not read as hierarchy. Archive examples lean toward 2-3x jumps (display 220 -> heading 92 -> eyebrow 30 is 7.3x). Hierarchy must be legible in <1 second.

## Build Hierarchy Across Multiple Dimensions

Size alone is not enough. Each scene should stack at least 2-3 dimensions:

| Dimension     | Strong contrast                         | Decision point                                                |
| ------------- | --------------------------------------- | ------------------------------------------------------------- |
| **Size**      | 3:1 or larger                           | hero word must be far larger than surroundings                |
| **Weight**    | 800-900 vs 300-400                      | extreme weights inside one family are cleaner than two fonts  |
| **Color**     | high contrast against background        | see `color-system.md`                                         |
| **Spacing**   | tight display + wide eyebrow            | tight display = confidence; uppercase wide eyebrow = metadata |
| **Case**      | eyebrow UPPERCASE + body Sentence       | all one case = monotone                                       |
| **Style mix** | italic serif embedded inside heavy sans | word-level emphasis (archive signature)                       |

Plan writes "hero uses display tier with tight tracking; eyebrow uses mono uppercase wide tracking"; **do not** write `-0.045em` / `0.08em` - concrete em values are build work.

## Font Pairing Principles

- **One font family + multiple weights** is usually enough - cleaner than two competing fonts.
- **Add a second font only for real contrast:** serif display + sans body, sans hero + mono label.
- **Three-voice system** (strongest archive pattern): display + body + mono, each with clear semantic work (mono marks metadata -> "real tool feel", not "marketing video feel").
- **Switching font universes scene by scene is valid** (playground-launch used 5 pairings across 8 beats) - when the emotional arc says "switch universe", do not force uniformity.

## Forbidden Patterns

- **Inter / Roboto / Open Sans / Lato / Montserrat regular weight as display** - an AI-output tell. If you use Inter, use 900 with tight tracking; otherwise do not use it as display.
- **Similar-but-not-identical font pairing** - two geometric sans faces, two humanist serifs -> visual noise without hierarchy.
- **Wide letter-spacing on long body sentences** - hurts readability.
- **Tight tracking on mono code** - loses rhythm.
- **Display at 0 letter-spacing (default)** - a 200px title feels soft and corporate.

## CJK Note

If narrator script contains Chinese, the plan must explicitly say: "this scene contains CJK text." The build agent handles fallback chains (render environment configuration, not plan layer). In mixed CJK + Latin, CJK has denser visual weight, so display-tier CJK is usually one tier smaller than Latin.

## Plan Reference Example

> "Hero word uses display tier + tight tracking, eyebrow uses mono uppercase wide tracking labeled 'BEAT 02', body uses supporting copy. Hero and eyebrow create four-dimensional contrast: size + weight + case + style."

Do not write concrete px / em / font names.
