"use client";

import { Button as HeadlessButton, type ButtonProps as HeadlessButtonProps } from "@headlessui/react";
import { clsx } from "clsx";
import React from "react";
import { Link } from "./link";

const styles = {
    base: [
        // Base
        "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",

        // Sizing
        "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6",

        // Focus
        "focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500",

        // Disabled
        "data-[disabled]:opacity-50",

        // Icon
        "[&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText]",
    ],
    solid: [
        // Optical border, implemented as the button background to avoid corner artifacts
        "border-transparent bg-[--btn-border]",

        // Dark mode: border is rendered on `after` so background is set to button background
        "dark:bg-[--btn-bg]",

        // Button background, implemented as foreground layer to stack on top of pseudo-border layer
        "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-[--btn-bg]",

        // Drop shadow, applied to the inset `before` layer so it blends with the border
        "before:shadow",

        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",

        // Dark mode: Subtle white outline is applied using a border
        "dark:border-white/5",

        // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
        "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.lg)-1px)]",

        // Inner highlight shadow
        "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",

        // White overlay on hover
        "after:data-[active]:bg-[--btn-hover-overlay] after:data-[hover]:bg-[--btn-hover-overlay]",

        // Dark mode: `after` layer expands to cover entire button
        "dark:after:-inset-px dark:after:rounded-lg",

        // Disabled
        "before:data-[disabled]:shadow-none after:data-[disabled]:shadow-none",
    ],

    plain: [
        // Base
        "border-transparent text-zinc-950 data-[active]:bg-zinc-950/5 data-[hover]:bg-zinc-950/5",

        // Dark mode
        "dark:text-white dark:data-[active]:bg-white/10 dark:data-[hover]:bg-white/10",

        // Icon
        "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],

    colors: {
        light: [
            "text-grey-950 [--btn-bg:white] [--btn-border:theme(colors.grey.950/10%)] [--btn-hover-overlay:theme(colors.grey.950/2.5%)] data-[active]:[--btn-border:theme(colors.grey.950/15%)] data-[hover]:[--btn-border:theme(colors.grey.950/15%)]",
            "dark:text-white dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.grey.800)]",
            "[--btn-icon:theme(colors.grey.500)] data-[active]:[--btn-icon:theme(colors.grey.700)] data-[hover]:[--btn-icon:theme(colors.grey.700)] dark:[--btn-icon:theme(colors.grey.500)] dark:data-[active]:[--btn-icon:theme(colors.grey.400)] dark:data-[hover]:[--btn-icon:theme(colors.grey.400)]",
        ],
        dark: [
            "text-white [--btn-bg:theme(colors.grey.900)] [--btn-border:theme(colors.grey.950/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
            "dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.grey.800)]",
            "[--btn-icon:theme(colors.grey.400)] data-[active]:[--btn-icon:theme(colors.grey.300)] data-[hover]:[--btn-icon:theme(colors.grey.300)]",
        ],
    },
};

type ButtonProps = (
    | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
    | { color?: never; outline: true; plain?: never }
    | { color?: never; outline?: never; plain: true }
) & { children: React.ReactNode } & (HeadlessButtonProps | React.ComponentPropsWithoutRef<typeof Link>);

export const Button = React.forwardRef(function Button(
    { color, outline, plain, className, children, ...props }: ButtonProps,
    ref: React.ForwardedRef<HTMLElement>
) {
    let classes = clsx(
        className,
        styles.base,
        plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? "light"])
    );

    return "href" in props ? (
        <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
            {children}
        </Link>
    ) : (
        <HeadlessButton {...props} className={clsx(classes, "cursor-default")} ref={ref}>
            {children}
        </HeadlessButton>
    );
});
