import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { colors } from "../../../styles/tokens.stylex";

export function GuestbookCTA() {
  return (
    <Link {...stylex.props(styles.link)} to="/guestbook">
      Sign the guestbook
    </Link>
  );
}

const styles = stylex.create({
  link: {
    position: "fixed",
    right: "calc(1rem + env(safe-area-inset-right))",
    top: "calc(1rem + env(safe-area-inset-top))",
    zIndex: 50,
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.separator,
    backgroundColor: {
      default: "color-mix(in oklab, var(--surface-raised) 90%, transparent)",
      ":hover": "var(--wall-cta-hover)",
    },
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    color: colors.foreground,
    boxShadow: "0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)",
    backdropFilter: "blur(4px)",
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
});
