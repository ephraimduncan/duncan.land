import { Link } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";

import { colors } from "../styles/tokens.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "5rem",
    gap: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
  },
  hint: {
    color: colors.foregroundSubtle,
  },
  home: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    textDecorationLine: "underline",
    textUnderlineOffset: "2px",
    textDecorationColor: {
      default: colors.decorationMuted,
      ":hover": colors.decorationMutedHover,
    },
  },
});

export function NotFound() {
  return (
    <div {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>Page not found</h1>
      <p {...stylex.props(styles.hint)}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" {...stylex.props(styles.home)}>
        Go home
      </Link>
    </div>
  );
}
