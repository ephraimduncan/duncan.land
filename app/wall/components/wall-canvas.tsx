"use client";

import { useEffect, useRef, useState } from "react";
import type { WallSignature } from "@/lib/data/wall";
import useCanvasViewport from "../hooks/use-canvas-viewport";
import { useSignatureLayout } from "../hooks/use-signature-layout";
import { useViewportCulling } from "../hooks/use-viewport-culling";
import { SignatureElement, ELEMENT_WIDTH, ELEMENT_HEIGHT } from "./signature-element";
import { SignatureDialog } from "./signature-dialog";
import { CanvasControls } from "./canvas-controls";
import { GuestbookCTA } from "./guestbook-cta";

interface WallCanvasProps {
  signatures: WallSignature[];
}

const BASE_DELAY_MS = 100;
const STAGGER_MS = 150;
const RING_SIZE = 5;

export function WallCanvas({ signatures }: WallCanvasProps) {
  const [selectedSignature, setSelectedSignature] = useState<WallSignature | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const timeoutsRef = useRef<number[]>([]);

  const {
    canvas: { ref, pan, onPointerDown, onPointerMove },
    zoom: { scale, percent, zoomIn, zoomOut, zoomToFit, zoomTo100 },
  } = useCanvasViewport({ initialScale: 0.8 });

  const positions = useSignatureLayout({ signatures });

  const visiblePositions = useViewportCulling({
    positions,
    pan,
    scale,
    elementWidth: ELEMENT_WIDTH,
    elementHeight: ELEMENT_HEIGHT,
  });

  useEffect(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    const sortedByDistance = [...positions].sort((a, b) => {
      const distA = Math.hypot(a.x, a.y);
      const distB = Math.hypot(b.x, b.y);
      return distA - distB;
    });

    sortedByDistance.forEach((pos, index) => {
      const ringIndex = Math.floor(index / RING_SIZE);
      const timeoutId = window.setTimeout(
        () => {
          setRevealedIds((prev) => {
            const next = new Set(prev);
            next.add(pos.id);
            return next;
          });
        },
        BASE_DELAY_MS + ringIndex * STAGGER_MS
      );

      timeoutsRef.current.push(timeoutId);
    });

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [positions]);

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
              onClick={() => setSelectedSignature(pos.signature)}
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

      <SignatureDialog
        signature={selectedSignature}
        onClose={() => setSelectedSignature(null)}
      />
    </>
  );
}
