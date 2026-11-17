/*
 * 3D photo: the picture is redrawn through a depth map, so near things (the fan, the girl)
 * slide against the street behind them as the viewpoint moves. One quad, one small shader.
 * Without WebGL the plain <img> underneath simply stays visible.
 */

const VERTEX = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * .5 + .5;
  gl_Position = vec4(p, 0., 1.);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D photo;
uniform sampler2D depth;
uniform vec2 shift;
varying vec2 v;
const float FOCUS = .5;    // depth that stays put (about the girl): nearer slides one way, farther the other
const float NEAREST = .68; // the fan is far nearer than anything else; flattened to just in front of the girl,
                           // or it slides so far that the street around it smears into a fan-shaped streak
const float ZOOM = .962;   // slight crop, so the shifted edges never run out of picture
float near(vec2 at) { return min(texture2D(depth, at).r, NEAREST) - FOCUS; }
void main() {
  vec2 uv = (v - .5) * ZOOM + .5;
  // Each pass looks the depth up again where the last one landed, which keeps edges tight.
  vec2 s = uv;
  for (int i = 0; i < 5; i++) s = uv + shift * near(s);
  gl_FragColor = texture2D(photo, s);
}`;

/** How far the picture travels at full viewpoint, as a share of the photo's width per unit of depth. */
const STRENGTH = .028;

const load = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = url;
});

const ready = (image: HTMLImageElement): Promise<unknown> =>
  image.complete && image.naturalWidth ? Promise.resolve() : new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", reject, { once: true });
  });

export type DepthPhoto = {
  /** Viewpoint in -1..1 on each axis: positive x looks from the right, positive y from below. */
  draw: (x: number, y: number) => void;
};

/** Lays a canvas over the frame's <img>. `draw` does nothing until both pictures are loaded. */
export const createDepthPhoto = (frame: HTMLElement, depthUrl: string, onReady: () => void): DepthPhoto => {
  const photo = frame.querySelector("img");
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
  let draw: DepthPhoto["draw"] = () => {};
  if (!photo || !gl) return { draw };

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const texture = (unit: number, image: HTMLImageElement, filter: number) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  Promise.all([ready(photo), load(depthUrl)]).then(([, depth]) => {
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    texture(0, photo, gl.LINEAR);
    texture(1, depth, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, "photo"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "depth"), 1);
    const shift = gl.getUniformLocation(program, "shift");

    let last = { x: 0, y: 0 };
    let lost = false;
    const resize = () => {
      const size = Math.round(Math.min(frame.clientWidth * Math.min(window.devicePixelRatio || 1, 2), 1280));
      if (!size || canvas.width === size) return false;
      canvas.width = canvas.height = size;
      gl.viewport(0, 0, size, size);
      return true;
    };
    draw = (x, y) => {
      if (lost) return;
      last = { x, y };
      // Texture space runs upwards, so the vertical shift is flipped.
      gl.uniform2f(shift, x * STRENGTH, -y * STRENGTH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    canvas.addEventListener("webglcontextlost", () => {
      lost = true;
      frame.classList.remove("has-depth");
    });
    new ResizeObserver(() => { if (resize()) draw(last.x, last.y); }).observe(frame);

    canvas.className = "portrait-depth";
    canvas.setAttribute("aria-hidden", "true");
    photo.after(canvas);
    resize();
    draw(0, 0);
    frame.classList.add("has-depth");
    onReady();
  }).catch(() => {});

  return { draw: (x, y) => draw(x, y) };
};
