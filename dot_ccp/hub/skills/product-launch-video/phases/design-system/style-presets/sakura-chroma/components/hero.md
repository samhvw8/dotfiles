```html
<div class="sk-hero">
  <span class="sk-hero-eyebrow">{EYEBROW}</span>
  <h1 class="sk-hero-text">{HEADLINE}</h1>
  <p class="sk-hero-tagline">{SUBHEAD}</p>
</div>

<style>
  /*
    Cassette-cover hero: Big Shoulders Display 900 with negative tracking,
    tracked-caps eyebrow in red above. Sits on warm cream paper, no shadow
    on the type itself (the cream + ink does the work). Inline <em> inside
    the headline should color-shift to var(--sk-red) — Phase 4b should wrap
    one keyword in <em> to land the emphasis color.
  */
  .sk-hero {
    background: var(--anchor-paper);
    padding: clamp(36px, 4vh, 64px) clamp(36px, 3.6vw, 72px);
    position: relative;
  }
  .sk-hero-eyebrow {
    display: block;
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--sk-red);
    margin-bottom: clamp(16px, 2vh, 28px);
  }
  .sk-hero-text {
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(70px, min(8.4vw, 14vh), 168px);
    line-height: 0.86;
    letter-spacing: -0.022em;
    color: var(--anchor-ink);
    margin: 0;
  }
  .sk-hero-text em {
    color: var(--sk-red);
    font-style: normal; /* the color shift IS the emphasis */
  }
  .sk-hero-tagline {
    font-family: "Albert Sans", sans-serif;
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.5;
    color: var(--anchor-ink);
    opacity: 0.92;
    margin: clamp(20px, 2.4vh, 32px) 0 0;
    max-width: 56ch;
  }
</style>
```
