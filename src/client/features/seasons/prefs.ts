import { readSetting, saveSetting } from "../../core/settings.ts";

/** What the visitor did with the decorations: turned them all off, hid some, dragged some elsewhere. */
export type SeasonPrefs = {
  off: boolean;
  seasons: Record<string, { hidden: string[]; moved: Record<string, { x: number; y: number }> }>;
};

const KEY = "seasonDecor";

export const readPrefs = (): SeasonPrefs => {
  try {
    const saved = JSON.parse(readSetting(KEY, "{}")) as Partial<SeasonPrefs>;
    return { off: saved.off === true, seasons: saved.seasons ?? {} };
  } catch {
    return { off: false, seasons: {} };
  }
};

export const savePrefs = (prefs: SeasonPrefs) => saveSetting(KEY, JSON.stringify(prefs));

/** This season's entry, created on first use. */
export const seasonPrefs = (prefs: SeasonPrefs, season: string) => prefs.seasons[season] ??= { hidden: [], moved: {} };
