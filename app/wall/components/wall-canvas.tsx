"use client";

import { useEffect, useRef, useState } from "react";
import useCanvasViewport from "../hooks/use-canvas-viewport";
import { useViewportCulling } from "../hooks/use-viewport-culling";
import type { SignaturePosition } from "../lib/signature-layout";
import { ELEMENT_HEIGHT, ELEMENT_WIDTH } from "../lib/signature-layout";
import { SignatureElement } from "./signature-element";
import { SignatureDialogController, type SignatureDialogHandle } from "./signature-dialog";
import { CanvasControls } from "./canvas-controls";
import { GuestbookCTA } from "./guestbook-cta";

interface WallCanvasProps {
  positions: SignaturePosition[];
  revealOrder: string[];
}

const BASE_DELAY_MS = 100;
const STAGGER_MS = 150;
const RING_SIZE = 5;

export function WallCanvas({ positions, revealOrder }: WallCanvasProps) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const dialogRef = useRef<SignatureDialogHandle | null>(null);

  const {
    canvas: { ref, pan, onPointerDown, onPointerMove },
    zoom: { scale, percent, zoomIn, zoomOut, zoomToFit, zoomTo100 },
  } = useCanvasViewport({ initialScale: 0.8 });

  const visiblePositions = useViewportCulling({
    positions,
    pan,
    scale,
    elementWidth: ELEMENT_WIDTH,
    elementHeight: ELEMENT_HEIGHT,
  });

  useEffect(() => {
    let currentIndex = 0;
    let startTime: number | null = null;
    let frameId: number;

    const reveal = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const toReveal: string[] = [];
      while (currentIndex < revealOrder.length) {
        const ringIndex = Math.floor(currentIndex / RING_SIZE);
        const revealTime = BASE_DELAY_MS + ringIndex * STAGGER_MS;

        if (elapsed >= revealTime) {
          toReveal.push(revealOrder[currentIndex]);
          currentIndex++;
        } else {
          break;
        }
      }

      if (toReveal.length > 0) {
        setRevealedIds((prev) => new Set([...prev, ...toReveal]));
      }

      if (currentIndex < revealOrder.length) {
        frameId = requestAnimationFrame(reveal);
      }
    };

    frameId = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frameId);
  }, [revealOrder]);

  return (
    <>
      <GuestbookCTA />

      <div
        ref={ref}
        className="absolute inset-0 touch-none will-change-transform"
        style={{ transformOrigin: "0 0" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <div
          className="relative h-screen w-screen will-change-transform"
          style={{
            transformOrigin: "0 0",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {visiblePositions.map((pos) => (
            <SignatureElement
              key={pos.id}
              signature={pos.signature}
              x={pos.x}
              y={pos.y}
              isRevealed={revealedIds.has(pos.id)}
              onClick={() => dialogRef.current?.open(pos.signature)}
            />
          ))}
        </div>
      </div>

      <CanvasControls
        zoomPercent={percent}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomToFit={zoomToFit}
        onZoomTo100={zoomTo100}
      />

      <SignatureDialogController ref={dialogRef} />
    </>
  );
}
