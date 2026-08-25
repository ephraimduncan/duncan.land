import * as stylex from "@stylexjs/stylex";

import "../site-theme.css";
import { Arrow } from "./Arrow";

export function ExternalLink({ href, text }: { href: string; text: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.root)}>
      <span {...stylex.props(styles.content)}>
        <Arrow size={20} />
        <span>{text}</span>
      </span>
    </a>
  );
}

const styles = stylex.create({
  root: {
    display: {
      default: "block",
      "@media (min-width: 640px)": "inline-block",
    },
    marginRight: {
      default: 0,
      "@media (min-width: 640px)": "0.5rem",
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    marginBlock: "0.5rem",
    color: {
      default: "var(--external-link-text)",
      ":hover": "var(--external-link-text-hover)",
    },
  },
});
