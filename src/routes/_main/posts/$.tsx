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
    const { mdx: _mdx, content: _content, ...postData } = post;
    return postData;
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
        ...(loaderData.draft ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  const mdx = allPosts.find((p) => p.slugAsParams === post.slugAsParams)?.mdx;
  if (!mdx) throw notFound();

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <article className="py-6 prose dark:prose-invert">
          <div className="mb-10">
            <div className="flex gap-2">
              <h1 className="mb-2 text-2xl font-medium tracking-tight text-balance">
                {post.title}
              </h1>
              {post.reference && (
                <a
                  href="#references"
                  className="inline-flex size-4 items-center justify-center text-sm font-medium text-foreground-muted hover:text-grey-900 dark:hover:text-grey-200"
                  title="Go to reference"
                >
                  [1]
                </a>
              )}
            </div>

            <div className="flex gap-x-2">
              <p className="text-base mt-0 text-foreground-secondary">
                {post.date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-base mt-0 text-foreground-secondary">•</p>

              <p className="text-base mt-0 text-foreground-secondary">{post.readTimeMinutes}</p>
            </div>
          </div>
          <Mdx content={mdx} />

          {post.reference && (
            <div id="references" className="mt-16 pt-4 border-t border-separator">
              <ReferenceLink reference={post.reference} />
            </div>
          )}
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
