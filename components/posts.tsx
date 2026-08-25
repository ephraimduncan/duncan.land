import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { allPosts, allThoughts } from "content-collections";

import { formatter } from "@/lib/utils";
import { colors } from "../src/styles/tokens.stylex";
import "./site-theme.css";

type PostCategory = "thoughts" | "posts" | "archive";
type PostListItem = (typeof allPosts)[number] | (typeof allThoughts)[number];

const POST_SECTIONS = {
  thoughts: {
    href: "/thoughts",
    title: "thoughts",
    posts: allThoughts,
  },
  posts: {
    href: "/blog",
    title: "blog",
    posts: allPosts.filter((post) => !post.archived),
  },
  archive: {
    href: "/archive",
    title: "archive",
    posts: allPosts.filter((post) => post.archived),
  },
} satisfies Record<
  PostCategory,
  {
    href: string;
    title: string;
    posts: readonly PostListItem[];
  }
>;

interface PostProps {
  category: PostCategory;
}

export const Posts = ({ category }: PostProps) => {
  const section = POST_SECTIONS[category];
  const posts = section.posts.toSorted((a, b) => b.date.getTime() - a.date.getTime());

  if (posts.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(styles.root)}>
      <Link to={section.href} {...stylex.props(styles.headingLink)}>
        <h2 {...stylex.props(styles.heading)}>{section.title}</h2>
      </Link>

      <div>
        {posts.map((post) => (
          <Link key={post.slug} to={post.slug} {...stylex.props(styles.item)}>
            <p {...stylex.props(styles.title)}>{post.title}</p>
            <p {...stylex.props(styles.date)}>{formatter.date(post.date)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  headingLink: {
    display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    paddingBlock: "0.5rem",
    color: "var(--post-list-text)",
    fontSize: "1.5rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    lineHeight: "2rem",
    textWrap: "balance",
  },
  item: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    gap: "1rem",
    borderTopWidth: {
      default: "1px",
      ":first-child": 0,
    },
    borderStyle: "solid",
    borderColor: colors.separator,
    paddingBlock: "0.75rem",
    color: "var(--post-list-text)",
  },
  title: {
    textWrap: "pretty",
  },
  date: {
    flexShrink: 0,
    color: colors.foregroundMuted,
  },
});
