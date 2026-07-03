```html
<span class="rz-tape"></span>

<style>
  /*
    Translucent masking-tape rectangle layered over a collage composition at
    a sharp angle. Suggests physically taped-down paper. Always semi-
    transparent white, 1px hairline border at 10% opacity, sharp tilt.

    Position (top/left/right/bottom) and rotation are set by the consumer
    inline — e.g. <span class="rz-tape" style="top:12%; left:30%; transform:rotate(-25deg)"></span>
    The variants below provide common angles for quick composition.
  */
  .rz-tape {
    position: absolute;
    width: 80px;
    height: 24px;
    background: color-mix(in srgb, var(--anchor-cream) 40%, transparent);
    border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    /* Default tilt; variants override. Sharp angles only — tape is the one
       element allowed to break the ±8° rule (it's literally tape). */
    transform: rotate(-25deg);
    z-index: 10;
    pointer-events: none;
  }
  .rz-tape.cw {
    transform: rotate(35deg);
  }
  .rz-tape.gentle {
    transform: rotate(15deg);
  }
  .rz-tape.steep {
    transform: rotate(-40deg);
  }
</style>
```
