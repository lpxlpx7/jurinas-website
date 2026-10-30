import { css } from "../../build/css.ts";

/** Full-screen photo viewer. */
export default css`
.gallery-lightbox[hidden] { display: none; }
.gallery-lightbox { position: fixed; z-index: 100; inset: 0; animation: fade-in .3s ease both; }
.gallery-lightbox[aria-hidden="true"] { animation: fade-out .24s ease both; }
@keyframes fade-in { from { opacity: 0; } }
@keyframes fade-out { to { opacity: 0; } }
.lightbox-open { overflow: hidden; }
.lightbox-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.62); -webkit-backdrop-filter: blur(28px) saturate(140%); backdrop-filter: blur(28px) saturate(140%); }
.lightbox-stage { position: absolute; inset: 0; display: grid; place-items: center; padding: 72px; pointer-events: none; }
.lightbox-image { max-width: min(1180px, 100%); max-height: calc(100svh - 160px); object-fit: contain; border-radius: 12px; box-shadow: 0 30px 80px rgba(0,0,0,.5); pointer-events: auto; }
.lightbox-control, .lightbox-count { position: absolute; z-index: 2; border: 0; color: #fff; background: rgba(60,60,64,.6); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); pointer-events: auto; }
.lightbox-control { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-size: 22px; cursor: pointer; transition: background-color .2s ease; }
.lightbox-control:hover { background: rgba(90,90,94,.75); }
.lightbox-close { top: max(20px, env(safe-area-inset-top)); right: max(20px, env(safe-area-inset-right)); }
.lightbox-prev { left: max(20px, env(safe-area-inset-left)); top: 50%; transform: translateY(-50%); }
.lightbox-next { right: max(20px, env(safe-area-inset-right)); top: 50%; transform: translateY(-50%); }
.lightbox-count { left: 50%; bottom: max(24px, env(safe-area-inset-bottom)); padding: 8px 14px; border-radius: 99px; transform: translateX(-50%); font-size: 12px; font-variant-numeric: tabular-nums; }
`;
