```html
<div class="sk-spec-checklist">
  <div class="sk-spec-row">
    <span class="sk-spec-box checked"></span>
    <span class="sk-spec-label">{DO_1}</span>
  </div>
  <div class="sk-spec-row">
    <span class="sk-spec-box checked"></span>
    <span class="sk-spec-label">{DO_2}</span>
  </div>
  <div class="sk-spec-row">
    <span class="sk-spec-box"></span>
    <span class="sk-spec-label">{DO_3}</span>
  </div>
</div>

<style>
  /*
    Spec-checklist column — ink-bordered square checkboxes followed by
    tracked-caps Albert Sans labels. The cassette-package's feature
    enumeration. The checked state fills ink and centers a cream "×"
    glyph (NOT a checkmark) in Big Shoulders 900.
    Phase 4b: stagger row reveals 80-120ms with checkbox tick last —
    opacity 0 → 1 on the row body, then the × glyph fades in inside
    the checked box on DUR.snap.
  */
  .sk-spec-checklist {
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 2vh, 36px);
  }
  .sk-spec-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sk-spec-box {
    position: relative;
    display: inline-block;
    width: clamp(14px, 1.1vw, 20px);
    aspect-ratio: 1 / 1;
    border: var(--border-ink-heavy);
    background: transparent;
  }
  .sk-spec-box.checked {
    background: var(--anchor-ink);
  }
  .sk-spec-box.checked::after {
    content: "×";
    position: absolute;
    inset: 0;
    color: var(--anchor-paper);
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: 1.2em;
    line-height: 1;
    display: grid;
    place-items: center;
  }
  .sk-spec-label {
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.04em;
    color: var(--anchor-ink);
    text-transform: uppercase;
  }
</style>
```
