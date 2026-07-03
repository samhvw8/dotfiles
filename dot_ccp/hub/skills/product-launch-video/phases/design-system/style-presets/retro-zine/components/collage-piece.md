```html
<div class="rz-collage-piece">
  <h3 class="rz-collage-piece-title">{HEADLINE}</h3>
  <p class="rz-collage-piece-hand">{SUBHEAD}</p>
</div>

<style>
  /*
    Free-positioned panel with a 3px ink border and a small tilt. Used in
    scatter-on-page compositions where 3-4 pieces overlap with tape pieces
    layered over the joints. Cycle backgrounds across pieces: brand-primary,
    cream, paper-dark, ink-inverted.

    Position (top/left/width/height) and tilt are set by the consumer —
    `.a / .b / .c / .d` variants provide background + rotation defaults.
  */
  .rz-collage-piece {
    position: absolute;
    background: var(--anchor-cream);
    border: var(--border-thick);
    padding: var(--pad-card-sm);
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Default tilt — override with the variant classes below. */
    transform: rotate(var(--rot-collage-c));
  }
  .rz-collage-piece-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(24px, 3vw, 42px);
    font-weight: 400;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--ink);
    margin: 0 0 8px;
    line-height: 0.95;
  }
  .rz-collage-piece-hand {
    font-family: "Caveat", cursive;
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 600;
    line-height: 1.3;
    color: var(--ink);
    margin: 0;
  }
  /* Variant A: brand-primary ground, cream text. */
  .rz-collage-piece.a {
    background: var(--brand-primary);
    transform: rotate(var(--rot-collage-a));
  }
  .rz-collage-piece.a .rz-collage-piece-title,
  .rz-collage-piece.a .rz-collage-piece-hand {
    color: var(--anchor-cream);
  }
  .rz-collage-piece.b {
    background: var(--anchor-cream);
    transform: rotate(var(--rot-collage-b));
  }
  /* Variant C: paper-dark, near-flat tilt. */
  .rz-collage-piece.c {
    background: var(--anchor-paper-dark);
    transform: rotate(var(--rot-collage-c));
  }
  /* Variant D: ink ground, paper text, brand-primary title. */
  .rz-collage-piece.d {
    background: var(--ink);
    transform: rotate(var(--rot-collage-d));
  }
  .rz-collage-piece.d .rz-collage-piece-title {
    color: var(--brand-primary);
  }
  .rz-collage-piece.d .rz-collage-piece-hand {
    color: var(--anchor-paper);
  }
</style>
```
