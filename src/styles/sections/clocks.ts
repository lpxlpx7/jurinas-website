import { css } from "../../build/css.ts";

/** Local time and UTC clocks. */
export default css`
.time-inline { display: flex; justify-content: flex-end; padding-block: 8px 34px; }
.footer-clocks { display: grid; grid-template-columns: repeat(2, auto); gap: 32px; text-align: right; }
.footer-clocks div { display: grid; justify-items: end; gap: 2px; }
.footer-clocks span { color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.footer-clocks time { color: var(--ink); font-size: 17px; font-variant-numeric: tabular-nums; }
.footer-clocks small { color: var(--muted); font-size: 11px; }
`;
