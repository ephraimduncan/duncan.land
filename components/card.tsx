import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

function Card({ className, asChild, ref, ...props }: CardProps) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn(
        "relative w-full rounded-md border p-5 text-left shadow-xs",
        "bg-white dark:bg-grey-900",
        "border-grey-200 dark:border-grey-950",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
