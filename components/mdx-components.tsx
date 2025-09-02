import { Code } from "bright";
import { MDXContent } from "@content-collections/mdx/react";
import Image from "next/image";
import React, { ClassAttributes, HTMLAttributes } from "react";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

const components = {
  Image,
  pre: Code,
  h1: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h1 {...props} className="text-2xl" />,

  h2: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h2 {...props} className="text-xl font-normal my-4" />,

  h3: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h3 {...props} className="text-lg font-normal my-4" />,

  em: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLElement> &
      HTMLAttributes<HTMLElement>
  ) => <em {...props} className="italic text-lg" />,

  a: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLAnchorElement> &
      HTMLAttributes<HTMLAnchorElement>
  ) => <a {...props} target="_blank" rel="noopener noreferrer" />,

  ul: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLUListElement> &
      HTMLAttributes<HTMLUListElement>
  ) => <ul {...props} className="list-disc list-inside" />,

  li: (
    props: React.JSX.IntrinsicAttributes &
      ClassAttributes<HTMLLIElement> &
      HTMLAttributes<HTMLLIElement>
  ) => <li {...props} className="marker:text-current" />,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  return <MDXContent code={code} components={components} />;
}
