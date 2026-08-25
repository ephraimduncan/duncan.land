import {
  Textarea as HeadlessTextarea,
  type TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { ChangeEventHandler, ComponentPropsWithRef } from "react";

import { colors, grey } from "../src/styles/tokens.stylex";
import "./form-theme.css";

const styles = stylex.create({
  control: {
    display: "block",
    position: "relative",
    width: "100%",
    "::before": {
      backgroundColor: "#ffffff",
      borderRadius: "calc(0.5rem - 1px)",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      content: '""',
      display: "var(--textarea-fill-display)",
      inset: "1px",
      position: "absolute",
    },
    "::after": {
      borderRadius: "0.5rem",
      boxShadow: {
        default: "inset 0 0 0 0 transparent",
        ":focus-within": "inset 0 0 0 2px var(--accent)",
      },
      content: '""',
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
    },
  },
  input: {
    appearance: "none",
    backgroundColor: "var(--textarea-background)",
    borderColor: {
      default: "var(--textarea-border)",
      ":hover": "var(--textarea-border-hover)",
    },
    borderRadius: "0.5rem",
    borderStyle: "solid",
    borderWidth: "1px",
    color: "var(--form-strong-text)",
    display: "block",
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "0.875rem",
    },
    height: "100%",
    lineHeight: "1.5rem",
    outline: {
      default: null,
      ":focus": "2px solid transparent",
    },
    outlineOffset: {
      default: null,
      ":focus": "2px",
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
    resize: "vertical",
    width: "100%",
    "::placeholder": {
      color: grey.g500,
    },
  },
  invalid: {
    borderColor: {
      default: colors.danger,
      ":hover": colors.danger,
    },
  },
});

type TextareaProps = Pick<HeadlessTextareaProps, "maxLength" | "rows"> & {
  invalid: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  ref?: ComponentPropsWithRef<"textarea">["ref"];
};

export function Textarea({ invalid, ref, ...props }: TextareaProps) {
  return (
    <span data-slot="control" {...stylex.props(styles.control)}>
      <HeadlessTextarea
        {...props}
        {...stylex.props(styles.input, invalid && styles.invalid)}
        invalid={invalid}
        ref={ref}
      />
    </span>
  );
}
