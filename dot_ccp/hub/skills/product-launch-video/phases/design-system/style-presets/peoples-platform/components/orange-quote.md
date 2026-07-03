```html
<div class="pp-orange-quote">
  <div class="pp-orange-quote-marks">"</div>
  <blockquote class="pp-orange-quote-body">{QUOTE}</blockquote>
  <div class="pp-orange-quote-who">
    <div class="pp-orange-quote-avatar">{AUTHOR}</div>
    <div>
      <div class="pp-orange-quote-name">{AUTHOR}</div>
      <div class="pp-orange-quote-role">{AUTHOR_ROLE}</div>
    </div>
  </div>
</div>

<style>
  .pp-orange-quote {
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 36px;
    padding: 96px 120px;
    background: var(--orange);
    color: var(--blue);
    min-height: 600px;
  }
  .pp-orange-quote-marks {
    font-family: "Alfa Slab One", serif;
    font-size: clamp(180px, 20vw, 300px);
    font-weight: 400;
    line-height: 0.6;
    color: var(--blue);
    text-shadow: 8px 8px 0 var(--red);
    height: 96px;
  }
  .pp-orange-quote-body {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(64px, 7vw, 108px);
    font-weight: 400;
    line-height: 1.05;
    text-transform: uppercase;
    color: var(--blue);
    max-width: 22ch;
  }
  .pp-orange-quote-body em {
    font-style: normal;
    color: var(--cream);
    text-shadow: 5px 5px 0 var(--red);
  }
  .pp-orange-quote-who {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-top: 24px;
  }
  .pp-orange-quote-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--blue);
    color: var(--orange);
    display: grid;
    place-items: center;
    font-family: "Alfa Slab One", serif;
    font-size: 56px;
    font-weight: 400;
    line-height: 1;
    border: 6px solid var(--blue);
    box-shadow: 6px 6px 0 var(--red);
    overflow: hidden;
  }
  .pp-orange-quote-name {
    font-family: "Alfa Slab One", serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1;
    text-transform: uppercase;
    color: var(--blue);
  }
  .pp-orange-quote-role {
    font-family: "DM Mono", monospace;
    font-size: 27px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--blue);
    margin-top: 8px;
  }
</style>
```
