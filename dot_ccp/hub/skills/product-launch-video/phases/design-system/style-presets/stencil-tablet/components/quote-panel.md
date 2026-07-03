```html
<!--
  Large saturated-brand-color panel filling most of the slide. Bowlby One
  carries the 320px quote-mark glyph (the ONE place that face appears — see
  §A); the quote body runs in Stardos Stencil at 60px (the only place stencil
  is used at weight 400 rather than 700 — the lighter italic-leaning weight
  reads as "quoted speech").
  Default fill is brand-secondary (system's loudest warm — magenta-equivalent);
  variants flip to brand-primary or brand-accent.
-->
<div class="stn-quote-panel">
  <div class="stn-quote-panel-mark">&ldquo;</div>
  <div class="stn-quote-panel-text">
    <blockquote class="stn-quote-panel-body">{QUOTE}</blockquote>
    <div class="stn-quote-panel-who">{AUTHOR}</div>
  </div>
</div>

<style>
  .stn-quote-panel {
    background: var(--brand-secondary);
    color: var(--ink);
    border-radius: var(--radius-tablet);
    padding: 60px 80px;
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 60px;
    align-items: center;
    min-height: 480px;
  }
  .stn-quote-panel-mark {
    font-family: "Bowlby One", "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(180px, 22vw, 320px);
    line-height: 0.8;
    color: var(--ink);
  }
  .stn-quote-panel-body {
    margin: 0;
    font-family: "Stardos Stencil", serif;
    font-weight: 400;
    font-size: clamp(36px, 4.5vw, 60px);
    line-height: 1.05;
    letter-spacing: var(--track-stencil-headline);
    color: var(--ink);
  }
  .stn-quote-panel-who {
    margin-top: 32px;
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 800;
    font-size: 26px;
    letter-spacing: var(--track-chrome-loose);
    text-transform: uppercase;
    color: var(--ink);
  }

  /* Variants. */
  .stn-quote-panel.primary {
    background: var(--brand-primary);
  }
  .stn-quote-panel.accent {
    background: var(--brand-accent);
    color: var(--anchor-bone);
  }
  .stn-quote-panel.accent .stn-quote-panel-mark,
  .stn-quote-panel.accent .stn-quote-panel-body,
  .stn-quote-panel.accent .stn-quote-panel-who {
    color: var(--anchor-bone);
  }
  /* on-dark inversion for ink / near-black fills (rare, used on stat-section
     pairings). */
  .stn-quote-panel.on-dark {
    background: var(--ink);
    color: var(--anchor-bone);
  }
  .stn-quote-panel.on-dark .stn-quote-panel-mark,
  .stn-quote-panel.on-dark .stn-quote-panel-body,
  .stn-quote-panel.on-dark .stn-quote-panel-who {
    color: var(--anchor-bone);
  }
</style>
```
