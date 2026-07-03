```html
<!--
  Step card that carries narrative beat ("step 1 / step 2 / step 3" in a
  process diagram). 64px stencil ordinal at top, 28px stencil h3, small Inter
  body. Each step takes a different accent fill — siblings cycle through brand
  variants so a 5-up row reads as a tile sequence.
-->
<div class="stn-process-node">
  <div class="stn-process-node-ord">{NUM}</div>
  <h3 class="stn-process-node-headline">{HEADLINE}</h3>
  <p class="stn-process-node-body">{SUBHEAD}</p>
</div>

<style>
  .stn-process-node {
    background: var(--brand-primary);
    color: var(--ink);
    border-radius: var(--radius-card);
    padding: 24px 22px 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    min-height: 320px;
  }
  .stn-process-node-ord {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 64px;
    line-height: 0.9;
    letter-spacing: var(--track-stencil-tight);
  }
  .stn-process-node-headline {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 28px;
    line-height: 1.05;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0;
    color: inherit;
  }
  .stn-process-node-body {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    color: inherit;
  }

  /* Step-color cycle. The 5-up grid in template.html cycles
     sienna/magenta/orange/teal/blue — we map to a brand-primary →
     brand-secondary → brand-accent → on-dark cycle. */
  .stn-process-node.secondary {
    background: var(--brand-secondary);
  }
  .stn-process-node.accent {
    background: var(--brand-accent);
  }
  .stn-process-node.on-dark {
    color: var(--anchor-bone);
  }
  .stn-process-node.paper {
    background: var(--surface-paper);
  }
  .stn-process-node.bone {
    background: var(--surface-bone);
  }
</style>
```
