"use client";

import { Button as HeadlessButton, type ButtonProps as HeadlessButtonProps } from "@headlessui/react";
import { clsx } from "clsx";
import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { Link, type LinkProps } from "./link";

const styles = {
    base: [
        // Base
        "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",

        // Sizing
        "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",

        // Focus
        "focus:outline-hidden data-focus:outline-solid data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",

        // Disabled
        "data-disabled:opacity-50",

        // Icon
        "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]",
    ],
    solid: [
        // Optical border, implemented as the button background to avoid corner artifacts
        "border-transparent bg-(--btn-border)",

        // Dark mode: border is rendered on `after` so background is set to button background
        "dark:bg-(--btn-bg)",

        // Button background, implemented as foreground layer to stack on top of pseudo-border layer
        "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)",

        // Drop shadow, applied to the inset `before` layer so it blends with the border
        "before:shadow-sm",

        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",

        // Dark mode: Subtle white outline is applied using a border
        "dark:border-white/5",

        // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
        "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]",

        // Inner highlight shadow
        "after:shadow-[inset_0_1px_--theme(--color-white/15%)]",

        // White overlay on hover
        "data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)",

        // Dark mode: `after` layer expands to cover entire button
        "dark:after:-inset-px dark:after:rounded-lg",

        // Disabled
        "data-disabled:before:shadow-none data-disabled:after:shadow-none",

        // Default color
        "text-grey-950 [--btn-bg:white] [--btn-border:var(--color-grey-950)]/10 [--btn-hover-overlay:var(--color-grey-950)]/2.5 data-active:[--btn-border:var(--color-grey-950)]/15 data-hover:[--btn-border:var(--color-grey-950)]/15",
        "dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-grey-800)]",
        "[--btn-icon:var(--color-grey-500)] data-active:[--btn-icon:var(--color-grey-700)] data-hover:[--btn-icon:var(--color-grey-700)] dark:[--btn-icon:var(--color-grey-500)] dark:data-active:[--btn-icon:var(--color-grey-400)] dark:data-hover:[--btn-icon:var(--color-grey-400)]",
    ],

    plain: [
        // Base
        "border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5",

        // Dark mode
        "dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10",

        // Icon
        "[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]",
    ],
};

type ButtonOwnProps = {
    children: ReactNode;
    className?: string;
    plain?: boolean;
};

type ButtonLinkProps = ButtonOwnProps & Omit<LinkProps, "children" | "className">;
type ButtonActionProps = ButtonOwnProps & Omit<HeadlessButtonProps, "as" | "children" | "className">;

export type ButtonProps = ButtonLinkProps | ButtonActionProps;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
    { plain, className, children, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLElement>
) {
    const classes = clsx(className, styles.base, plain ? styles.plain : styles.solid);

    return "href" in props ? (
        <Link {...props} className={classes} ref={ref as ForwardedRef<HTMLAnchorElement>}>
            {children}
        </Link>
    ) : (
        <HeadlessButton
            {...props}
            className={clsx(classes, "cursor-default")}
            ref={ref as ForwardedRef<HTMLButtonElement>}
        >
            {children}
        </HeadlessButton>
    );
});
