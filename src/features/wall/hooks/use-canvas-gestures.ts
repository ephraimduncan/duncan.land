import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type SetStateAction,
} from "react";

import type { Point } from "./use-canvas-pan-state";

type PointerTarget = "canvas" | "element";

interface PointerState {
  x: number;
  y: number;
  target: PointerTarget;
  startX: number;
  startY: number;
}

interface PanDragState {
  type: "pan";
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPanX: number;
  startPanY: number;
}

interface PinchGestureState {
  type: "pinch";
  primaryPointerId: number;
  secondaryPointerId: number;
  startDist: number;
  startScale: number;
}

interface IdleGestureState {
  type: "idle";
}

type GestureState = IdleGestureState | PanDragState | PinchGestureState;

interface UseCanvasGesturesOptions {
  canvasRef: RefObject<HTMLDivElement | null>;
  panRef: { current: Point };
  scaleRef: { current: number };
  setPan: Dispatch<SetStateAction<Point>>;
  setScaleAtPoint: (
    clientX: number,
    clientY: number,
    targetScale: number
  ) => void;
}

const DRAG_THRESHOLD = 8;
const WHEEL_ZOOM_DAMPING = 0.009;
const RECENT_DRAG_WINDOW_MS = 100;

function assertUnknownGesture(gesture: never): never {
  throw new Error(`Unknown canvas gesture: ${JSON.stringify(gesture)}`);
}

export function useCanvasGestures({
  canvasRef,
  panRef,
  scaleRef,
  setPan,
  setScaleAtPoint,
}: UseCanvasGesturesOptions) {
  const activePointersRef = useRef<Map<number, PointerState>>(new Map());
  const gestureRef = useRef<GestureState>({ type: "idle" });
  const panRafRef = useRef<number | null>(null);
  const pendingPanRef = useRef<Point | null>(null);
  const lastDragEndRef = useRef<number>(0);

  const schedulePanUpdate = useCallback(
    (nextPan: Point) => {
      panRef.current = nextPan;
      pendingPanRef.current = nextPan;

      if (panRafRef.current === null) {
        panRafRef.current = requestAnimationFrame(() => {
          panRafRef.current = null;
          const pending = pendingPanRef.current;
          if (!pending) return;

          pendingPanRef.current = null;
          setPan(pending);
        });
      }
    },
    [panRef, setPan]
  );

  const isElementTarget = useCallback((eventTarget: EventTarget | null) => {
    return !!(eventTarget instanceof Element && eventTarget.closest('[data-element="true"]'));
  }, []);

  const startPanGesture = useCallback(
    (pointerId: number, startClientX: number, startClientY: number) => {
      gestureRef.current = {
        type: "pan",
        pointerId,
        startClientX,
        startClientY,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
      };
    },
    [panRef]
  );

  const finishGesture = useCallback(() => {
    lastDragEndRef.current = Date.now();
    gestureRef.current = { type: "idle" };
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target: PointerTarget = isElementTarget(event.target) ? "element" : "canvas";

      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        target,
        startX: event.clientX,
        startY: event.clientY,
      });

      if (target === "canvas") {
        startPanGesture(event.pointerId, event.clientX, event.clientY);
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    [isElementTarget, startPanGesture]
  );

  const handleCanvasPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pointerState = activePointersRef.current.get(event.pointerId);

      if (pointerState) {
        pointerState.x = event.clientX;
        pointerState.y = event.clientY;

        if (pointerState.target === "element" && gestureRef.current.type === "idle") {
          const dx = event.clientX - pointerState.startX;
          const dy = event.clientY - pointerState.startY;
          const distance = Math.hypot(dx, dy);

          if (distance > DRAG_THRESHOLD) {
            pointerState.target = "canvas";
            startPanGesture(event.pointerId, pointerState.startX, pointerState.startY);
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }
      }

      if (activePointersRef.current.size !== 2 || gestureRef.current.type === "pinch") {
        return;
      }

      const [firstPointer, secondPointer] = Array.from(activePointersRef.current.entries());
      if (!firstPointer || !secondPointer) return;

      const [primaryPointerId, primaryPointer] = firstPointer;
      const [secondaryPointerId, secondaryPointer] = secondPointer;

      if (primaryPointer.target === "element" || secondaryPointer.target === "element") {
        return;
      }

      const deltaX = secondaryPointer.x - primaryPointer.x;
      const deltaY = secondaryPointer.y - primaryPointer.y;

      gestureRef.current = {
        type: "pinch",
        primaryPointerId,
        secondaryPointerId,
        startDist: Math.hypot(deltaX, deltaY) || 1,
        startScale: scaleRef.current,
      };
    },
    [scaleRef, startPanGesture]
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const canvasElement = canvasRef.current;

      if (!canvasElement) return;

      const bounds = canvasElement.getBoundingClientRect();

      const isInsideCanvas =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInsideCanvas) return;

      const isZoomGesture = event.metaKey || event.ctrlKey;
      if (isZoomGesture) {
        event.preventDefault();

        const factor = Math.exp(-event.deltaY * WHEEL_ZOOM_DAMPING);
        const rawScale = scaleRef.current * factor;

        setScaleAtPoint(event.clientX, event.clientY, rawScale);
      } else {
        event.preventDefault();

        schedulePanUpdate({
          x: panRef.current.x - event.deltaX,
          y: panRef.current.y - event.deltaY,
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const gesture = gestureRef.current;

      switch (gesture.type) {
        case "idle":
          return;
        case "pan": {
          const deltaX = event.clientX - gesture.startClientX;
          const deltaY = event.clientY - gesture.startClientY;

          schedulePanUpdate({
            x: gesture.startPanX + deltaX,
            y: gesture.startPanY + deltaY,
          });
          return;
        }
        case "pinch": {
          const primaryPointer = activePointersRef.current.get(gesture.primaryPointerId);
          const secondaryPointer = activePointersRef.current.get(gesture.secondaryPointerId);
          if (!primaryPointer || !secondaryPointer) return;

          const deltaX = secondaryPointer.x - primaryPointer.x;
          const deltaY = secondaryPointer.y - primaryPointer.y;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const midpointX = (primaryPointer.x + secondaryPointer.x) / 2;
          const midpointY = (primaryPointer.y + secondaryPointer.y) / 2;
          const rawScale = (gesture.startScale * distance) / gesture.startDist;

          setScaleAtPoint(midpointX, midpointY, rawScale);
          return;
        }
      }

      assertUnknownGesture(gesture);
    };

    const handlePointerUp = (event: PointerEvent) => {
      activePointersRef.current.delete(event.pointerId);

      const gesture = gestureRef.current;

      switch (gesture.type) {
        case "idle":
          return;
        case "pan":
          if (event.pointerId !== gesture.pointerId) return;
          finishGesture();
          return;
        case "pinch": {
          const releasedPinchPointer =
            event.pointerId === gesture.primaryPointerId ||
            event.pointerId === gesture.secondaryPointerId;

          if (!releasedPinchPointer) return;

          finishGesture();
          return;
        }
      }

      assertUnknownGesture(gesture);
    };

    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener("wheel", handleWheel, { passive: false, signal });
    window.addEventListener("pointermove", handlePointerMove, { signal });
    window.addEventListener("pointerup", handlePointerUp, { signal });
    window.addEventListener("pointercancel", handlePointerUp, { signal });

    return () => {
      controller.abort();
      if (panRafRef.current !== null) {
        cancelAnimationFrame(panRafRef.current);
        panRafRef.current = null;
      }

      pendingPanRef.current = null;
    };
  }, [
    canvasRef,
    panRef,
    scaleRef,
    finishGesture,
    setScaleAtPoint,
    schedulePanUpdate,
  ]);

  const wasDragging = useCallback(() => {
    return Date.now() - lastDragEndRef.current < RECENT_DRAG_WINDOW_MS;
  }, []);

  return {
    onPointerDown: handleCanvasPointerDown,
    onPointerMove: handleCanvasPointerMove,
    wasDragging,
  };
}
