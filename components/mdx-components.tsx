import { Code } from "bright";
import React, { ClassAttributes, HTMLAttributes } from "react";
import type { MDXContent } from "mdx/types";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

const components = {
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img loading="lazy" {...props} />,
  pre: Code,
  h1: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => <h1 {...props} className="text-2xl" />,

  h2: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => <h2 {...props} className="text-xl font-normal my-4" />,

  h3: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => <h3 {...props} className="text-lg font-normal my-4" />,

  em: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLElement> &
      HTMLAttributes<HTMLElement>,
  ) => <em {...props} className="italic" />,

  a: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLAnchorElement> &
      HTMLAttributes<HTMLAnchorElement>,
  ) => <a {...props} target="_blank" rel="noopener noreferrer" />,

  ul: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLUListElement> &
      HTMLAttributes<HTMLUListElement>,
  ) => <ul {...props} className="list-disc list-inside" />,

  li: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLLIElement> &
      HTMLAttributes<HTMLLIElement>,
  ) => <li {...props} className="marker:text-current" />,
};

interface MdxProps {
  content: MDXContent;
}

export function Mdx({ content: Content }: MdxProps) {
  return <Content components={components} />;
}
