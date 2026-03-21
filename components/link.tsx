import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import { forwardRef, type ReactNode } from "react";

export type LinkProps = {
    children: ReactNode;
    className?: string;
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
