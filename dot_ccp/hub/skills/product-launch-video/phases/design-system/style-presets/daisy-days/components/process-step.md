```html
<!-- Process step: 90px outlined circle with a step number in white Fredoka,
     title in Fredoka, description in Quicksand 600 muted. Stack three across
     the slide separated by a Fredoka → arrow. The step-circle--N modifier
     picks a fill from the rotating pastel set. -->
<div class="dc-process">
  <div class="dc-process-step">
    <div class="dc-step-circle dc-step-circle--1">1</div>
    <h4 class="dc-step-title">{EYEBROW}</h4>
    <p class="dc-step-desc">{LEFT}</p>
  </div>
  <div class="dc-process-arrow" aria-hidden="true">&rarr;</div>
  <div class="dc-process-step">
    <div class="dc-step-circle dc-step-circle--2">2</div>
    <h4 class="dc-step-title">{LABEL}</h4>
    <p class="dc-step-desc">{RIGHT}</p>
  </div>
  <div class="dc-process-arrow" aria-hidden="true">&rarr;</div>
  <div class="dc-process-step">
    <div class="dc-step-circle dc-step-circle--3">3</div>
    <h4 class="dc-step-title">{KICKER}</h4>
    <p class="dc-step-desc">{LEDE}</p>
  </div>
</div>

<style>
  .dc-process {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 48vw;
  }
  .dc-process-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.7rem;
  }
  .dc-step-circle {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 50%;
    border: var(--border-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 2rem;
    color: var(--canvas);
    box-shadow: var(--shadow-small);
  }
  .dc-step-circle--1 {
    background: var(--brand-accent);
  }
  .dc-step-circle--2 {
    background: color-mix(in srgb, var(--brand-primary) 55%, var(--anchor-teal));
  }
  .dc-step-circle--3 {
    background: color-mix(in srgb, var(--brand-secondary) 55%, var(--anchor-lavender));
  }
  .dc-step-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(28px, 1.9vw, 34px);
    line-height: 1.2;
    color: var(--ink);
    margin: 0;
  }
  .dc-step-desc {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(24px, 1.5vw, 26px);
    line-height: 1.45;
    color: color-mix(in srgb, var(--ink) 65%, transparent);
    max-width: 16rem;
    margin: 0;
  }
  .dc-process-arrow {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 2rem;
    color: var(--ink);
    margin-top: 1.6rem;
    flex-shrink: 0;
  }
</style>
```
