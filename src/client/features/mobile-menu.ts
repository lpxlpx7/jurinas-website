import { translations } from "../../shared/translations.ts";
import { currentLanguage } from "../core/language.ts";
import { phoneLayout } from "../core/motion.ts";

/** Like apple.com's globalnav: one trigger whose two lines fold into an X and back. */
export const initMobileMenu = () => {
  const menuButton = document.querySelector<HTMLButtonElement>(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!menuButton) return;
  let menuIsOpen = false;

  const setMenu = (open: boolean) => {
    if (open === menuIsOpen) return;
    menuIsOpen = open;
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    const labelKey = open ? "menuClose" : "menuOpen";
    // The language switch re-reads this key, so the label survives a language change.
    menuButton.dataset.i18nAriaLabel = labelKey;
    menuButton.setAttribute("aria-label", translations[currentLanguage()][labelKey]);
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    mobileMenu?.toggleAttribute("inert", !open);
    menuButton.querySelectorAll<SVGAnimationElement>(open ? ".menu-anim-open" : ".menu-anim-close").forEach((animation) => animation.beginElement());
  };

  menuButton.addEventListener("click", () => setMenu(!menuIsOpen));
  phoneLayout.addEventListener("change", () => { if (!phoneLayout.matches) setMenu(false); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
};
