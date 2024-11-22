import * as FadeIn from "@/components/motion";
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx-components";
import { Metadata } from "next";

interface PostProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
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
    <FadeIn.Container>
      <FadeIn.Item>
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
              <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
                •
              </p>

              <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
                {post.readTimeMinutes}
              </p>
            </div>
          </div>
          <Mdx code={post.body.code} />
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
