"use client";

import Image from "next/image";
import { memo } from "react";
import type { WallSignature } from "@/lib/data/wall";
import { ELEMENT_HEIGHT, ELEMENT_WIDTH } from "../lib/signature-layout";

interface SignatureElementProps {
  signature: WallSignature;
  x: number;
  y: number;
  revealDelayMs: number;
  onOpenSignature: (signature: WallSignature) => void;
  wasDragging: () => boolean;
}

export const SignatureElement = memo(function SignatureElement({
  signature,
  x,
  y,
  revealDelayMs,
  onOpenSignature,
  wasDragging,
}: SignatureElementProps) {
  const handleClick = () => {
    if (wasDragging()) return;
    onOpenSignature(signature);
  };

  return (
    <div
      className="signature-element absolute left-0 top-0"
      style={{
        width: `${ELEMENT_WIDTH}px`,
        height: `${ELEMENT_HEIGHT}px`,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        animationDelay: `${Math.max(0, revealDelayMs)}ms`,
        contain: "layout style paint",
      }}
    >
      <div className="relative h-full w-full pointer-events-none">
        <Image
          src={signature.signature}
          alt={`Signature by ${signature.name || signature.username}`}
          fill
          className="object-contain opacity-80 dark:opacity-90 [.dark_&]:invert"
          unoptimized
        />
      </div>
      <button
        type="button"
        data-element="true"
        aria-label={`Open signature by ${signature.name || signature.username}`}
        onClick={handleClick}
        className="signature-hit"
      />
    </div>
  );
});
