```html
<!-- Quote card: oversized Fredoka quote-mark in soft-pink sits above the
     quoted text. Quotes never appear in this system without the quote-mark
     anchor — it's the signature treatment. -->
<div class="dc-quote">
  <div class="dc-quote-mark" aria-hidden="true">&ldquo;</div>
  <p class="dc-quote-text">{QUOTE}</p>
  <p class="dc-quote-author">{AUTHOR}</p>
</div>

<style>
  .dc-quote {
    background: var(--canvas);
    border: var(--border-bold);
    border-radius: var(--radius-card-lg);
    padding: var(--pad-card-lg);
    box-shadow: var(--shadow-card);
    max-width: 40vw;
    text-align: center;
  }
  .dc-quote-mark {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 4rem;
    line-height: 1;
    color: color-mix(in srgb, var(--brand-secondary) 60%, var(--anchor-blush));
    margin-bottom: 0.4rem;
  }
  .dc-quote-text {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(30px, 3vw, 44px);
    line-height: 1.35;
    color: var(--ink);
    margin: 0 0 1rem;
  }
  .dc-quote-author {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: clamp(24px, 1.4vw, 26px);
    color: color-mix(in srgb, var(--ink) 60%, transparent);
    margin: 0;
  }
</style>
```
