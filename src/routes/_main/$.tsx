import { createFileRoute, notFound } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Mdx } from "@/components/mdx-components";
import { allPages } from "content-collections";

export const Route = createFileRoute("/_main/$")({
  loader: ({ params }) => {
    const slug = params["_splat"];
    const page = allPages.find((p) => p.slugAsParams === slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://ephraimduncan.com${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Ephraim Duncan` },
        {
          name: "description",
          content: loaderData.description ?? "",
        },
        { property: "og:title", content: loaderData.title },
        {
          property: "og:description",
          content: loaderData.description ?? "",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        {
          name: "twitter:description",
          content: loaderData.description ?? "",
        },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PagePage,
});

function PagePage() {
  const page = Route.useLoaderData();

  return (
    <FadeIn.Container>
      <article className=" prose dark:prose-invert">
        <FadeIn.Item>
          <div>
            <h1 className="text-2xl font-normal">{page.title}</h1>
            {page.description && (
              <p className="text-xl my-0">{page.description}</p>
            )}
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <Mdx code={page.body} />
        </FadeIn.Item>
      </article>
    </FadeIn.Container>
  );
}
