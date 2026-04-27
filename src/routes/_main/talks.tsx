import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as FadeIn from "@/components/motion";
import { Microphone } from "@/components/ui/Mic";
import { RelativeTime } from "./-relative-time";

const TALKS = [
  {
    title: "How People with Disability Access the Web",
    date: "2023-10-26",
    venue: "Google DevFest Student's Edition (Nairobi, Kenya)",
  },
  {
    title: "Building End-to-End Typesafe APIs with tRPC",
    date: "2023-11-11",
    venue: "CityJS Conference (Lagos, Nigeria)",
  },
] as const;

export const Route = createFileRoute("/_main/talks")({
  component: TalksPage,
  head: () => ({
    meta: [{ title: "Talks | Ephraim Duncan" }],
  }),
});

function TalksPage() {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-medium text-balance">
            <Microphone size={19} />
            Talks
          </div>

          <div className="space-y-8">
            {TALKS.map((talk) => (
              <article key={talk.title}>
                <div className="flex justify-between items-start">
                  <h2 className="mb-1 text-lg text-balance">{talk.title}</h2>
                  <Suspense fallback={<span className="text-sm">{talk.date}</span>}>
                    <RelativeTime date={talk.date} />
                  </Suspense>
                </div>
                <p className="text-sm text-grey-400">{talk.venue}</p>
              </article>
            ))}
          </div>
        </section>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
