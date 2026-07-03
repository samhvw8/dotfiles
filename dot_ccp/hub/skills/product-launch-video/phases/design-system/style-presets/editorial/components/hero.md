```html
<div class="ed-hero">
  <span class="ed-kicker">{KICKER}</span>
  <h1 class="ed-display">{HEADLINE}</h1>
  <p class="ed-lede">{LEDE}</p>
</div>
<style>
  .ed-hero {
    padding: var(--gap-quiet) 0;
    max-width: var(--measure-wide);
  }
  .ed-kicker {
    font-size: clamp(24px, 1.6vw, 28px);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--ink-soft, var(--ink));
  }
  .ed-display {
    font-size: clamp(120px, 14vw, 220px);
    letter-spacing: -0.02em;
    font-weight: 400;
    line-height: 1.02;
    margin-top: 24px;
  }
  .ed-lede {
    font-size: clamp(26px, 2vw, 34px);
    line-height: 1.55;
    max-width: var(--measure-narrow);
    margin-top: 36px;
    color: var(--ink-soft, var(--ink));
  }
</style>
```
