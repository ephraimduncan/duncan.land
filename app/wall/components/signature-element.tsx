"use client";

import Image from "next/image";
import type { WallSignature } from "@/lib/data/wall";

interface SignatureElementProps {
  signature: WallSignature;
  x: number;
  y: number;
  isRevealed: boolean;
  onClick: () => void;
}

const ELEMENT_WIDTH = 220;
const ELEMENT_HEIGHT = 140;

export function SignatureElement({
  signature,
  x,
  y,
  isRevealed,
  onClick,
}: SignatureElementProps) {
  return (
    <button
      type="button"
      data-element="true"
      onClick={onClick}
      className="absolute left-0 top-0 cursor-pointer touch-none transition-opacity duration-500 ease-out"
      style={{
        width: `${ELEMENT_WIDTH}px`,
        height: `${ELEMENT_HEIGHT}px`,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        opacity: isRevealed ? "1" : "0",
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={signature.signature}
          alt={`Signature by ${signature.name || signature.username}`}
          fill
          className="object-contain opacity-80 dark:opacity-90 [.dark_&]:invert"
          unoptimized
        />
      </div>
    </button>
  );
}

export { ELEMENT_WIDTH, ELEMENT_HEIGHT };
