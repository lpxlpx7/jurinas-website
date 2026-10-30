/* Home page only: the hanging polaroid, the Heisei photo wall and the flight-card globe. */
import { initPortrait } from "./photos/portrait.ts";
import { initPhotoWall } from "./photos/photo-wall.ts";
import { protectPhotos } from "./photos/protect.ts";
import { initGlobe } from "./globe/globe.ts";

initPortrait();
initPhotoWall();
protectPhotos();
initGlobe();
