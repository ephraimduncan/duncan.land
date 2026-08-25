import { createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";

export const Route = createFileRoute("/_main/thoughts/")({
  component: ThoughtsPage,
  head: () => ({
    meta: [{ title: "Thoughts | Ephraim Duncan" }],
  }),
});

function ThoughtsPage() {
  return (
    <FadeIn.Container style={styles.list}>
      <FadeIn.Item>
        <Posts category="thoughts" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});
