import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";
import { Link as NextViewTransition } from "next-view-transitions";

export default function BlogPage() {
  return (
    <FadeIn.Container className="space-y-4">
      <FadeIn.Item>
        <Posts category="posts" />
        <div className="mb-8" />

        <NextViewTransition
          href="archive"
          className="text-sm mt-9 hover:underline decoration-grey-100 hover:decoration-1 cursor-pointer"
        >
          Archived Posts
        </NextViewTransition>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
