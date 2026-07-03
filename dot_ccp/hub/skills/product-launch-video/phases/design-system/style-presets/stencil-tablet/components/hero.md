```html
<!--
  Cover hero. Stencil display at 220px on bone field. Eyebrow above is Barlow
  Condensed uppercase with generous tracking; supporting line below is Inter
  sentence-case (the "quiet voice").
  Brand color appears ONLY in the em-highlight on the stencil hero — body
  remains ink so the loud/quiet typographic contrast holds.
-->
<div class="stn-hero">
  <span class="stn-hero-eyebrow">{EYEBROW}</span>
  <h1 class="stn-hero-display">{HEADLINE}</h1>
  <p class="stn-hero-body">{SUBHEAD}</p>
</div>

<style>
  .stn-hero {
    background: var(--surface-bone);
    padding: 96px 80px;
    position: relative;
  }
  .stn-hero-eyebrow {
    display: block;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: var(--track-eyebrow);
    text-transform: uppercase;
    color: color-mix(in srgb, var(--ink) 80%, transparent);
    margin-bottom: 40px;
  }
  .stn-hero-display {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: clamp(96px, 11vw, 220px);
    line-height: 0.82;
    letter-spacing: -0.015em;
    text-transform: uppercase;
    color: var(--ink);
    margin: 0;
  }
  /* em-highlight inside the stencil headline is the only place brand color
     appears on cover hero text. */
  .stn-hero-display em {
    font-style: normal;
    color: var(--brand-secondary);
  }
  .stn-hero-body {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    color: var(--ink);
    margin-top: 48px;
    max-width: 50ch;
  }
</style>
```
