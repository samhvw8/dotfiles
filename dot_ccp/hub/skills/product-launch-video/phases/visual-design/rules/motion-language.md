---
name: video-motion-language
description: "Motion design decisions for HyperFrames videos — spring intents, beat structure, hold times, stillness-before-climax, transition vocabulary. GSAP eases, exact ms/frames, ease curves, and JS code live in build agent territory (/hyperframes-animation)."
category: visual-design
---

# Video Motion Language - Design-Judgment Layer

A good promo video feels like one continuous whole, not a pile of unrelated animated slides. That requires a consistent motion language: the same ease intent, the same rhythmic timing, and the same spring feel.

**This file only covers plan-layer design judgment** - spring intent, beat structure, holds, silent beats, and transition vocabulary. Concrete GSAP ease names (`back.out(1.4)`), ms/frame mapping, stagger formulas, exact cut-the-curve JS, and multiplicative breathing formulas are build-agent territory when writing timelines and consulting `/hyperframes-animation` plus `chunks/easings.js`; plan does not write code.

> **`EASE` / `DUR` JS constants come from `chunks/easings.js`** (already inlined into Phase 3 dispatch `## Design chunks`; do not read design.html). Plan references by **intent role** (`EASE.entry` / `EASE.emphasis` / `EASE.exit`, `DUR.fast` / `DUR.med` / `DUR.slow`, though actual keys may vary by preset - e.g. editorial uses `DUR.snap` instead of `DUR.fast`). Plan writes "use entry spring" or "reference `EASE.entry`"; build agent maps it to the concrete curve.

## Spring Intent (by role, not curve)

HyperFrames uses GSAP. The table below is the **intent** vocabulary for plans; the build agent uses `/hyperframes-animation` to translate intent into concrete GSAP ease + duration:

| Intent     | Feel                                        | Use case                                          |
| ---------- | ------------------------------------------- | ------------------------------------------------- |
| **entry**  | confident slight overshoot, settles quickly | primary element entry (default)                   |
| **gentle** | soft slide-in, no overshoot                 | background elements, subtle motion                |
| **snappy** | tight overshoot, nearly instant             | UI elements, small icons, buttons                 |
| **heavy**  | weighted deceleration                       | large images, prototype screenshots, hero visuals |
| **slam**   | bouncy overshoot, intentionally loud        | logo / bell / impact moments                      |

**Consistency rule:** similar elements share the same intent. In one scene, all icons are `snappy`, all hero images are `heavy`. **Do not** invent a unique ease + duration for every element.

## Forbidden

- **`bounce.out` / `elastic.out`** - feels dated and pulls attention away from content. Real objects decelerate smoothly; they do not bounce. Low overshoot for `entry` intent (archive typical back.out 1.4-1.7) is OK; higher overshoot is reserved for clearly playful moments.
- **Unique ease + duration per element** - visual noise.

## Duration Intent (100 / 300 / 500 / 800 concepts)

Plan references by **intent tier** ("instant feedback", "state change", "layout change", "entry animation"); the build agent maps concrete ms / frames at 30fps using `/hyperframes-animation`.

- **Instant feedback** - micro-interaction, state flash
- **State change** - element entry, icon swap
- **Layout change** - scene entry, major transition
- **Entry animation** - hero reveal, opening sequence

**A single entry should not exceed ~800ms.** If you need a longer buildup, use multi-element stagger instead of lengthening one element.

## Exit = 75% of Entry

Exit animation is about 75% of entry duration (not 50%, not 100%). Arrival is deliberate; departure is swift but not abrupt.

- Exit too fast -> flash
- Exit = entry -> sluggish, blocks the next scene

This is a rule the plan can name in prose; the build agent computes concrete frames.

> Cut-the-curve deliberately reverses the ratio (entry ~127% of exit length) - entry takes longer to clear blur. This is the signature transition exception; plan only needs to cite the transition name.

## Stagger Total Cap

When staggering N elements, **total stagger duration <= 500ms** (much longer feels dragged out). Concrete formula (`(N-1) × per-item delay`) and the strategy "stagger the first 6-8, enter the rest with the last item" are build work; plan only needs to know:

- **3-7 elements** - normal stagger, total 300-700ms
- **8+ elements** - tighten per-item delay, or stagger only the first few
- **Never let stagger continue past 500ms**

## Beat Structure (core plan tool)

Rhythmic videos have beats: tension -> release -> tension -> release. The cleanest archive reference is playground-launch's 46-second plan:

| Phase              | Duration | Rhythm               | Scene type                         |
| ------------------ | -------- | -------------------- | ---------------------------------- |
| **Slow setup**     | 6-10s    | slow build           | hero establish, VO not yet present |
| **Fast montage**   | 6-10s    | ~2s each             | cut-the-curve every 1.5-2s         |
| **Process reveal** | 12-18s   | continuous no cut    | screen recording, real workflow    |
| **Closure**        | 3-5s     | still and breathable | logo, URL, CTA                     |

**Allocate motion by energy inside each scene:**

- **High-energy scenes** (hook, CTA) - faster entry, tighter stagger, `snappy` spring
- **Breathable scenes** (brand reveal, emotional beat) - slower entry, `gentle` spring, longer hold
- **Data scenes** (statistic, feature) - medium rhythm, clean stagger, count-up

## Hold Time

After an element enters, it must hold long enough to be read. Plan references minimum hold by **content type** (build maps concrete frames):

| Content                              | Minimum hold intent |
| ------------------------------------ | ------------------- |
| display text (1-3 words)             | ~1s                 |
| short sentence                       | ~1.5s               |
| data / statistic                     | ~1.5s               |
| product screenshot                   | ~2s                 |
| complex visual (diagram, comparison) | ~2.5s               |
| hero / climax word                   | ~1-1.4s             |

Narration duration shorter than needed hold -> extend the scene to fill time.

## "Stillness Before Climax" Beat

Archive signature: leave a **0.3-0.75s pause** between the major action and confirmation/result. This silence creates narrative tension before the landing. **Allocate it to 2-3 scenes per film (named in `## Film Direction`), where the narration lands a payoff** - stamped on every scene it stops being a comma and becomes a tic, and the film's rhythm flattens.

- Icons collapse at 2.2s, but demo does not pop out until 2.95s (0.75s gap)
- Step 3 activates at 3.33s, button enters at 3.52s (0.19s buffer)
- "Hold on a final frustrated beat: cursor still, chat full, SFX slightly off-rhythm"

**Plan must explicitly schedule this beat in the allocated scenes** - name `stillness-before-climax` in that scene's choreography prose. An allocated scene that jumps directly from action to result loses the dramatic comma; a non-allocated scene that adds one anyway dilutes it.

## Motion Budget - One Macro Move, Few Live Elements

A real camera gives footage **globally correlated motion**: the lens drifts and every layer moves together, differentiated only by depth. Viewers read correlated motion as _someone is filming this_; they read many small independent motions as _UI animation / screensaver_. So the unit of "aliveness" is the **scene**, not the element. Per scene the plan budgets:

1. **ONE macro motion (required)** - a camera-style move on the scene root: slow drift, dolly in/out, push, parallax pan. This alone keeps every visible element moving, coherently, for the whole beat.
2. **At most 1-2 secondary live elements** - chosen from the menu below, on the elements that carry the beat (the hero, the CTA).
3. **Everything else rests.** Stillness is a tool, not a failure: composition.md lists "one element moving vs all else static" as a strong hierarchy contrast - if everything moves, motion stops carrying information. Prefer the macro move + depth parallax over multiple independent floats; do not give every icon its own oscillator.

Secondary-slot menu (concrete formulas and code are build work):

| Pattern                      | Use case                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------- |
| **Multiplicative breathing** | the hero image / hero block (small ±2-5% breathing on final scale, **not yoyo**) |
| **Glow pulse**               | CTA, click target                                                                |
| **Sine float**               | one decorative cluster at most                                                   |
| **Rotational drift**         | 3D cards, hero logo                                                              |
| **Orbit**                    | surrounding icons (counts as the scene's one decorative cluster)                 |
| **Halftone breathing**       | atmospheric scenes (density deforms with beat)                                   |

**Multiplicative breathing** stays the signature treatment for a hero **that holds a live slot** - not a default stamped on every hero in every scene. **Forbid** yoyo tweens (they overwrite entry scale). Concrete formula (`scale = final * (1 + Math.sin(t * freq) * amp)`, `onUpdate` reads `tl.time()`) is build work.

**Minimum amplitude ±6px or ±2-5% scale** - 3px micro-float does not count as motion. The budget caps how many things move; it does not license invisible motion.

## Transition Vocabulary - Use Only 2-3 Across the Film

Inter-scene transitions follow a limited vocabulary. Choose only 2-3 and repeat them - repetition creates professional cohesion. Cleanest archive reference: playground-launch uses **only cut-the-curve** across 8 distinct visual universes, which is what makes the film cohere.

> Choose 2-3 from `crossfade` / `blur-crossfade` / `push-slide` / `zoom-through` / `squeeze` — all between-scene transitions injected by the harness onto clip wrappers.

### Cut-the-curve (archive signature; default for most cases)

Current scene blurs + slides out -> next scene blurs + slides in. Both sides use the same blur magnitude; direction alternates across seams (right -> left -> up -> down); background triggers slightly before foreground content; internal reveals occur after the stage settles. Plan only names direction ("cut-the-curve LEFT"); concrete 0.33s / 0.42s / 8-10px blur is build work.

### Scale + fade (zoom-through)

One scene fades while pulling toward frame center; camera pushes forward into the next headline.

### Slide

Directional slide (matches narrative flow), optionally with parallax.

### Hard cut

Instant opacity flip, used for high-energy moments (grid appears fully filled with no build-in). **Use sparingly** - cut-the-curve is default; hard cuts are reserved for type/tone shifts.

## Plan Reference Example

> "Macro motion: slow dolly-in on the scene root across the whole beat. Multi-phase: hero enters on `EASE.entry` (heavy intent) -> icons enter with snappy stagger (5 items, total stagger ~400ms), then rest -> **stillness-before-climax 0.6s** (allocated scene; cursor still, only the dolly continues) -> result emphasis: text gentle entry + double-layer glow -> idle hold, hero breathing ±3% as the one live element."

Do not write concrete ease curve names / ms values / stagger formulas / JS code.
