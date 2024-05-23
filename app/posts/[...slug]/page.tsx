import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";
import Link from "next/link";
import { MotionDiv } from "@/components/motion";

interface PostProps {
    params: {
        slug: string[];
    };
}

const variant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

async function getPostFromParams(params: PostProps["params"]) {
    const slug = params?.slug?.join("/");
    const post = allPosts.find((post) => post.slugAsParams === slug);

    if (!post) {
        return null;
    }

    return post;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const post = await getPostFromParams(params);

    if (!post) {
        return {};
    }

    return {
        title: post.title,
        description: post.description,
    };
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
    return allPosts.map((post) => ({
        slug: post.slugAsParams.split("/"),
    }));
}

export default async function PostPage({ params }: PostProps) {
    const post = await getPostFromParams(params);

    if (!post) {
        notFound();
    }

    return (
        <div>
            <MotionDiv initial="hidden" animate="visible" variants={variant}>
                <article className="py-6 prose dark:prose-invert">
                    <div className="mb-10">
                        <h1 className="mb-2 text-2xl">{post.title}</h1>

                        <div className="flex gap-x-2">
                            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">•</p>

                            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">{post.readTimeMinutes}</p>
                        </div>
                    </div>
                    <Mdx code={post.body.code} />
                </article>
            </MotionDiv>
        </div>
    );
}
