import { css } from "../../build/css.ts";

/** Mask-based icons, so they take the text color. */
export default css`
/* ---------- Icons (Ionicons, MIT: img/icons/LICENSE-ionicons.txt) ----------
   Each icon is a mask filled with the current text colour, so it follows links, hovers and themes. */
.icon {
  display: inline-block; flex: none; width: 1em; height: 1em; vertical-align: -.125em;
  background-color: currentColor;
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
}
.icon-note { --icon: url("../img/icons/musical-note.svg"); }
.icon-airplane { --icon: url("../img/icons/airplane.svg"); }
.icon-controller { --icon: url("../img/icons/game-controller.svg"); }
.icon-sun { --icon: url("../img/icons/sunny.svg"); }
.icon-moon { --icon: url("../img/icons/moon.svg"); }
.icon-close { --icon: url("../img/icons/close-outline.svg"); }
.icon-chevron { --icon: url("../img/icons/chevron-forward-outline.svg"); width: .7em; height: .7em; vertical-align: -.02em; }
.icon-chevron-back { --icon: url("../img/icons/chevron-back-outline.svg"); }
/* Apple marks outbound links with a north-east arrow. */
.icon-external { --icon: url("../img/icons/arrow-forward-outline.svg"); width: .72em; height: .72em; vertical-align: -.02em; transform: rotate(-45deg); }
.portrait-reference .icon-external { width: 11px; height: 11px; }

/* Music rail: arrow buttons either side of the dots, and mouse drag on the rail. */
.music-controls { gap: 10px; padding: 5px; }
.music-arrow {
  width: 30px; height: 30px; padding: 0; border: 0; border-radius: 50%;
  display: grid; place-items: center;
  background: transparent; color: var(--ink); cursor: pointer;
  transition: background-color .2s ease, opacity .2s ease;
}
.music-arrow .icon { width: 15px; height: 15px; }
.music-arrow:hover { background: rgba(0,0,0,.08); }
[data-theme="dark"] .music-arrow:hover { background: rgba(255,255,255,.14); }
.music-arrow:disabled { opacity: .3; cursor: default; background: transparent; }
`;
