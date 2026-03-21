"use client";

import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

import { clamp } from "@/utils/math";
import type { Point } from "./use-canvas-pan-state";

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.06;

function getCanvasElement(canvasRef: RefObject<HTMLDivElement | null>) {
  const canvasElement = canvasRef.current;

  if (!canvasElement) {
    throw new Error("Canvas viewport is missing while applying scale.");
  }

  return canvasElement;
}

interface UseCanvasScaleControlsOptions {
  initialScale: number;
  canvasRef: RefObject<HTMLDivElement | null>;
  panRef: { current: Point };
  setPan: Dispatch<SetStateAction<Point>>;
}

export function useCanvasScaleControls({
  initialScale,
  canvasRef,
  panRef,
  setPan,
}: UseCanvasScaleControlsOptions) {
  const initial = clamp(initialScale, MIN_SCALE, MAX_SCALE);

  const [scale, setScaleState] = useState(initial);
  const scaleRef = useRef(initial);

  const setScale = useCallback(
    (value: SetStateAction<number>) => {
      setScaleState((previousScale) => {
        const nextScale = typeof value === "function" ? value(previousScale) : value;

        scaleRef.current = nextScale;
        return nextScale;
      });
    },
    [setScaleState]
  );

  const clampScale = useCallback((value: number) => clamp(value, MIN_SCALE, MAX_SCALE), []);

  const getViewportCenter = useCallback((): Point => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }, []);

  const setScaleKeepingPoint = useCallback(
    (clientX: number, clientY: number, targetScale: number) => {
      const nextScale = clampScale(targetScale);
      const canvasElement = getCanvasElement(canvasRef);

      const previousScale = scaleRef.current;

      const canvasBounds = canvasElement.getBoundingClientRect();
      const worldX =
        (clientX - canvasBounds.left - panRef.current.x) / previousScale;
      const worldY =
        (clientY - canvasBounds.top - panRef.current.y) / previousScale;

      const newPanX = clientX - canvasBounds.left - worldX * nextScale;
      const newPanY = clientY - canvasBounds.top - worldY * nextScale;

      setPan({ x: newPanX, y: newPanY });
      setScale(nextScale);
    },
    [canvasRef, clampScale, panRef, setPan, setScale]
  );

  const scaleByAtPoint = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const previousScale = scaleRef.current;
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
    const { x, y } = getViewportCenter();
    const factor = 1 + ZOOM_STEP;
    scaleByAtPoint(x, y, factor);
  }, [getViewportCenter, scaleByAtPoint]);

  const zoomOut = useCallback(() => {
    const { x, y } = getViewportCenter();
    const factor = 1 / (1 + ZOOM_STEP);
    scaleByAtPoint(x, y, factor);
  }, [getViewportCenter, scaleByAtPoint]);

  const zoomToFit = useCallback(() => {
    const nextPan = getViewportCenter();

    setScale(initial);
    setPan(nextPan);
  }, [getViewportCenter, initial, setPan, setScale]);

  const centerPan = useCallback(() => {
    const nextPan = getViewportCenter();

    setPan((previousPan) =>
      previousPan.x === nextPan.x && previousPan.y === nextPan.y
        ? previousPan
        : nextPan
    );
  }, [getViewportCenter, setPan]);

  const zoomPercent = Math.round(scale * 100);

  return {
    scale,
    scaleRef,
    zoomPercent,
    setScaleAtPoint,
    zoomIn,
    zoomOut,
    zoomToFit,
    centerPan,
  } as const;
}
