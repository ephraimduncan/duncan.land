import * as stylex from "@stylexjs/stylex";
import { Minus, Plus, Maximize, Minimize, RotateCcw } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { colors } from "../../../styles/tokens.stylex";
import { shared } from "../../../styles/shared";
import "./wall-theme.css";

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
    <div {...stylex.props(styles.controls)} role="group" aria-label="Canvas controls">
      <ControlButton onClick={toggleFullscreen} label={fullscreenLabel} title={fullscreenLabel}>
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </ControlButton>
      <ControlButton onClick={onZoomToFit} label="Zoom to fit" title="Zoom to fit">
        <RotateCcw size={15} />
      </ControlButton>
      <ControlButton onClick={onZoomIn} label="Zoom in" title="Zoom in">
        <Plus size={15} />
      </ControlButton>
      <span {...stylex.props(shared.srOnly)} aria-live="polite">
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
      {...stylex.props(styles.button)}
      type="button"
      aria-label={label}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

const styles = stylex.create({
  controls: {
    position: "fixed",
    bottom: "calc(1rem + env(safe-area-inset-bottom))",
    left: "50%",
    zIndex: 50,
    display: "flex",
    transform: "translateX(-50%)",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.separator,
    backgroundColor: colors.surfaceRaised,
    padding: "0.25rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px rgb(0 0 0/0.1)",
  },
  button: {
    borderRadius: "0.75rem",
    backgroundColor: {
      default: "var(--wall-control-bg)",
      ":hover": "var(--wall-control-hover)",
    },
    padding: "0.375rem",
    color: "var(--wall-control-text)",
    transitionProperty: "background-color, color, scale",
    transitionDuration: "100ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    scale: {
      default: null,
      ":active": 0.96,
    },
  },
});
