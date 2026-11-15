import { mix, offscreen, seeded } from "./util.ts";

/** Bulb colours: red, amber, green, blue, pink. */
const COLORS = [[232, 44, 40], [250, 166, 30], [34, 176, 92], [44, 124, 235], [240, 80, 170]];
const BULB_W = 22;
const BULB_H = 34;

type BulbArt = { glass: HTMLCanvasElement; lit: HTMLCanvasElement; halo: HTMLCanvasElement };
export type Bulb = { x: number; y: number; tilt: number; color: number; phase: number };
export type LightString = { swags: Array<{ x0: number; x1: number }>; bulbs: Bulb[]; sag: number };

/** The pointed, teardrop outline of a classic Christmas bulb, hanging down from (0, 0). */
const bulbPath = () => {
  const path = new Path2D();
  path.moveTo(-2.6, 6.5);
  path.bezierCurveTo(-6.4, 10, -6.6, 17, -3.4, 21.5);
  path.bezierCurveTo(-2, 23.6, -0.8, 25.4, 0, 26.6);
  path.bezierCurveTo(0.8, 25.4, 2, 23.6, 3.4, 21.5);
  path.bezierCurveTo(6.6, 17, 6.4, 10, 2.6, 6.5);
  path.closePath();
  return path;
};

/**
 * One bulb in two states that are cross-faded: the unlit coloured glass (dark, with reflections), and the
 * same bulb lit from inside (hot centre fading to saturated colour at the edge). Plus the glow it throws.
 */
const paintBulb = (color: number[]): BulbArt => {
  const draw = (lit: boolean) => {
    const { canvas, ctx } = offscreen(BULB_W, BULB_H);
    ctx.translate(BULB_W / 2, 2);
    const path = bulbPath();

    if (!lit) {
      // Socket: a ribbed dark-green plastic cap.
      const cap = ctx.createLinearGradient(-3.2, 0, 3.2, 0);
      cap.addColorStop(0, "#0e2015");
      cap.addColorStop(0.35, "#3d6b4d");
      cap.addColorStop(0.6, "#1d3b28");
      cap.addColorStop(1, "#08130c");
      ctx.fillStyle = cap;
      ctx.beginPath();
      ctx.roundRect(-3.2, 0, 6.4, 7.4, 1.2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.35)";
      ctx.lineWidth = 0.5;
      for (const y of [2.4, 4.2, 6]) {
        ctx.beginPath();
        ctx.moveTo(-3.1, y);
        ctx.lineTo(3.1, y);
        ctx.stroke();
      }
    }

    const body = ctx.createRadialGradient(-0.6, 14, 0.5, 0, 15.5, 11.5);
    if (lit) {
      body.addColorStop(0, "rgba(255,255,255,1)");
      body.addColorStop(0.22, mix(color, [255, 250, 225], 0.72));
      body.addColorStop(0.6, mix(color, [255, 255, 255], 0.14));
      body.addColorStop(1, mix(color, [0, 0, 0], 0.12));
    } else {
      body.addColorStop(0, mix(color, [255, 255, 255], 0.12));
      body.addColorStop(0.55, mix(color, [0, 0, 0], 0.3));
      body.addColorStop(1, mix(color, [0, 0, 0], 0.66));
    }
    ctx.fillStyle = body;
    ctx.fill(path);

    ctx.save();
    ctx.clip(path);
    if (!lit) {
      // Dark rim and a faint reflection on the right, as on thick glass.
      ctx.strokeStyle = "rgba(0,0,0,.35)";
      ctx.lineWidth = 1.6;
      ctx.stroke(path);
      ctx.strokeStyle = "rgba(255,255,255,.2)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(3.6, 11);
      ctx.quadraticCurveTo(4.6, 16, 2.2, 21);
      ctx.stroke();
    }
    // The glint: a long soft streak down the left side and a small hot spot.
    ctx.fillStyle = `rgba(255,255,255,${lit ? 0.55 : 0.75})`;
    ctx.beginPath();
    ctx.ellipse(-2.9, 13, 0.9, 3.6, 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-2.2, 9.2, 0.8, 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return canvas;
  };

  const { canvas: halo, ctx } = offscreen(96, 96);
  const glow = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  const tint = mix(color, [255, 255, 255], 0.25).slice(4, -1);
  glow.addColorStop(0, `rgba(${tint},.7)`);
  glow.addColorStop(0.18, `rgba(${tint},.34)`);
  glow.addColorStop(0.5, `rgba(${tint},.09)`);
  glow.addColorStop(1, `rgba(${tint},0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 96, 96);
  return { glass: draw(false), lit: draw(true), halo };
};

let bulbArt: BulbArt[] | null = null;
const art = () => bulbArt ??= COLORS.map(paintBulb);

/** Lays a string of lights across `width`: shallow swags between fixing points, bulbs spaced along each. */
export const layoutLights = (width: number): LightString => {
  const rand = seeded(21);
  const count = Math.max(2, Math.round(width / 260));
  const span = width / count;
  const sag = Math.min(30, 14 + span * 0.06);
  const swags = Array.from({ length: count }, (_, i) => ({ x0: i * span, x1: (i + 1) * span }));
  const bulbs: Bulb[] = [];
  let n = 0;
  for (const { x0, x1 } of swags) {
    const per = Math.max(4, Math.round(span / 34));
    for (let i = 0; i < per; i++) {
      const t = (i + 0.5) / per;
      bulbs.push({
        x: x0 + (x1 - x0) * t,
        y: 4 * sag * t * (1 - t),
        // Bulbs never hang perfectly straight.
        tilt: (rand() - 0.5) * 0.7 + (t - 0.5) * 0.35,
        color: n % COLORS.length,
        phase: rand() * 30,
      });
      n++;
    }
  }
  return { swags, bulbs, sag };
};

/** How lit each bulb is: mostly on and steady, breathing slowly, with the odd one dipping for a moment. */
const brightness = (bulb: Bulb, time: number) => {
  const breathe = 0.82 + 0.18 * Math.sin(time * 0.9 + bulb.phase);
  const dip = Math.max(0, Math.sin(time * 0.37 + bulb.phase * 1.7)) ** 24;
  return breathe * (1 - 0.75 * dip);
};

/** Draws the string with its top fixing points at y = 0. */
export const drawLights = (ctx: CanvasRenderingContext2D, { swags, bulbs, sag }: LightString, time: number, dark: boolean) => {
  // Twisted two-core cable: a dark line with a lighter dashed strand wound over it.
  ctx.lineCap = "round";
  for (const [color, width, dash] of [[dark ? "#1c3a27" : "#12261a", 2.4, []], [dark ? "#4b7d5c" : "#2f5a3e", 1, [3, 4]]] as const) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash([...dash]);
    for (const { x0, x1 } of swags) {
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.quadraticCurveTo((x0 + x1) / 2, sag * 2, x1, 0);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);

  const sprites = art();
  // Glow first, so it sits behind every bulb. On a dark page it adds up like real light.
  ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
  for (const bulb of bulbs) {
    const on = brightness(bulb, time);
    ctx.globalAlpha = on * (dark ? 0.85 : 0.5);
    const size = dark ? 92 : 70;
    ctx.drawImage(sprites[bulb.color].halo, bulb.x - size / 2 + Math.sin(bulb.tilt) * 14, bulb.y + 16 - size / 2, size, size);
  }
  ctx.globalCompositeOperation = "source-over";

  for (const bulb of bulbs) {
    const on = brightness(bulb, time);
    const { glass, lit } = sprites[bulb.color];
    ctx.save();
    ctx.translate(bulb.x, bulb.y);
    ctx.rotate(bulb.tilt + Math.sin(time * 1.1 + bulb.phase) * 0.035);
    ctx.globalAlpha = 1;
    ctx.drawImage(glass, -BULB_W / 2, -2, BULB_W, BULB_H);
    ctx.globalAlpha = on;
    ctx.drawImage(lit, -BULB_W / 2, -2, BULB_W, BULB_H);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
};
