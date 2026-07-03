```html
<!-- step-card is a process-flow beat from the source deck's slide 6.
     One card per process step; the in-card arrow nubs to the next card. -->
<div class="cm-step-card">
  <div class="cm-step-num">{KICKER}</div>
  <div class="cm-step-title">{HEADLINE}</div>
  <div class="cm-step-desc">{LEDE}</div>
  <div class="cm-step-arrow" aria-hidden="true"></div>
</div>

<style>
  .cm-step-card {
    position: relative;
    background: var(--canvas);
    color: var(--ink);
    border: var(--border-structural);
    padding: 1.45vw;
    display: flex;
    flex-direction: column;
    min-height: 21.8vw;
  }
  .cm-step-num {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 7.3vw;
    line-height: 0.85;
    color: inherit;
  }
  .cm-step-title {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 1.77vw;
    line-height: 1;
    text-transform: uppercase;
    margin-top: 0.85vw;
    color: inherit;
  }
  .cm-step-desc {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.25vw;
    line-height: 1.4;
    margin-top: 0.75vw;
    color: var(--ink);
    opacity: 0.85;
  }
  .cm-step-arrow {
    position: absolute;
    right: -1.15vw;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 0.95vw solid transparent;
    border-bottom: 0.95vw solid transparent;
    border-left: 1.25vw solid var(--ink);
    z-index: 2;
  }
</style>
```
