"use client";

import { useMemo } from "react";
import { ELEMENT_HEIGHT, ELEMENT_WIDTH } from "../lib/signature-layout";
import type { SignaturePosition } from "../lib/signature-layout";

const VIEWPORT_BUFFER = 500;

interface UseViewportCullingOptions {
  positions: SignaturePosition[];
  pan: { x: number; y: number };
  scale: number;
}

export function useViewportCulling({
  positions,
  pan,
  scale,
}: UseViewportCullingOptions): SignaturePosition[] {
  return useMemo(() => {
    if (typeof window === "undefined" || positions.length === 0) return [];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const worldLeft = -pan.x / scale - VIEWPORT_BUFFER;
    const worldRight = (viewportWidth - pan.x) / scale + VIEWPORT_BUFFER;
    const worldTop = -pan.y / scale - VIEWPORT_BUFFER;
    const worldBottom = (viewportHeight - pan.y) / scale + VIEWPORT_BUFFER;

    return positions.filter((pos) => {
      const right = pos.x + ELEMENT_WIDTH;
      const bottom = pos.y + ELEMENT_HEIGHT;

      return (
        right >= worldLeft &&
        pos.x <= worldRight &&
        bottom >= worldTop &&
        pos.y <= worldBottom
      );
    });
  }, [pan.x, pan.y, positions, scale]);
}
