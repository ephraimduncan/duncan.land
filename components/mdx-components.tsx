import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Code } from "bright";
import { ClassAttributes, HTMLAttributes } from "react";

Code.theme = {
    dark: "github-dark",
    light: "github-light",
    lightSelector: "html.light",
};

const components = {
    Image,
    pre: Code,
    h1: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => (
        <h1 {...props} className="text-2xl" />
    ),

    h2: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => (
        <h2 {...props} className="text-xl" />
    ),

    h3: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => (
        <h3 {...props} className="text-lg" />
    ),
};

interface MdxProps {
    code: string;
}

export function Mdx({ code }: MdxProps) {
    const Component = useMDXComponent(code);

    return <Component components={components} />;
}
