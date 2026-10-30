import { html, label, text } from "../../build/html.ts";
import { navigation, pages, type PageId } from "../config.ts";
import { icon } from "./icon.ts";
import { languageSwitch } from "./language-switch.ts";
import { menuIcon } from "./menu-icon.ts";

export const header = (current: PageId): string => html`
  <header class="site-header">
    <nav class="nav shell" ${label("primaryNavLabel")}>
      <a class="brand" href="index.html" ${text("brand")}</a>
      <div class="nav-right">
        <div class="nav-links">
${navigation.map((id) => {
  const page = pages[id];
  const active = id === current ? ' class="is-active" aria-current="page"' : "";
  return `          <a${active} href="${page.file}" ${text(page.navKey)}</a>\n`;
})}        </div>
        ${languageSwitch({ name: "language-desktop", className: "language-switch", english: "EN" })}
        <button class="theme-button" type="button" ${label("themeLabel")}><span class="theme-icon" aria-hidden="true">${icon("moon")}</span></button>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" ${label("menuOpen")}>${menuIcon()}</button>
      </div>
    </nav>
  </header>`;
