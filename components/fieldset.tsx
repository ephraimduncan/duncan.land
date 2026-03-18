import {
    Field as HeadlessField,
    Label as HeadlessLabel,
    type FieldProps as HeadlessFieldProps,
    type LabelProps as HeadlessLabelProps,
} from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

type FieldProps = Omit<HeadlessFieldProps, "as" | "children" | "className"> & {
    children: ReactNode;
    className?: string;
};

type LabelProps = Omit<HeadlessLabelProps, "as" | "children" | "className"> & {
    children: ReactNode;
    className?: string;
};

export function Field({ className, ...props }: FieldProps) {
    return (
        <HeadlessField
            className={clsx(
                className,
                "[&>[data-slot=label]+[data-slot=control]]:mt-3",
                "[&>[data-slot=label]+[data-slot=description]]:mt-1",
                "[&>[data-slot=description]+[data-slot=control]]:mt-3",
                "[&>[data-slot=control]+[data-slot=description]]:mt-3",
                "[&>[data-slot=control]+[data-slot=error]]:mt-3",
                "*:data-[slot=label]:font-medium"
            )}
            {...props}
        />
    );
}

export function Label({ className, ...props }: LabelProps) {
    return (
        <HeadlessLabel
            {...props}
            data-slot="label"
            className={clsx(
                className,
                "select-none text-base/6 text-grey-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white"
            )}
        />
    );
}
