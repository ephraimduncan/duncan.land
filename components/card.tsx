import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
    asChild?: boolean;
}

export function cx(...args: ClassValue[]) {
    return twMerge(clsx(...args));
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, asChild, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    return (
        <Component
            ref={forwardedRef}
            className={cx(
                "relative w-full rounded-md border p-5 text-left shadow-sm",
                "bg-white dark:bg-grey-900",
                "border-grey-200 dark:border-grey-950",
                className
            )}
            {...props}
        />
    );
});

Card.displayName = "Card";

export { Card, type CardProps };
