```html
<div class="rz-hero">
  <span class="rz-hero-eyebrow">{EYEBROW}</span>
  <h1 class="rz-hero-title">{HEADLINE}</h1>
  <p class="rz-hero-hand">{SUBHEAD}</p>
</div>

<style>
  /*
    Bebas Neue uppercase hero with a tracked Bebas eyebrow above and a Caveat
    hand-script tagline below. Three-face contrast in a single block — the
    zine register's signature opening move.
  */
  .rz-hero {
    background: var(--anchor-paper);
    padding: 60px;
    text-align: center;
  }
  .rz-hero-eyebrow {
    display: block;
    font-family: "Space Grotesk", sans-serif;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--brand-primary);
    margin-bottom: 16px;
  }
  .rz-hero-title {
    font-family: "Bebas Neue", sans-serif;
    font-weight: 400;
    font-size: clamp(48px, 10vw, 140px);
    line-height: 0.88;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--brand-primary);
    margin: 0;
  }
  .rz-hero-hand {
    font-family: "Caveat", cursive;
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 600;
    line-height: 1.3;
    color: var(--ink);
    margin: 20px 0 0;
  }
</style>
```
