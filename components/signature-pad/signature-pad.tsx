"use client";

import { cn } from "@/lib/utils";
import type { StrokeOptions } from "perfect-freehand";
import { getStroke } from "perfect-freehand";
import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { getSvgPathFromStroke } from "./helper";
import { Point } from "./point";

const DPI = 2;
const MIN_POINT_DISTANCE = 5;

type Line = Point[];

const getCanvasContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Signature pad canvas context is not available.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  return context;
};

const getStrokeOptions = (canvas: HTMLCanvasElement) => {
  const size = Math.min(canvas.height, canvas.width) * 0.03;

  return {
    size,
    thinning: 0.25,
    streamline: 0.5,
    smoothing: 0.5,
    end: {
      taper: size * 2,
    },
  } satisfies StrokeOptions;
};

const drawLine = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  line: Line,
) => {
  const path = new Path2D(
    getSvgPathFromStroke(getStroke(line, getStrokeOptions(canvas))),
  );

  context.fill(path);
};

export interface SignaturePadProps {
  className?: string;
  onChange: (_signatureDataUrl: string | null) => void;
}

export const SignaturePad = ({
  className,
  onChange,
}: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const currentLineRef = useRef<Line>([]);
  const isDrawingRef = useRef(false);
  const [lineCount, setLineCount] = useState(0);

  const redraw = (previewLine?: Line) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = getCanvasContext(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const line of linesRef.current) {
      drawLine(context, canvas, line);
    }

    if (previewLine) {
      drawLine(context, canvas, previewLine);
    }
  };

  const publishChange = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    onChange(linesRef.current.length === 0 ? null : canvas.toDataURL());
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    isDrawingRef.current = true;
    currentLineRef.current = [Point.fromPointerEvent(event, DPI)];
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (!isDrawingRef.current) {
      return;
    }

    const currentLine = currentLineRef.current;
    const lastPoint = currentLine.at(-1);

    if (!lastPoint) {
      throw new Error("Signature pad move received without an active line.");
    }

    const point = Point.fromPointerEvent(event, DPI);

    if (point.distanceTo(lastPoint) <= MIN_POINT_DISTANCE) {
      return;
    }

    const nextLine = [...currentLine, point];
    currentLineRef.current = nextLine;
    redraw(nextLine);
  };

  const onPointerUp = (
    event: PointerEvent<HTMLCanvasElement>,
    shouldCommit = true,
  ) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (!isDrawingRef.current) {
      return;
    }

    isDrawingRef.current = false;

    const currentLine = currentLineRef.current;
    currentLineRef.current = [];

    if (!shouldCommit || currentLine.length === 0) {
      redraw();
      return;
    }

    const nextLines = [
      ...linesRef.current,
      [...currentLine, Point.fromPointerEvent(event, DPI)],
    ];

    linesRef.current = nextLines;
    setLineCount(nextLines.length);
    redraw();
    publishChange();
  };

  const onPointerEnter = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    if ("buttons" in event && event.buttons === 1) {
      onPointerDown(event);
    }
  };

  const onPointerLeave = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    onPointerUp(event, false);
  };

  const onClearClick = () => {
    linesRef.current = [];
    currentLineRef.current = [];
    isDrawingRef.current = false;
    setLineCount(0);
    redraw();
    onChange(null);
  };

  const onUndoClick = () => {
    if (linesRef.current.length === 0) {
      return;
    }

    linesRef.current = linesRef.current.slice(0, -1);
    setLineCount(linesRef.current.length);
    redraw();
    publishChange();
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.clientWidth * DPI;
      canvasRef.current.height = canvasRef.current.clientHeight * DPI;
    }
  }, []);

  return (
    <div className="relative block">
      <canvas
        ref={canvasRef}
        className={cn("relative block dark:invert", className)}
        style={{ touchAction: "none" }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerEnter={onPointerEnter}
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          type="button"
          className="focus-visible:ring-ring ring-offset-background text-muted-foreground/60 hover:text-muted-foreground rounded-full p-0 text-xs focus-visible:outline-hidden focus-visible:ring-2"
          onClick={() => onClearClick()}
        >
          Clear Signature
        </button>
      </div>

      {lineCount > 0 && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            type="button"
            title="undo"
            className="focus-visible:ring-ring ring-offset-background text-muted-foreground/60 hover:text-muted-foreground rounded-full p-0 text-xs focus-visible:outline-hidden focus-visible:ring-2"
            onClick={() => onUndoClick()}
          >
            Undo
            <span className="sr-only">Undo</span>
          </button>
        </div>
      )}
    </div>
  );
};
