export type Point = { x: number; y: number };
export type DragHandlers = {
  start: (event: PointerEvent) => void;
  move: (event: PointerEvent, dx: number, dy: number, moved: boolean) => void;
  finish?: (event: PointerEvent, moved: boolean, cancelled: boolean) => void;
  accept?: (event: PointerEvent) => boolean;
};

// Drag only starts from a pressed button; plain hovering never moves anything.
export function bindDrag(element: HTMLElement, { start, move, finish, accept = () => true }: DragHandlers) {
  let pointer: number | null = null;
  let origin: Point = { x: 0, y: 0 };
  let moved = false;
  element.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || pointer !== null) return;
    if ((event.target instanceof Element && event.target.closest("a")) || !accept(event)) return;
    if (event.pointerType === "mouse") event.preventDefault();
    pointer = event.pointerId;
    moved = false;
    origin = { x: event.clientX, y: event.clientY };
    start(event);
    element.setPointerCapture?.(pointer);
    element.classList.add("is-dragging");
  });
  element.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    moved ||= Math.hypot(dx, dy) > 4;
    move(event, dx, dy, moved);
  });
  const stop = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    element.classList.remove("is-dragging");
    finish?.(event, moved, event.type === "pointercancel");
    if (element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId);
  };
  (["pointerup", "pointercancel", "lostpointercapture"] as const).forEach((name) => element.addEventListener(name, stop));
  element.addEventListener("click", (event) => {
    if (moved) { event.preventDefault(); event.stopImmediatePropagation(); moved = false; }
  }, true);
}
