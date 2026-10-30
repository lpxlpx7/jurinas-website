/** Full-screen viewer for the Heisei prints and Reiwa photos: click, Enter/Space, arrows, swipe. */
export const initLightbox = () => {
  const lightbox = document.querySelector<HTMLElement>(".gallery-lightbox");
  const lightboxImage = document.querySelector<HTMLImageElement>(".lightbox-image");
  const lightboxCount = document.querySelector(".lightbox-count");
  if (!lightbox) return;
  let activeGalleryImage = 0;
  let lightboxTouchStart = 0;
  let lightboxTimer: number | undefined;

  const getGalleryImages = () => Array.from(document.querySelectorAll<HTMLImageElement>(".retro-gallery img, .reiwa-gallery img"));

  const showGalleryImage = (index: number) => {
    const galleryImages = getGalleryImages();
    if (!galleryImages.length || !lightboxImage) return;
    activeGalleryImage = (index + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[activeGalleryImage].src;
    if (lightboxCount) lightboxCount.textContent = `${activeGalleryImage + 1} / ${galleryImages.length}`;
  };

  const openLightbox = (index: number) => {
    if (index < 0) return;
    window.clearTimeout(lightboxTimer);
    showGalleryImage(index);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    document.querySelector<HTMLElement>(".lightbox-close")?.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxTimer = window.setTimeout(() => { lightbox.hidden = true; }, 240);
  };

  // Heisei prints are <figure class="snap"> wrappers; Reiwa photos are bare images.
  const galleryItem = (target: EventTarget | null) => (target instanceof Element ? target.closest(".snap, .reiwa-gallery img") : null);
  const galleryIndex = (item: Element) => {
    const image = item instanceof HTMLImageElement ? item : item.querySelector("img");
    return image ? getGalleryImages().indexOf(image) : -1;
  };
  document.querySelectorAll<HTMLElement>(".retro-gallery, .reiwa-gallery").forEach((gallery) => {
    gallery.querySelectorAll<HTMLElement>(".snap, .reiwa-gallery img").forEach((item) => {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
    });
    gallery.addEventListener("click", (event) => {
      const item = galleryItem(event.target);
      if (item) openLightbox(galleryIndex(item));
    });
    gallery.addEventListener("keydown", (event) => {
      const item = galleryItem(event.target);
      if (!item || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      openLightbox(galleryIndex(item));
    });
  });

  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-prev")?.addEventListener("click", () => showGalleryImage(activeGalleryImage - 1));
  document.querySelector(".lightbox-next")?.addEventListener("click", () => showGalleryImage(activeGalleryImage + 1));
  document.querySelector(".lightbox-backdrop")?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("touchstart", (event) => { lightboxTouchStart = event.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - lightboxTouchStart;
    if (Math.abs(distance) > 50) showGalleryImage(activeGalleryImage + (distance < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (lightbox.hidden) return;
    if (event.key === "ArrowLeft") showGalleryImage(activeGalleryImage - 1);
    if (event.key === "ArrowRight") showGalleryImage(activeGalleryImage + 1);
  });
};
