import type { Decor, Scene } from "./layer.ts";
import { createSnow } from "./snow.ts";
import { drawSprite, easeInOut, glowSprite, headerHeight, seeded } from "./util.ts";

const SAG = 24;
const BULB_COLORS = ["#ff5a5a", "#ffc94d", "#45d483", "#5aaeff", "#ff8ad8"];
const DROP_SECONDS = 1;

type Bulb = { x: number; y: number; color: number; phase: number };
type Ornament = { x: number; y: number; r: number; color: string };
type Twinkle = { x: number; y: number; phase: number };

let halos: HTMLCanvasElement[] | null = null;
const bulbHalos = () => halos ??= BULB_COLORS.map((color) => glowSprite(48, [[0, `${color}cc`], [0.25, `${color}66`], [1, `${color}00`]]));
let starGlow: HTMLCanvasElement | null = null;
const warmGlow = () => starGlow ??= glowSprite(64, [[0, "rgba(255,230,140,.9)"], [0.3, "rgba(255,210,90,.35)"], [1, "rgba(255,210,90,0)"]]);

const onCurve = (x0: number, cx: number, x1: number, sag: number, t: number) => ({
  x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
  y: 2 * (1 - t) * t * sag,
});

/**
 * December: a string of lights hangs across the top of the page (under the header) and a small tree stands
 * at the top right. Both stay; on a fresh visit the lights drop in and snow falls once.
 */
export const createChristmas = ({ intro }: { intro: boolean }): Scene => {
  let time = 0;
  let top = 48;
  let swags: Array<{ x0: number; x1: number }> = [];
  let bulbs: Bulb[] = [];
  let tree = { x: 0, y: 0, w: 0, h: 0 };
  let ornaments: Ornament[] = [];
  let twinkles: Twinkle[] = [];

  const layoutTree = (width: number) => {
    const roomy = width >= 1200;
    const w = roomy ? Math.min(96, (width - 1120) / 2 - 8) : width < 735 ? 46 : 62;
    const w2 = Math.max(w, 46);
    tree = { w: w2, h: w2 * 1.45, x: width - (roomy ? (width - 1120) / 4 + 4 : w2 / 2 + 10), y: top + SAG + 18 };
    const rand = seeded(12);
    const colors = ["#e03131", "#f2c94c", "#4dabf7", "#e9ecef", "#c2255c"];
    ornaments = [];
    twinkles = [];
    // Scatter inside the cone: the further down, the wider the tree.
    for (let i = 0; i < 9; i++) {
      const v = 0.3 + rand() * 0.55;
      ornaments.push({ x: (rand() - 0.5) * v * tree.w * 0.8, y: v * tree.h * 0.82, r: tree.w * (0.045 + rand() * 0.02), color: colors[i % colors.length] });
    }
    for (let i = 0; i < 12; i++) {
      const v = 0.18 + rand() * 0.66;
      twinkles.push({ x: (rand() - 0.5) * v * tree.w * 0.85, y: v * tree.h * 0.82, phase: rand() * 10 });
    }
  };

  const drawTree = (ctx: CanvasRenderingContext2D, dark: boolean) => {
    const { x, y, w, h } = tree;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = dark ? "#7a4f30" : "#6b4226";
    ctx.fillRect(-w * 0.07, h * 0.8, w * 0.14, h * 0.13);

    // Three tiers, widest at the bottom, each with a scalloped hem.
    const tiers = [[0.08, 0.42, 0.55], [0.3, 0.64, 0.78], [0.52, 0.86, 1]];
    for (const [apex, hem, spread] of tiers) {
      const half = (w / 2) * spread;
      const ay = h * apex;
      const hy = h * hem;
      const green = ctx.createLinearGradient(-half, 0, half, 0);
      green.addColorStop(0, dark ? "#3f9a62" : "#3a8d58");
      green.addColorStop(1, dark ? "#1e5a37" : "#1c5232");
      ctx.fillStyle = green;
      ctx.beginPath();
      ctx.moveTo(0, ay - h * 0.04);
      ctx.quadraticCurveTo(half * 0.35, ay + (hy - ay) * 0.45, half, hy);
      const scallops = 4;
      for (let i = scallops; i > 0; i--) {
        const xa = -half + ((i - 1) / scallops) * half * 2;
        const xm = (-half + ((i - 0.5) / scallops) * half * 2);
        ctx.quadraticCurveTo(xm, hy + h * 0.045, xa, hy);
      }
      ctx.quadraticCurveTo(-half * 0.35, ay + (hy - ay) * 0.45, 0, ay - h * 0.04);
      ctx.fill();
      // A dusting of snow along each hem.
      ctx.strokeStyle = dark ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.95)";
      ctx.lineWidth = Math.max(1.2, w * 0.025);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-half * 0.8, hy - h * 0.005);
      ctx.quadraticCurveTo(0, hy + h * 0.03, half * 0.8, hy - h * 0.005);
      ctx.stroke();
    }

    // Gold tinsel looping across the tree.
    ctx.strokeStyle = "rgba(255,214,110,.85)";
    ctx.lineWidth = Math.max(1, w * 0.018);
    for (const [y0, y1, spread] of [[0.3, 0.4, 0.5], [0.52, 0.64, 0.72], [0.72, 0.84, 0.92]]) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.5 * spread * 0.7, h * y0);
      ctx.quadraticCurveTo(0, h * (y1 + 0.04), w * 0.5 * spread * 0.75, h * y0 + h * 0.02);
      ctx.stroke();
    }

    for (const { x: ox, y: oy, r, color } of ornaments) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.beginPath();
      ctx.arc(ox - r * 0.35, oy - r * 0.35, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    const glow = warmGlow();
    for (const { x: tx, y: ty, phase } of twinkles) {
      const on = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 2.4 + phase));
      ctx.globalAlpha = on * (dark ? 0.9 : 0.6);
      ctx.save();
      ctx.translate(tx, ty);
      drawSprite(ctx, glow, w * 0.16);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff6d0";
      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(0.8, w * 0.012), 0, Math.PI * 2);
      ctx.fill();
    }

    // Star on top, gently pulsing.
    const pulse = 0.75 + 0.25 * Math.sin(time * 2);
    ctx.save();
    ctx.translate(0, h * 0.04);
    ctx.globalAlpha = pulse * (dark ? 1 : 0.8);
    drawSprite(ctx, glow, w * 0.7);
    ctx.globalAlpha = 1;
    const outer = w * 0.11;
    ctx.fillStyle = "#ffd43b";
    ctx.strokeStyle = "#e0a800";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? outer * 0.45 : outer;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  const decor: Decor = {
    layout(width) {
      top = headerHeight();
      const count = Math.max(3, Math.round(width / 200));
      const span = width / count;
      swags = Array.from({ length: count }, (_, i) => ({ x0: i * span, x1: (i + 1) * span }));
      bulbs = [];
      const perSwag = 6;
      swags.forEach(({ x0, x1 }, s) => {
        for (let i = 1; i <= perSwag; i++) {
          const n = s * perSwag + i;
          bulbs.push({ ...onCurve(x0, (x0 + x1) / 2, x1, SAG * 2, i / (perSwag + 1)), color: n % BULB_COLORS.length, phase: n * 2.1 });
        }
      });
      layoutTree(width);
      return Math.max(top + SAG + 40, tree.y + tree.h + 16);
    },

    step(dt) { time += dt; },

    draw(ctx, dark) {
      const drop = intro ? easeInOut(time / DROP_SECONDS) : 1;

      ctx.save();
      // Before dropping in, the string hides under the header.
      ctx.translate(0, top - 4 - (1 - drop) * (SAG + 30));
      ctx.strokeStyle = dark ? "#3c6e4a" : "#24492f";
      ctx.lineWidth = 1.5;
      for (const { x0, x1 } of swags) {
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.quadraticCurveTo((x0 + x1) / 2, SAG * 2, x1, 0);
        ctx.stroke();
      }
      const halo = bulbHalos();
      for (const bulb of bulbs) {
        const glow = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2.2 + bulb.phase));
        const color = BULB_COLORS[bulb.color];
        ctx.save();
        ctx.translate(bulb.x, bulb.y);
        ctx.rotate(Math.sin(time * 1.3 + bulb.phase) * 0.06);
        ctx.fillStyle = dark ? "#55555a" : "#2f3a33";
        ctx.fillRect(-2, 0, 4, 4);
        ctx.save();
        ctx.translate(0, 9.5);
        ctx.globalAlpha = glow * (dark ? 0.9 : 0.55);
        drawSprite(ctx, halo[bulb.color], 34);
        ctx.restore();
        ctx.globalAlpha = 0.55 + 0.45 * glow;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 9.5, 3.5, 5.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.6 * glow;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(-1.1, 7.6, 1, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      drawTree(ctx, dark);
    },
  };

  return { decor, fall: createSnow({ areaPerFlake: 10000, maxFlakes: 150 }) };
};
