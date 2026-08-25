import { createFileRoute, notFound } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { Mdx, prose, proseArticle } from "../../../../components/mdx-components";
import { allThoughts } from "content-collections";
import { colors } from "../../../styles/tokens.stylex";

export const Route = createFileRoute("/_main/thoughts/$")({
  loader: ({ params }) => {
    const slug = params["_splat"];
    const thought = allThoughts.find((t) => t.slugAsParams === slug);
    if (!thought) throw notFound();
    const { mdx: _mdx, content: _content, ...thoughtData } = thought;
    return thoughtData;
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
  const mdx = allThoughts.find((t) => t.slugAsParams === thought.slugAsParams)?.mdx;
  if (!mdx) throw notFound();

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <article {...proseArticle(stylex.props(prose.article, styles.article))}>
          <h1 {...stylex.props(styles.title)}>{thought.title}</h1>

          <div {...stylex.props(styles.metaRow)}>
            <p {...stylex.props(styles.meta)}>
              {thought.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p {...stylex.props(styles.meta)}>•</p>

            <p {...stylex.props(styles.meta)}>{thought.readTimeMinutes}</p>
          </div>

          <Mdx content={mdx} />
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  article: {
    lineHeight: "2rem",
  },
  title: {
    marginBottom: "0.5rem",
    color: "var(--prose-heading)",
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
  },
  metaRow: {
    display: "flex",
    columnGap: "0.5rem",
  },
  meta: {
    marginTop: 0,
    marginBottom: "1.25rem",
    color: colors.foregroundSecondary,
    fontSize: "1rem",
    lineHeight: "1.5rem",
  },
});
