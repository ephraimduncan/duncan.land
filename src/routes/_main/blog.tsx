import { createFileRoute, Link } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";
import { colors } from "../../styles/tokens.stylex";

export const Route = createFileRoute("/_main/blog")({
  component: BlogPage,
  head: () => ({
    meta: [{ title: "Blog | Ephraim Duncan" }],
  }),
});

function BlogPage() {
  return (
    <FadeIn.Container style={styles.list}>
      <FadeIn.Item>
        <Posts category="posts" />
      </FadeIn.Item>

      <FadeIn.Item>
        <Link to="/archive" viewTransition {...stylex.props(styles.archiveLink)}>
          Archived posts
        </Link>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  archiveLink: {
    color: colors.foregroundMuted,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    textDecorationThickness: {
      default: "auto",
      ":hover": "1px",
    },
  },
});
