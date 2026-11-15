/*
 * Dev only (`npm run dev`): a small panel in the bottom-left corner for trying each season.
 * The choice lasts for this tab, across pages; picking one reloads, so its one-off effect plays too.
 * Under `npm run build` this whole module is left out.
 */
import { DEV_SEASON_KEY, seasons } from "./index.ts";

const choices = ["auto", ...seasons, "off"];

const styles = `
.dev-seasons { position: fixed; z-index: 1000; left: 12px; bottom: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; max-width: calc(100vw - 24px); padding: 6px; border-radius: 12px; background: rgba(20,20,22,.82); color: #f5f5f7; font: 500 12px/1 -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; letter-spacing: 0; box-shadow: 0 6px 24px rgba(0,0,0,.25); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
.dev-seasons span { padding: 0 6px 0 4px; opacity: .6; }
.dev-seasons button { padding: 6px 9px; border: 0; border-radius: 8px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.dev-seasons button:hover { background: rgba(255,255,255,.12); }
.dev-seasons button[aria-pressed="true"] { background: #0071e3; }
@media print { .dev-seasons { display: none; } }
`;

const stored = (): string => {
  try {
    return sessionStorage.getItem(DEV_SEASON_KEY) ?? "auto";
  } catch {
    return "auto";
  }
};

const choose = (choice: string) => {
  try {
    if (choice === "auto") sessionStorage.removeItem(DEV_SEASON_KEY);
    else sessionStorage.setItem(DEV_SEASON_KEY, choice);
  } catch {
    // Storage blocked: fall back to the URL parameter.
  }
  // Drop any ?season= so the switcher's choice wins, then a real reload, which counts as a fresh visit.
  const url = new URL(window.location.href);
  url.searchParams.delete("season");
  history.replaceState(history.state, "", url.href);
  window.location.reload();
};

export const initSeasonSwitcher = () => {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.append(style);

  const urlSeason = new URLSearchParams(window.location.search).get("season");
  const active = urlSeason ?? stored();
  const panel = document.createElement("div");
  panel.className = "dev-seasons";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "Season (dev only)");
  const label = document.createElement("span");
  label.textContent = `Season · ${document.documentElement.dataset.season ?? "none"}`;
  panel.append(label);
  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.setAttribute("aria-pressed", String(choice === active));
    button.addEventListener("click", () => choose(choice));
    panel.append(button);
  }
  const replay = document.createElement("button");
  replay.type = "button";
  replay.textContent = "↻ replay";
  replay.title = "Reload to play the one-off effect again";
  replay.addEventListener("click", () => window.location.reload());
  panel.append(replay);
  document.body.append(panel);
};
