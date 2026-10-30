import type { TranslationKey } from "../shared/translations.ts";

export type PageId = "home" | "projects" | "contact";

export type PageMeta = {
  id: PageId;
  /** Output file name, also used in links between pages. */
  file: string;
  navKey: TranslationKey;
  titleKey: TranslationKey;
  description: string;
  /** Extra home-only assets on top of the shared stylesheet and script. */
  extraStyles?: string[];
  extraScripts?: string[];
};

export const pages: Record<PageId, PageMeta> = {
  home: {
    id: "home",
    file: "index.html",
    navKey: "navHome",
    titleKey: "homeTitle",
    description: "Jurina's personal homepage, interests, music, and a small hello from the internet.",
    extraStyles: ["css/interactive-photos.css"],
    extraScripts: ["js/home.js"],
  },
  projects: {
    id: "projects",
    file: "projects.html",
    navKey: "navProjects",
    titleKey: "projectsPageTitle",
    description: "Explore Jurina's VATSYS plugins, VATSIM tools, and aviation and community projects.",
  },
  contact: {
    id: "contact",
    file: "contact.html",
    navKey: "navContact",
    titleKey: "contactPageTitle",
    description: "Get in touch with Jurina at contact@jurina.org.",
  },
};

/** Order of the links in the header and the phone menu. */
export const navigation: PageId[] = ["home", "projects", "contact"];

export const links = {
  github: "https://github.com/lpxlpx7",
  x: "https://x.com/lpxlpx7",
  source: "https://github.com/lpxlpx7/jurinas-website",
  artist: "https://x.com/cyh74022818",
  friend: "https://xn--3ckue.jp/",
  mailGeneral: "contact@jurina.org",
  mailDevelopment: "dev@jurina.org",
};

/** The projects, shared by the projects page and the footer directory. */
export const projects = {
  routeFinder: { site: "https://jprt.jurina.org/", source: "https://github.com/lpxlpx7/japan-route-finder" },
  departureDirector: { site: "https://nydep.jurina.org/", source: "https://github.com/lpxlpx7/ZNY-ATCT-Auto-Delivery" },
  vatsysPlugins: { site: "https://vatsys.jurina.org/", source: "https://github.com/Jurinas-vatsys-plugins" },
  vqaa: { site: "https://vqaa.jurina.org/", source: "https://github.com/lpxlpx7/VATSIM-Quarterly-ATC-Activity" },
  bot: { site: "https://bot.jurina.org/" },
};
