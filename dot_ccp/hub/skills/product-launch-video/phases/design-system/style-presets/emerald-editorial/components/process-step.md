```html
<!-- Numbered step card: ordinal + display title sitting under a 4px
     rule + body paragraph + meta footer. Default fill is ink (canvas
     text); add .is-alt to flip to paper-tile (ink text). Rotate fills
     across a row of 4 steps: step → alt → step → alt. -->
<div class="ee-process-step">
  <div class="ee-process-step-n">01</div>
  <h4 class="ee-process-step-title">{HEADLINE}</h4>
  <p class="ee-process-step-body">{LEDE}</p>
  <div class="ee-process-step-meta">
    <span>{LEFT}</span>
    <span>{RIGHT}</span>
  </div>
</div>

<style>
  .ee-process-step {
    background: var(--ink);
    color: var(--canvas);
    padding: 32px 32px 26px;
    display: flex;
    flex-direction: column;
    border-radius: var(--ee-radius);
    box-shadow: none;
    font-family: "Manrope", sans-serif;
  }
  .ee-process-step.is-alt {
    background: var(--ee-paper);
    color: var(--ink);
  }
  .ee-process-step-n {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: 80px;
    line-height: 1;
    margin-bottom: 14px;
  }
  .ee-process-step-title {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 40px;
    line-height: 1;
    margin: 0 0 16px;
    letter-spacing: -0.005em;
    border-top: 4px solid currentColor;
    padding-top: 16px;
  }
  .ee-process-step-body {
    font-size: 24px;
    line-height: 1.4;
    font-weight: 500;
    margin: 0 0 16px;
  }
  .ee-process-step-meta {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    letter-spacing: 0.08em;
    font-size: 24px;
    text-transform: uppercase;
  }
</style>
```
