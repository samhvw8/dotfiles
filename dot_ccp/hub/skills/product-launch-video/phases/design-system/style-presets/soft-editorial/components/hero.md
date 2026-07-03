```html
<div class="se-hero">
  <div class="se-hero-swatches" aria-hidden="true">
    <i class="se-hero-dot se-hero-dot-1"></i>
    <i class="se-hero-dot se-hero-dot-2"></i>
    <i class="se-hero-dot se-hero-dot-3"></i>
  </div>
  <div class="se-hero-stack">
    <span class="se-hero-kicker">{KICKER}</span>
    <h1 class="se-hero-display">{HEADLINE}</h1>
    <p class="se-hero-lede">{LEDE}</p>
  </div>
</div>
<style>
  /* Cover hero — Cormorant Garamond display headline, italic kicker above,
     supporting lede beneath, and a row of three pastel swatch discs in the
     top-right corner. The swatch row is the system's identity mark. */
  .se-hero {
    position: relative;
    padding: var(--gap-outer) 0;
    max-width: var(--measure-display);
  }
  .se-hero-stack {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
  .se-hero-kicker {
    font-style: italic;
    font-weight: 400;
    font-size: clamp(28px, 2.2vw, 40px);
    line-height: 1.2;
    color: color-mix(in srgb, var(--ink) 65%, transparent);
  }
  .se-hero-display {
    font-weight: 500;
    font-size: clamp(120px, 12vw, 232px);
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 0;
  }
  .se-hero-display em {
    font-weight: 400;
    font-style: italic;
  }
  .se-hero-lede {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-size: clamp(26px, 1.8vw, 32px);
    line-height: 1.45;
    max-width: var(--measure-body);
    color: color-mix(in srgb, var(--ink) 70%, transparent);
    margin: 0;
  }
  /* Swatch row — three pastel discs in the top-right of the cover.
     Rotates the three brand colors as paint chips, never as semantic roles. */
  .se-hero-swatches {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    gap: 14px;
  }
  .se-hero-dot {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-pill);
    display: block;
  }
  .se-hero-dot-1 {
    background: var(--brand-primary);
  }
  .se-hero-dot-2 {
    background: var(--brand-secondary);
  }
  .se-hero-dot-3 {
    background: var(--brand-accent);
  }
</style>
```
