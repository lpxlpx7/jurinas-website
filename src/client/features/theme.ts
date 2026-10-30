import { readSetting, saveSetting } from "../core/settings.ts";
import { updatePageLinks } from "../core/page-links.ts";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

const isThemePreference = (value: string | null): value is ThemePreference => value === "light" || value === "dark" || value === "system";

const themeIcons: Record<Theme, string> = {
  dark: '<span class="icon icon-sun"></span>',
  light: '<span class="icon icon-moon"></span>',
};

export const initTheme = () => {
  const themeButton = document.querySelector<HTMLElement>(".theme-button");
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (theme: ThemePreference) => {
    const resolved: Theme = theme === "system" ? (systemTheme.matches ? "dark" : "light") : theme;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = theme;
    const themeIcon = themeButton?.querySelector(".theme-icon");
    if (themeIcon) themeIcon.innerHTML = themeIcons[resolved];
    if (themeColor) themeColor.content = resolved === "dark" ? "#09090b" : "#f5f5f7";
    updatePageLinks();
  };

  const urlTheme = new URLSearchParams(window.location.search).get("theme");
  const savedTheme = readSetting("theme", "system");
  const initialTheme: ThemePreference = isThemePreference(urlTheme) ? urlTheme : (isThemePreference(savedTheme) ? savedTheme : "system");
  saveSetting("theme", initialTheme);
  applyTheme(initialTheme);

  themeButton?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    saveSetting("theme", next);
    applyTheme(next);
  });
  systemTheme.addEventListener("change", () => { if (readSetting("theme", "system") === "system") applyTheme("system"); });
};
