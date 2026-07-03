```html
<!--
  The system's namesake container. A 22-26px rounded card holding a giant
  stencil numeral above a stencil headline above Inter body. The numeral
  fills the upper half of the card; the headline and body sit at the bottom
  via margin-top: auto. Variants below select tile fill (.primary / .secondary
  / .accent / .paper) — text color follows the surface via the .on-dark modifier.
  A tablet without a numeral is NOT a tablet; it's a generic card.
-->
<div class="stn-tablet">
  <div class="stn-tablet-num">{NUM}</div>
  <h3 class="stn-tablet-headline">{HEADLINE}</h3>
  <p class="stn-tablet-body">{SUBHEAD}</p>
</div>

<style>
  .stn-tablet {
    border-radius: var(--radius-tablet);
    padding: var(--pad-card-tablet);
    background: var(--brand-primary);
    color: var(--ink);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    min-height: 480px;
  }
  .stn-tablet-num {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(120px, 16vw, 220px);
    line-height: 0.9;
    letter-spacing: var(--track-stencil-tight);
    color: var(--ink);
  }
  .stn-tablet-headline {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(24px, 2.2vw, 30px);
    line-height: 1.05;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-top: auto;
    margin-bottom: 14px;
    color: inherit;
  }
  .stn-tablet-body {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    color: inherit;
  }

  /* Tile-fill variants. Default is brand-primary. */
  .stn-tablet.secondary {
    background: var(--brand-secondary);
  }
  .stn-tablet.accent {
    background: var(--brand-accent);
  }
  .stn-tablet.paper {
    background: var(--surface-paper);
  }
  .stn-tablet.bone {
    background: var(--surface-bone);
  }
  .stn-tablet.ink {
    background: var(--ink);
    color: var(--anchor-bone);
  }
  .stn-tablet.ink .stn-tablet-num {
    color: var(--anchor-bone);
  }

  /*
    .on-dark forces bone-on-dark inversion (use on cool/dark brand fills:
    teal, blue, near-black). Body text never inverts to pure white — bone
    is the only off-light text color in the system.
  */
  .stn-tablet.on-dark {
    color: var(--anchor-bone);
  }
  .stn-tablet.on-dark .stn-tablet-num {
    color: var(--anchor-bone);
  }
</style>
```
