"use client";

import { useMemo, useState, useEffect } from "react";
import type { SignaturePosition } from "../lib/signature-layout";

interface UseViewportCullingOptions {
  positions: SignaturePosition[];
  pan: { x: number; y: number };
  scale: number;
  buffer?: number;
  elementWidth?: number;
  elementHeight?: number;
}

export function useViewportCulling({
  positions,
  pan,
  scale,
  buffer = 200,
  elementWidth = 150,
  elementHeight = 100,
}: UseViewportCullingOptions): SignaturePosition[] {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return useMemo(() => {
    if (!hasMounted) return [];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const worldLeft = -pan.x / scale - buffer;
    const worldRight = (viewportWidth - pan.x) / scale + buffer;
    const worldTop = -pan.y / scale - buffer;
    const worldBottom = (viewportHeight - pan.y) / scale + buffer;

    return positions.filter((pos) => {
      const right = pos.x + elementWidth;
      const bottom = pos.y + elementHeight;

      return (
        right >= worldLeft &&
        pos.x <= worldRight &&
        bottom >= worldTop &&
        pos.y <= worldBottom
      );
    });
  }, [positions, pan.x, pan.y, scale, buffer, elementWidth, elementHeight, hasMounted]);
}
