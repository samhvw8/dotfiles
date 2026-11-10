# Choice architecture and pricing

Load for a pricing page, checkout, paywall, subscription flow, onboarding or a persuasion sequence. The grades (`S`, `A`, `B`, `H`) and checks `G16`–`G17` are in [../SKILL.md](../SKILL.md). This file owns the daily-price and loss-framing defaults. Paper IDs (`P35`–`P74`) are internal and point to [evidence-caveats.md](evidence-caveats.md); never show them to a user.

## Contents
- Legal floor (check G17)
- The pricing block you deliver
- Pricing page and checkout (A1–A4)
- Persuasion sequence (B1–B3)
- Quick reference: what holds and what does not

## Legal floor (check G17)

Check this before any conversion lever. A conversion gain never justifies a miss here. Fix every miss in the deliverable whatever the market, because each one also costs trust.

**How to speak about the law.** Each row lists laws with their scope. Tell the user only what a row supports for their market: name the law and what it covers. Do not say a practice is "illegal in the EU and US" when the cited rule covers one sector or one state. For a market or an article marked not verified (Vietnam below, and any market not listed), say the practice is a known dark pattern that regulators target, that you have not verified the local rule, and that local counsel should confirm. Lead with the trust reason; it holds everywhere.

| Rule | Why (S) |
|---|---|
| No pre-ticked box for recurring billing, auto-renewal, insurance or any paid add-on. The user ticks it | EU Consumer Rights Directive Art. 22 (no pre-ticked boxes for extra payments). US ROSCA requires express informed consent before a negative-option charge; state auto-renewal laws (for example California's ARL) require affirmative consent |
| Before payment, state that the plan renews or the trial converts, the amount, the date, and how to cancel. Get express consent to that | US ROSCA (enforced by the FTC without the vacated rule); state ARLs. China: Consumer Protection Law Implementation Regulations (2024) Art. 10 require a prominent reminder 5 days before an auto-renewal charge |
| Cancelling is as easy as signing up, in the same channel. No retention maze, no forced call, no loss-framed step that blocks the cancel button. One honest retention offer that the user can skip in one click is the limit | ROSCA "simple mechanism" requirement and FTC enforcement; California ARL; EU: online sellers need a withdrawal function ("withdraw from contract here") for distance contracts, applying from 19 June 2026 (Directive (EU) 2023/2673) |
| Reference prices and "was" prices are real. In the EU, the prior price is the lowest price in the last 30 days | EU Price Indication Directive Art. 6a (Omnibus Directive); FTC Guides Against Deceptive Pricing (16 CFR 233) |
| Urgency, scarcity, countdowns, stock counts, user counts and reviews are true. No fake or bought reviews, no fake social-proof indicators | FTC Consumer Reviews and Testimonials Rule (16 CFR 465, effective October 2024); EU UCPD Annex I No. 7 (false limited-time claims) |
| One all-in price: mandatory fees are inside the shown price, not added at checkout | Narrow in the US: the FTC Rule on Unfair or Deceptive Fees (16 CFR 464, effective 12 May 2025) covers live-event tickets and short-term lodging only; California SB 478 covers most consumer prices in that state. EU: the total price including unavoidable charges must be shown before the consumer is bound (Consumer Rights Directive Art. 6(1)(e), distance contracts). For other products and markets, argue from trust, not from law |
| Vietnam: **not verified.** The Law on Protection of Consumer Rights 2023 and Decree 55/2024/ND-CP regulate standard-form contracts and distance selling, but no article has been checked against the text | Do not tell a user what this law forbids. Say the rule was not verified and recommend local counsel |

Status notes (checked 2026-11): the FTC's amended Negative Option ("click-to-cancel") Rule was vacated by the US Eighth Circuit on 8 July 2025. The FTC restarted rulemaking with an advance notice on 11 March 2026. ROSCA, state ARLs and FTC enforcement still apply, so the floor above holds without the rule.

## The pricing block you deliver

A rewritten pricing section is complete and ready to paste (H):

- **Every plan is filled in:** name, price with its billing period, who it is for, 3–4 concrete features, and its own button with a specific label. Write plausible features from what the user told you and bracket only the facts you cannot know.
- **One audience per table.** Move business or enterprise plans to a separate link when the page sells to individuals.
- **One plan recommended,** with a true one-line reason. A badge such as "Most popular" is a factual claim: use it only if it is true, otherwise write "Recommended".
- **Before you remove or merge plans,** tell the user to check which plans earn the revenue.
- **The headline promise and the free plan agree.** If the hero promises a feature, the CTA must not lead to a plan without it.
- **Fees:** fold a mandatory fee into the price and say what that does to the number (absorb it or raise the price); the choice is the user's. A fee that must stay separate sits next to the price, not in a footnote.
- **Billing terms are unambiguous:** a monthly price with an annual renewal says the amount charged, when, and how to cancel. Consent boxes are unticked.

## Pricing page and checkout

### A1. Defaults: endorse, don't hide (A)

Defaults are the one nudge family that holds up after publication-bias correction (`P43` Jachimowicz 2019: about `d = 0.68`; `P40` Maier 2022 finds the bias-corrected average for nudges near zero, with defaults the open exception). Defaults work through **endorsement** and **endowment**, not through ease (`P43`).

1. Pre-select the recommended tier or configuration and give the reason in one line ("Recommended for 3–10 person teams").
2. Pre-fill the workspace with the user's own imported data or a sample, so the default state already holds something of theirs.
3. Never use a default to add a charge (see the legal floor).

### A2. Anchoring and the price block (A for anchoring; B for precise anchors)

Anchoring is the most reliable effect in the Many Labs set (`P35`). Precise anchors (`$1,428` vs `$1,500`) pull adjustment more than round ones (Janiszewski & Uy 2008, one paper; Tier 2).

1. Itemize component value before a bundle price only when each item is a real price you charge on its own (legal floor). Otherwise skip it.
2. Show a monthly or daily equivalent only next to the amount actually billed, at least as prominent. **Daily-price default (B):** only for petty-cash amounts (`P67` Gourville 1998: it helped at about $1/day and hurt at $4/day, 1998 dollars).
3. Use clean integers for B2B and high-trust tiers; charm endings (`.99`) are a convention for low-ticket consumer prices (H).

### A3. Tiers, decoys and choice overload (B)

- **Tiers.** 3–4 tiers for one audience, comparable at a glance (the same feature order in each card, or aligned rows), with one recommended (`G16`). A middle "compromise" tier is a safe structure (H).
- **Decoys mostly don't work.** `P45` Frederick, Lee & Baskin 2014 ran 38 studies: the decoy effect appeared in 4 of 5 purely numeric attribute matrices, 2 of 5 hybrids, 0 of 27 perceptual or experiential displays, and once reversed (repulsion). Yang & Lynn 2014 got 11 reliable effects in 91 attempts. Use a decoy only in a fully numeric 2-attribute table, expect zero, and prefer an honest compromise tier.
- **Choice overload is small on average.** Scheibehenne et al. 2010 meta-analysis: mean effect near zero. `P46` Chernev, Böckenholt & Goodman 2015 (99 observations, N = 7,202): overload grows with each of four moderators on its own: complex options, a hard task, unclear preferences, and a goal of deciding quickly. Cut tiers when any of these is present; offer a "top 3 for you" filter for long catalogs.

### A4. Trials, onboarding and progress (B)

- **Reverse trial and the loss-framing default (B).** Use a loss frame only when the user already holds the thing (an active trial, their own data). Full features first, then step down. At renewal or exit you may show, once and truthfully, what the user built ("4 workflows, 1,240 records"), and it must never block cancel (legal floor). Endowment framing is the only loss frame with support (`P44` Brown 2024 puts loss aversion at roughly 1.5–2 depending on elicitation; gain vs loss message framing barely changes persuasion, O'Keefe & Jensen). Do not quote a lambda in a design decision.
- **IKEA effect.** People value what they built, but only finished builds (`P47` Norton 2012; an unfinished build lowers value). Make the first build short and always completable, with a one-click sample-data path.
- **Progress.** Credit real completed steps (account created counts) and put fast steps first. Never fake a head start. The 20–25% "endowed progress" figure comes from one car-wash loyalty-card study (Nunes & Drèze 2006); a meta-analysis of survey progress bars found slow-start bars raise drop-off (Villar, Callegaro & Yang 2013).
- **Certainty at checkout.** Show the delivery date and the all-in price on the card (A for all-in price; H for the date).

### Fees and mental accounting (A + S)

Integrate fees into one price (`P65` Thaler 1985: losses hurt less when combined), and list free bonuses as separate gains. Partitioned "drip" fees can raise short-term demand (Morwitz et al. 1998; Greenleaf et al. 2016), so the honest reason for integration is trust plus the all-in pricing rules in the legal floor. A free (`$0`) option pulls demand far beyond its value (`P68` Shampanier 2007) and can cannibalize paid tiers; put "free" on shipping or bonuses rather than on a tier you need to sell past.

## Persuasion sequence

### B1. Story first, numbers where the audience judges (A)

Narrative transportation reliably shifts attitudes (`P49b` van Laer 2014, 76 studies, r = .41 for attitudes). Self-reference helps memory (Symons & Johnson 1997 meta-analysis). The identifiable-victim effect does not replicate as a rule (Lee & Feeley 2016: r = .05; Maier 2023 registered report: null), so don't contort structure around "one named person beats statistics".

1. Build the emotional beat on one concrete person or scene with a real plot, not a one-line quote.
2. Put statistics where the audience evaluates (the middle), as natural frequencies for risks (`P48`).

### B2. Repeat the thesis; admit a limit after the proof (A for repetition; B for the pratfall)

Repetition raises belief (`P50` Dechêne 2010), but it does not raise attention, and repeating a myth to debunk it can strengthen the myth. State the thesis in the same words at the open, the middle and the close, never inside the hook's first clause.

A disclosed minor flaw raises trust only after competence is established (Aronson 1966; Ein-Gar, Shiv & Tormala 2012). Put one honest boundary ("When not to use this: under 500 rows, use SQLite") in the last quarter, after the proof.

### B3. Social proof that does not backfire (B)

- Pair a descriptive norm with an approval cue ("Top quartile ✓"), or above-average users drift down (Schultz et al. 2007).
- Prefer proximal peers ("14 teams on your stack") to global totals (Goldstein et al. 2008).
- When adoption is still low, report the real trend, not the low share (Sparkman & Walton 2017).
- Every count and trend must be true (legal floor).

## Quick reference: what holds and what does not

| Lever | Status | Use |
|---|---|---|
| Endorsed default | A | Pre-select with a reason; never for a charge |
| Anchoring | A | Real reference values before the price |
| One all-in price | A + S | Always |
| Natural frequencies | A | All risk and probability copy |
| Narrative + one concrete scene | A | Emotional beats |
| Precise-number anchor | B | Credibility claims; round numbers when memorability matters |
| Daily-price framing | B | Petty-cash amounts only, with the billed total |
| Endowment loss frame | B | Reverse trial, truthfully, never blocking cancel |
| Decoy | B, often zero | Pure numeric 2-attribute tables only |
| Choice overload | B, average ≈ 0 | Cut options when complex, hard, uncertain or rushed |
| IKEA effect | B | Short, completable first build |
| "I don't" vs "I can't" | B (one study, N = 30 for persistence) | Optional wording for brand standards |
| "But you are free" | Weak (`P60` low-risk-of-bias studies: g = 0.11, CI crosses 0) | Optional; no expected lift on digital CTAs |
| Identity nouns ("be a builder") | Tier 3 for behavior (Gerber 2016 null) | Style only, no claimed lift |
| Fake urgency, fake reviews, pre-ticked paid boxes, cancel mazes | Dark patterns; unlawful under the laws listed in the legal floor, within their scope | Never |
