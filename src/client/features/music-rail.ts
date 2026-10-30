import { reduceMotion } from "../core/motion.ts";

/** The music rail: native horizontal scrolling with snap, plus dots, arrows, keys and mouse drag. */
export const initMusicRail = () => {
  const musicTrack = document.querySelector<HTMLElement>(".music-track");
  const musicSlides = Array.from(document.querySelectorAll<HTMLElement>(".music-slide"));
  const musicDots = document.querySelectorAll<HTMLElement>(".music-dot");
  const musicPrevious = document.querySelector<HTMLButtonElement>(".music-prev");
  const musicNext = document.querySelector<HTMLButtonElement>(".music-next");
  let activeMusicSlide = -1;
  let musicTarget: number | null = null;
  let musicFrame = 0;

  const markMusicSlide = (index: number) => {
    if (index === activeMusicSlide) return;
    activeMusicSlide = index;
    musicDots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
      dot.tabIndex = active ? 0 : -1;
    });
    if (musicPrevious) musicPrevious.disabled = index === 0;
    if (musicNext) musicNext.disabled = index === musicSlides.length - 1;
  };

  // Positions come from layout offsets, so the dots never wait for a scroll to finish.
  const musicSlideLeft = (track: HTMLElement, index: number): number => {
    const slide = musicSlides[index];
    const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    // Edge slides can't always reach the center, so aim for where the scroll can actually stop.
    return Math.max(0, Math.min(left, track.scrollWidth - track.clientWidth));
  };
  const nearestMusicSlide = (track: HTMLElement): number => {
    const center = track.scrollLeft + track.clientWidth / 2;
    return musicSlides.reduce((nearest, slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity }).index;
  };

  const goToMusicSlide = (index: number) => {
    if (!musicTrack || !musicSlides.length) return;
    const target = Math.max(0, Math.min(index, musicSlides.length - 1));
    // The dot moves immediately; the scroll catches up underneath it.
    markMusicSlide(target);
    musicTarget = target;
    musicTrack.scrollTo({ left: musicSlideLeft(musicTrack, target), behavior: reduceMotion.matches ? "auto" : "smooth" });
  };

  if (!musicTrack || !musicSlides.length) return;
  markMusicSlide(0);
  musicTrack.addEventListener("scroll", () => {
    if (musicFrame) return;
    musicFrame = requestAnimationFrame(() => {
      musicFrame = 0;
      if (musicTarget !== null) {
        // While a dot-driven scroll is in flight, don't flash the dots it passes over.
        if (Math.abs(musicTrack.scrollLeft - musicSlideLeft(musicTrack, musicTarget)) < 4) musicTarget = null;
        return;
      }
      markMusicSlide(nearestMusicSlide(musicTrack));
    });
  }, { passive: true });
  musicTrack.addEventListener("scrollend", () => {
    musicTarget = null;
    markMusicSlide(nearestMusicSlide(musicTrack));
  });
  // Grabbing the rail mid-animation takes over from the dot.
  (["pointerdown", "wheel", "touchstart"] as const).forEach((name) => musicTrack.addEventListener(name, () => { musicTarget = null; }, { passive: true }));
  musicDots.forEach((dot) => dot.addEventListener("click", () => goToMusicSlide(Number(dot.dataset.slideTo))));
  musicPrevious?.addEventListener("click", () => goToMusicSlide(activeMusicSlide - 1));
  musicNext?.addEventListener("click", () => goToMusicSlide(activeMusicSlide + 1));
  document.querySelector<HTMLElement>(".music-showcase")?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goToMusicSlide(activeMusicSlide - 1);
    if (event.key === "ArrowRight") goToMusicSlide(activeMusicSlide + 1);
  });
  // Album artwork stays put: no dragging images or links out of the rail.
  musicTrack.addEventListener("dragstart", (event) => event.preventDefault());

  // Mouse drag: the rail follows the pointer, then settles one slide over in the drag direction.
  // Touch screens already swipe natively, so only the mouse is handled here.
  let musicDrag: { id: number; x: number; left: number; from: number; moved: boolean } | null = null;
  let musicDragEnded = 0;
  musicTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    musicDrag = { id: event.pointerId, x: event.clientX, left: musicTrack.scrollLeft, from: activeMusicSlide, moved: false };
  });
  musicTrack.addEventListener("pointermove", (event) => {
    if (!musicDrag || event.pointerId !== musicDrag.id) return;
    const dx = event.clientX - musicDrag.x;
    if (!musicDrag.moved) {
      if (Math.abs(dx) < 6) return;
      musicDrag.moved = true;
      musicTrack.classList.add("is-dragging");
      musicTrack.setPointerCapture(event.pointerId);
    }
    musicTrack.scrollLeft = musicDrag.left - dx;
  });
  // Snapping stays off until the glide lands; turning it back on mid-glide made the rail jump to
  // the nearest slide first and then slide again to the target.
  let musicSettle = 0;
  const finishMusicSettle = () => {
    window.clearTimeout(musicSettle);
    musicTrack.classList.remove("is-settling");
  };
  const endMusicDrag = (event: PointerEvent) => {
    if (!musicDrag || event.pointerId !== musicDrag.id) return;
    const { moved, x, from } = musicDrag;
    musicDrag = null;
    if (!moved) return;
    musicTrack.classList.add("is-settling");
    musicTrack.classList.remove("is-dragging");
    musicDragEnded = performance.now();
    const dx = event.clientX - x;
    goToMusicSlide(Math.abs(dx) > 60 ? from + (dx < 0 ? 1 : -1) : nearestMusicSlide(musicTrack));
    musicTrack.addEventListener("scrollend", finishMusicSettle, { once: true });
    // Already on target (no scroll, so no scrollend) or a browser without scrollend.
    musicSettle = window.setTimeout(finishMusicSettle, 800);
  };
  musicTrack.addEventListener("pointerup", endMusicDrag);
  musicTrack.addEventListener("pointercancel", endMusicDrag);
  // A drag that ends over a link must not open it.
  musicTrack.addEventListener("click", (event) => {
    if (performance.now() - musicDragEnded < 300) { event.preventDefault(); event.stopPropagation(); }
  }, true);
};
