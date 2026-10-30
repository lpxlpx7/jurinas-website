import { alt, html, text } from "../../../build/html.ts";
import { icon } from "../../components/icon.ts";

/** Three interest cards; the flight card's globe is drawn by client/globe. */
export const interests = (): string => html`
    <section class="interests shell" id="interests" aria-labelledby="interests-title">
      <div class="section-heading reveal">
        <p class="eyebrow" ${text("interestsEyebrow")}</p>
        <h2 id="interests-title" ${text("interestsTitle")}</h2>
      </div>

      <div class="card-grid">
        <article class="interest-card music-card reveal">
          <div class="card-icon" aria-hidden="true">${icon("note")}</div>
          <p class="card-kicker" ${text("musicKicker")}</p>
          <h3 ${text("musicTitle")}</h3>
          <p ${text("musicBody")}</p>
          <div class="sound-wave" aria-hidden="true">
            ${"<i></i>".repeat(9)}
          </div>
        </article>

        <article class="interest-card flight-card reveal">
          <div class="card-icon" aria-hidden="true">${icon("airplane")}</div>
          <p class="card-kicker" ${text("flightKicker")}</p>
          <h3 ${text("flightTitle")}</h3>
          <p ${text("flightBody")}</p>
          <div class="flight-globe" aria-hidden="true"></div>
        </article>

        <article class="interest-card games-card reveal">
          <div class="games-copy">
            <div class="card-icon" aria-hidden="true">${icon("controller")}</div>
            <p class="card-kicker" ${text("gamesKicker")}</p>
            <h3 ${text("gamesTitle")}</h3>
            <p ${text("gamesBody")}</p>
          </div>
          <div class="games-logo-wrap">
            <span class="games-glow" aria-hidden="true"></span>
            <img class="games-logo" src="img/Overwatch_2_full_logo.svg.webp" ${alt("gamesAlt")}>
          </div>
        </article>
      </div>
    </section>`;
