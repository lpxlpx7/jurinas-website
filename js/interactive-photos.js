/* Independent pointer interactions. CSS variables are the only transform owner. */
(() => {
  const clamp = (value, min, max) => Math.max(min, Math.min(Math.max(min, max), value));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function bindDrag(element, start, move, finish) {
    let pointer = null;
    let origin;
    let moved = false;
    element.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0 || pointer !== null) return;
      if (event.target.closest("a")) return;
      event.preventDefault();
      pointer = event.pointerId;
      moved = false;
      origin = { x: event.clientX, y: event.clientY };
      start(event);
      element.setPointerCapture(pointer);
      element.classList.add("is-dragging");
    });
    element.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointer) return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      moved ||= Math.hypot(dx, dy) > 5;
      move(event, dx, dy);
    });
    const stop = (event) => {
      if (event.pointerId !== pointer) return;
      pointer = null;
      element.classList.remove("is-dragging");
      finish?.();
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((name) => element.addEventListener(name, stop));
    element.addEventListener("click", (event) => {
      if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; }
    }, true);
  }

  const stage = document.querySelector(".portrait-stage");
  if (stage) {
    const card = stage.querySelector(".portrait-card");
    const tape = stage.querySelector(".polaroid-tape");
    let angle = -1.2;
    let velocity = 0;
    let animation = 0;
    let lastTime = 0;
    let pivot;
    let grabAngle;
    let startAngle;
    const render = () => {
      stage.style.setProperty("--card-angle", `${angle}deg`);
    };
    const settle = (time) => {
      const dt = Math.min((time - (lastTime || time)) / 1000, .032);
      lastTime = time;
      velocity += (-65 * (angle + 1.2) - 13 * velocity) * dt;
      angle += velocity * dt;
      render();
      if (Math.abs(angle + 1.2) > .02 || Math.abs(velocity) > .02) animation = requestAnimationFrame(settle);
      else { angle = -1.2; render(); animation = 0; }
    };
    bindDrag(card, (event) => {
      cancelAnimationFrame(animation);
      stage.classList.remove("is-entering");
      const rect = stage.getBoundingClientRect();
      pivot = { x: rect.left + rect.width / 2, y: rect.top };
      grabAngle = Math.atan2(event.clientX - pivot.x, event.clientY - pivot.y);
      startAngle = angle;
    }, (event) => {
      const pointerAngle = Math.atan2(event.clientX - pivot.x, event.clientY - pivot.y);
      angle = clamp(startAngle - (pointerAngle - grabAngle) * 180 / Math.PI, -18, 18);
      render();
    }, () => {
      velocity = 0; lastTime = 0;
      if (reduceMotion.matches) { angle = -1.2; render(); }
      else animation = requestAnimationFrame(settle);
    });
    tape?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      card.dispatchEvent(new PointerEvent("pointerdown", event));
    });
    render();
    if (!reduceMotion.matches) {
      stage.classList.add("is-entering");
      stage.addEventListener("animationend", () => stage.classList.remove("is-entering"), { once: true });
    }
  }

  document.querySelectorAll(".retro-gallery").forEach((wall) => {
    let layer = 1;
    wall.querySelectorAll("img").forEach((photo) => {
      let x = 0, y = 0, baseX = 0, baseY = 0, bounds;
      const measure = () => {
        // offset coordinates are unaffected by transforms, hover or pointer movement.
        const inset = 8;
        bounds = {
          minX: inset - photo.offsetLeft,
          maxX: wall.clientWidth - inset - photo.offsetLeft - photo.offsetWidth,
          minY: inset - photo.offsetTop,
          maxY: wall.clientHeight - inset - photo.offsetTop - photo.offsetHeight,
        };
      };
      const render = () => {
        x = clamp(x, bounds.minX, bounds.maxX);
        y = clamp(y, bounds.minY, bounds.maxY);
        photo.style.setProperty("--drag-x", `${x}px`);
        photo.style.setProperty("--drag-y", `${y}px`);
      };
      bindDrag(photo, () => {
        measure(); baseX = x; baseY = y;
        photo.style.zIndex = String(++layer);
      }, (event, dx, dy) => {
        x = baseX + dx; y = baseY + dy;
        render();
      });
      new ResizeObserver(() => { measure(); render(); }).observe(wall);
    });
  });

  document.querySelectorAll(".portrait-stage, .retro-gallery").forEach((area) => {
    ["dragstart", "contextmenu", "copy"].forEach((name) => area.addEventListener(name, (event) => event.preventDefault()));
    area.querySelectorAll("img").forEach((image) => { image.draggable = false; });
  });
})();
