import { Textarea as HeadlessTextarea, type TextareaProps as HeadlessTextareaProps } from "@headlessui/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, { resizable?: boolean } & HeadlessTextareaProps>(
    function Textarea({ className, resizable = true, ...props }, ref) {
        return (
            <span
                data-slot="control"
                className={clsx([
                    className,

                    // Basic layout
                    "relative block w-full",

                    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                    "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",

                    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                    "dark:before:hidden",

                    // Focus ring
                    "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500",

                    // Disabled state
                    "has-data-disabled:opacity-50 has-data-disabled:before:bg-grey-950/5 has-data-disabled:before:shadow-none",
                ])}
            >
                <HeadlessTextarea
                    ref={ref}
                    className={clsx([
                        // Basic layout
                        "relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",

                        // Typography
                        "text-base/6 text-grey-950 placeholder:text-grey-500 sm:text-sm/6 dark:text-white",

                        // Border
                        "border border-grey-950/10 data-hover:border-grey-950/20 dark:border-white/10 dark:data-hover:border-white/20",

                        // Background color
                        "bg-transparent dark:bg-white/5",

                        // Hide default focus styles
                        "focus:outline-hidden",

                        // Invalid state
                        "data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600",

                        // Disabled state
                        "disabled:border-grey-950/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15",

                        // Resizable
                        resizable ? "resize-y" : "resize-none",
                    ])}
                    {...props}
                />
            </span>
        );
    }
);
