import { Textarea as HeadlessTextarea, type TextareaProps as HeadlessTextareaProps } from "@headlessui/react";
import { forwardRef } from "react";

type TextareaProps = Omit<HeadlessTextareaProps, "as" | "className">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    props,
    ref
) {
    return (
        <span
            data-slot="control"
            className="relative block w-full before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm dark:before:hidden after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500 has-data-disabled:opacity-50 has-data-disabled:before:bg-grey-950/5 has-data-disabled:before:shadow-none"
        >
            <HeadlessTextarea
                ref={ref}
                className="relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-base/6 text-grey-950 placeholder:text-grey-500 border border-grey-950/10 bg-transparent focus:outline-hidden data-hover:border-grey-950/20 data-invalid:border-red-500 data-invalid:data-hover:border-red-500 disabled:border-grey-950/20 resize-y sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6 dark:border-white/10 dark:bg-white/5 dark:text-white dark:data-hover:border-white/20 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15"
                {...props}
            />
        </span>
    );
});
