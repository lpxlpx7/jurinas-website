export const random = (min: number, max: number) => min + Math.random() * (max - min);
export const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
export const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
export const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};

/** Small seeded generator, so decorations keep the same look when the window is resized. */
export const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Height of the sticky header, so decorations can hang just below it. (`||`: an unstyled header measures 0.) */
export const headerHeight = (): number => document.querySelector<HTMLElement>(".site-header")?.offsetHeight || 48;

/** An element's box in page coordinates, as laid out right now. */
export const pageBox = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, w: rect.width, h: rect.height };
};

/** Draws once into an offscreen canvas of `size` × `size` CSS pixels (at 2× for sharpness), centred on (0, 0). */
export const sprite = (size: number, paint: (ctx: CanvasRenderingContext2D) => void, height = size): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = size * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2);
    ctx.translate(size / 2, height / 2);
    paint(ctx);
  }
  return canvas;
};

/** A soft round glow: `stops` are [offset, rgba] from the centre out. */
export const glowSprite = (size: number, stops: Array<[number, string]>) => sprite(size, (ctx) => {
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(-size / 2, -size / 2, size, size);
});

/** Draws a sprite centred at the current origin, `w` wide (and `h` tall). */
export const drawSprite = (ctx: CanvasRenderingContext2D, image: HTMLCanvasElement, w: number, h = (w * image.height) / image.width) =>
  ctx.drawImage(image, -w / 2, -h / 2, w, h);

/** A blank offscreen canvas of `width` × `height` CSS pixels at 2× density, origin at the top left. */
export const offscreen = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * 2);
  canvas.height = Math.ceil(height * 2);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  return { canvas, ctx };
};

/** Mixes two [r, g, b] colours; t = 0 gives `a`, 1 gives `b`. */
export const mix = (a: readonly number[], b: readonly number[], t: number) => {
  const k = clamp01(t);
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
};
