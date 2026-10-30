import { css } from "../../build/css.ts";

/** Calmer page when the system asks for less motion. */
export default css`
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .reveal-ready .reveal { opacity: 1; transform: none; }
}
`;
