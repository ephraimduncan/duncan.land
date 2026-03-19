"use client";

import { Minus, Plus, Maximize, Minimize, RotateCcw } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

interface CanvasControlsProps {
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
}

export function CanvasControls({
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
}: CanvasControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const fullscreenLabel = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-grey-200 bg-white p-1 shadow-lg dark:border-grey-800 dark:bg-grey-900"
      role="group"
      aria-label="Canvas controls"
    >
      <ControlButton
        onClick={toggleFullscreen}
        label={fullscreenLabel}
        title={`${fullscreenLabel} (F)`}
      >
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </ControlButton>
      <ControlButton
        onClick={onZoomToFit}
        label="Zoom to fit"
        title="Zoom to fit"
      >
        <RotateCcw size={15} />
      </ControlButton>
      <ControlButton onClick={onZoomIn} label="Zoom in" title="Zoom in">
        <Plus size={15} />
      </ControlButton>
      <span className="sr-only" aria-live="polite">
        {zoomPercent}%
      </span>
      <ControlButton onClick={onZoomOut} label="Zoom out" title="Zoom out">
        <Minus size={15} />
      </ControlButton>
    </div>
  );
}

interface ControlButtonProps {
  children: ReactNode;
  label: string;
  onClick: () => void | Promise<void>;
  title: string;
}

function ControlButton({ children, label, onClick, title }: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-xl bg-grey-100 p-1.5 text-grey-700 transition-colors hover:bg-grey-200 active:scale-95 dark:bg-grey-800 dark:text-grey-300 dark:hover:bg-grey-700"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
