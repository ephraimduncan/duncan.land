"use client";

import { useCallback, useRef, useState, type SetStateAction } from "react";

export interface Point {
  x: number;
  y: number;
}

export function useCanvasPanState() {
  const [canvasPan, setCanvasPanState] = useState<Point>({ x: 0, y: 0 });
  const canvasPanRef = useRef(canvasPan);

  const setCanvasPan = useCallback(
    (value: SetStateAction<Point>) => {
      setCanvasPanState((previousPan) => {
        const nextPan =
          typeof value === "function" ? value(previousPan) : value;

        canvasPanRef.current = nextPan;
        return nextPan;
      });
    },
    [setCanvasPanState]
  );

  return {
    canvasPan,
    setCanvasPan,
    canvasPanRef,
  };
}
