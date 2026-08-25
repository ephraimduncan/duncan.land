import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Label as HeadlessLabel,
} from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import clsx from "clsx";
import type { ReactNode } from "react";

import "./form-theme.css";

const styles = stylex.create({
  label: {
    color: "var(--form-strong-text)",
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "0.875rem",
    },
    fontWeight: 500,
    lineHeight: "1.5rem",
    userSelect: "none",
  },
  error: {
    color: "var(--field-error)",
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "0.875rem",
    },
    lineHeight: "1.5rem",
  },
});

type FieldProps = {
  children: ReactNode;
  style?: StyleXStyles;
};

type LabelProps = {
  children: ReactNode;
  style?: StyleXStyles;
};

export function Field({ style, children }: FieldProps) {
  const sx = stylex.props(style);

  return (
    <HeadlessField className={clsx("field-layout", sx.className)} style={sx.style}>
      {children}
    </HeadlessField>
  );
}

export function Label({ style, children }: LabelProps) {
  return (
    <HeadlessLabel data-slot="label" {...stylex.props(styles.label, style)}>
      {children}
    </HeadlessLabel>
  );
}

export function ErrorMessage({ style, children }: LabelProps) {
  return (
    <HeadlessDescription data-slot="error" {...stylex.props(styles.error, style)}>
      {children}
    </HeadlessDescription>
  );
}
