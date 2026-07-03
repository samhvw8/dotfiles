```html
<div class="bo-hero">
  <span class="bo-eyebrow">{EYEBROW}</span>
  <h1 class="bo-hero-text">{HEADLINE}</h1>
  <p class="bo-hero-tagline">{SUBHEAD}</p>
</div>

<style>
  .bo-hero {
    background: var(--canvas-void);
    padding: 64px 56px;
    position: relative;
  }
  .bo-eyebrow {
    display: block;
    font-family: "Space Mono", monospace;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--brand-secondary);
    margin-bottom: 24px;
  }
  .bo-hero-text {
    font-family: "Tektur", cursive;
    font-weight: 900;
    font-size: clamp(48px, 10vw, 128px);
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--brand-primary);
    text-shadow: var(--shadow-pixel-text);
    margin: 0;
  }
  .bo-hero-tagline {
    font-family: "Chakra Petch", sans-serif;
    font-size: clamp(25px, 1.8vw, 30px);
    font-weight: 400;
    line-height: 1.8;
    color: var(--ink);
    opacity: 0.85;
    margin-top: 32px;
    max-width: 50ch;
  }
</style>
```
