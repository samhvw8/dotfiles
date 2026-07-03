```html
<div class="sk-topbar-rule">
  <h2 class="sk-topbar-rule-ttl">{HEADLINE}</h2>
  <span class="sk-topbar-rule-lab">{EYEBROW}</span>
</div>

<style>
  /*
    Section header underline pattern — display title (Big Shoulders 900,
    optional inline <em> for red emphasis) on the left aligned-end with a
    tracked-caps meta-label on the right, separated from the body by a
    1.5px ink rule. The most common framing chrome on content scenes.
    Phase 4b: reveal the title first (power3.out, DUR.med), then fade in
    the meta-label and the underline rule together on DUR.snap.
  */
  .sk-topbar-rule {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 30px;
    border-bottom: var(--border-ink);
    padding-bottom: clamp(12px, 1.4vh, 22px);
  }
  .sk-topbar-rule-ttl {
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(52px, min(5.6vw, 9vh), 100px);
    line-height: 0.9;
    letter-spacing: -0.018em;
    color: var(--anchor-ink);
    margin: 0;
  }
  .sk-topbar-rule-ttl em {
    color: var(--sk-red);
    font-style: normal;
  }
  .sk-topbar-rule-lab {
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--anchor-ink);
    text-align: right;
  }
</style>
```
