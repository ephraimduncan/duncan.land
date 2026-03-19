"use client";

import { useEffect, useRef } from "react";

import { useCanvasGestures } from "./use-canvas-gestures";
import { useCanvasPanState } from "./use-canvas-pan-state";
import { useCanvasScaleControls } from "./use-canvas-scale-controls";

const INITIAL_SCALE = 0.8;

export default function useCanvasViewport() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { pan, panRef, setPan } = useCanvasPanState();

  const {
    scale,
    scaleRef,
    zoomPercent,
    setScaleAtPoint,
    zoomIn,
    zoomOut,
    zoomToFit,
    centerPan,
  } = useCanvasScaleControls({
    initialScale: INITIAL_SCALE,
    canvasRef,
    panRef,
    setPan,
  });

  const { onPointerDown, onPointerMove, wasDragging } = useCanvasGestures({
    canvasRef,
    panRef,
    scaleRef,
    setPan,
    setScaleAtPoint,
  });

  useEffect(() => {
    centerPan();
  }, [centerPan]);

  return {
    canvasRef,
    pan,
    scale,
    zoomPercent,
    onPointerDown,
    onPointerMove,
    wasDragging,
    zoomIn,
    zoomOut,
    zoomToFit,
  } as const;
}
