```html
<div class="sk-ledger">
  <div class="sk-ledger-row sk-ledger-headrow">
    <div>DATE</div>
    <div>TITLE</div>
    <div>EDITION</div>
    <div>TAG</div>
    <div>NR</div>
  </div>
  <div class="sk-ledger-row">
    <div class="sk-ledger-date">{KICKER}</div>
    <div class="sk-ledger-ttl">{HEADLINE}</div>
    <div class="sk-ledger-ven">{LABEL}</div>
    <div><span class="sk-ledger-chip red">{LABEL}</span></div>
    <div class="sk-ledger-nr">
      <span class="b fill"></span><span class="b"></span><span class="b"></span>
    </div>
  </div>
</div>

<style>
  /*
    5-column tabular ledger row pattern: date (mono) | title (Big Shoulders
    700) | edition (Albert) | chip | nr indicator. Header row uses a 1.5px
    ink border-bottom; body rows use 1px hairline ink-alpha dividers. The
    title slot allows inline <em> color shift to var(--sk-red).
    Phase 4b: stagger row reveals 100-140ms with opacity 0 → 1 + y +12 → 0
    on power2.out @ DUR.snap.
  */
  .sk-ledger {
    display: flex;
    flex-direction: column;
  }
  .sk-ledger-row {
    display: grid;
    grid-template-columns: 96px 1.4fr 0.9fr 0.6fr 64px;
    gap: clamp(12px, 1.4vw, 24px);
    align-items: center;
    padding: clamp(10px, 1.2vh, 18px) 0;
    border-bottom: var(--border-ink-hairline);
  }
  .sk-ledger-headrow {
    border-bottom: var(--border-ink);
    padding: 8px 0;
  }
  .sk-ledger-headrow > div {
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.4vw, 28px);
    line-height: 1.2;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--anchor-ink);
  }
  .sk-ledger-date {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: clamp(24px, 1.4vw, 28px);
    color: var(--anchor-ink);
    letter-spacing: 0.02em;
  }
  .sk-ledger-ttl {
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 1.9vw, 38px);
    line-height: 1.1;
    letter-spacing: -0.005em;
    color: var(--anchor-ink);
  }
  .sk-ledger-ttl em {
    color: var(--sk-red);
    font-style: normal;
  }
  .sk-ledger-ven {
    font-family: "Albert Sans", sans-serif;
    font-size: clamp(24px, 1.4vw, 28px);
    color: var(--anchor-ink);
  }
  .sk-ledger-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: clamp(24px, 1.4vw, 28px);
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--anchor-paper);
    text-transform: uppercase;
    background: var(--sk-red);
  }
  .sk-ledger-chip.pink {
    background: var(--sk-pink);
  }
  .sk-ledger-chip.orange {
    background: var(--sk-orange);
  }
  .sk-ledger-chip.green {
    background: var(--sk-green);
  }
  .sk-ledger-chip.blue {
    background: var(--sk-blue);
  }
  .sk-ledger-nr {
    display: flex;
    gap: 6px;
    justify-content: end;
  }
  .sk-ledger-nr .b {
    width: 14px;
    height: 14px;
    border: var(--border-ink);
    background: var(--anchor-paper);
  }
  .sk-ledger-nr .b.fill {
    background: var(--anchor-ink);
  }
</style>
```
