/** Decorative mask icon from base/icons; the name matches its `.icon-<name>` class. */
export type IconName = "external" | "chevron" | "chevron-back" | "close" | "note" | "airplane" | "controller" | "moon" | "sun";

export const icon = (name: IconName): string => `<span class="icon icon-${name}" aria-hidden="true"></span>`;
