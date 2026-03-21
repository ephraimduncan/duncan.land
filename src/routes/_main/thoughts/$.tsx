import { createFileRoute, notFound } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Mdx } from "@/components/mdx-components";
import { allThoughts } from "content-collections";

export const Route = createFileRoute("/_main/thoughts/$")({
  loader: ({ params }) => {
    const slug = params["_splat"];
    const thought = allThoughts.find((t) => t.slugAsParams === slug);
    if (!thought) throw notFound();
    return thought;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://ephraimduncan.com${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Ephraim Duncan` },
        { property: "og:title", content: loaderData.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        {
          property: "article:published_time",
          content: new Date(loaderData.date).toISOString(),
        },
        { property: "article:author", content: "Ephraim Duncan" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ThoughtPage,
});

function ThoughtPage() {
  const thought = Route.useLoaderData();

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <article className="prose dark:prose-invert leading-8">
          <h1 className="mb-2 font-medium text-2xl">{thought.title}</h1>

          <div className="flex gap-x-2">
            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              {new Date(thought.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              •
            </p>

            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              {thought.readTimeMinutes}
            </p>
          </div>

          <Mdx code={thought.body} />
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
