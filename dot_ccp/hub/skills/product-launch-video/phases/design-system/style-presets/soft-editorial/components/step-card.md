```html
<!-- Step ordinals MUST be lowercase italic Roman numerals: i. / ii. / iii. / iv. / v.
     Arabic numbers break the editorial register — do not substitute "1." here. -->
<div class="se-step">
  <div class="se-step-num">i.</div>
  <div class="se-step-body">
    <h3 class="se-step-head">{HEADLINE}</h3>
    <p class="se-step-text">{LEDE}</p>
  </div>
</div>
<style>
  /* Method / process step card. Defaults to translucent white; swap fill to
     var(--brand-primary) / var(--brand-secondary) / var(--brand-accent) when
     a beat needs color (one color per card, rotating across the row). */
  .se-step {
    background: var(--surface-card);
    border-radius: 32px;
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    color: var(--ink);
    min-height: 360px;
  }
  .se-step-num {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-style: italic;
    font-weight: 500;
    font-size: clamp(56px, 6vw, 92px);
    line-height: 0.9;
    color: var(--ink);
    letter-spacing: -0.01em;
  }
  .se-step-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .se-step-head {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(28px, 2.8vw, 44px);
    line-height: 1.05;
    margin: 0;
    color: var(--ink);
  }
  .se-step-head em {
    font-weight: 400;
    font-style: italic;
  }
  .se-step-text {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.45;
    color: color-mix(in srgb, var(--ink) 70%, transparent);
    margin: 0;
  }
</style>
```
