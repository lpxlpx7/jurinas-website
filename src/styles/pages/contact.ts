import { css } from "../../build/css.ts";

/** Contact page. */
export default css`
.support-main { padding-bottom: 72px; }
.support-hero { padding-block: 96px 64px; text-align: center; }
.support-hero h1 { margin: 0; font-size: clamp(44px, 6vw, 72px); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; }
.support-lead { max-width: 600px; margin: 16px auto 0; color: var(--muted); font-size: 21px; line-height: 1.42; }
.support-emails { width: min(760px, 100%); margin: 48px auto 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.support-email { min-width: 0; padding: 28px 30px; border-radius: 22px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; background: var(--surface); box-shadow: var(--tile-shadow); text-align: left; }
.support-email small { color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.support-email a { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; color: var(--blue); font-size: 21px; line-height: 1.3; white-space: nowrap; }
.support-email a .icon { width: .72em; height: .72em; }
.support-email a:hover { text-decoration: underline; text-underline-offset: 4px; }
`;
