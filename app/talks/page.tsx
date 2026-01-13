import * as FadeIn from "@/components/motion";
import { Microphone } from "@/components/ui/Mic";
import { formatDistance } from "date-fns";
import { cacheLife } from "next/cache";

const TALKS = [
  {
    talk: "How People with Disability Access the Web",
    date: "2023-10-26",
    event: "Google DevFest Student's Edition",
    location: "Nairobi, Kenya",
  },
  {
    talk: "Building End-to-End Typesafe APIs with tRPC",
    date: "2023-11-11",
    event: "CityJS Conference",
    location: "Lagos, Nigeria",
  },
];

export default async function TalksPage() {
  'use cache';
  cacheLife('days');

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <div>
          <span className="text-xl flex gap-2 items-center my-6 cursor-pointer">
            <Microphone size={19} />
            Talks
          </span>

          {TALKS.map((talk, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-start">
                <h2 className="text-lg  decoration-grey-100 hover:decoration-1 mb-1">
                  {talk.talk}
                </h2>
                <span className="text-sm">
                  {formatDistance(new Date(talk.date), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {talk.location && (
                <div className="flex gap-2">
                  <p className="text-sm text-grey-400">
                    {talk.event} ({talk.location})
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
