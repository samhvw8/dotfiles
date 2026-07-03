```html
<div class="se-soft-card">
  <h3 class="se-soft-card-head">{HEADLINE}</h3>
  <p class="se-soft-card-body">{LEDE}</p>
</div>
<style>
  /* Default container — translucent white card floating on the cream field.
     The cream bleeds through the 0.55-opacity fill and signals "lifted" without
     a shadow. Use this for any content that doesn't need pastel color.
     Border-radius lives in the 24-36px band; soft-editorial has no square corners. */
  .se-soft-card {
    background: var(--surface-card);
    border-radius: var(--radius-card-lg);
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    color: var(--ink);
  }
  .se-soft-card-head {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(40px, 4vw, 72px);
    line-height: 1;
    letter-spacing: -0.01em;
    margin: 0;
  }
  .se-soft-card-head em {
    font-weight: 400;
    font-style: italic;
  }
  .se-soft-card-body {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.5;
    color: color-mix(in srgb, var(--ink) 75%, transparent);
    max-width: 36ch;
    margin: 0;
  }
</style>
```
