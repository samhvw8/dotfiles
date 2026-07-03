```html
<div class="pf-step-node">
  <div class="pf-step-node-circle">
    <!-- Cycle the digit 1/2/3/4/5 per instance in a process / timeline sequence. -->
    1
  </div>
  <div class="pf-step-node-title">{HEADLINE}</div>
  <div class="pf-step-node-desc">{SUBHEAD}</div>
</div>

<style>
  /*
    Numbered process / timeline step. A 64px round outlined node with a Syne
    800 digit, then a Syne 700 step title and Space Grotesk caption beneath.
    The node alternates between outlined (transparent fill, ink digit) and
    .filled (ink fill, peach digit) across siblings — odd outlined, even filled,
    or any consistent alternating pattern.
  */
  .pf-step-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 180px;
    color: var(--ink);
  }
  .pf-step-node-circle {
    width: 64px;
    height: 64px;
    border: var(--border-stroke);
    border-radius: 50%;
    background: transparent; /* warm scene surface shows through */
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Syne", sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--ink);
    margin-bottom: 1.5rem;
  }
  .pf-step-node.filled .pf-step-node-circle {
    background: var(--ink);
    color: var(--anchor-peach);
  }
  .pf-step-node-title {
    font-family: "Syne", sans-serif;
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }
  .pf-step-node-desc {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--ink);
    opacity: 0.7;
  }
</style>
```
