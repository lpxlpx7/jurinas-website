/* Original filters adapted from liquid-glass techniques featured by FreeFrontend. */
(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("liquid-glass-defs");
  svg.innerHTML = `
    <defs>
      <filter id="nav-distortion" x="-8%" y="-30%" width="116%" height="160%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves="2" seed="21" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-8" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-10" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-12" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
        <feGaussianBlur in="rgb" stdDeviation="1.1" />
      </filter>

      <filter id="panel-lens" x="-5%" y="-8%" width="110%" height="116%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="13" result="panelMap" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" result="panelBlur" />
        <feDisplacementMap in="panelBlur" in2="panelMap" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="panelGlass" />
        <feSpecularLighting in="panelMap" surfaceScale="1.4" specularConstant="0.2" specularExponent="34" lighting-color="#ffffff" result="panelLight"><feDistantLight azimuth="225" elevation="58" /></feSpecularLighting>
        <feComposite in="panelLight" in2="SourceAlpha" operator="in" result="panelRim" />
        <feBlend in="panelGlass" in2="panelRim" mode="screen" />
      </filter>

      <filter id="control-glass" primitiveUnits="objectBoundingBox" x="-15%" y="-35%" width="130%" height="170%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.035" numOctaves="2" seed="5" result="controlMap" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.015" result="controlBlur" />
        <feDisplacementMap in="controlBlur" in2="controlMap" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>`;
  document.body.prepend(svg);

  const groups = [
    [".nav", "nav-distortion-glass"],
    [".portrait-card, .interest-card, .project-card, .friend-card, .contact-card, .contact-side-card, .project-sidebar, .retro-section, .reiwa-section, .clock-panel", "shader-glass-panel"],
    [".button, .text-link, .theme-button, .music-arrow, .lightbox-control, .lightbox-count, .menu-button, .menu-close", "transparent-glass-control"],
  ];

  groups.forEach(([selector, className]) => {
    document.querySelectorAll(selector).forEach((element) => element.classList.add(className));
  });
})();
