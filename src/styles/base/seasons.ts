import { css } from "../../build/css.ts";

/**
 * Seasonal canvases, both click-through and under the header, menus and lightbox:
 * the decoration strip sits at the top of the page and scrolls away with it; the falling layer covers the screen.
 */
export default css`
.season-decor { position: absolute; z-index: 20; top: 0; left: 0; width: 100%; pointer-events: none; }
.season-fall { position: fixed; z-index: 20; inset: 0; width: 100%; height: 100%; pointer-events: none; }
@media print { .season-decor, .season-fall { display: none; } }
`;
