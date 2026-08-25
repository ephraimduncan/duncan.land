import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import type { CompiledStyles, InlineStyles, StyleXArray } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import type { ComponentPropsWithRef, ReactNode } from "react";

// Everything stylex.props accepts, so Button can pass composed style arrays through.
type StyleProp = StyleXArray<
  (null | undefined | CompiledStyles) | boolean | Readonly<[CompiledStyles, InlineStyles]>
>;

export type LinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  ref?: ComponentPropsWithRef<"a">["ref"];
  style?: StyleProp;
};

export function Link({ className, href, ref, style, ...props }: LinkProps) {
  const sx = stylex.props(style);

  return (
    <HeadlessDataInteractive>
      <a
        {...props}
        className={clsx(className, sx.className)}
        href={href}
        ref={ref}
        style={sx.style}
      />
    </HeadlessDataInteractive>
  );
}
