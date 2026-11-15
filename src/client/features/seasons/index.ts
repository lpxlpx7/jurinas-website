/*
 * Seasonal touches. Each season is a Scene with up to two parts:
 *   items  lasting decorations, each on its own canvas placed on the page (lights and a tree, a cherry branch,
 *          a wind chime). They scroll with the page, never block clicks, and are shown on every page. Visitors
 *          can drag the movable ones and hide any of them; that's remembered (see layer.ts and prefs.ts).
 *   fall   a one-off overlay (snow, leaves, petals, fireflies) that plays only on a fresh visit or a reload,
 *          not when moving between pages of the site.
 * With reduced motion the items are still drawn, but stay still, and nothing falls.
 * The button in the footer turns everything off, or brings back whatever was hidden or moved.
 *
 * The season follows the visitor's local date. `?season=christmas` (or winter / spring / summer / autumn / off)
 * forces one for previewing, and always counts as a fresh visit. Under `npm run dev` the switcher in the
 * corner picks one for the whole tab instead (see dev-switcher.ts).
 */
import { reduceMotion } from "../../core/motion.ts";
import { currentLanguage } from "../../core/language.ts";
import { translations } from "../../../shared/translations.ts";
import { mountDecor, startFallLayer, type Scene } from "./layer.ts";
import { readPrefs, savePrefs, seasonPrefs } from "./prefs.ts";
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

export const seasons = Object.keys(scenes) as Season[];

const isSeason = (value: string | null): value is Season => value !== null && value in scenes;

/** Session key the dev switcher stores its choice under. */
export const DEV_SEASON_KEY = "devSeason";

const devSeason = (): string | null => {
  try {
    return sessionStorage.getItem(DEV_SEASON_KEY);
  } catch {
    return null;
  }
};

const currentSeason = (): Season | null => {
  const forced = new URLSearchParams(window.location.search).get("season") ?? (__DEV__ ? devSeason() : null);
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
  const toggle = document.querySelector<HTMLButtonElement>(".season-toggle");
  let stop: Array<() => void> = [];

  /** Anything switched off or hidden? Then the footer button offers to bring it all back (in its original place). */
  const changed = () => {
    const prefs = readPrefs();
    return prefs.off || seasonPrefs(prefs, season).hidden.length > 0;
  };
  const updateToggle = () => {
    if (!toggle) return;
    const key = changed() ? "seasonShow" : "seasonHide";
    toggle.dataset.i18n = key;
    toggle.textContent = translations[currentLanguage()][key];
    toggle.hidden = false;
  };

  const start = (fresh: boolean) => {
    if (readPrefs().off) return;
    const scene: Scene = scenes[season]({ intro: fresh });
    if (scene.items?.length) stop.push(mountDecor(season, scene.items, !still, updateToggle));
    if (scene.fall && fresh) stop.push(startFallLayer(scene.fall));
  };

  toggle?.addEventListener("click", () => {
    const prefs = readPrefs();
    const restore = changed();
    stop.forEach((end) => end());
    stop = [];
    // Either put everything back where it started, or switch the lot off (for every season).
    prefs.off = !restore;
    if (restore) delete prefs.seasons[season];
    savePrefs(prefs);
    if (restore) start(!still);
    updateToggle();
  });

  start(!still && isFreshVisit());
  updateToggle();
};
