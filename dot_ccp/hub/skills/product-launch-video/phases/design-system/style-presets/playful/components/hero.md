```html
<div class="pf-hero">
  <span class="pf-eyebrow">{EYEBROW}</span>
  <h1 class="pf-hero-title">{HEADLINE}</h1>
  <p class="pf-hero-sub">{SUBHEAD}</p>
</div>

<style>
  /*
    Studio-cover hero. Syne 800 title with negative tracking carries the voice;
    Space Grotesk eyebrow above + Space Grotesk subtitle below. No border, no
    shadow — the hero stands on type weight alone. Background falls through
    to the scene's --surface-paper (set on the scene container, not here).
  */
  .pf-hero {
    padding: 4rem 5rem;
    color: var(--ink);
    max-width: 70%;
  }
  .pf-eyebrow {
    display: block;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink);
    opacity: 0.7;
    margin-bottom: 2rem;
  }
  .pf-hero-title {
    font-family: "Syne", sans-serif;
    font-weight: 800;
    font-size: clamp(4rem, 10vw, 9rem);
    line-height: 0.9;
    letter-spacing: -0.03em;
    color: var(--ink);
    margin: 0 0 2rem;
  }
  .pf-hero-sub {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 1.6;
    color: var(--ink);
    opacity: 0.85;
    max-width: 50ch;
    margin: 0;
  }
</style>
```
