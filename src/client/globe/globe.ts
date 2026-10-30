import { land, type LonLat } from "./land.ts";

/* A quiet, slowly turning dotted globe for the flight card. Everything is clipped to the sphere. */
export const initGlobe = () => {
  /** [latitude, longitude] in radians. */
  type Pair = [number, number];
  type Point3 = [number, number, number];

  const host = document.querySelector<HTMLElement>(".flight-globe");
  if (!host) return;
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);
  const context = canvas.getContext("2d");
  if (!context) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const DEG = Math.PI / 180;
  const TILT = 18 * DEG;

  const inside = (lon: number, lat: number, polygon: LonLat[]): boolean => {
    let hit = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };

  // Evenly spread points (Fibonacci sphere), keeping only the ones on land.
  const dots: Pair[] = [];
  const COUNT = 12000;
  for (let i = 0; i < COUNT; i += 1) {
    const y = 1 - (i + .5) / COUNT * 2;
    const lat = Math.asin(y);
    const lon = ((i * 137.50776) % 360) - 180;
    const latDeg = lat / DEG;
    if (latDeg < -62 || land.some((polygon) => inside(lon, latDeg, polygon))) dots.push([lat, lon * DEG]);
  }

  const lines: Pair[][] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const line: Pair[] = [];
    for (let lat = -90; lat <= 90; lat += 3) line.push([lat * DEG, lon * DEG]);
    lines.push(line);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const line: Pair[] = [];
    for (let lon = -180; lon <= 180; lon += 3) line.push([lat * DEG, lon * DEG]);
    lines.push(line);
  }

  let size = 0;
  let ratio = 1;
  let rgb: number[] = [0, 113, 227];
  let rotation = -30 * DEG;
  let visible = true;
  let frameId = 0;
  let last = 0;

  const readColor = () => {
    const match = getComputedStyle(host).color.match(/\d+(\.\d+)?/g);
    if (match) rgb = match.slice(0, 3).map(Number);
  };
  const tint = (alpha: number | string): string => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;

  const resize = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    size = host.clientWidth;
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    draw();
  };

  const project = (lat: number, lon: number): Point3 => {
    const cosLat = Math.cos(lat);
    const x = cosLat * Math.sin(lon + rotation);
    const y = Math.sin(lat);
    const z = cosLat * Math.cos(lon + rotation);
    return [x, y * Math.cos(TILT) - z * Math.sin(TILT), y * Math.sin(TILT) + z * Math.cos(TILT)];
  };

  const draw = () => {
    if (!size) return;
    const s = size * ratio;
    const c = s / 2;
    const r = s * .44;
    context.clearRect(0, 0, s, s);

    // Soft atmosphere just outside the limb.
    const halo = context.createRadialGradient(c, c, r * .96, c, c, r * 1.12);
    halo.addColorStop(0, tint(.16));
    halo.addColorStop(1, tint(0));
    context.fillStyle = halo;
    context.fillRect(0, 0, s, s);

    context.save();
    context.beginPath();
    context.arc(c, c, r, 0, Math.PI * 2);
    context.clip();

    // Body: brighter toward the limb like a lit glass sphere, with a highlight from the upper left.
    const body = context.createRadialGradient(c, c, 0, c, c, r);
    body.addColorStop(0, tint(.05));
    body.addColorStop(.7, tint(.09));
    body.addColorStop(1, tint(.24));
    context.fillStyle = body;
    context.fillRect(0, 0, s, s);
    const shine = context.createRadialGradient(c - r * .42, c - r * .48, 0, c - r * .42, c - r * .48, r * 1.05);
    shine.addColorStop(0, "rgba(255,255,255,.34)");
    shine.addColorStop(.45, "rgba(255,255,255,.06)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = shine;
    context.fillRect(0, 0, s, s);

    // Graticule: only front-facing segments are drawn, so no line ever leaves the sphere.
    context.lineWidth = Math.max(1, ratio * .7);
    lines.forEach((line) => {
      let previous: Point3 | null = null;
      line.forEach(([lat, lon]) => {
        const point = project(lat, lon);
        if (previous && previous[2] > 0 && point[2] > 0) {
          context.strokeStyle = tint((.05 + .13 * point[2]).toFixed(3));
          context.beginPath();
          context.moveTo(c + previous[0] * r, c - previous[1] * r);
          context.lineTo(c + point[0] * r, c - point[1] * r);
          context.stroke();
        }
        previous = point;
      });
    });

    // Land dots, lit from the upper left and fading toward the limb.
    const dotSize = Math.max(1, r / 150);
    context.fillStyle = tint(1);
    dots.forEach(([lat, lon]) => {
      const [x, y, z] = project(lat, lon);
      if (z <= .02) return;
      const light = .55 + .45 * Math.max(0, -x * .5 + y * .55 + z * .67);
      context.globalAlpha = Math.min(1, (.2 + .8 * z) * light * .9);
      context.beginPath();
      context.arc(c + x * r, c - y * r, dotSize * (.65 + .35 * z), 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
    context.restore();

    // A thin rim keeps the edge crisp.
    context.beginPath();
    context.arc(c, c, r - context.lineWidth / 2, 0, Math.PI * 2);
    context.strokeStyle = tint(.3);
    context.stroke();
  };

  const frame = (time: number) => {
    const elapsed = Math.min((time - (last || time)) / 1000, .1);
    last = time;
    rotation += elapsed * 7 * DEG;
    draw();
    frameId = visible && !reduceMotion.matches ? requestAnimationFrame(frame) : 0;
    if (!frameId) last = 0;
  };
  const start = () => { if (!frameId && visible && !reduceMotion.matches) frameId = requestAnimationFrame(frame); };

  readColor();
  resize();
  new ResizeObserver(resize).observe(host);
  new MutationObserver(() => { readColor(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }).observe(host);
  }
  start();
};
