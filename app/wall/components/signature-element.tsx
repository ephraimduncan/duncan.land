"use client";

import Image from "next/image";
import { memo } from "react";
import {
  ELEMENT_HEIGHT,
  ELEMENT_WIDTH,
  type SignaturePosition,
} from "../lib/signature-layout";

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

  return (
    <div
      className="signature-element absolute left-0 top-0"
      style={{
        width: `${ELEMENT_WIDTH}px`,
        height: `${ELEMENT_HEIGHT}px`,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        animationDelay: `${revealDelayMs}ms`,
        contain: "layout style paint",
      }}
    >
      <div className="relative h-full w-full pointer-events-none">
        <Image
          src={signature.signature}
          alt={`Signature by ${displayName}`}
          fill
          className="object-contain opacity-80 dark:opacity-90 [.dark_&]:invert"
          unoptimized
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
