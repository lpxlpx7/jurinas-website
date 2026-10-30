import { css } from "../../build/css.ts";

/** Music, flight and game cards. */
export default css`
.interests { padding-block: 96px 120px; }
.section-heading { margin-bottom: 48px; }
.section-heading h2 { margin: 0; font-size: clamp(44px, 5.6vw, 72px); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; }
.card-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 20px; }
.interest-card {
  position: relative; min-height: 440px; overflow: hidden; padding: 40px;
  border-radius: var(--radius-tile); background: var(--surface); box-shadow: var(--tile-shadow);
  transition: transform .6s var(--ease-out), box-shadow .6s var(--ease-out);
}
@media (hover: hover) { .interest-card:hover { transform: scale(1.012); box-shadow: var(--tile-shadow-hover); } }
.card-icon { width: 48px; height: 48px; margin-bottom: 80px; border-radius: 50%; display: grid; place-items: center; background: rgba(0,0,0,.06); color: var(--ink); }
.card-icon .icon { width: 22px; height: 22px; }
.card-kicker { margin: 0 0 6px; color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.interest-card h3 { margin: 0; font-size: clamp(34px, 4vw, 48px); font-weight: 700; line-height: 1.05; letter-spacing: -.02em; }
.interest-card > p:last-of-type, .games-copy > p:last-of-type { max-width: 520px; margin: 14px 0 0; color: var(--muted); font-size: 19px; line-height: 1.42; }

.music-card { grid-column: span 7; color: #fff; background: radial-gradient(90% 80% at 100% 100%, rgba(250,45,72,.55), transparent 62%), radial-gradient(70% 60% at 0% 0%, rgba(130,87,230,.38), transparent 60%), #111113; }
.music-card .card-icon { color: #fff; background: rgba(255,255,255,.14); }
.music-card .card-kicker, .music-card > p:last-of-type { color: rgba(255,255,255,.66); }
.music-card p a { color: #fff; text-decoration: underline; text-decoration-color: rgba(255,255,255,.4); text-underline-offset: 3px; }
.sound-wave { position: absolute; right: 36px; bottom: 36px; height: 72px; display: flex; align-items: center; gap: 6px; opacity: .55; }
.sound-wave i { width: 5px; height: var(--height, 35%); border-radius: 99px; background: #fff; animation: wave 1.4s ease-in-out infinite alternate; }
.sound-wave i:nth-child(2), .sound-wave i:nth-child(8) { --height: 65%; animation-delay: -.2s; }
.sound-wave i:nth-child(3), .sound-wave i:nth-child(7) { --height: 95%; animation-delay: -.5s; }
.sound-wave i:nth-child(4), .sound-wave i:nth-child(6) { --height: 52%; animation-delay: -.8s; }
.sound-wave i:nth-child(5) { --height: 80%; animation-delay: -1.1s; }
@keyframes wave { to { height: 20%; } }

.flight-card { grid-column: span 5; color: #1d1d1f; background: linear-gradient(160deg, #eef6ff 0%, #d9ebff 100%); }
.flight-card .card-icon { color: #0071e3; background: rgba(0,113,227,.1); }
.flight-card .card-kicker { color: #6e6e73; }
.flight-card > p:last-of-type { color: #515154; }
/* A slowly turning globe drawn on canvas (js/globe.js); everything stays inside the sphere. */
.flight-globe { position: absolute; right: -14%; bottom: -30%; width: 78%; aspect-ratio: 1; color: #0071e3; pointer-events: none; }
.flight-card > :not(.flight-globe) { position: relative; z-index: 1; }
.flight-globe canvas { width: 100%; height: 100%; display: block; }
[data-theme="dark"] .flight-card { color: #f5f5f7; background: linear-gradient(160deg, #0f2236 0%, #0a1726 100%); }
[data-theme="dark"] .flight-card .card-icon, [data-theme="dark"] .flight-globe { color: #2997ff; }
[data-theme="dark"] .flight-card .card-icon { background: rgba(41,151,255,.14); }
[data-theme="dark"] .flight-card .card-kicker, [data-theme="dark"] .flight-card > p:last-of-type { color: #a1a1a6; }

.games-card { grid-column: 1 / -1; min-height: 380px; display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 28px; color: #1d1d1f; background: #fff; }
.games-copy { position: relative; z-index: 1; }
.games-card .card-icon { color: #1d1d1f; }
.games-logo-wrap { position: relative; min-height: 240px; display: grid; place-items: center; }
/* A soft warm halo, not a hard spotlight. */
.games-glow { position: absolute; width: 78%; aspect-ratio: 1.6; border-radius: 50%; background: radial-gradient(closest-side, rgba(249,158,26,.22), rgba(249,158,26,.08) 55%, transparent); filter: blur(18px); }
.games-logo { position: relative; width: min(260px, 100%); max-height: 180px; object-fit: contain; filter: drop-shadow(0 14px 22px rgba(0,0,0,.18)); transition: transform .7s var(--ease-out); }
@media (hover: hover) { .games-card:hover .games-logo { transform: scale(1.04); } }
/* The Overwatch wordmark is dark, so this tile stays light in dark mode. */
[data-theme="dark"] .games-card { background: #e8e8ed; }
[data-theme="dark"] .games-card .card-kicker, [data-theme="dark"] .games-copy > p:last-of-type { color: #6e6e73; }
[data-theme="dark"] .card-icon { background: rgba(255,255,255,.1); }
[data-theme="dark"] .games-card .card-icon { background: rgba(0,0,0,.06); }
`;
