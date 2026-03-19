import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";
import { Link as NextViewTransition } from "next-view-transitions";

export default function BlogPage() {
  return (
    <FadeIn.Container className="space-y-8">
      <FadeIn.Item>
        <Posts category="posts" />
      </FadeIn.Item>

      <FadeIn.Item>
        <NextViewTransition
          href="/archive"
          className="cursor-pointer text-sm hover:underline decoration-grey-100 hover:decoration-1"
        >
          Archived Posts
        </NextViewTransition>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
