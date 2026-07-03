```html
<div class="se-action">
  <div class="se-action-tag">{KICKER}</div>
  <h2 class="se-action-headline">{HEADLINE}</h2>
</div>
<style>
  /* Lemon-yellow callout band (24px rounded card) running across the top of a
     content slide — soft-editorial's "loud" moment, much quieter than a
     conventional CTA bar. A tag separator (italic serif) sits left of a serif
     headline with a 1px ink hairline between them. Defaults to brand-secondary
     fill so the brightest pastel carries the band; swap if brand DNA flips
     the warmest/brightest mapping. */
  .se-action {
    background: var(--brand-secondary);
    border-radius: var(--radius-card-sm);
    padding: 24px 36px;
    display: flex;
    align-items: center;
    gap: 24px;
    color: var(--ink);
  }
  .se-action-tag {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(26px, 1.8vw, 32px);
    line-height: 1.2;
    color: var(--ink);
    flex-shrink: 0;
    border-right: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
    padding-right: 24px;
  }
  .se-action-headline {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(34px, 2.8vw, 48px);
    line-height: 1.15;
    letter-spacing: -0.005em;
    margin: 0;
    color: var(--ink);
  }
  .se-action-headline em {
    font-weight: 400;
    font-style: italic;
  }
</style>
```
