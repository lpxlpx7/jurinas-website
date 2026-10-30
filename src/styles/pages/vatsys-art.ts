import { css } from "../../build/css.ts";

/** VATSYS Plugins tile artwork: the vatSys icon and its plugins' glyphs in one row, no backgrounds. */
export default css`
.vatsys-row { display: flex; align-items: flex-start; gap: 48px; }
.vatsys-app { --tile: 84px; margin: 0; display: grid; justify-items: center; gap: 14px; }
.vatsys-app.is-host { --tile: 116px; }
/* Captions share a baseline: each icon box is centred in a box as tall as the host's. */
.vatsys-tile {
  width: var(--tile); height: var(--tile); margin-block: calc((116px - var(--tile)) / 2);
  display: grid; place-items: center;
  color: #0b98b4;
}
[data-theme="dark"] .vatsys-tile { color: #3fe3f7; }
.vatsys-tile svg { width: 64%; height: 64%; }
.vatsys-tile img { width: 100%; height: 100%; }
.vatsys-app figcaption { color: var(--muted); font-size: 12px; letter-spacing: -.01em; white-space: nowrap; }
.vatsys-divider { width: 1px; height: 84px; margin-top: 16px; background: rgba(0,0,0,.12); }
[data-theme="dark"] .vatsys-divider { background: rgba(255,255,255,.14); }

@media (max-width: 734px) {
  .vatsys-row { gap: 16px; }
  .vatsys-app { --tile: 50px; gap: 10px; }
  .vatsys-app.is-host { --tile: 68px; }
  .vatsys-tile { margin-block: calc((68px - var(--tile)) / 2); }
  .vatsys-app figcaption { font-size: 10px; }
  .vatsys-divider { height: 50px; margin-top: 9px; }
}
`;
