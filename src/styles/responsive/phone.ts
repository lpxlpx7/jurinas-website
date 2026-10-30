import { css } from "../../build/css.ts";

/** Phone overrides. */
export default css`
@media (max-width: 734px) {
  :root { --gutter: 20px; --radius-tile: 24px; }
  body { font-size: 16px; }
  .nav-links, .nav .language-switch { display: none; }
  .menu-button { display: grid; }
  .nav-right { gap: 4px; }
  .eyebrow { font-size: 15px; }

  .hero { padding-block: 44px 64px; gap: 40px; }
  .hero h1 { font-size: clamp(46px, 13.5vw, 64px); }
  .actions { margin-top: 26px; }
  .identity-note { margin-top: 20px; font-size: 13px; }

  .interests { padding-block: 64px 80px; }
  .section-heading { margin-bottom: 28px; }
  .section-heading h2 { font-size: clamp(36px, 10.5vw, 48px); }
  .card-grid { gap: 14px; }
  .interest-card { min-height: 380px; padding: 28px; }
  .card-icon { margin-bottom: 56px; }
  .interest-card h3 { font-size: 34px; }
  .interest-card > p:last-of-type, .games-copy > p:last-of-type { font-size: 17px; }
  .sound-wave { right: 28px; bottom: 28px; height: 56px; }
  .flight-globe { width: 92%; right: -24%; bottom: -46%; }
  .games-card { min-height: 0; grid-template-columns: 1fr; gap: 8px; }
  .games-logo-wrap { min-height: 170px; }
  .games-logo { width: min(220px, 80%); }

  .music-showcase { padding-bottom: 84px; }
  .music-track { gap: 12px; padding: 4px var(--gutter) 32px; scroll-padding-inline: var(--gutter); }
  .music-slide { flex-basis: calc(100% - var(--gutter) * 2 + 4px); min-height: 0; scroll-snap-align: center; }
  .music-slide-inner { min-height: 600px; padding: 44px 24px 56px; grid-template-columns: 1fr; align-content: center; gap: 30px; text-align: center; }
  .music-vignette { background: linear-gradient(180deg, rgba(5,5,8,.5), rgba(5,5,8,.6) 40%, rgba(5,5,8,.9)); }
  .playlist-art, .album-cover { width: min(270px, 72vw); }
  .recent-art { width: min(220px, 64vw); }
  .playlist-copy h2 { font-size: clamp(40px, 12vw, 56px); }
  .music-slide-yuika .playlist-copy h2 { font-size: clamp(34px, 10.5vw, 52px); }
  .playlist-copy > p:not(.eyebrow) { margin: 14px auto 22px; font-size: 17px; }
  .music-actions { flex-direction: column; gap: 12px; }
  .music-controls { bottom: 40px; padding: 4px; gap: 8px; }

  .time-inline { justify-content: stretch; padding-bottom: 28px; }
  .footer-clocks { width: 100%; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; }
  .footer-clocks div { justify-items: start; }

  .footer-directory { grid-template-columns: 1fr 1fr; gap: 28px 20px; padding-block: 28px; }
  .footer-column:last-child { grid-column: 1 / -1; }
  .footer-column a { font-size: 14px; }
  .footer-top, .footer-bottom { flex-direction: column; align-items: flex-start; }
  .pride-note { flex-wrap: wrap; }

  .lightbox-stage { padding: 72px 12px; }
  .lightbox-image { max-height: calc(100svh - 180px); border-radius: 8px; }
  .lightbox-prev, .lightbox-next { top: auto; bottom: max(16px, env(safe-area-inset-bottom)); transform: none; }
  .lightbox-count { bottom: max(26px, calc(env(safe-area-inset-bottom) + 10px)); }

  .product-intro { padding-block: 52px 40px; padding-inline: var(--gutter); }
  .product-intro h1 { font-size: clamp(36px, 10.5vw, 48px); }
  .product-intro > p:last-child { font-size: 17px; }
  .product-stack { gap: 10px; padding-inline: 10px; }
  .product-feature { padding-top: 44px; }
  .product-copy { padding-inline: 20px; }
  .product-copy .eyebrow { font-size: 15px; }
  .product-copy h2, .product-pair h2 { font-size: clamp(30px, 8.6vw, 40px); }
  .product-tagline, .product-pair .product-tagline { font-size: 17px; }
  .product-actions { flex-direction: column; gap: 6px; }
  .product-art { width: calc(100% - 32px); height: 200px; margin-top: 24px; }
  .vqaa-art { height: 220px; }
  .route-art { gap: 8px; }
  .type-art, .bot-art { height: 180px; }

  .support-hero { padding-block: 60px 40px; }
  .support-lead { font-size: 17px; }
  .support-emails { grid-template-columns: 1fr; margin-top: 32px; gap: 12px; }
  .support-email { padding: 22px 24px; }
  .support-email a { font-size: 19px; }
}
`;
