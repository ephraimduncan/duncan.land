import * as stylex from "@stylexjs/stylex";
import { Code } from "bright";
import type { MDXContent } from "mdx/types";
import type { ComponentPropsWithoutRef, JSX } from "react";
import clsx from "clsx";

import "./prose-theme.css";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

export const prose = stylex.create({
  article: {
    color: "var(--prose-body)",
    fontFamily:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "normal",
    lineHeight: 1.75,
    maxWidth: "65ch",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

export interface ProseArticleProps {
  className?: string;
  "data-style-src"?: string;
  style?: Readonly<Record<string, string | number>>;
}

// Merges in the plain class that scoped prose rules (bright's <pre>) hang on.
export function proseArticle(sx: ProseArticleProps): ProseArticleProps {
  return { ...sx, className: clsx("prose-article", sx.className) };
}

const styles = stylex.create({
  heading: {
    color: "var(--prose-heading)",
    fontStyle: "normal",
  },
  h1: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: "1.75rem",
    marginTop: "2.5rem",
    marginBottom: "0.75rem",
  },
  h2: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: "1.75rem",
    marginTop: "2rem",
    marginBottom: "0.5rem",
  },
  h3: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: "1.5rem",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  h4: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  h5: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  h6: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  p: {
    marginTop: "1.25em",
    marginBottom: { default: "1.25em", ":last-child": "0" },
  },
  em: {
    color: "var(--prose-body)",
    fontFamily: "Newsreader, serif",
    fontStyle: "italic",
    fontWeight: 400,
  },
  strong: {
    fontWeight: 600,
  },
  link: {
    color: "var(--prose-link)",
    fontWeight: 500,
    textDecorationLine: "underline",
  },
  list: {
    color: "var(--prose-body)",
    lineHeight: 1.75,
    marginTop: "1.25em",
    marginBottom: { default: "1.25em", ":last-child": "0" },
    paddingLeft: "1.625em",
  },
  ul: {
    listStylePosition: "inside",
    listStyleType: "disc",
  },
  ol: {
    listStylePosition: "outside",
    listStyleType: "decimal",
  },
  li: {
    color: "var(--prose-body)",
    lineHeight: 1.75,
    marginTop: "0.5em",
    marginBottom: "0.5em",
    paddingLeft: "0.375em",
    "::marker": {
      color: "currentColor",
    },
  },
  code: {
    backgroundColor: "transparent",
    color: "var(--prose-inline-code)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.75,
    "::before": {
      content: '"`"',
    },
    "::after": {
      content: '"`"',
    },
  },
  blockquote: {
    borderInlineStartColor: "var(--prose-quote-border)",
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: "0.25rem",
    color: "var(--prose-quote-text)",
    fontStyle: "italic",
    fontWeight: 500,
    lineHeight: 1.75,
    marginTop: "1.6em",
    marginBottom: { default: "1.6em", ":last-child": "0" },
    paddingInlineStart: "1rem",
    quotes: '"“" "”" "‘" "’"',
  },
  image: {
    display: "block",
    height: "auto",
    marginTop: "2em",
    marginBottom: { default: "2em", ":last-child": "0" },
    maxWidth: "100%",
    verticalAlign: "middle",
  },
  hr: {
    borderTopColor: "var(--prose-rule)",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    height: 0,
    marginTop: "3em",
    marginBottom: { default: "3em", ":last-child": "0" },
  },
  figure: {
    marginTop: "2em",
    marginBottom: { default: "2em", ":last-child": "0" },
  },
  figcaption: {
    color: "var(--prose-caption)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    marginTop: "0.75rem",
  },
  table: {
    borderCollapse: "collapse",
    color: "var(--prose-body)",
    fontSize: "0.875rem",
    lineHeight: 1.7142857,
    marginTop: "2em",
    marginBottom: { default: "2em", ":last-child": "0" },
    tableLayout: "auto",
    width: "100%",
  },
  thead: {
    borderBottomColor: "var(--prose-table-head-border)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
  tr: {
    borderBottomColor: "var(--prose-table-row-border)",
    borderBottomStyle: "solid",
    borderBottomWidth: {
      default: "1px",
      ":last-child": 0,
    },
  },
  th: {
    color: "var(--prose-heading)",
    fontWeight: 600,
    paddingTop: 0,
    paddingRight: {
      default: "0.5rem",
      ":last-child": 0,
    },
    paddingBottom: "0.5rem",
    paddingLeft: {
      default: "0.5rem",
      ":first-child": 0,
    },
    textAlign: "start",
    verticalAlign: "bottom",
  },
  td: {
    paddingTop: "0.5rem",
    paddingRight: {
      default: "0.5rem",
      ":last-child": 0,
    },
    paddingBottom: "0.5rem",
    paddingLeft: {
      default: "0.5rem",
      ":first-child": 0,
    },
    verticalAlign: "baseline",
  },
});

type Props<Tag extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<Tag>;

const components = {
  Image,
  img: Image,
  pre: Code,
  h1: (props: Props<"h1">) => <h1 {...props} {...stylex.props(styles.heading, styles.h1)} />,
  h2: (props: Props<"h2">) => <h2 {...props} {...stylex.props(styles.heading, styles.h2)} />,
  h3: (props: Props<"h3">) => <h3 {...props} {...stylex.props(styles.heading, styles.h3)} />,
  h4: (props: Props<"h4">) => <h4 {...props} {...stylex.props(styles.heading, styles.h4)} />,
  h5: (props: Props<"h5">) => <h5 {...props} {...stylex.props(styles.heading, styles.h5)} />,
  h6: (props: Props<"h6">) => <h6 {...props} {...stylex.props(styles.heading, styles.h6)} />,
  p: (props: Props<"p">) => <p {...props} {...stylex.props(styles.p)} />,
  em: (props: Props<"em">) => <em {...props} {...stylex.props(styles.em)} />,
  strong: (props: Props<"strong">) => (
    <strong {...props} {...stylex.props(styles.heading, styles.strong)} />
  ),
  a: (props: Props<"a">) => (
    <a {...props} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link)} />
  ),
  ul: (props: Props<"ul">) => <ul {...props} {...stylex.props(styles.list, styles.ul)} />,
  ol: (props: Props<"ol">) => <ol {...props} {...stylex.props(styles.list, styles.ol)} />,
  li: (props: Props<"li">) => <li {...props} {...stylex.props(styles.li)} />,
  code: (props: Props<"code">) => <code {...props} {...stylex.props(styles.code)} />,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote {...props} {...stylex.props(styles.blockquote)} />
  ),
  hr: (props: Props<"hr">) => <hr {...props} {...stylex.props(styles.hr)} />,
  figure: (props: Props<"figure">) => <figure {...props} {...stylex.props(styles.figure)} />,
  figcaption: (props: Props<"figcaption">) => (
    <figcaption {...props} {...stylex.props(styles.figcaption)} />
  ),
  table: (props: Props<"table">) => <table {...props} {...stylex.props(styles.table)} />,
  thead: (props: Props<"thead">) => <thead {...props} {...stylex.props(styles.thead)} />,
  tr: (props: Props<"tr">) => <tr {...props} {...stylex.props(styles.tr)} />,
  th: (props: Props<"th">) => <th {...props} {...stylex.props(styles.th)} />,
  td: (props: Props<"td">) => <td {...props} {...stylex.props(styles.td)} />,
};

interface MdxProps {
  content: MDXContent;
}

export function Mdx({ content: Content }: MdxProps) {
  return <Content components={components} />;
}

function Image(props: Props<"img">) {
  return <img loading="lazy" {...props} alt={props.alt ?? ""} {...stylex.props(styles.image)} />;
}
