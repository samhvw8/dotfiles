```html
<div class="sk-lockup-bar">{HEADLINE}</div>

<style>
  /*
    Big condensed lockup — pink (or other rainbow-anchor) bar with cream
    Big Shoulders 900 type. The cover-spread's signature "BRAND IS HERE"
    statement element. Sits between the hero numeral and the cover footer.
    Strict rectangle, no border-radius. Type does NOT carry the inline <em>
    color shift — the bar background is already the chromatic moment.

    Phase 4b: reveal width 0 → 100% with transform-origin: left on
    power3.out @ DUR.med, then fade the text in on top (DUR.snap, delay).
    The "bar paints, then label" sequence reads as a label printer.
    Variants swap the background color — keep the cream text constant.
  */
  .sk-lockup-bar {
    display: inline-block;
    background: var(--sk-pink);
    color: var(--anchor-paper);
    padding: clamp(8px, 1.2vh, 18px) clamp(18px, 1.8vw, 32px) clamp(6px, 0.8vh, 12px);
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(56px, min(7vw, 11vh), 130px);
    line-height: 0.9;
    letter-spacing: -0.015em;
    border-radius: 0;
  }
  .sk-lockup-bar.red {
    background: var(--sk-red);
  }
  .sk-lockup-bar.orange {
    background: var(--sk-orange);
  }
  .sk-lockup-bar.blue {
    background: var(--sk-blue);
  }
  .sk-lockup-bar.green {
    background: var(--sk-green);
  }
  .sk-lockup-bar.ink {
    background: var(--anchor-ink);
    color: var(--anchor-paper);
  }
</style>
```
