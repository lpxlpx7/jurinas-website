import { html, text } from "../../build/html.ts";
import type { TranslationKey } from "../../shared/translations.ts";
import { links } from "../config.ts";
import { icon } from "../components/icon.ts";
import { layout, type Assets } from "../layout.ts";

const email = (labelKey: TranslationKey, address: string) =>
  `<div class="support-email"><small ${text(labelKey)}</small><a href="mailto:${address}"><span>${address}</span>${icon("chevron")}</a></div>`;

export const contactPage = (assets: Assets): string => layout("contact", html`
  <main class="contact-main support-main">
    <header class="support-hero shell reveal">
      <h1 ${text("contactTitle")}</h1>
      <p class="support-lead" ${text("contactIntro")}</p>
      <div class="support-emails">
        ${email("contactGeneralLabel", links.mailGeneral)}
        ${email("contactDevelopmentLabel", links.mailDevelopment)}
      </div>
    </header>
  </main>`, assets);
