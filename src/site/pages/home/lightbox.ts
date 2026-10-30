import { html, label } from "../../../build/html.ts";
import { icon } from "../../components/icon.ts";

/** Photo viewer shared by the Heisei wall and the Reiwa gallery (client/features/lightbox). */
export const lightbox = (): string => html`
  <div class="gallery-lightbox" hidden aria-hidden="true">
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-stage" role="dialog" aria-modal="true" ${label("imageViewerLabel")}>
      <img class="lightbox-image" src="" alt="">
      <button class="lightbox-control lightbox-close" type="button" ${label("lightboxClose")}>${icon("close")}</button>
      <button class="lightbox-control lightbox-prev" type="button" ${label("lightboxPrevious")}>${icon("chevron-back")}</button>
      <button class="lightbox-control lightbox-next" type="button" ${label("lightboxNext")}>${icon("chevron")}</button>
      <div class="lightbox-count" aria-live="polite"></div>
    </div>
  </div>`;
