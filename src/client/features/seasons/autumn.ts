import type { FallEffect, Scene } from "./layer.ts";
import { pick, random, sprite } from "./util.ts";

type LeafLook = { front: HTMLCanvasElement; back: HTMLCanvasElement };
type Leaf = {
  x: number; y: number; size: number; speed: number;
  swing: number; phase: number; rate: number; tilt: number; flip: number; flipRate: number;
  look: LeafLook;
};

const RELEASE = 3.5;
const SPRITE = 64;

/** Japanese maple: seven pointed lobes fanning out from the stem. Unit size, centred, stem down. */
const momijiPath = () => {
  const path = new Path2D();
  const polar = (deg: number, r: number): [number, number] => [Math.sin((deg * Math.PI) / 180) * r, -Math.cos((deg * Math.PI) / 180) * r];
  const lobes: Array<[number, number]> = [[-118, 0.56], [-78, 0.8], [-38, 0.94], [0, 1], [38, 0.94], [78, 0.8], [118, 0.56]];
  path.moveTo(...polar(-150, 0.16));
  lobes.forEach(([deg, length], i) => {
    const next = i < lobes.length - 1 ? (deg + lobes[i + 1][0]) / 2 : 150;
    path.quadraticCurveTo(...polar(deg - 14, length * 0.55), ...polar(deg, length));
    path.quadraticCurveTo(...polar(deg + 14, length * 0.55), ...polar(next, i === lobes.length - 1 ? 0.16 : 0.3));
  });
  path.closePath();
  return { path, veins: lobes.map(([deg, length]) => polar(deg, length * 0.88)), stem: [0, 0.62] as [number, number] };
};

/** Ginkgo: a fan with a notch in the middle of its wavy edge. */
const ginkgoPath = () => {
  const path = new Path2D();
  const base: [number, number] = [0, 0.55];
  const at = (deg: number, r: number): [number, number] => [base[0] + Math.sin((deg * Math.PI) / 180) * r, base[1] - Math.cos((deg * Math.PI) / 180) * r];
  path.moveTo(...base);
  path.lineTo(...at(-58, 1.15));
  path.quadraticCurveTo(...at(-34, 1.32), ...at(-12, 1.2));
  path.lineTo(...at(0, 0.95));
  path.lineTo(...at(12, 1.2));
  path.quadraticCurveTo(...at(34, 1.32), ...at(58, 1.15));
  path.closePath();
  const veins: Array<[number, number]> = [];
  for (let deg = -50; deg <= 50; deg += 7) veins.push(at(deg, Math.abs(deg) < 6 ? 0.9 : 1.12));
  return { path, veins, base, stem: [0, 1.0] as [number, number] };
};

const MOMIJI_COLORS = ["#b8321e", "#c4471c", "#cf5b26", "#a8281f", "#c9762b", "#9e3b1c", "#d06a1e"];
const GINKGO_COLORS = ["#e2b02a", "#d9a823", "#e6bd3c", "#cf9b1d"];

/**
 * Paints one leaf: a lit-from-above gradient, a few darker blotches, veins and a slightly darker edge.
 * The back is paler and duller, as real leaves are.
 */
const paintLeaf = (kind: "momiji" | "ginkgo", color: string, back: boolean) => sprite(SPRITE, (ctx) => {
  const s = SPRITE * 0.42;
  ctx.scale(s, s);
  const shape = kind === "momiji" ? momijiPath() : ginkgoPath();
  const origin = kind === "momiji" ? ([0, 0] as [number, number]) : ginkgoPath().base;

  // Stem first, so the blade covers its root.
  ctx.strokeStyle = back ? "#8a5a32" : "#6e3b1c";
  ctx.lineWidth = 0.05;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(...origin);
  ctx.lineTo(...shape.stem);
  ctx.stroke();

  ctx.save();
  ctx.clip(shape.path);
  const light = ctx.createLinearGradient(-0.8, -1, 0.8, 0.9);
  light.addColorStop(0, back ? "rgba(255,240,215,.55)" : "rgba(255,230,170,.35)");
  light.addColorStop(0.55, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(60,20,0,.28)");
  ctx.fillStyle = color;
  ctx.fillRect(-1.5, -1.5, 3, 3);
  ctx.fillStyle = light;
  ctx.fillRect(-1.5, -1.5, 3, 3);
  // A few soft brown blotches so the colour isn't perfectly flat.
  for (let i = 0; i < 4; i++) {
    const x = random(-0.6, 0.6);
    const y = random(-0.7, 0.4);
    const r = random(0.08, 0.22);
    const spot = ctx.createRadialGradient(x, y, 0, x, y, r);
    spot.addColorStop(0, "rgba(90,40,10,.22)");
    spot.addColorStop(1, "rgba(90,40,10,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  if (back) { ctx.fillStyle = "rgba(255,245,230,.18)"; ctx.fillRect(-1.5, -1.5, 3, 3); }

  ctx.strokeStyle = back ? "rgba(120,60,20,.45)" : "rgba(80,25,5,.35)";
  ctx.lineWidth = kind === "momiji" ? 0.035 : 0.018;
  for (const vein of shape.veins) {
    ctx.beginPath();
    ctx.moveTo(...origin);
    ctx.lineTo(...vein);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(70,20,0,.3)";
  ctx.lineWidth = 0.03;
  ctx.stroke(shape.path);
});

let looks: LeafLook[] | null = null;
const leafLooks = () => looks ??= [
  ...MOMIJI_COLORS.map((color) => ({ front: paintLeaf("momiji", color, false), back: paintLeaf("momiji", color, true) })),
  ...MOMIJI_COLORS.slice(0, 3).map((color) => ({ front: paintLeaf("momiji", color, false), back: paintLeaf("momiji", color, true) })),
  ...GINKGO_COLORS.map((color) => ({ front: paintLeaf("ginkgo", color, false), back: paintLeaf("ginkgo", color, true) })),
];

/** October to mid November: maple and ginkgo leaves flutter down once, rocking and turning over. */
const createLeafFall = (): FallEffect => {
  let leaves: Leaf[] = [];
  let total = 0;
  let released = 0;
  let time = 0;

  const makeLeaf = (width: number): Leaf => ({
    x: random(-0.05, 1.05) * width,
    y: -random(30, 160),
    size: random(20, 34),
    speed: random(75, 110),
    swing: random(30, 70),
    phase: random(0, Math.PI * 2),
    rate: random(1.4, 2.2),
    tilt: random(-0.6, 0.6),
    flip: random(0, Math.PI * 2),
    flipRate: random(0.8, 2.2),
    look: pick(leafLooks()),
  });

  return {
    resize(width) {
      if (time === 0) total = Math.min(36, Math.max(12, Math.round(width / 40)));
    },

    step(dt, width, height) {
      time += dt;
      const due = Math.min(total, Math.round(total * (time / RELEASE)));
      while (released < due) { leaves.push(makeLeaf(width)); released++; }
      for (const leaf of leaves) {
        leaf.phase += dt * leaf.rate;
        leaf.flip += dt * leaf.flipRate;
        // Like a real leaf: it swings side to side and slows at the ends of each swing, instead of dropping straight.
        const swing = Math.sin(leaf.phase);
        leaf.x += (Math.cos(leaf.phase) * leaf.swing + 10) * dt;
        leaf.y += leaf.speed * (0.55 + 0.45 * Math.abs(swing)) * dt;
      }
      leaves = leaves.filter((leaf) => leaf.y - leaf.size <= height);
      return released < total || leaves.length > 0;
    },

    draw(ctx) {
      for (const leaf of leaves) {
        const turn = Math.cos(leaf.flip);
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.tilt + Math.cos(leaf.phase) * 0.7);
        ctx.scale(Math.max(Math.abs(turn), 0.12), 1);
        const image = turn >= 0 ? leaf.look.front : leaf.look.back;
        const w = (leaf.size * SPRITE) / (SPRITE * 0.84);
        ctx.drawImage(image, -w / 2, -w / 2, w, w);
        ctx.restore();
      }
    },
  };
};

export const createAutumn = (): Scene => ({ fall: createLeafFall() });
