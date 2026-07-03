```html
<!--
  Section-divider signature. A 540px stencil numeral sits on a dark (ink) field,
  paired with a small Barlow eyebrow at top-right and a 120px stencil headline
  at bottom-right. The mega-numeral IS the layout — emptiness around it is the
  composition, not a gap to fill.
  Hard rule: this pattern lives on dark fields only. A 540px numeral on a light
  field breaks the section-divider register.
-->
<div class="stn-section-num-block">
  <div class="stn-section-num">{NUM}</div>
  <div class="stn-section-eyebrow">{KICKER}</div>
  <h2 class="stn-section-headline">{HEADLINE}</h2>
</div>

<style>
  .stn-section-num-block {
    position: relative;
    background: var(--ink);
    color: var(--anchor-bone);
    padding: 110px 64px 130px;
    min-height: 720px;
    overflow: hidden;
  }
  .stn-section-num {
    position: absolute;
    left: 64px;
    top: 110px;
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(280px, 38vw, 540px);
    line-height: 0.8;
    letter-spacing: var(--track-stencil-tight);
    color: var(--brand-primary);
  }
  .stn-section-eyebrow {
    position: absolute;
    right: 64px;
    top: 220px;
    text-align: right;
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 800;
    font-size: 24px;
    letter-spacing: var(--track-eyebrow);
    text-transform: uppercase;
    color: var(--anchor-bone);
    opacity: 0.7;
    max-width: 24ch;
    line-height: 1.2;
  }
  .stn-section-headline {
    position: absolute;
    right: 64px;
    bottom: 130px;
    left: 360px;
    text-align: right;
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(64px, 9vw, 120px);
    line-height: 0.92;
    letter-spacing: var(--track-stencil-headline);
    text-transform: uppercase;
    color: var(--anchor-bone);
    margin: 0;
  }
  /* em-highlight inside section headline flips to brand-primary to echo the numeral. */
  .stn-section-headline em {
    font-style: normal;
    color: var(--brand-primary);
  }

  /* Color variants: swap the dominant brand color carrying numeral + em-highlight. */
  .stn-section-num-block.secondary .stn-section-num,
  .stn-section-num-block.secondary .stn-section-headline em {
    color: var(--brand-secondary);
  }
  .stn-section-num-block.accent .stn-section-num,
  .stn-section-num-block.accent .stn-section-headline em {
    color: var(--brand-accent);
  }
</style>
```
