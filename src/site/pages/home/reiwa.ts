import { html, label, text } from "../../../build/html.ts";

/** Hidden until client/features/reiwa-gallery finds photos in img/reiwa/. */
export const reiwaGallery = (): string => html`
    <section class="reiwa-section shell reveal" id="reiwa" hidden>
      <div class="reiwa-heading">
        <p class="eyebrow" ${text("reiwaEyebrow")}</p>
        <h2 ${text("reiwaTitle")}</h2>
        <p ${text("reiwaBody")}</p>
      </div>
      <div class="reiwa-gallery" ${label("reiwaGalleryLabel")}></div>
    </section>`;
