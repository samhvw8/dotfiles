```html
<!-- Daisy Days signature: a cluster of 4-7 hand-drawn SVG ornaments living
     on z-index:1, pointer-events:none, often cropping past the slide edge.
     This component renders the four canonical anchor positions (top-left
     daisy, top-right star, bottom-left star, bottom-right rainbow).
     Strokes are charcoal (--ink); fills pull pastel tints from brand vars
     so the ornaments re-color when the palette shifts. -->
<div class="dc-ornaments" aria-hidden="true">
  <div class="dc-orn dc-orn--daisy-tl">
    <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
      <g
        fill="var(--canvas)"
        stroke="var(--sticker-stroke)"
        stroke-width="var(--sticker-stroke-w)"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="m66.6 53.8-5.9-13.8c-2.2-5.9-4.6-17.9-1.7-26.2 1.7-4.9 6.7-11.4 15.4-11.4 8.7-0.2 13.4 4.6 15.7 8.6 4.8 8.1 2.5 20.3-0.1 27.7l-6.8 15.1"
        />
        <path
          d="m92.1 115.2c1.3 5.8 1.9 13.8-0.2 19.9-1.9 5.1-6.4 12.5-16.9 12.5-8.4 0-14.9-5.3-16.8-13.1-1.7-7-0.6-15.2 1.7-22l6.7-16.4"
        />
        <path
          d="m96 66.4 14.7-5.8c5.9-2.4 16.2-8.3 19.8-17 2.8-6.4 2.1-14.2-4.3-19.7-2.8-2.5-6.2-4.2-10.2-5-9.3-0.6-15.8 5.5-20.3 10.9-2.7 3.4-5.1 7.4-6.8 11l-5.7 12.8"
        />
        <path
          d="m54 84-14.7 5.5c-5.7 2.1-12.3 6.6-15.9 10.9-1.9 2.3-4 5.7-4.9 8.9-2.1 8.5 2.8 18 11.7 21.8 4.9 1.3 9.3 0.9 13.6-1.2 7.6-3.6 13.8-12.1 16.9-18.5l5.9-13.6"
        />
        <path
          d="m96.2 83.8 14.5 5.5c5.9 2.1 15.7 8.3 19.5 16.2 2.6 5.1 3.2 12.1-1.9 18.7-2.7 3.3-7 6.9-13.2 6.9-8.5 0-14.1-5-18.3-9.7-2.6-3.2-5.4-7.6-7.3-11.5l-6.1-14.2"
        />
        <path
          d="m54 66.1-14.3-5.5c-5.7-2.1-15.9-3.4-23.1-2.1-6.2 1.2-11.9 5.9-13.4 12.1-1.7 7.6 1.7 17.2 11.9 20.2 7 2.1 16.8 1.1 23.6-1.1l15.5-5.9"
        />
      </g>
      <circle
        cx="75"
        cy="75"
        r="22"
        fill="var(--sticker-warm)"
        stroke="var(--sticker-stroke)"
        stroke-width="var(--sticker-stroke-w)"
      />
    </svg>
  </div>
  <div class="dc-orn dc-orn--star-tr">
    <svg viewBox="0 0 100 98.6" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="var(--sticker-soft)"
        stroke="var(--sticker-stroke)"
        stroke-width="2.4"
        stroke-miterlimit="10"
        d="m57.7 7.8 8.3 19.1c.5 1.3 1.5 2.1 2.8 2.3l21.5 2.2c6.4.8 9.4 8.3 5.3 13.7l-16.2 15.2c-1 .9-1.5 2.5-1.2 4.2l4.3 21.1c.9 6.2-4.9 11.6-12 8.7l-18.1-10.2c-1.4-.8-3.3-.8-4.8 0l-17.8 10.2c-6 2.9-13.2-.6-12.7-8l4.5-21.3c.3-1.7-.1-3.5-1.3-4.5l-15.2-13.5c-4.5-4.3-3.6-13.6 4.2-15.6l21.5-2.2c1.3-.1 2.3-.9 2.9-2.3l8.7-19.1c2.7-6 11.5-7.7 15.3 0z"
      />
    </svg>
  </div>
  <div class="dc-orn dc-orn--star-bl">
    <svg viewBox="0 0 100 98.6" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="var(--sticker-cool)"
        stroke="var(--sticker-stroke)"
        stroke-width="2.4"
        stroke-miterlimit="10"
        d="m57.7 7.8 8.3 19.1c.5 1.3 1.5 2.1 2.8 2.3l21.5 2.2c6.4.8 9.4 8.3 5.3 13.7l-16.2 15.2c-1 .9-1.5 2.5-1.2 4.2l4.3 21.1c.9 6.2-4.9 11.6-12 8.7l-18.1-10.2c-1.4-.8-3.3-.8-4.8 0l-17.8 10.2c-6 2.9-13.2-.6-12.7-8l4.5-21.3c.3-1.7-.1-3.5-1.3-4.5l-15.2-13.5c-4.5-4.3-3.6-13.6 4.2-15.6l21.5-2.2c1.3-.1 2.3-.9 2.9-2.3l8.7-19.1c2.7-6 11.5-7.7 15.3 0z"
      />
    </svg>
  </div>
  <div class="dc-orn dc-orn--rainbow-br">
    <svg viewBox="0 0 140 101.4" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="var(--sticker-stroke)" stroke-width="1.6" stroke-miterlimit="10">
        <path d="M130 95c0-35-25.5-63.5-60-63.5S10 60 10 95" fill="var(--brand-accent)" />
        <path d="M115 95c0-26.2-19-48.5-45-48.5S25 68.8 25 95" fill="var(--sticker-warm)" />
        <path d="M100 95c0-17.5-12.8-33.5-30-33.5S40 77.5 40 95" fill="var(--sticker-cool)" />
        <path d="M85 95c0-8.8-6.3-18.5-15-18.5S55 86.2 55 95" fill="var(--brand-primary)" />
      </g>
    </svg>
  </div>
</div>

<style>
  .dc-ornaments {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  .dc-orn {
    position: absolute;
  }
  .dc-orn svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .dc-orn--daisy-tl {
    top: -2vw;
    left: -2vw;
    width: 11vw;
    height: 11vw;
  }
  .dc-orn--star-tr {
    top: 4vw;
    right: 4vw;
    width: 5vw;
    height: 5vw;
  }
  .dc-orn--star-bl {
    bottom: 6vw;
    left: 4vw;
    width: 4vw;
    height: 4vw;
  }
  .dc-orn--rainbow-br {
    bottom: 3vw;
    right: 3vw;
    width: 9vw;
    height: 6.5vw;
  }
</style>
```
