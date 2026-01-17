"use client";

import { useCallback, useMemo, useRef } from "react";
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

const BASE_DELAY_MS = 0;
const STAGGER_MS = 30;
const RING_SIZE = 5;

export function WallCanvas({ positions, revealOrder }: WallCanvasProps) {
  const dialogRef = useRef<SignatureDialogHandle | null>(null);

  const {
    canvas: { ref, pan, onPointerDown, onPointerMove, wasDragging },
    zoom: { scale, percent, zoomIn, zoomOut, zoomToFit, zoomTo100 },
  } = useCanvasViewport({ initialScale: 0.8 });

  const visiblePositions = useViewportCulling({
    positions,
    pan,
    scale,
    elementWidth: ELEMENT_WIDTH,
    elementHeight: ELEMENT_HEIGHT,
    buffer: 500,
  });

  const revealIndexById = useMemo(() => {
    const map = new Map<string, number>();
    revealOrder.forEach((id, index) => {
      map.set(id, index);
    });
    return map;
  }, [revealOrder]);

  const handleOpenSignature = useCallback(
    (signature: SignaturePosition["signature"]) => {
      dialogRef.current?.open(signature);
    },
    [dialogRef]
  );

  return (
    <>
      <GuestbookCTA />

      <div
        ref={ref}
        className="absolute inset-0 touch-none select-none will-change-transform"
        style={{ transformOrigin: "0 0" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <div
          className="relative h-screen w-screen will-change-transform"
          style={{
            transformOrigin: "0 0",
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
            contain: "layout style",
          }}
        >
          {visiblePositions.map((pos) => {
            const revealIndex = revealIndexById.get(pos.id) ?? 0;
            const ringIndex = Math.floor(revealIndex / RING_SIZE) % 10;
            const revealDelayMs = BASE_DELAY_MS + ringIndex * STAGGER_MS;

            return (
              <SignatureElement
                key={pos.id}
                signature={pos.signature}
                x={pos.x}
                y={pos.y}
                revealDelayMs={revealDelayMs}
                onOpenSignature={handleOpenSignature}
                wasDragging={wasDragging}
              />
            );
          })}
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
