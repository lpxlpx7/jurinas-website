import type { FallEffect } from "./layer.ts";
import { glowSprite, random } from "./util.ts";

type Flake = { x: number; y: number; size: number; speed: number; sway: number; phase: number; drift: number; alpha: number };

export type SnowOptions = {
  /** One flake per this many square pixels of screen… */
  areaPerFlake?: number;
  /** …but never more than this. */
  maxFlakes?: number;
  /** Seconds over which the flakes are let go; after that the snow just falls out of view. */
  release?: number;
};

/** Soft-edged flakes: white on dark; on light, a pale core with an icy blue rim so they still show. */
let sprites: { dark: HTMLCanvasElement; light: HTMLCanvasElement } | null = null;
const flakeSprites = () => sprites ??= {
  dark: glowSprite(32, [[0, "rgba(255,255,255,1)"], [0.3, "rgba(255,255,255,.95)"], [0.55, "rgba(255,255,255,.35)"], [1, "rgba(255,255,255,0)"]]),
  light: glowSprite(32, [[0, "rgba(255,255,255,1)"], [0.28, "rgba(232,240,250,1)"], [0.5, "rgba(170,192,222,.6)"], [1, "rgba(170,192,222,0)"]]),
};

/**
 * A short snowfall that drifts down once and is gone. Flakes sit at different depths: far ones are small,
 * faint and slow; near ones bigger and quicker; a few very close ones are large, blurry and see-through.
 */
export const createSnow = ({ areaPerFlake = 8000, maxFlakes = 180, release = 3 }: SnowOptions = {}): FallEffect => {
  let flakes: Flake[] = [];
  let total = 0;
  let released = 0;
  let time = 0;

  const makeFlake = (width: number, height: number): Flake => {
    const close = Math.random() < 0.05;
    const depth = close ? 1 : Math.random() ** 1.6;
    const size = close ? random(16, 26) : 3 + depth * 7;
    return {
      x: random(-0.05, 1.05) * width,
      y: -size - random(0, height * 0.15),
      size,
      speed: close ? random(190, 240) : 55 + depth * 120 + random(-10, 10),
      sway: 6 + depth * 22,
      phase: random(0, Math.PI * 2),
      drift: random(0.5, 1.3),
      alpha: close ? random(0.18, 0.3) : 0.45 + depth * 0.5,
    };
  };

  return {
    resize(width, height) {
      if (time === 0) total = Math.min(maxFlakes, Math.round((width * height) / areaPerFlake));
    },

    step(dt, width, height) {
      time += dt;
      const due = Math.min(total, Math.round(total * (time / release)));
      while (released < due) { flakes.push(makeFlake(width, height)); released++; }

      const wind = Math.sin(time * 0.35) * 14 + Math.sin(time * 0.9 + 1) * 6;
      for (const flake of flakes) {
        flake.phase += dt * flake.drift;
        flake.y += flake.speed * dt;
        flake.x += (wind * (flake.size / 8) + Math.sin(flake.phase) * flake.sway) * dt;
      }
      flakes = flakes.filter((flake) => flake.y - flake.size <= height);
      return released < total || flakes.length > 0;
    },

    draw(ctx, dark) {
      const image = flakeSprites()[dark ? "dark" : "light"];
      for (const flake of flakes) {
        ctx.globalAlpha = flake.alpha;
        ctx.drawImage(image, flake.x - flake.size / 2, flake.y - flake.size / 2, flake.size, flake.size);
      }
      ctx.globalAlpha = 1;
    },
  };
};

