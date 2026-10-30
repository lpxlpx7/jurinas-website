import { currentLanguage } from "./language.ts";

/** Carries the chosen language and theme over to the other pages of the site. */
export const updatePageLinks = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[href*=".html"]').forEach((link) => {
    const url = new URL(link.getAttribute("href") ?? "", window.location.href);
    if (window.location.protocol !== "file:" && url.origin !== window.location.origin) return;
    url.searchParams.set("lang", currentLanguage());
    url.searchParams.set("theme", document.documentElement.dataset.themePreference || "system");
    link.href = url.href;
  });
};
