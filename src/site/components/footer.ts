import { external, html, label, text } from "../../build/html.ts";
import { copyrightStartYear, links, projects } from "../config.ts";
import { icon } from "./icon.ts";
import { copyrightYears } from "../../shared/copyright.ts";

export const footer = (): string => html`
  <footer class="site-footer shell">
    <div class="footer-directory" ${label("footerLabel")}>
      <div class="footer-column">
        <h2 ${text("footerTools")}</h2>
        <a ${external(projects.routeFinder.site)}>Japan Route Finder</a>
        <a ${external(projects.departureDirector.site)}>ZNY Departure Director</a>
        <a ${external(projects.vatsysPlugins.site)} ${text("vatsysName")}</a>
        <a ${external(projects.vqaa.site)}>VATSIM Quarterly ATC Activity</a>
        <a ${external(projects.bot.site)} ${text("botName")}</a>
      </div>
      <div class="footer-column">
        <h2 ${text("footerLinks")}</h2>
        <a ${external(links.friend)} ${text("friendName")}</a>
        <a ${external(links.github)}>GitHub</a>
        <a ${external(links.x)}>X / Twitter</a>
      </div>
      <div class="footer-column">
        <h2 ${text("footerContact")}</h2>
        <a href="mailto:${links.mailGeneral}">${links.mailGeneral}</a>
        <a href="mailto:${links.mailDevelopment}">${links.mailDevelopment}</a>
      </div>
    </div>
    <div class="footer-top"><a ${external(links.source)}><span ${text("source")}</span> ${icon("external")}</a></div>
    <div class="footer-bottom">
      <p>© <span class="copyright-years" data-start-year="${copyrightStartYear}">${copyrightYears(copyrightStartYear, new Date().getFullYear())}</span> Jurina</p>
      <div class="pride-note">
        <span ${text("pride")}</span>
        <span class="pride-flags"><span class="pride-flag pride-flag-lgbt" role="img" ${label("rainbowFlagLabel")}></span><span class="pride-flag pride-flag-trans" role="img" ${label("transFlagLabel")}></span><span class="pride-flag pride-flag-bi" role="img" ${label("biFlagLabel")}></span></span>
      </div>
    </div>
  </footer>`;
