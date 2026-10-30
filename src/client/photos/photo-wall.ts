import { clamp, phoneLayout } from "../core/motion.ts";
import { bindDrag, type Point } from "./drag.ts";

/** Heisei wall: prints you can pick up with a mouse or pen and move around; "Tidy up" puts them back. */
export const initPhotoWall = () => {
  document.querySelectorAll(".retro-section").forEach((section) => {
    const wall = section.querySelector<HTMLElement>(".retro-gallery");
    if (!wall) return;
    const prints = Array.from(wall.querySelectorAll<HTMLElement>(".snap"));
    const tidy = section.querySelector(".retro-tidy");
    const offsets = new Map<HTMLElement, Point>(prints.map((print) => [print, { x: 0, y: 0 }]));
    const offsetOf = (print: HTMLElement): Point => offsets.get(print) ?? { x: 0, y: 0 };
    let layer = prints.length;

    const place = (print: HTMLElement) => {
      const offset = offsetOf(print);
      print.style.setProperty("--dx", `${(offset.x * wall.clientWidth).toFixed(1)}px`);
      print.style.setProperty("--dy", `${(offset.y * wall.clientHeight).toFixed(1)}px`);
    };
    const updateMessy = () => {
      section.classList.toggle("is-messy", prints.some((print) => {
        const offset = offsetOf(print);
        return Math.abs(offset.x) > .002 || Math.abs(offset.y) > .002;
      }));
    };

    prints.forEach((print, index) => {
      print.style.zIndex = String(index + 1);
      let base: Point = { x: 0, y: 0 };
      let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      let last = { x: 0, t: 0 };
      let tilt = 0;
      bindDrag(print, {
        // Touch keeps scrolling and tapping; picking up prints is for mouse and pen.
        accept: (event) => event.pointerType !== "touch" && !phoneLayout.matches,
        start: (event) => {
          base = { ...offsetOf(print) };
          const width = wall.clientWidth;
          const height = wall.clientHeight;
          const inset = 6;
          bounds = {
            minX: (inset - print.offsetLeft) / width,
            maxX: (width - inset - print.offsetLeft - print.offsetWidth) / width,
            minY: (inset - print.offsetTop) / height,
            maxY: (height - inset - print.offsetTop - print.offsetHeight) / height,
          };
          last = { x: event.clientX, t: event.timeStamp };
          tilt = 0;
          print.style.zIndex = String(++layer);
        },
        move: (event, dx, dy, moved) => {
          if (!moved) return;
          print.classList.add("is-moving");
          offsets.set(print, {
            x: clamp(base.x + dx / wall.clientWidth, bounds.minX, bounds.maxX),
            y: clamp(base.y + dy / wall.clientHeight, bounds.minY, bounds.maxY),
          });
          // A print swings slightly in the direction it is carried.
          const elapsed = Math.max(event.timeStamp - last.t, 1);
          const speed = (event.clientX - last.x) / elapsed;
          tilt += (clamp(speed * 4, -7, 7) - tilt) * .25;
          last = { x: event.clientX, t: event.timeStamp };
          print.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
          place(print);
        },
        finish: () => {
          print.classList.remove("is-moving");
          print.style.setProperty("--tilt", "0deg");
          updateMessy();
        },
      });
    });

    tidy?.addEventListener("click", () => {
      prints.forEach((print, index) => {
        offsets.set(print, { x: 0, y: 0 });
        print.style.zIndex = String(index + 1);
        place(print);
      });
      layer = prints.length;
      updateMessy();
    });

    new ResizeObserver(() => prints.forEach(place)).observe(wall);
  });
};
