import * as FadeIn from "@/components/motion";
import { Posts } from "@/components/posts";

export default function ThoughtsPage() {
  return (
    <FadeIn.Container className="space-y-4">
      <FadeIn.Item>
        <Posts category="thoughts" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
