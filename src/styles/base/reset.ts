import { css } from "../../build/css.ts";

/** Element defaults, focus rings and the page shell. */
export default css`
* { box-sizing: border-box; }
/* "clip" keeps a swinging photo from widening the page on phones without breaking the sticky header. */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: 48px; overflow-x: hidden; }
body { margin: 0; min-width: 320px; overflow-x: clip; background: var(--page); color: var(--ink); font-family: var(--font); font-size: 17px; line-height: 1.47; letter-spacing: -.022em; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -webkit-tap-highlight-color: transparent; }
html[lang="ja"] body { font-family: "GenShin Gothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif; letter-spacing: 0; }
html:not([lang="ja"]) :is(h1, h2, h3, .brand) { font-family: var(--display-font); }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
/* Photos are for looking at: no drag-out, long-press callout or selection. */
img { -webkit-user-drag: none; -webkit-touch-callout: none; user-select: none; }
button { -webkit-tap-highlight-color: transparent; }
::selection { background: rgba(130,87,230,.24); }
:is(a, button, input, [tabindex]):focus-visible { outline: 2px solid var(--blue); outline-offset: 4px; }
.language-button:focus-visible + span { outline: 2px solid var(--blue); outline-offset: 4px; border-radius: 4px; }
.shell { width: min(1120px, calc(100% - var(--gutter) * 2)); margin-inline: auto; }
.eyebrow { margin: 0 0 14px; color: var(--muted); font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
/* Set by the inline theme script and cleared by main.js once the page is in its starting state. */
.is-booting *, .is-booting *::before, .is-booting *::after { transition: none !important; }
`;
