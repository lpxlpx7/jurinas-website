import { external, text } from "../../../build/html.ts";
import { icon } from "../../components/icon.ts";

/** "Open project" button, plus a "View source" link when the code is public. */
export const projectActions = ({ site, source }: { site: string; source?: string }): string => {
  const open = `<a class="button button-primary" ${external(site)} ${text("projectOpen")}</a>`;
  if (!source) return open;
  return `<div class="product-actions">${open}<a class="product-link" ${external(source)}><span ${text("projectCode")}</span>${icon("chevron")}</a></div>`;
};
