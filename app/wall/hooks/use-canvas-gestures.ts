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

  const isElementTarget = useCallback((eventTarget: EventTarget | null) => {
    return !!(
      eventTarget instanceof Element &&
      eventTarget.closest('[data-element="true"]')
    );
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isElementTarget(event.target)) return;

      panningRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startPanX: canvasPanRef.current.x,
        startPanY: canvasPanRef.current.y,
      };

      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        isElement: false,
      });

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [canvasPanRef, isElementTarget]
  );

  const handleCanvasPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pointerState = activePointersRef.current.get(event.pointerId);

      if (pointerState) {
        pointerState.x = event.clientX;
        pointerState.y = event.clientY;
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
    [canvasScaleRef]
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

        setCanvasPan((previousPan) => ({
          x: previousPan.x - event.deltaX,
          y: previousPan.y - event.deltaY,
        }));
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const activePanDrag = panningRef.current;

      if (activePanDrag) {
        const deltaX = event.clientX - activePanDrag.startClientX;
        const deltaY = event.clientY - activePanDrag.startClientY;

        setCanvasPan({
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
        panningRef.current = null;
      }

      activePointersRef.current.delete(event.pointerId);

      const isPinchPointerReleased =
        pinchRef.current &&
        (event.pointerId === pinchRef.current.primaryPointerId ||
          event.pointerId === pinchRef.current.secondaryPointerId);

      if (isPinchPointerReleased) {
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
    };
  }, [
    canvasRef,
    wheelZoomDamping,
    scaleByAtPoint,
    setCanvasPan,
    setScaleAtPoint,
  ]);

  return {
    onPointerDown: handleCanvasPointerDown,
    onPointerMove: handleCanvasPointerMove,
  };
}
