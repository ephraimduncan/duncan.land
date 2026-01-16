"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

import type { Point } from "./use-canvas-pan-state";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface UseCanvasScaleControlsOptions {
  minScale: number;
  maxScale: number;
  zoomStep: number;
  initialScale: number;
  canvasRef: RefObject<HTMLDivElement | null>;
  canvasPanRef: { current: Point };
  setCanvasPan: Dispatch<SetStateAction<Point>>;
  computeCentredPan: (scale: number) => Point;
}

export function useCanvasScaleControls({
  minScale,
  maxScale,
  zoomStep,
  initialScale,
  canvasRef,
  canvasPanRef,
  setCanvasPan,
  computeCentredPan,
}: UseCanvasScaleControlsOptions) {
  const initial = useMemo(
    () => clamp(initialScale, minScale, maxScale),
    [initialScale, minScale, maxScale]
  );

  const [canvasScale, setCanvasScaleState] = useState(initial);
  const canvasScaleRef = useRef(initial);

  const setCanvasScale = useCallback(
    (value: SetStateAction<number>) => {
      setCanvasScaleState((previousScale) => {
        const nextScale =
          typeof value === "function" ? value(previousScale) : value;

        canvasScaleRef.current = nextScale;
        return nextScale;
      });
    },
    [setCanvasScaleState]
  );

  const clampScale = useCallback(
    (value: number) => clamp(value, minScale, maxScale),
    [minScale, maxScale]
  );

  const setScaleKeepingPoint = useCallback(
    (clientX: number, clientY: number, targetScale: number) => {
      const canvasElement = canvasRef.current;

      if (!canvasElement) {
        setCanvasScale(clampScale(targetScale));
        return;
      }

      const previousScale = canvasScaleRef.current;
      const nextScale = clampScale(targetScale);

      const canvasBounds = canvasElement.getBoundingClientRect();
      const worldX =
        (clientX - canvasBounds.left - canvasPanRef.current.x) / previousScale;
      const worldY =
        (clientY - canvasBounds.top - canvasPanRef.current.y) / previousScale;

      const newPanX = clientX - canvasBounds.left - worldX * nextScale;
      const newPanY = clientY - canvasBounds.top - worldY * nextScale;

      setCanvasPan({ x: newPanX, y: newPanY });
      setCanvasScale(nextScale);
    },
    [canvasPanRef, canvasRef, clampScale, setCanvasPan, setCanvasScale]
  );

  const scaleByAtPoint = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const previousScale = canvasScaleRef.current;
      const nextScale = parseFloat((previousScale * factor).toFixed(3));

      setScaleKeepingPoint(clientX, clientY, nextScale);
    },
    [setScaleKeepingPoint]
  );

  const setScaleAtPoint = useCallback(
    (clientX: number, clientY: number, targetScale: number) => {
      setScaleKeepingPoint(clientX, clientY, targetScale);
    },
    [setScaleKeepingPoint]
  );

  const zoomIn = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const factor = 1 + zoomStep;
    scaleByAtPoint(centerX, centerY, factor);
  }, [scaleByAtPoint, zoomStep]);

  const zoomOut = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const factor = 1 / (1 + zoomStep);
    scaleByAtPoint(centerX, centerY, factor);
  }, [scaleByAtPoint, zoomStep]);

  const zoomTo100 = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setScaleAtPoint(centerX, centerY, 1);
  }, [setScaleAtPoint]);

  const zoomToFit = useCallback(() => {
    const targetScaleClamped = clampScale(initial);
    const nextPan = computeCentredPan(targetScaleClamped);

    setCanvasScale(targetScaleClamped);
    setCanvasPan(nextPan);
  }, [clampScale, computeCentredPan, initial, setCanvasPan, setCanvasScale]);

  const centerToContentBounds = useCallback(() => {
    const nextPan = computeCentredPan(canvasScaleRef.current);

    setCanvasPan((previousPan) =>
      previousPan.x === nextPan.x && previousPan.y === nextPan.y
        ? previousPan
        : nextPan
    );
  }, [computeCentredPan, setCanvasPan]);

  const zoomPercent = useMemo(
    () => Math.round(canvasScale * 100),
    [canvasScale]
  );

  return {
    canvasScale,
    canvasScaleRef,
    zoomPercent,
    scaleByAtPoint,
    setScaleAtPoint,
    zoomIn,
    zoomOut,
    zoomTo100,
    zoomToFit,
    centerToContentBounds,
  } as const;
}
