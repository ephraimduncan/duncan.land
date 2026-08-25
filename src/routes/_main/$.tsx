import { createFileRoute, notFound } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { Mdx, prose, proseArticle } from "../../../components/mdx-components";
import { allPages } from "content-collections";

export const Route = createFileRoute("/_main/$")({
  loader: ({ params }) => {
    const slug = params["_splat"];
    const page = allPages.find((p) => p.slugAsParams === slug);
    if (!page) throw notFound();
    const { mdx: _mdx, content: _content, ...pageData } = page;
    return pageData;
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
  const mdx = allPages.find((p) => p.slugAsParams === page.slugAsParams)?.mdx;
  if (!mdx) throw notFound();

  return (
    <FadeIn.Container>
      <article {...proseArticle(stylex.props(prose.article))}>
        <FadeIn.Item>
          <div>
            <h1 {...stylex.props(styles.title)}>{page.title}</h1>
            {page.description && <p {...stylex.props(styles.description)}>{page.description}</p>}
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <Mdx content={mdx} />
        </FadeIn.Item>
      </article>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  title: {
    color: "var(--prose-heading)",
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 400,
  },
  description: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: "1.25rem",
    lineHeight: "1.75rem",
  },
});
