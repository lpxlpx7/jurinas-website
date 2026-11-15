import type { FallEffect } from "./layer.ts";
import { clamp01, glowSprite, offscreen, random } from "./util.ts";

type Flake = {
  x: number; y: number; size: number; speed: number; sway: number; phase: number; drift: number;
  alpha: number; kind: "dot" | "crystal" | "blur"; angle: number; spin: number; shimmer: number;
};

export type SnowOptions = {
  /** One flake per this many square pixels of screen… */
  areaPerFlake?: number;
  /** …but never more than this. */
  maxFlakes?: number;
  /** Seconds of steady snowfall before it thins out and fades away (which takes a few seconds more). */
  duration?: number;
};

const FADE_IN = 1.2;
const FADE_OUT = 3.5;

/** A six-armed snow crystal with little side branches, softened so it doesn't look drawn. */
const crystal = (color: string, glow: string) => {
  const { canvas, ctx } = offscreen(48, 48);
  ctx.translate(24, 24);
  ctx.shadowColor = glow;
  ctx.shadowBlur = 5;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  for (let arm = 0; arm < 6; arm++) {
    ctx.save();
    ctx.rotate((arm * Math.PI) / 3);
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -17);
    ctx.stroke();
    ctx.lineWidth = 1.4;
    for (const [at, len] of [[-7, 4.5], [-12, 3.4]]) {
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, at);
        ctx.lineTo(side * len, at - len * 0.9);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
};

type SnowArt = Record<Flake["kind"], HTMLCanvasElement>;
let artByTheme: { dark: SnowArt; light: SnowArt } | null = null;
/** White on the dark page. On the light page flakes get a cool blue-grey edge, or they'd vanish. */
const art = () => artByTheme ??= {
  dark: {
    dot: glowSprite(32, [[0, "rgba(255,255,255,1)"], [0.32, "rgba(255,255,255,.92)"], [0.6, "rgba(255,255,255,.28)"], [1, "rgba(255,255,255,0)"]]),
    blur: glowSprite(64, [[0, "rgba(255,255,255,.75)"], [0.5, "rgba(255,255,255,.4)"], [1, "rgba(255,255,255,0)"]]),
    crystal: crystal("rgba(255,255,255,.95)", "rgba(190,220,255,.9)"),
  },
  light: {
    dot: glowSprite(32, [[0, "rgba(176,198,230,1)"], [0.3, "rgba(160,186,224,.95)"], [0.6, "rgba(150,178,218,.4)"], [1, "rgba(150,178,218,0)"]]),
    blur: glowSprite(64, [[0, "rgba(165,190,226,.75)"], [0.5, "rgba(165,190,226,.4)"], [1, "rgba(165,190,226,0)"]]),
    crystal: crystal("rgba(120,154,204,1)", "rgba(120,150,200,.6)"),
  },
};

/**
 * Snow that drifts rather than drops. Far flakes are small, faint and slow; nearer ones are larger, and the
 * largest are six-armed crystals that turn as they fall; a few very close ones are big soft blurs. It fades
 * in, snows for a while, then thins out and fades away.
 */
export const createSnow = ({ areaPerFlake = 5200, maxFlakes = 260, duration = 9 }: SnowOptions = {}): FallEffect => {
  let flakes: Flake[] = [];
  let time = 0;

  const makeFlake = (width: number, height: number, anywhere: boolean): Flake => {
    const roll = Math.random();
    const kind: Flake["kind"] = roll < 0.05 ? "blur" : roll < 0.2 ? "crystal" : "dot";
    const depth = kind === "blur" ? 1 : kind === "crystal" ? random(0.55, 1) : Math.random() ** 1.5;
    const size = kind === "blur" ? random(22, 36) : kind === "crystal" ? 12 + depth * 14 : 4 + depth * 8;
    return {
      x: random(-0.08, 1.08) * width,
      y: anywhere ? random(-0.15, 0.7) * height : -size - random(0, 40),
      size,
      speed: (kind === "blur" ? 105 : 26 + depth * 62) + random(-6, 6),
      sway: 10 + depth * 26,
      phase: random(0, Math.PI * 2),
      drift: random(0.45, 1.1),
      alpha: kind === "blur" ? random(0.2, 0.34) : kind === "crystal" ? 0.55 + depth * 0.4 : 0.4 + depth * 0.55,
      kind,
      angle: random(0, Math.PI),
      spin: random(-0.7, 0.7),
      shimmer: random(0, 10),
    };
  };

  return {
    resize(width, height) {
      if (flakes.length) return;
      const total = Math.min(maxFlakes, Math.round((width * height) / areaPerFlake));
      flakes = Array.from({ length: total }, () => makeFlake(width, height, true));
    },

    step(dt, width, height) {
      time += dt;
      // A lazy breeze that changes direction, with the odd stronger breath.
      const wind = Math.sin(time * 0.31) * 16 + Math.sin(time * 0.83 + 1.3) * 8;
      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];
        flake.phase += dt * flake.drift;
        flake.angle += dt * flake.spin;
        flake.y += flake.speed * dt;
        flake.x += (wind * (flake.size / 10) + Math.sin(flake.phase) * flake.sway) * dt;
        if (flake.y - flake.size > height && time < duration) flakes[i] = makeFlake(width, height, false);
      }
      return time < duration + FADE_OUT;
    },

    draw(ctx, dark) {
      const sprites = art()[dark ? "dark" : "light"];
      const envelope = clamp01(time / FADE_IN) * clamp01((duration + FADE_OUT - time) / FADE_OUT);
      for (const flake of flakes) {
        ctx.globalAlpha = envelope * flake.alpha * (0.85 + 0.15 * Math.sin(time * 2 + flake.shimmer));
        if (flake.kind === "crystal") {
          ctx.save();
          ctx.translate(flake.x, flake.y);
          ctx.rotate(flake.angle);
          // Crystals tumble: squashing one axis reads as turning in the air.
          ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(flake.phase * 0.8)));
          ctx.drawImage(sprites.crystal, -flake.size / 2, -flake.size / 2, flake.size, flake.size);
          ctx.restore();
        } else {
          ctx.drawImage(sprites[flake.kind], flake.x - flake.size / 2, flake.y - flake.size / 2, flake.size, flake.size);
        }
      }
      ctx.globalAlpha = 1;
    },
  };
};
