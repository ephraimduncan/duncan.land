import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type LinkProps = ComponentPropsWithoutRef<"a"> & {
    href: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...props }, ref) {
    return (
        <HeadlessDataInteractive>
            <a {...props} href={href} ref={ref} />
        </HeadlessDataInteractive>
    );
});

Link.displayName = "Link";
