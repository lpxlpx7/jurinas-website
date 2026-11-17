import { mix, offscreen, seeded } from "./util.ts";

export type TreeArt = {
  image: HTMLCanvasElement;
  /** Fairy-light positions on the tree, in the same pixels as the size passed in; `warm` ones are white. */
  lights: Array<{ x: number; y: number; hue: number; phase: number }>;
  star: { x: number; y: number; r: number };
};

type Point = { x: number; y: number };

const DARK = [14, 48, 30];
const MID = [30, 92, 56];
const LIGHT = [84, 150, 92];
const ORNAMENTS = [[200, 30, 43], [217, 165, 32], [44, 107, 209], [206, 212, 220], [150, 40, 120]];

const quad = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t * t * b;

/** A glass bauble: lit from the upper left, darker at the rim, with a bright glint and a little gold cap. */
const bauble = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: number[]) => {
  ctx.strokeStyle = "rgba(60,45,20,.7)";
  ctx.lineWidth = Math.max(0.5, r * 0.08);
  ctx.beginPath();
  ctx.moveTo(x, y - r * 1.9);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  const glass = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  glass.addColorStop(0, mix(color, [255, 255, 255], 0.6));
  glass.addColorStop(0.45, mix(color, [255, 255, 255], 0.05));
  glass.addColorStop(1, mix(color, [0, 0, 0], 0.55));
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  // Light bouncing back off the lower right edge.
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = r * 0.14;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.78, 0.25, 1.25);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.4, y - r * 0.45, r * 0.2, r * 0.13, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c9a23a";
  ctx.fillRect(x - r * 0.24, y - r * 1.16, r * 0.48, r * 0.3);
};

const present = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, box: number[], ribbon: number[]) => {
  const side = ctx.createLinearGradient(x, 0, x + w, 0);
  side.addColorStop(0, mix(box, [255, 255, 255], 0.12));
  side.addColorStop(1, mix(box, [0, 0, 0], 0.3));
  ctx.fillStyle = side;
  ctx.fillRect(x, y - h, w, h);
  // Lid, a touch wider and lighter.
  ctx.fillStyle = mix(box, [255, 255, 255], 0.2);
  ctx.fillRect(x - w * 0.04, y - h, w * 1.08, h * 0.22);
  ctx.fillStyle = "rgba(0,0,0,.18)";
  ctx.fillRect(x, y - h * 0.78, w, h * 0.05);
  ctx.fillStyle = mix(ribbon, [255, 255, 255], 0.1);
  ctx.fillRect(x + w * 0.42, y - h, w * 0.16, h);
  // Bow: two loops and a knot.
  ctx.fillStyle = mix(ribbon, [0, 0, 0], 0.1);
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5 + dir * w * 0.14, y - h - h * 0.08, w * 0.15, h * 0.1, dir * -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = mix(ribbon, [255, 255, 255], 0.25);
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y - h - h * 0.03, w * 0.06, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Paints a fir tree once, needle by needle: nine tiers of drooping boughs (lower ones drawn first so upper
 * ones overlap them), each bough a spray of short needles that get lighter towards the tip, some dusted with
 * snow. Then baubles, a faceted star, presents and a little snow at the foot. Lights and glow are added live.
 */
export const paintTree = (W: number, H: number): TreeArt => {
  const { canvas, ctx } = offscreen(W, H);
  const rand = seeded(11);
  const u1 = W / 220; // one "unit": everything scales with the tree
  const cx = W / 2;
  const top = H * 0.15; // leaves headroom above the crown for the leader and the star
  const bottom = H * 0.8;
  const halfAt = (y: number) => Math.max(0, (y - top) / (bottom - top)) ** 0.82 * W * 0.46;

  // Soft shadow on the ground, then snow.
  const shadow = ctx.createRadialGradient(cx, H * 0.955, 0, cx, H * 0.955, W * 0.5);
  shadow.addColorStop(0, "rgba(20,30,50,.28)");
  shadow.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save();
  ctx.translate(0, H * 0.955);
  ctx.scale(1, 0.16);
  ctx.translate(0, -H * 0.955);
  ctx.fillStyle = shadow;
  ctx.fillRect(0, H * 0.955 - W * 0.5, W, W);
  ctx.restore();

  // Trunk.
  const bark = ctx.createLinearGradient(cx - W * 0.05, 0, cx + W * 0.05, 0);
  bark.addColorStop(0, "#7b4f31");
  bark.addColorStop(0.5, "#5d3a22");
  bark.addColorStop(1, "#3c2414");
  ctx.fillStyle = bark;
  ctx.fillRect(cx - W * 0.05, H * 0.74, W * 0.1, H * 0.225);
  // Bark: a few darker furrows, and the shade of the lowest boughs across the top of the trunk.
  ctx.strokeStyle = "rgba(30,16,8,.45)";
  ctx.lineWidth = Math.max(0.6, u1 * 0.8);
  for (const fx of [-0.026, -0.006, 0.018, 0.034]) {
    ctx.beginPath();
    ctx.moveTo(cx + W * fx, H * 0.8);
    ctx.lineTo(cx + W * (fx + 0.004), H * 0.96);
    ctx.stroke();
  }
  const shade = ctx.createLinearGradient(0, H * 0.78, 0, H * 0.87);
  shade.addColorStop(0, "rgba(8,20,12,.75)");
  shade.addColorStop(1, "rgba(8,20,12,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(cx - W * 0.05, H * 0.78, W * 0.1, H * 0.09);

  // A dark core so no page shows through between boughs.
  ctx.fillStyle = mix(DARK, [0, 0, 0], 0.25);
  ctx.beginPath();
  ctx.moveTo(cx, top + H * 0.02);
  for (let i = 0; i <= 24; i++) {
    const y = top + H * 0.04 + ((bottom - top - H * 0.06) * i) / 24;
    ctx.lineTo(cx + halfAt(y) * (i % 2 ? 0.74 : 0.6), y);
  }
  for (let i = 24; i >= 0; i--) {
    const y = top + H * 0.04 + ((bottom - top - H * 0.06) * i) / 24;
    ctx.lineTo(cx - halfAt(y) * (i % 2 ? 0.74 : 0.6), y);
  }
  ctx.fill();

  const tips: Point[] = [];
  // The highest needle near the trunk line: the star sits on it rather than sinking into the top boughs.
  let crown = top;
  const inside: Point[] = [];
  ctx.lineCap = "round";
  const tiers = 9;
  for (let i = 0; i < tiers; i++) {
    const depth = 1 - i / (tiers - 1); // 1 at the bottom tier, 0 at the top
    const hem = top + (bottom - top) * (0.17 + 0.83 * depth);
    const half = halfAt(hem);
    const tierHeight = ((bottom - top) / tiers) * 2.1;
    const count = Math.round(5 + half / (7 * u1));
    // Outer boughs first, the ones facing us last, so the middle sits in front.
    const order = Array.from({ length: count }, (_, b) => (count === 1 ? 0 : (b / (count - 1)) * 2 - 1) + (rand() - 0.5) * 0.12)
      .sort((a, b) => Math.abs(b) - Math.abs(a));
    for (const u of order) {
      const start = { x: cx + u * half * 0.22, y: hem - tierHeight * (0.72 + rand() * 0.12) };
      const tip = { x: cx + u * half * (0.96 + rand() * 0.1), y: hem + (rand() - 0.3) * 7 * u1 - (1 - Math.abs(u)) * 2 * u1 };
      const ctrl = { x: (start.x + tip.x) / 2 + u * half * 0.2, y: start.y + (tip.y - start.y) * 0.18 };
      const length = Math.hypot(tip.x - start.x, tip.y - start.y);
      const steps = Math.max(8, Math.round(length / (1.5 * u1)));
      const snowy = rand() < 0.45;
      for (let k = 0; k <= steps; k++) {
        const s = k / steps;
        const x = quad(start.x, ctrl.x, tip.x, s);
        const y = quad(start.y, ctrl.y, tip.y, s);
        const s2 = Math.min(1, s + 0.02);
        const angle = Math.atan2(quad(start.y, ctrl.y, tip.y, s2) - y, quad(start.x, ctrl.x, tip.x, s2) - x);
        // The top of each tier sits in the shade of the one above; tips catch the light.
        const tone = 0.05 + s * 0.75 + (rand() - 0.5) * 0.35;
        for (const side of [-1, 1]) {
          const needle = (4 + rand() * 4.5) * u1 * (1 - s * 0.35);
          const a = angle + side * (0.45 + rand() * 0.5);
          ctx.strokeStyle = tone < 0.5 ? mix(DARK, MID, tone * 2) : mix(MID, LIGHT, (tone - 0.5) * 2);
          ctx.lineWidth = (0.9 + rand() * 0.5) * u1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * needle, y + Math.sin(a) * needle);
          ctx.stroke();
          if (Math.abs(x - cx) < 10 * u1) crown = Math.min(crown, y, y + Math.sin(a) * needle);
        }
        // Snow lies on the upper side of the outer half of some boughs.
        if (snowy && s > 0.55 && rand() < 0.45) {
          const a = angle - Math.sign(Math.cos(angle) || 1) * (0.5 + rand() * 0.5);
          const needle = (1.5 + rand() * 2.2) * u1;
          ctx.strokeStyle = `rgba(250,252,255,${0.45 + rand() * 0.4})`;
          ctx.lineWidth = (1.4 + rand() * 1.2) * u1;
          ctx.beginPath();
          ctx.moveTo(x, y - u1);
          ctx.lineTo(x + Math.cos(a) * needle, y - u1 + Math.sin(a) * needle);
          ctx.stroke();
        }
        if (k % 5 === 2 && s > 0.3 && s < 0.9) inside.push({ x, y });
      }
      if (Math.abs(u) > 0.12 || depth < 0.3) tips.push({ x: tip.x - u * 3 * u1, y: tip.y });
    }
  }

  // Baubles hang from every few bough tips, well spread out.
  const hung: Point[] = [];
  for (const tip of tips) {
    const r = (4.2 + rand() * 2.4) * u1;
    const at = { x: tip.x, y: tip.y + r * 1.6 };
    if (at.y > bottom + 10 * u1 || hung.some((other) => Math.hypot(other.x - at.x, other.y - at.y) < 26 * u1)) continue;
    hung.push(at);
    bauble(ctx, at.x, at.y, r, ORNAMENTS[hung.length % ORNAMENTS.length]);
  }

  // Presents and a drift of snow at the foot.
  const ground = H * 0.972;
  present(ctx, cx - W * 0.34, ground, W * 0.2, W * 0.15, [178, 34, 46], [236, 196, 92]);
  present(ctx, cx + W * 0.12, ground, W * 0.17, W * 0.19, [38, 92, 168], [232, 236, 242]);
  present(ctx, cx - W * 0.2, ground + H * 0.008, W * 0.13, W * 0.1, [34, 120, 76], [205, 46, 58]);
  const drift = ctx.createLinearGradient(0, ground - W * 0.03, 0, H);
  drift.addColorStop(0, "rgba(255,255,255,.98)");
  drift.addColorStop(1, "rgba(214,226,242,.9)");
  ctx.fillStyle = drift;
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.46, H);
  ctx.bezierCurveTo(cx - W * 0.4, ground - W * 0.02, cx - W * 0.16, ground - W * 0.035, cx, ground - W * 0.012);
  ctx.bezierCurveTo(cx + W * 0.16, ground - W * 0.04, cx + W * 0.4, ground - W * 0.015, cx + W * 0.46, H);
  ctx.closePath();
  ctx.fill();

  // The topper, as on a real tree: the leader (the top shoot) rises a little above the last tier, a gold
  // sleeve slides over its tip, and the star sits on the sleeve. If the picture is too short for all of it,
  // everything moves down together so the star is never cut off and never floats free of the leader.
  const starR = 12 * u1;
  const leaderLength = 11 * u1;
  const sleeveLength = 7 * u1;
  const drop = Math.max(0, starR + 2 * u1 - (crown - leaderLength - sleeveLength * 0.55 - starR * 0.3));
  const leaderTip = crown - leaderLength + drop;
  const sleeveTop = leaderTip - sleeveLength * 0.55; // the lower part of the sleeve covers the leader's tip
  const star = { x: cx, y: sleeveTop - starR * 0.3, r: starR };

  // Leader: a short stem with needles angled upwards, lighter and finer towards the new growth at the top.
  const leaderBase = crown + 8 * u1;
  ctx.strokeStyle = mix(DARK, MID, 0.4);
  ctx.lineWidth = 1.6 * u1;
  ctx.beginPath();
  ctx.moveTo(cx, leaderBase);
  ctx.lineTo(cx, leaderTip);
  ctx.stroke();
  const leaderSteps = Math.round((leaderBase - leaderTip) / (1.3 * u1));
  for (let k = 0; k <= leaderSteps; k++) {
    const s = k / leaderSteps; // 0 at the base, 1 at the tip
    const y = leaderBase + (leaderTip - leaderBase) * s;
    const tone = 0.35 + s * 0.5 + (rand() - 0.5) * 0.25;
    for (const side of [-1, 1]) {
      const a = -Math.PI / 2 + side * (0.55 + rand() * 0.45) * (1 - s * 0.35);
      const needle = (5.5 - s * 2.8 + rand() * 1.5) * u1;
      ctx.strokeStyle = tone < 0.5 ? mix(DARK, MID, tone * 2) : mix(MID, LIGHT, (tone - 0.5) * 2);
      ctx.lineWidth = (0.8 + rand() * 0.4) * u1;
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx + Math.cos(a) * needle, y + Math.sin(a) * needle);
      ctx.stroke();
    }
  }

  // Sleeve: a tapered gold tube, shaded as a cylinder, with a rolled rim at the bottom.
  const sleeveBottom = sleeveTop + sleeveLength;
  const metal = ctx.createLinearGradient(cx - 2.4 * u1, 0, cx + 2.4 * u1, 0);
  metal.addColorStop(0, "#8a5d10");
  metal.addColorStop(0.35, "#ffe9a0");
  metal.addColorStop(0.6, "#d9a32a");
  metal.addColorStop(1, "#7a520e");
  ctx.fillStyle = metal;
  ctx.beginPath();
  ctx.moveTo(cx - 1.5 * u1, sleeveTop);
  ctx.lineTo(cx + 1.5 * u1, sleeveTop);
  ctx.lineTo(cx + 2.4 * u1, sleeveBottom);
  ctx.lineTo(cx - 2.4 * u1, sleeveBottom);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, sleeveBottom, 2.7 * u1, 0.9 * u1, 0, 0, Math.PI * 2);
  ctx.fill();
  // A few needles in front of the rim, so the sleeve sits among them rather than on top.
  for (const side of [-1, 1]) {
    ctx.strokeStyle = mix(MID, LIGHT, 0.5);
    ctx.lineWidth = 0.9 * u1;
    ctx.beginPath();
    ctx.moveTo(cx, sleeveBottom + 2.5 * u1);
    ctx.lineTo(cx + side * 3.4 * u1, sleeveBottom - 0.8 * u1);
    ctx.stroke();
  }

  // Faceted gold star: each point has a light and a dark half, with a soft shadow on the tree behind it
  // and a fine dark edge so it reads clearly against the glow.
  const starPath = () => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 ? star.r * 0.42 : star.r;
      ctx.lineTo(star.x + Math.cos(a) * r, star.y + Math.sin(a) * r);
    }
    ctx.closePath();
  };
  ctx.save();
  ctx.shadowColor = "rgba(40,25,0,.35)";
  ctx.shadowBlur = 3 * u1;
  ctx.shadowOffsetY = 1.2 * u1;
  ctx.fillStyle = "#e2a51a";
  starPath();
  ctx.fill();
  ctx.restore();
  for (let i = 0; i < 10; i++) {
    const a0 = (i * Math.PI) / 5 - Math.PI / 2;
    const a1 = ((i + 1) * Math.PI) / 5 - Math.PI / 2;
    const r0 = i % 2 ? star.r * 0.42 : star.r;
    const r1 = i % 2 ? star.r : star.r * 0.42;
    ctx.fillStyle = i % 2 ? "#ffe58a" : "#e2a51a";
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x + Math.cos(a0) * r0, star.y + Math.sin(a0) * r0);
    ctx.lineTo(star.x + Math.cos(a1) * r1, star.y + Math.sin(a1) * r1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(120,74,8,.55)";
  ctx.lineWidth = 0.6 * u1;
  ctx.lineJoin = "round";
  starPath();
  ctx.stroke();

  // Fairy lights: mostly warm white, a few coloured, kept apart from each other.
  const lights: TreeArt["lights"] = [];
  for (const spot of inside.sort(() => rand() - 0.5)) {
    if (lights.length >= 30) break;
    if (lights.some((other) => Math.hypot(other.x - spot.x, other.y - spot.y) < 17 * u1)) continue;
    lights.push({ ...spot, hue: rand() < 0.7 ? 0 : 1 + Math.floor(rand() * 3), phase: rand() * 20 });
  }

  return { image: canvas, lights, star };
};
