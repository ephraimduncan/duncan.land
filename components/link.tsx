import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import React from "react";

export const Link = React.forwardRef(
    (props: { href: string } & React.ComponentPropsWithoutRef<"a">, ref: React.ForwardedRef<HTMLAnchorElement>) => {
        return (
            <HeadlessDataInteractive>
                <a {...props} ref={ref} />
            </HeadlessDataInteractive>
        );
    }
);

Link.displayName = "Link";
