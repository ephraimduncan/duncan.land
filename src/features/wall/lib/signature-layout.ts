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

const MIN_GAP = 12;
const GRID_STEP_X = ELEMENT_WIDTH + MIN_GAP;
const GRID_STEP_Y = ELEMENT_HEIGHT + MIN_GAP;
const POSITION_JITTER = MIN_GAP / 4;

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

function getGridPosition(column: number, row: number) {
  return {
    x: column * GRID_STEP_X - ELEMENT_WIDTH / 2,
    y: row * GRID_STEP_Y - ELEMENT_HEIGHT / 2,
  };
}

function getSpiralCoordinates(index: number) {
  if (index === 0) {
    return { column: 0, row: 0 };
  }

  const layer = Math.ceil((Math.sqrt(index + 1) - 1) / 2);
  const sideLength = layer * 2;
  const maxIndex = (layer * 2 + 1) ** 2 - 1;
  const offset = maxIndex - index;

  if (offset < sideLength) {
    return { column: layer - offset, row: layer };
  }

  if (offset < sideLength * 2) {
    return { column: -layer, row: layer - (offset - sideLength) };
  }

  if (offset < sideLength * 3) {
    return { column: -layer + (offset - sideLength * 2), row: -layer };
  }

  return { column: layer, row: -layer + (offset - sideLength * 3) };
}

function getSignaturePosition(index: number, id: string) {
  const { column, row } = getSpiralCoordinates(index);
  const base = getGridPosition(column, row);
  const random = seededRandom(id);

  return {
    x: base.x + (random() - 0.5) * POSITION_JITTER * 2,
    y: base.y + (random() - 0.5) * POSITION_JITTER * 2,
  };
}

export function computeSignatureLayout(signatures: GuestbookSignature[]): SignatureLayout {
  const positions = signatures.map((signature, index) => {
    const { x, y } = getSignaturePosition(index, signature.id);

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
    .map((position) => position.id);

  return { positions, revealOrder };
}
