import { allThoughts } from "@/.contentlayer/generated";
import * as FadeIn from "@/components/motion";
import { format } from "date-fns";
import Link from "next/link";

export default function BlogPage() {
  return (
    <FadeIn.Container className="space-y-4">
      <FadeIn.Item>
        {allThoughts
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((post) => (
            <article key={post._id} className="">
              <Link href={post.slug} className="flex gap-8 items-center">
                <span className="text-base">
                  {format(new Date(post.date), "yyyy-MM-dd")}
                </span>

                <h2 className="t hover:underline decoration-grey-100 hover:decoration-1 mb-1">
                  {post.title}
                </h2>
              </Link>
            </article>
          ))}
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
