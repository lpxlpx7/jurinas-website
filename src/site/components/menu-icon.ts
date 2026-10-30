/*
 * apple.com's globalnav menu trigger: two polylines whose points morph through a single flat line
 * into an X. The mobile-menu script starts the open or close animations with beginElement().
 */
const timing = 'keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"';
const stroke = 'fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"';

const bread = (part: "top" | "bottom", rest: string, cross: string) =>
  `<polyline class="menu-bread menu-bread-${part}" ${stroke} points="${rest}">`
  + `<animate class="menu-anim-open" attributeName="points" ${timing} values="${rest};2 9, 16 9;${cross}"/>`
  + `<animate class="menu-anim-close" attributeName="points" ${timing} values="${cross};2 9, 16 9;${rest}"/>`
  + `</polyline>`;

export const menuIcon = (): string =>
  `<svg class="menu-icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">`
  + bread("bottom", "2 12, 16 12", "3.5 15, 15 3.5")
  + bread("top", "2 5, 16 5", "3.5 3.5, 15 15")
  + `</svg>`;
