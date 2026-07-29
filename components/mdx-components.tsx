import { Code } from "bright";
import React, { ClassAttributes, HTMLAttributes } from "react";
import type { MDXContent } from "mdx/types";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

const components = {
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img loading="lazy" {...props} alt={props.alt ?? ""} />
  ),
  pre: Code,
  h1: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h1 {...props} className="text-xl font-semibold mt-10 mb-3">
      {props.children}
    </h1>
  ),

  h2: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h2 {...props} className="text-lg font-semibold mt-8 mb-2">
      {props.children}
    </h2>
  ),

  h3: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h3 {...props} className="text-base font-semibold mt-6 mb-2">
      {props.children}
    </h3>
  ),

  h4: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h4 {...props} className="text-base font-medium mt-6 mb-2">
      {props.children}
    </h4>
  ),

  h5: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h5 {...props} className="text-sm font-medium mt-6 mb-2">
      {props.children}
    </h5>
  ),

  h6: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>,
  ) => (
    <h6 {...props} className="text-sm font-medium mt-6 mb-2">
      {props.children}
    </h6>
  ),

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
