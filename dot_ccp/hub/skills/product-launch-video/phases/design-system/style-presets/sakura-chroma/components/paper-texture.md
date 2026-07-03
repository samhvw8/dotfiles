```html
<div class="sk-paper-texture"></div>

<style>
  /*
    4px-period halftone-dot paper-grain texture overlay. Required on every
    scene at 16% opacity. The foundational textural ground that makes every
    flat color block read as ink on paper. Removing it breaks the print
    register immediately — the deck stops looking like a cassette page and
    starts looking like a flat web template.

    Phase 4b: MUST stay static. Animating the grain reveals the deterministic
    radial-gradient tile and looks broken. Sit it ABOVE the canvas color
    fill but BELOW all content (z-index: 1).
  */
  .sk-paper-texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-image: var(--paper-grain);
    background-size: var(--paper-grain-size);
    opacity: var(--paper-grain-opacity);
    mix-blend-mode: multiply;
  }
</style>
```
