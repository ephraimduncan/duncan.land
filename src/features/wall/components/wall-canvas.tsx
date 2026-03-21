import { useCallback, useMemo, useState } from "react";
import useCanvasViewport from "../hooks/use-canvas-viewport";
import { useViewportCulling } from "../hooks/use-viewport-culling";
import type { SignaturePosition } from "../lib/signature-layout";
import { SignatureElement } from "./signature-element";
import { SignatureDialog } from "./signature-dialog";
import { CanvasControls } from "./canvas-controls";
import { GuestbookCTA } from "./guestbook-cta";

interface WallCanvasProps {
  positions: SignaturePosition[];
  revealOrder: string[];
}

const BASE_DELAY_MS = 0;
const STAGGER_MS = 30;
const RING_SIZE = 5;

function getRevealDelay(revealIndexById: Map<string, number>, id: string) {
  const revealIndex = revealIndexById.get(id);

  if (revealIndex === undefined) {
    throw new Error(`Missing reveal order for signature ${id}`);
  }

  const ringIndex = Math.floor(revealIndex / RING_SIZE) % 10;
  return BASE_DELAY_MS + ringIndex * STAGGER_MS;
}

export function WallCanvas({ positions, revealOrder }: WallCanvasProps) {
  const [selectedSignature, setSelectedSignature] = useState<SignaturePosition["signature"] | null>(null);

  const {
    canvasRef,
    pan,
    scale,
    zoomPercent,
    isViewportReady,
    onPointerDown,
    onPointerMove,
    wasDragging,
    zoomIn,
    zoomOut,
    zoomToFit,
  } = useCanvasViewport();

  const visiblePositions = useViewportCulling({
    positions,
    pan,
    scale,
    viewportReady: isViewportReady,
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
      if (wasDragging()) return;
      setSelectedSignature(signature);
    },
    [wasDragging]
  );

  const closeSignature = useCallback(() => {
    setSelectedSignature(null);
  }, []);

  return (
    <>
      <GuestbookCTA />

      <div
        ref={canvasRef}
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
          {visiblePositions.map((position) => {
            return (
              <SignatureElement
                key={position.id}
                position={position}
                revealDelayMs={getRevealDelay(revealIndexById, position.id)}
                onOpenSignature={handleOpenSignature}
              />
            );
          })}
        </div>
      </div>

      <CanvasControls
        zoomPercent={zoomPercent}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomToFit={zoomToFit}
      />

      {selectedSignature ? (
        <SignatureDialog signature={selectedSignature} onClose={closeSignature} />
      ) : null}
    </>
  );
}
