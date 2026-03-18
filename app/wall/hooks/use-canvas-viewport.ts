"use client";

import { useEffect, useRef } from "react";

import { useCanvasGestures } from "./use-canvas-gestures";
import { useCanvasPanState } from "./use-canvas-pan-state";
import { useCanvasScaleControls } from "./use-canvas-scale-controls";

interface UseCanvasViewportOptions {
  initialScale?: number;
}

export default function useCanvasViewport({ initialScale = 1 }: UseCanvasViewportOptions = {}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { pan, panRef, setPan } = useCanvasPanState();

  const {
    scale,
    scaleRef,
    zoomPercent,
    scaleByAtPoint,
    setScaleAtPoint,
    zoomIn,
    zoomOut,
    zoomToFit,
    centerPan,
  } = useCanvasScaleControls({
    initialScale,
    canvasRef,
    panRef,
    setPan,
  });

  const { onPointerDown, onPointerMove, wasDragging } = useCanvasGestures({
    canvasRef,
    panRef,
    scaleRef,
    setPan,
    scaleByAtPoint,
    setScaleAtPoint,
  });

  useEffect(() => {
    centerPan();
  }, [centerPan]);

  return {
    canvas: {
      ref: canvasRef,
      pan,
      onPointerDown,
      onPointerMove,
      wasDragging,
    },
    zoom: {
      scale,
      percent: zoomPercent,
      zoomIn,
      zoomOut,
      zoomToFit,
    },
  };
}
