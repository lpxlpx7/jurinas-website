import { css } from "../../build/css.ts";

/** Heisei photo wall: prints you can pick up and move around. */
export default css`
.retro-section {
  position: relative;
  width: min(1240px, calc(100% - var(--gutter) * 2));
  margin: 24px auto 96px;
  padding: clamp(36px, 5vw, 64px) clamp(24px, 4vw, 56px) clamp(28px, 4vw, 48px);
  overflow: hidden;
  border-radius: var(--radius-tile);
  background: url("../img/paper-grain.svg"), #ebe5da;
  color: #2a2724;
}
.retro-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.5), transparent 60%), repeating-linear-gradient(0deg, rgba(36,34,32,.03) 0 1px, transparent 1px 5px);
  pointer-events: none;
}
.retro-head { position: relative; z-index: 1; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px 32px; flex-wrap: wrap; }
.retro-era { display: flex; align-items: baseline; gap: 20px; }
.retro-era span { font: 700 clamp(32px, 4.4vw, 56px)/1 Georgia, "Times New Roman", serif; letter-spacing: .08em; }
.retro-era strong { font: 400 clamp(56px, 9vw, 120px)/.8 Georgia, "Times New Roman", serif; letter-spacing: -.06em; opacity: .72; }
.retro-hint { margin: 0 0 6px; color: #6f675d; font-size: 14px; }
.retro-hint .hint-pointer { display: none; }
@media (hover: hover) and (pointer: fine) and (min-width: 735px) {
  .retro-hint .hint-pointer { display: inline; }
  .retro-hint .hint-touch { display: none; }
}

.retro-gallery {
  position: relative;
  z-index: 1;
  margin-top: clamp(20px, 3vw, 36px);
  aspect-ratio: 100 / 72;
}
.snap {
  --dx: 0px;
  --dy: 0px;
  --tilt: 0deg;
  --lift: 1;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--w);
  margin: 0;
  padding: calc(var(--w) * .045) calc(var(--w) * .045) calc(var(--w) * .15);
  border-radius: 2px;
  background: url("../img/paper-grain.svg"), #fbf8f1;
  box-shadow: 0 0 0 .5px rgba(60,45,25,.14), 0 1px 2px rgba(50,38,22,.12), 0 10px 22px rgba(50,38,22,.16);
  transform: translate3d(var(--dx), var(--dy), 0) rotate(calc(var(--r) + var(--tilt))) scale(var(--lift));
  transition: transform .7s var(--ease-out), box-shadow .5s var(--ease-out);
  cursor: zoom-in;
  user-select: none;
  -webkit-user-select: none;
}
.snap img { width: 100%; height: auto; background: #d9d2c4; filter: saturate(.86) contrast(.97) sepia(.06); pointer-events: none; }
.snap:focus-visible { outline-offset: 6px; }
@media (hover: hover) and (pointer: fine) {
  .snap { cursor: grab; touch-action: none; }
  .snap:hover { --lift: 1.025; box-shadow: 0 0 0 .5px rgba(60,45,25,.14), 0 2px 4px rgba(50,38,22,.12), 0 18px 34px rgba(50,38,22,.2); }
}
.snap.is-dragging {
  --lift: 1.06;
  cursor: grabbing;
  transition: box-shadow .3s ease, transform .18s linear;
  box-shadow: 0 0 0 .5px rgba(60,45,25,.14), 0 4px 8px rgba(50,38,22,.12), 0 30px 50px rgba(50,38,22,.26);
}
.snap.is-moving { transition: box-shadow .3s ease; }
.snap:nth-child(1) { --x: 3%;  --y: 4%;  --w: 33%; --r: -3.5deg; }
.snap:nth-child(2) { --x: 38%; --y: 2%;  --w: 26%; --r: 2.5deg; }
.snap:nth-child(3) { --x: 67%; --y: 6%;  --w: 30%; --r: -2deg; }
.snap:nth-child(4) { --x: 4%;  --y: 41%; --w: 21%; --r: 4deg; }
.snap:nth-child(5) { --x: 29%; --y: 36%; --w: 28%; --r: -2.5deg; }
.snap:nth-child(6) { --x: 66%; --y: 39%; --w: 23%; --r: 3deg; }
.snap:nth-child(7) { --x: 10%; --y: 68%; --w: 26%; --r: -4deg; }
.snap:nth-child(8) { --x: 41%; --y: 66%; --w: 21%; --r: 2deg; }
.snap:nth-child(9) { --x: 71%; --y: 68%; --w: 18%; --r: -3deg; }

.retro-tidy {
  position: absolute;
  z-index: 2;
  right: clamp(20px, 3vw, 36px);
  bottom: clamp(18px, 2.4vw, 28px);
  min-height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: rgba(42,39,36,.08);
  color: #2a2724;
  font: 400 14px var(--font);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease, background-color .2s ease;
}
.retro-tidy:hover { background: rgba(42,39,36,.14); }
.retro-section.is-messy .retro-tidy { opacity: 1; pointer-events: auto; }

[data-theme="dark"] .retro-section { background: url("../img/paper-grain.svg"), #1c1a17; color: #ebe5da; }
[data-theme="dark"] .retro-section::before { background: radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.05), transparent 60%); }
[data-theme="dark"] .retro-hint { color: #a39b8f; }
[data-theme="dark"] .snap { background: url("../img/paper-grain.svg"), #2e2b27; box-shadow: 0 0 0 .5px rgba(255,255,255,.08), 0 10px 24px rgba(0,0,0,.5); }
[data-theme="dark"] .snap img { filter: saturate(.78) brightness(.82) sepia(.06); }
[data-theme="dark"] .retro-tidy { background: rgba(255,255,255,.1); color: #ebe5da; }
`;
