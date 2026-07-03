```html
<!--
  Stencil stat numeral with a Barlow Condensed superscript suffix and a stencil
  caption below. Sits on a saturated brand fill in a 22px-radius card. The
  superscript is non-optional for unit suffixes (% / × / K / M) — it lives at
  40px / weight 800 / vertical-align top beside the 160px stencil numeral.
  Phase 4b: animate the numeral with steps(6) emphasis ease (see §E RULE).
-->
<div class="stn-stat-counter">
  <div class="stn-stat-counter-num">{NUM}<small class="stn-stat-counter-suffix">%</small></div>
  <h3 class="stn-stat-counter-headline">{HEADLINE}</h3>
  <p class="stn-stat-counter-body">{SUBHEAD}</p>
</div>

<style>
  .stn-stat-counter {
    background: var(--brand-primary);
    color: var(--ink);
    border-radius: var(--radius-card);
    padding: 32px 30px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 360px;
  }
  .stn-stat-counter-num {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(96px, 12vw, 160px);
    line-height: 0.85;
    letter-spacing: var(--track-stencil-tight);
  }
  .stn-stat-counter-suffix {
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 800;
    font-size: 40px;
    vertical-align: top;
    margin-left: 6px;
    letter-spacing: 0;
  }
  .stn-stat-counter-headline {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 26px;
    line-height: 1.05;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: auto 0 0;
    color: inherit;
  }
  .stn-stat-counter-body {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    color: inherit;
  }

  /* Variants — match tablet's variant family. */
  .stn-stat-counter.secondary {
    background: var(--brand-secondary);
  }
  .stn-stat-counter.accent {
    background: var(--brand-accent);
    color: var(--anchor-bone);
  }
  .stn-stat-counter.bone {
    background: var(--surface-bone);
  }
  .stn-stat-counter.paper {
    background: var(--surface-paper);
  }
  .stn-stat-counter.on-dark {
    color: var(--anchor-bone);
  }
</style>
```
