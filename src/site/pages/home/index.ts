import { html } from "../../../build/html.ts";
import { layout, type Assets } from "../../layout.ts";
import { clocks } from "./clocks.ts";
import { heiseiWall } from "./heisei-wall.ts";
import { hero } from "./hero.ts";
import { interests } from "./interests.ts";
import { lightbox } from "./lightbox.ts";
import { musicShowcase } from "./music.ts";
import { reiwaGallery } from "./reiwa.ts";

export const homePage = (assets: Assets): string => layout("home", html`
  <main id="top">
${hero()}

${interests()}

${musicShowcase()}

${heiseiWall()}

${reiwaGallery()}

${clocks()}
  </main>`, assets, { afterMain: lightbox() });
