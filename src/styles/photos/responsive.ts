import { css } from "../../build/css.ts";

/** Phone collage layout and reduced motion for the photos. */
export default css`
/* Phones: every print is visible at once, laid out as a loose two-column collage. Tap to enlarge. */
@media (max-width: 734px) {
  .portrait-stage { --pin-y: 6px; --pin-size: 19px; width: min(78%, 340px); }
  .portrait-card { padding: 10px 10px 50px; }
  .portrait-reference { left: 12px; bottom: 18px; font-size: 22px; }
  html[lang="ja"] .portrait-reference { font-size: 14px; }

  .retro-section { margin: 8px auto 72px; padding: 32px 18px 34px; }
  .retro-head { padding-inline: 6px; align-items: flex-start; flex-direction: column; gap: 10px; }
  .retro-era { gap: 14px; }
  .retro-era span { font-size: 30px; }
  .retro-era strong { font-size: 64px; }
  .retro-gallery {
    aspect-ratio: auto;
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 16px 14px;
    padding: 4px 2px 14px;
  }
  .snap {
    position: relative;
    left: auto;
    top: auto;
    width: auto;
    padding: 7px 7px 24px;
    transform: translateY(var(--oy, 0px)) rotate(var(--r));
    transition: transform .4s var(--ease-out), box-shadow .3s ease;
  }
  .snap img { aspect-ratio: 1; object-fit: cover; }
  .snap:nth-child(1) { grid-column: 1 / -1; padding: 9px 9px 32px; --r: -1.2deg; }
  .snap:nth-child(1) img { aspect-ratio: 16 / 10; }
  .snap:nth-child(2) { --r: 2.2deg; }
  .snap:nth-child(3) { --r: -2deg; --oy: 12px; }
  .snap:nth-child(4) { --r: -1.4deg; }
  .snap:nth-child(5) { --r: 2.6deg; --oy: 12px; }
  .snap:nth-child(6) { --r: 1.8deg; }
  .snap:nth-child(7) { --r: -2.4deg; --oy: 12px; }
  .snap:nth-child(8) { --r: -1.6deg; }
  .snap:nth-child(9) { --r: 2deg; --oy: 12px; }
  .snap:active { transform: translateY(var(--oy, 0px)) rotate(0deg) scale(.97); }
  .retro-tidy { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .portrait-stage.is-entering { animation: none; }
  .portrait-sheen::after { display: none; }
}
`;
