```html
<!-- Magazine-style data panel: solid ink container holding a bar chart on
     canvas-colored bars + alt brand-accent bars. Strict rectangle, no
     border-radius, no shadow. The grid lines are 2px at 22% canvas-on-ink.
     Hand-set bar heights — there is no data-binding layer. -->
<div class="ee-chart-card">
  <div class="ee-chart-card-lbl">{LABEL}</div>
  <div class="ee-chart-card-area">
    <div class="ee-chart-card-grid">
      <div class="ee-chart-card-gl" style="top: 0%;"></div>
      <div class="ee-chart-card-gl" style="top: 25%;"></div>
      <div class="ee-chart-card-gl" style="top: 50%;"></div>
      <div class="ee-chart-card-gl" style="top: 75%;"></div>
      <div class="ee-chart-card-gl" style="top: 100%;"></div>
    </div>
    <div class="ee-chart-card-bars">
      <div class="ee-chart-card-grp">
        <div class="ee-chart-card-bar" style="height: 42%;">
          <span class="ee-chart-card-v">52</span>
        </div>
        <div class="ee-chart-card-bar ee-chart-card-bar-alt" style="height: 35%;">
          <span class="ee-chart-card-v">44</span>
        </div>
      </div>
      <div class="ee-chart-card-grp">
        <div class="ee-chart-card-bar" style="height: 58%;">
          <span class="ee-chart-card-v">70</span>
        </div>
        <div class="ee-chart-card-bar ee-chart-card-bar-alt" style="height: 50%;">
          <span class="ee-chart-card-v">60</span>
        </div>
      </div>
      <div class="ee-chart-card-grp">
        <div class="ee-chart-card-bar" style="height: 75%;">
          <span class="ee-chart-card-v">90</span>
        </div>
        <div class="ee-chart-card-bar ee-chart-card-bar-alt" style="height: 70%;">
          <span class="ee-chart-card-v">84</span>
        </div>
      </div>
      <div class="ee-chart-card-grp">
        <div class="ee-chart-card-bar" style="height: 88%;">
          <span class="ee-chart-card-v">106</span>
        </div>
        <div class="ee-chart-card-bar ee-chart-card-bar-alt" style="height: 82%;">
          <span class="ee-chart-card-v">98</span>
        </div>
      </div>
    </div>
  </div>
  <div class="ee-chart-card-legend">
    <div class="ee-chart-card-it"><span class="ee-chart-card-sw"></span><span>COMMITTED</span></div>
    <div class="ee-chart-card-it">
      <span class="ee-chart-card-sw ee-chart-card-sw-alt"></span><span>DELIVERED</span>
    </div>
  </div>
</div>

<style>
  .ee-chart-card {
    background: var(--ink);
    color: var(--canvas);
    padding: 36px 50px 30px;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: var(--ee-radius);
    box-shadow: none;
    overflow: hidden;
    min-height: 480px;
    font-family: "Manrope", sans-serif;
  }
  .ee-chart-card-lbl {
    font-weight: 800;
    letter-spacing: 0.14em;
    font-size: 24px;
    margin-bottom: 24px;
    text-transform: uppercase;
  }
  .ee-chart-card-area {
    flex: 1;
    position: relative;
    min-height: 0;
  }
  .ee-chart-card-grid {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
  }
  .ee-chart-card-gl {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--ee-chart-grid);
  }
  .ee-chart-card-bars {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
    display: flex;
    gap: 24px;
    align-items: flex-end;
  }
  .ee-chart-card-grp {
    flex: 1;
    display: flex;
    gap: 10px;
    align-items: flex-end;
    height: 100%;
  }
  .ee-chart-card-bar {
    flex: 1;
    background: var(--canvas);
    position: relative;
    border-radius: var(--ee-radius);
  }
  .ee-chart-card-bar-alt {
    background: var(--ee-paper);
  }
  .ee-chart-card-v {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 30px;
    color: var(--canvas);
  }
  .ee-chart-card-bar-alt .ee-chart-card-v {
    color: var(--ee-paper);
  }
  .ee-chart-card-legend {
    display: flex;
    gap: 36px;
    margin-top: 20px;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
  }
  .ee-chart-card-it {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ee-chart-card-sw {
    width: 22px;
    height: 22px;
    background: var(--canvas);
  }
  .ee-chart-card-sw-alt {
    background: var(--ee-paper);
  }
</style>
```
