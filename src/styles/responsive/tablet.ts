import { css } from "../../build/css.ts";

/** Tablet and small-laptop overrides. */
export default css`
@media (max-width: 1068px) {
  .hero { min-height: 0; padding-block: 72px 88px; grid-template-columns: minmax(0, 1fr) minmax(280px, .9fr); }
  .music-card, .flight-card { grid-column: span 6; }
  .music-slide-inner { gap: 40px; }
  .playlist-art, .album-cover, .recent-art { width: min(320px, 100%); }
  .product-pair .product-tagline { min-height: 0; }
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 56px; text-align: center; }
  .hero h1 { margin-inline: auto; }
  .actions, .identity-note { justify-content: center; }
  .music-card, .flight-card { grid-column: 1 / -1; }
  .product-pair { grid-template-columns: 1fr; }
}
`;
