import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { memo } from "react";
import { ELEMENT_HEIGHT, ELEMENT_WIDTH, type SignaturePosition } from "../lib/signature-layout";

interface SignatureElementProps {
  position: SignaturePosition;
  revealDelayMs: number;
  onOpenSignature: (signature: SignaturePosition["signature"]) => void;
}

export const SignatureElement = memo(function SignatureElement({
  position,
  revealDelayMs,
  onOpenSignature,
}: SignatureElementProps) {
  const { signature, x, y } = position;
  const displayName = signature.name ?? signature.username;
  const sx = stylex.props(styles.element);

  return (
    <div
      className={clsx("signature-element", sx.className)}
      style={{
        ...sx.style,
        width: `${ELEMENT_WIDTH}px`,
        height: `${ELEMENT_HEIGHT}px`,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        animationDelay: `${revealDelayMs}ms`,
        contain: "layout style paint",
      }}
    >
      <div {...stylex.props(styles.frame)}>
        <img
          src={signature.signature}
          alt={`Signature by ${displayName}`}
          {...stylex.props(styles.image)}
          loading="lazy"
        />
      </div>
      <button
        type="button"
        data-element="true"
        aria-label={`Open signature by ${displayName}`}
        onClick={() => onOpenSignature(signature)}
        className="signature-hit"
      />
    </div>
  );
});

const styles = stylex.create({
  element: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  frame: {
    position: "relative",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    opacity: "var(--signature-opacity)",
    filter: "var(--signature-filter)",
  },
});
