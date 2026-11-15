/** "2025" in the first year, "2025–2026" after that. Shared by the footer template and the browser. */
export const copyrightYears = (start: number, current: number): string =>
  !Number.isFinite(start) || current <= start ? String(current) : `${start}–${current}`;
