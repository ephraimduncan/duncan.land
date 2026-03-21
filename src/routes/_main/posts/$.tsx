import { createFileRoute, notFound } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Mdx } from "@/components/mdx-components";
import { ReferenceLink } from "@/components/reference-link";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/_main/posts/$")({
  loader: ({ params }) => {
    const slug = params["_splat"];
    const post = allPosts.find((p) => p.slugAsParams === slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://ephraimduncan.com${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Ephraim Duncan` },
        { name: "description", content: loaderData.description ?? "" },
        { property: "og:title", content: loaderData.title },
        {
          property: "og:description",
          content: loaderData.description ?? "",
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        {
          property: "article:published_time",
          content: new Date(loaderData.date).toISOString(),
        },
        { property: "article:author", content: "Ephraim Duncan" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        {
          name: "twitter:description",
          content: loaderData.description ?? "",
        },
        ...(loaderData.draft
          ? [{ name: "robots", content: "noindex, nofollow" }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();

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
