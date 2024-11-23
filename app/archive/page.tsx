import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";

export default function ArchivePage() {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <Posts category="archive" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
