import { Slot } from "@radix-ui/react-slot";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";

import { colors } from "../src/styles/tokens.stylex";

const styles = stylex.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.separator,
    borderRadius: "0.375rem",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "1.25rem",
    position: "relative",
    textAlign: "left",
    width: "100%",
  },
});

type CardProps = Omit<ComponentPropsWithRef<"div">, "className" | "style"> & {
  asChild?: boolean;
  style?: StyleXStyles;
};

function Card({ asChild, ref, style, ...props }: CardProps) {
  const Component = asChild ? Slot : "div";

  return <Component ref={ref} {...stylex.props(styles.card, style)} {...props} />;
}

export { Card };
