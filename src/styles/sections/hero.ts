import { css } from "../../build/css.ts";

/** Home hero: greeting, actions and pronoun note. */
export default css`
.hero { min-height: min(760px, calc(100svh - 48px)); padding-block: 88px 104px; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr); align-items: center; gap: clamp(40px, 7vw, 100px); }
.hero h1 { margin: 0; max-width: 680px; font-size: clamp(56px, 7.6vw, 96px); font-weight: 700; line-height: 1.04; letter-spacing: -.035em; }
html[lang="ja"] .hero h1 { letter-spacing: -.02em; line-height: 1.12; }
/* Name: light lavender drifting into deep violet. */
.hero h1 span {
  display: inline-block;
  padding-bottom: .06em;
  background: var(--name-gradient);
  background-size: 160% 100%;
  background-position: 0 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: name-drift 9s ease-in-out infinite alternate;
}
@keyframes name-drift { to { background-position: 100% 0; } }
.identity-note { margin-top: 26px; display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 14px; }
.trans-mark { width: 24px; height: 14px; flex: none; border-radius: 3px; background: linear-gradient(180deg,#5bcefa 0 20%,#f5a9b8 20% 40%,#fff 40% 60%,#f5a9b8 60% 80%,#5bcefa 80%); box-shadow: 0 0 0 1px rgba(0,0,0,.06); }
`;
