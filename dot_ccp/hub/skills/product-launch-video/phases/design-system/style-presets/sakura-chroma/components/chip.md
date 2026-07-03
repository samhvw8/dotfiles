```html
<span class="sk-chip">{LABEL}</span>

<style>
  /*
    JetBrains Mono color chip — categorical tag from the rainbow anchor set.
    Default fills sk-pink; variants swap the background. Text is always
    cream (--anchor-paper) — the only color inversion in the system. Strict
    rectangle, no border-radius.
  */
  .sk-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--sk-pink);
    color: var(--anchor-paper);
    padding: 4px 10px;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-weight: 500;
    font-size: clamp(24px, 1.4vw, 28px);
    line-height: 1;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 0;
  }
  .sk-chip.red {
    background: var(--sk-red);
  }
  .sk-chip.orange {
    background: var(--sk-orange);
  }
  .sk-chip.yellow {
    background: var(--sk-yellow);
    color: var(--anchor-ink);
  }
  .sk-chip.green {
    background: var(--sk-green);
  }
  .sk-chip.blue {
    background: var(--sk-blue);
  }
</style>
```
