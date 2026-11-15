/** A one-off effect on a fixed full-screen canvas (snow, leaves, petals). When `step` returns false the canvas is removed. */
export type FallEffect = {
  /** Called on start and on every resize, with the viewport size in CSS pixels. */
  resize: (width: number, height: number) => void;
  /** `dt` is seconds since the last frame, capped so a background tab doesn't cause a jump. Returns false when finished. */
  step: (dt: number, width: number, height: number) => boolean;
  draw: (ctx: CanvasRenderingContext2D, dark: boolean) => void;
};

/**
 * A lasting decoration in a strip across the top of the page (lights, a branch, a wind chime). It scrolls
 * away with the page rather than following it, and clicks pass straight through.
 */
export type Decor = {
  /** Lays out for this page width and returns how tall the strip needs to be, in CSS pixels. */
  layout: (width: number) => number;
  step: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D, dark: boolean, width: number) => void;
};

/** What a season shows: a lasting decoration, a one-off fall for fresh visits, or both. */
export type Scene = { decor?: Decor; fall?: FallEffect };

export const isDark = () => document.documentElement.dataset.theme === "dark";

const makeCanvas = (className: string) => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  return canvas;
};

const frameTime = (now: number, last: number) => (last ? Math.min((now - last) / 1000, 0.05) : 0);

/** Mounts a fixed, click-through canvas and runs the effect on it until it finishes. */
export const startFallLayer = (effect: FallEffect) => {
  const canvas = makeCanvas("season-fall");
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }

  let width = 0;
  let height = 0;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
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
};

/**
 * Mounts the decoration strip at the top of the page. With `animate` it moves (only while on screen and the
 * tab is visible); without, it's drawn once and redrawn on resize and theme changes.
 */
export const startDecorLayer = (decor: Decor, animate: boolean) => {
  const canvas = makeCanvas("season-decor");
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }

  let width = 0;
  let height = 0;
  const render = () => {
    ctx.clearRect(0, 0, width, height);
    decor.draw(ctx, isDark(), width);
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = document.documentElement.clientWidth;
    height = Math.ceil(decor.layout(width));
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  };
  resize();
  window.addEventListener("resize", resize);

  if (!animate) {
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return;
  }

  let frame = 0;
  let last = 0;
  let onScreen = true;
  const tick = (now: number) => {
    decor.step(frameTime(now, last));
    last = now;
    render();
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    const run = onScreen && !document.hidden;
    if (run && !frame) { last = 0; frame = requestAnimationFrame(tick); }
    else if (!run && frame) { cancelAnimationFrame(frame); frame = 0; }
  };
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }).observe(canvas);
  document.addEventListener("visibilitychange", sync);
  sync();
};
