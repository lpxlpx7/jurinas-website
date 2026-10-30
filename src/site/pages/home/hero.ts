import { alt, external, html, label, text } from "../../../build/html.ts";
import { links } from "../../config.ts";
import { icon } from "../../components/icon.ts";

/** Greeting, social buttons, pronouns, and the hanging polaroid (scripted by client/photos/portrait). */
export const hero = (): string => html`
    <section class="hero shell" id="about">
      <div class="hero-copy reveal">
        <h1 ${text("heroTitle")}</h1>

        <div class="actions">
          <a class="button button-primary" ${external(links.github)}>
            GitHub ${icon("external")}
          </a>
          <a class="button button-secondary" ${external(links.x)}>
            X / Twitter ${icon("chevron")}
          </a>
        </div>

        <div class="identity-note">
          <span class="trans-mark" aria-hidden="true"></span>
          <span ${text("pronouns")}</span>
        </div>
      </div>

      <div class="portrait-stage">
        <aside class="portrait-card" ${label("avatarInfoLabel")}>
          <div class="portrait-frame">
            <img src="img/avatar.png" ${alt("avatarAlt")} draggable="false">
            <span class="portrait-sheen" aria-hidden="true"></span>
          </div>
          <a class="portrait-reference" ${external(links.artist)}>
            <span ${text("artworkBy")}</span>${icon("external")}
          </a>
        </aside>
        <span class="pushpin" aria-hidden="true"></span>
      </div>
    </section>`;
