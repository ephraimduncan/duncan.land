import * as FadeIn from "@/components/motion";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx-components";
import { ReferenceLink } from "@/components/reference-link";
import { Metadata } from "next";

interface PostProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPostFromParams(params: { slug: string[] }) {
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
  const post = await getPostFromParams(await params);

  if (!post) {
    return {};
  }

  const url = `https://ephraimduncan.com${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Ephraim Duncan"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    ...(post.draft && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(await params);

  if (!post) {
    notFound();
  }

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <article className="py-6 prose dark:prose-invert">
          <div className="mb-10">
            <div className="flex gap-2">
              <h1 className="mb-2 text-2xl">{post.title}</h1>
              {post.reference && (
                <a
                  href="#references"
                  className="inline-flex items-center justify-center w-4 h-4 text-sm, font-medium text-grey-600 hover:text-grey-900 dark:text-grey-400 dark:hover:text-grey-200 transition-colors"
                  title="Go to reference"
                >
                  [1]
                </a>
              )}
            </div>

            <div className="flex gap-x-2">
              <p className="text-base mt-0 text-grey-700 dark:text-grey-200">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-base mt-0 text-grey-700 dark:text-grey-200">
                •
              </p>

              <p className="text-base mt-0 text-grey-700 dark:text-grey-200">
                {post.readTimeMinutes}
              </p>
            </div>
          </div>
          <Mdx code={post.body} />

          {post.reference && (
            <div
              id="references"
              className="mt-16 pt-4 border-t border-grey-200 dark:border-grey-800"
            >
              <ReferenceLink reference={post.reference} />
            </div>
          )}
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
