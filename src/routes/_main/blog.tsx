import { createFileRoute, Link } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";

export const Route = createFileRoute("/_main/blog")({
  component: BlogPage,
  head: () => ({
    meta: [{ title: "Blog | Ephraim Duncan" }],
  }),
});

function BlogPage() {
  return (
    <FadeIn.Container className="space-y-8">
      <FadeIn.Item>
        <Posts category="posts" />
      </FadeIn.Item>

      <FadeIn.Item>
        <Link
          to="/archive"
          viewTransition
          className="cursor-pointer text-sm hover:underline decoration-grey-100 hover:decoration-1"
        >
          Archived Posts
        </Link>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
