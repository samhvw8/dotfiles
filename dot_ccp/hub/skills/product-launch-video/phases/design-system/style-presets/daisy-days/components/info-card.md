```html
<!-- Info card: 44px outlined disc icon (in a rotating pastel) sits above the
     title; pastel disc background varies per instance — use the icon-* modifier
     to pick a fill that harmonizes with the slide surface. -->
<div class="dc-info-card">
  <!-- Decorative single-letter inside disc — hardcode per instance (A/B/C/etc).
       Do NOT use {INITIAL}/{LETTER} placeholders here; they fall through to
       literal text per README §5. -->
  <div class="dc-info-icon dc-info-icon--soft" aria-hidden="true">A</div>
  <h4 class="dc-info-title">{LABEL}</h4>
  <p class="dc-info-body">{LEDE}</p>
</div>

<style>
  .dc-info-card {
    background: var(--canvas);
    border: var(--border-bold);
    border-radius: var(--radius-card);
    padding: var(--pad-card-md);
    box-shadow: var(--shadow-small);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 22vw;
  }
  .dc-info-icon {
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    border: var(--border-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(26px, 1.8vw, 34px);
    color: var(--ink);
    margin-bottom: 0.2rem;
  }
  .dc-info-icon--soft {
    background: color-mix(in srgb, var(--brand-secondary) 45%, var(--anchor-blush));
  }
  .dc-info-icon--cool {
    background: color-mix(in srgb, var(--brand-primary) 40%, var(--anchor-mint));
  }
  .dc-info-icon--warm {
    background: color-mix(in srgb, var(--brand-accent) 40%, var(--anchor-peach));
  }
  .dc-info-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(30px, 2vw, 38px);
    line-height: 1.2;
    color: var(--ink);
    margin: 0;
  }
  .dc-info-body {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.5;
    color: color-mix(in srgb, var(--ink) 65%, transparent);
    margin: 0;
  }
</style>
```
