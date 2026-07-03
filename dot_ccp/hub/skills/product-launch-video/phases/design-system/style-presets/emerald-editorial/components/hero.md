```html
<!-- Emerald Editorial cover hero: "The X / of / Y" playbill framing.
     The connector word ("of") is hardcoded — replace per-scene if needed.
     Class prefix: ee- (emerald-editorial). -->
<div class="ee-hero">
  <div class="ee-hero-the">The</div>
  <div class="ee-hero-big">{HEADLINE}</div>

  <div class="ee-hero-ornament">
    <span class="ee-hero-rule"></span>
    <span class="ee-hero-of">of</span>
    <span class="ee-hero-rule"></span>
  </div>

  <div class="ee-hero-big">{SUBHEAD}</div>

  <div class="ee-hero-credit">{LABEL}</div>
</div>

<style>
  .ee-hero {
    width: 100%;
    background: var(--canvas);
    color: var(--ink);
    padding: var(--ee-pad-cover) var(--ee-pad-default);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    font-family: "Manrope", sans-serif;
  }
  .ee-hero-the {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 76px;
    line-height: 1;
    margin-bottom: -2px;
  }
  .ee-hero-big {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: 184px;
    line-height: 0.92;
    letter-spacing: -0.01em;
    text-transform: none;
  }
  .ee-hero-ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    width: 100%;
    max-width: 1400px;
  }
  .ee-hero-rule {
    flex: 1;
    height: 22px;
    position: relative;
  }
  .ee-hero-rule::before,
  .ee-hero-rule::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: var(--ee-rule-weight-cover);
    background: var(--ink);
  }
  .ee-hero-rule::before {
    top: 2px;
  }
  .ee-hero-rule::after {
    bottom: 2px;
  }
  .ee-hero-of {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 68px;
    line-height: 1;
    padding: 0 6px;
  }
  .ee-hero-credit {
    margin-top: 30px;
    font-family: "Manrope", sans-serif;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: var(--ee-chrome-tracking-wide);
    text-transform: uppercase;
  }
</style>
```
