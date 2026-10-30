export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
/** Same breakpoint as the phone layout in the stylesheets. */
export const phoneLayout = window.matchMedia("(max-width: 734px)");
export const coarsePointer = window.matchMedia("(pointer: coarse)");

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
