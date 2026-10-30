import { css } from "../../build/css.ts";

/** Reiwa gallery (shown only when photos exist). */
export default css`
.reiwa-section { padding-block: 40px 96px; }
.reiwa-heading h2 { margin: 0; font-size: clamp(40px, 5vw, 64px); line-height: 1.05; letter-spacing: -.03em; }
.reiwa-heading > p:last-child { max-width: 560px; color: var(--muted); font-size: 19px; }
.reiwa-gallery { margin-top: 36px; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.reiwa-gallery img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius-media); cursor: zoom-in; }
`;
