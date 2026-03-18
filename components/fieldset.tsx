import {
    Description as HeadlessDescription,
    Field as HeadlessField,
    Fieldset as HeadlessFieldset,
    Label as HeadlessLabel,
    Legend as HeadlessLegend,
    type DescriptionProps as HeadlessDescriptionProps,
    type FieldProps as HeadlessFieldProps,
    type FieldsetProps as HeadlessFieldsetProps,
    type LabelProps as HeadlessLabelProps,
    type LegendProps as HeadlessLegendProps,
} from "@headlessui/react";
import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

type FieldsetProps = Omit<HeadlessFieldsetProps, "as">;
type FieldProps = Omit<HeadlessFieldProps, "as">;
type LabelProps = Omit<HeadlessLabelProps, "as">;
type LegendProps = Omit<HeadlessLegendProps, "as">;
type DescriptionProps = Omit<HeadlessDescriptionProps, "as">;

export function Fieldset({ className, ...props }: FieldsetProps) {
    return (
        <HeadlessFieldset
            {...props}
            className={clsx(className, "[&>*+[data-slot=control]]:mt-6 *:data-[slot=text]:mt-1")}
        />
    );
}

export function Legend({ className, ...props }: LegendProps) {
    return (
        <HeadlessLegend
            {...props}
            data-slot="legend"
            className={clsx(
                className,
                "text-base/6 font-semibold text-grey-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white"
            )}
        />
    );
}

export function FieldGroup({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return <div {...props} data-slot="control" className={clsx(className, "space-y-8")} />;
}

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

export function Description({
    className,
    ...props
}: DescriptionProps) {
    return (
        <HeadlessDescription
            {...props}
            data-slot="description"
            className={clsx(
                className,
                "text-base/6 text-grey-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-grey-400"
            )}
        />
    );
}

export function ErrorMessage({
    className,
    ...props
}: DescriptionProps) {
    return (
        <HeadlessDescription
            {...props}
            data-slot="error"
            className={clsx(
                className,
                "text-base/6 text-red-600 data-disabled:opacity-50 sm:text-sm/6 dark:text-red-500"
            )}
        />
    );
}
