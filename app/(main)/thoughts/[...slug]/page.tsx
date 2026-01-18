import * as FadeIn from "@/components/motion";
import { allThoughts } from "content-collections";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx-components";
import { Metadata } from "next";

interface ThoughtsProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getThoughtsFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/");
  const thought = allThoughts.find((thought) => thought.slugAsParams === slug);

  if (!thought) {
    return null;
  }

  return thought;
}

export async function generateMetadata({
  params,
}: ThoughtsProps): Promise<Metadata> {
  const thought = await getThoughtsFromParams(await params);

  if (!thought) {
    return {};
  }

  const url = `https://ephraimduncan.com${thought.slug}`;

  return {
    title: thought.title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: thought.title,
      type: "article",
      url,
      publishedTime: new Date(thought.date).toISOString(),
      authors: ["Ephraim Duncan"],
    },
    twitter: {
      card: "summary_large_image",
      title: thought.title,
    },
  };
}

export async function generateStaticParams() {
  return allThoughts.map((thought) => ({
    slug: thought.slugAsParams.split("/"),
  }));
}

export default async function ThoughtPage({ params }: ThoughtsProps) {
  const thought = await getThoughtsFromParams(await params);

  if (!thought) {
    notFound();
  }

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <article className="prose dark:prose-invert leading-8">
          <h1 className="mb-2 font-medium text-2xl">{thought.title}</h1>

          <div className="flex gap-x-2">
            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              {new Date(thought.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              •
            </p>

            <p className="text-base mt-0 text-slate-700 dark:text-slate-200">
              {thought.readTimeMinutes}
            </p>
          </div>

          <Mdx code={thought.body} />
        </article>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
