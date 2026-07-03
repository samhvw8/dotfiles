```html
<!-- Editorial Forest quote-card: the big-idea statement moment. 140px display
     serif on brand-secondary (pink) surface, with a mono kicker above and a
     serif name + mono role byline below. This is the system's "statement"
     pattern — the most generous padding, the second-largest type tier. -->
<figure class="ef-quote-card">
  <span class="ef-quote-card-kicker">{KICKER}</span>
  <blockquote class="ef-quote-card-body">{QUOTE}</blockquote>
  <figcaption class="ef-quote-card-attrib">
    <div class="ef-quote-card-byline">
      <span class="ef-quote-card-name">{AUTHOR}</span>
      <span class="ef-quote-card-role">{LABEL}</span>
    </div>
    <span class="ef-quote-card-section">Section 02</span>
  </figcaption>
</figure>

<style>
  .ef-quote-card {
    box-sizing: border-box;
    background: var(--brand-secondary);
    color: var(--ef-green-deep);
    padding: 64px 80px;
    margin: 0;
    border-radius: var(--ef-radius-tile);
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-height: 380px;
  }
  .ef-quote-card-kicker {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: var(--ef-track-label);
    text-transform: uppercase;
    color: var(--ef-green-deep);
  }
  .ef-quote-card-body {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-weight: 500;
    font-size: 5.6vw;
    line-height: 1.02;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--ef-green-deep);
    max-width: 1560px;
  }
  .ef-quote-card-attrib {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    text-transform: uppercase;
    letter-spacing: var(--ef-track-caption);
    font-weight: 500;
    gap: 40px;
    color: var(--ef-green-deep);
  }
  .ef-quote-card-byline {
    display: flex;
    flex-direction: column;
    gap: 10px;
    white-space: nowrap;
  }
  .ef-quote-card-name {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 1.8vw;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
    line-height: 1;
    color: var(--ef-green-deep);
  }
</style>
```
