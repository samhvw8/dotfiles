```html
<!-- rotated-badge: small yellow-toned annotation badge at -4deg, signature
     to Creative Mode. Overlays a card or table to call out the "pick one". -->
<div class="cm-rotated-badge">{LABEL}</div>

<style>
  .cm-rotated-badge {
    display: inline-block;
    background: color-mix(in srgb, var(--brand-accent) 70%, var(--canvas));
    border: var(--border-structural);
    color: var(--ink);
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 1.45vw;
    text-transform: uppercase;
    padding: 0.7vw 1.15vw;
    transform: rotate(var(--tilt-badge));
    white-space: nowrap;
  }
</style>
```
