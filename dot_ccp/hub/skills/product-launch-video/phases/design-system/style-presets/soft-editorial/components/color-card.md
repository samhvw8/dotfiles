```html
<div class="se-color-card">
  <div class="se-color-card-head">
    <h3 class="se-color-card-headline">{HEADLINE}</h3>
    <div class="se-color-card-sub">{SUBHEAD}</div>
  </div>
  <p class="se-color-card-body">{LEDE}</p>
</div>
<style>
  /* Saturated pastel card — pink/lemon/blush/sage/lilac fill in the source
     template. Here the fill rotates across the three brand colors; assign
     brand-secondary or brand-accent for variety in a card-grid scene.
     Text stays in ink on every pastel fill — never inverted. */
  .se-color-card {
    background: var(--brand-primary);
    border-radius: var(--radius-card-lg);
    padding: 64px 48px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    color: var(--ink);
    text-align: center;
    align-items: center;
  }
  .se-color-card-head {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .se-color-card-headline {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(44px, 5vw, 72px);
    line-height: 1;
    letter-spacing: -0.01em;
    margin: 0;
    white-space: nowrap;
  }
  .se-color-card-headline em {
    font-weight: 400;
    font-style: italic;
  }
  .se-color-card-sub {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 500;
    font-size: clamp(28px, 2vw, 34px);
    line-height: 1.1;
    color: var(--ink);
  }
  .se-color-card-body {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.45;
    max-width: 26ch;
    color: var(--ink);
    margin: 0;
  }
</style>
```
