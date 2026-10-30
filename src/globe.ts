/* A quiet, slowly turning dotted globe for the flight card. Everything is clipped to the sphere. */
(() => {
  /** [longitude, latitude] in degrees, or [latitude, longitude] in radians once projected. */
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

  // Rough continent outlines as [longitude, latitude]; at dot resolution this reads as a world map.
  const land: Pair[][] = [
    [[-168,66],[-162,70],[-140,70],[-120,72],[-95,72],[-80,73],[-62,66],[-55,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-82,28],[-84,30],[-90,29],[-97,26],[-97,21],[-92,18],[-87,21],[-84,15],[-83,10],[-79,8],[-80,7],[-86,12],[-92,14],[-96,16],[-105,20],[-110,24],[-112,30],[-117,32],[-121,35],[-124,40],[-124,48],[-130,54],[-140,60],[-152,58],[-160,56],[-165,60]],
    [[-50,60],[-42,60],[-20,70],[-18,80],[-35,83],[-60,82],[-72,77],[-56,70]],
    [[-80,8],[-72,12],[-62,11],[-52,5],[-50,0],[-35,-5],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-42],[-66,-48],[-69,-52],[-72,-54],[-75,-48],[-73,-38],[-71,-28],[-70,-18],[-76,-14],[-81,-6],[-80,0],[-78,2]],
    [[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[10,58],[5,62],[14,68],[25,71],[40,68],[60,70],[70,73],[90,76],[110,77],[130,72],[150,71],[170,70],[180,68],[180,65],[165,60],[160,54],[156,51],[142,47],[140,43],[130,42],[127,38],[126,35],[122,30],[121,25],[114,22],[108,21],[106,17],[109,12],[105,9],[100,13],[100,7],[103,1],[98,8],[98,16],[94,17],[92,22],[87,21],[80,15],[78,8],[73,20],[67,24],[57,25],[56,27],[50,30],[48,29],[52,24],[56,24],[59,22],[52,16],[44,12],[42,16],[38,22],[35,28],[34,31],[35,36],[30,36],[27,37],[26,40],[23,38],[22,40],[19,42],[15,41],[18,40],[16,38],[12,44],[9,44],[3,43],[-1,37],[-6,36]],
    [[-17,21],[-16,13],[-12,8],[-8,4],[-1,5],[6,4],[9,4],[10,-1],[13,-8],[12,-17],[15,-27],[18,-34],[22,-34],[28,-33],[32,-29],[35,-24],[35,-18],[40,-15],[40,-10],[39,-5],[43,0],[48,5],[51,11],[44,11],[42,15],[38,18],[35,24],[33,28],[32,31],[25,32],[20,31],[15,32],[11,34],[10,37],[2,37],[-5,36],[-10,30],[-13,27]],
    [[114,-22],[114,-34],[118,-35],[124,-34],[131,-31],[138,-35],[141,-38],[147,-38],[150,-37],[153,-31],[153,-25],[146,-19],[145,-15],[142,-11],[141,-17],[136,-12],[131,-11],[129,-15],[125,-14],[122,-18]],
    [[130,31],[132,34],[135,34],[140,35],[141,38],[142,42],[145,44],[142,45],[140,41],[139,38],[137,37],[133,35],[130,33]],
    [[-5,50],[1,51],[2,53],[-1,55],[-2,58],[-5,59],[-6,56],[-5,54],[-3,53],[-5,52]],
    [[-24,64],[-14,64],[-14,66],[-22,66]],
    [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
    [[109,1],[111,-3],[116,-4],[119,1],[117,7],[113,3]],
    [[95,5],[98,4],[106,-6],[102,-4]],
    [[131,-1],[141,-3],[150,-10],[141,-9],[137,-5]],
    [[120,18],[122,18],[124,12],[126,7],[122,7],[120,14]],
    [[172,-41],[175,-37],[178,-38],[174,-42],[170,-46],[167,-46]],
  ];
  const inside = (lon: number, lat: number, polygon: Pair[]): boolean => {
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
})();
