```html
<div class="rz-card-offset">
  <div class="rz-card-offset-title">{HEADLINE}</div>
  <p class="rz-card-offset-hand">{SUBHEAD}</p>
  <p class="rz-card-offset-body">{LEDE}</p>
</div>

<style>
  /*
    Signature paper-on-paper depth move. A solid brand-primary slab sits 12px
    down-and-right behind a cream card via a ::before pseudo-element. The
    visual effect is a layered paper underprint — a colored shadow without
    using box-shadow. Parent must not clip overflow.

    Used on hero callouts, RSVP-style cards, primary CTAs. NEVER pair with
    a box-shadow — paper-offset and blurred shadow break the print register.
  */
  .rz-card-offset {
    position: relative;
    background: var(--anchor-cream);
    border: var(--border-thick);
    padding: var(--pad-card-lg);
    /* Allow ::before slab to extend down-right */
    margin-right: var(--offset-slab);
    margin-bottom: var(--offset-slab);
  }
  .rz-card-offset::before {
    content: "";
    position: absolute;
    top: var(--offset-slab);
    left: var(--offset-slab);
    right: calc(-1 * var(--offset-slab));
    bottom: calc(-1 * var(--offset-slab));
    background: var(--offset-slab-color);
    z-index: -1;
  }
  /* Variants flip the slab color. */
  .rz-card-offset.secondary::before {
    background: var(--brand-secondary);
  }
  .rz-card-offset.ink::before {
    background: var(--ink);
  }
  .rz-card-offset-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(42px, 6vw, 80px);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--brand-primary);
    margin-bottom: 8px;
  }
  .rz-card-offset-hand {
    font-family: "Caveat", cursive;
    font-size: clamp(30px, 3vw, 40px);
    font-weight: 600;
    line-height: 1.3;
    color: var(--ink);
    margin: 0 0 24px;
  }
  .rz-card-offset-body {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(24px, 1.8vw, 28px);
    line-height: 1.7;
    color: var(--ink);
    margin: 0;
  }
</style>
```
