import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import type { ComponentPropsWithRef, ReactNode } from "react";

export type LinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  ref?: ComponentPropsWithRef<"a">["ref"];
};

export function Link({ href, ref, ...props }: LinkProps) {
  return (
    <HeadlessDataInteractive>
      <a {...props} href={href} ref={ref} />
    </HeadlessDataInteractive>
  );
}
