(() => {
  let preference = "system";
  let language = "";
  const urlPreference = new URLSearchParams(window.location.search).get("theme");
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  try {
    preference = ["light", "dark", "system"].includes(urlPreference)
      ? urlPreference
      : (localStorage.getItem("theme") || "system");
    language = ["en", "ja"].includes(urlLanguage)
      ? urlLanguage
      : (localStorage.getItem("language") || "");
  } catch (error) {
    preference = ["light", "dark", "system"].includes(urlPreference) ? urlPreference : "system";
    language = ["en", "ja"].includes(urlLanguage) ? urlLanguage : "";
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = preference === "dark" || (preference === "system" && systemDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.languagePreference = language || (navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en");
  document.documentElement.lang = document.documentElement.dataset.languagePreference;
})();
