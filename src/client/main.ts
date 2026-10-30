/* Runs on every page. Each feature finds its own elements and does nothing when they're absent. */
import { initPageChrome } from "./features/page-chrome.ts";
import { initTheme } from "./features/theme.ts";
import { initLanguage } from "./features/language.ts";
import { initClocks } from "./features/clocks.ts";
import { initReiwaGallery } from "./features/reiwa-gallery.ts";
import { initMusicRail } from "./features/music-rail.ts";
import { initLightbox } from "./features/lightbox.ts";
import { initMobileMenu } from "./features/mobile-menu.ts";

initPageChrome();
initTheme();
initLanguage();
initClocks();
initReiwaGallery();
initMusicRail();
initLightbox();
initMobileMenu();

// Start-up state (language switch, music arrows, theme icon) is now final. Flush styles while
// transitions are still off, then turn them on, so nothing fades in from the HTML defaults.
void document.body.offsetWidth;
document.documentElement.classList.remove("is-booting");
