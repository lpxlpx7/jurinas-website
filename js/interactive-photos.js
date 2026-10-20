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
      finish?.(event, moved);
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((name) => element.addEventListener(name, stop));
    element.addEventListener("click", (event) => {
      if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; }
    }, true);
  }

  const stage = document.querySelector(".portrait-stage");
  if (stage) {
    // The polaroid is a damped pendulum hanging from the tape. Angles are radians.
    const card = stage.querySelector(".portrait-card");
    const REST = -1.2 * Math.PI / 180;
    const LIMIT = 26 * Math.PI / 180;
    const GRAVITY = 30;          // g / L: sets the swing period (~1.15s)
    const AIR = 1.35;            // light damping so a fling swings a few times
    const HAND = 520;            // how firmly the card follows the pointer
    const HAND_DAMPING = 34;
    const state = { angle: REST, velocity: 0, drop: 0, dropVelocity: 0, lift: 0, liftVelocity: 0 };
    let dragging = false;
    let target = REST;
    let stretch = 0;
    let pivot, grabAngle, grabDistance, startAngle;
    let frameId = 0;
    let lastTime = 0;
    let visible = true;

    const wrap = (value) => Math.atan2(Math.sin(value), Math.cos(value));
    const pivotPoint = () => {
      const rect = stage.getBoundingClientRect();
      return { x: rect.left + card.offsetLeft + card.offsetWidth / 2, y: rect.top + card.offsetTop };
    };
    const breeze = (t) => reduceMotion.matches ? 0 : .2 * Math.sin(t * .83) + .12 * Math.sin(t * 1.71 + 1.3);

    const render = () => {
      const swing = state.angle - REST;
      const depth = 14 + state.lift * 30;
      const set = (name, value) => stage.style.setProperty(name, value);
      set("--card-angle", `${(state.angle * 180 / Math.PI).toFixed(3)}deg`);
      set("--card-twist", `${clamp(state.velocity * 3.4, -10, 10).toFixed(3)}deg`);
      set("--card-drop", `${state.drop.toFixed(2)}px`);
      set("--card-lift", (1 + state.lift * .022).toFixed(4));
      // Light comes from above, so the cast shadow stays below the card while it rotates.
      set("--shadow-x", `${(depth * Math.sin(state.angle)).toFixed(2)}px`);
      set("--shadow-y", `${(depth * Math.cos(state.angle)).toFixed(2)}px`);
      set("--shadow-blur", `${(26 + state.lift * 34).toFixed(1)}px`);
      set("--shadow-alpha", (.16 - state.lift * .04).toFixed(3));
      set("--tape-bend", `${(-swing * 180 / Math.PI * .42).toFixed(3)}deg`);
      set("--tape-stretch", (1 + Math.max(state.drop, 0) / 40).toFixed(4));
      set("--sheen", `${(50 + swing * 180 / Math.PI * 3.6).toFixed(2)}%`);
    };

    const step = (dt, t) => {
      let torque = -GRAVITY * Math.sin(state.angle - REST) - AIR * state.velocity;
      if (dragging) torque += HAND * (target - state.angle) - HAND_DAMPING * state.velocity;
      else torque += breeze(t);
      state.velocity += torque * dt;
      state.angle += state.velocity * dt;
      if (Math.abs(state.angle - REST) > LIMIT) {
        state.angle = REST + Math.sign(state.angle - REST) * LIMIT;
        state.velocity *= -.25;
      }
      // The tape behaves like a stiff rubber band: it stretches while pulled and rebounds on release.
      state.dropVelocity += (340 * ((dragging ? stretch : 0) - state.drop) - 15 * state.dropVelocity) * dt;
      state.drop += state.dropVelocity * dt;
      state.liftVelocity += (200 * ((dragging ? 1 : 0) - state.lift) - 24 * state.liftVelocity) * dt;
      state.lift += state.liftVelocity * dt;
    };

    const settled = () => !dragging && Math.abs(state.angle - REST) < 1e-4 && Math.abs(state.velocity) < 1e-3
      && Math.abs(state.drop) < .05 && Math.abs(state.dropVelocity) < .05 && state.lift < .002;
    const frame = (time) => {
      const elapsed = Math.min((time - (lastTime || time)) / 1000, .05);
      lastTime = time;
      const steps = Math.max(1, Math.ceil(elapsed * 240));
      for (let i = 0; i < steps; i += 1) step(elapsed / steps, time / 1000);
      render();
      const keepGoing = visible && (dragging || !reduceMotion.matches || !settled());
      frameId = keepGoing ? requestAnimationFrame(frame) : 0;
      if (!frameId) lastTime = 0;
    };
    const wake = () => { if (!frameId) frameId = requestAnimationFrame(frame); };

    bindDrag(card, (event) => {
      stage.classList.remove("is-entering");
      pivot = pivotPoint();
      const dx = event.clientX - pivot.x;
      const dy = event.clientY - pivot.y;
      grabAngle = Math.atan2(dx, dy);
      grabDistance = Math.hypot(dx, dy);
      startAngle = target = state.angle;
      stretch = 0;
      dragging = true;
      wake();
    }, (event) => {
      const dx = event.clientX - pivot.x;
      const dy = event.clientY - pivot.y;
      target = clamp(startAngle - wrap(Math.atan2(dx, dy) - grabAngle), REST - LIMIT, REST + LIMIT);
      stretch = clamp(16 * Math.tanh((Math.hypot(dx, dy) - grabDistance) / 150), -3, 16);
    }, (event, moved) => {
      dragging = false;
      // A tap without dragging gives the card a gentle push away from the finger.
      if (!moved && event && !reduceMotion.matches) {
        state.velocity += Math.sign(event.clientX - pivot.x || 1) * 1.6;
      }
      wake();
    });

    // Fast mouse movements near the photo act like a small gust of air.
    let lastPointer = null;
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || dragging || reduceMotion.matches || !visible) { lastPointer = null; return; }
      if (lastPointer && event.timeStamp > lastPointer.t) {
        const rect = card.getBoundingClientRect();
        const gapX = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
        const gapY = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
        const reach = Math.max(0, 1 - Math.hypot(gapX, gapY) / 150);
        if (reach > 0) {
          const speed = clamp((event.clientX - lastPointer.x) / (event.timeStamp - lastPointer.t), -4, 4);
          state.velocity -= speed * reach * .028;
          wake();
        }
      }
      lastPointer = { x: event.clientX, t: event.timeStamp };
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      }).observe(stage);
    }

    if (!reduceMotion.matches) {
      // Arrive with a little swing, as if the photo was just pinned up.
      state.angle = REST + .16;
      stage.classList.add("is-entering");
      stage.addEventListener("animationend", () => stage.classList.remove("is-entering"), { once: true });
    }
    render();
    wake();
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
