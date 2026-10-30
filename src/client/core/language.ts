import { isLanguage, type Language } from "../../shared/translations.ts";

/** The page language lives on <html lang>, which the language switch keeps current. */
export const currentLanguage = (): Language => {
  const lang = document.documentElement.lang;
  return isLanguage(lang) ? lang : "en";
};
