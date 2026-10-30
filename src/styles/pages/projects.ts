import { css } from "../../build/css.ts";

/** Projects page feature tiles and their artwork. */
export default css`
.product-main { padding-bottom: 12px; }
.product-intro { padding-block: 80px 64px; text-align: center; }
.product-intro h1 { margin: 0; font-size: clamp(44px, 5.6vw, 72px); font-weight: 700; line-height: 1.06; letter-spacing: -.03em; }
.product-intro > p:last-child { max-width: 640px; margin: 18px auto 0; color: var(--muted); font-size: 21px; line-height: 1.42; }
.product-stack { display: grid; gap: 12px; padding-inline: 12px; }
.product-feature { overflow: hidden; padding-top: 60px; border-radius: var(--radius-tile); background: var(--surface); text-align: center; }
.product-copy { position: relative; z-index: 1; padding-inline: 24px; }
.product-copy .eyebrow { margin-bottom: 10px; font-size: 17px; }
.product-copy h2 { margin: 0; font-size: clamp(36px, 4.6vw, 56px); font-weight: 700; line-height: 1.07; letter-spacing: -.03em; }
.product-tagline { max-width: 660px; margin: 14px auto 22px; color: var(--muted); font-size: 21px; line-height: 1.38; }
.product-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px 26px; }
.product-link { display: inline-flex; align-items: center; gap: 4px; min-height: 44px; color: var(--blue); font-size: 17px; }
.product-link:hover > span:first-child { text-decoration: underline; text-underline-offset: 3px; }
.product-link .icon { width: 15px; height: 15px; }
.product-art { position: relative; width: min(900px, calc(100% - 48px)); height: 300px; margin: 36px auto 0; display: flex; align-items: center; justify-content: center; user-select: none; }

.product-vatsys { background: #eaf3fa; }
.product-vatsys .product-copy h2 { color: #1d1d1f; }
.product-vatsys .eyebrow, .product-vatsys .product-tagline { color: #6e6e73; }
[data-theme="dark"] .product-vatsys { background: #0f2132; }
[data-theme="dark"] .product-vatsys .product-copy h2 { color: #f5f5f7; }
[data-theme="dark"] .product-vatsys .eyebrow, [data-theme="dark"] .product-vatsys .product-tagline { color: #a1a1a6; }

/* VATSIM Quarterly ATC Activity: a calm quarterly bar chart. */
.product-vqaa { background: linear-gradient(180deg, #f3f0ff 0%, #ebe6fd 100%); }
.product-vqaa .product-copy h2 { color: #1d1d1f; }
.product-vqaa .eyebrow, .product-vqaa .product-tagline { color: #6e6e73; }
.product-vqaa .product-link { color: #6c3fd8; }
.vqaa-art { height: 320px; color: #7c4ff0; }
.vqaa-art svg { width: min(720px, 100%); height: 100%; overflow: visible; }
.vqaa-bar { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(.08); transition: transform 1.2s var(--ease-out); }
.is-visible .vqaa-bar { transform: none; }
.is-visible .vqaa-bar:nth-of-type(2) { transition-delay: .08s; }
.is-visible .vqaa-bar:nth-of-type(3) { transition-delay: .16s; }
.is-visible .vqaa-bar:nth-of-type(4) { transition-delay: .24s; }
.vqaa-axis { color: #6e6e73; font: 600 13px var(--font); letter-spacing: .08em; }
[data-theme="dark"] .product-vqaa { background: linear-gradient(180deg, #1c1630 0%, #150f26 100%); }
[data-theme="dark"] .product-vqaa .product-copy h2 { color: #f5f5f7; }
[data-theme="dark"] .product-vqaa .eyebrow, [data-theme="dark"] .product-vqaa .product-tagline, [data-theme="dark"] .vqaa-axis { color: #a1a1a6; }
[data-theme="dark"] .product-vqaa .product-link { color: #b9a0ff; }
[data-theme="dark"] .vqaa-art { color: #a58bff; }

.product-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.product-pair .product-feature { padding-top: 52px; }
.product-pair h2 { font-size: clamp(32px, 3.3vw, 44px); }
.product-pair .product-tagline { max-width: 440px; min-height: 84px; font-size: 19px; }
.product-atc { background: #eaf3fa; }
.product-route { background: var(--surface); }
.product-community { background: #f0ecf7; }
[data-theme="dark"] .product-atc { background: #101d2b; }
[data-theme="dark"] .product-community { background: #1d1928; }
.type-art { height: 240px; display: flex; flex-direction: column; gap: 13px; color: var(--blue); font: 700 clamp(64px, 9vw, 130px)/1 var(--display-font); letter-spacing: -.05em; }
.type-art span { font: 600 12px var(--font); letter-spacing: .17em; }
.route-art { height: 240px; gap: 18px; color: var(--blue); }
.route-art > span { font: 700 clamp(28px, 5vw, 56px)/1 var(--display-font); letter-spacing: -.04em; }
.route-art svg { width: min(450px, 46%); }
.bot-art { height: 240px; color: #5865f2; }
.discord-mark { width: min(190px, 48%); height: auto; }
`;
