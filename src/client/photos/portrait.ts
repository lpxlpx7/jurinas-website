import { clamp, coarsePointer, phoneLayout, reduceMotion } from "../core/motion.ts";
import { bindDrag, type Point } from "./drag.ts";

// iOS Safari gates motion sensors behind a permission prompt that lib.dom doesn't describe.
type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const DEG = Math.PI / 180;

/** Hanging polaroid: a damped pendulum on a push pin. CSS custom properties own every transform. */
export const initPortrait = () => {
  const stage = document.querySelector<HTMLElement>(".portrait-stage");
  const card = stage?.querySelector<HTMLElement>(".portrait-card");
  const pin = stage?.querySelector<HTMLElement>(".pushpin");
  if (!stage || !card || !pin) return;
  const REST = -1.2 * DEG;
  const GRAVITY = 30;          // g / L: swing period around 1.15s
  const AIR = 1.6;
  const HAND = 520;            // how firmly the card follows the pointer
  const HAND_DAMPING = 34;
  const GYRO_RANGE = 3.5 * DEG; // phones only lean the photo a little
  const limit = () => (phoneLayout.matches ? 10 : 18) * DEG;

  const state = { angle: REST, velocity: 0, lift: 0, liftVelocity: 0, lean: 0, glint: 0 };
  let dragging = false;
  let target = REST;
  let leanTarget = 0;
  let glintTarget = 0;
  let pivot: Point = { x: 0, y: 0 };
  let grabAngle = 0;
  let startAngle = 0;
  let frameId = 0;
  let lastTime = 0;
  let visible = true;

  const wrap = (value: number): number => Math.atan2(Math.sin(value), Math.cos(value));
  // The pin never moves, so its centre is the pivot.
  const pivotPoint = (): Point => {
    const rect = pin.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const render = () => {
    const swing = state.angle - REST;
    const swingDeg = swing / DEG;
    const depth = 14 + state.lift * 26;
    const set = (name: string, value: string) => stage.style.setProperty(name, value);
    set("--card-angle", `${(state.angle / DEG).toFixed(3)}deg`);
    set("--card-twist", `${clamp(state.velocity * 3, -8, 8).toFixed(3)}deg`);
    set("--card-lift", (1 + state.lift * .018).toFixed(4));
    // Light comes from above, so the cast shadow stays below the card while it rotates.
    set("--shadow-x", `${(depth * Math.sin(state.angle)).toFixed(2)}px`);
    set("--shadow-y", `${(depth * Math.cos(state.angle)).toFixed(2)}px`);
    set("--shadow-blur", `${(26 + state.lift * 30).toFixed(1)}px`);
    set("--shadow-alpha", (.16 - state.lift * .04).toFixed(3));
    // Lifting the photo off the wall lengthens the pin's shadow on it.
    set("--pin-shadow", `${(3 + state.lift * 3).toFixed(2)}px`);
    // The glint follows the light: it slides with the swing and the phone's tilt.
    const strength = clamp(Math.abs(swing) * 4 + Math.abs(state.velocity) * .35 + state.lift * .5 + state.glint, 0, 1);
    set("--sheen-x", `${(50 - swingDeg * 4.5 - state.lean / DEG * 9).toFixed(2)}%`);
    set("--sheen-strength", strength.toFixed(3));
  };

  const step = (dt: number) => {
    const rest = REST + state.lean;
    let torque = -GRAVITY * Math.sin(state.angle - rest) - AIR * state.velocity;
    if (dragging) torque += HAND * (target - state.angle) - HAND_DAMPING * state.velocity;
    state.velocity += torque * dt;
    state.angle += state.velocity * dt;
    const max = limit();
    if (Math.abs(state.angle - REST) > max) {
      state.angle = REST + Math.sign(state.angle - REST) * max;
      state.velocity *= -.25;
    }
    state.liftVelocity += (200 * ((dragging ? 1 : 0) - state.lift) - 24 * state.liftVelocity) * dt;
    state.lift += state.liftVelocity * dt;
    // Gyroscope input is smoothed so the photo leans, never jitters.
    state.lean += (leanTarget - state.lean) * Math.min(1, dt * 4);
    state.glint += (glintTarget - state.glint) * Math.min(1, dt * 3);
  };

  const settled = () => !dragging
    && Math.abs(state.angle - REST - state.lean) < 1e-4 && Math.abs(state.velocity) < 1e-3
    && Math.abs(state.lift) < .002 && Math.abs(state.liftVelocity) < .002
    && Math.abs(leanTarget - state.lean) < 1e-4 && Math.abs(glintTarget - state.glint) < 1e-3;
  const frame = (time: number) => {
    const elapsed = Math.min((time - (lastTime || time)) / 1000, .05);
    lastTime = time;
    const steps = Math.max(1, Math.ceil(elapsed * 240));
    for (let i = 0; i < steps; i += 1) step(elapsed / steps);
    render();
    frameId = visible && !settled() ? requestAnimationFrame(frame) : 0;
    if (!frameId) lastTime = 0;
  };
  const wake = () => { if (!frameId && visible) frameId = requestAnimationFrame(frame); };

  bindDrag(card, {
    start: (event) => {
      stage.classList.remove("is-entering");
      pivot = pivotPoint();
      grabAngle = Math.atan2(event.clientX - pivot.x, event.clientY - pivot.y);
      startAngle = target = state.angle;
      dragging = true;
      wake();
    },
    move: (event) => {
      const max = limit();
      const angle = Math.atan2(event.clientX - pivot.x, event.clientY - pivot.y);
      target = clamp(startAngle - wrap(angle - grabAngle), REST - max, REST + max);
    },
    finish: (event, moved, cancelled) => {
      dragging = false;
      // A tap without dragging gives the card a gentle push away from the finger.
      if (!moved && !cancelled && !reduceMotion.matches) {
        state.velocity += Math.sign(event.clientX - pivot.x || 1) * (phoneLayout.matches ? .9 : 1.4);
      }
      wake();
    },
  });

  /* Gyroscope: on phones the photo leans slightly as the device tilts. */
  let neutral: { gamma: number; beta: number } | null = null;
  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma == null || reduceMotion.matches) return;
    const gamma = clamp(event.gamma, -45, 45);
    const beta = clamp(event.beta ?? 45, -90, 180);
    // A slow-moving neutral pose means the photo drifts back to hanging straight
    // while the phone is simply held at an angle.
    neutral ??= { gamma, beta };
    neutral.gamma += (gamma - neutral.gamma) * .02;
    neutral.beta += (beta - neutral.beta) * .02;
    const roll = gamma - neutral.gamma;
    const pitch = beta - neutral.beta;
    // Hanging photos stay level with the world, so they counter-rotate against the roll.
    leanTarget = clamp(-roll * .16 * DEG, -GYRO_RANGE, GYRO_RANGE);
    glintTarget = clamp((Math.abs(roll) + Math.abs(pitch) * .6) / 30, 0, .55);
    wake();
  };
  let motionStarted = false;
  const startMotion = () => {
    if (motionStarted || !coarsePointer.matches || !("DeviceOrientationEvent" in window)) return;
    motionStarted = true;
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  };
  const Orientation = typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent as OrientationEventWithPermission : undefined;
  const requestPermission = Orientation?.requestPermission;
  if (typeof requestPermission === "function") {
    // iOS asks for motion access, and only from a tap: the first tap on the photo turns it on.
    card.addEventListener("click", () => {
      if (motionStarted) return;
      requestPermission.call(Orientation).then((result) => { if (result === "granted") startMotion(); }).catch(() => {});
    });
  } else {
    startMotion();
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    }).observe(stage);
  }

  if (!reduceMotion.matches) {
    // Arrive with a little swing, as if the photo was just pinned up.
    state.angle = REST + (phoneLayout.matches ? .08 : .12);
    stage.classList.add("is-entering");
    stage.addEventListener("animationend", () => stage.classList.remove("is-entering"), { once: true });
  }
  render();
  wake();
};
