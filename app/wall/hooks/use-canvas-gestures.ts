"use client";

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

interface PointerState {
  x: number;
  y: number;
  isElement: boolean;
  startX: number;
  startY: number;
}

interface PanDragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPanX: number;
  startPanY: number;
}

interface PinchGestureState {
  primaryPointerId: number;
  secondaryPointerId: number;
  startDist: number;
  startScale: number;
}

interface UseCanvasGesturesOptions {
  canvasRef: RefObject<HTMLDivElement | null>;
  canvasPanRef: { current: Point };
  canvasScaleRef: { current: number };
  setCanvasPan: Dispatch<SetStateAction<Point>>;
  scaleByAtPoint: (clientX: number, clientY: number, factor: number) => void;
  setScaleAtPoint: (
    clientX: number,
    clientY: number,
    targetScale: number
  ) => void;
  wheelZoomDamping: number;
}

const DRAG_THRESHOLD = 8;

export function useCanvasGestures({
  canvasRef,
  canvasPanRef,
  canvasScaleRef,
  setCanvasPan,
  scaleByAtPoint,
  setScaleAtPoint,
  wheelZoomDamping,
}: UseCanvasGesturesOptions) {
  const activePointersRef = useRef<Map<number, PointerState>>(new Map());
  const panningRef = useRef<PanDragState | null>(null);
  const pinchRef = useRef<PinchGestureState | null>(null);
  const panRafRef = useRef<number | null>(null);
  const pendingPanRef = useRef<Point | null>(null);
  const lastDragEndRef = useRef<number>(0);

  const schedulePanUpdate = useCallback(
    (nextPan: Point) => {
      canvasPanRef.current = nextPan;
      pendingPanRef.current = nextPan;

      if (panRafRef.current === null) {
        panRafRef.current = requestAnimationFrame(() => {
          panRafRef.current = null;
          const pending = pendingPanRef.current;
          if (pending) {
            setCanvasPan(pending);
          }
        });
      }
    },
    [canvasPanRef, setCanvasPan]
  );

  const isElementTarget = useCallback((eventTarget: EventTarget | null) => {
    return !!(
      eventTarget instanceof Element &&
      eventTarget.closest('[data-element="true"]')
    );
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const onElement = isElementTarget(event.target);

      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        isElement: onElement,
        startX: event.clientX,
        startY: event.clientY,
      });

      if (!onElement) {
        panningRef.current = {
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startPanX: canvasPanRef.current.x,
          startPanY: canvasPanRef.current.y,
        };
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    [canvasPanRef, isElementTarget]
  );

  const handleCanvasPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pointerState = activePointersRef.current.get(event.pointerId);

      if (pointerState) {
        pointerState.x = event.clientX;
        pointerState.y = event.clientY;

        if (pointerState.isElement && !panningRef.current) {
          const dx = event.clientX - pointerState.startX;
          const dy = event.clientY - pointerState.startY;
          const distance = Math.hypot(dx, dy);

          if (distance > DRAG_THRESHOLD) {
            pointerState.isElement = false;
            panningRef.current = {
              pointerId: event.pointerId,
              startClientX: pointerState.startX,
              startClientY: pointerState.startY,
              startPanX: canvasPanRef.current.x,
              startPanY: canvasPanRef.current.y,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }
      }

      if (!pinchRef.current && activePointersRef.current.size === 2) {
        const pointerIds = Array.from(activePointersRef.current.keys());
        const primaryPointer = activePointersRef.current.get(pointerIds[0]);
        const secondaryPointer = activePointersRef.current.get(pointerIds[1]);

        if (
          primaryPointer &&
          secondaryPointer &&
          !primaryPointer.isElement &&
          !secondaryPointer.isElement
        ) {
          const deltaX = secondaryPointer.x - primaryPointer.x;
          const deltaY = secondaryPointer.y - primaryPointer.y;
          const distance = Math.hypot(deltaX, deltaY) || 1;

          pinchRef.current = {
            primaryPointerId: pointerIds[0],
            secondaryPointerId: pointerIds[1],
            startDist: distance,
            startScale: canvasScaleRef.current,
          };

          panningRef.current = null;
        }
      }
    },
    [canvasPanRef, canvasScaleRef]
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

        const delta = event.deltaY;
        const factor = Math.exp(-delta * wheelZoomDamping);

        scaleByAtPoint(event.clientX, event.clientY, factor);
      } else {
        event.preventDefault();

        schedulePanUpdate({
          x: canvasPanRef.current.x - event.deltaX,
          y: canvasPanRef.current.y - event.deltaY,
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const activePanDrag = panningRef.current;

      if (activePanDrag) {
        const deltaX = event.clientX - activePanDrag.startClientX;
        const deltaY = event.clientY - activePanDrag.startClientY;

        schedulePanUpdate({
          x: activePanDrag.startPanX + deltaX,
          y: activePanDrag.startPanY + deltaY,
        });
      }

      if (pinchRef.current) {
        const pinchGesture = pinchRef.current;

        const primaryPointer = activePointersRef.current.get(
          pinchGesture.primaryPointerId
        );
        const secondaryPointer = activePointersRef.current.get(
          pinchGesture.secondaryPointerId
        );

        if (primaryPointer && secondaryPointer) {
          const deltaX = secondaryPointer.x - primaryPointer.x;
          const deltaY = secondaryPointer.y - primaryPointer.y;
          const distance = Math.hypot(deltaX, deltaY) || 1;

          const midpointX = (primaryPointer.x + secondaryPointer.x) / 2;
          const midpointY = (primaryPointer.y + secondaryPointer.y) / 2;

          const rawScale =
            (pinchGesture.startScale * distance) / pinchGesture.startDist;

          setScaleAtPoint(midpointX, midpointY, rawScale);
        }
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      const isPanningPointerReleased =
        panningRef.current && event.pointerId === panningRef.current.pointerId;

      if (isPanningPointerReleased) {
        lastDragEndRef.current = Date.now();
        panningRef.current = null;
      }

      activePointersRef.current.delete(event.pointerId);

      const isPinchPointerReleased =
        pinchRef.current &&
        (event.pointerId === pinchRef.current.primaryPointerId ||
          event.pointerId === pinchRef.current.secondaryPointerId);

      if (isPinchPointerReleased) {
        lastDragEndRef.current = Date.now();
        pinchRef.current = null;
      }
    };

    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener("wheel", handleWheel, { passive: false, signal });
    window.addEventListener("pointermove", handlePointerMove, { signal });
    window.addEventListener("pointerup", handlePointerUp, { signal });

    return () => {
      controller.abort();
      if (panRafRef.current !== null) {
        cancelAnimationFrame(panRafRef.current);
        panRafRef.current = null;
      }
    };
  }, [
    canvasRef,
    wheelZoomDamping,
    scaleByAtPoint,
    setCanvasPan,
    setScaleAtPoint,
    canvasPanRef,
    schedulePanUpdate,
  ]);

  const wasDragging = useCallback(() => {
    return Date.now() - lastDragEndRef.current < 100;
  }, []);

  return {
    onPointerDown: handleCanvasPointerDown,
    onPointerMove: handleCanvasPointerMove,
    wasDragging,
  };
}
