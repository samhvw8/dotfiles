```html
<!-- Timeline row: an outlined colored disc holding a numeral or letter sits
     beside a small white card. Marker fills rotate per row when stacked. -->
<div class="dc-timeline">
  <div class="dc-timeline-row">
    <div class="dc-timeline-dot dc-timeline-dot--1">1</div>
    <div class="dc-timeline-card">
      <h4 class="dc-timeline-title">{LABEL}</h4>
      <p class="dc-timeline-desc">{SUBHEAD}</p>
    </div>
  </div>
  <div class="dc-timeline-row">
    <div class="dc-timeline-dot dc-timeline-dot--2">2</div>
    <div class="dc-timeline-card">
      <h4 class="dc-timeline-title">{LEFT}</h4>
      <p class="dc-timeline-desc">{RIGHT}</p>
    </div>
  </div>
  <div class="dc-timeline-row">
    <div class="dc-timeline-dot dc-timeline-dot--3">3</div>
    <div class="dc-timeline-card">
      <h4 class="dc-timeline-title">{EYEBROW}</h4>
      <p class="dc-timeline-desc">{LEDE}</p>
    </div>
  </div>
</div>

<style>
  .dc-timeline {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    width: 100%;
    max-width: 38vw;
  }
  .dc-timeline-row {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  .dc-timeline-dot {
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    border: var(--border-bold);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(26px, 1.8vw, 32px);
    color: var(--canvas);
  }
  .dc-timeline-dot--1 {
    background: var(--brand-accent);
  }
  .dc-timeline-dot--2 {
    background: color-mix(in srgb, var(--brand-primary) 50%, var(--anchor-mint));
  }
  .dc-timeline-dot--3 {
    background: color-mix(in srgb, var(--brand-secondary) 50%, var(--anchor-lavender));
  }
  .dc-timeline-card {
    flex: 1;
    background: var(--canvas);
    border: var(--border-bold);
    border-radius: var(--radius-card);
    padding: var(--pad-card-sm);
    box-shadow: var(--shadow-small);
  }
  .dc-timeline-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(28px, 1.9vw, 34px);
    line-height: 1.2;
    color: var(--ink);
    margin: 0 0 0.2rem;
  }
  .dc-timeline-desc {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: clamp(24px, 1.5vw, 26px);
    line-height: 1.45;
    color: color-mix(in srgb, var(--ink) 65%, transparent);
    margin: 0;
  }
</style>
```
