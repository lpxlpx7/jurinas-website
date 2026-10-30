/*
 * Artwork for the VATSYS Plugins tile (styles: pages/vatsys-art): the vatSys icon and its three
 * plugins as bare line glyphs in vatSys cyan, side by side. Decorative only.
 */

const stroke = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

const plugins: Array<{ name: string; glyph: string }> = [
  {
    name: "Drag and Zoom",
    // Four-way move arrows.
    glyph: `<path d="M12 3.5v17M3.5 12h17M12 3.5 9.5 6M12 3.5 14.5 6M12 20.5 9.5 18M12 20.5l2.5-2.5M3.5 12 6 9.5M3.5 12 6 14.5M20.5 12 18 9.5M20.5 12 18 14.5" ${stroke}/>`,
  },
  {
    name: "Discord RP",
    // Speech bubble with a presence dot.
    glyph: `<path d="M5 7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v5.5a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15a2 2 0 0 1-2-2z" ${stroke}/><circle cx="18.5" cy="18" r="2.4" fill="currentColor"/>`,
  },
  {
    name: "Plugins Manager",
    // Plugin tiles, one being added.
    glyph: `<rect x="4" y="4" width="7" height="7" rx="1.8" ${stroke}/><rect x="13" y="4" width="7" height="7" rx="1.8" ${stroke}/><rect x="4" y="13" width="7" height="7" rx="1.8" ${stroke}/><path d="M16.5 13.5v6M13.5 16.5h6" ${stroke}/>`,
  },
];

const app = (name: string, icon: string, className = "") =>
  `<figure class="vatsys-app${className}"><span class="vatsys-tile">${icon}</span><figcaption>${name}</figcaption></figure>`;

export const vatsysArt = `<div class="product-art vatsys-art" aria-hidden="true"><div class="vatsys-row">`
  + app("vatSys", `<img src="img/vatsys-icon.png" alt="" width="256" height="256" draggable="false">`, " is-host")
  + `<span class="vatsys-divider"></span>`
  + plugins.map(({ name, glyph }) => app(name, `<svg viewBox="0 0 24 24">${glyph}</svg>`)).join("")
  + `</div></div>`;
