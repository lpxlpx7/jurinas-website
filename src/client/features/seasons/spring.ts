import type { Decor, FallEffect, Scene } from "./layer.ts";
import { easeOut, headerHeight, pick, random, seeded, sprite } from "./util.ts";

type Point = { x: number; y: number };
type Twig = { from: Point; ctrl: Point; to: Point; w0: number; w1: number };
type Blossom = Point & { size: number; angle: number; bud: boolean; alpha: number };
type Petal = { x: number; y: number; size: number; speed: number; swing: number; phase: number; angle: number; spin: number; flip: number; image: HTMLCanvasElement };

const REACH_SECONDS = 1.6;
const SHED_SECONDS = 4.5;

const quad = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t * t * b;

/** One sakura petal, unit size, tip (with its little notch) up. */
const petalPath = () => {
  const path = new Path2D();
  path.moveTo(0, 1);
  path.bezierCurveTo(0.95, 0.55, 0.8, -0.85, 0.2, -1);
  path.lineTo(0, -0.74);
  path.lineTo(-0.2, -1);
  path.bezierCurveTo(-0.8, -0.85, -0.95, 0.55, 0, 1);
  return path;
};

/** Petal with a pale base and pinker tip. */
const paintPetal = (tip: string) => sprite(24, (ctx) => {
  ctx.scale(10, 10);
  const fill = ctx.createLinearGradient(0, 1, 0, -1);
  fill.addColorStop(0, "#fff6f8");
  fill.addColorStop(1, tip);
  ctx.fillStyle = fill;
  ctx.fill(petalPath());
});

/** Open flower: five petals, a pink eye and a ring of stamens. */
const paintBlossom = () => sprite(64, (ctx) => {
  for (let k = 0; k < 5; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI * 2) / 5);
    ctx.translate(0, -14);
    ctx.scale(11, 14);
    const fill = ctx.createLinearGradient(0, 1, 0, -1);
    fill.addColorStop(0, "#ffe9ef");
    fill.addColorStop(0.6, "#ffd0dc");
    fill.addColorStop(1, "#ffb1c6");
    ctx.fillStyle = fill;
    ctx.fill(petalPath());
    ctx.strokeStyle = "rgba(230,120,150,.25)";
    ctx.lineWidth = 0.06;
    ctx.stroke(petalPath());
    ctx.restore();
  }
  const eye = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
  eye.addColorStop(0, "rgba(214,60,110,.9)");
  eye.addColorStop(1, "rgba(214,60,110,0)");
  ctx.fillStyle = eye;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.strokeStyle = "rgba(205,90,120,.8)";
  ctx.lineWidth = 0.6;
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI * 2) / 12 + 0.2;
    const r = 7 + (k % 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
    ctx.fillStyle = "#e8b04a";
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
});

/** Closed bud with its green cup. */
const paintBud = () => sprite(32, (ctx) => {
  ctx.fillStyle = "#6f8f3a";
  ctx.beginPath();
  ctx.ellipse(0, 5, 3.4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  const fill = ctx.createLinearGradient(0, 6, 0, -8);
  fill.addColorStop(0, "#f7a3bb");
  fill.addColorStop(1, "#e2678f");
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(0, -1, 4.2, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
});

let art: { blossom: HTMLCanvasElement; bud: HTMLCanvasElement; petals: HTMLCanvasElement[] } | null = null;
const sakuraArt = () => art ??= {
  blossom: paintBlossom(),
  bud: paintBud(),
  petals: ["#ffc3d2", "#ffb0c4", "#ffd6e0", "#f9a0b9"].map(paintPetal),
};

/**
 * March and April: a cherry branch reaches over the top-right of the page from under the header and stays
 * there, rocking a little in the breeze. On a fresh visit it reaches in and sheds petals once.
 * The branch is drawn with the corner at (0, 0), reaching left and down.
 */
export const createSpring = ({ intro }: { intro: boolean }): Scene => {
  let time = 0;
  let scale = 300;
  let top = 48;
  let width = 0;
  let twigs: Twig[] = [];
  let blossoms: Blossom[] = [];

  const reach = () => (intro ? easeOut(time / REACH_SECONDS) : 1);
  const sway = () => (Math.sin(time * 1.1) * 0.016 + Math.sin(time * 2.3 + 1) * 0.005) * reach();
  const origin = () => ({ x: width + (1 - reach()) * scale * 1.1, y: top - (1 - reach()) * scale * 0.5 });

  const build = () => {
    const s = scale;
    const p = (x: number, y: number): Point => ({ x: x * s, y: y * s });
    twigs = [
      { from: p(0.12, -0.1), ctrl: p(-0.35, 0.06), to: p(-1, 0.2), w0: 0.05 * s, w1: 0.012 * s },
      { from: p(-0.25, 0.04), ctrl: p(-0.34, 0.2), to: p(-0.42, 0.4), w0: 0.022 * s, w1: 0.006 * s },
      { from: p(-0.52, 0.11), ctrl: p(-0.66, 0.03), to: p(-0.8, 0.02), w0: 0.018 * s, w1: 0.005 * s },
      { from: p(-0.7, 0.15), ctrl: p(-0.8, 0.28), to: p(-0.85, 0.44), w0: 0.016 * s, w1: 0.005 * s },
      { from: p(-0.06, 0.01), ctrl: p(-0.1, 0.16), to: p(-0.2, 0.3), w0: 0.02 * s, w1: 0.006 * s },
      { from: p(-0.9, 0.18), ctrl: p(-1, 0.3), to: p(-1.1, 0.29), w0: 0.012 * s, w1: 0.004 * s },
    ];
    // Seeded, so the flowers keep their places when the window is resized.
    const rand = seeded(3);
    blossoms = [];
    twigs.forEach((twig, i) => {
      const count = i === 0 ? 11 : 5;
      for (let k = 0; k < count; k++) {
        const t = 0.25 + rand() * 0.78;
        blossoms.push({
          x: quad(twig.from.x, twig.ctrl.x, twig.to.x, Math.min(t, 1)) + (rand() - 0.5) * 0.07 * s,
          y: quad(twig.from.y, twig.ctrl.y, twig.to.y, Math.min(t, 1)) + (rand() - 0.5) * 0.07 * s,
          size: (0.085 + rand() * 0.05) * s,
          angle: rand() * Math.PI * 2,
          bud: rand() < 0.18,
          alpha: 0.85 + rand() * 0.15,
        });
      }
    });
  };

  /** A random flower's position in viewport coordinates, for petals to fall from. */
  const flowerOnScreen = (): Point => {
    const { x, y } = pick(blossoms.filter((blossom) => !blossom.bud));
    const o = origin();
    const a = sway();
    return { x: o.x + x * Math.cos(a) - y * Math.sin(a), y: o.y + x * Math.sin(a) + y * Math.cos(a) - window.scrollY };
  };

  const decor: Decor = {
    layout(w) {
      width = w;
      top = headerHeight() - 6;
      scale = Math.min(Math.max(w * 0.3, 170), 380);
      build();
      return top + scale * 0.56;
    },

    step(dt) { time += dt; },

    draw(ctx, dark) {
      const o = origin();
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(sway());

      ctx.lineCap = "round";
      for (const twig of twigs) {
        // Taper by drawing the curve in short pieces of shrinking width, then a thin highlight along the top.
        const steps = 14;
        for (const [color, widthScale, offset] of [[dark ? "#6e4a3b" : "#4a2f25", 1, 0], [dark ? "#9a7262" : "#7a5444", 0.35, -0.25]] as const) {
          ctx.strokeStyle = color;
          for (let i = 0; i < steps; i++) {
            const t0 = i / steps;
            const t1 = (i + 1) / steps;
            const lw = (twig.w0 + (twig.w1 - twig.w0) * t0) * widthScale;
            ctx.lineWidth = lw;
            const shift = offset * (twig.w0 + (twig.w1 - twig.w0) * t0);
            ctx.beginPath();
            ctx.moveTo(quad(twig.from.x, twig.ctrl.x, twig.to.x, t0), quad(twig.from.y, twig.ctrl.y, twig.to.y, t0) + shift);
            ctx.lineTo(quad(twig.from.x, twig.ctrl.x, twig.to.x, t1), quad(twig.from.y, twig.ctrl.y, twig.to.y, t1) + shift);
            ctx.stroke();
          }
        }
      }

      const { blossom, bud } = sakuraArt();
      for (const flower of blossoms) {
        ctx.save();
        ctx.translate(flower.x, flower.y);
        ctx.rotate(flower.angle);
        ctx.globalAlpha = flower.alpha;
        const size = flower.bud ? flower.size * 0.55 : flower.size;
        ctx.drawImage(flower.bud ? bud : blossom, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      ctx.restore();
    },
  };

  const petalFall = (): FallEffect => {
    let petals: Petal[] = [];
    let elapsed = 0;
    let clock = 0;
    let rate = 0.08;
    return {
      resize(w) { rate = w < 735 ? 0.14 : 0.08; },
      step(dt, _w, height) {
        elapsed += dt;
        // Petals start once the branch is mostly in, and stop after a few seconds.
        if (reach() > 0.75 && elapsed < REACH_SECONDS + SHED_SECONDS) {
          clock += dt;
          while (clock > rate) {
            clock -= rate;
            const from = flowerOnScreen();
            petals.push({
              ...from,
              size: random(7, 12),
              speed: random(55, 85),
              swing: random(25, 50),
              phase: random(0, Math.PI * 2),
              angle: random(0, Math.PI * 2),
              spin: random(-1.5, 1.5),
              flip: random(0, Math.PI * 2),
              image: pick(sakuraArt().petals),
            });
          }
        }
        for (const petal of petals) {
          petal.phase += dt * 1.5;
          petal.flip += dt * 2.6;
          petal.angle += dt * petal.spin;
          petal.y += petal.speed * (0.6 + 0.4 * Math.abs(Math.sin(petal.phase))) * dt;
          petal.x += (Math.cos(petal.phase) * petal.swing - 16) * dt;
        }
        petals = petals.filter((petal) => petal.y - petal.size <= height && petal.x > -40);
        return elapsed < REACH_SECONDS + SHED_SECONDS || petals.length > 0;
      },
      draw(ctx) {
        for (const petal of petals) {
          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.angle);
          ctx.scale(Math.max(Math.abs(Math.cos(petal.flip)), 0.15), 1);
          ctx.drawImage(petal.image, -petal.size / 2, -petal.size / 2, petal.size, petal.size);
          ctx.restore();
        }
      },
    };
  };

  return { decor, fall: petalFall() };
};
