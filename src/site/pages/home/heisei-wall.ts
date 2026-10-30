import { html, label, text } from "../../../build/html.ts";

/** Heisei-era prints with their pixel sizes, so the wall lays out before the images load. */
const prints: Array<[file: string, width: number, height: number]> = [
  ["1.png", 2048, 1152],
  ["2.png", 1280, 804],
  ["3.png", 1280, 789],
  ["4.png", 720, 720],
  ["5.png", 1280, 926],
  ["6.png", 1280, 1266],
  ["7.png", 1333, 901],
  ["8.png", 1023, 949],
  ["9.png", 680, 680],
];

/** Photo wall you can rearrange by dragging (client/photos/photo-wall, styles: photos/photo-wall). */
export const heiseiWall = (): string => html`
    <section class="retro-section reveal" id="retro" ${label("wallLabel")}>
      <div class="retro-head">
        <div class="retro-era" aria-hidden="true"><span ${text("heiseiLabel")}</span><strong>25 — 27</strong></div>
        <p class="retro-hint"><span class="hint-pointer" ${text("wallHintPointer")}</span><span class="hint-touch" ${text("wallHintTouch")}</span></p>
      </div>
      <div class="retro-gallery">
${prints.map(([file, width, height]) => `        <figure class="snap"><img src="img/Retro/${file}" alt="" width="${width}" height="${height}" loading="lazy" draggable="false"></figure>\n`)}      </div>
      <button class="retro-tidy" type="button" ${text("wallTidy")}</button>
    </section>`;
