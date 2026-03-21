import { createFileRoute } from "@tanstack/react-router";
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
    <FadeIn.Container className="space-y-4">
      <FadeIn.Item>
        <Posts category="thoughts" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
