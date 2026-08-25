import * as stylex from "@stylexjs/stylex";
import { useCallback, useMemo, useState } from "react";
import { grey } from "../../../styles/tokens.stylex";
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
const KEYBOARD_PAN_STEP = 80;

function getRevealDelay(revealIndexById: Map<string, number>, id: string) {
  const revealIndex = revealIndexById.get(id);

  if (revealIndex === undefined) {
    throw new Error(`Missing reveal order for signature ${id}`);
  }

  const ringIndex = Math.floor(revealIndex / RING_SIZE) % 10;
  return BASE_DELAY_MS + ringIndex * STAGGER_MS;
}

export function WallCanvas({ positions, revealOrder }: WallCanvasProps) {
  const [selectedSignature, setSelectedSignature] = useState<SignaturePosition["signature"] | null>(
    null,
  );

  const {
    canvasRef,
    pan,
    setPan,
    scale,
    zoomPercent,
    isViewportReady,
    onPointerDown,
    onPointerMove,
    onWheel,
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
    [wasDragging],
  );

  const closeSignature = useCallback(() => {
    setSelectedSignature(null);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;

      let dx = 0;
      let dy = 0;
      switch (event.key) {
        case "ArrowLeft":
          dx = KEYBOARD_PAN_STEP;
          break;
        case "ArrowRight":
          dx = -KEYBOARD_PAN_STEP;
          break;
        case "ArrowUp":
          dy = KEYBOARD_PAN_STEP;
          break;
        case "ArrowDown":
          dy = -KEYBOARD_PAN_STEP;
          break;
        default:
          return;
      }

      event.preventDefault();
      setPan((previous) => ({ x: previous.x + dx, y: previous.y + dy }));
    },
    [setPan],
  );

  return (
    <>
      <GuestbookCTA />

      <div
        ref={canvasRef}
        role="application"
        aria-label="Signature wall canvas. Use the arrow keys to pan."
        tabIndex={0}
        {...stylex.props(styles.canvas)}
        style={{ transformOrigin: "0 0" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onWheel={onWheel}
        onKeyDown={handleKeyDown}
      >
        <div
          {...stylex.props(styles.viewport)}
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

const styles = stylex.create({
  canvas: {
    position: "absolute",
    inset: 0,
    touchAction: "none",
    userSelect: "none",
    willChange: "transform",
    outlineWidth: {
      default: null,
      ":focus-visible": "2px",
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "solid",
    },
    outlineColor: {
      default: null,
      ":focus-visible": grey.g400,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "-2px",
    },
  },
  viewport: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    willChange: "transform",
  },
});
