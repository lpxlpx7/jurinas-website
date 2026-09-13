(() => {
  let preference = "system";
  const urlPreference = new URLSearchParams(window.location.search).get("theme");
  try {
    preference = ["light", "dark", "system"].includes(urlPreference)
      ? urlPreference
      : (localStorage.getItem("theme") || "system");
  } catch (error) {
    preference = ["light", "dark", "system"].includes(urlPreference) ? urlPreference : "system";
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = preference === "dark" || (preference === "system" && systemDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
})();