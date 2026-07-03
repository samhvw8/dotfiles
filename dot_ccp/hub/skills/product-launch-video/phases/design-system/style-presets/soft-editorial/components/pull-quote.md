```html
<div class="se-quote">
  <div class="se-quote-mark" aria-hidden="true">&ldquo;</div>
  <blockquote class="se-quote-body">{QUOTE}</blockquote>
  <div class="se-quote-attr">{AUTHOR}</div>
</div>
<style>
  /* Pull-quote — large italic quote-mark in a pastel color above a centered
     serif blockquote. The quote-mark color is its own signal — soft pastel,
     never ink. Defaults to brand-secondary; if brand DNA puts the warmest
     color on brand-primary, swap accordingly so the mark reads as a soft
     decorative wash, not a high-contrast accent. */
  .se-quote {
    padding: 48px 0;
    max-width: 28ch;
    margin: 0 auto;
    text-align: center;
    color: var(--ink);
  }
  .se-quote-mark {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-style: italic;
    font-weight: 500;
    font-size: clamp(140px, 14vw, 220px);
    line-height: 0.7;
    color: var(--brand-secondary);
    margin-bottom: 12px;
  }
  .se-quote-body {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(48px, 6vw, 88px);
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin: 0;
    color: var(--ink);
  }
  .se-quote-body em {
    font-weight: 400;
    font-style: italic;
  }
  .se-quote-attr {
    margin-top: 48px;
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 500;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.3;
    color: var(--ink);
  }
</style>
```
