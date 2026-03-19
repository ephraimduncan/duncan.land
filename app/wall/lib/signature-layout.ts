import type { GuestbookSignature } from "@/types/guestbook";

export const ELEMENT_WIDTH = 220;
export const ELEMENT_HEIGHT = 140;

export interface SignaturePosition {
  id: string;
  x: number;
  y: number;
  signature: GuestbookSignature;
}

export interface SignatureLayout {
  positions: SignaturePosition[];
  revealOrder: string[];
}

interface PlacedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_GAP = 12;
const MAX_RADIUS = 2200;
const RADIAL_STEP = 14;
const ARC_STEP = 18;
const PACKING_DENSITY = 0.88;
const SEARCH_OVERSCAN = 1.4;

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return function () {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

function computeTargetRadius(count: number) {
  const paddedWidth = ELEMENT_WIDTH + MIN_GAP * 2;
  const paddedHeight = ELEMENT_HEIGHT + MIN_GAP * 2;
  const area = count * paddedWidth * paddedHeight;
  const radius = Math.sqrt(area / Math.PI) / PACKING_DENSITY;
  return Math.min(MAX_RADIUS, radius * SEARCH_OVERSCAN);
}

function hasCollision(x: number, y: number, rects: PlacedRect[]) {
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

function findPosition(id: string, placedRects: PlacedRect[], searchRadius: number) {
  const random = seededRandom(id);
  const startAngle = random() * Math.PI * 2;
  const jitterRadius = (random() - 0.5) * MIN_GAP * 0.7;
  const jitterAngle = (random() - 0.5) * 0.5;

  for (let radius = 0; radius <= searchRadius; radius += RADIAL_STEP) {
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

      if (!hasCollision(x, y, placedRects)) {
        return { x, y };
      }
    }
  }

  throw new Error(`Could not place signature ${id}`);
}

export function computeSignatureLayout(signatures: GuestbookSignature[]): SignatureLayout {
  const placedRects: PlacedRect[] = [];
  const searchRadius = Math.min(MAX_RADIUS, computeTargetRadius(signatures.length) + RADIAL_STEP * 2);

  const positions = signatures.map((signature) => {
    const { x, y } = findPosition(signature.id, placedRects, searchRadius);

    placedRects.push({ x, y, width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT });

    return {
      id: signature.id,
      x,
      y,
      signature,
    };
  });

  const revealOrder = [...positions]
    .sort((a, b) => {
      const distA = a.x * a.x + a.y * a.y;
      const distB = b.x * b.x + b.y * b.y;
      return distA - distB;
    })
    .map((pos) => pos.id);

  return { positions, revealOrder };
}
