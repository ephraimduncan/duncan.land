"use client";

import { useMemo } from "react";
import type { WallSignature } from "@/lib/data/wall";
import { ELEMENT_WIDTH, ELEMENT_HEIGHT } from "../components/signature-element";

export interface SignaturePosition {
  id: string;
  x: number;
  y: number;
  signature: WallSignature;
}

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return function () {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

interface UseSignatureLayoutOptions {
  signatures: WallSignature[];
}

const MIN_GAP = 12;
const MAX_RADIUS = 2200;
const RADIAL_STEP = 14;
const ARC_STEP = 18;
const PACKING_DENSITY = 0.88;
const SEARCH_OVERSCAN = 1.4;

function computeTargetRadius(count: number) {
  const paddedWidth = ELEMENT_WIDTH + MIN_GAP * 2;
  const paddedHeight = ELEMENT_HEIGHT + MIN_GAP * 2;
  const area = count * paddedWidth * paddedHeight;
  const radius = Math.sqrt(area / Math.PI) / PACKING_DENSITY;
  return Math.min(MAX_RADIUS, radius * SEARCH_OVERSCAN);
}

export function useSignatureLayout({ signatures }: UseSignatureLayoutOptions): SignaturePosition[] {
  return useMemo(() => {
    const placedRects: Array<{ x: number; y: number; width: number; height: number }> = [];
    const targetRadius = computeTargetRadius(signatures.length);

    return signatures.map((signature) => {
      const random = seededRandom(signature.id);
      const startAngle = random() * Math.PI * 2;
      const jitterRadius = (random() - 0.5) * MIN_GAP * 0.7;
      const jitterAngle = (random() - 0.5) * 0.5;

      let bestX = 0;
      let bestY = 0;
      let found = false;

      for (let radius = 0; radius <= targetRadius; radius += RADIAL_STEP) {
        const ringRadius = radius + jitterRadius;
        const circumference = Math.max(1, Math.PI * 2 * Math.max(ringRadius, RADIAL_STEP));
        const steps = Math.max(6, Math.floor(circumference / ARC_STEP));
        const angleStep = (Math.PI * 2) / steps;

        for (let step = 0; step < steps; step++) {
          const angle = startAngle + jitterAngle + step * angleStep;
          const centerX = ringRadius * Math.cos(angle);
          const centerY = ringRadius * Math.sin(angle);
          const x = centerX - ELEMENT_WIDTH / 2;
          const y = centerY - ELEMENT_HEIGHT / 2;

          if (!checkCollision(x, y, placedRects)) {
            bestX = x;
            bestY = y;
            found = true;
            break;
          }
        }

        if (found) break;
      }

      if (!found) {
        const fallbackRadius = Math.min(MAX_RADIUS, targetRadius + RADIAL_STEP * 2);
        const fallbackAngle = startAngle + jitterAngle;
        bestX = fallbackRadius * Math.cos(fallbackAngle) - ELEMENT_WIDTH / 2;
        bestY = fallbackRadius * Math.sin(fallbackAngle) - ELEMENT_HEIGHT / 2;
      }

      placedRects.push({ x: bestX, y: bestY, width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT });

      return {
        id: signature.id,
        x: bestX,
        y: bestY,
        signature,
      };
    });
  }, [signatures]);
}

function checkCollision(
  x: number,
  y: number,
  rects: Array<{ x: number; y: number; width: number; height: number }>
) {
  const left = x;
  const right = x + ELEMENT_WIDTH;
  const top = y;
  const bottom = y + ELEMENT_HEIGHT;

  for (const rect of rects) {
    const paddedLeft = rect.x - MIN_GAP;
    const paddedRight = rect.x + rect.width + MIN_GAP;
    const paddedTop = rect.y - MIN_GAP;
    const paddedBottom = rect.y + rect.height + MIN_GAP;

    if (left < paddedRight && right > paddedLeft && top < paddedBottom && bottom > paddedTop) {
      return true;
    }
  }
  return false;
}
