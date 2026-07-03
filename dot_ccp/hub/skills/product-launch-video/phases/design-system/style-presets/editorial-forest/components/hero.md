```html
<!-- Editorial Forest hero: cover-scale serif headline on brand-primary surface,
     mono topbar + mono footline framing it. The 220px display headline is the
     system's loudest typographic moment; reserve it for cover / closing only. -->
<div class="ef-hero">
  <div class="ef-hero-topbar">
    <span class="ef-hero-eyebrow">{EYEBROW}</span>
    <div class="ef-hero-mark">01</div>
  </div>
  <h1 class="ef-hero-display">{HEADLINE}</h1>
  <div class="ef-hero-footline">
    <span>{LEFT}</span>
    <span>{RIGHT}</span>
  </div>
</div>

<style>
  .ef-hero {
    box-sizing: border-box;
    width: 100%;
    min-height: 480px;
    padding: 60px 80px 80px;
    background: var(--brand-primary);
    color: var(--brand-secondary);
    position: relative;
    overflow: hidden;
    border-radius: var(--ef-radius-tile);
  }
  .ef-hero-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--brand-secondary);
  }
  .ef-hero-eyebrow {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: var(--ef-track-label);
    text-transform: uppercase;
    color: var(--brand-secondary);
  }
  .ef-hero-mark {
    width: var(--ef-monogram-size);
    height: var(--ef-monogram-size);
    border-radius: 50%;
    border: var(--ef-rule-weight) solid var(--brand-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.5vw;
    letter-spacing: 0.1em;
    font-weight: 500;
    color: var(--brand-secondary);
  }
  .ef-hero-display {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-weight: 500;
    font-size: 9.2vw;
    line-height: 0.92;
    letter-spacing: -0.02em;
    margin: 1.6vw 0 0 0;
    color: var(--brand-secondary);
  }
  .ef-hero-footline {
    position: absolute;
    bottom: 40px;
    left: 80px;
    right: 80px;
    display: flex;
    justify-content: space-between;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brand-secondary);
  }
</style>
```
