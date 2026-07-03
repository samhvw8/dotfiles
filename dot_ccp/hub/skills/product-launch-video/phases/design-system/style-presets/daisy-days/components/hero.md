```html
<!-- NOTE: Daisy Days hero — cream canvas, Fredoka headline sits flat without
     text-shadow. On a pastel surface, switch text color to white and add
     var(--shadow-text-bold). Ornaments live as siblings, behind the title-box
     on z-index:1. The "dc-" prefix is the preset namespace (daisy-cheer). -->
<div class="dc-hero">
  <span class="dc-hero-eyebrow">{EYEBROW}</span>
  <h1 class="dc-hero-display">{HEADLINE}</h1>
  <p class="dc-hero-subhead">{SUBHEAD}</p>
</div>

<style>
  .dc-hero {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: var(--pad-card-lg);
    max-width: 56vw;
  }
  .dc-hero-eyebrow {
    display: inline-block;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(24px, 1.5vw, 26px);
    letter-spacing: 0.02em;
    padding: 6px 18px;
    border-radius: var(--radius-pill);
    border: var(--border-bold);
    background: color-mix(in srgb, var(--brand-secondary) 35%, var(--anchor-butter));
    color: var(--ink);
    margin-bottom: 0.8rem;
    box-shadow: var(--shadow-small);
  }
  .dc-hero-display {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(3rem, 6.5vw, 5.8rem);
    line-height: 1.05;
    letter-spacing: 0.02em;
    color: var(--ink);
    margin: 0.4rem 0 0.6rem;
  }
  .dc-hero-subhead {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(28px, 1.8vw, 34px);
    line-height: 1.45;
    color: color-mix(in srgb, var(--ink) 70%, transparent);
    max-width: 42ch;
    margin: 0 auto;
  }
</style>
```
