# Story Design

The story layer for a promotional video. Choose one storytelling archetype, design the scene sequence, define each scene's narrative intent, choose a transition for every seam, and write narrator scripts. Output: `narrator_scripts.json`.

## Core Principles

Video narrative is independent from website structure. A website is an information layout; a video is an emotional journey.

- Scene sequence comes from narrative design, not from the original page section order.
- A page may flow `hero -> features -> pricing -> CTA`; a video may flow `hook -> pain -> hope -> proof -> action`, or `vision -> bridge -> proof -> action`, or `question -> demo -> demo -> trust -> action`, depending on the archetype.
- Reorder, merge, omit, or restructure website content as needed.
- Extraction data is the source of information and assets, not a story template.

The planning standard: **write the emotional beat alongside the structural type**, **name the specific persuasion technique** (do not merely write "show benefits"), and **specify a transition for every seam**. What carries the viewer's eye from scene N to scene N+1 is part of the story itself, not something to defer to the visual phase.

## Provided-Script Modes (verbatim vs restructure)

When the dispatch context includes a **`Provided script:`** line, the user supplied their own script (`user_script.txt`) and it is the **narration spine** — not the site copy. Read it first. The **`Voice-over mode:`** line then decides how much freedom you have with the wording:

- **`restructure`** (also the implicit mode when there is no user script): treat the script/brief as raw material. Rewrite it into punchy per-scene narration under the dispatch's `Script style` budget (1-2 sentences, ≤20 words), and reorder / merge / omit freely to fit the chosen archetype. This is the default flow described in the rest of this guide.
- **`verbatim`**: the user's words are **fixed**. Segment `user_script.txt` into scene-sized chunks at natural sentence / paragraph boundaries and copy each chunk into `script` **unchanged** — do not reword, summarize, add, drop, or reorder text (you may split one long sentence at a clause boundary, but never edit the words). The "≤20 words" budget and the **Script Voice Quality Bar** rewriting rules below are **suspended** in this mode. Specifics:
  - **Duration follows the script.** Set each scene's `estimatedDuration` from the chunk's natural spoken length (~2.5 words/sec → a 25-word chunk ≈ 10s), and let the **total video length follow the full script** — there is no 60-90s cap in verbatim mode. (Downstream, `prep.mjs` later replaces the estimate with the real TTS voice duration, so the scene auto-fits the actual spoken length.)
  - **You still design everything else.** Each scene still needs full `narrativeIntent`, a `transition`, and `assetCandidates`. Infer the archetype that best fits the script's _existing_ arc rather than imposing a new structure on top of fixed words.
  - **Don't manufacture silent scenes.** Use `script: ""` only if the user's text itself has a deliberate gap; otherwise every chunk carries its verbatim line.
  - The schema rules still apply (e.g. ≥1 `feature_showcase` / `product_intro` scene) — assign scene `type`s to the verbatim chunks so the arc satisfies them.

In **both** modes, when a capture ran (`context_pack.md` has an Asset Inventory) you still mine it for `assetCandidates` and visual register exactly as below — the modes govern only the _words_, not the visuals.

## Use `site_dna` to Set the Register (read once at the start)

`design-system/inference.json` `site_dna` is the deterministic Phase 1 summary of the site's character. Read it once at the start and tune the narrative to the same channel as the final visuals (**read only the `site_dna` section; do not read `design.html` / `chunks/` because those are parallel outputs from the design-system subagent, and reading them would break Phase 1b||2 parallelism**). **If `inference.json` is missing** (Phase 1 did not run `build-design.mjs --no-emit`), first run `(cd "$PROJECT_DIR" && node <SKILL_DIR>/phases/design-system/scripts/build-design.mjs ./design-system --no-emit)`, then read it; this is deterministic output, so rerunning it does not affect Phase 1b||2 parallelism.

| `site_dna` field                               | How to use it                                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voice_tone` (neutral / warm / formal / ...)   | Set script tone: `formal` stays restrained and avoids jokes; `warm` can use disarming specificity (ZapBG's "Grandma" move); `neutral` uses sharp-but-plain language |
| `voice_heading_style` / `voice_heading_length` | Hook copy rhythm: `UPPERCASE`/`tight` -> short triplets (Vibe.co "Target. Deliver. Measure."); `loose` -> longer anaphora lines (HRS)                               |
| `material` / `imagery`                         | Bias archetype + hook: spectacle/glass aesthetic -> Visual-spectacle hook + Feature-Benefit Cascade; flat B2B -> PAS / BAB                                          |
| `page_intent` / `section_role_counts`          | High `feature-grid` count = use Feature-Benefit Cascade inner rhythm (longer continuous demo sequence); pricing-heavy -> add price-anchoring persuasion beat        |

`site_dna` is a **soft input**: it narrows choices and pre-aligns narrative with visuals, but the final archetype judgment still comes from `context_pack.md`.

## Narrative Archetypes

Before designing scenes, choose **one** storytelling archetype (or explicitly name a hybrid; see "Compound archetypes" below). Read its overview for guidance and study its golden samples. Do not mix sections from different archetypes, because each one is a complete, coherent emotional journey.

<archetypes>
<pain-agitate-solve path="archetypes/pain-agitate-solve/overview.md">
**Pain -> Agitate -> Solve (PAS)** - establish pain recognition first, then reveal the solution. Best for products that solve known frustration, B2B tools, and audiences already feeling the pain. A later product reveal (33-50% into the video) maximizes relief contrast. Samples: alpha (culture/identity-driven crypto PAS), madison (character-driven PAS + Feature-Benefit Cascade compound).
</pain-agitate-solve>

<future-pacing path="archetypes/future-pacing/overview.md">
**Future Pacing - Vision -> Proof** - paint a better future first, then prove it can happen. Best for AI/tech products with new capabilities and new-category products. The product should be named very early (4-10%) to anchor the vision. Samples: agentgpt (BAB / Feature-Benefit Cascade compound; the "Imagine" hook gives it Future-Pacing flavor). Future Pacing and BAB both have visionary-opening DNA; choose BAB when the proof is a workflow walkthrough rather than capability demonstrations.
</future-pacing>

<demo-loop path="archetypes/demo-loop/overview.md">
**Demo Loop - Question -> Instant Answer** - a minimal narrative built around repeated product demos. Best for UI-centric products, data tools, and "seeing is believing." Commonly appears as a "Problem-Solution-Benefit Cascade" variant (skip agitation, move directly from problem to solution, then to layered benefits). Sample: gwi.
</demo-loop>

<before-after-bridge path="archetypes/before-after-bridge/overview.md">
**Before-After-Bridge (BAB)** - show the friction state, contrast it with the desired state, then walk through the bridge that gets there. Best for workflow products whose headline is *process improvement* rather than pure pain or pure vision. Mid-video product reveal (15-35%). Samples: kyvos, desklog, and agentgpt (hybrid with Future Pacing).
</before-after-bridge>

<feature-benefit-cascade path="archetypes/feature-benefit-cascade/overview.md">
**Feature-Benefit Cascade** - quickly sequence features to build momentum toward CTA. No agitation phase. Best for feature-rich SaaS, NFT collections / marketplaces, and products whose purchase motivation comes from desire-escalation rather than pain-relief. Product should appear early (0-22%) or be visually present from scene 1. Samples: vibe-co, elemental-soul. It often appears as an *internal rhythm* inside other archetypes: Madison is PAS+Cascade, AgentGPT is BAB+Cascade.
</feature-benefit-cascade>
</archetypes>

### Compound Archetypes

Real videos often _layer_ multiple archetypes. Reverse-engineered samples explicitly name compounds, such as `"PAS with Feature-Benefit progression"` (Madison), `"Before-After-Bridge / Feature-Benefit Cascade"` (AgentGPT), and `"Problem-Solution-Benefit Cascade"` (GWI). Pattern:

- **Outer archetype** = macro emotional arc (PAS / Future Pacing / BAB / Demo Loop)
- **Inner rhythm** = tactical rhythm inside the showcase phase (Feature-Benefit Cascade is the most common inner rhythm; it alternates 6+ consecutive scenes between `feature_showcase` and `benefit_highlight`)

Write `narrativeArchetype` as `"<outer> with <inner>"`. The downstream visual-design phase reads it for pacing; a Cascade inner rhythm means tighter `slide` / `dissolve` seams and shorter scenes.

## Narrative Architecture

Define each scene's role in the story. Every scene has five narrative fields (`type`, `narrativeRole`, `keyMessage`, `persuasion`, `emotionalBeat`) plus a `transition` spec — see the canonical `narrator_scripts.json` schema at the bottom of this guide for field definitions. Note: `branding` is a philosophical product-positioning scene (tagline / category claim), distinct from `product_intro` and `cta`.

### Hook Strategy Taxonomy

Choose one. The hook is the highest-leverage 3-5 seconds. Reverse-engineered samples use these strategies:

| Strategy                              | When to use it                                                  | Example                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Shocking statistic**                | You have a credible data point quantifying industry-level pain  | "50% of companies still rely on paper checks" (PayCloud), Fosfor opens with industry-trend validation         |
| **Imagine / future-pacing**           | The product creates a new category or paradigm                  | "Imagine next generation AI for the enterprise" (AgentGPT)                                                    |
| **Direct address / character hail**   | Audience is clearly defined and tribe-like                      | "Hey, sales pro." (JustCall), "Sales teams, listen up!" (JustCall IQ)                                         |
| **Pain validation**                   | The audience already knows the pain; say it back to them        | "Tired of clueless conversations?" (JustCall), "Responding to all of your online reviews..." (ResponseScribe) |
| **Visceral metaphor**                 | The pain is abstract and needs to become concrete / embodied    | "Goodbye to long airport queues, goodbye to dinosaurs of the past" (HRS)                                      |
| **Rhetorical question**               | Create an immediate cognitive gap to drive curiosity            | "Need answers about your audience, now?" (GWI)                                                                |
| **Category announcement**             | The product itself is the category; make the category memorable | "Cloud BI Acceleration" (Kyvos), "Vibe.co. All-in-one TV Ad Platform" (Vibe.co)                               |
| **Visual spectacle / world-building** | The aesthetic itself is the pitch (crypto, NFT, lifestyle)      | "Welcome to the Ultraverse" (NFT Marketplace), "Fire" (Elemental Soul)                                        |
| **Question / invitation**             | Creator-tool / democratization narrative                        | "Got something to create?" (Artinals)                                                                         |
| **Trend positioning**                 | Ride a cultural wave; novelty itself is the hook                | "Introducing the future of influencer marketing" (Skye)                                                       |

### Persuasion Technique Catalog

Each scene's `persuasion` field should be a _named technique_, not a vague benefit. Choose from this catalog (extracted from 22 reverse-engineered samples). If multiple mechanisms are active, combine them (e.g. "Social proof + Authority via logos").

| Family                       | Techniques                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pain/Friction**            | Pain agitation • Cognitive overload representation • Negative framing & contrast • Agitation by visual clutter • Contrast (chaos vs clean)                                                       |
| **Authority**                | Authority bias • Authority by association with logos • Expert authority • Statistical proof / hard metrics • Brand authority                                                                     |
| **Social**                   | Social proof • Bandwagon effect • Social belonging • Status seeking • Gamification + social proof (counter ticks) • In-group signaling (insider terms)                                           |
| **Reduction**                | Friction reduction • Risk reversal (free trial / no risk) • Simplification • Cognitive ease • Frictionless adoption                                                                              |
| **Vision**                   | Aspiration / innovation bias • Future pacing • Pain removal (bold absolutes) • Trend exploitation                                                                                                |
| **Proof**                    | Demonstration of capability • Visual proof of mechanics • Demonstrated efficiency (real-time visible) • Show, don't tell • Live-action preview                                                   |
| **Value**                    | Value stacking • Value-centric positioning • Feature-to-benefit translation • Price anchoring • Empirical proof & concrete numbers • Economic benefit / cost-efficiency • Win-win mutual benefit |
| **Empowerment**              | Empowerment & control • Risk reduction • Ownership clarity • Creative empowerment                                                                                                                |
| **Scarcity** (crypto-native) | Scarcity & temporal urgency (drop dates) • Exclusivity (tier scarcity) • FOMO • Anchoring via explicit pricing                                                                                   |
| **Structure**                | Rule of three (triplet structure) • Direct address / audience segmentation • Audience filtering                                                                                                  |
| **Personality**              | Humor / personality injection • Cultural reference / insider beat • Familiar web2-style patterns applied to web3                                                                                 |

When a scene's persuasion cannot map to any item in the catalog, you may name a new technique inline, but you must explain its _mechanism_ (for example, "Subtractive proof: removing the chaos visually instead of explaining why the new UI is clean"). Do not write generic "show benefits."

### Emotional Beat Vocabulary

`emotionalBeat` should be one word or a short compound phrase (e.g. "Intrigue and awe", "Relief and assurance"). Avoid generic "positive" / "happy" / "interested." Reverse-engineered samples use this catalog:

**Negative valley** (hook / pain_point scenes): anxiety • frustration • overwhelm • tension • urgency • skepticism • cognitive overload • FOMO

**Pivot** (product_intro / branding scenes): relief • curiosity • intrigue • aspiration • clarity

**Build** (feature_showcase / benefit_highlight scenes): trust • confidence • control • power • awe • empowerment • foresight • excitement • playfulness • ease • prestige • desire • belonging • reassurance

**Resolution** (cta / final beats): triumph • motivation • urgency (to act) • peace of mind • inevitability

Scenes with compound beats are often strongest, e.g. "Excitement _and_ foresight" (DeskLog Vision AI), "Intrigue _and_ awe" (JustCall IQ real-time AI), "Relief _and_ assurance" (NFT Marketplace wallet). When two feelings are active, write both.

### Transition Taxonomy

Every scene's `transition` describes **how it arrives from the previous scene**, using one machine field (`intent`) + prose:

#### `intent` - 4 narrative seam intentions (**not** visual implementation)

Choose one of these 4. This is "narrative-level" vocabulary - it expresses what kind of connection the seam is, **not** blur amount / direction / duration (visual-design translates those according to preset/palette). Every transition is a between-scene seam injected by the harness onto the clip wrappers after assembly — no scene ever writes transition code, and every scene is authored by its own worker:

| Intent     | Narrative meaning                                                           | Downstream translation direction (visual-design decides values) |
| ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `cut`      | Clean switch; scenes are not continuous (type/tone shift, high-energy beat) | hard cut / crossfade                                            |
| `slide`    | Directional slide / push (matches narrative flow: forward, next point)      | push-slide (direction set by visual-design)                     |
| `dissolve` | Soft dissolve / focus shift (enter atmosphere, emotional transition)        | crossfade / blur-crossfade (when colors clash)                  |
| `zoom`     | Camera pushes / scales through to next focal point                          | zoom-through                                                    |

#### `description` - 10-30 word visual direction (existing, keep)

Concrete direction for downstream: what slides/dissolves/zooms, where the eye lands, and what color/shape guides it.

### Script Voice Quality Bar

Strong scripts have these traits. The failure mode is bullet-point prose. Examples in both categories come from the reverse-engineered archive:

**Strong (memorable, sharp, voiced):**

- _Anaphora_: "It is time to say goodbye to long airport queues, goodbye to customer frustration, goodbye to chaos, goodbye to dinosaurs of the past." (HRS) - moves from concrete to abstract, then to metaphor.
- _Specificity_: "Just ask for what you need, like moms who post about dog treats, and get instant recommendations." (Skye) - a concrete user story grounds abstract AI capability.
- _Imperative verbs in triplet_: "Advertise on TV. Target. Deliver. Measure." (Vibe.co) - uses monosyllables to create Rule of Three.
- _Humor / personality_: "It reads emotions, sentiments, buying patterns - everything but minds. Maybe in the next update?" (JustCall IQ) - the joke is a confidence signal.
- _Cultural signaling_: "Presenting: the GM button." (Alpha) - "GM" is the crypto-Twitter good-morning greeting; insider reference proves the brand belongs to the audience's tribe.
- _Disarming specificity_: "For Non-Designers, Entrepreneurs, Designers, Agencies, Grandma." (ZapBG) - "Grandma" breaks formality and communicates extreme accessibility.

**Weak (failure modes to avoid):**

- _Noun-phrase bullet lists_: "For crew. Seamless experience. Real-time communication. Crews always informed." - sounds like slide bullets, not dialogue.
- _Generic single-word bridges_ (unless intentional): "Or...", "And..." - can work as breath beats inside a stronger arc; but if it is the only content of a 5-second scene, it is weak.
- _Vague capability claims_: "Streamline your workflow." - every SaaS says this, so it says nothing.
- _Marketing-speak without grounding_: "Unlock the power of next-generation AI." - say what it does for a _person_, not an abstract category.

### Empty / Silent Scripts Are Allowed

When the visual itself carries the information, set `script: ""` and keep the scene silent. Reverse-engineered samples intentionally do this:

- ZapBG scenes 8-9 (drag-and-drop demo): empty script, because the UI interaction _is_ the message
- JustCall IQ scene 7 (leaderboard): empty script, because visual gamification carries persuasion
- Skye scenes 4 and 7 (feature pivots): empty script, because the narrator pauses while the dashboard updates

If you set an empty script, `narrativeIntent` must be especially strong, because `narrativeRole` and `persuasion` must carry what the script does not say.

## UI Demo Should Be a Sequence, Not a Single Scene

The Phase 2 archive overwhelmingly treats UI demo as a **sequence of 3-15 consecutive scenes**, each focused on one feature area, continuously unfolding on the same product surface:

| Sample          | UI demo span | Runtime share      | Pattern                                                                                                                     |
| --------------- | ------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Madison         | scenes 6-14  | 53%                | 9 consecutive feature_showcase scenes (integrations -> SEO -> reviews -> social -> campaign -> reporting -> chat assistant) |
| GWI             | scenes 3-6   | 45%                | 3 feature_showcase queries (NBA fans, APAC fashion, US parents) + value cascade                                             |
| DeskLog         | scenes 3-6   | 57%                | Check-in -> journey tracking -> manager control -> vision AI                                                                |
| JustCall        | scenes 4-13  | 60%                | Contact import -> 3 dialer modes -> analytics -> team perf -> AI insights -> outcomes                                       |
| NFT Marketplace | scenes 13-27 | 38% (of 39 scenes) | 15-scene purchase + sell workflow walkthrough                                                                               |

This means the requirement "at least one UI demo scene" should be reinterpreted as: **at least one UI demo sequence (3+ consecutive feature/benefit scenes on the same product surface).** A single isolated demo scene rarely persuades. Keep the sequence reading continuous by reusing the same product-surface assets across the scenes and by giving the seams a consistent intent (mostly `slide` / `dissolve` — the "same surface, next panel" feel).

Planner identifies a UI demo sequence by:

- Scene type is `feature_showcase` or `benefit_highlight`
- `narrativeRole` contains words such as "Demonstrates", "Highlights", "Shows", "Illustrates", "Walks through"
- `script` references dashboard, interface, modal, workflow, profile, or concrete UI element names
- Adjacent seams use a consistent intent (`slide` / `dissolve`) so the sequence reads as one product surface
- Previous scene is `product_intro`; later scenes continue showcase, or pivot to `social_proof` / `cta`

## Asset Candidates for Every Scene

Phase 3 (visual-design) and Phase 4b (scene workers) **never read `capture/`**; they only consume `narrator_scripts.json` and `section_plan.md`. That means every visual asset downstream might use must be named on the corresponding scene in `narrator_scripts.json`.

For each scene, list one or more `assetCandidates`: visual assets suitable for that scene's narrative intent. The full list is forwarded verbatim to the Phase 4b scene worker (via Phase 4a `prep.mjs`); visual-design references these candidates in prose briefs, and the worker decides from the brief which are focal and which are supporting.

**Coverage target (default priority in this pipeline):** use **content assets** from Asset Inventory (real product screenshots / UI / photos / charts / infographics) broadly across the film. Assets not named by any scene are **permanently lost** (Phase 3/4b never read `capture/`). Two operating rules: (1) **spread different assets across scenes** by default - scene A uses this one, scene B uses another, rather than reusing the same hero throughout the film (a genuine hero carried through a continuous demo sequence is the exception; see "same asset across scenes" below); (2) **list more rather than fewer** - a scene can carry 2-3 candidates, and visual-design can assign them by role (focal + supporting). Let downstream, which has composition context, make the tradeoff; do not prune too early here.

```jsonc
"assetCandidates": [
  {
    "path": "public/dashboard-hero.png",
    "description": "Main product UI showing feature timeline, 1920x1080, dark theme"
  },
  {
    "path": "public/dashboard-detail.svg",
    "description": "Standalone icon for timeline component, useful as supporting motif"
  }
]
```

Rules:

- **`path`** - must be exactly `public/<basename>`. Read `<basename>` directly from the Asset Inventory entry (format `assets/001-xxx.png`), remove the `assets/` prefix, and add `public/`. Example: `assets/022-2f1c0ba7-1260x944.png` -> `"public/022-2f1c0ba7-1260x944.png"`. Phase 4a copies `capture/assets/` into `public/` at the video project root.
- **`description`** - short prose (<=25 words) explaining what is in the asset, approximate known dimensions, and visual notes (dark/light, dominant color, photo vs. UI vs. icon). visual-design uses it to decide how each asset fits scene composition; the worker uses it to place assets without opening files.
- **Use the contact sheets to disambiguate + describe.** If `context_pack` has a `## Contact Sheets` section, **Read those montage images** to SEE the assets. The text inventory often repeats one description across visually-distinct files (e.g. `image-2…10.jpg` all `"Humans of Binance"`) — the montage shows they are different shots (beach / car / family dinner), which is exactly what lets you **spread different assets across scenes** (coverage rule above) instead of treating them as interchangeable. It is also how you write a truthful `description`: downstream stays text-only, so the `description` you write from the montage is the only visual signal they get. (Contact sheets are review montages, not pickable assets — never put a `contact-sheet*.jpg` path in `assetCandidates`.)
- **Every scene with a visual hero needs at least 1 candidate.** Pure title / pure-typography scenes may use empty array `[]`; visual-design and Phase 4b workers treat it as an intentional text-only scene.
- **Order matters when ambiguous** - put the asset that best fits the narrative first. Downstream often favors the first item when the description still leaves room for choice.
- **Choose only from actually downloaded content.** The source of truth is the **Asset Inventory** in `context_pack`; if you need to verify a basename, run `ls capture/assets/` (there is no `capture/extraction.json`). Inventing nonexistent basenames causes Phase 4a fatal error.
- **The same asset can appear in multiple scenes** when the same hero should carry through narratively (for example, scenes 3-7 all showcase the same dashboard).
- **Maximize useful coverage; do not waste assets.** Across all scenes, combined `assetCandidates` should cover **most** content assets in Inventory. If a real product screenshot / photo / chart is not used by any scene, prefer assigning it to the semantically best-fitting scene instead of making that scene text-only by default. (Pure title / transition cue scenes should still use `[]` when appropriate - coverage does not mean forcing an image into every scene.)
- **List only content assets; use judgment to skip chrome / decorative junk.** Inventory is unfiltered: it may contain font files, favicon (`.ico`), social / payment / app-store badges, logo lockup variants, sprite sheets, and tiny (<~100px) decorative icons. These are **not candidates by default** (fonts are not images), unless a scene specifically needs them narratively (e.g. a social-proof media logo wall). Use `description` + `[kind]` + dimensions; `prep` will not filter for you.
- **`[video]` / `[video-still]` are high-value content, not chrome.** `[video]` = the page's embedded demo/hero video was downloaded as a real moving clip — cite its `public/<basename>.mp4`; the worker renders it as a `<video>` clip at the **host root** (direct child of `index.html`, never inside a scene sub-comp `<template>`, animated from the main timeline — see `variables-and-media.md`). `[video-still]` = only a static frame was captured (the video body was not downloadable) — cite its `public/<basename>.png` and treat it as a still image. The inventory caption is the strongest signal of content; a product demo video is usually the single best hero asset, so prefer assigning it to the product-intro / feature-showcase scene.

## Validation Checklist

- Does every scene have complete Narrative Intent (all 5 fields)?
- Does every scene have `transition`, including `intent` (one of the 4 intents: `cut` / `slide` / `dissolve` / `zoom`) and `description` (10-30 words)?
- Does every scene have `assetCandidates` (array; text-only scenes may be empty)? For visual scenes, does each candidate `path` correspond to a real file under `capture/assets/`?
- **Coverage:** are **most** content assets in Inventory (excluding fonts / favicon / icons / logo variants) included in some scene's `assetCandidates`? Are any valuable product screenshots / photos / charts missing and therefore discarded?
- Does the emotional arc have meaningful variation (not monotone)? Does it match the archetype pattern (PAS = negative valley -> relief; Cascade = steady positive climb)?
- Is the sequence driven by narrative rather than page order?
- Is there at least one UI demo _sequence_ (3+ consecutive feature/benefit scenes on the same product surface, seams using a consistent intent)?
- Are Persuasion fields named techniques from the catalog rather than vague benefits?
- Are Emotional beats specific (word or short compound phrase), not generic "positive"?
- Does the hook use a named strategy from the taxonomy?
- Is there only one outer archetype (no mixing top-level frameworks)? Explicitly named inner-rhythm compounds are allowed.

## `narrator_scripts.json`: Canonical Schema

Frontend (and downstream agents) expect these **exact** field names. Wrong names (e.g. `scene_id` instead of `sceneNumber`, `narration` instead of `script`, or flattened intent fields) cause display and parsing problems.

```json
{
  "project": "Project name",
  "narrativeArchetype": "Selected archetype (or compound: \"<outer> with <inner>\")",
  "orientation": "Canvas aspect, echoed verbatim from the dispatch Orientation line: landscape (16:9, default) | portrait (9:16) | square (1:1). Dictated by the user's aspect, not chosen. prep maps it to group_spec.width/height. Omit → landscape.",
  "emotionalArc": "Emotional journey description (e.g. 'Frustration with manual processes shifting to relief and excitement through smart calling automation.')",
  "scenes": [
    {
      "sceneNumber": 1,
      "sceneName": "Scene name",
      "transition": {
        "intent": "cut|slide|dissolve|zoom",
        "description": "10-30 word concrete visual direction explaining what slides/dissolves/zooms and where the eye should land"
      },
      "narrativeIntent": {
        "type": "hook|pain_point|product_intro|feature_showcase|benefit_highlight|social_proof|branding|cta",
        "narrativeRole": "The scene's job in the story (not what appears on screen)",
        "keyMessage": "What the viewer should remember (one sentence)",
        "persuasion": "Named technique from the catalog (can combine if multiple mechanisms are active)",
        "emotionalBeat": "Word or short compound phrase from the vocabulary"
      },
      "assetCandidates": [
        {
          "path": "public/<basename-from-capture-assets>",
          "description": "Short prose: what is in the asset + approximate dimensions + visual notes"
        }
      ],
      "script": "Plain-text narration. May include <em>/<brand>/<emph>/<cta> tags as authoring-time annotations (TTS strips them and will not read them). Can be an empty string when visuals carry the information.",
      "estimatedDuration": "5-6s"
    }
  ]
}
```

Field rules:

- Use `sceneNumber` (not `scene_id`), `sceneName` (not `scene_name`), `script` (not `narration`), and nest intent fields inside `narrativeIntent` (do not flatten them onto the scene object).
- Every scene must have a `transition` field (`intent` + `description`), including scene 1 (`intent: "cut"`). **Scene 1 has no previous scene, so its `transition` does not generate any transition downstream (downstream ignores it) - `intent: "cut"` is just a placeholder; fill it and do not design a real opening transition.** The legacy `continuity` / `sharedMotif` fields were removed (`validate-narrator.mjs` rejects them).
- `assetCandidates` is a **required** field and must be an array. Truly text-only scenes (title cards, pure typography) use `[]`. Any scene with a visual hero must include at least one `{path, description}` entry.
- Every `assetCandidates[].path` must be `public/<basename>`, and basename must exist in `capture/assets/`. Phase 4a `prep.mjs` fails when a file is missing.

### Captions (not owned by story-design)

Do not write a `captions: string[]` field. `<em>/<brand>/<emph>/<cta>` tags inside `script` are stripped by TTS; whether you include them does not drive downstream visuals.
