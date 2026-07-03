```html
<!-- A 5-column grid of small framed-header cards. Used for any "five-item
     parallel" content beat (a week, five steps, five features). Each card
     has a pastel cap rotating through the marker palette; body is white. -->
<div class="dc-week">
  <div class="dc-week-card">
    <div class="dc-week-cap dc-week-cap--1">{LABEL}</div>
    <div class="dc-week-body">
      <ul>
        <li>{LEFT}</li>
        <li>{RIGHT}</li>
      </ul>
    </div>
  </div>
  <div class="dc-week-card">
    <div class="dc-week-cap dc-week-cap--2">{LABEL}</div>
    <div class="dc-week-body">
      <ul>
        <li>{LEFT}</li>
        <li>{RIGHT}</li>
      </ul>
    </div>
  </div>
  <div class="dc-week-card">
    <div class="dc-week-cap dc-week-cap--3">{LABEL}</div>
    <div class="dc-week-body">
      <ul>
        <li>{LEFT}</li>
        <li>{RIGHT}</li>
      </ul>
    </div>
  </div>
  <div class="dc-week-card">
    <div class="dc-week-cap dc-week-cap--4">{LABEL}</div>
    <div class="dc-week-body">
      <ul>
        <li>{LEFT}</li>
        <li>{RIGHT}</li>
      </ul>
    </div>
  </div>
  <div class="dc-week-card">
    <div class="dc-week-cap dc-week-cap--5">{LABEL}</div>
    <div class="dc-week-body">
      <ul>
        <li>{LEFT}</li>
        <li>{RIGHT}</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .dc-week {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.8rem;
    width: 100%;
    max-width: 56vw;
  }
  .dc-week-card {
    background: var(--canvas);
    border: var(--border-bold);
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-small);
  }
  .dc-week-cap {
    padding: 0.6rem 0.4rem;
    text-align: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(26px, 1.7vw, 30px);
    line-height: 1.15;
    color: var(--ink);
    border-bottom: var(--border-bold);
  }
  .dc-week-cap--1 {
    background: color-mix(in srgb, var(--brand-secondary) 45%, var(--anchor-blush));
  }
  .dc-week-cap--2 {
    background: color-mix(in srgb, var(--brand-primary) 40%, var(--anchor-mint));
  }
  .dc-week-cap--3 {
    background: var(--brand-accent);
    color: var(--canvas);
  }
  .dc-week-cap--4 {
    background: color-mix(in srgb, var(--brand-secondary) 45%, var(--anchor-butter));
  }
  .dc-week-cap--5 {
    background: color-mix(in srgb, var(--brand-primary) 45%, var(--anchor-lavender));
  }
  .dc-week-body {
    padding: 0.8rem 1rem;
  }
  .dc-week-body ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .dc-week-body li {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(24px, 1.5vw, 26px);
    line-height: 1.4;
    padding-left: 1rem;
    position: relative;
    color: var(--ink);
  }
  .dc-week-body li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: color-mix(in srgb, var(--ink) 50%, transparent);
  }
</style>
```
