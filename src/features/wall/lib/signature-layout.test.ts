import { describe, expect, test } from "vite-plus/test";
import type { GuestbookSignature } from "@/types/guestbook";
import { computeSignatureLayout, ELEMENT_HEIGHT, ELEMENT_WIDTH } from "./signature-layout";

function makeSignatures(count: number): GuestbookSignature[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `post-${index}`,
    created_at: new Date(index).toISOString(),
    signature: "data:image/png;base64,signature",
    username: `user-${index}`,
    name: null,
  }));
}

function overlaps(a: { x: number; y: number }, b: { x: number; y: number }) {
  return (
    a.x < b.x + ELEMENT_WIDTH &&
    a.x + ELEMENT_WIDTH > b.x &&
    a.y < b.y + ELEMENT_HEIGHT &&
    a.y + ELEMENT_HEIGHT > b.y
  );
}

describe("computeSignatureLayout", () => {
  test("returns an empty layout for empty input", () => {
    expect(computeSignatureLayout([])).toEqual({ positions: [], revealOrder: [] });
  });

  test("returns deterministic positions for stable input", () => {
    const signatures = makeSignatures(50);

    expect(computeSignatureLayout(signatures)).toEqual(computeSignatureLayout(signatures));
  });

  test("keeps dense signature walls from overlapping", () => {
    const { positions } = computeSignatureLayout(makeSignatures(1000));

    for (let index = 0; index < positions.length; index++) {
      for (let nextIndex = index + 1; nextIndex < positions.length; nextIndex++) {
        expect(overlaps(positions[index], positions[nextIndex])).toBe(false);
      }
    }
  });

  test("reveals signatures from the center outward", () => {
    const { positions, revealOrder } = computeSignatureLayout(makeSignatures(25));
    const distanceById = new Map(
      positions.map((position) => [position.id, position.x * position.x + position.y * position.y]),
    );

    for (let index = 1; index < revealOrder.length; index++) {
      const previousDistance = distanceById.get(revealOrder[index - 1]);
      const currentDistance = distanceById.get(revealOrder[index]);

      if (previousDistance === undefined || currentDistance === undefined) {
        throw new Error("Missing reveal order distance");
      }

      expect(previousDistance).toBeLessThanOrEqual(currentDistance);
    }
  });
});
