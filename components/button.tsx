import { Button as HeadlessButton } from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import clsx from "clsx";
import type { ComponentPropsWithRef, ReactNode } from "react";

import "./form-theme.css";
import { Link, type LinkProps } from "./link";

const styles = stylex.create({
  base: {
    "--btn-icon": {
      default: "var(--button-icon)",
      ":hover": {
        default: "var(--button-icon-hover)",
        "@media (forced-colors: active)": "ButtonText",
      },
      ":active": "var(--button-icon-hover)",
      "@media (forced-colors: active)": "ButtonText",
    },
    alignItems: "center",
    borderRadius: "0.5rem",
    borderStyle: "solid",
    borderWidth: "1px",
    color: "var(--form-strong-text)",
    columnGap: "0.5rem",
    display: "inline-flex",
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "0.875rem",
    },
    fontWeight: 600,
    isolation: "isolate",
    justifyContent: "center",
    lineHeight: "1.5rem",
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    outline: {
      default: null,
      ":focus": "2px solid transparent",
      ":focus-visible": "2px solid var(--accent)",
    },
    outlineOffset: {
      default: null,
      ":focus": "2px",
      ":focus-visible": "2px",
    },
    paddingBlock: {
      default: "calc(0.625rem - 1px)",
      "@media (min-width: 640px)": "calc(0.375rem - 1px)",
    },
    paddingInline: {
      default: "calc(0.875rem - 1px)",
      "@media (min-width: 640px)": "calc(0.75rem - 1px)",
    },
    position: "relative",
    scale: {
      default: 1,
      ":active": 0.97,
    },
    transitionDuration: "150ms",
    transitionProperty: "scale",
    transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
  },
  solid: {
    "--btn-bg": "var(--button-solid-background)",
    "--btn-border": {
      default: "var(--button-solid-border)",
      ":hover": "var(--button-solid-border-hover)",
      ":active": "var(--button-solid-border-hover)",
    },
    "--btn-hover-overlay": "var(--button-solid-hover-overlay)",
    backgroundColor: "var(--btn-border)",
    borderColor: "var(--button-solid-border-color)",
    "::before": {
      backgroundColor: "var(--btn-bg)",
      borderRadius: "calc(0.5rem - 1px)",
      boxShadow: {
        default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        ":disabled": "none",
      },
      content: '""',
      display: "var(--button-solid-layer-display)",
      inset: 0,
      position: "absolute",
      zIndex: -10,
    },
    "::after": {
      backgroundColor: {
        default: "transparent",
        ":hover": "var(--btn-hover-overlay)",
        ":active": "var(--btn-hover-overlay)",
      },
      borderRadius: "var(--button-solid-overlay-radius)",
      boxShadow: {
        default: "inset 0 1px color-mix(in oklab, #ffffff 15%, transparent)",
        ":disabled": "none",
      },
      content: '""',
      inset: "var(--button-solid-overlay-inset)",
      position: "absolute",
      zIndex: -10,
    },
  },
  plain: {
    backgroundColor: {
      default: "transparent",
      ":hover": "var(--button-plain-hover-background)",
      ":active": "var(--button-plain-hover-background)",
    },
    borderColor: "transparent",
  },
});

type ButtonOwnProps = {
  children: ReactNode;
  style?: StyleXStyles;
  variant?: "plain" | "solid";
};

type ButtonLinkProps = ButtonOwnProps & Omit<LinkProps, "children" | "className" | "style">;
type ButtonActionProps = ButtonOwnProps &
  Pick<ComponentPropsWithRef<"button">, "disabled" | "onClick" | "ref"> & {
    type: "button" | "submit" | "reset";
  };

export type ButtonProps = ButtonLinkProps | ButtonActionProps;

export function Button({ variant = "solid", style, children, ...props }: ButtonProps) {
  if ("href" in props) {
    return (
      <Link {...props} className="btn" style={[styles.base, styles[variant], style]}>
        {children}
      </Link>
    );
  }

  const sx = stylex.props(styles.base, styles[variant], style);

  return (
    <HeadlessButton {...props} className={clsx("btn", sx.className)} style={sx.style}>
      {children}
    </HeadlessButton>
  );
}
