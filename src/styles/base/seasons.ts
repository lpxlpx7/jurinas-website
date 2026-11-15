import { css } from "../../build/css.ts";

/**
 * Seasonal canvases. None of them take clicks (dragging is handled on the document, see client/features/seasons).
 * Decorations are placed on the page and scroll with it: "back" ones sit behind the page's text and pictures,
 * "front" ones above them but under the header, menus and lightbox. The falling layer covers the screen.
 */
export default css`
.season-item { position: absolute; top: 0; left: 0; pointer-events: none; }
.season-item-back { z-index: -1; }
.season-item-front { z-index: 20; }
.season-fall { position: fixed; z-index: 20; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.season-grab, .season-grab * { cursor: grab; }
.season-dragging, .season-dragging * { cursor: grabbing !important; user-select: none; -webkit-user-select: none; }
.season-hide {
  position: absolute; z-index: 25; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%;
  display: grid; place-items: center; background: rgba(60,60,64,.72); color: #fff; font: 500 17px/1 var(--font); cursor: pointer;
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); animation: fade-in .2s ease both;
}
.season-hide[hidden] { display: none; }
.season-hide:hover { background: rgba(40,40,44,.9); }
@media print { .season-item, .season-fall, .season-hide { display: none; } }
`;
