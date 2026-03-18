import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    href: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
    return (
        <HeadlessDataInteractive>
            <a {...props} ref={ref} />
        </HeadlessDataInteractive>
    );
    }
);

Link.displayName = "Link";
