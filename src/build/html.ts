import { en, type TranslationKey } from "../shared/translations.ts";

type Value = string | number | false | null | undefined | Value[];

const flatten = (value: Value): string => {
  if (Array.isArray(value)) return value.map(flatten).join("");
  if (value === false || value === null || value === undefined) return "";
  return String(value);
};

/**
 * Tag for page templates. Values are inserted as-is (the copy is ours and may contain markup such
 * as <br>); arrays are joined and false/null/undefined render nothing, so conditionals read naturally.
 */
export const html = (strings: TemplateStringsArray, ...values: Value[]): string =>
  strings.reduce((out, part, index) => out + part + (index < values.length ? flatten(values[index]) : ""), "");

/** Escapes text for use inside a double-quoted attribute. */
export const attr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Translated element content: `<h2 ${text("interestsTitle")}</h2>` renders
 * `<h2 data-i18n="interestsTitle">What I'm into.</h2>`. The English copy is baked in and the
 * language switch replaces it at runtime, so the key and its default text can never drift apart.
 */
export const text = (key: TranslationKey): string => `data-i18n="${key}">${en[key]}`;

/** Translated aria-label attribute pair. */
export const label = (key: TranslationKey): string => `aria-label="${attr(stripTags(en[key]))}" data-i18n-aria-label="${key}"`;

/** Translated alt attribute pair. */
export const alt = (key: TranslationKey): string => `alt="${attr(stripTags(en[key]))}" data-i18n-alt="${key}"`;

/** Attributes for a link that opens another site in a new tab. */
export const external = (href: string): string => `href="${attr(href)}" target="_blank" rel="noopener noreferrer"`;

const stripTags = (value: string) => value.replace(/<[^>]*>/g, "");
