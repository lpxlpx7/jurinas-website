import { attr, html } from "../build/html.ts";
import { en } from "../shared/translations.ts";
import { pages, type PageId } from "./config.ts";
import { footer } from "./components/footer.ts";
import { header } from "./components/header.ts";
import { mobileMenu } from "./components/mobile-menu.ts";

export type Assets = {
  /** Built URL (with cache-busting hash) for a css/ or js/ path. */
  url: (path: string) => string;
  /** The theme/language bootstrap, inlined so nothing paints in the wrong theme. */
  themeInit: string;
};

/** Wraps a page body in the shared head, header, phone menu and footer. */
export const layout = (id: PageId, main: string, assets: Assets, { afterMain = "" } = {}): string => {
  const page = pages[id];
  const styles = ["css/style.css", ...(page.extraStyles ?? [])];
  const scripts = ["js/main.js", ...(page.extraScripts ?? [])];
  return html`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="${attr(page.description)}">
  <meta name="theme-color" content="#f5f5f7">
  <title>${en[page.titleKey]}</title>
  <script>${assets.themeInit}</script>
${styles.map((path) => `  <link rel="stylesheet" href="${assets.url(path)}">\n`)}${scripts.map((path) => `  <script src="${assets.url(path)}" defer></script>\n`)}</head>
<body data-title-key="${page.titleKey}">
${header(id)}
${mobileMenu(id)}

${main}
${afterMain}
${footer()}
</body>
</html>
`;
};
