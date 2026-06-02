import React from "react";

export function Arrow({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.65 11.35C3.45 11.16 3.45 10.84 3.65 10.65L10.29 4L6 4C5.72 4 5.5 3.78 5.5 3.5C5.5 3.22 5.72 3 6 3L11.5 3C11.63 3 11.76 3.05 11.85 3.15C11.95 3.24 12 3.37 12 3.5L12 9C12 9.28 11.78 9.5 11.5 9.5C11.22 9.5 11 9.28 11 9V4.71L4.35 11.35C4.16 11.55 3.84 11.55 3.65 11.35Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
