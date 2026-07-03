```html
<div class="sk-rosette-seal">{KICKER}</div>

<style>
  /*
    32-point starburst clip-path filled ink with cream text. Authority mark
    on covers and closing colophons. Always carries 1-4 characters in Big
    Shoulders 900 (a year, a volume number, a 2-3 letter abbreviation).
    Phase 4b: drop-in with opacity 0 → 1 + scale 0.92 → 1 on power3.out
    @ DUR.snap. Rotation stays at 0deg — the starburst is symmetric.
  */
  .sk-rosette-seal {
    display: grid;
    place-items: center;
    width: clamp(70px, 6vw, 110px);
    aspect-ratio: 1 / 1;
    background: var(--anchor-ink);
    color: var(--anchor-paper);
    clip-path: var(--starburst-clip);
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(26px, 2.2vw, 42px);
    line-height: 1;
    letter-spacing: -0.01em;
    text-align: center;
  }
</style>
```
