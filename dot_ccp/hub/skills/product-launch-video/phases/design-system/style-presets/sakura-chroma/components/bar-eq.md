```html
<div class="sk-bar-eq">
  <div class="sk-bar-eq-bars">
    <div class="sk-bar-eq-col" data-c="r">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="p">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg on"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="o">
      <span class="seg on"></span><span class="seg on"></span><span class="seg"></span
      ><span class="seg"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="y">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg on"></span><span class="seg on"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="g">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="b">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg on"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="r">
      <span class="seg on"></span><span class="seg on"></span><span class="seg"></span
      ><span class="seg"></span><span class="seg"></span><span class="seg"></span>
    </div>
    <div class="sk-bar-eq-col" data-c="g">
      <span class="seg on"></span><span class="seg on"></span><span class="seg on"></span
      ><span class="seg on"></span><span class="seg on"></span><span class="seg on"></span>
    </div>
  </div>
  <div class="sk-bar-eq-ticks">
    <span class="sk-bar-eq-ticklab">63</span>
    <span class="sk-bar-eq-ticklab">125</span>
    <span class="sk-bar-eq-ticklab">250</span>
    <span class="sk-bar-eq-ticklab">500</span>
    <span class="sk-bar-eq-ticklab">1K</span>
    <span class="sk-bar-eq-ticklab">2K</span>
    <span class="sk-bar-eq-ticklab">4K</span>
    <span class="sk-bar-eq-ticklab">8K</span>
  </div>
</div>

<style>
  /*
    8-column VU-meter equalizer. Each column stacks 6 segments. flex-direction:
    column-reverse means source-order segment 1 sits at the BOTTOM and lit
    segments stack upward like a real audio meter. On-segment color is set
    per column via data-c attribute (r/p/o/y/g/b). Off segments are
    translucent ink tint with a 1px hairline border.

    Phase 4b: animate per-column scaleY 0 → 1 with transform-origin: bottom
    on each lit segment, stagger 60ms between columns. Use power3.out @
    DUR.snap. The off segments stay static — only "on" lights up.
  */
  .sk-bar-eq {
    border: var(--border-ink);
    background: var(--anchor-paper);
    padding: clamp(18px, 2vw, 28px) clamp(20px, 2vw, 28px) clamp(14px, 1.6vh, 22px);
    display: grid;
    grid-template-rows: 1fr auto;
    gap: clamp(10px, 1.2vh, 18px);
    overflow: hidden;
  }
  .sk-bar-eq-bars {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: clamp(8px, 1vw, 16px);
    align-items: end;
    height: 100%;
    min-height: 200px;
  }
  .sk-bar-eq-col {
    display: flex;
    flex-direction: column-reverse;
    justify-content: start;
    height: 100%;
    gap: clamp(4px, 0.6vh, 8px);
  }
  .sk-bar-eq-col .seg {
    flex: 1 1 0;
    min-height: 12px;
    background: color-mix(in srgb, var(--anchor-ink) 10%, transparent);
    border: var(--border-ink-hairline);
  }
  .sk-bar-eq-col[data-c="r"] .seg.on {
    background: var(--sk-red);
    border-color: var(--sk-red);
  }
  .sk-bar-eq-col[data-c="p"] .seg.on {
    background: var(--sk-pink);
    border-color: var(--sk-pink);
  }
  .sk-bar-eq-col[data-c="o"] .seg.on {
    background: var(--sk-orange);
    border-color: var(--sk-orange);
  }
  .sk-bar-eq-col[data-c="y"] .seg.on {
    background: var(--sk-yellow);
    border-color: var(--sk-yellow);
  }
  .sk-bar-eq-col[data-c="g"] .seg.on {
    background: var(--sk-green);
    border-color: var(--sk-green);
  }
  .sk-bar-eq-col[data-c="b"] .seg.on {
    background: var(--sk-blue);
    border-color: var(--sk-blue);
  }
  .sk-bar-eq-ticks {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: clamp(8px, 1vw, 16px);
    border-top: 1px solid var(--anchor-ink);
    padding-top: clamp(8px, 1vh, 14px);
  }
  .sk-bar-eq-ticklab {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: clamp(24px, 1.4vw, 28px);
    color: var(--anchor-ink);
    letter-spacing: 0.04em;
    text-align: center;
  }
</style>
```
