```html
<!--
  Generic color-block card — the workhorse container outside the tablet
  doctrine. 22-26px rounded fill (paper default; brand variants below) holding
  an uppercase stencil headline, an optional stencil meta line (32px stencil
  heavy meta-headline for stat-style emphasis), and an Inter body.
  Use this when a slot needs a card but does NOT carry a numeral above its
  headline — that's the tablet's job. If the slot needs a numeral, switch to
  tablet.md / stat-counter.md / process-node.md instead.
-->
<div class="stn-feature-card">
  <h3 class="stn-feature-card-headline">{HEADLINE}</h3>
  <div class="stn-feature-card-meta">{LEDE}</div>
  <p class="stn-feature-card-body">{SUBHEAD}</p>
</div>

<style>
  .stn-feature-card {
    background: var(--surface-paper);
    color: var(--ink);
    border-radius: var(--radius-card);
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 320px;
  }
  .stn-feature-card-headline {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 30px;
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    border-bottom: var(--rule-divider);
    padding-bottom: 12px;
    margin: 0;
    color: inherit;
  }
  /*
    Optional stencil meta line. Use for big-number-style emphasis inside
    the card (e.g. "$4.1M projected retained ARR"). Drop the element if the
    slot doesn't need it.
  */
  .stn-feature-card-meta {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 32px;
    line-height: 1.1;
    text-transform: uppercase;
    color: inherit;
  }
  .stn-feature-card-body {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    color: inherit;
  }

  /* Variants. */
  .stn-feature-card.primary {
    background: var(--brand-primary);
  }
  .stn-feature-card.secondary {
    background: var(--brand-secondary);
  }
  .stn-feature-card.accent {
    background: var(--brand-accent);
    color: var(--anchor-bone);
  }
  .stn-feature-card.bone {
    background: var(--surface-bone);
  }
  .stn-feature-card.ink {
    background: var(--ink);
    color: var(--anchor-bone);
  }
  .stn-feature-card.on-dark {
    color: var(--anchor-bone);
  }
</style>
```
