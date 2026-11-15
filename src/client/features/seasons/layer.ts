import { readPrefs, savePrefs, seasonPrefs } from "./prefs.ts";

/** A one-off effect on a fixed full-screen canvas (snow, leaves, petals). When `step` returns false the canvas is removed. */
export type FallEffect = {
  /** Called on start and on every resize, with the viewport size in CSS pixels. */
  resize: (width: number, height: number) => void;
  /** `dt` is seconds since the last frame, capped so a background tab doesn't cause a jump. Returns false when finished. */
  step: (dt: number, width: number, height: number) => boolean;
  draw: (ctx: CanvasRenderingContext2D, dark: boolean) => void;
};

export type Box = { x: number; y: number; w: number; h: number };

/**
 * One lasting decoration (a tree, a string of lights, a branch, a wind chime) on its own canvas, placed in
 * page coordinates so it scrolls with the page. Canvases never take clicks themselves; dragging and the
 * hide button are handled at the document level, and only where nothing clickable is underneath.
 */
export type DecorItem = {
  id: string;
  /** "back" sits behind the page's text and pictures; "front" above them but under the header. */
  layer: "back" | "front";
  /** Whether visitors can move it: anywhere, only sideways, or not at all. Every item can be hidden. */
  drag: "free" | "x" | "none";
  /** Where it goes by default for this page width, in page coordinates; null if it has no place on this page. */
  place: (pageWidth: number) => Box | null;
  /** If given, dragging can't take the item outside this page area (it's kept wholly inside). */
  bounds?: () => Box | null;
  /** The part of the box that counts for grabbing, in box coordinates. Defaults to the whole box. */
  grip?: (box: Box) => Box;
  step?: (dt: number) => void;
  /** Draws in box coordinates: (0, 0) is the box's top-left corner. */
  draw: (ctx: CanvasRenderingContext2D, dark: boolean, box: Box) => void;
  /** Kept up to date by the layer: where the box is on the page right now, and whether it's showing. */
  live: Box & { shown: boolean };
};

/** What a season shows: lasting decorations, a one-off fall for fresh visits, or both. */
export type Scene = { items?: DecorItem[]; fall?: FallEffect };

export const newLive = (): DecorItem["live"] => ({ x: 0, y: 0, w: 0, h: 0, shown: false });
export const isDark = () => document.documentElement.dataset.theme === "dark";

const frameTime = (now: number, last: number) => (last ? Math.min((now - last) / 1000, 0.05) : 0);
const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

const makeCanvas = (className: string) => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  return canvas;
};

/** Mounts a fixed, click-through canvas and runs the effect on it until it finishes. Returns a way to stop it early. */
export const startFallLayer = (effect: FallEffect): (() => void) => {
  const canvas = makeCanvas("season-fall");
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return () => {}; }

  let width = 0;
  let height = 0;
  const resize = () => {
    const ratio = pixelRatio();
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    effect.resize(width, height);
  };
  resize();
  window.addEventListener("resize", resize);

  let frame = 0;
  let last = 0;
  const tick = (now: number) => {
    const dt = frameTime(now, last);
    last = now;
    if (!effect.step(dt, width, height)) { stop(); return; }
    ctx.clearRect(0, 0, width, height);
    effect.draw(ctx, isDark());
    frame = requestAnimationFrame(tick);
  };
  const play = () => { if (!frame) { last = 0; frame = requestAnimationFrame(tick); } };
  const pause = () => { cancelAnimationFrame(frame); frame = 0; };
  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener("visibilitychange", onVisibility);
  play();

  const stop = () => {
    pause();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.remove();
  };
  return stop;
};

/** Things a press should go to instead of picking up a decoration. */
const CLICKABLE = "a, button, input, select, textarea, label, summary, [role='button'], [contenteditable], .site-header, .mobile-menu, .portrait-stage, .gallery-lightbox, .dev-seasons";
const LONG_PRESS_MS = 420;

type Mounted = { item: DecorItem; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; base: Box | null; onScreen: boolean };

/**
 * Mounts the season's decorations. With `animate` they move (only while on screen and the tab is visible);
 * without, they're drawn once and redrawn on resize and theme changes. Visitors can drag the movable ones
 * (mouse: press and drag; touch: press and hold, then drag) and hide any of them with the × that appears
 * on hover or after a touch; both are remembered. `onChange` fires whenever something is hidden.
 */
export const mountDecor = (season: string, items: DecorItem[], animate: boolean, onChange: () => void): (() => void) => {
  const prefs = readPrefs();
  const mine = seasonPrefs(prefs, season);
  const controller = new AbortController();
  const { signal } = controller;
  const pageWidth = () => document.documentElement.clientWidth;

  const mounted: Mounted[] = [];
  for (const item of items) {
    const canvas = makeCanvas(`season-item season-item-${item.layer}`);
    const ctx = canvas.getContext("2d");
    if (ctx) mounted.push({ item, canvas, ctx, base: null, onScreen: true });
    else canvas.remove();
  }

  const render = (m: Mounted) => {
    if (!m.item.live.shown) return;
    m.ctx.clearRect(0, 0, m.item.live.w, m.item.live.h);
    m.item.draw(m.ctx, isDark(), m.item.live);
  };

  /** Applies the saved drag offset to the default place, keeping the item inside its bounds (or half on the page). */
  const position = (m: Mounted) => {
    const { base, item, canvas } = m;
    if (!base) return;
    const moved = mine.moved[item.id] ?? { x: 0, y: 0 };
    const area = item.bounds?.();
    const within = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
    const x = area ? within(base.x + moved.x, area.x, area.x + area.w - base.w) : within(base.x + moved.x, -base.w / 2, pageWidth() - base.w / 2);
    const y = area ? within(base.y + moved.y, area.y, area.y + area.h - base.h) : within(base.y + moved.y, 0, document.documentElement.scrollHeight - base.h / 2);
    Object.assign(item.live, { x, y, w: base.w, h: base.h });
    canvas.style.left = `${x}px`;
    canvas.style.top = `${y}px`;
  };

  const place = (m: Mounted) => {
    const { item, canvas, ctx } = m;
    m.base = mine.hidden.includes(item.id) ? null : item.place(pageWidth());
    item.live.shown = m.base !== null;
    canvas.hidden = m.base === null;
    if (!m.base) return;
    const ratio = pixelRatio();
    const [w, h] = [Math.round(m.base.w * ratio), Math.round(m.base.h * ratio)];
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${m.base.w}px`;
      canvas.style.height = `${m.base.h}px`;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    position(m);
    render(m);
  };

  // The page's layout settles in stages (styles, fonts, images), so places are re-measured whenever it changes.
  let queued = 0;
  const placeAll = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(() => mounted.forEach(place));
  };
  mounted.forEach(place);
  window.addEventListener("resize", placeAll, { signal });
  window.addEventListener("load", placeAll, { signal });
  void document.fonts?.ready.then(placeAll);
  const layoutWatcher = new ResizeObserver(placeAll);
  layoutWatcher.observe(document.body);
  const themeWatcher = new MutationObserver(() => mounted.forEach(render));
  themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let frame = 0;
  let last = 0;
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const m = mounted.find((candidate) => candidate.canvas === entry.target);
      if (m) m.onScreen = entry.isIntersecting;
    }
    sync();
  });
  const tick = (now: number) => {
    const dt = frameTime(now, last);
    last = now;
    for (const m of mounted) {
      if (!m.item.live.shown) continue;
      m.item.step?.(dt);
      if (m.onScreen) render(m);
    }
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    const run = animate && !document.hidden && mounted.some((m) => m.onScreen && m.item.live.shown);
    if (run && !frame) { last = 0; frame = requestAnimationFrame(tick); }
    else if (!run && frame) { cancelAnimationFrame(frame); frame = 0; }
  };
  mounted.forEach((m) => visibility.observe(m.canvas));
  document.addEventListener("visibilitychange", sync, { signal });
  sync();

  // ---- Picking up, dragging and hiding ----

  const gripOf = (m: Mounted): Box => {
    const { live } = m.item;
    const grip = m.item.grip?.(live) ?? { x: 0, y: 0, w: live.w, h: live.h };
    return { x: live.x + grip.x, y: live.y + grip.y, w: grip.w, h: grip.h };
  };
  /** The decoration under a page point, front ones first. */
  const itemAt = (x: number, y: number, movableOnly: boolean) => [...mounted].reverse()
    .sort((a, b) => Number(b.item.layer === "front") - Number(a.item.layer === "front"))
    .find((m) => {
      if (!m.item.live.shown || (movableOnly && m.item.drag === "none")) return false;
      const grip = gripOf(m);
      return x >= grip.x && x <= grip.x + grip.w && y >= grip.y && y <= grip.y + grip.h;
    });
  const overClickable = (target: EventTarget | null) => target instanceof Element && target.closest(CLICKABLE) !== null;

  const hideButton = document.createElement("button");
  hideButton.type = "button";
  hideButton.className = "season-hide";
  hideButton.hidden = true;
  hideButton.textContent = "×";
  hideButton.setAttribute("aria-label", "Hide this decoration");
  hideButton.dataset.i18nAriaLabel = "seasonHideOne";
  document.body.append(hideButton);
  let offered: Mounted | null = null;
  let offerTimer = 0;

  const offerHide = (m: Mounted | null, nearX?: number) => {
    window.clearTimeout(offerTimer);
    if (m === offered) return;
    offered = m;
    hideButton.hidden = m === null;
    if (!m) return;
    const grip = gripOf(m);
    // On something as wide as the lights, the button appears near the pointer instead of far off at one end.
    const wide = grip.w > 420 && nearX !== undefined;
    const x = wide ? nearX + 18 : grip.x + grip.w - 6;
    hideButton.style.left = `${Math.min(Math.max(x, 8), pageWidth() - 34)}px`;
    hideButton.style.top = `${wide ? grip.y + grip.h - 14 : Math.max(grip.y - 6, 52)}px`;
  };
  hideButton.addEventListener("click", () => {
    if (!offered) return;
    const m = offered;
    mine.hidden.push(m.item.id);
    savePrefs(prefs);
    offerHide(null);
    place(m);
    sync();
    onChange();
  }, { signal });

  let drag: { m: Mounted; fromX: number; fromY: number; startX: number; startY: number } | null = null;
  const root = document.documentElement;
  const beginDrag = (m: Mounted, pageX: number, pageY: number) => {
    const moved = mine.moved[m.item.id] ?? { x: 0, y: 0 };
    drag = { m, fromX: pageX, fromY: pageY, startX: moved.x, startY: moved.y };
    root.classList.add("season-dragging");
    offerHide(null);
  };
  const moveDrag = (pageX: number, pageY: number) => {
    if (!drag) return;
    mine.moved[drag.m.item.id] = {
      x: drag.startX + pageX - drag.fromX,
      y: drag.m.item.drag === "free" ? drag.startY + pageY - drag.fromY : 0,
    };
    position(drag.m);
    if (!animate) render(drag.m);
  };
  const endDrag = () => {
    if (!drag) return;
    const { m } = drag;
    drag = null;
    root.classList.remove("season-dragging");
    // Store where it actually ended up (after keeping it on the page), not where the pointer wandered.
    if (m.base) mine.moved[m.item.id] = { x: m.item.live.x - m.base.x, y: m.item.live.y - m.base.y };
    savePrefs(prefs);
    return m;
  };

  // Mouse and pen: press and drag. Hovering shows a grab cursor and the hide button.
  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0 || overClickable(event.target)) return;
    const m = itemAt(event.pageX, event.pageY, true);
    if (!m) return;
    event.preventDefault(); // no text selection while moving a decoration
    beginDrag(m, event.pageX, event.pageY);
  }, { signal });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    if (drag) { moveDrag(event.pageX, event.pageY); return; }
    if (event.target === hideButton) return;
    const blocked = overClickable(event.target);
    const m = blocked ? undefined : itemAt(event.pageX, event.pageY, false);
    root.classList.toggle("season-grab", m !== undefined && m.item.drag !== "none");
    offerHide(m ?? null, event.pageX);
  }, { signal });
  window.addEventListener("pointerup", (event) => { if (event.pointerType !== "touch") endDrag(); }, { signal });

  // Touch: press and hold to pick up, so ordinary scrolling over a decoration still works.
  let hold = 0;
  let touchStart: { x: number; y: number } | null = null;
  document.addEventListener("touchstart", (event) => {
    window.clearTimeout(hold);
    if (event.touches.length !== 1 || overClickable(event.target)) return;
    const { pageX, pageY } = event.touches[0];
    const m = itemAt(pageX, pageY, false);
    if (!m) { if (event.target !== hideButton) offerHide(null); return; }
    touchStart = { x: pageX, y: pageY };
    hold = window.setTimeout(() => {
      if (m.item.drag !== "none") beginDrag(m, pageX, pageY);
      else { offerHide(m, pageX); offerTimer = window.setTimeout(() => offerHide(null), 4000); }
    }, LONG_PRESS_MS);
  }, { passive: true, signal });
  document.addEventListener("touchmove", (event) => {
    const { pageX, pageY } = event.touches[0];
    if (drag) { event.preventDefault(); moveDrag(pageX, pageY); return; }
    if (touchStart && Math.hypot(pageX - touchStart.x, pageY - touchStart.y) > 8) window.clearTimeout(hold);
  }, { passive: false, signal });
  const endTouch = () => {
    window.clearTimeout(hold);
    touchStart = null;
    const m = endDrag();
    // After a touch drag, offer the hide button for a few seconds.
    if (m) { offerHide(m); offerTimer = window.setTimeout(() => offerHide(null), 4000); }
  };
  document.addEventListener("touchend", endTouch, { signal });
  document.addEventListener("touchcancel", endTouch, { signal });

  return () => {
    controller.abort();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(queued);
    window.clearTimeout(hold);
    window.clearTimeout(offerTimer);
    layoutWatcher.disconnect();
    themeWatcher.disconnect();
    visibility.disconnect();
    root.classList.remove("season-dragging", "season-grab");
    hideButton.remove();
    mounted.forEach((m) => { m.item.live.shown = false; m.canvas.remove(); });
  };
};
