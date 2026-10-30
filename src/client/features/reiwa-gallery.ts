/** Shows the Reiwa section only once photos named reiwa-01 … reiwa-20 exist in img/reiwa/. */
const loadGallery = async (sectionSelector: string, gallerySelector: string, basePath: string, prefix: string, count: number) => {
  const section = document.querySelector<HTMLElement>(sectionSelector);
  const gallery = document.querySelector(gallerySelector);
  if (!section || !gallery) return;

  const images = await Promise.all(Array.from({ length: count }, async (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    for (const extension of ["jpg", "jpeg", "png", "webp"]) {
      const source = `${basePath}/${prefix}-${number}.${extension}`;
      try {
        const response = await fetch(source, { method: "HEAD" });
        if (response.ok) return source;
      } catch {
        // A missing optional gallery must not affect the rest of the page.
      }
    }
    return null;
  }));

  images.filter((source): source is string => source !== null).forEach((source) => {
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    image.loading = "lazy";
    gallery.appendChild(image);
  });

  if (gallery.children.length) section.hidden = false;
};

export const initReiwaGallery = () => loadGallery(".reiwa-section", ".reiwa-gallery", "img/reiwa", "reiwa", 20);
