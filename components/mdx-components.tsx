import { Code } from "bright";
import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import { ClassAttributes, HTMLAttributes } from "react";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

const components = {
  Image,
  pre: Code,
  h1: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h1 {...props} className="text-2xl" />,

  h2: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h2 {...props} className="text-xl font-medium" />,

  h3: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h3 {...props} className="text-lg font-medium" />,

  em: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLElement> &
      HTMLAttributes<HTMLElement>
  ) => <em {...props} className="italic text-lg" />,

  a: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLAnchorElement> &
      HTMLAttributes<HTMLAnchorElement>
  ) => <a {...props} target="_blank" rel="noopener noreferrer" />,

  ul: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLUListElement> &
      HTMLAttributes<HTMLUListElement>
  ) => <ul {...props} className="list-disc list-inside" />,

  li: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLLIElement> &
      HTMLAttributes<HTMLLIElement>
  ) => <li {...props} className="marker:text-current" />,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
}
