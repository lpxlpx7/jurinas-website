/*
 * Seasonal touches. Each season is a Scene with up to two parts:
 *   decor  a lasting decoration across the top of the page (lights and a tree, a cherry branch, a wind chime).
 *          It sits under the header, scrolls away with the page and never takes clicks. Shown on every page.
 *   fall   a one-off overlay (snow, leaves, petals, fireflies) that plays only on a fresh visit or a reload,
 *          not when moving between pages of the site.
 * With reduced motion the decor is still drawn, but stays still, and nothing falls.
 *
 * The season follows the visitor's local date. `?season=christmas` (or winter / spring / summer / autumn / off)
 * forces one for previewing, and always counts as a fresh visit.
 */
import { reduceMotion } from "../../core/motion.ts";
import { startDecorLayer, startFallLayer, type Scene } from "./layer.ts";
import { createChristmas } from "./christmas.ts";
import { createSnow } from "./snow.ts";
import { createSpring } from "./spring.ts";
import { createSummer } from "./summer.ts";
import { createAutumn } from "./autumn.ts";

export type Season = "christmas" | "winter" | "spring" | "summer" | "autumn";

/** Month (0 = January) → season. Months set to null show nothing. */
const seasonByMonth: Array<Season | null> = [
  "winter", "winter", // Jan, Feb: snow
  "spring", "spring", // Mar, Apr: cherry branch
  "summer", "summer", "summer", "summer", "summer", // May–Sep: wind chime, fireflies at night
  "autumn", "autumn", // Oct, Nov: falling leaves (but see seasonOn: snow from Nov 16)
  "christmas", // Dec: lights, tree and snow
];

/** The season for a date. The second half of November already counts as winter. */
const seasonOn = (date: Date): Season | null => {
  if (date.getMonth() === 10 && date.getDate() >= 16) return "winter";
  return seasonByMonth[date.getMonth()];
};

/** `intro` is true on a fresh visit with motion allowed: decorations then make an entrance. */
const scenes: Record<Season, (options: { intro: boolean }) => Scene> = {
  christmas: createChristmas,
  winter: () => ({ fall: createSnow() }),
  spring: createSpring,
  summer: createSummer,
  autumn: createAutumn,
};

const isSeason = (value: string | null): value is Season => value !== null && value in scenes;

const currentSeason = (): Season | null => {
  const forced = new URLSearchParams(window.location.search).get("season");
  if (forced === "off") return null;
  if (isSeason(forced)) return forced;
  return seasonOn(new Date());
};

/** True on a reload, or when arriving from outside the site (typed URL, bookmark, another site). */
const isFreshVisit = (): boolean => {
  if (new URLSearchParams(window.location.search).has("season")) return true;
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (entry?.type === "reload") return true;
  if (entry?.type === "back_forward") return false;
  try {
    return !document.referrer || new URL(document.referrer).origin !== window.location.origin;
  } catch {
    return true;
  }
};

export const initSeasons = () => {
  const season = currentSeason();
  if (!season) return;
  document.documentElement.dataset.season = season;
  const still = reduceMotion.matches;
  const fresh = !still && isFreshVisit();
  const scene = scenes[season]({ intro: fresh });
  if (scene.decor) startDecorLayer(scene.decor, !still);
  if (scene.fall && fresh) startFallLayer(scene.fall);
};
