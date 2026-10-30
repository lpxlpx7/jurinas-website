import { isLanguage, translations, type Language, type TranslationKey } from "../../shared/translations.ts";
import { saveSetting, readSetting } from "../core/settings.ts";
import { updatePageLinks } from "../core/page-links.ts";

const isKey = (key: string | undefined): key is TranslationKey => key !== undefined && Object.hasOwn(translations.en, key);

/** Swaps every [data-i18n*] text, alt and aria-label on the page to the chosen language. */
export const setLanguage = (language: string) => {
  const selected: Language = isLanguage(language) ? language : "en";
  const content = translations[selected];
  document.documentElement.lang = selected;
  const titleKey = document.body.dataset.titleKey;
  document.title = content[isKey(titleKey) ? titleKey : "homeTitle"];
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (isKey(key)) element.innerHTML = content[key];
  });
  document.querySelectorAll<HTMLImageElement>("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (isKey(key)) element.alt = content[key];
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (isKey(key)) element.setAttribute("aria-label", content[key]);
  });
  document.querySelectorAll(".language-switch").forEach((switcher) => {
    const target = switcher.querySelector<HTMLInputElement>(`.language-button[value="${selected}"]`);
    if (target) target.checked = true;
  });
  saveSetting("language", selected);
  updatePageLinks();
};

export const initLanguage = () => {
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  const savedLanguage = readSetting("language", "");
  const browserLanguage: Language = navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
  setLanguage(isLanguage(urlLanguage) ? urlLanguage : (isLanguage(savedLanguage) ? savedLanguage : browserLanguage));
  document.querySelectorAll(".language-switch").forEach((switcher) => {
    switcher.querySelector(".language-button:checked")?.setAttribute("aria-current", "true");
  });
  document.querySelectorAll<HTMLInputElement>(".language-button").forEach((button) => button.addEventListener("change", () => {
    if (button.checked) setLanguage(button.value);
  }));
};
