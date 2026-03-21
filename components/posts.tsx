import { allPosts, allThoughts } from "content-collections";
import { formatter } from "@/lib/utils";

import { Link as NextViewTransition } from "next-view-transitions";
import React from "react";

type PostCategory = "thoughts" | "posts" | "archive";
type PostListItem = (typeof allPosts)[number] | (typeof allThoughts)[number];

const POST_SECTIONS = {
  thoughts: {
    href: "/thoughts",
    title: "thoughts",
    posts: allThoughts,
  },
  posts: {
    href: "/blog",
    title: "blog",
    posts: allPosts.filter((post) => !post.archived),
  },
  archive: {
    href: "/archive",
    title: "archive",
    posts: allPosts.filter((post) => post.archived),
  },
} satisfies Record<
  PostCategory,
  {
    href: string;
    title: string;
    posts: readonly PostListItem[];
  }
>;

interface PostProps {
  category: PostCategory;
}

function byDateDescending(a: PostListItem, b: PostListItem) {
  return b.date.getTime() - a.date.getTime();
}

export const Posts = ({ category }: PostProps) => {
  const section = POST_SECTIONS[category];
  const posts = [...section.posts].sort(byDateDescending);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <NextViewTransition href={section.href} className="flex justify-between">
        <h2 className="py-2 text-2xl font-medium tracking-tighter dark:text-grey-100">
          {section.title}
        </h2>
      </NextViewTransition>

      {posts.map((post) => {
        return (
          <React.Fragment key={post.slug}>
            <div className="border-border border-t border-grey-900" />
            <NextViewTransition
              href={post.slug}
              className="flex w-full justify-between py-2 dark:text-grey-100"
            >
              <p>{post.title}</p>
              <p className="mt-0 dark:text-grey-100">
                {formatter.date(post.date)}
              </p>
            </NextViewTransition>
          </React.Fragment>
        );
      })}
    </div>
  );
};
