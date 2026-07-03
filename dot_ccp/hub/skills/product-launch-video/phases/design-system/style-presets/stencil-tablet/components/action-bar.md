```html
<!--
  Mustard-style callout bar running near the top of a slide. Contains a left
  Barlow Condensed tag, a 2px ink vertical separator, and a 34px stencil
  headline. Used for important section-opening callouts ("ACTION TITLE · 05").
  Default fill is brand-primary (per the brand-primary = most-used-accent role);
  swap to .secondary / .accent / .paper if narrative beat demands.
-->
<div class="stn-action-bar">
  <span class="stn-action-bar-tag">{KICKER}</span>
  <h2 class="stn-action-bar-headline">{HEADLINE}</h2>
</div>

<style>
  .stn-action-bar {
    background: var(--brand-primary);
    color: var(--ink);
    border-radius: var(--radius-card);
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 28px;
  }
  .stn-action-bar-tag {
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 800;
    font-size: 24px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    flex-shrink: 0;
    padding-right: 28px;
    border-right: var(--rule-divider);
    color: inherit;
  }
  .stn-action-bar-headline {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(26px, 2.5vw, 34px);
    line-height: 1.15;
    letter-spacing: var(--track-stencil-headline);
    text-transform: uppercase;
    margin: 0;
    color: inherit;
  }

  /* Variants */
  .stn-action-bar.secondary {
    background: var(--brand-secondary);
  }
  .stn-action-bar.accent {
    background: var(--brand-accent);
  }
  .stn-action-bar.paper {
    background: var(--surface-paper);
  }
  /* on-dark inversion (text + separator switch to bone). */
  .stn-action-bar.on-dark {
    color: var(--anchor-bone);
  }
  .stn-action-bar.on-dark .stn-action-bar-tag {
    border-right-color: var(--anchor-bone);
  }
</style>
```
