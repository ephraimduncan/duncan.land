import { createFileRoute, notFound } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { Mdx, prose, proseArticle } from "../../../../components/mdx-components";
import { ReferenceLink } from "@/components/reference-link";
import { allPosts } from "content-collections";
import { colors } from "../../../styles/tokens.stylex";
import "../routes-theme.css";

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
        <article {...proseArticle(stylex.props(prose.article, styles.article))}>
          <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.titleRow)}>
              <h1 {...stylex.props(styles.title)}>{post.title}</h1>
              {post.reference && (
                <a
                  href="#references"
                  {...stylex.props(styles.referenceLink)}
                  title="Go to reference"
                >
                  [1]
                </a>
              )}
            </div>

            <div {...stylex.props(styles.metaRow)}>
              <p {...stylex.props(styles.meta)}>
                {post.date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p {...stylex.props(styles.meta)}>•</p>

              <p {...stylex.props(styles.meta)}>{post.readTimeMinutes}</p>
            </div>
          </div>
          <Mdx content={mdx} />

          {post.reference && (
            <div id="references" {...stylex.props(styles.references)}>
              <ReferenceLink reference={post.reference} />
            </div>
          )}
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  article: {
    // Longhands: prose.article zeroes padding with longhands, which outrank shorthands.
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
  },
  header: {
    marginBottom: "2.5rem",
  },
  titleRow: {
    display: "flex",
    gap: "0.5rem",
  },
  title: {
    marginBottom: "0.5rem",
    color: "var(--prose-heading)",
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    textWrap: "balance",
  },
  referenceLink: {
    display: "inline-flex",
    width: "1rem",
    height: "1rem",
    alignItems: "center",
    justifyContent: "center",
    color: {
      default: colors.foregroundMuted,
      ":hover": "var(--post-reference-hover)",
    },
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
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
  references: {
    marginTop: "4rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.separator,
    paddingTop: "1rem",
  },
});
