import { Slot } from "@radix-ui/react-slot";
import clsx, { ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    return (
      <Component
        ref={forwardedRef}
        className={cx(
          "relative w-full rounded-md p-5 text-left",
          "bg-white dark:bg-grey-900",
          "shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card, type CardProps };
