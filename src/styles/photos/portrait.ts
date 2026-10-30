import { css } from "../../build/css.ts";

/** Hanging polaroid on a push pin. JS only writes custom properties; CSS owns every transform. */
export default css`
.portrait-stage {
  --card-angle: -1.2deg;
  --card-twist: 0deg;
  --card-lift: 1;
  --shadow-x: 0px;
  --shadow-y: 14px;
  --shadow-blur: 26px;
  --shadow-alpha: .16;
  --pin-y: 8px;          /* how far below the card's top edge the pin goes through */
  --pin-size: 24px;
  --pin-shadow: 3px;
  --sheen-x: 50%;
  --sheen-strength: 0;
  position: relative;
  width: min(100%, 460px);
  margin-inline: auto;
  padding-top: 12px;
  perspective: 1600px;
  isolation: isolate;
}
.portrait-card {
  position: relative;
  width: 100%;
  padding: 14px 14px 64px;
  border-radius: 2px;
  background:
    linear-gradient(176deg, rgba(255,255,255,.7), rgba(255,255,255,0) 24%, rgba(120,100,70,0) 70%, rgba(120,100,70,.05)),
    url("../img/paper-grain.svg"),
    #fbf8f1;
  /* The card turns around the pin. */
  transform-origin: 50% var(--pin-y);
  transform: rotate(var(--card-angle)) rotateY(var(--card-twist)) scale(var(--card-lift));
  cursor: grab;
  /* Vertical swipes still scroll the page on touch screens; sideways drags swing the photo. */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform;
  box-shadow:
    0 0 0 .5px rgba(60,45,25,.12),
    0 1px 1.5px rgba(60,45,25,.1),
    calc(var(--shadow-x) * .3) calc(var(--shadow-y) * .3) calc(var(--shadow-blur) * .35) rgba(50,38,22,calc(var(--shadow-alpha) * .9)),
    var(--shadow-x) var(--shadow-y) var(--shadow-blur) rgba(50,38,22,var(--shadow-alpha));
}
.portrait-card.is-dragging { cursor: grabbing; }
/* A faint dimple where the pin presses into the paper; it sits at the pivot, so it never drifts. */
.portrait-card::before {
  content: "";
  position: absolute;
  z-index: 3;
  top: calc(var(--pin-y) - var(--pin-size) * .75);
  left: calc(50% - var(--pin-size) * .75);
  width: calc(var(--pin-size) * 1.5);
  height: calc(var(--pin-size) * 1.5);
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(60,40,20,.14), rgba(60,40,20,.05) 60%, transparent);
  pointer-events: none;
}
.portrait-frame { position: relative; aspect-ratio: 1; overflow: hidden; background: #e7e2d8; }
.portrait-frame img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.portrait-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(40,30,20,.1), inset 0 1px 4px rgba(40,30,20,.14);
}
/* Glossy print. At rest only a faint satin gloss shows; a soft specular glint
   travels across the surface while the photo moves through the light. */
.portrait-sheen {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(158deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.04) 28%, rgba(255,255,255,0) 46%),
    linear-gradient(0deg, rgba(0,0,0,.05), rgba(0,0,0,0) 30%);
}
.portrait-sheen::after {
  content: "";
  position: absolute;
  inset: -20%;
  background: radial-gradient(ellipse 34% 52% at var(--sheen-x) 30%, rgba(255,255,255,.42), rgba(255,255,255,.12) 45%, rgba(255,255,255,0) 72%);
  mix-blend-mode: soft-light;
  opacity: var(--sheen-strength);
}
/* Caption: handwritten on the print, Caramel for English and 851 MkPOP for Japanese. */
.portrait-reference {
  position: absolute;
  left: 18px;
  bottom: 23px;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  color: #86868b;
  font: 400 24px/1 "Caramel", var(--font);
  letter-spacing: 0;
  transition: color .2s ease;
}
html[lang="ja"] .portrait-reference { font: 400 15px/1 "851 MkPOP", "GenShin Gothic", sans-serif; }
.portrait-reference:hover { color: var(--blue); }

/* Push pin: fixed to the wall, the one thing that never moves. */
.pushpin {
  position: absolute;
  z-index: 30;
  top: calc(12px + var(--pin-y));
  left: 50%;
  width: var(--pin-size);
  height: var(--pin-size);
  margin: calc(var(--pin-size) / -2) 0 0 calc(var(--pin-size) / -2);
  border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #fff 0 5%, #c7c7cc 14%, #6e6e73 42%, #3a3a3c 70%, #1d1d1f 100%);
  box-shadow:
    inset -2px -3px 4px rgba(0,0,0,.35),
    inset 1px 1px 2px rgba(255,255,255,.45),
    0 1px 1px rgba(30,15,5,.3),
    var(--pin-shadow) calc(var(--pin-shadow) * 1.5) calc(2px + var(--pin-shadow)) rgba(40,25,10,.3);
  pointer-events: none;
}
/* The raised cap in the middle of the head. */
.pushpin::before {
  content: "";
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, rgba(255,255,255,.9) 0 10%, #aeaeb2 36%, #48484a 82%);
  box-shadow: 0 1px 2px rgba(0,0,0,.35);
}
[data-theme="dark"] .pushpin { background: radial-gradient(circle at 34% 30%, #fff 0 6%, #f2f2f7 16%, #c7c7cc 44%, #8e8e93 74%, #636366 100%); box-shadow: inset -2px -3px 4px rgba(0,0,0,.3), inset 1px 1px 2px rgba(255,255,255,.35), 0 1px 1px rgba(0,0,0,.5), var(--pin-shadow) calc(var(--pin-shadow) * 1.5) calc(2px + var(--pin-shadow)) rgba(0,0,0,.5); }
[data-theme="dark"] .pushpin::before { background: radial-gradient(circle at 38% 32%, #fff 0 12%, #e5e5ea 40%, #aeaeb2 85%); }
[data-theme="dark"] .portrait-card::before { background: radial-gradient(closest-side, rgba(0,0,0,.35), rgba(0,0,0,.1) 60%, transparent); }
.portrait-stage.is-entering { animation: photo-arrival 900ms cubic-bezier(.2,.9,.25,1) both; }
@keyframes photo-arrival { from { opacity: 0; translate: 0 -48px; } to { opacity: 1; translate: 0 0; } }

[data-theme="dark"] .portrait-card {
  background: linear-gradient(176deg, rgba(255,255,255,.06), rgba(255,255,255,0) 24%), url("../img/paper-grain.svg"), #2e2b27;
  box-shadow:
    0 0 0 .5px rgba(255,255,255,.08),
    0 1px 1.5px rgba(0,0,0,.4),
    calc(var(--shadow-x) * .3) calc(var(--shadow-y) * .3) calc(var(--shadow-blur) * .35) rgba(0,0,0,.45),
    var(--shadow-x) var(--shadow-y) var(--shadow-blur) rgba(0,0,0,.55);
}
[data-theme="dark"] .portrait-frame img { filter: brightness(.88); }
[data-theme="dark"] .portrait-sheen { opacity: .6; }
[data-theme="dark"] .portrait-reference { color: #8e8e93; }
[data-theme="dark"] .portrait-reference:hover { color: var(--blue); }
`;
