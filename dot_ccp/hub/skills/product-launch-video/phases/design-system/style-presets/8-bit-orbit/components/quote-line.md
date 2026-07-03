```html
<figure class="bo-quote">
  <span class="bo-quote-mark">"</span>
  <blockquote class="bo-quote-body">{QUOTE}</blockquote>
  <span class="bo-quote-rule"></span>
  <figcaption class="bo-quote-author">{AUTHOR}</figcaption>
</figure>

<style>
  /*
    Customer quote callout. The "quote-line" of the source template is the
    short yellow rule between body and author — but in scene context the
    rule on its own isn't usable, so this component composes the full quote:
    oversized opening mark (Tektur, navy at 15% opacity, watermark-style),
    body (Chakra Petch), rule (4px brand-secondary with navy offset shadow),
    author byline (Space Mono).

    Default treatment is for LIGHT surfaces (brand-color or lavender ground).
    For dark surfaces, add class `on-dark` to the .bo-quote element — text
    flips to brand-primary, mark flips to brand-secondary @ 18% opacity.
  */
  .bo-quote {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
    padding: 48px 24px 24px;
    text-align: center;
  }
  .bo-quote-mark {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Tektur", sans-serif;
    font-size: 128px;
    line-height: 1;
    color: var(--canvas-navy);
    opacity: 0.15;
    pointer-events: none;
  }
  .bo-quote-body {
    position: relative;
    z-index: 1;
    margin: 0;
    font-family: "Chakra Petch", sans-serif;
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 500;
    line-height: 1.8;
    color: var(--canvas-navy);
  }
  .bo-quote-rule {
    display: block;
    width: 60px;
    height: 4px;
    margin: 24px auto 0;
    background: var(--brand-secondary);
    box-shadow: 4px 4px 0 var(--canvas-navy);
  }
  .bo-quote-author {
    margin-top: 20px;
    font-family: "Space Mono", monospace;
    font-size: 24px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--canvas-navy);
    opacity: 0.7;
  }
  .bo-quote.on-dark .bo-quote-mark {
    color: var(--brand-secondary);
    opacity: 0.18;
  }
  .bo-quote.on-dark .bo-quote-body,
  .bo-quote.on-dark .bo-quote-author {
    color: var(--brand-primary);
  }
  .bo-quote.on-dark .bo-quote-rule {
    background: var(--brand-secondary);
    box-shadow: 4px 4px 0 var(--canvas-void);
  }
</style>
```
