import { html, text } from "../../../build/html.ts";
import { projects } from "../../config.ts";
import { layout, type Assets } from "../../layout.ts";
import { projectActions } from "./actions.ts";
import { departureArt, discordArt, quarterlyChartArt, routeArt } from "./art.ts";
import { vatsysArt } from "./vatsys-art.ts";

const vatsys = html`
    <section class="product-feature product-vatsys reveal" id="vatsys" aria-labelledby="vatsys-title">
      <div class="product-copy shell">
        <p class="eyebrow" ${text("vatsysKicker")}</p>
        <h2 id="vatsys-title" ${text("vatsysName")}</h2>
        <p class="product-tagline" ${text("vatsysBody")}</p>
        ${projectActions(projects.vatsysPlugins, "explorePlugins")}
      </div>
      ${vatsysArt}
    </section>`;

const vqaa = html`
    <section class="product-feature product-vqaa reveal" id="vqaa" aria-labelledby="vqaa-title">
      <div class="product-copy shell">
        <p class="eyebrow" ${text("vqaaKicker")}</p>
        <h2 id="vqaa-title">VATSIM Quarterly ATC Activity</h2>
        <p class="product-tagline" ${text("vqaaBody")}</p>
        ${projectActions(projects.vqaa)}
      </div>
      ${quarterlyChartArt}
    </section>`;

const departureDirector = html`
      <section class="product-feature product-atc reveal" id="zny" aria-labelledby="atc-title">
        <div class="product-copy">
          <p class="eyebrow" ${text("znyType")}</p>
          <h2 id="atc-title" ${text("znyName")}</h2>
          <p class="product-tagline" ${text("znyBody")}</p>
          ${projectActions(projects.departureDirector)}
        </div>
        ${departureArt}
      </section>`;

const routeFinder = html`
      <section class="product-feature product-route reveal" id="dispatcher" aria-labelledby="route-title">
        <div class="product-copy">
          <p class="eyebrow" ${text("dispatcherType")}</p>
          <h2 id="route-title" ${text("dispatcherName")}</h2>
          <p class="product-tagline" ${text("dispatcherBody")}</p>
          ${projectActions(projects.routeFinder)}
        </div>
        ${routeArt}
      </section>`;

const bot = html`
    <section class="product-feature product-community reveal" id="bot-feature" aria-labelledby="bot-feature-title">
      <div class="product-copy shell">
        <p class="eyebrow" ${text("botType")}</p>
        <h2 id="bot-feature-title" ${text("botName")}</h2>
        <p class="product-tagline" ${text("botBody")}</p>
        ${projectActions(projects.bot)}
      </div>
      ${discordArt}
    </section>`;

export const projectsPage = (assets: Assets): string => layout("projects", html`
  <main class="product-main">
    <header class="product-intro shell reveal">
      <p class="eyebrow" ${text("projectsEyebrow")}</p>
      <h1 ${text("productTitle")}</h1>
      <p ${text("projectsIntro")}</p>
    </header>
    <div class="product-stack">${vatsys}
${vqaa}
    <div class="product-pair">${departureDirector}
${routeFinder}
    </div>${bot}
    </div>
  </main>`, assets);
