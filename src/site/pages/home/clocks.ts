import { html, label, text } from "../../../build/html.ts";

/** Visitor's time next to UTC, ticked by client/features/clocks. */
export const clocks = (): string => html`
    <section class="time-inline shell reveal" ${label("clocksLabel")}>
      <div class="footer-clocks">
        <div><span ${text("localTime")}</span><time id="local-clock">--:--:--</time><small id="local-date">---</small><small id="local-era" hidden>---</small></div>
        <div><span ${text("utcTime")}</span><time id="utc-clock">--:--:--</time><small id="utc-date">---</small></div>
      </div>
    </section>`;
