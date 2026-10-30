import { css } from "../../build/css.ts";

/** Music rail, slides, dots and arrows. */
export default css`
.music-showcase { position: relative; padding-bottom: 104px; outline: none; }
.music-viewport { overflow: hidden; }
.music-track {
  position: relative; display: flex; gap: 20px;
  padding: 8px max(var(--gutter), calc((100% - 1120px) / 2)) 40px;
  overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none;
}
.music-track::-webkit-scrollbar { display: none; }
.music-slide {
  position: relative; flex: 0 0 min(86%, 980px); min-height: 580px;
  overflow: hidden; isolation: isolate; display: grid; align-items: center;
  border-radius: var(--radius-tile); background: #09090b; color: #fff;
  scroll-snap-align: center; scroll-snap-stop: always; box-shadow: 0 18px 42px rgba(0,0,0,.12);
}
/* A mouse drag glides to its slide with snapping off, so the two never fight. */
.music-track.is-settling { scroll-snap-type: none; }
[data-theme="dark"] .music-slide { box-shadow: 0 0 0 1px rgba(255,255,255,.06); }
.music-backdrop, .music-vignette, .recent-backdrop { position: absolute; z-index: 0; inset: 0; width: 100%; height: 100%; }
.music-backdrop { object-fit: cover; filter: saturate(.86) contrast(1.04); }
.music-vignette { background: linear-gradient(90deg, rgba(5,5,8,.88), rgba(5,5,8,.55) 45%, rgba(5,5,8,.2) 75%, rgba(5,5,8,.55)), linear-gradient(180deg, rgba(0,0,0,.3), transparent 35%, rgba(0,0,0,.65)); }
.music-slide-inner { position: relative; z-index: 1; width: 100%; min-height: 580px; padding: 64px clamp(28px, 5vw, 64px) 72px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: center; gap: clamp(32px, 5vw, 64px); }
.playlist-copy h2 { margin: 0; font-size: clamp(48px, 6.4vw, 88px); font-weight: 700; line-height: 1.02; letter-spacing: -.035em; }
.music-slide-yuika .playlist-copy h2 { white-space: nowrap; font-size: clamp(44px, 5.8vw, 80px); }
.playlist-copy .eyebrow { color: #ff9f0a; }
.playlist-copy > p:not(.eyebrow) { max-width: 460px; margin: 20px 0 28px; color: rgba(255,255,255,.72); font-size: 19px; line-height: 1.45; }
.music-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; }
.playlist-art, .album-cover, .recent-art { justify-self: center; }
.vinyl { position: relative; width: 100%; aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; background: repeating-radial-gradient(circle, transparent 0 5px, rgba(255,255,255,.035) 6px 7px), conic-gradient(#08080a, #34343a, #0c0c0f, #28282d, #08080a); box-shadow: 0 24px 60px rgba(0,0,0,.5); animation: spin 14s linear infinite; }
.playlist-art { display: block; width: min(400px, 100%); }
.vinyl img { width: 58%; aspect-ratio: 1; border-radius: 50%; object-fit: cover; }
.vinyl span { position: absolute; width: 13px; height: 13px; border: 3px solid rgba(255,255,255,.6); border-radius: 50%; background: #09090b; }
@keyframes spin { to { transform: rotate(360deg); } }
.album-cover { display: block; width: min(380px, 100%); aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-media); box-shadow: 0 24px 60px rgba(0,0,0,.45); transition: transform .6s var(--ease-out); }
.album-cover img { width: 100%; height: 100%; object-fit: cover; }
@media (hover: hover) { .album-cover:hover { transform: scale(1.03); } }
.recent-backdrop { background: radial-gradient(circle at 20% 24%, rgba(255,55,95,.65), transparent 25rem), radial-gradient(circle at 78% 32%, rgba(130,87,230,.7), transparent 30rem), radial-gradient(circle at 45% 88%, rgba(10,132,255,.58), transparent 28rem), #121018; }
.recent-art { width: min(330px, 100%); aspect-ratio: 1; border-radius: 28%; display: grid; place-items: center; background: linear-gradient(145deg, rgba(255,255,255,.25), rgba(255,255,255,.06)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2), 0 24px 60px rgba(0,0,0,.3); }
.recent-art .icon { width: 42%; height: 42%; color: #fff; }
.music-controls {
  position: absolute; z-index: 2; left: 50%; bottom: 52px; transform: translateX(-50%);
  padding: 11px 14px; border-radius: 999px; display: flex; align-items: center;
  background: rgba(210,210,215,.64);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
[data-theme="dark"] .music-controls { background: rgba(66,66,69,.64); }
.music-dots { display: flex; align-items: center; gap: 8px; }
.music-dot { position: relative; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 999px; background: rgba(0,0,0,.28); font-size: 0; cursor: pointer; transition: width .3s var(--ease-out), background-color .2s ease; }
/* Larger invisible hit area for touch. */
.music-dot::after { content: ""; position: absolute; inset: -12px -6px; }
.music-dot span { display: none; }
.music-dot.is-active { width: 26px; background: var(--ink); }
.music-dot:not(.is-active):hover { background: rgba(0,0,0,.5); }
[data-theme="dark"] .music-dot { background: rgba(255,255,255,.35); }
[data-theme="dark"] .music-dot.is-active { background: #f5f5f7; }
@media (hover: hover) and (pointer: fine) {
  .music-track { cursor: grab; }
  .music-track.is-dragging { cursor: grabbing; scroll-snap-type: none; user-select: none; -webkit-user-select: none; }
  .music-track.is-dragging a { pointer-events: none; }
}
`;
