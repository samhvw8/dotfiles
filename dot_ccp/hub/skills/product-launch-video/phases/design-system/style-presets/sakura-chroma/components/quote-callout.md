```html
<div class="sk-quote-callout">
  <span class="sk-quote-callout-kicker">{EYEBROW}</span>
  <blockquote class="sk-quote-callout-body">{QUOTE}</blockquote>
  <div class="sk-quote-callout-attr">{AUTHOR}</div>
</div>

<style>
  /*
    Paper-on-ribbons quote callout — the system's one moment that EARNS the
    8px hard ink-offset shadow. Sits on top of diagonal ribbons as a
    paper-card lift. Inline <em> inside the quote body shifts color to
    var(--sk-blue) (NOT red — red is the body emphasis color and would
    overload the spread when ribbons already carry sk-red).
    Phase 4b: reveal the kicker first (DUR.snap), then the body card
    (power3.out, DUR.med), then the attribution tag (DUR.snap).
  */
  .sk-quote-callout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(16px, 2vh, 28px);
  }
  .sk-quote-callout-kicker {
    background: var(--anchor-paper);
    padding: clamp(6px, 0.8vh, 12px) clamp(14px, 1.4vw, 22px);
    border: var(--border-ink);
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--anchor-ink);
  }
  .sk-quote-callout-body {
    background: var(--anchor-paper);
    padding: clamp(20px, 2.4vh, 40px) clamp(28px, 2.6vw, 48px);
    border: var(--border-ink);
    box-shadow: var(--shadow-ink-hard);
    max-width: 78%;
    margin: 0;
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(48px, min(5.4vw, 9vh), 110px);
    line-height: 0.92;
    letter-spacing: -0.018em;
    color: var(--anchor-ink);
  }
  .sk-quote-callout-body em {
    color: var(--sk-blue);
    font-style: normal; /* color shift IS the emphasis */
  }
  .sk-quote-callout-attr {
    background: var(--anchor-ink);
    color: var(--anchor-paper);
    padding: clamp(8px, 1vh, 14px) clamp(14px, 1.4vw, 22px);
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: clamp(24px, 1.5vw, 28px);
    letter-spacing: 0.04em;
  }
</style>
```
