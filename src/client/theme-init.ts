/* Inlined into <head> so the right theme and language are set before anything paints. */
(() => {
  type ThemePreference = "light" | "dark" | "system";
  type Language = "en" | "ja";
  const themes: readonly string[] = ["light", "dark", "system"];
  const languages: readonly string[] = ["en", "ja"];
  const isTheme = (value: string | null): value is ThemePreference => value !== null && themes.includes(value);
  const isLanguage = (value: string | null): value is Language => value !== null && languages.includes(value);

  let preference = "system";
  let language = "";
  const urlPreference = new URLSearchParams(window.location.search).get("theme");
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  try {
    preference = isTheme(urlPreference)
      ? urlPreference
      : (localStorage.getItem("theme") || "system");
    language = isLanguage(urlLanguage)
      ? urlLanguage
      : (localStorage.getItem("language") || "");
  } catch (error) {
    preference = isTheme(urlPreference) ? urlPreference : "system";
    language = isLanguage(urlLanguage) ? urlLanguage : "";
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = preference === "dark" || (preference === "system" && systemDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
  const resolvedLanguage = language || (navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en");
  document.documentElement.dataset.languagePreference = resolvedLanguage;
  document.documentElement.lang = resolvedLanguage;
  // No transitions until main.js has set the real initial state (see client/main.ts).
  document.documentElement.classList.add("is-booting");
})();
