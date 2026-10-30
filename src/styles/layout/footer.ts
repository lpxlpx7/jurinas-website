import { css } from "../../build/css.ts";

/** Footer directory, source link and pride flags. */
export default css`
.site-footer { padding-block: 8px max(34px, env(safe-area-inset-bottom)); color: var(--muted); font-size: 12px; line-height: 1.33; letter-spacing: -.01em; }
.footer-directory { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px; padding-block: 40px 36px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.footer-column { display: grid; align-content: start; gap: 10px; }
.footer-column h2 { margin: 0 0 4px; color: var(--ink); font-size: 12px; font-weight: 600; }
.footer-column a { width: fit-content; }
.footer-column a:hover, .footer-top a:hover { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
.footer-top, .footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px 24px; }
.footer-top { padding-block: 18px; border-bottom: 1px solid var(--line); }
.footer-bottom { padding-top: 18px; }
.footer-bottom p { margin: 0; }
.pride-note { display: flex; align-items: center; gap: 10px; }
.pride-flags { display: inline-flex; gap: 8px; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.pride-flag { width: 27px; height: 18px; border-radius: 3px; display: block; box-shadow: 0 0 0 1px rgba(0,0,0,.08); }
[data-theme="dark"] .pride-flag { box-shadow: 0 0 0 1px rgba(255,255,255,.15); }
.pride-flag-trans { background: linear-gradient(180deg,#5bcefa 0 20%,#f5a9b8 20% 40%,#fff 40% 60%,#f5a9b8 60% 80%,#5bcefa 80%); }
.pride-flag-lgbt { background: linear-gradient(180deg,#e40303 0 16.6%,#ff8c00 16.6% 33.2%,#ffed00 33.2% 49.8%,#008026 49.8% 66.4%,#004dff 66.4% 83%,#750787 83%); }
`;
