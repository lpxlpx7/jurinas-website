import { label, text } from "../../build/html.ts";

/**
 * Radio group the language script listens to. Each copy needs its own `name` so the header and
 * the phone menu can both show the current choice.
 */
export const languageSwitch = ({ name, className, english }: { name: string; className: string; english: string }): string =>
  `<fieldset class="${className}" ${label("languageLabel")}><legend ${text("languageLabel")}</legend>`
  + `<label class="language-option"><input class="language-button" type="radio" name="${name}" value="en" checked><span>${english}</span></label>`
  + `<label class="language-option"><input class="language-button" type="radio" name="${name}" value="ja"><span>日本語</span></label></fieldset>`;
