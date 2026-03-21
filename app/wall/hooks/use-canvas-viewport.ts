"use client";

import { useEffect, useRef, useState } from "react";

import { useCanvasGestures } from "./use-canvas-gestures";
import { useCanvasPanState } from "./use-canvas-pan-state";
import { useCanvasScaleControls } from "./use-canvas-scale-controls";

const INITIAL_SCALE = 0.8;

export default function useCanvasViewport() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [isViewportReady, setIsViewportReady] = useState(false);

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
    setIsViewportReady(true);
  }, [centerPan]);

  return {
    canvasRef,
    pan,
    scale,
    zoomPercent,
    isViewportReady,
    onPointerDown,
    onPointerMove,
    wasDragging,
    zoomIn,
    zoomOut,
    zoomToFit,
  } as const;
}
