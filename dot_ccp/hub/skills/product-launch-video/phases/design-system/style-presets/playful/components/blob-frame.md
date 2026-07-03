```html
<div class="pf-blob-frame">
  <span class="pf-blob-fill"></span>
</div>

<style>
  /*
    Outlined organic blob with a solid charcoal blob-fill nested inside. Used
    as a portrait stand-in or decorative anchor. The frame uses one asymmetric
    radius (organic), the fill uses a different asymmetric radius so the two
    shapes don't echo each other — reinforces hand-drawn feel. Variant
    .pebble swaps the frame's radius to the pebble (extreme alternating
    long/short) shape.
  */
  .pf-blob-frame {
    position: relative;
    width: 280px;
    height: 320px;
    border: var(--border-stroke);
    border-radius: var(--radius-blob-organic);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-1deg);
  }
  .pf-blob-frame.pebble {
    border-radius: var(--radius-blob-pebble);
    transform: rotate(0.5deg);
  }
  .pf-blob-fill {
    width: 64%;
    height: 62%;
    background: var(--ink);
    border-radius: var(--radius-blob-fill);
    display: block;
  }
  /* Brand-primary variant of the fill — reserve for one anchor scene. */
  .pf-blob-frame.brand .pf-blob-fill {
    background: var(--brand-primary);
  }
</style>
```
