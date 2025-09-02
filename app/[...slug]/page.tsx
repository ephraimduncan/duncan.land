import * as FadeIn from "@/components/motion";
import { allPages } from "contentlayer/generated";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx-components";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPageFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/");
  const page = allPages.find((page) => page.slugAsParams === slug);

  if (!page) {
    return null;
  }

  return page;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(await params);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }));
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(await params);

  if (!page) {
    notFound();
  }

  return (
    <FadeIn.Container>
      <article className=" prose dark:prose-invert">
        <FadeIn.Item>
          <div>
            <h1 className="text-2xl font-normal">{page.title}</h1>
            {page.description && (
              <p className="text-xl my-0">{page.description}</p>
            )}
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <Mdx code={page.body.code} />
        </FadeIn.Item>
      </article>
    </FadeIn.Container>
  );
}
