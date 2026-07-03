```html
<div class="pf-vertical-spine">{LABEL}</div>

<style>
  /*
    Magazine-spine label. Syne 700 text at 1.5rem rotated 90deg, anchored to
    the right edge of a hero or chapter scene. The only element that rotates
    beyond ±3deg — the 90deg anchor is the intended pose, not a tilt. Use
    sparingly: reserved for hero / chapter / cover beats; never on content scenes.
  */
  .pf-vertical-spine {
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    font-family: "Syne", sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink);
    white-space: nowrap;
  }
</style>
```
