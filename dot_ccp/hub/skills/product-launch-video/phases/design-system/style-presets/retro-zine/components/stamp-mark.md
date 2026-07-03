```html
<span class="rz-stamp-mark">{LABEL}</span>

<style>
  /*
    Hand-pressed approval / status stamp. Ink-black background, brand-primary
    text, 2px brand-primary border, rotated -8deg. Reserve for moments that
    earn a stamp ("CONTACT US", "SHIP IT", "JOIN US"). Overuse degrades the
    signal.

    NOTE: the green border is the system's single colored-border exception
    — all other borders are var(--ink). Don't generalize this elsewhere.
  */
  .rz-stamp-mark {
    display: inline-block;
    background: var(--ink);
    color: var(--brand-primary);
    font-family: "Bebas Neue", sans-serif;
    font-size: 26px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 24px;
    border: 2px solid var(--brand-primary);
    transform: rotate(var(--rot-stamp));
    /* Rotation is a STATIC signature — never animate it. */
  }
  /* Alt rotation for variety in dense compositions. */
  .rz-stamp-mark.alt {
    transform: rotate(var(--rot-stamp-alt));
  }
  /* Secondary stamp uses brand-secondary text/border. */
  .rz-stamp-mark.secondary {
    color: var(--brand-secondary);
    border-color: var(--brand-secondary);
  }
</style>
```
