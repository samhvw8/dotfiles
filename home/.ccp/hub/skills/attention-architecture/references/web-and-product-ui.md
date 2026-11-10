# Web and product UI

Load for a landing page, website, product UI, dashboard or app screen. Numbers owned by [../SKILL.md](../SKILL.md) (contrast, accent, motion, line length) are cited, not restated. Standards and platform numbers (WCAG 2.2, Core Web Vitals) are in [platform-specs.md](platform-specs.md). Grades: `S` standard, `A` replicated, `B` one study or narrow sample, `H` heuristic.

## Contents
1. Diagnose before you rewrite
2. What people look at (scanning evidence)
3. Landing page structure
4. Layout selector
5. Product UI rules
6. Motion
7. Color and dark mode

## 1. Diagnose before you rewrite

A high bounce rate or a low conversion rate has cheap causes that copy cannot fix. Check them in this order, and ask the user for the data you lack.

1. **Traffic intent and message match (H).** Compare the promise in the ad, search query or referring post with the page headline. A visitor who clicked "budget app for couples" and lands on "AI-powered financial management" leaves. Ask for bounce or engagement rate split by source and campaign; one bad source often explains the average.
2. **Speed (S).** Check LCP, INP and CLS on mobile at the 75th percentile (thresholds in platform-specs.md). A slow hero image is a common cause.
3. **Mobile first screen (H).** Render at 360–390 px wide. The headline, one line of support and the primary CTA must be visible without scrolling. A tall logo, hero image or cookie bar that pushes them down is a defect.
4. **Nothing broken (H).** Read the markup for plain bugs before the copy: a CTA with no `href` or handler, an image with no `alt` or dimensions, a control you cannot reach by keyboard. The CTA label says what happens next ("Start free trial", "See pricing"), not "Learn more".
5. **What the metric means (S).** In GA4, bounce rate is the share of sessions that were not engaged (an engaged session lasts over 10 s, has a key event, or has 2 or more page views). A one-page site with a phone-call CTA can bounce a lot and still convert.
6. **Only then copy and layout.** Before an A/B test, compute the sample size per arm from the user's baseline conversion rate and the smallest lift worth detecting, and give the number. With low traffic, ship the clear fixes and compare before and after by traffic source; test large changes, not button colors.

Put this diagnosis in a few lines at the top of the reply, name the two or three numbers the user should pull, then deliver the fixes for what the markup shows. Do not make the user wait for data before they get the rewrite.

## 2. What people look at

| Finding | Grade and source | Do this |
|---|---|---|
| First impressions form within about 50 ms and agree with longer looks (ratings at 50 ms and 500 ms correlate about .95). Visual complexity is judged by about 17 ms and lowers beauty; how typical the layout looks matters by about 33 ms | A: Lindgaard et al. 2006; Tuch et al. 2012 | Keep the layout conventional (logo top-left, navigation at the top, hero, then proof). Put the surprise in the headline or the focal object, not in the navigation |
| Clutter lowers rated aesthetics, more so the longer a screen stays in view (r = −.30 at 150 ms, −.48 at 4 s). Symmetry and white-space share had no significant effect | B: Miniukovich & De Angeli 2015, full-text appraisal; models explain at most about 49% of variance | Remove competing elements. Keep at least about 20 px between unrelated edges. Do not chase a white-space percentage |
| About 80% of horizontal attention lands on the left half of a page | B: NN/g eye-tracking 2017, left-to-right languages | Put the main message and CTA in the main (left or center) column |
| About 57% of viewing time is above the fold and 74% in the first two screenfuls | B: NN/g 2018 | Make the first screen earn the scroll. Content below still gets read when the first screen promises it |
| Position and text style predicted where people first looked better than size or images | B: Still 2018, one eye-tracking study | Place the key message by position and contrast; making it bigger is not enough |
| Ad-like boxes, right rails and banner shapes get few fixations and are poorly remembered. Banner-styled elements were fixated in about 12% of trials and not recognized better than chance; flashing banners slowed search | A: Benway 1998; Burke et al. 2005; NN/g 2018 on mobile and desktop | Never put proof, a key benefit or the CTA in a block that looks like an ad or in a right rail (G4) |
| Walls of text produce an F-shaped scan that skips the right and the bottom. Clear headings shift people to a "layer-cake" scan of the headings | B: NN/g eye-tracking | Use descriptive headings that front-load the key word (G7). Group content under them |
| Concise text improved measured usability by 58%, scannable layout by 47%, objective language by 27%, and all three together by 124% | B: Morkes & Nielsen 1997, one study | Cut words, use headings and lists, and replace promotional adjectives with facts |

## 3. Landing page structure

Default order (H). Change it when the product needs it, and say why.

1. **Hero:** a short headline that states the outcome for the visitor (G5), one line of support that says how, one primary CTA, one proof element next to the CTA with its source ("4.8 on the App Store from N ratings"), and a picture of the product in use. Exactly one focal target (G1). Reuse the words of the ad or query that brought the visitor.
2. **Proof:** real numbers, named customers, testimonials with a name and role. Every number is sourced (G14) and every count is true (G17).
3. **How it works:** 3–4 steps, each a verb and an object.
4. **Objections:** pricing link, FAQ, security, what happens after signup.
5. **Close:** the CTA again, with the same label. No housekeeping tail after it.

Microcopy under a CTA removes the main fear, only when it is true: "No card required", "Cancel any time in Settings". Where users fear exposure (finance, health, personal data), say what stays private by default (H).

## 4. Layout selector

| Layout | Use when | Fails when |
|---|---|---|
| Layer-cake (stacked sections, clear headings) | Text-heavy landing pages, docs, feature pages | Headings are generic ("Overview", "Features") |
| Z-pattern hero | Little text (under about 40 words): splash, hero, modal | The screen is text-heavy |
| Single column | Forms and checkout (B: CXL and Baymard form studies) | Wide analytic dashboards |
| Sticky split (steps scroll on one side, the matching visual stays fixed) | Product tours, explainers, code-plus-preview docs. It keeps each step next to its picture (H, extrapolated from Mayer's contiguity principle) | Mobile, unless it collapses to a sticky visual on top |
| Uniform grid or aligned table | Users compare prices or specs across items | Used for visual browsing |
| Masonry feed | Visual discovery and browsing | Users must compare items |
| Dashboard pyramid | A few KPIs on top, 1–2 charts below, the detail table last (H). Chart construction: the `dataviz` skill | The table comes first |
| Alternating text and image rows | Short marketing sections | Long pages: keep the text on one side so the reading line holds |

## 5. Product UI rules

- **Navigation:** 3–5 top-level items; put the rest behind progressive disclosure (H).
- **Type scale:** at most 4 sizes or weights on one screen (H).
- **Primary vs destructive actions:** the most salient button is the primary forward action. Destructive or rare actions (Delete, Log out) stay neutral and ask for confirmation (H). Do not use this to hide a cancel or unsubscribe control; G17 requires cancelling to be as easy as signing up.
- **Targets:** at least 24 × 24 CSS px (S: WCAG 2.5.8); primary mobile actions at platform size (44 pt iOS, 48 dp Android). About half of phone users hold the phone in one hand (B: Hoober 2013), so frequent actions go in easy reach at the bottom. Keep back and close where the platform puts them.
- **Error messages:** say what happened and how to fix it, in plain words. Never blame the user ("You entered an invalid…") (H).
- **Onboarding progress:** count real completed steps ("Account created: step 1 of 4 done"). Put fast steps first. Never fake progress; bars that start slow raise drop-off (B: Nunes & Drèze 2006, a car-wash loyalty card; Villar et al. 2013 meta-analysis of survey progress bars).
- **Empty states:** show sample data or one clear next action (H).
- **Forms:** one column, the label above the field, and only the fields you need (B).
- **Color is never the only signal** for state or errors; add an icon or text (S: WCAG 1.4.1).

## 6. Motion

- Feedback within about 0.1 s feels instant; about 1 s keeps the flow of thought; past about 10 s people leave the task (B: Nielsen's response-time limits, after Miller 1968).
- Transition durations: the motion default in SKILL.md. Longer travel on large screens can take up to about 400–500 ms (H: Material Design duration tokens).
- Entering elements decelerate (ease-out); leaving elements accelerate (ease-in). Avoid linear easing for spatial movement (H: Material Design).
- No infinite decorative animation. Give a pause control for motion over 5 s, cap flashes at 3 per second, and honor `prefers-reduced-motion` (S: platform-specs.md).
- Scroll-driven effects never change element size, padding or borders during scroll; layout shifts count against CLS (S).

## 7. Color and dark mode

- Accent and contrast: the SKILL.md defaults. Compute every pair from hex.
- **Dark mode (H):** avoid pure white on pure black for long reading; bright text on black blurs for many readers (halation, worse with astigmatism). Use a dark gray surface and off-white text, for example `#E0E0E0` on `#121212` (14.2:1; Material's 87%-white text) or `#E2E8F0` on `#0F172A` (14.5:1).
- **Light mode for dense reading (B):** dark text on a light background gave better proofreading and reading performance (Buchner & Baumgartner 2007; Piepenbrock et al. 2013). Offer dark mode as an option, not as the only mode for text-heavy products.
- **Borders that identify a component need 3:1** against the adjacent color (S: WCAG 1.4.11). `#1E293B` on `#0F172A` is 1.22:1 and fails; `#64748B` on `#0F172A` is 3.75:1 and passes. Muted metadata text still needs 4.5:1: `#94A3B8` on white is 2.56:1 and fails; `#767676` on white is 4.54:1 and passes.
