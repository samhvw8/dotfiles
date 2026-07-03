```html
<div class="pf-rough-box">
  <div class="pf-rough-box-num">{KICKER}</div>
  <div class="pf-rough-box-title">{HEADLINE}</div>
  <div class="pf-rough-box-body">{SUBHEAD}</div>
</div>

<style>
  /*
    The signature card — 3px charcoal border + a 6px offset ghost border via
    ::before. The offset border has no fill; the warm canvas shows through.
    This pseudo-element IS the system's elevation device. Carries a small
    rotation; alternate sign across siblings in the scene (don't all rotate
    the same direction).
  */
  .pf-rough-box {
    position: relative;
    background: transparent; /* warm scene surface shows through */
    border: var(--border-stroke);
    padding: var(--pad-card);
    color: var(--ink);
    transform: rotate(-0.5deg);
  }
  .pf-rough-box::before {
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
  .pf-rough-box-num {
    font-family: "Syne", sans-serif;
    font-weight: 800;
    font-size: 2.75rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }
  .pf-rough-box-title {
    font-family: "Syne", sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }
  .pf-rough-box-body {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--ink);
    opacity: 0.85;
  }
</style>
```
