```html
<span class="sk-red-stamp">{LABEL}</span>

<style>
  /*
    Red rectangular stamp with cream text, rotated -3° for tactile drop-in
    feel. Used for status badges (COMPLETE, AS SEEN ON, LIMITED) and
    product callouts. Always Big Shoulders 900 uppercase with positive
    0.02em tracking (NOT the negative tracking that display headlines use).
    Phase 4b: drop-in with opacity 0 → 1 + scale 0.92 → 1 on power3.out
    @ DUR.snap, preserving rotate(-3deg). Variants: .upright kills the
    rotation for footer-row uses where alignment matters.
  */
  .sk-red-stamp {
    display: inline-block;
    background: var(--sk-red);
    color: var(--anchor-paper);
    padding: clamp(8px, 1vh, 14px) clamp(12px, 1.4vw, 22px);
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(26px, 1.9vw, 36px);
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    transform: rotate(-3deg);
  }
  .sk-red-stamp.upright {
    transform: none;
  }
</style>
```
