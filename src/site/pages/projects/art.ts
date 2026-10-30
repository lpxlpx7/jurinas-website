import { text } from "../../../build/html.ts";

/* Decorative artwork for each project tile (styles: pages/projects). */

export const radarArt = `<div class="product-art radar-art" aria-hidden="true"><svg viewBox="0 0 900 300" fill="none"><path d="M0 240L225 120L405 175L650 65L900 145M130 0L310 300M510 0L425 300M790 0L660 300" stroke="currentColor" stroke-width="1" opacity=".25"/><path d="M90 225L300 137L450 164L700 80" stroke="currentColor" stroke-width="2"/><path d="M300 125L310 143L290 143ZM700 68L710 86L690 86Z" fill="currentColor"/></svg><div class="radar-label"><span>VATSYS</span><span ${text("pluginsArt")}</span></div></div>`;

const bars: Array<[x: number, y: number, height: number, opacity?: string]> = [
  [105, 140, 110, ".32"],
  [255, 90, 160, ".48"],
  [405, 115, 135, ".64"],
  [555, 45, 205],
];

export const quarterlyChartArt = `<div class="product-art vqaa-art" aria-hidden="true"><svg viewBox="0 0 720 300" fill="none">`
  + `<defs><linearGradient id="vqaa-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor"/><stop offset="1" stop-color="currentColor" stop-opacity=".55"/></linearGradient></defs>`
  + `<path d="M60 250H660" stroke="currentColor" opacity=".25"/><path d="M60 118H660" stroke="currentColor" stroke-dasharray="3 9" stroke-linecap="round" opacity=".5"/>`
  + bars.map(([x, y, height, opacity]) => `<rect class="vqaa-bar" x="${x}" y="${y}" width="84" height="${height}" rx="16" fill="url(#vqaa-fill)"${opacity ? ` opacity="${opacity}"` : ""}/>`).join("")
  + bars.map(([x], index) => `<text class="vqaa-axis" x="${x + 42}" y="282" text-anchor="middle" fill="currentColor">Q${index + 1}</text>`).join("")
  + `</svg></div>`;

export const departureArt = `<div class="product-art type-art" aria-hidden="true">ZNY<span ${text("znyArt")}</span></div>`;

export const routeArt = `<div class="product-art route-art" aria-hidden="true"><span>RJTT</span><svg viewBox="0 0 500 100" fill="none"><path d="M10 70Q250 -40 490 70" stroke="currentColor" stroke-width="2" stroke-dasharray="5 7"/></svg><span>RJOO</span></div>`;

export const discordArt = `<div class="product-art bot-art" aria-hidden="true"><svg class="discord-mark" viewBox="0 0 120 92"><path fill="currentColor" d="M98.7 8.1A93.5 93.5 0 0 0 75.5 1l-3.1 6.3a86.8 86.8 0 0 0-24.8 0L44.5 1a93.8 93.8 0 0 0-23.2 7.1C6.6 29.2 2.6 49.8 5.1 70.1A93.8 93.8 0 0 0 33.6 84l6.9-9.3-10.8-5.2 2.6-2c20.8 9.7 43.4 9.7 63.9 0l2.6 2-10.8 5.2 6.9 9.3a93.8 93.8 0 0 0 28.5-13.9c3-23.5-5.1-43.9-24.7-61.9ZM40.2 57.4c-6.2 0-11.3-5.7-11.3-12.7S33.9 32 40.2 32s11.3 5.7 11.3 12.7-5.1 12.7-11.3 12.7Zm39.6 0c-6.2 0-11.3-5.7-11.3-12.7S73.6 32 79.8 32s11.3 5.7 11.3 12.7-5.1 12.7-11.3 12.7Z"/></svg></div>`;
