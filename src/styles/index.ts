/* Stylesheets the build writes, and the modules each one is made of, in cascade order. */
import fonts from "./base/fonts.ts";
import tokens from "./base/tokens.ts";
import reset from "./base/reset.ts";
import header from "./layout/header.ts";
import mobileMenu from "./layout/mobile-menu.ts";
import buttons from "./base/buttons.ts";
import hero from "./sections/hero.ts";
import interests from "./sections/interests.ts";
import music from "./sections/music.ts";
import reiwa from "./sections/reiwa.ts";
import clocks from "./sections/clocks.ts";
import lightbox from "./sections/lightbox.ts";
import footer from "./layout/footer.ts";
import projects from "./pages/projects.ts";
import contact from "./pages/contact.ts";
import reveal from "./base/reveal.ts";
import icons from "./base/icons.ts";
import tablet from "./responsive/tablet.ts";
import phone from "./responsive/phone.ts";
import reducedMotion from "./responsive/reduced-motion.ts";
import portrait from "./photos/portrait.ts";
import photoWall from "./photos/photo-wall.ts";
import photosResponsive from "./photos/responsive.ts";

export const stylesheets = {
  /** Every page. Breakpoint overrides come last so they win over the sections above them. */
  "css/style.css": [
    fonts, tokens, reset, header, mobileMenu, buttons,
    hero, interests, music, reiwa, clocks, lightbox,
    footer, projects, contact, reveal, icons,
    tablet, phone, reducedMotion,
  ],
  /** Home page only: the hanging polaroid and the Heisei photo wall. */
  "css/interactive-photos.css": [portrait, photoWall, photosResponsive],
} satisfies Record<string, string[]>;

export type StylesheetPath = keyof typeof stylesheets;
