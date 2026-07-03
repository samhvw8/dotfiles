```html
<blockquote class="ed-quote">
  <p>{QUOTE}</p>
  <cite>— {AUTHOR}</cite>
</blockquote>
<style>
  .ed-quote {
    padding: 48px 0;
    max-width: var(--measure-narrow);
  }
  .ed-quote p {
    font-size: clamp(28px, 3vw, 44px);
    line-height: 1.25;
    font-style: italic;
    font-weight: 400;
  }
  .ed-quote cite {
    display: block;
    margin-top: 24px;
    font-size: 24px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-style: normal;
  }
</style>
```
