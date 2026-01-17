"use client";

import { useCallback, useEffect, useRef } from "react";

import { useCanvasGestures } from "./use-canvas-gestures";
import { useCanvasPanState, type Point } from "./use-canvas-pan-state";
import { useCanvasScaleControls } from "./use-canvas-scale-controls";

interface UseCanvasViewportOptions {
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  wheelZoomDamping?: number;
  initialScale?: number;
}

export default function useCanvasViewport({
  minScale = 0.25,
  maxScale = 3,
  zoomStep = 0.06,
  wheelZoomDamping = 0.009,
  initialScale = 1,
}: UseCanvasViewportOptions = {}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { canvasPan, setCanvasPan, canvasPanRef } = useCanvasPanState();

  const computeCentredPan = useCallback((_scale: number): Point => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }, []);

  const {
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
  } = useCanvasScaleControls({
    minScale,
    maxScale,
    zoomStep,
    initialScale,
    canvasRef,
    canvasPanRef,
    setCanvasPan,
    computeCentredPan,
  });

  const { onPointerDown, onPointerMove, wasDragging } = useCanvasGestures({
    canvasRef,
    canvasPanRef,
    canvasScaleRef,
    setCanvasPan,
    scaleByAtPoint,
    setScaleAtPoint,
    wheelZoomDamping,
  });

  useEffect(() => {
    centerToContentBounds();
  }, [centerToContentBounds]);

  return {
    canvas: {
      ref: canvasRef,
      pan: canvasPan,
      onPointerDown,
      onPointerMove,
      wasDragging,
    },
    zoom: {
      scale: canvasScale,
      percent: zoomPercent,
      zoomIn,
      zoomOut,
      zoomTo100,
      zoomToFit,
      getScale: () => canvasScaleRef.current,
    },
  };
}
