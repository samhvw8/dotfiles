```html
<div class="cm-hero">
  <div class="cm-hero-tagline"><span class="cm-hero-rule"></span>{KICKER}</div>
  <h1 class="cm-hero-title">
    <span class="cm-hero-row">{HEADLINE}</span>
    <span class="cm-hero-row cm-hero-row-accent">{SUBHEAD}</span>
  </h1>
</div>

<style>
  .cm-hero {
    position: relative;
    background: var(--canvas);
    color: var(--ink);
    padding: var(--gap-content) var(--gap-content);
    min-height: 60vh;
  }
  .cm-hero-tagline {
    font-family: "JetBrains Mono", monospace;
    font-size: 1.25vw;
    letter-spacing: var(--mono-track-loose);
    text-transform: uppercase;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 0.95vw;
    margin-bottom: 2.5vw;
  }
  .cm-hero-rule {
    display: inline-block;
    width: 3.1vw;
    height: 3px;
    background: var(--ink);
  }
  .cm-hero-title {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 8.3vw;
    line-height: var(--display-leading);
    letter-spacing: var(--display-track);
    text-transform: uppercase;
    margin: 0;
    color: var(--ink);
  }
  .cm-hero-row {
    display: block;
  }
  .cm-hero-row-accent {
    color: var(--brand-accent);
  }
</style>
```
