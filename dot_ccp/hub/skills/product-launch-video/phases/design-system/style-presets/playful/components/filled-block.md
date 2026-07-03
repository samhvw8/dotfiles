```html
<div class="pf-filled-block">
  <div class="pf-filled-block-num">{KICKER}</div>
  <div class="pf-filled-block-title">{HEADLINE}</div>
  <div class="pf-filled-block-body">{SUBHEAD}</div>
</div>

<style>
  /*
    Inverted card — charcoal ground, warm-paper text. The system's emphasis
    device; reserve for ONE cell per scene (or ONE scene per video as the
    anchor moment). Pairs against outlined rough-box cards as a high-contrast
    counterpoint. Still carries a small micro-tilt and the offset ghost border —
    here the ghost border is the same ink color, so it reads as a soft echo
    rather than a doubled outline.
  */
  .pf-filled-block {
    position: relative;
    background: var(--ink);
    color: var(--anchor-peach);
    padding: var(--pad-card);
    border: var(--border-stroke);
    transform: rotate(0.8deg);
  }
  .pf-filled-block::before {
    content: "";
    position: absolute;
    top: var(--offset-ghost);
    left: var(--offset-ghost);
    right: calc(-1 * var(--offset-ghost));
    bottom: calc(-1 * var(--offset-ghost));
    border: var(--border-stroke-thin);
    z-index: -1;
    pointer-events: none;
  }
  .pf-filled-block-num {
    font-family: "Syne", sans-serif;
    font-weight: 800;
    font-size: 2.75rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--anchor-peach);
    margin-bottom: 0.5rem;
  }
  .pf-filled-block-title {
    font-family: "Syne", sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--anchor-peach);
    margin-bottom: 0.5rem;
  }
  .pf-filled-block-body {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--anchor-peach);
    opacity: 0.85;
  }
</style>
```
