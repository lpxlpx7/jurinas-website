import { newLive, type DecorItem, type Scene } from "./layer.ts";
import { drawLights, layoutLights, type LightString } from "./lights.ts";
import { createSnow } from "./snow.ts";
import { paintTree, type TreeArt } from "./tree.ts";
import { easeInOut, easeOut, glowSprite, headerHeight, pageBox } from "./util.ts";

const DROP_SECONDS = 1.1;
/** Tree fairy lights: warm white, then red, gold and blue. */
const TREE_LIGHTS = ["255,236,170", "255,120,110", "255,200,90", "130,190,255"];

let glows: HTMLCanvasElement[] | null = null;
const treeGlows = () => glows ??= TREE_LIGHTS.map((rgb) => glowSprite(48, [[0, `rgba(${rgb},1)`], [0.2, `rgba(${rgb},.6)`], [0.5, `rgba(${rgb},.14)`], [1, `rgba(${rgb},0)`]]));

/** The string of lights across the top of the page, just under the header. It can be hidden but not moved. */
const lightsItem = (intro: boolean): DecorItem => {
  let time = 0;
  let string: LightString | null = null;
  return {
    id: "lights",
    layer: "front",
    drag: "none",
    live: newLive(),
    place(width) {
      string = layoutLights(width);
      // Starts a few pixels under the header so the cable's fixing points are tucked out of sight.
      return { x: 0, y: headerHeight() - 6, w: width, h: string.sag + 62 };
    },
    grip: (box) => ({ x: 0, y: 6, w: box.w, h: box.h - 26 }),
    step(dt) { time += dt; },
    draw(ctx, dark, box) {
      if (!string) return;
      const drop = intro ? easeInOut(time / DROP_SECONDS) : 1;
      ctx.save();
      // On a fresh visit the string lowers into place from under the header.
      ctx.translate(0, 4 - (1 - drop) * box.h);
      drawLights(ctx, string, time, dark);
      ctx.restore();
    },
  };
};

/**
 * The Christmas tree. On the home page it stands between the greeting and the portrait, behind both;
 * other pages have no room for it. It can be hidden, or dragged around within that top section of the page.
 */
const treeItem = (intro: boolean): DecorItem => {
  let time = 0;
  let art: TreeArt | null = null;
  let size = { w: 0, h: 0 };
  return {
    id: "tree",
    layer: "back",
    drag: "free",
    live: newLive(),
    place(width) {
      const hero = document.querySelector(".hero");
      const copy = hero?.querySelector(".hero-copy");
      const stage = hero?.querySelector(".portrait-stage");
      if (!hero || !copy || !stage) return null;
      const [heroBox, copyBox, stageBox] = [pageBox(hero), pageBox(copy), pageBox(stage)];
      const sideBySide = stageBox.x > copyBox.x + copyBox.w * 0.5;
      const h = sideBySide ? Math.min(Math.max(heroBox.h * 0.62, 300), 480) : Math.min(Math.max(width * 0.6, 230), 320);
      const w = h * 0.75;
      // Side by side: centred on the gap between the two columns, standing near the bottom of the hero.
      // Stacked (tablet, phone): off to the right, where the greeting ends and the portrait begins.
      const centre = sideBySide ? (copyBox.x + copyBox.w + stageBox.x) / 2 : width * 0.74;
      const foot = sideBySide ? heroBox.y + heroBox.h - 36 : stageBox.y + h * 0.42;
      if (!art || size.w !== w || size.h !== h) { art = paintTree(w, h); size = { w, h }; }
      return { x: centre - w / 2, y: foot - h, w, h };
    },
    bounds() {
      const hero = document.querySelector(".hero");
      if (!hero) return null;
      const { y, h } = pageBox(hero);
      // The hero section, full page width, from just under the header down.
      return { x: 0, y: Math.max(y, headerHeight()), w: document.documentElement.clientWidth, h };
    },
    grip: (box) => ({ x: box.w * 0.12, y: box.h * 0.06, w: box.w * 0.76, h: box.h * 0.92 }),
    step(dt) { time += dt; },
    draw(ctx, dark, box) {
      if (!art) return;
      ctx.globalAlpha = intro ? easeOut(time / 1.4) : 1;
      ctx.drawImage(art.image, 0, 0, box.w, box.h);

      const fade = ctx.globalAlpha;
      const sprites = treeGlows();
      const unit = box.w / 220;
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (const light of art.lights) {
        const on = 0.55 + 0.45 * Math.sin(time * 1.3 + light.phase) ** 2;
        const glow = (dark ? 26 : 20) * unit;
        ctx.globalAlpha = fade * on * (dark ? 0.9 : 0.8);
        ctx.drawImage(sprites[light.hue], light.x - glow / 2, light.y - glow / 2, glow, glow);
      }
      // The star glows softly and breathes.
      const halo = art.star.r * (dark ? 6.5 : 5);
      ctx.globalAlpha = fade * (0.55 + 0.2 * Math.sin(time * 1.7)) * (dark ? 1 : 0.75);
      ctx.drawImage(sprites[0], art.star.x - halo / 2, art.star.y - halo / 2, halo, halo);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    },
  };
};

/**
 * December: lights across the top of the page and a tree in the hero. Both stay put (the page scrolls past
 * them); on a fresh visit the lights lower in, the tree fades in and snow falls for a while.
 */
export const createChristmas = ({ intro }: { intro: boolean }): Scene => ({
  items: [treeItem(intro), lightsItem(intro)],
  fall: createSnow({ areaPerFlake: 6500, maxFlakes: 220 }),
});
