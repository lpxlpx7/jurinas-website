import { currentLanguage } from "../core/language.ts";

const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

const updateClocks = () => {
  const localClock = document.querySelector("#local-clock");
  const utcClock = document.querySelector("#utc-clock");
  if (!localClock || !utcClock) return;
  const now = new Date();
  const japanese = currentLanguage() === "ja";
  const locale = japanese ? "ja-JP" : "en-US";
  const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric", weekday: "short", ...(japanese ? { calendar: "japanese", era: "long" } : {}) };
  localClock.textContent = new Intl.DateTimeFormat(locale, timeOptions).format(now);
  utcClock.textContent = new Intl.DateTimeFormat(locale, { ...timeOptions, timeZone: "UTC" }).format(now);
  const localDate = document.querySelector("#local-date");
  const utcDate = document.querySelector("#utc-date");
  if (localDate) localDate.textContent = new Intl.DateTimeFormat(locale, dateOptions).format(now);
  if (utcDate) utcDate.textContent = new Intl.DateTimeFormat(locale, { ...dateOptions, timeZone: "UTC" }).format(now);
  const era = document.querySelector<HTMLElement>("#local-era");
  if (era) {
    era.hidden = true;
    era.textContent = japanese ? new Intl.DateTimeFormat("ja-JP-u-ca-japanese", { era: "long", year: "numeric", month: "long", day: "numeric" }).format(now) : "";
  }
};

export const initClocks = () => {
  updateClocks();
  window.setInterval(updateClocks, 1000);
};
