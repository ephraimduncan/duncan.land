import * as stylex from "@stylexjs/stylex";

import { colors } from "../src/styles/tokens.stylex";

interface ReferenceLinkProps {
  reference: string;
}

export function ReferenceLink({ reference }: ReferenceLinkProps) {
  const urlMatch = reference.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const urlDirectMatch = reference.match(/https?:\/\/[^\s)]+/);

  const url = urlMatch ? urlMatch[2] : urlDirectMatch ? urlDirectMatch[0] : "";
  const textWithoutMarkdown = reference
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\bhttps?:\/\/\S+/g, "");

  return (
    <div {...stylex.props(styles.root)}>
      <span {...stylex.props(styles.index)}>[1]</span> {textWithoutMarkdown}{" "}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link)}>
          {url}
        </a>
      )}
    </div>
  );
}

const styles = stylex.create({
  root: {
    color: colors.foregroundSecondary,
  },
  index: {
    marginRight: "0.5rem",
  },
  link: {
    fontWeight: 400,
    textDecorationLine: "underline",
  },
});
