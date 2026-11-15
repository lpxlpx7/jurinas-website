import { isDark, type Decor, type FallEffect, type Scene } from "./layer.ts";
import { glowSprite, headerHeight, random } from "./util.ts";

/**
 * Summer in the Japanese countryside: a glass wind chime (fūrin) with its paper strip hangs from the top of
 * the page and swings in the breeze. On a fresh visit a gust sets it swinging harder, and in the dark theme
 * fireflies (hotaru) rise and blink for a little while.
 */
export const createSummer = ({ intro }: { intro: boolean }): Scene => {
  let time = 0;
  let top = 48;
  let x = 0;
  let r = 18;
  // Two linked pendulums: the bell swings from its string, the paper strip from the bell.
  let bell = 0, bellSpeed = 0, strip = 0, stripSpeed = 0;

  const breeze = () => {
    const calm = Math.sin(time * 0.7) * 0.5 + Math.sin(time * 1.9 + 1) * 0.3 + Math.sin(time * 3.3 + 2) * 0.15;
    const gust = intro ? 3.2 * Math.exp(-((time - 1.4) ** 2) / 0.9) : 0;
    return calm + gust;
  };

  const drawBell = (ctx: CanvasRenderingContext2D, dark: boolean, rim: number) => {
    const dome = new Path2D();
    dome.moveTo(-r, rim);
    dome.bezierCurveTo(-r * 1.02, rim - r * 1.55, r * 1.02, rim - r * 1.55, r, rim);
    dome.ellipse(0, rim, r, r * 0.2, 0, 0, Math.PI, false);
    dome.closePath();

    const glass = ctx.createLinearGradient(-r, 0, r, 0);
    glass.addColorStop(0, dark ? "rgba(170,210,240,.42)" : "rgba(190,225,250,.6)");
    glass.addColorStop(0.45, dark ? "rgba(230,245,255,.18)" : "rgba(255,255,255,.35)");
    glass.addColorStop(1, dark ? "rgba(150,195,235,.45)" : "rgba(160,205,240,.62)");
    ctx.fillStyle = glass;
    ctx.fill(dome);

    // Painted inside the glass: two goldfish above a band of blue water.
    ctx.save();
    ctx.clip(dome);
    ctx.strokeStyle = "rgba(40,110,200,.75)";
    ctx.lineWidth = r * 0.07;
    for (let row = 0; row < 2; row++) {
      ctx.beginPath();
      const y = rim - r * (0.12 + row * 0.16);
      for (let i = -6; i <= 6; i++) {
        const px = (i / 6) * r * 1.1;
        if (i === -6) ctx.moveTo(px, y);
        else ctx.quadraticCurveTo(px - r * 0.09, y - r * 0.1, px, y);
      }
      ctx.stroke();
    }
    for (const [fx, fy, dir] of [[-r * 0.38, rim - r * 0.62, 1], [r * 0.32, rim - r * 0.88, -1]]) {
      ctx.save();
      ctx.translate(fx, fy);
      ctx.scale(dir, 1);
      ctx.fillStyle = "#e8452c";
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.2, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-r * 0.16, 0);
      ctx.quadraticCurveTo(-r * 0.36, -r * 0.2, -r * 0.42, -r * 0.08);
      ctx.quadraticCurveTo(-r * 0.32, 0, -r * 0.42, r * 0.1);
      ctx.quadraticCurveTo(-r * 0.34, r * 0.18, -r * 0.16, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    ctx.strokeStyle = dark ? "rgba(220,240,255,.55)" : "rgba(90,140,190,.55)";
    ctx.lineWidth = 1;
    ctx.stroke(dome);
    // Light catching the glass.
    ctx.strokeStyle = "rgba(255,255,255,.85)";
    ctx.lineWidth = r * 0.09;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r * 0.62, rim - r * 0.25);
    ctx.quadraticCurveTo(-r * 0.66, rim - r * 0.9, -r * 0.22, rim - r * 1.08);
    ctx.stroke();
  };

  const decor: Decor = {
    layout(width) {
      top = headerHeight();
      r = width < 735 ? 15 : 19;
      x = width - (width >= 1200 ? Math.min(140, (width - 1120) / 4 + 30) : width < 735 ? 30 : 48);
      return top + r * 1.3 + 140;
    },

    step(dt) {
      time += dt;
      const wind = breeze();
      // Springy, damped swinging; the light paper strip reacts more and lags behind the bell.
      bellSpeed += (-10 * bell - 1.4 * bellSpeed + wind * 0.45) * dt;
      bell += bellSpeed * dt;
      stripSpeed += (-7 * (strip - bell) - 1 * stripSpeed + wind * 1.5) * dt;
      strip += stripSpeed * dt;
      bell = Math.max(-0.5, Math.min(0.5, bell));
      strip = Math.max(-1, Math.min(1, strip));
    },

    draw(ctx, dark) {
      const string = 22;
      const rim = string + r * 1.15;
      ctx.save();
      ctx.translate(x, top - 6);
      ctx.rotate(bell);

      ctx.strokeStyle = dark ? "rgba(235,235,240,.7)" : "rgba(60,60,65,.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, string + 2);
      ctx.stroke();

      drawBell(ctx, dark, rim);

      // The clapper hangs just below the rim; the strip's cord ties on to it.
      ctx.translate(0, rim + r * 0.35);
      ctx.fillStyle = dark ? "rgba(200,230,255,.8)" : "rgba(120,170,215,.85)";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(strip - bell);
      ctx.strokeStyle = dark ? "rgba(235,235,240,.6)" : "rgba(60,60,65,.6)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 22);
      ctx.stroke();

      const w = r * 0.85;
      const h = r * 3.6;
      const paper = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      paper.addColorStop(0, "#f3e6c9");
      paper.addColorStop(0.5, "#fbf4e3");
      paper.addColorStop(1, "#eadbb8");
      ctx.fillStyle = paper;
      ctx.fillRect(-w / 2, 22, w, h);
      ctx.strokeStyle = "rgba(120,90,40,.25)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-w / 2, 22, w, h);
      ctx.fillStyle = "#26303a";
      ctx.font = `${Math.round(w * 0.95)}px "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("涼", 0, 22 + h * 0.32);
      ctx.fillStyle = "#c92a2a";
      ctx.fillRect(-w * 0.16, 22 + h * 0.72, w * 0.32, w * 0.32);
      ctx.restore();
    },
  };

  return { decor, fall: fireflies() };
};

type Firefly = { x: number; y: number; heading: number; turn: number; speed: number; born: number; life: number; blink: number; rate: number };

let glow: HTMLCanvasElement | null = null;
const fireflyGlow = () => glow ??= glowSprite(48, [[0, "rgba(235,255,160,1)"], [0.15, "rgba(200,255,110,.7)"], [0.45, "rgba(170,230,80,.18)"], [1, "rgba(170,230,80,0)"]]);

/** Dark theme only: fireflies drift up from the lower part of the screen, blinking slowly, then fade away. */
const fireflies = (): FallEffect => {
  let flies: Firefly[] = [];
  let time = 0;
  let started = false;
  return {
    resize(width, height) {
      if (started) return;
      started = true;
      if (!isDark()) return;
      const count = Math.min(26, Math.max(10, Math.round(width / 55)));
      flies = Array.from({ length: count }, () => ({
        x: random(0.05, 0.95) * width,
        y: random(0.35, 1) * height,
        heading: random(-Math.PI, 0),
        turn: random(-0.6, 0.6),
        speed: random(10, 24),
        born: random(0, 3),
        life: random(6, 9),
        blink: random(0, Math.PI * 2),
        rate: random(1.6, 2.6),
      }));
    },
    step(dt) {
      time += dt;
      for (const fly of flies) {
        fly.turn += random(-1.5, 1.5) * dt;
        fly.turn = Math.max(-1, Math.min(1, fly.turn));
        fly.heading += fly.turn * dt;
        // Wander, with a slight lean upwards.
        fly.x += Math.cos(fly.heading) * fly.speed * dt;
        fly.y += (Math.sin(fly.heading) * fly.speed - 6) * dt;
        fly.blink += dt * fly.rate;
      }
      return flies.some((fly) => time < fly.born + fly.life);
    },
    draw(ctx) {
      const image = fireflyGlow();
      ctx.globalCompositeOperation = "lighter";
      for (const fly of flies) {
        const age = time - fly.born;
        if (age < 0 || age > fly.life) continue;
        const fade = Math.min(age / 1, 1, (fly.life - age) / 1.5);
        const pulse = Math.max(0, Math.sin(fly.blink)) ** 2;
        ctx.globalAlpha = fade * (0.15 + 0.85 * pulse);
        ctx.drawImage(image, fly.x - 14, fly.y - 14, 28, 28);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
};
