import { createFileRoute } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";

export const Route = createFileRoute("/_main/archive")({
  component: ArchivePage,
  head: () => ({
    meta: [{ title: "Archive | Ephraim Duncan" }],
  }),
});

function ArchivePage() {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <Posts category="archive" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
