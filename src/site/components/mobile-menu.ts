import { html, label, text } from "../../build/html.ts";
import { navigation, pages, type PageId } from "../config.ts";
import { languageSwitch } from "./language-switch.ts";

/** Full-height phone sheet opened by the header's menu button (styles: layout/mobile-menu). */
export const mobileMenu = (current: PageId): string => html`
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true" inert>
    <nav class="mobile-nav" ${label("mobileNavLabel")}>
      <ul>
${navigation.map((id) => {
  const page = pages[id];
  const active = id === current ? ' class="is-active" aria-current="page"' : "";
  return `        <li><a${active} href="${page.file}"><span ${text(page.navKey)}</span></a></li>\n`;
})}      </ul>
    </nav>
    <div class="mobile-menu-group">
      <h2 ${text("languageLabel")}</h2>
      ${languageSwitch({ name: "language-mobile", className: "mobile-language language-switch", english: "English" })}
    </div>
  </div>`;
