/* Photos can be viewed, not saved: no context menu, drag-out or long-press menu. */
export const protectPhotos = () => {
  const isPhoto = (target: EventTarget | null) => target instanceof Element && target.closest("img, .snap, .portrait-frame, .vinyl, .album-cover, .music-backdrop");
  document.addEventListener("contextmenu", (event) => { if (isPhoto(event.target)) event.preventDefault(); });
  document.addEventListener("dragstart", (event) => { if (isPhoto(event.target)) event.preventDefault(); });
  document.querySelectorAll("img").forEach((image) => { image.draggable = false; });
};
