```html
<div class="sk-product-card">
  <div class="sk-product-card-topstrip"></div>
  <div class="sk-product-card-body">
    <h3 class="sk-product-card-name">{HEADLINE}</h3>
    <p class="sk-product-card-desc">{SUBHEAD}</p>
    <div class="sk-product-card-specs">
      <div class="sk-product-card-spec-row"><span class="k">FORMAT</span><span>LP / 33⅓</span></div>
      <div class="sk-product-card-spec-row"><span class="k">RATE</span><span>44.1 KHZ</span></div>
      <div class="sk-product-card-spec-row"><span class="k">MODE</span><span>STEREO</span></div>
    </div>
  </div>
</div>

<style>
  /*
    Vertical catalogue card with a 1.5px ink border, a colored topstrip
    header band (rainbow variant), and a stacked body of display name +
    body description + dashed-rule + mono spec rows. The catalogue grid's
    primary unit. Strict rectangle — no border-radius. Spec rows MUST stay
    JetBrains Mono — switching to Albert Sans reads as body, not data.

    Phase 4b: cycle the .red / .pink / .orange / .blue variant per instance
    in a 4-up grid for the catalogue color story. Stagger card reveals 80ms.
  */
  .sk-product-card {
    background: var(--anchor-paper);
    border: var(--border-ink);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 0;
  }
  .sk-product-card-topstrip {
    height: clamp(18px, 2vh, 32px);
    background: var(--sk-red);
  }
  .sk-product-card.pink .sk-product-card-topstrip {
    background: var(--sk-pink);
  }
  .sk-product-card.orange .sk-product-card-topstrip {
    background: var(--sk-orange);
  }
  .sk-product-card.blue .sk-product-card-topstrip {
    background: var(--sk-blue);
  }
  .sk-product-card.green .sk-product-card-topstrip {
    background: var(--sk-green);
  }
  .sk-product-card-body {
    padding: var(--gap-card-y) var(--gap-card-x);
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.2vh, 16px);
    flex: 1;
  }
  .sk-product-card-name {
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(28px, min(2.6vw, 4.6vh), 48px);
    line-height: 0.94;
    letter-spacing: -0.012em;
    color: var(--anchor-ink);
    margin: 0;
  }
  .sk-product-card-desc {
    font-family: "Albert Sans", sans-serif;
    font-weight: 400;
    font-size: clamp(24px, 1.4vw, 28px);
    line-height: 1.4;
    color: var(--anchor-ink);
    margin: 0;
    flex: 1;
  }
  .sk-product-card-specs {
    border-top: var(--border-ink-dashed);
    padding-top: clamp(8px, 1vh, 14px);
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: clamp(24px, 1.4vw, 28px);
    color: var(--anchor-ink);
    letter-spacing: 0.02em;
    margin-top: auto;
  }
  .sk-product-card-spec-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .sk-product-card-spec-row .k {
    opacity: 0.7;
  }
</style>
```
