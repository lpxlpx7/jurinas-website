import { external, text } from "../../../build/html.ts";
import type { TranslationKey } from "../../../shared/translations.ts";
import { icon } from "../../components/icon.ts";

/** Blue "Open project" button (or another label), plus a "View source" link when the code is public. */
export const projectActions = ({ site, source }: { site: string; source?: string }, labelKey: TranslationKey = "projectOpen"): string => {
  const open = `<a class="button button-primary" ${external(site)} ${text(labelKey)}</a>`;
  if (!source) return open;
  return `<div class="product-actions">${open}<a class="product-link" ${external(source)}><span ${text("projectCode")}</span>${icon("chevron")}</a></div>`;
};
